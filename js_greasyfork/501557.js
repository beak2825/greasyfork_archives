// ==UserScript==
// @name Mango.Booster.PRESS
// @id Mango.Booster.PRESS
// @version 4.27.19
// @license MIT
// @namespace Violentmonkey Scripts
// @grant none
// @match  *://issa7-prerelease-ru.by.mgo.su/*
// @match  *://192.168.37.150:8388/* 
// @match  *://hd/*
// @match  *://logs.mango.local/*
// @match  *://voip-logviewer-webapp-prod.ru.mgo.su/* 
// @match  *://redmine.mango.local/*
// @match  *://192.168.42.55:8081/*
// @match  *://creatio/*
// @match  *://creatio.corp.mango.ru/*
// @match  *://bpmprod01-msk.corp.mango.ru/*
// @match  *://bpmprod02-msk.corp.mango.ru/*
// @match  *://192.168.79.10/*
// @match  *://jira.ru.mgo.su/*




// @description  Bobrovskih A.
// @copyright      2017, Bobrovskih A.
// @downloadURL https://update.greasyfork.org/scripts/501557/MangoBoosterPRESS.user.js
// @updateURL https://update.greasyfork.org/scripts/501557/MangoBoosterPRESS.meta.js
// ==/UserScript==

// TODO Не забывать для тестовой версии указывать @name, @id Mango.BoosterTest, а для боевой возвращать Mango.Booster
// TODO Не забывать возвращать боевые match для booster_environment.bpmSet
// TODO Это боевые match для booster_environment.bpmSet:
//   *://creatio/*
//   *://creatio.corp.mango.ru/*
//   *://bpmprod01-msk.corp.mango.ru/*
//   *://bpmprod02-msk.corp.mango.ru/*
//   *://192.168.79.10/*
// TODO Это тестовый match для booster_environment.bpmSet:
//   *://192.168.10.11/*
// TODO Не забывать возвращать боевые match для booster_environment.lk
// TODO Это боевые match для booster_environment.lk:
//  *://lk.mango-office.ru/*
// TODO Это тестовый match для booster_environment.lk (но можно менять этот адрес под свои задачи):
//  *://issa7-234811-dev-ru.by.mgo.su/*

//---------------------------------------------------------------------------------------------------------------------------------------
// GLOBAL

// TODO Не забывать указывать prod в currentEnvironment перед релизом новой версии
// TODO Могут быть test и prod, а если указано любое другое значение, то это dev
const currentEnvironment = "prod";

const booster_environment = {};

if (currentEnvironment === "prod") {
  booster_environment.MA_WORK_NODE_URL = "https://testairchat.mangotele.com:8039";
  booster_environment.bpmSet = ["creatio", "creatio.corp.mango.ru", "bpmprod01-msk.corp.mango.ru", "bpmprod02-msk.corp.mango.ru", "192.168.79.10", "redmine.mango.local", "jira.ru.mgo.su"];
  booster_environment.lk = {base: "issa7-prerelease-ru.by.mgo.su"};
  booster_environment.DA = 'https://testairchat.mangotele.com:2740'; //Базовая ссылка на анализатор дампов
} else if (currentEnvironment === "test") {
  booster_environment.MA_WORK_NODE_URL = "https://testairchat.mangotele.com:8038";
  booster_environment.bpmSet = ["192.168.10.11"];
  booster_environment.lk = {base: "issa7-234811-dev-ru.by.mgo.su"};
  booster_environment.DA = 'https://testairchat.mangotele.com:2739'; //Базовая ссылка на анализатор дампов
} else {
  booster_environment.MA_WORK_NODE_URL = "https://testairchat.mangotele.com:8038";
  booster_environment.bpmSet = ["192.168.10.11"];
  booster_environment.lk = {base: "issa7-234811-dev-ru.by.mgo.su"};
  booster_environment.DA = 'https://localhost:4200'; //Базовая ссылка на анализатор дампов
}

/** режим отладки */
const DEBUG = false;
const VERSION = '4.15.15';

const PM = 'http://192.168.41.60:8080';
const AP = 'http://192.168.42.55:8081';
const MM = 'http://mango-monitor.mango.local';
const MMAPI = 'http://voip-monitor.by.mgo.su:18080';
const LO = 'http://logs.mango.local';
const VLO = 'http://voip-logviewer-webapp-prod.ru.mgo.su';  
const WA = 'http://192.168.37.150:8388'; 
const BACKEND = 'http://192.168.41.60:9090';

/** урл параметры в виде объекта */
const QS = (() => {
    const search = window.location.search.substr(1);
    return search.split("&").reduce((acum, item) => {
        const [k, v] = item.split("=");
        const key = decodeURIComponent(k);
        const value = decodeURIComponent(v);
        acum[key] = value;
        return acum;
    }, {});
})();

const log = DEBUG
    ? console.log
    : () => { };

//---------------------------------------------------------------------------------------------------------------------------------------
// ЛИЧНЫЙ КАБИНЕТ


/** прослушивает xhr запросы */
class XHRListener {
    static overrideSend(callback) {
        var oldSend, i;
        if (XMLHttpRequest.callbacks) {
            XMLHttpRequest.callbacks.push(callback);
        } else {
            XMLHttpRequest.callbacks = [callback];
            oldSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function () {
                for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                    XMLHttpRequest.callbacks[i](this);
                }
                oldSend.apply(this, arguments);
            }
        }
    }

    /**
     * @param {any} urlPattern regexp для урла
     * @param {function} callback колбэк функция
     */
    static on(urlPattern, callback) {
        this.overrideSend((xhr) => {
            const temp = xhr.onload;
            xhr.onload = function () {
                if (temp) {
                    temp.apply(this, arguments);
                }
                if (!urlPattern.test(xhr.responseURL)) return;

                const url = xhr.responseURL;
                const text = xhr.responseText;

                let json;
                try {
                    json = JSON.parse(text);
                } catch (error) {

                }
                callback({
                    url,
                    text,
                    json
                });
            }
        });
    }
}

class Statistic {
    /**
     * Отправляет стату на сервер
     * @param {string} name название
     * @param {number} count количество
     */
    static send(action, count = 1) {
        if (DEBUG) {
            action = 'dev:' + action;
        }
        const base = BACKEND + '/booster/count';
        const params = '?action=' + action + '&count=' + count + '&v=' + VERSION;
        const img = document.createElement('img');
        img.src = base + params;
    }
}

function addHandlerChangePage() {
    if (!$.ajaxCurrentUrl)
        $.ajaxCurrentUrl = function () {
            return window.location.pathname
        };

    $.ajaxPreload = function (show) {
        if (typeof show == 'undefined' || show) {
            $.fancybox.showActivity();
        } else {
            $.fancybox.hideActivity();
            lkModule();
        }
    }
}

function whenShemeOpen() {
    var isDesirePage = /call-fwd-settings[/]overview/.test($.ajaxCurrentUrl()) || /call-fwd-settings$/.test($.ajaxCurrentUrl());
    if (!isDesirePage)
        return;
    if (!$('*').is('#id-profile'))
        return;

    function buildGroupLink() {
        if (!isDesirePage)
            return;
        if (document.getElementsByClassName('groupLink').length > 0)
            return;
        var forwardColl = document.getElementsByClassName('g-link target');
        for (i = 0; i < forwardColl.length; i++) {
            if (forwardColl[i].innerText.includes('группу:')) {
                var groupID = forwardColl[i].parentElement.querySelector('input[name="target[id]"]').value;
                var groupLink = document.createElement('a');
                groupLink.href = window.location.origin + '/' + Ics.accountId + '/' + Ics.productId + '/members/grouped?id=' + groupID;
                groupLink.onclick = function () {
                    this.style.opacity = .3;
                };
                groupLink.target = '_blank';
                groupLink.className = 'groupLink glyphicon glyphicon-eye-open';
                groupLink.style = "margin-left: 5px; margin-right: 5px; color: rgb(151, 151, 151);"
                forwardColl[i].parentElement.appendChild(groupLink);
            }
        }
    }

    function waitLoadShema() {
        if (!alreadyBind) {
            alreadyBind = true;
            setTimeout(buildGroupLink, 1000);
            setTimeout(buildMemberQuickLink, 1200);
        } else {
            $('div.wrapper').unbind("DOMSubtreeModified", waitLoadShema);
        }
    }
    window.addEventModifier = function addEventModifier() {
        alreadyBind = false;

        $('div.wrapper').bind("DOMSubtreeModified", waitLoadShema);
    }

    $(document).ready(addEventModifier);
    $(document).ready(function () {
        document.getElementById('id-profile').onchange = addEventModifier;
    });

    function buildMemberQuickLink() {
        if (document.getElementsByClassName('memberLink').length > 0)
            return;
        var forwardToMemberColl = document.querySelectorAll('#target-type[value^="member"]');
        for (i = 0; i < forwardToMemberColl.length; i++) {
            var memberName = forwardToMemberColl[i].parentElement.querySelector('#target-name').value;
            var memberId = document.querySelector('option[label="' + memberName + '"').value;
            var memberURL = window.location.origin + '/members/plain/autoopen/' + memberId;
            var baseElement = forwardToMemberColl[i].parentElement.parentElement.parentElement;
            var newLi = document.createElement('li');
            baseElement.appendChild(newLi);
            var newLink = document.createElement('a');
            newLink.className = 'glyphicon glyphicon-eye-open memberLink';
            newLink.target = '_blank';
            newLink.href = memberURL;
            newLink.title = 'Посмотреть карточку сотрудника';
            newLink.style.color = 'rgb(151, 151, 151)';
            newLink.onclick = function () {
                this.style.opacity = .5;
            };
            newLi.appendChild(newLink);
        }
    }

}

function whenSipOpen() {
    if (!(/[/]sip$/.test($.ajaxCurrentUrl()) || /[/]sip[/]overview$/.test($.ajaxCurrentUrl())))
        return;
    var urlPlain = window.location.origin + "/" + Ics.accountId + "/" + Ics.productId + "/members/plain/";
    $.ajax({
        type: 'GET',
        url: urlPlain,
        success: getResponse,
        error: function (err) {
            log(err);
            console.trace();
        }
    });

    function getResponse(e) {
        var htmlParser = new DOMParser();
        var html = htmlParser.parseFromString(e, 'text/html');
        var memberJson = JSON.parse(html.querySelector('#b-members-data').innerHTML);
        buildSIP(memberJson);
    }

    function buildSIP(userJson) {
        if (document.getElementById('user_ext') !== null)
            return;
        var sipCollection = document.getElementsByClassName('b-sip-number');
        var nameCollection = document.querySelectorAll('td[class="filterable"]');
        var statusCollection = document.getElementsByClassName('filterable b-sip-status');
        for (s = 0; s < sipCollection.length; s++) {
            var currentAbonentId = sipCollection[s].attributes[3].value;
            var extension;
            var sipURI = sipCollection[s].querySelector('span').innerText;
            for (i = 0; i < userJson.length; i++) {
                if (userJson[i].abonent_id == currentAbonentId) {
                    extension = userJson[i].transfer_number;
                    break;
                }
            }
            var newElem = document.createElement('a');
            newElem.id = "user_ext";
            newElem.innerText = '[' + (extension === null ? "" : extension) + ']';
            newElem.href = window.location.origin + '/' + Ics.accountId + '/' + Ics.productId + '/members/plain/autoopen/' + userJson[i].id;
            newElem.onclick = function () {
                this.style.opacity = .3
            };
            newElem.target = "_blank";
            nameCollection[s].insertBefore(newElem, nameCollection[s].firstChild);
            statusCollection[s].style.width = '200px';
            var waLink = document.createElement('a');
            waLink.href = "http://192.168.37.150:8388/webadmin-client/PRES-wa/?sip=" + sipURI + "#p=sswa-module-sip-sessions-cluster";
            waLink.onclick = function () {
                this.style.opacity = .3
            };
            waLink.target = "_blank";
            waLink.style.display = 'inline';
            waLink.innerHTML = "  [ВА]";
            statusCollection[s].insertBefore(waLink, statusCollection[s].lastChild);
            var logsLink = document.createElement('a');
            logsLink.href = "http://logs.mango.local/?type=sip&value=" + sipURI;
            logsLink.onclick = function () {
                this.style.opacity = .3
            };
            logsLink.target = "_blank";
            logsLink.style.display = 'inline';
            logsLink.innerHTML = " [ЛОГИ]";
            statusCollection[s].insertBefore(logsLink, statusCollection[s].lastChild);
        }

        (function buildSuccessCall() {
            if (!window.location.pathname.includes('sip'))
                return;
            if (document.getElementsByClassName('successCall').length > 0)
                return;
            var sipColl = document.getElementsByClassName('filterable b-sip-number');
            for (i = 0; i < sipColl.length; i++) {
                var sipURI = sipColl[i].querySelector('span[class="output"]').innerText;
                var waLink = 'http://192.168.37.150:8388/webadmin-client/PRES-wa/?successcall=' + sipURI + '&bid=' + Ics.productId + '#p=sswa-module-softplatform-cdrs';
                var sc = document.createElement('a');
                sc.className = 'glyphicon glyphicon-transfer successCall';
                sc.href = waLink;
                sc.title = 'Входящие звонки за последнюю неделю';
                sc.target = '_blank';
                sc.style = 'margin-left: 5px; color: rgb(151, 151, 151);';
                sc.onclick = function () {
                    this.style.opacity = .5;
                };
                sipColl[i].appendChild(sc);
            }
        })();
        (function buildCopySIP() {
            var isDesirePage = /[/]sip$/.test($.ajaxCurrentUrl()) || /[/]sip[/]overview$/.test($.ajaxCurrentUrl());
            if (!isDesirePage)
                return;
            if (document.getElementsByClassName('copysip').length > 0)
                return;
            var sipColl = document.getElementsByClassName('filterable b-sip-number');
            for (i = 0; i < sipColl.length; i++) {
                var copyButton = document.createElement('i');
                copyButton.className = 'glyphicon glyphicon-duplicate copysip';
                copyButton.style = 'margin-left: 5px;cursor: pointer; color:#979797;';
                copyButton.setAttribute('onclick', 'copySIP(this);');
                copyButton.title = 'Скопировать SIP';
                sipColl[i].appendChild(copyButton);
            }

            function sipInput(sip) {
                var oldInputColl = document.getElementsByClassName('copyInputSIP');
                for (i = 0; i < oldInputColl.length; i++)
                    oldInputColl[i].remove();
                var ci = document.createElement('input');
                ci.className = 'copyInputSIP';
                ci.value = sip;
                ci.style.opacity = '.0';
                document.getElementsByClassName('copyright')[0].appendChild(ci);
                ci.select();
            }
            window.copySIP = function copySIP(e) {
                window.getSelection().removeAllRanges();
                var sipValue = e.previousElementSibling.previousElementSibling.innerText;
                sipInput(sipValue);
                try {
                    var successful = document.execCommand('copy');
                } catch (err) { }
                window.getSelection().removeAllRanges();
                var oldInputColl = document.getElementsByClassName('copyInputSIP');
                for (i = 0; i < oldInputColl.length; i++)
                    oldInputColl[i].remove();
                e.className = 'glyphicon glyphicon-ok copysip';
                e.style.opacity = '1';
                e.style.color = 'rgb(20, 197, 56)';
                setTimeout(function () {
                    e.className = 'glyphicon glyphicon-duplicate copysip';
                    e.style.color = '#979797';
                    e.style.opacity = '.5';
                }, 2000);
            }
        })();
    }
}


function whenNumbersOpen() {
    var isDesirePage = /mango-numbers[/]numbers/.test($.ajaxCurrentUrl()) || /mango-numbers$/.test($.ajaxCurrentUrl()) || /mango-numbers[/]numbers#sips/.test($.ajaxCurrentUrl()) || /mango-numbers[/]numbers#widgets/.test($.ajaxCurrentUrl());
    if (!isDesirePage)
        return;

    (function buildCopyDID() {
        if (document.getElementsByClassName('copydid').length > 0)
            return;
        var didColl = document.getElementsByClassName('b-number tel');
        for (i = 0; i < didColl.length; i++) {
            var copyButton = document.createElement('span');
            copyButton.className = 'glyphicon glyphicon-duplicate copydid';
            copyButton.style = 'margin-left: 5px;cursor: pointer; color:#979797;';
            copyButton.setAttribute('onclick', 'copyDID(this);');
            copyButton.title = 'Скопировать DID';
            didColl[i].appendChild(copyButton);
        }

        window.copyDID = function copyDID(e) {
            window.getSelection().removeAllRanges();
            var didValue = e.parentElement.querySelector('[class="number"]').innerText;
            didInput(didValue);
            try {
                var successful = document.execCommand('copy');
            } catch (err) { }
            window.getSelection().removeAllRanges();
            var oldInputColl = document.getElementsByClassName('copyInputDID');
            for (i = 0; i < oldInputColl.length; i++)
                oldInputColl[i].remove();
            e.className = 'glyphicon glyphicon-ok copydid';
            e.style.opacity = '1';
            e.style.color = 'rgb(20, 197, 56)';
            setTimeout(function () {
                e.className = 'glyphicon glyphicon-duplicate copydid';
                e.style.color = '#979797';
                e.style.opacity = '.5';
            }, 2000);
        }

        function didInput(did) {
            var oldInputColl = document.getElementsByClassName('copyInputDID');
            for (i = 0; i < oldInputColl.length; i++)
                oldInputColl[i].remove();
            var ci = document.createElement('input');
            ci.className = 'copyInputDID';
            ci.value = did.replace(/\D/g, '');
            ci.style.opacity = '.0';
            document.getElementsByClassName('copyright')[0].appendChild(ci);
            ci.select();
        }
    })();

    (function showSipLine() {
        if (document.getElementsByClassName('sipline').length > 0)
            return;
        var genColl = document.getElementsByClassName('b-number sip');
        for (i = 0; i < genColl.length; i++) {
            var sipLine = genColl[i].querySelector('span[class="number"]').getAttribute('data-sip');
            var sipID = genColl[i].querySelector('span[class="number"]').getAttribute('data-abonent_id');
            var newElem = document.createElement('td');
            newElem.innerHTML = '<span>' + sipLine + '</span>';
            newElem.className = 'number sipline';
            isUAC(sipID, newElem);
            genColl[i].parentElement.parentElement.appendChild(newElem);
        }

        function isUAC(id, sipElement) {
            var xhr = new XMLHttpRequest();

            var body = 'abonent_id=' + id;
            var url = window.location.origin + '/' + Ics.accountId + '/' + Ics.productId + '/main-uri/get';
            xhr.open("POST", url, true)
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
            xhr.onreadystatechange = function () {
                if (xhr.status !== 200 || xhr.readyState != 4) { } else {
                    if (JSON.parse(xhr.responseText).line.remote_sip_active == '1') {
                        var uacIcon = document.createElement('span');
                        uacIcon.className = 'glyphicon glyphicon-text-background';
                        uacIcon.style = 'margin-right: 5px;';
                        uacIcon.style.color = 'rgb(151, 151, 151)';
                        uacIcon.title = 'Активный SIP';
                        sipElement.insertBefore(uacIcon, sipElement.firstChild);
                    }
                }
            }
            xhr.send(body);
        }
    })();

    (function showSipLineForWidget() {
        if (document.getElementsByClassName('number sipline widget').length > 0)
            return;
        var genColl = document.getElementsByClassName('b-number sip');
        var widgetColl = document.getElementsByClassName('widget-item');
        for (i = 0; i < widgetColl.length; i++) {
            if (widgetColl[i].getAttribute('data-item-type') == '1') {
                for (j = 0; j < genColl.length; j++) {
                    if (widgetColl[i].getAttribute('data-item-abonent-id') == genColl[j].querySelector('span[class="number"]').getAttribute('data-abonent_id')) {
                        var sipLine = genColl[j].querySelector('span[class="number"]').getAttribute('data-sip');
                        var newElem = document.createElement('td');
                        newElem.innerHTML = '<span>' + sipLine + '</span>';
                        newElem.className = 'number sipline widget';
                        widgetColl[i].parentElement.parentElement.appendChild(newElem);
                        break;
                    }
                }
            }
        }
    })();

}

/**
 * Отображает контекст в истории вызовов
 */
class ContextHistory {
    constructor(res) {
        this.res = res;
        this.status = res.status;
        this.type = res.type;
        this.data = res.data;
        this.init();
    }

    init() {
        if (this.status !== 'complete') {
            return;
        }
        log('ContextHistory init');
        if (this.type === 'all') {
            return this.buildAll();
        }
        if (this.type === 'missed') {
            return this.buildMissed();
        }
        if (this.type === 'failed') {
            return this.buildFailed();
        }
    }
    buildAll() {
        log('buildAll');
        $('.history-report .th-hist-cost').text('Контекст');
        $('[data-name="cost"]').css('display', 'none');
        $('[data-name="contextId"]').parent().css('display', 'inline');
        $('[data-name="contextId"]').each((index, item) => this.eachContext(item));
    }
    buildMissed() {
        log('buildMissed');
        $('.history-report .th-hist-duration').text('Контекст');
        $('[data-name="duration"]').css('display', 'none');
        $('[data-name="contextId"]').parent().css('display', 'inline');
        $('[data-name="contextId"]').each((index, item) => this.eachContext(item));
    }
    buildFailed() {
        $('.history-report .th-hist-duration').text('Контекст');
        $('[data-name="wait_duration"]').each((index, item) => {
            const element = $(item);
            const {
                contextId: context
            } = this.data[index];
            const link = this.makeLink(context);
            const temp = $('<a>')
                .text(context)
                .attr('href', link)
                .attr('target', '_blank')
                .click((e) => this.onClick(e));
            element.html(temp);
        });
    }
    makeLink(context) {
        return 'http://192.168.37.150:8388/webadmin-client/PRES-wa/?context=' + context + "#p=sswa-module-softplatform-cdrs";
    }
    onClick(e) {
        const {
            target
        } = e;
        $(target).css('opacity', '0.5');
        Statistic.send('context-history');
    }
    eachContext(item) {
        const element = $(item);
        const context = element.text().trim();
        const link = this.makeLink(context);
        const temp = $('<a>')
            .text(context)
            .attr('href', link)
            .attr('target', '_blank')
            .click((e) => this.onClick(e));
        element.html(temp);
    }
}

/**
 * Отображает контекст в "Записи разговора"
 */
class ContextRecords {
    constructor() {
        this.init();
    }

    static saveData(res) {
        const { data, status } = res;
        if (status === 'complete') {
            ContextRecords.data = data;
        }
    }

    init() {
        this.build();
    }

    build() {
        $('.size-head').text('Контекст');
        $('.size.wp-load').each((index, item) => this.eachContext(index, item));
    }

    eachContext(index, item) {
        const { ficontext_id } = ContextRecords.data[index];
        $(item).html(
            $('<a>')
                .text(ficontext_id)
                .click(e => this.onClick(e))
        );
    }

    onClick(e) {
        const { target } = e;
        const context = $(target).text();
        const url = `http://192.168.37.150:8388/webadmin-client/PRES-wa/?context=${context}#p=sswa-module-softplatform-cdrs`;
        window.open(url, '_blank');
        Statistic.send('context-records');
        $(target).css('opacity', '0.5');
        return false;
    }
}

/**
 * Отображение пароля от SIPUAC
 */
class SipUacPass {
    constructor(res) {
        this.res = res;
        this.line = res.line;
        this.className = 'booster-sipuac-pass';
        this.init();
    }
    init() {
        log('SipUacPass init');
        this.clear();
        this.build();
    }
    clear() {
        $('.' + this.className).remove();
    }
    build() {
        const button = $('<div>')
            .addClass('col-md-1')
            .addClass(this.className)
            .css({
                'margin-top': '5px',
                'text-align': 'center',
            })
            .attr('title', 'Показать пароль')
            .click(() => this.onClick())
            .append(
                $('<a>').addClass('glyphicon glyphicon-eye-open')
            );

        const entry = $('#password_active_id').closest('div.row');
        entry.append(button);
    }
    onClick() {
        const input = document.querySelector('#password_active_id');
        input.type = (input.type === 'text' ? 'password' : 'text');
        Statistic.send('sipuac-pass');
    }
}

/*function whenUsersOpen() {
    var isDesirePage = /members[/]index/.test($.ajaxCurrentUrl()) || /members[/]plain/.test($.ajaxCurrentUrl());
    if (!isDesirePage)
        return;
    if (!document.querySelector("#count-members").hasAttribute("covinit")) {
        var json = document.getElementById('b-members-data');
        var parsedJson = JSON.parse(json.innerText);
        buildCov = function buildCov() {
            for (i = 0; i < parsedJson.length; i++) {
                if (parsedJson[i].login !== null) {
                    var elemID = parsedJson[i].id;
                    var getElem = document.querySelector("td[data-member-id='" + elemID + "']");
                    if (getElem !== null)
                        getElem.innerHTML += "<div id = \"covinit_" + i + "\">" + parsedJson[i].login + "</div>";
                    else {
                        setTimeout(buildCov, 500);
                        return;
                    }
                }
            }
        }
        buildCov();
        document.querySelector("#count-members").setAttribute("covinit", "true");
    } else {
        document.querySelector("#count-members").removeAttribute("covinit")
        for (i = 0; i < 550; i++) {
            var cElem = document.getElementById('covinit_' + i);
            if (cElem !== null)
                cElem.remove();
        }
        document.querySelector("#count-members").removeAttribute("covinit");
    }
}
*/

function whenGroupAutoOpen() {
    var isDesirePage = /members[/]grouped\?id=.*/.test($.ajaxCurrentUrl()) && window.location.search.replace(/\D/g, '').length > 1;
    if (!isDesirePage)
        return;
    var groupColl = null;
    var memberColl = null;
    ! function waitGroupLoad() {
        var wCount = 0;
        ! function iterationWait() {
            wCount++;
            if (wCount > 20)
                return;
            if ($('#count-groups').text().length > 0) {
                groupAutoOpenBody();
                return;
            } else
                setTimeout(iterationWait, 500);
        }();
    }();

    function groupAutoOpenBody() {
        $(function () {
            require([
                'mvc/point-members-groups/models/groups',
                'mvc/point-members-groups/views/groups',
                'mvc/point-members-groups/models/members',
                'require/filter',
                'require/ui/dialog'
            ], function () {
                var pointSettings = $.parseJSON($("#point-default-settings").html());
                groupColl = $('#point-members-groups-data').ics__point_groups_collection($('#point-members-groups-usage-data'), $('.b-group-info'));
                memberColl = $('#point-members-members-data').ics__members_collection($('.b-group-info'));
                searchGroup();
            });
        });

        function searchGroup() {
            var currentGroup = window.location.search.replace(/\D/g, '');
            var currentGroupElement = document.getElementsByClassName('b-group b-group-' + currentGroup)[0];
            highlightTheGroup(currentGroupElement);
            showAbonents(currentGroupElement);
            scrollToElement(currentGroupElement);
        }

        function scrollToElement(groupElement) {
            var selectedPosX = 0;
            var selectedPosY = 0;
            while (groupElement !== null) {
                selectedPosX += groupElement.offsetLeft;
                selectedPosY += groupElement.offsetTop;
                groupElement = groupElement.offsetParent;
            }
            window.scrollTo(selectedPosX - 50, selectedPosY - 50);
        }

        function highlightTheGroup(groupElement) {
            groupElement.style = 'border: 3px solid black;';
        }

        function showAbonents(groupElement) {
            groupElement.querySelector('span[class="show g-link"]').click();
        }
    }
}

function whenGroupOpen() {
    if (!/\/members\/grouped/.test($.ajaxCurrentUrl()))
        return;
    if ($('.haveShedule').length > 0)
        return;
    if ($('haveCov').length > 0)
        return;

    var membersJson = null;
    var groupJson = null;
    var userColl = null;
    var groupLoad = false;
    var zCount = 0;

    ! function loadGroupData() {
        var urlPlain = window.location.origin + "/" + Ics.accountId + "/" + Ics.productId + "/members/plain/";

        $.ajax({
            type: 'GET',
            url: urlPlain,
            success: getResponse,
            error: function (err) {
                log(err);
                console.trace();
            }
        });

        function getResponse(e) {
            var htmlParser = new DOMParser();
            var html = htmlParser.parseFromString(e, 'text/html');
            membersJson = JSON.parse(html.querySelector('#b-members-data').innerHTML);
            groupJson = JSON.parse(html.querySelector('#point-members-groups-data').innerHTML);
            $('#point-members-groups').one("DOMNodeInserted", function (event) {
                setTimeout(buildShortcutNotify, 1000);
            });

            $('body > div.b-wrapper > div.b-content.b-ajax-content > div > div.point-members-block > div > div.buttons').click(function () {
                $('#point-members-groups').one("DOMNodeInserted", function (event) {
                    setTimeout(buildShortcutNotify, 1000);
                });
            });
        }
    }();

    function buildShortcutNotify() {
        if (!/\/members\/grouped/.test($.ajaxCurrentUrl()))
            return;
        if ($('.haveShedule').length > 0)
            return;
        if ($('.haveCov').length > 0)
            return;
        userColl = document.getElementsByClassName('g-link filterable-data');
        for (i = 0; i < userColl.length; i++) {
            var currentMemberName = userColl[i].innerText;
            var haveShedule = false;
            var haveCov = false;
            for (j = 0; j < membersJson.length; j++) {
                if (currentMemberName == membersJson[j].name) {
                    if (membersJson[j].use_cc_numbers == 1 || membersJson[j].use_status == 1)
                        haveCov = true;
                    for (w = 0; w < membersJson[j].numbers.length; w++) {
                        if (membersJson[j].numbers[w].schedule_id !== null)
                            haveShedule = true;
                    }
                    if (haveShedule) {
                        var newElem = document.createElement('img');
                        // newElem.src = "";
                        newElem.alt = "Расписание";
                        newElem.title = "Расписание";
                        newElem.className = 'haveShedule';
                        userColl[i].parentElement.parentElement.querySelector('td[class="name"]').insertBefore(newElem, userColl[i].parentElement.parentElement.querySelector('td[class="name"]').children[1]);
                    }
                    if (haveCov) {
                        var newElem = document.createElement('img');
                        // newElem.src = "";
                        newElem.alt = "ЦОВ";
                        newElem.title = "ЦОВ";
                        newElem.className = 'haveCov';
                        userColl[i].parentElement.parentElement.querySelector('td[class="name"]').insertBefore(newElem, userColl[i].parentElement.parentElement.querySelector('td[class="name"]').children[1]);
                    }
                }
            }
        }
    }
}


/**
 * Создает ссылки на кибану
 */
class ApiKibana {
    constructor() {
        this.apiKey = $('.b-data-api-key span').text();
        this.init();
    }
    init() {
        log('ApiKibana init');
        this.build();
    }
    build() {
        $('.b-data-api-key').closest('tr').append(
            $('<td>').append(this.commands(), this.events())
        );
    }
    commands() {
        const link = "http://kibana-loadlog.by.mgo.su/app/kibana#/discover/?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-1d,mode:quick,to:now))&_a=(columns:!(_source),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:host,negate:!f,value:API-Listener),query:(match:(host:(query:API-Listener,type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!t,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:PARAMETERS.REQUEST_URI,negate:!f,value:%2Fvpbx%2Fcommands%2Froute),query:(match:(PARAMETERS.REQUEST_URI:(query:%2Fvpbx%2Fcommands%2Froute,type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!t,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:IP,negate:!f,value:'188.120.237.63'),query:(match:(IP:(query:'188.120.237.63',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:PARAMETERS.POST.vpbx_api_key,negate:!f,value:'" + this.apiKey + "'),query:(match:(PARAMETERS.POST.vpbx_api_key:(query:'" + this.apiKey + "',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!t,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:PARAMETERS.POST.json,negate:!f,value:'%7B%22command_id%22:%22CALLBACK%22,%22from%22:%7B%22extension%22:52,%22number%22:%2279200748588%22%7D,%22to_number%22:%2279200748588%22%7D'),query:(match:(PARAMETERS.POST.json:(query:'%7B%22command_id%22:%22CALLBACK%22,%22from%22:%7B%22extension%22:52,%22number%22:%2279200748588%22%7D,%22to_number%22:%2279200748588%22%7D',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!t,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:PARAMETERS.POST.json,negate:!f,value:'%7B%22command_id%22:%22ROUTE%22,%22call_id%22:%22MToxMDAwMzcxMjozODE6Mzg4NTE5NDU2OjE%3D%22,%22to_number%22:%22101%22%7D'),query:(match:(PARAMETERS.POST.json:(query:'%7B%22command_id%22:%22ROUTE%22,%22call_id%22:%22MToxMDAwMzcxMjozODE6Mzg4NTE5NDU2OjE%3D%22,%22to_number%22:%22101%22%7D',type:phrase))))),index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',interval:auto,query:(query_string:(analyze_wildcard:!t,query:'*')),sort:!('@timestamp',desc))";
        const button = $('<button>')
            .attr('type', 'button')
            .addClass('ui-second-button')
            .text('КОМАНДЫ')
            .click(() => this.onClick(link));
        return button;
    }
    events() {
        const link = "http://kibana-loadlog.by.mgo.su/app/kibana#/discover/?_g=(refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-1d,mode:quick,to:now))&_a=(columns:!(PARAMETERS.post.json),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:host,negate:!f,value:api-sender-prod),query:(match:(host:(query:api-sender-prod,type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:PARAMETERS.url,negate:!f,value:%2Fevents%2F),query:(match:(PARAMETERS.url:(query:%2Fevents%2F,type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!t,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:IP,negate:!f,value:'81.88.83.28'),query:(match:(IP:(query:'81.88.83.28',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!t,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:ACC,negate:!f,value:'16674795'),query:(match:(ACC:(query:'16674795',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:MSG,negate:!f,value:'End%20send%20request'),query:(match:(MSG:(query:'End%20send%20request',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:PARAMETERS.post.vpbx_api_key,negate:!f,value:'" + this.apiKey + "'),query:(match:(PARAMETERS.post.vpbx_api_key:(query:'" + this.apiKey + "',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!t,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:TYPE,negate:!t,value:apiInfo),query:(match:(TYPE:(query:apiInfo,type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!t,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:PARAMETERS.post.json,negate:!f,value:'%7B%22entry_id%22:%22MjUzMDc3MzkwMzozODE%3D%22%7D'),query:(match:(PARAMETERS.post.json:(query:'%7B%22entry_id%22:%22MjUzMDc3MzkwMzozODE%3D%22%7D',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!t,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:PARAMETERS.post.json,negate:!f,value:'%7B%22call_state%22:%22Appeared%22%7D'),query:(match:(PARAMETERS.post.json:(query:'%7B%22call_state%22:%22Appeared%22%7D',type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!t,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:PARAMETERS.post.json,negate:!f,value:'%7B%22location%22:%22abonent%22%7D%7D'),query:(match:(PARAMETERS.post.json:(query:'%7B%22location%22:%22abonent%22%7D%7D',type:phrase))))),index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',interval:auto,query:(query_string:(analyze_wildcard:!t,query:'*')),sort:!('@timestamp',desc))";
        const button = $('<button>')
            .attr('type', 'button')
            .addClass('ui-second-button')
            .text('СОБЫТИЯ')
            .click(() => this.onClick(link));
        return button;
    }
    onClick(link) {
        window.open(link);
        Statistic.send('api-kibana');
    }
}

/** страница Динамический коллтрекинг */
class Dct {
    /**
     * @constructor
     */
    constructor(res) {
        this.res = res;
        this.build();
    }
    /**
     * выполняет загрузку настроек виджета
     * и отрисовку кнопки
     */
    build() {
        const {
            integrations,
            widget_id
        } = this.res;
        const {
            metrika
        } = integrations;
        this.yandexMetrika(metrika, widget_id);
    }
    yandexMetrika(data = {}, wid) {
        const {
            params,
            account
        } = data;
        if (!params || !account) return;
        const {
            token
        } = params;
        const button = this.buttonYandexMetrika(token, account);
        $('#widget-' + wid)
            .closest('widget-block')
            .find('widget-settings-integration-metrika .ct-open-instruction')
            .after(button);
    }
    /**
     * возвращает кнопку логов yaMetrika с ссылкой
     * @param {string} token
     * @return {any}
     */
    buttonYandexMetrika(token, account) {
        const href = 'https://api-metrika.yandex.ru/management/v1/counter/' + account + '/offline_conversions/calls_uploadings?oauth_token=' + token;
        return $('<a>')
            .attr('href', href)
            .attr('target', '_blank')
            .addClass('ct-open-instruction')
            .css('display', 'block')
            .click(() => this.onClick())
            .text('Логи');
    }
    onClick() {
        Statistic.send('dct:yandex:metrika');
    }
}

/**
 * Кнопка рядом с ЛС "звонки за последний час"
 */
class BidLink {
    constructor() {
        this.className = 'booster-bid-link';
        this.bid = Ics.productId;
        this.link = 'http://192.168.37.150:8388/webadmin-client/PRES-wa/?bid=' + this.bid + '#p=sswa-module-softplatform-cdrs';
        this.init();
    }
    init() {
        log('BidLink init');
        this.remove();
        this.build();
    }
    remove() {
        $('.' + this.className).remove();
    }

    build() {
        const button = $('<a>')
            .attr('href', this.link)
            .attr('target', '_blank')
            .addClass('glyphicon glyphicon-eye-open ' + this.className)
            .attr('title', 'Звонки за последний час')
            .css({
                'margin-left': '5px',
                'color': 'white',
            })
            .click(() => this.onClick());

        const entry = $('.account .value');
        entry.after(button);
    }

    onClick() {
        Statistic.send('bid-link');
    }
}

/**
 * Кнопка "логи" в карточке SIPUAC
 */
class SipUacLogs {
    constructor(res) {
        this.res = res;
        this.line = res.line;
        this.number = res.line.number;
        this.link = 'http://logs.mango.local?type=sipuac&value=' + this.number;
        this.init();
    }
    /**
     * инициализация
     */
    init() {
        log('SipUacLogs init');
        this.build();
    }

    /**
     * добавляет кнопку "логи" в карточку сипюак
     */
    build() {
        const button = $('<button>')
            .attr('type', 'button')
            .addClass('ui-second-button')
            .css('float', 'right')
            .append(
                $('<span>').text('Логи')
            )
            .click(() => this.onClick());

        const entryElement = $('.ui-dialog-buttonset');
        entryElement.append(button);
    }

    /**
     * Действие при нажатии на кнопку
     */
    onClick() {
        window.open(this.link);
        Statistic.send('logs:sipuac');
    }
}

/**
 * Добавляет кнопку AP на страницу "Настройка SIP"
 */
class SipSettingsAP {
    constructor() {
        this.init();
    }
    init() {
        const domains = $('.domain .b-cap');

        const buttonAP = $('<button>')
            .text('Autoprovision')
            .addClass('autoprovision-button')
            .click(e => {
                const domain = $(e.target).closest('.b-cap').find('.title').text();
                window.open(`${AP}/autoprovision/start?domain=@${domain}&action=bydomain`);
                Statistic.send('ap:bydomain');
                return false;
            });

        domains.append(buttonAP);
    }
}

/**
 * Добавляет кнопку перехода в заявку BPM на страницу поддержки ЛК
 */
class BpmButton {
  constructor() {
    this.init();
  }
  init() {
    // Получаем экземпляр наблюдаетеля
    getObserver(callback);

    // Вспомогательные функции для init
    // Создаем экземпляр наблюдателя с указанной функцией обратного вызова
    function getObserver(callback) {
      const requestForm = document.querySelector("div.b-request-form");
      const config = {
        childList: true,
      };

      const observer = new MutationObserver(callback);

      // Начинаем наблюдение за настроенными изменениями целевого элемента
      observer.observe(requestForm, config);
    }

    function callback(mutationsList, observer) {
      try {
        for (let mutation of mutationsList) {
          if (mutation.type === "childList") {
            const requestStatusObject = mutation.target.querySelector("div.b-request-status");

            if (requestStatusObject) {
              const inputForm = mutation.target.querySelector("div.b-comment-form input[name=requestId]");

              if (inputForm) {
                const requestId = inputForm.value;

                if (document.querySelector(`button#ma-go-to-bpm-${requestId}`) === null) {
                    const h5Element = mutation.target.querySelector("h5");

                    if (h5Element) {
                        h5Element.after(getButton(requestId));
                    }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    function getButton(requestId) {
      const button = document.createElement("button");
      button.id = `ma-go-to-bpm-${requestId}`;
      button.setAttribute("style", "margin:0 0 0 10px");
      button.innerHTML = `<span style="font-size:10px">Перейти в BPM</span>`;

      button.onclick = function () {
        openPage(requestId);
      };

      return button;

      function openPage(requestId) {
        try {
          const url = `http://creatio.corp.mango.ru/0/Nui/ViewModule.aspx#CardModuleV2/CasePage/edit/${requestId}`;

          BPMCommon.sendStats("lk_to_bpm", location.href.split("/").splice(3, 2).join("-"), requestId, " ");

          window.open(url);
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
}

/**
 * Создает контекстное меню
 * @param {any} options параметры
 */
function ContextMenu(options) {
    this.bodyClass = 'booster-ctx-menu-showed';
    this.options = options;
    this.html = this.buildHTML();
    $(document).on('contextmenu', options.selector, e => {
        e.preventDefault();
        const { clientX, clientY, target } = e;
        this.clear();
        this.target = target;
        this.show(clientX, clientY, target);
    });

    if (!ContextMenu.clearOnMiss) {
        ContextMenu.clearOnMiss = true;
        $(document).on('click', '.' + this.bodyClass, () => this.clear());
    }
}

ContextMenu.prototype.buildHTML = function () {
    const html = $('<div>')
        .addClass('booster-ctx-menu');

    const rows = this.options.rows.map(row => {
        return $('<div>')
            .addClass('row-item')
            .text(row.text)
            .click(() => row.callback(row, this.target));
    });
    html.append(...rows);

    const css = $('<style>').html(`
      .booster-ctx-menu {
        display: flex;
        font: 400 14px/24px Roboto,Helvetica Neue,sans-serif;
        flex-flow: column;
        position: fixed;
        background-color: #fff;
        box-shadow: rgb(170, 170, 170) 2px 2px 16px 0px;
        z-index: 99999999;
        user-select: none;
      }

      .booster-ctx-menu .row-item {
        cursor: pointer;
        padding: 5px 20px;
      }

      .booster-ctx-menu .row-item:hover {
        background-color: #d6d6d6;
      }
   `);

    html.append(css);
    return html;
};

ContextMenu.prototype.show = function (left, top) {
    this.html = this.html.css({ left, top });
    $(document.body).append(this.html);
    $(document.body).addClass(this.bodyClass);
}

ContextMenu.prototype.clear = function () {
    $(document.body).removeClass(this.bodyClass);
    $('.booster-ctx-menu').detach();
}


/**
 * Скопировать в буффер
 * @param {string} str
 */
const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};


/**
 * Добавляет к каждому вызову кнопку копировать определенные данные
 */
function getButtonToCopyParamsLK() {
  const buttonToCopyParamsLK = document.createElement("button");
  buttonToCopyParamsLK.innerHTML = '_'; // пустой символ по сути, потому что иначе кнопка некорректно работает
  buttonToCopyParamsLK.className = ' ';

  buttonToCopyParamsLK.setAttribute('title', "Скопировать Контекст/Кто звонил/Набранный номер/Создание");
  buttonToCopyParamsLK.setAttribute('data-tooltip', "Copied!"); //добавляем кнопке атрибут для тултипа

  buttonToCopyParamsLK.style = 'width: 20px; height: 15px; color: #fff; background-image: url("https://mh.mangotele.com:1043/mangohelper/images/copy_data_lk(booster).webp"); background-size: contain; background-repeat:no-repeat; border: none; display: flex; justify-content: center; box-shadow: none; position: absolute; top: 12px; left: -1px';

  let tdBadQualityColumn = document.querySelector('.td-bad-quality'); // расширяем стандартное поле, так как иначе наша кнопка и другой элемент на странице не уместятся в изначальном контейнере
  tdBadQualityColumn.style = 'width: 40px; '

  const tooltipToCopyParamsLK = document.createElement("span"); // создание подсказки, что данные скопированы
  tooltipToCopyParamsLK.style = 'position: absolute; top: -21px; left: 10px; z-index: 2; width: 60px; height: 20px; background: #37474f; color: #fafafa; display: none; border-radius: 5px;'
  buttonToCopyParamsLK.prepend(tooltipToCopyParamsLK)

  buttonToCopyParamsLK.onclick = function (e) {
    let data = buttonToCopyParamsLK.getAttribute("data-tooltip"); // берем значение атрибута кнопки buttonToCopyParamsLK
    e.target.firstChild.innerHTML = data;
    e.target.firstChild.style.display = "block"; //меняем с display:none
    setTimeout(() => e.target.firstChild.style.display = "none" , 1000);

    var rowOfCallIntoLK = e.target.parentElement.parentElement.parentElement; //находим элемент такого уровня вложенности, чтобы обращение быцло к строке целиковой.
    var usefulInfoOfCall = rowOfCallIntoLK.querySelectorAll('td'); //находим все элементы коллекции(массива), то есть столбцы с данными по звонку.

    let arrayInfoOfOneCall = [];
    for (element of usefulInfoOfCall) {
      let textElement = element.textContent.trim();
      arrayInfoOfOneCall.push(textElement); //создав пустой массив,через цикл добавляем туда все текстовые составляющие(саму инфу о звонке),как элементы массива, убирая пробелы.
    }

    let selectDataOfOneCall = [ // этого массива можно избежать, но так мы отбираем из данных, которые у нас есть, только то, что необходимо.
        arrayInfoOfOneCall[6].substring(arrayInfoOfOneCall[6].length - 11),
        arrayInfoOfOneCall[1],
        arrayInfoOfOneCall[2],
        arrayInfoOfOneCall[0]
      ]

    copyToClipboard(selectDataOfOneCall.join('   ')); //копируем массив, превращенный в строку и разделенный 3 пробелами
  }
  return buttonToCopyParamsLK
}


function addCopyCallButtonIntoLK() { //добавление кнопок на страницу
  const containerForButtons = document.querySelectorAll('.history-report tbody tr .td-bad-quality') //место, куда будем добавлять кнопки копирования

  for (containerForButton of containerForButtons) {
    containerForButton.append(getButtonToCopyParamsLK())
  }
}

function wrapperObserverForCallsLK() {
  let fullTableOfCallsLK = document.querySelector('.history-report tbody'); // находим в ДОМ-дереве то, чьи изменения будем отслеживать с помощью Mutationobserver
  const configForCallsLK = {
    childList: true,
    attributes: true
  };
  let observerForCopyCallLK = new MutationObserver(() => {
    addCopyCallButtonIntoLK(); //тут указано, что будет делать обсервер при изменении ДОМ-элемента
  });

  observerForCopyCallLK.observe(fullTableOfCallsLK, configForCallsLK); // отслеживать изменения по параметрам объекта config
}


//---------------------------------------------
// модуль лк

function lkModule() {
    addHandlerChangePage();
    whenShemeOpen();
    whenSipOpen();
    whenNumbersOpen();
    //whenUsersOpen();

    // Для новой версии ЛК сделал проверку на наличие Ics
    if (typeof Ics !== "undefined"){
        new BidLink();
    }

    const { href } = document.location;
    if (/api-vpbx\/settings/.test(href)) {
        new ApiKibana();
    }
    if (/sip\/overview/.test(href)) {
        new SipSettingsAP();
    }
    if (/\d+\/\d+\/feedback$/.test(href)) {
        new BpmButton();
    }

    XHRListener.on(/stats\/response-stats/, e => {
        log('xhr event', e);
        new ContextHistory(e.json);
    });
    XHRListener.on(/stats\/calls/, e => {
        log('xhr event', e);
        new ContextHistory(e.json);
        wrapperObserverForCallsLK(e.json)
        addCopyCallButtonIntoLK(e.json)

    });
    XHRListener.on(/stats\/missed-calls/, e => {
        log('xhr event', e);
        new ContextHistory(e.json);
    });
    XHRListener.on(/stats\/failed-calls/, e => {
        log('xhr event', e);
        new ContextHistory(e.json);
    });
    XHRListener.on(/\/main-uri\/get/, e => {
        log('xhr event', e);
        new SipUacLogs(e.json);
        new SipUacPass(e.json);
    });
    XHRListener.on(/api-vpbx\/settings/, e => {
        log('xhr event', e);
        new ApiKibana();
    });
    XHRListener.on(/ics\/api\/\d+\/calltracking\/widgets\/\d+/, e => {
        log('xhr event', e);
        new Dct(e.json);
    });
    XHRListener.on(/response-stats.php$/, e => {
        log('xhr event', e);
        ContextRecords.saveData(e.json);
    });
    XHRListener.on(/call-recording\/overview$/, e => {
        log('xhr event', e);
        if (!e.json) {
            new ContextRecords();
        }
    });
    XHRListener.on(/sip\/overview$/, e => {
        log('xhr event', e);
        new SipSettingsAP();
    });
    XHRListener.on(/\d+\/\d+\/feedback$/, (e) => {
        log("xhr event", e);
        new BpmButton();
    });

    // Это контекстные меню для старой карточки сотрудника
    new ContextMenu({
        selector: '#device-number[data-protocol="sip"]',
        rows: [
            {
                name: 'copy',
                text: 'Скопировать SIP',
                callback: (data, element) => {
                    const sip = element.firstChild.textContent.trim();
                    copyToClipboard(sip);
                    Statistic.send('lk-card-copy-sip');
                },
            },
            {
                name: 'sip-register',
                text: 'WA: Регистрация',
                callback: (data, element) => {
                    const sip = element.firstChild.textContent.trim();
                    window.open(`${WA}/webadmin-client/PRES-wa/?sip=${sip}#p=sswa-module-sip-sessions-cluster`, '_blank');
                    Statistic.send('lk-wa-sip-register');
                },
            },
            {
                name: 'logs-balancer',
                text: 'Логи: Balancer',
                callback: (data, element) => {
                    const sip = element.firstChild.textContent.trim();
                    window.open(`${LO}?type=sip-balancer&value=${sip}`, '_blank');
                    Statistic.send('lk-logs-sip-balancer');
                },
            },
            {
                name: 'logs-registrar',
                text: 'Логи: Registrar',
                callback: (data, element) => {
                    const sip = element.firstChild.textContent.trim();
                    window.open(`${LO}?type=sip-registrar&value=${sip}`, '_blank');
                    Statistic.send('lk-logs-sip-registrar');
                },
            },
            {
                name: 'autoprovision-by-sip',
                text: 'Autoprovision',
                callback: (data, element) => {
                    const sip = element.firstChild.textContent.trim();
                    window.open(`${AP}/autoprovision/start?sip=${sip}&action=bysip`, '_blank');
                    Statistic.send('ap:bysip');
                },
            }
        ],
    });

    new ContextMenu({
        selector: '#ani-button',
        rows: [
            {
                name: 'copy',
                text: 'Скопировать номер',
                callback: (data, element) => {
                    log(element);
                    const didRaw = element.textContent;
                    const did = didRaw.replace(/\D/g, '');
                    copyToClipboard(did);
                    Statistic.send('lk-card-copy-did');
                },
            },
        ],
    });

    new ContextMenu({
        selector: '#device-number[data-protocol="tel"]',
        rows: [
            {
                name: 'copy',
                text: 'Скопировать',
                callback: (data, element) => {
                    log(element);
                    const number = element.textContent;
                    copyToClipboard(number);
                    Statistic.send('lk-card-copy-device-number');
                },
            },
        ],
    });

    // Это контекстные меню для новой карточки сотрудника
    new ContextMenu({
        selector: '.MANGO_HELPER-number span[data-protocol="sip"]',
        rows: [
            {
                name: 'copy',
                text: 'Скопировать SIP',
                callback: (data, element) => {
                    const sip = element.textContent.trim();
                    copyToClipboard(sip);
                    Statistic.send('lk-card-copy-sip');
                },
            },
            {
                name: 'sip-register',
                text: 'WA: Регистрация',
                callback: (data, element) => {
                    const sip = element.textContent.trim();
                    window.open(`${WA}/webadmin-client/PRES-wa/?sip=${sip}#p=sswa-module-sip-sessions-cluster`, '_blank');
                    Statistic.send('lk-wa-sip-register');
                },
            },
            {
                name: 'logs-worker',  
                text: 'Логи: Worker',
                callback: (data, element) => {
                    const sip = element.textContent.trim();
                    window.open(`${VLO}?type=sip-worker&value=${sip}`, '_blank');
                    Statistic.send('lk-logs-sip-worker');
                },
            },
            {
                name: 'logs-registrar',  
                text: 'Логи: Registrar',
                callback: (data, element) => {
                    const sip = element.textContent.trim();
                    window.open(`${VLO}?type=sip-registrar&value=${sip}`, '_blank');
                    Statistic.send('lk-logs-sip-registrar');
                },
            },
            {
                name: 'autoprovision-by-sip',
                text: 'Autoprovision',
                callback: (data, element) => {
                    const sip = element.textContent.trim();
                    window.open(`${AP}/autoprovision/start?sip=${sip}&action=bysip`, '_blank');
                    Statistic.send('ap:bysip');
                },
            }
        ],
    });

    new ContextMenu({
        selector: '.MANGO_HELPER-number span[data-protocol="tel"]',
        rows: [
            {
                name: 'copy',
                text: 'Скопировать',
                callback: (data, element) => {
                    log(element);
                    const number = element.textContent;
                    copyToClipboard(number);
                    Statistic.send('lk-card-copy-device-number');
                },
            },
        ],
    });
}

//---------------------------------------------------------------------------------------------------------------------------------------
//Автоматическая подпись сотрудников
setTimeout(() => {
    onclick = setTimeout(() => {
        let lkButtonButton = document.querySelector('li[data-item-marker="portal-message-tab"]');
        lkButtonButton.addEventListener('click', function insertNameBpmLk() {
            const userNameElement = document.getElementById('CasePageOwner0b024cd2-4fb1-4b99-bdd3-3d545f18ada9LookupEdit-link-el');
            const userNameText = userNameElement.textContent
            const userNameFull = userNameText.split(' ');
            const onlyUserName = userNameFull[1];
            const userGroupElement = document.getElementById('CasePageGroupLookupEdit-link-el'); //группа ответственных
            const userGroupText = userGroupElement.textContent
            const userGroupFull = userGroupText;
            const onlyUserGroup = userGroupFull;
            let templateWithName = document.createElement('span');
            let spanTemplateLk = document.getElementsByClassName('cke_editable_inline')[0];
            let spanTemplateName = spanTemplateLk.prepend(templateWithName);
            let onlyGroupFirst = (onlyUserGroup == '1-ая линия Технической Поддержки')
            if (onlyGroupFirst) {
                templateWithName.innerHTML = `<br>С уважением, ${onlyUserName} <br> Инженер технической поддержки MANGO OFFICE`;
            }
            let onlyGroupSecond = (onlyUserGroup == '2-ая линия Технической Поддержки')
            if (onlyGroupSecond) {
                templateWithName.innerHTML = `<br>С уважением, ${onlyUserName} <br> Инженер технической поддержки MANGO OFFICE`;
            }
            let onlyGroupVip = (onlyUserGroup == 'VIP линия Технической Поддержки')
            if (onlyGroupVip) {
                templateWithName.innerHTML = `<br>С уважением, ${onlyUserName} <br> Инженер VIP-линии технической поддержки MANGO OFFICE`;
            }
            let onlyGroupApi = (onlyUserGroup == 'Группа API и ДКТ Технической Поддержки')
            if (onlyGroupApi) {
                templateWithName.innerHTML = `<br>С уважением, ${onlyUserName} <br> Инженер технической поддержки сервисов интеграции и коллтрекинга MANGO OFFICE`;
            }
          let onlyGroupProblem = (onlyUserGroup == 'Группа Problem Технической Поддержки')
                if (onlyGroupProblem) {
                    templateWithName.innerHTML = `<br>С уважением, ${onlyUserName} <br> Ведущий специалист направления качества и доработок MANGO OFFICE`;
                }
            sendStatsOfBPM(' ', 'bpm_portal_sign', location.href.split("/")[8], ' ', ' ');

            function sendStatsOfBPM(email, type, from, to, note) {
                const requestParams = {
                    email: getUserEmailFromCasePage(),
                    type: type,
                    from: from,
                    to: getLs(),
                    note: note
                };

                function getLs() {
                    const lsSelector = `a#CasePageStnAccLookupEdit-link-el`;
                    const lsObject = document.querySelector(lsSelector);
                    let ls = "";
                    if (lsObject !== null) {
                        ls = lsObject.innerText;
                    }
                    return ls;
                }

                function getUserEmailFromCasePage() {
                    try {
                        const userEmail = sysValues.CURRENT_USER.displayValue;
                        if (typeof userEmail === "string" && userEmail.length > 0) {
                            return userEmail;
                        }
                        throw new Error("not userEmail");
                    } catch (err) {
                        return "stub";
                    }
                }
                $.post(`${booster_environment.MA_WORK_NODE_URL}/add-statistic-bpm-otp-action`, requestParams);
            };
        }, 300);
    });
}, 25000);

setTimeout(() => {
    onclick = setTimeout(() => {
        let emailButtonButton = document.querySelector('li[data-item-marker="email-message-tab"]'); //письмо
        emailButtonButton.addEventListener('dblclick', function insertNameBpmEmail() {
            setTimeout(() => {
                const userNameElement = document.getElementById('CasePageOwner0b024cd2-4fb1-4b99-bdd3-3d545f18ada9LookupEdit-link-el');
                const userNameText = userNameElement.textContent
                const userNameFull = userNameText.split(' ');
                const onlyUserName = userNameFull[1];
                const userGroupElement = document.getElementById('CasePageGroupLookupEdit-link-el'); //группа ответственных
                const userGroupText = userGroupElement.textContent
                const userGroupFull = userGroupText;
                const onlyUserGroup = userGroupFull;
                let onlyGroupFirst = (onlyUserGroup == '1-ая линия Технической Поддержки')
                if (onlyGroupFirst) {
                    document.querySelector('span[style="font-family:verdana,geneva,sans-serif"]').innerHTML = `<br>С уважением, ${onlyUserName} <br> Инженер технической поддержки MANGO OFFICE`;
                }
                let onlyGroupSecond = (onlyUserGroup == '2-ая линия Технической Поддержки')
                if (onlyGroupSecond) {
                    document.querySelector('span[style="font-family:verdana,geneva,sans-serif"]').innerHTML = `<br>С уважением, ${onlyUserName} <br> Инженер технической поддержки MANGO OFFICE`;
                }
                let onlyGroupVipline = (onlyUserGroup == 'VIP линия Технической Поддержки MANGO OFFICE')
                if (onlyGroupVipline) {
                    document.querySelector('p[style="font-family:sans-serif;font-size:16px;line-height:28px;color:#35565f"]').remove();
                    document.querySelector('p[style="font-family:sans-serif;font-size:16px;line-height:28px;color:#35565f"]').innerHTML = `<br>С уважением, ${onlyUserName} <br> Инженер VIP-линии технической поддержки`;
                }
                let onlyGroupAPI = (onlyUserGroup == 'Группа API и ДКТ Технической Поддержки')
                if (onlyGroupAPI) {
                    document.querySelector('span[style="font-family:verdana,geneva,sans-serif"]').innerHTML = `<br>С уважением, ${onlyUserName} <br> Инженер технической поддержки сервисов интеграции и коллтрекинга MANGO OFFICE`;
                }
                let onlyGroupProblem = (onlyUserGroup == 'Группа Problem Технической Поддержки')
                if (onlyGroupProblem) {
                document.querySelector('p[style="font-family:sans-serif;font-size:16px;line-height:28px;color:#35565f"]').remove();
                document.querySelector('p[style="font-family:sans-serif;font-size:16px;line-height:28px;color:#35565f"]').innerHTML = `<br>С уважением, ${onlyUserName} <br> Ведущий специалист направления качества и доработок MANGO OFFICE`;
                }
            }, 250);
            sendStatsOfBPM(' ', 'bpm_mail_sign', location.href.split("/")[8], ' ', ' ');

            function sendStatsOfBPM(email, type, from, to, note) {
                const requestParams = {
                    email: getUserEmailFromCasePage(),
                    type: type,
                    from: from,
                    to: getLs(),
                    note: note
                };

                function getLs() {
                    const lsSelector = `a#CasePageStnAccLookupEdit-link-el`;
                    const lsObject = document.querySelector(lsSelector);
                    let ls = "";
                    if (lsObject !== null) {
                        ls = lsObject.innerText;
                    }
                    return ls;
                }

                function getUserEmailFromCasePage() {
                    try {
                        const userEmail = sysValues.CURRENT_USER.displayValue;
                        if (typeof userEmail === "string" && userEmail.length > 0) {
                            return userEmail;
                        }
                        throw new Error("not userEmail");
                    } catch (err) {
                        return "stub";
                    }
                }
                $.post(`${booster_environment.MA_WORK_NODE_URL}/add-statistic-bpm-otp-action`, requestParams);
            };
        });
    }, 300);
}, 25000);


// BPM
class BPMToLkButton {
  constructor() {
    this.init();
  }
  init() {
    const MA_INNER_BUTTON_HTML = `<span style="font-size:10px">Перейти в ЛК</span>`;

    getParameters()
      .then(addButton)
      .catch((error) => {
        console.error(error);
      });

    function getParameters() {
      return new Promise((resolve) => {
        const lklabelSelector = `label[id^='CasePageStnAcc']`;
        let tryCount = 0;

        const changeLkLabelinterval = setInterval(() => {
          try {
            const labelObject = document.querySelector(lklabelSelector);

            if (labelObject) {
              clearInterval(changeLkLabelinterval);
              return resolve({ labelObject: labelObject });
            } else {
              tryCount++;
            }

            if (tryCount >= 6) {
              clearInterval(changeLkLabelinterval);
            }
          } catch (error) {
            console.error("error: ", error);
            clearInterval(changeLkLabelinterval);
          }
        }, 1200);
      });
    }

    function addButton(params) {
      const button = document.createElement("button");
      button.innerHTML = MA_INNER_BUTTON_HTML;
      button.onclick = function () {
        try {
          openLk();
        } catch (error) {
          console.error("error: ", error);
        }
      };

      params.labelObject.after(button);
    }

    function openLk() {
      const url = `${booster_environment.MA_WORK_NODE_URL}/webadmin-client/PRES-wa/lk`;

      // Изменил способ получения номера ЛС в связи с изменением html-кода на странице обращения в bpm
      const ls = getLs();

      if (ls.length > 0) {
        fetch(url)
          .then((data) =>
            data.json().then((json) => {
              try {
                if (json.data.result === true) {
                  openPage(json.data, ls);
                }
              } catch (error) {
                console.error("error: ", error);
              }
            })
          )
          .catch((error) => {
            console.error("error: ", error);
          });
      }

      function getLs() {
        const lsSelector = `a#CasePageStnAccLookupEdit-link-el`;
        const lsObject = document.querySelector(lsSelector);
        let ls = "";

        if (lsObject !== null) {
          ls = lsObject.innerText;
        }

        return ls;
      }

      function openPage(data, ls) {
        var form = document.createElement("form");
        form.target = "_blank";
        form.method = "POST";
        form.action = data["ics-url"];
        form.style.display = "none";

        // fscontrol
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "fscontrol";
        input.value = ls;
        form.appendChild(input);

        // auth-type
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "auth-type";
        input.value = "webadmin";
        form.appendChild(input);

        // ticket
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "ticket";
        input.value = data["ticket"];
        form.appendChild(input);

        // timezoneoffset
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "timezoneoffset";
        input.value = data["timezone-offset"];
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);


        BPMCommon.sendStats("bpm_to_lk", location.href.split("/")[8], ls, " ");
      }
    }
  }
}



class BPMToSDAndRMButtons {
  constructor() {
    this.init();
  }
  init() {
    getParameters()
      .then(addButtons)
      .catch((error) => {
        console.error(error);
      });

    function getParameters() {
      return new Promise((resolve) => {
        let tryCount = 0;
        const paramsInterval = setInterval(() => {
          try {
            const idMap = getIdMap();

            if (idMap.size === 2) {
              clearInterval(paramsInterval);
              return resolve({ idMap: idMap });
            }

            if (tryCount >= 5) {
              clearInterval(paramsInterval);
            }

            tryCount++;
          } catch (error) {
            console.error("mango booster error: ", error);
            clearInterval(paramsInterval);
          }
        }, 1200);
      });

      // Вспомогательные функции для getParameters
      function getIdMap() {
        const selector = "div[data-item-marker^=INTEGER]";
        const elements = document.querySelectorAll(selector);

        return parseId(elements);

        function parseId(elements) {
          const result = new Map();

          for (let entry of elements.entries()) {
            const itemMarker = entry[1].dataset.itemMarker;

            const idRm = itemMarker.match(/INTEGER(.+)\s+№\s*RM/i);

            if (idRm) {
              result.set("rm", idRm[1]);
            } else {
              const idSd = itemMarker.match(/INTEGER(.+)\s+№\s*ОМиЭ/i);

              if (idSd) {
                result.set("sd", idSd[1]);
              }
            }
          }

          return result;
        }
      }
    }

    function addButtons(params) {
      addButton(params, "rm");
      addButton(params, "sd");
    }

    function addButton(params, type) {
      const id = params.idMap.get(type);

      const controlContainer = getControlContainer(id);
      if (controlContainer.querySelector(`button#ma-go-to-${type}`) !== null) {
        return;
      }

      const button = getButton(id, type);

      controlContainer.append(button);

      // Вспомогательные функция для addButton
      function getButton(id, type) {
        const button = document.createElement("button");
        button.id = `ma-go-to-${type}`;
        button.setAttribute("style", "width:100%; max-width:78px; min-width:57px; margin:1px");
        button.innerHTML = `<span style="font-size:10px">Перейти в ${type}</span>`;

        button.onclick = function () {
          openPage(id, type);
        };

        return button;

        // Вспомогательная функция для getButton
        function openPage(id, type) {
          const input = getInputElement(id);

          if (input) {
            const value = getInputValue(input);

            if (value !== "0") {
              const [url, statisticType] = getParams(type, value);

              if (url) {
                BPMCommon.sendStats(statisticType, location.href.split("/")[8], value, " ");
                window.open(url);
              }
            }
          }

          // Вспомогательные функция для openRm
          function getParams(type, value) {
            if (type === "rm") {
              return [`http://redmine.mango.local/issues/${value}`, "bpm_to_rm"];
            } else if (type === "sd") {
              return [`http://hd/WorkOrder.do?woMode=viewWO&woID=${value}`, "bpm_to_sd"];
            }
            return [null, null];
          }

          function getInputElement(id) {
            return document.querySelector(`input#CasePageINTEGER${id}IntegerEdit-el`);
          }

          function getInputValue(input) {
            return input.value.replace(/\s/g, "");
          }
        }
      }

      function getControlContainer(id) {
        return document.querySelector(`div#CasePageINTEGER${id}Container_Control`);
      }
    }
  }
}


class BPMToRM {
    constructor() {
      this.init();
    }
    init() {

       const MA_INNER_BUTTON_HTML = `<span style="font-size:10px">RM/Jira</span>`;

      getParameters()
        .then(addButton)
        .catch((error) => {
          console.error(error);
        });

      function getParameters() {
        return new Promise((resolve) => {
          const rmlabelSelector = `label[id^='CasePageStnCaseNumber']`;
          let tryCount = 0;

          const changeRMLabelinterval = setInterval(() => {
            try {
              const labelObject = document.querySelector(rmlabelSelector);

              if (labelObject) {
                clearInterval(changeRMLabelinterval);
                return resolve({ labelObject: labelObject });
              } else {
                tryCount++;
              }

              if (tryCount >= 6) {
                clearInterval(changeRMLabelinterval);
              }
            } catch (error) {
              console.error("error: ", error);
              clearInterval(changeRMLabelinterval);
            }
          }, 1200);
        });
      }

      function addButton(params) {
        const button = document.createElement("button");
        button.innerHTML = MA_INNER_BUTTON_HTML;
        button.onclick = function () {
          try {
            openRM();
          } catch (error) {
            console.error("error: ", error);
          }
        };

        params.labelObject.after(button);
      }

      function openRM() {
        let RM_number = $('#CasePageStnCaseNumberRMIntegerEdit-el').val();
        let RM_numberfull = RM_number.replace(/\s/g, '');
        var jira_number = document.querySelector('#CasePageStnCaseNumberRMIntegerEdit-el').value;
        if (jira_number.length<7 && jira_number.length>=2) //условие для Jira
        {
            console.log("Да, это жира");
            let RM_number = $('#CasePageStnCaseNumberRMIntegerEdit-el').val();
                let RM_numberfull = RM_number.replace(/\s/g, '');
                let win = window.open(`https://jira.ru.mgo.su/browse/DITSUP-${RM_numberfull}`, '_blank');
                      win.focus();
        }
        let check_length = new RegExp("[0-9]{6}$").test(RM_numberfull);
        let check_number = new RegExp("[2,3,4]+$").test(RM_numberfull);
        if (check_number, check_length) {

            let RM_number = $('#CasePageStnCaseNumberRMIntegerEdit-el').val();
            let RM_numberfull = RM_number.replace(/\s/g, '');
            let win = window.open(`http://redmine.mango.local/issues/${RM_numberfull}`, '_blank');
                  win.focus();

             }

             sendStatsOfBPM(' ', 'bpm_to_rm', location.href.split("/")[8], ' ', ' ');

        function sendStatsOfBPM(email, type, from, to, note) {
            const requestParams = {
                email: getUserEmailFromCasePage(),
                type: type,
                from: from,
                to: getLs(),
                note: note
            };

            function getLs() {
                const lsSelector = `a#CasePageStnAccLookupEdit-link-el`;
                const lsObject = document.querySelector(lsSelector);
                let ls = "";
                if (lsObject !== null) {
                    ls = lsObject.innerText;
                }
                return ls;
            }

            function getUserEmailFromCasePage() {
                try {
                    const userEmail = sysValues.CURRENT_USER.displayValue;
                    if (typeof userEmail === "string" && userEmail.length > 0) {
                        return userEmail;
                    }
                    throw new Error("not userEmail");
                } catch (err) {
                    return "stub";
                }
            }
            $.post(`${booster_environment.MA_WORK_NODE_URL}/add-statistic-bpm-otp-action`, requestParams);
        };
      }
    }
  }


class BPMToContextButton {
  constructor() {
    this.init();
  }
  init() {
    getHtmlElements()
      .then(setOnChangeElement)
      .catch((error) => {
        console.error(error);
      });

    function getHtmlElements() {
      return new Promise((resolve) => {
        let tryCount = 0;
        const textInterval = setInterval(() => {
          try {
            const solutionContainer = getSolutionContainer();
            const solutionElement = getSolutionElement(solutionContainer);

            if (solutionContainer !== null && solutionElement !== null) {
              clearInterval(textInterval);
              return resolve({ solutionContainer: solutionContainer, solutionElement: solutionElement });
            }

            if (tryCount >= 7) {
              clearInterval(textInterval);
            }

            tryCount++;
          } catch (error) {
            console.error("mango assisstant error: ", error);
            clearInterval(textInterval);
          }
        }, 1200);
      });

      // Вспомогательные функции для getHtmlElements
      function getSolutionContainer() {
        const selector = `div[id$="-item-CasePageSolutionFieldContainerContainer"]`;
        return document.querySelector(selector);
      }

      function getSolutionElement(container) {
        if (container !== null) {
          const selector = "div.inline-text-edit-el.cke_editable.cke_editable_inline.cke_contents_ltr";
          return container.querySelector(selector);
        }
        return null;
      }
    }

    function setOnChangeElement(data) {
      const contextHtml = ` <div class="grid-layout-column ts-box-sizing  ">
                                <div class="control-width-15 control-left">
                                    <div class="label-wrap">
                                        <label class="t-label">Контексты из решения</label>
                                    </div>
                                    <div class="control-wrap" style="display:flex; flex-direction:row">
                                        <select id="mb-go-to-wa-context-select" style="width:150px;margin:0px 10px" disabled='disabled'></select>
                                        <button id="mb-go-to-wa-context-button" style="margin:0 10px" disabled='disabled'>Перейти по контексту</button>
                                    </div>
                                </div>
                            </div>`;

      data.solutionContainer.insertAdjacentHTML("afterend", contextHtml);

      const selectContextElement = document.getElementById("mb-go-to-wa-context-select");
      const buttonContext = document.getElementById("mb-go-to-wa-context-button");

      buttonContext.onclick = function () {
        try {
          if (typeof selectContextElement.value === "string" && /^\d{11}$/.test(selectContextElement.value)) {
            BPMCommon.sendStats("bpm_to_wa_context", location.href.split("/")[8], selectContextElement.value, " ");
            window.open(`http://192.168.37.150:8388/webadmin-client/PRES-wa/?context=${selectContextElement.value}#p=sswa-module-softplatform-cdrs`);
          }
        } catch (error) {
          console.error(error);
        }
      };

      data.solutionElement.onkeyup = (elem) => {
        // При изменении текста в поле "Решение" ищем в этом же поле контексты
        _setContextsHrefs(elem.target.innerText, selectContextElement, buttonContext);
      };

      // Выполняем функцию для нахождения контекстов в поле "Решение" до измненения текста, так как в этом поле возможно уже изначально есть контексты
      _setContextsHrefs(data.solutionElement.innerText, selectContextElement, buttonContext);

      // Вспомогательные функции для setOnChangeElement
      function _setContextsHrefs(text, selectContextElement, buttonContext) {
        selectContextElement.innerHTML = "";
        selectContextElement.setAttribute("disabled", "disabled");
        buttonContext.setAttribute("disabled", "disabled");
        const contextArray = _getContextList(text);

        if (contextArray.length > 0) {
          contextArray.forEach((element) => {
            const option = document.createElement("option");
            option.innerText = element;
            option.value = element;
            selectContextElement.append(option);
          });
          selectContextElement.removeAttribute("disabled");
          buttonContext.removeAttribute("disabled");
        }
      }

      function _getContextList(text) {
        const contextArray = [];

        for (let i = 0; i < text.length; i++) {
          if (text[i] === "1") {
            let context = text[i];
            for (let t = i + 1; t < i + 11; t++) {
              if (/\d/.test(text[t])) {
                context += text[t];
                if (t === i + 10) {
                  contextArray.push(context);
                  i = t + 1;
                  break;
                }
              } else {
                i = t + 1;
                break;
              }
            }
          }
        }

        return contextArray;
      }
    }
  }
}



//---------------------------------------------
class BPMCaseToAccountButton {
  constructor() {
    this.init();
  }

  init() {
    const MA_INNER_BUTTON_HTML = `<span style="font-size:10px">История обращений</span>`;

    getParameters()
      .then(addButton)
      .catch((error) => {
        console.error(error);
      });

    function getParameters() {
      return new Promise((resolve) => {
        const accountlabelSelector = `#CasePageCaseAccountContainer_Label`;
        let tryCount = 0;

        const changeAccountLabelinterval = setInterval(() => {
          try {
            const labelObject = document.querySelector(accountlabelSelector);

            if (labelObject) {
              clearInterval(changeAccountLabelinterval);
              return resolve({ labelObject: labelObject });
            } else {
              tryCount++;
            }

            if (tryCount >= 12) {
              clearInterval(changeAccountLabelinterval);
            }
          } catch (error) {
            console.error("error: ", error);
            clearInterval(changeAccountLabelinterval);
          }
        }, 1200);
      });
    }

    function addButton(params) {
      if ($(`button#ma-case-to-account-button`).length) {
        return;
      }

      const button = document.createElement("button");
      button.id = "ma-case-to-account-button";
      button.innerHTML = MA_INNER_BUTTON_HTML;
      button.onclick = onButtonClick;

      params.labelObject.append(button);
    }

    function onButtonClick(event){
        event.preventDefault();
        try {
          const hrefCaseAccountSelector = `#CasePageCaseAccountLookupEdit-link-el`;
          const hrefCaseAccountObject = document.querySelector(hrefCaseAccountSelector);
          if (hrefCaseAccountObject) {
            const caseAccountMatch = hrefCaseAccountObject.href.match(/edit\/(.+)/);
            if (caseAccountMatch) {
              const caseAccountId = caseAccountMatch[1];
              const requestBody = getAccountRequestBody(caseAccountId);
              openAccountInfoPage(requestBody, caseAccountId, hrefCaseAccountObject.innerText);
            }
          }
        } catch (error) {
          console.error("error: ", error);
        }
      };

    function openAccountInfoPage(requestBody, caseAccountId, caseAccountName) {
      const bpmcsrfCookie = BPMCommon.getCookie("BPMCSRF");
      if (bpmcsrfCookie) {
        fetch(`http://${location.hostname}/0/DataService/json/SyncReply/SelectQuery`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            BPMCSRF: bpmcsrfCookie,
            Connection: "keep-alive",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => response.json())
          .then((data) => {
            const parseData = parseBpmAccountTableData(data.rows);
            buildHtmlPage(parseData, caseAccountId, caseAccountName, bpmcsrfCookie);
          });
      }
    }

    function parseBpmAccountTableData(data) {
      return data && data.length ? data.sort(compare) : [];

      function compare(a, b) {
        if (a.CreatedOn < b.CreatedOn) {
          return 1;
        }
        if (a.CreatedOn > b.CreatedOn) {
          return -1;
        }
        return 0;
      }
    }

    function buildHtmlPage(data, caseAccountId, caseAccountName, bpmcsrfCookie) {
      const html = `   ${getStyleForHtmlPage()}
                        <title>История обращений контрагента</title>
                        <h3>История обращений контрагента "${caseAccountName}" на ${Date()}</h3>
                        <input type="text" placeholder="Фильтр" id="search-text" onkeyup="tableSearch()">
                        ${getTableForHtmlPage(data)}
                        ${getScriptForHtmlPage()}
                    `;

      const newPage = window.open("about:blank", "История обращений контрагента") ;

      newPage.document.open();
      newPage.document.write(html);
      newPage.document.close();

      // Отправка статистики
      const caseId = location.href.split("/")[8];
      const statusRequestBody = getStatusRequestBody(caseId);

      fetch(`http://${location.hostname}/0/DataService/json/SyncReply/SelectQuery`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
          BPMCSRF: bpmcsrfCookie,
          Connection: "keep-alive",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statusRequestBody),
      })
        .then((response) => response.json())
        .then((data) => {
          try {
            let status = "Новое";
            if (data.rows.length) {
              status = data.rows[data.rows.length - 1].Status.displayValue;
            }
            BPMCommon.sendStats("bpm_case_to_account", caseId, caseAccountId, status);
          } catch (error) {
            console.error(error);
          }
        });
    }

    function getScriptForHtmlPage() {
      return `
                <script>
                    function tableSearch() {
                        var phrase = document.getElementById('search-text');
                        var table = document.getElementById('info-table');
                        var regPhrase = new RegExp(phrase.value, 'i');
                        var flag = false;
                        for (var i = 1; i < table.rows.length; i++) {
                            flag = false;
                            for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
                                flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
                                if (flag) break;
                            }
                            if (flag) {
                                table.rows[i].style.display = "";
                            } else {
                                table.rows[i].style.display = "none";
                            }

                        }
                    }
                </script>

                <script>
                    function openLk(ls) {
                        const url = "${booster_environment.MA_WORK_NODE_URL}/webadmin-client/PRES-wa/lk";

                        fetch(url)
                            .then((data) =>
                            data.json().then((json) => {
                                try {
                                    if (json.data.result === true) {
                                        openPage(json.data, ls);
                                    }
                                } catch (error) {
                                    console.error("error: ", error);
                                }
                            })
                            )
                            .catch((error) => {
                                console.error("error: ", error);
                            });


                        function openPage(data, ls) {
                            var form = document.createElement("form");
                            form.target = "_blank";
                            form.method = "POST";
                            form.action = data["ics-url"];
                            form.style.display = "none";

                            // fscontrol
                            var input = document.createElement("input");
                            input.type = "hidden";
                            input.name = "fscontrol";
                            input.value = ls;
                            form.appendChild(input);

                            // auth-type
                            var input = document.createElement("input");
                            input.type = "hidden";
                            input.name = "auth-type";
                            input.value = "webadmin";
                            form.appendChild(input);

                            // ticket
                            var input = document.createElement("input");
                            input.type = "hidden";
                            input.name = "ticket";
                            input.value = data["ticket"];
                            form.appendChild(input);

                            // timezoneoffset
                            var input = document.createElement("input");
                            input.type = "hidden";
                            input.name = "timezoneoffset";
                            input.value = data["timezone-offset"];
                            form.appendChild(input);

                            document.body.appendChild(form);
                            form.submit();
                            document.body.removeChild(form);

                            sendStats("bpm_to_lk", "${location.href.split("/")[8]}", ls, " ");
                        }
                    }

                    function sendStats(type, from, to, note) {
                        const requestParams = {
                          email: "${BPMCommon.getUserEmailFromCasePage()}",
                          type: type,
                          from: from,
                          to: to,
                          note: note
                        };

                        const formBody = [];
                        for (let param in requestParams) {
                            const encodedKey = encodeURIComponent(param);
                            const encodedValue = encodeURIComponent(requestParams[param]);
                            formBody.push(encodedKey + "=" + encodedValue);
                        }
                        const body = formBody.join("&");

                        fetch("${booster_environment.MA_WORK_NODE_URL}/add-statistic-bpm-otp-action", {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                            },
                            body: body
                        });
                      }
                </script>
                `;
    }

    function getTableForHtmlPage(data) {
      let table = `<table id="info-table" style="table-layout: fixed;">
                        <colgroup>
                            <col style="width:82px;">
                            <col>
                            <col style="width:82px;">
                            <col>
                            <col style="width:70px;">
                            <col style="width:170px;">
                            <col style="width:300px">
                            <col style="width:300px">
                            <col>
                            <col>
                            <col style="width:110px">
                            <col>
                            <col>
                            <col>
                        </colgroup>
                        <tr>
                            <th>Номер</th>
                            <th>Дата создания</th>
                            <th>Состояние</th>
                            <th>Контакт</th>
                            <th>Лицевой счет</th>
                            <th>Тема</th>
                            <th>Описание</th>
                            <th>Решение</th>
                            <th>Группа ответственных</th>
                            <th>Ответственный</th>
                            <th>Категория</th>
                            <th>Категория сервиса</th>
                            <th>Сервис</th>
                            <th>Родительское обращение</th>
                        </tr>`;

      data.forEach((element) => {
        table += `  <tr>
                        <td>
                        <a href="http://${location.hostname}/0/Nui/ViewModule.aspx#CardModuleV2/CasePage/edit/${element.Id}" target="_blank">
                                ${element.Number}
                            </a>
                        </td>
                        <td class="td_white-space_pre">${getDateWithRightFormat(parseUndefinedToEmptyString(element.CreatedOn))}</td>
                        <td>${parseUndefinedToEmptyString(element.Status.displayValue)}</td>
                        <td>${parseUndefinedToEmptyString(element.Contact.displayValue)}</td>
                        <td>${createAccountButton(element.StnAcc)}</td>
                        <td>${parseUndefinedToEmptyString(element.Subject)}</td>
                        <td>${parseUndefinedToEmptyString(element.Symptoms)}</td>
                        <td>${parseUndefinedToEmptyString(element.Solution)}</td>
                        <td>${parseUndefinedToEmptyString(element.Group.displayValue)}</td>
                        <td>${parseUndefinedToEmptyString(element.Owner.displayValue)}</td>
                        <td style="word-wrap: break-word;">${parseUndefinedToEmptyString(element.Category.displayValue)}</td>
                        <td>${parseUndefinedToEmptyString(element.ServiceCategory.displayValue)}</td>
                        <td>${parseUndefinedToEmptyString(element.ServiceItem.displayValue)}</td>
                        <td>${
                          element.ParentCase.displayValue
                            ? `<a href="http://${location.hostname}/0/Nui/ViewModule.aspx#CardModuleV2/CasePage/edit/${element.ParentCase.value}" target="_blank">
                                                                    ${element.ParentCase.displayValue}
                                                                </a>`
                            : ""
                        }
                        </td>
                    </tr>
                `;
      });

      table += `</table>`;
      return table;
    }

    function createAccountButton(accountObject) {
      const accountName = parseUndefinedToEmptyString(accountObject.displayValue);

      if (accountName.length) {
        return `<button onclick="openLk('${accountName}')">${accountName}</button>`;
      }

      return accountName;
    }

    function parseUndefinedToEmptyString(element){
        return element || ""
    }

    function getDateWithRightFormat(stringDate) {
      if (stringDate.length) {
        const substrDate = stringDate.substring(0, stringDate.length - 7);
        const match = substrDate.match(/(\d{4})\-(\d{2})\-(\d{2})T(\d{2})\:(\d{2})/);
        if (match) {
          return `${match[3]}/${match[2]}/${match[1]}\n${match[4]}:${match[5]}`;
        }
      }
      return "";
    }

    function getStyleForHtmlPage() {
      return `<style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    table button {
                        background: none!important;
                        border: none;
                        padding: 0!important;
                        font-family: arial, sans-serif;
                        color: #069;
                        text-decoration: underline;
                        cursor: pointer;
                    }

                    th {
                        text-align: center; /* Выравнивание по левому краю */
                        background: #ccc; /* Цвет фона ячеек */
                        padding: 5px; /* Поля вокруг содержимого ячеек */
                        border: 1px solid black; /* Граница вокруг ячеек */
                        font-size: 10pt;
                        }

                    td {
                        overflow-y: auto;
                        padding: 5px; /* Поля вокруг содержимого ячеек */
                        border: 1px solid black; /* Граница вокруг ячеек */
                        font-size: 10pt;
                        }

                    input {
                        margin: 10px 0;
                    }

                    .td_white-space_pre {
                        white-space: pre;
                    }
                </style>`;
    }

    function getAccountRequestBody(caseAccountId) {
      return {
        rootSchemaName: "Case",
        operationType: 0,
        filters: {
          items: {
            "0dad30e1-9b47-42d1-b3ae-1afb6797a1ea": {
              items: {
                masterRecordFilter: {
                  filterType: 1,
                  comparisonType: 3,
                  isEnabled: true,
                  trimDateTimeParameterToDate: false,
                  leftExpression: { expressionType: 0, columnPath: "Account" },
                  rightExpression: { expressionType: 2, parameter: { dataValueType: 1, value: caseAccountId } },
                },
              },
              logicalOperation: 0,
              isEnabled: true,
              filterType: 6,
            },
          },
          logicalOperation: 0,
          isEnabled: true,
          filterType: 6,
        },
        columns: {
          items: {
            Id: { caption: "", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Id" } },
            Number: { caption: "", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Number" } },
            CreatedOn: { caption: "Дата создания", orderDirection: 2, orderPosition: 1, isVisible: true, expression: { expressionType: 0, columnPath: "CreatedOn" } },
            Status: { caption: "Состояние", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Status" } },
            Contact: { caption: "Контакт", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Contact" } },
            StnAcc: { caption: "Лицевой счет", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "StnAcc" } },
            Subject: { caption: "Тема", orderDirection: 2, orderPosition: 1, isVisible: true, expression: { expressionType: 0, columnPath: "Subject" } },
            Symptoms: { caption: "Описание", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Symptoms" } },
            Solution: { caption: "Решение", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Solution" } },
            Group: { caption: "Группа ответственных", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Group" } },
            Owner: { caption: "Ответственный", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Owner" } },
            Category: { caption: "Категория", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Category" } },
            ServiceCategory: {
              caption: "Категория сервиса",
              orderDirection: 0,
              orderPosition: -1,
              isVisible: true,
              expression: { expressionType: 0, columnPath: "ServiceCategory" },
            },
            ServiceItem: { caption: "Сервис", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "ServiceItem" } },
            ParentCase: { caption: "Родительское обращение", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "ParentCase" } },
            EntryPointsCount: {
              caption: "",
              orderDirection: 0,
              orderPosition: -1,
              isVisible: true,
              expression: {
                expressionType: 3,
                aggregationType: 1,
                columnPath: "[EntryPoint:EntityId].Id",
                subFilters: {
                  items: {
                    "3eec561d-abe0-45f2-895f-602a503d5f20": {
                      filterType: 1,
                      comparisonType: 3,
                      isEnabled: true,
                      trimDateTimeParameterToDate: false,
                      leftExpression: { expressionType: 0, columnPath: "IsActive" },
                      rightExpression: { expressionType: 2, parameter: { dataValueType: 1, value: true } },
                    },
                  },
                  logicalOperation: 0,
                  isEnabled: true,
                  filterType: 6,
                },
              },
            },
          },
        },
        isDistinct: false,
        rowCount: 100,
        rowsOffset: 0,
        isPageable: true,
        allColumns: false,
        useLocalization: true,
        useRecordDeactivation: false,
        serverESQCacheParameters: { cacheLevel: 0, cacheGroup: "", cacheItemName: "" },
        queryOptimize: false,
        useMetrics: false,
        querySource: 0,
        ignoreDisplayValues: false,
        conditionalValues: null,
        isHierarchical: false,
      };
    }

    function getStatusRequestBody(caseId) {
      return {
        rootSchemaName: "CaseLifecycle",
        operationType: 0,
        filters: {
          items: {
            "76ea03dc-a6eb-4dc6-af0b-f76f6fe90cd7": {
              items: {
                masterRecordFilter: {
                  filterType: 1,
                  comparisonType: 3,
                  isEnabled: true,
                  trimDateTimeParameterToDate: false,
                  leftExpression: { expressionType: 0, columnPath: "Case" },
                  rightExpression: { expressionType: 2, parameter: { dataValueType: 1, value: caseId } },
                },
              },
              logicalOperation: 0,
              isEnabled: true,
              filterType: 6,
            },
          },
          logicalOperation: 0,
          isEnabled: true,
          filterType: 6,
        },
        columns: {
          items: {
            Id: { caption: "", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Id" } },
            StartDate: { caption: "Дата начала", orderDirection: 1, orderPosition: 1, isVisible: true, expression: { expressionType: 0, columnPath: "StartDate" } },
            EndDate: { caption: "Дата завершения", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "EndDate" } },
            Status: { caption: "Состояние", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Status" } },
            Priority: { caption: "Приоритет", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Priority" } },
            Owner: { caption: "Ответственный", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Owner" } },
            Group: { caption: "Группа ответственных", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Group" } },
            EntryPointsCount: {
              caption: "",
              orderDirection: 0,
              orderPosition: -1,
              isVisible: true,
              expression: {
                expressionType: 3,
                aggregationType: 1,
                columnPath: "[EntryPoint:EntityId].Id",
                subFilters: {
                  items: {
                    "7e6de9fa-5614-43d3-b9fe-e155625a59f2": {
                      filterType: 1,
                      comparisonType: 3,
                      isEnabled: true,
                      trimDateTimeParameterToDate: false,
                      leftExpression: { expressionType: 0, columnPath: "IsActive" },
                      rightExpression: { expressionType: 2, parameter: { dataValueType: 1, value: true } },
                    },
                  },
                  logicalOperation: 0,
                  isEnabled: true,
                  filterType: 6,
                },
              },
            },
          },
        },
        isDistinct: false,
        rowCount: 10,
        rowsOffset: 0,
        isPageable: true,
        allColumns: false,
        useLocalization: true,
        useRecordDeactivation: false,
        serverESQCacheParameters: { cacheLevel: 0, cacheGroup: "", cacheItemName: "" },
        queryOptimize: false,
        useMetrics: false,
        querySource: 0,
        ignoreDisplayValues: false,
        conditionalValues: null,
        isHierarchical: false,
      };
    }
  }
}


//контрагент
class BPMCaseToAccountDateButton {
    constructor() {
      this.init();
    }

    init() {
      const MA_INNER_BUTTON_HTML = `<span style="font-size:14px">Информация о контрагенте</span>`;

      getParameters()
        .then(addButton)
        .catch((error) => {
          console.error(error);
        });

        function getParameters() {
          return new Promise((resolve) => {
            const AbonentContainer = `#CasePageMngAbonentContainer_Label`;
            let tryCount = 0;

            const changeAbonentContainer = setInterval(() => {
              try {
                const labelObject = document.querySelector(AbonentContainer);

                if (labelObject) {
                  clearInterval(changeAbonentContainer);
                  return resolve({ labelObject: labelObject });
                } else {
                  tryCount++;
                }

                if (tryCount >= 12) {
                  clearInterval(changeAbonentContainer);
                }
              } catch (error) {
                console.error("error: ", error);
                clearInterval(changeAbonentContainer);
              }
            }, 1200);
          });
        }

      function addButton(params) {
        if ($(`button#ma-case-to-account`).length) {
          return;
        }

        const button = document.createElement("button");
        button.id = "ma-case-to-account";
        button.innerHTML = MA_INNER_BUTTON_HTML;
        button.onclick = onButtonClickAuto;

        params.labelObject.append(button);
      }

      function onButtonClickAuto(event){
        try {
          const hrefCaseAccountSelector = `#CasePageCaseAccountLookupEdit-link-el`;
          const hrefCaseAccountObject = document.querySelector(hrefCaseAccountSelector);
          if (hrefCaseAccountObject) {
            const caseAccountMatch = hrefCaseAccountObject.href.match(/edit\/(.+)/);
            if (caseAccountMatch) {
              const caseAccountId = caseAccountMatch[1];
              const requestBody = getAccountRequestBody(caseAccountId);
                openAccountInfoPage(requestBody, caseAccountId, hrefCaseAccountObject.innerText);
            }
          }
        } catch (error) {
          console.error("error: ", error);
        }
      };


    function openAccountInfoPage(requestBody, caseAccountId, caseAccountName) {
      const bpmcsrfCookie = BPMCommon.getCookie("BPMCSRF");
      if (bpmcsrfCookie) {
        fetch(`http://${location.hostname}/0/DataService/json/SyncReply/SelectQuery`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            BPMCSRF: bpmcsrfCookie,
            Connection: "keep-alive",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => response.json())
          .then((data) => {
                const parseData = parseBpmAccountTableData(data.rows);
                const parseTime = CalculateDate(data.rows);
                // if (parseTime) { // временно убрал, потому что пока приняли решение не использовать данный функционал. 
                //     buildHtmlAgentPage(parseTime, caseAccountId, caseAccountName, bpmcsrfCookie);
                // } else {
                    buildHtmlPage(parseData, caseAccountId, caseAccountName, bpmcsrfCookie);
                // }
          });
      }
    }

    function CalculateDate(data) {
        let dateAgent = data[0].CreatedOn;
        let currentDate = new Date();
        let date1 = new Date(dateAgent);
        let date2 = new Date(currentDate);
        let Difference_In_Time = date2.getTime() - date1.getTime();
        let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        let countEmployers = data[0].StnEmployeeCount;
        if (countEmployers >= 50 && Difference_In_Days <=120){
        return data;
        }
    };

    function parseBpmAccountTableData(data) {
        return data && data.length ? data.sort(compare) : [];

        function compare(a, b) {
          if (a.CreatedOn < b.CreatedOn) {
            return 1;
          }
          if (a.CreatedOn > b.CreatedOn) {
            return -1;
          }
          return 0;
        }
      }

      function buildHtmlPage(data, caseAccountId, caseAccountName, bpmcsrfCookie) {
        const html = `   ${getStyleForHtmlPage()}
                          <title>Информация о контрагенте</title>
                          ${getTableForHtmlPage(data)}
                          ${getScriptForHtmlPage()}
                      `;

          const newPageMini = window.open("about:blank", "Информация о контрагенте", "scrollbars=yes,resizable=yes,status=no,location=no,toolbar=no,menubar=no,width=600,height=120,left=1400,top=200");

        newPageMini.document.open();
        newPageMini.document.write(html);
        newPageMini.document.close();

   // Отправка статистики
   const caseId = location.href.split("/")[8];
   const statusRequestBody = getStatusRequestBody(caseId);

   fetch(`http://${location.hostname}/0/DataService/json/SyncReply/SelectQuery`, {
     method: "POST",
     headers: {
       Accept: "*/*",
       "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
       BPMCSRF: bpmcsrfCookie,
       Connection: "keep-alive",
       "Accept-Encoding": "gzip, deflate",
       "Content-Type": "application/json",
     },
     body: JSON.stringify(statusRequestBody),
   })
     .then((response) => response.json())
     .then((data) => {
       try {
         let status = "Новое";
         if (data.rows.length) {
           status = data.rows[data.rows.length - 1].Status.displayValue;
         }
         BPMCommon.sendStats("bpm_case_to_agent", caseId, caseAccountId, status);
       } catch (error) {
         console.error(error);
       }
     });
 }

      function buildHtmlAgentPage(data, caseAccountId, caseAccountName, bpmcsrfCookie) {
        const html = `   ${getStyleForHtmlPage()}
                          <title>Информация о контрагенте на внедрении</title>
                          <h2 style="color:Red;">Клиент на Внедрении!<br>Перевести на Группу Внедрения (доб. 333)</h2>
                          ${getTableForHtmlAgent(data)}
                          ${getScriptForHtmlPage()}
                      `;

          const newPageMini = window.open("about:blank", "Информация о контрагенте на внедрении", "scrollbars=yes,resizable=yes,status=no,location=no,toolbar=no,menubar=no,width=700,height=200,left=1400,top=200");

        newPageMini.document.open();
        newPageMini.document.write(html);
        newPageMini.document.close();

   // Отправка статистики
   const caseId = location.href.split("/")[8];
   const statusRequestBody = getStatusRequestBody(caseId);

   fetch(`http://${location.hostname}/0/DataService/json/SyncReply/SelectQuery`, {
     method: "POST",
     headers: {
       Accept: "*/*",
       "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
       BPMCSRF: bpmcsrfCookie,
       Connection: "keep-alive",
       "Accept-Encoding": "gzip, deflate",
       "Content-Type": "application/json",
     },
     body: JSON.stringify(statusRequestBody),
   })
     .then((response) => response.json())
     .then((data) => {
       try {
         let status = "Новое";
         if (data.rows.length) {
           status = data.rows[data.rows.length - 1].Status.displayValue;
         }
         BPMCommon.sendStats("bpm_case_to_agent_implementation", caseId, caseAccountId, status);
       } catch (error) {
         console.error(error);
       }
     });
 }

      function getScriptForHtmlPage() {
        return `
                  <script>
                      function tableSearch() {
                          var phrase = document.getElementById('search-text');
                          var table = document.getElementById('info-table');
                          var regPhrase = new RegExp(phrase.value, 'i');
                          var flag = false;
                          for (var i = 1; i < table.rows.length; i++) {
                              flag = false;
                              for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
                                  flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
                                  if (flag) break;
                              }
                              if (flag) {
                                  table.rows[i].style.display = "";
                              } else {
                                  table.rows[i].style.display = "none";
                              }

                          }
                      }
                  </script>

                  <script>
                      function openLk(ls) {
                          const url = "${booster_environment.MA_WORK_NODE_URL}/webadmin-client/PRES-wa/lk";

                          fetch(url)
                              .then((data) =>
                              data.json().then((json) => {
                                  try {
                                      if (json.data.result === true) {
                                          openPage(json.data, ls);
                                      }
                                  } catch (error) {
                                      console.error("error: ", error);
                                  }
                              })
                              )
                              .catch((error) => {
                                  console.error("error: ", error);
                              });


                          function openPage(data, ls) {
                              var form = document.createElement("form");
                              form.target = "_blank";
                              form.method = "POST";
                              form.action = data["ics-url"];
                              form.style.display = "none";

                              // fscontrol
                              var input = document.createElement("input");
                              input.type = "hidden";
                              input.name = "fscontrol";
                              input.value = ls;
                              form.appendChild(input);

                              // auth-type
                              var input = document.createElement("input");
                              input.type = "hidden";
                              input.name = "auth-type";
                              input.value = "webadmin";
                              form.appendChild(input);

                              // ticket
                              var input = document.createElement("input");
                              input.type = "hidden";
                              input.name = "ticket";
                              input.value = data["ticket"];
                              form.appendChild(input);

                              // timezoneoffset
                              var input = document.createElement("input");
                              input.type = "hidden";
                              input.name = "timezoneoffset";
                              input.value = data["timezone-offset"];
                              form.appendChild(input);

                              document.body.appendChild(form);
                              form.submit();
                              document.body.removeChild(form);

                              sendStats("bpm_to_lk", "${location.href.split("/")[8]}", ls, " ");
                          }
                      }

                      function sendStats(type, from, to, note) {
                          const requestParams = {
                            email: "${BPMCommon.getUserEmailFromCasePage()}",
                            type: type,
                            from: from,
                            to: to,
                            note: note
                          };

                          const formBody = [];
                          for (let param in requestParams) {
                              const encodedKey = encodeURIComponent(param);
                              const encodedValue = encodeURIComponent(requestParams[param]);
                              formBody.push(encodedKey + "=" + encodedValue);
                          }
                          const body = formBody.join("&");

                          fetch("${booster_environment.MA_WORK_NODE_URL}/add-statistic-bpm-otp-action", {
                              method: "POST",
                              headers: {
                                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                              },
                              body: body
                          });
                        }
                  </script>
                  `;
      }

       function getTableForHtmlAgent(data) {
        let table = `<table id="info-table" style="table-layout: fixed;">
                          <colgroup>
                              <col style="width:120px">
                              <col style="width:120px">
                              <col style="width:120px">
                              <col style="width:150px">
                              <col style="width:120px">
                          </colgroup>
                          <tr>
                              <th>Дата создания агента</th>
                              <th>Количество сотрудников</th>
                              <th>Категория Контрагента</th>
                              <th>Статус работы с клиентом</th>
                              <th>Компания</th>
                          </tr>`;

        data.forEach((element) => {
          table += `  <tr>
                          <td class="td_white-space_pre">${getDateWithRightFormat(parseUndefinedToEmptyString(element.CreatedOn))}</td>
                          <td>${parseUndefinedToEmptyString(element.StnEmployeeCount)}</td>
                          <td>${parseUndefinedToEmptyString(element.AccountCategory.displayValue)}</td>
                          <td class="td_yellow-space_pre">${parseUndefinedToEmptyString(element.MngClientWorkStatus.displayValue)}</td>
                          <td>${parseUndefinedToEmptyString(element.Customer.displayValue)}</td>
                      </tr>
                  `;
        });

        table += `</table>`;
        return table;

      }

       function getTableForHtmlPage(data) {
        let table = `<table id="info-table" style="table-layout: fixed;">
                 <colgroup>
                              <col style="width:120px">
                              <col style="width:120px">
                              <col style="width:120px">
                              <col style="width:150px">
                              <col style="width:120px">
                          </colgroup>
                          <tr>
                              <th>Дата создания агента</th>
                              <th>Количество сотрудников</th>
                              <th>Категория Контрагента</th>
                              <th>Статус работы с клиентом</th>
                              <th>Компания</th>
                          </tr>`;

        data.forEach((element) => {
          table += `  <tr>
                          <td class="td_white-space_pre">${getDateWithRightFormat(parseUndefinedToEmptyString(element.CreatedOn))}</td>
                          <td>${parseUndefinedToEmptyString(element.StnEmployeeCount)}</td>
                          <td>${parseUndefinedToEmptyString(element.AccountCategory.displayValue)}</td>
                          <td class="td_yellow-space_pre">${parseUndefinedToEmptyString(element.MngClientWorkStatus.displayValue)}</td>
                          <td>${parseUndefinedToEmptyString(element.Customer.displayValue)}</td>
                      </tr>
                  `;
        });

        table += `</table>`;
        return table;

      }

      function parseUndefinedToEmptyString(element){
            return element || ""
      }

      function getDateWithRightFormat(stringDate) {
        if (stringDate.length) {
          const substrDate = stringDate.substring(0, stringDate.length - 7);
          const match = substrDate.match(/(\d{4})\-(\d{2})\-(\d{2})T(\d{2})\:(\d{2})/);
          if (match) {
              return `${match[3]}/${match[2]}/${match[1]}`;
            }
        }
        return "";
      }

      function getStyleForHtmlPage() {
        return `<style>
                      table {
                          width: 100%;
                          border-collapse: collapse;
                      }

                      table button {
                          background: none!important;
                          border: none;
                          padding: 0!important;
                          font-family: arial, sans-serif;
                          color: #069;
                          text-decoration: underline;
                          cursor: pointer;
                      }

                      th {
                          text-align: center; /* Выравнивание по левому краю */
                          background: #ccc; /* Цвет фона ячеек */
                          padding: 5px; /* Поля вокруг содержимого ячеек */
                          border: 1px solid black; /* Граница вокруг ячеек */
                          font-size: 10pt;
                          }

                      td {
                          overflow-y: auto;
                          padding: 5px; /* Поля вокруг содержимого ячеек */
                          border: 1px solid black; /* Граница вокруг ячеек */
                          font-size: 10pt;
                          }

                      input {
                          margin: 10px 0;
                      }

                      .td_white-space_pre {
                          white-space: pre;
                      }
                      .td_yellow-space_pre {
                        font-size: 16px;
                        font-weight: bold;
                        text-align: center;
                        text-decoration: underline;
                        color: black;
                      }
                  </style>`;
      }



      function getAccountRequestBody(caseAccountId) {
        return {
          rootSchemaName: "Account",
          operationType: 0,
          filters: {
            items: {
                primaryColumnFilter: {
                    filterType: 1,
                    comparisonType: 3,
                    isEnabled: true,
                    trimDateTimeParameterToDate: false,
                    leftExpression: { expressionType: 1, functionType: 1, macrosType: 34},
                    rightExpression: { expressionType: 2, parameter: { dataValueType: 0, value: caseAccountId } },
                    isEnabled: true,
                  },
            },
            logicalOperation: 0,
            isEnabled: true,
            filterType: 6,
          },
       columns: {
            items: {
            Id: { caption: "", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Id" } },
              CreatedOn: { caption: "Дата создания агента", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "CreatedOn" } },
              StnEmployeeCount: { caption: "Количество сотрудников", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "StnEmployeeCount"} },
              AccountCategory: { caption: "Категория Контрагента", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "AccountCategory"} },
              MngClientWorkStatus: { caption: "Cтатус работы с клиентом", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "MngClientWorkStatus"} },
              Customer: { caption: "Компания",  orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Customer"} },
            },
          },
          isDistinct: false,
          rowCount: -1,
          rowsOffset: -1,
          isPageable: false,
          allColumns: false,
          useLocalization: true,
          useRecordDeactivation: false,
          serverESQCacheParameters: { cacheLevel: 0, cacheGroup: "", cacheItemName: "" },
          queryOptimize: false,
          useMetrics: false,
          querySource: 0,
          ignoreDisplayValues: false,
          isHierarchical: false,
        };
      }
      function getStatusRequestBody(caseId) {
        return {
          rootSchemaName: "CaseLifecycle",
          operationType: 0,
          filters: {
            items: {
              "76ea03dc-a6eb-4dc6-af0b-f76f6fe90cd7": {
                items: {
                  masterRecordFilter: {
                    filterType: 1,
                    comparisonType: 3,
                    isEnabled: true,
                    trimDateTimeParameterToDate: false,
                    leftExpression: { expressionType: 0, columnPath: "Case" },
                    rightExpression: { expressionType: 2, parameter: { dataValueType: 1, value: caseId } },
                  },
                },
                logicalOperation: 0,
                isEnabled: true,
                filterType: 6,
              },
            },
            logicalOperation: 0,
            isEnabled: true,
            filterType: 6,
          },
        columns: {
            items: {
              Id: { caption: "", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Id" } },
              StartDate: { caption: "Дата начала", orderDirection: 1, orderPosition: 1, isVisible: true, expression: { expressionType: 0, columnPath: "StartDate" } },
              EndDate: { caption: "Дата завершения", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "EndDate" } },
              Status: { caption: "Состояние", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Status" } },
              Priority: { caption: "Приоритет", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Priority" } },
              Owner: { caption: "Ответственный", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Owner" } },
              Group: { caption: "Группа ответственных", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Group" } },
              EntryPointsCount: {
                caption: "",
                orderDirection: 0,
                orderPosition: -1,
                isVisible: true,
                expression: {
                  expressionType: 3,
                  aggregationType: 1,
                  columnPath: "[EntryPoint:EntityId].Id",
                  subFilters: {
                    items: {
                      "7e6de9fa-5614-43d3-b9fe-e155625a59f2": {
                        filterType: 1,
                        comparisonType: 3,
                        isEnabled: true,
                        trimDateTimeParameterToDate: false,
                        leftExpression: { expressionType: 0, columnPath: "IsActive" },
                        rightExpression: { expressionType: 2, parameter: { dataValueType: 1, value: true } },
                      },
                    },
                    logicalOperation: 0,
                    isEnabled: true,
                    filterType: 6,
                  },
                },
              },
            },
          },
          isDistinct: false,
          rowCount: 10,
          rowsOffset: 0,
          isPageable: true,
          allColumns: false,
          useLocalization: true,
          useRecordDeactivation: false,
          serverESQCacheParameters: { cacheLevel: 0, cacheGroup: "", cacheItemName: "" },
          queryOptimize: false,
          useMetrics: false,
          querySource: 0,
          ignoreDisplayValues: false,
          conditionalValues: null,
          isHierarchical: false,
        };
      }
    }
  }

  setTimeout((onButtonClickAuto) => {
    document.getElementById('ma-case-to-account').onclick();
   }, 21000);

//Автоматическое открытие истории обращений
class BPMCaseToAccountButtonAuto {
  constructor() {
    this.init();
  }

  init() {
    const MA_INNER_BUTTON_HTML = `<span style="font-size:10px">Краткая История</span>`;

    getParameters()
      .then(addButton)
      .catch((error) => {
        console.error(error);
      });

    function getParameters() {
      return new Promise((resolve) => {
        const accountlabelSelector = `#CasePageCreatedOnContainer_Label`;
        let tryCount = 0;

        const changeAccountLabelinterval = setInterval(() => {
          try {
            const labelObject = document.querySelector(accountlabelSelector);

            if (labelObject) {
              clearInterval(changeAccountLabelinterval);
              return resolve({ labelObject: labelObject });
            } else {
              tryCount++;
            }

            if (tryCount >= 12) {
              clearInterval(changeAccountLabelinterval);
            }
          } catch (error) {
            console.error("error: ", error);
            clearInterval(changeAccountLabelinterval);
          }
        }, 1200);
      });
    }

    function addButton(params) {
      if ($(`button#ma-case-to-account-button-auto`).length) {
        return;
      }

      const button = document.createElement("button");
      button.id = "ma-case-to-account-button-auto";
      button.innerHTML = MA_INNER_BUTTON_HTML;
      button.onclick = onButtonClickAuto;

      params.labelObject.append(button);
    }

    function onButtonClickAuto(event){
        try {
          const hrefCaseAccountSelector = `#CasePageCaseAccountLookupEdit-link-el`;
          const hrefCaseAccountObject = document.querySelector(hrefCaseAccountSelector);
          if (hrefCaseAccountObject) {
            const caseAccountMatch = hrefCaseAccountObject.href.match(/edit\/(.+)/);
            if (caseAccountMatch) {
              const caseAccountId = caseAccountMatch[1];
              const requestBody = getAccountRequestBody(caseAccountId);
              openAccountInfoPage(requestBody, caseAccountId, hrefCaseAccountObject.innerText);
            }
          }
        } catch (error) {
          console.error("error: ", error);
        }
      };

    function openAccountInfoPage(requestBody, caseAccountId, caseAccountName) {
      const bpmcsrfCookie = BPMCommon.getCookie("BPMCSRF");
      if (bpmcsrfCookie) {
        fetch(`http://${location.hostname}/0/DataService/json/SyncReply/SelectQuery`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            BPMCSRF: bpmcsrfCookie,
            Connection: "keep-alive",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => response.json())
          .then((data) => {
            const parseData = parseBpmAccountTableData(data.rows);
            buildHtmlPage(parseData, caseAccountId, caseAccountName, bpmcsrfCookie);
          });
      }
    }

    function parseBpmAccountTableData(data) {
      return data && data.length ? data.sort(compare) : [];

      function compare(a, b) {
        if (a.CreatedOn < b.CreatedOn) {
          return 1;
        }
        if (a.CreatedOn > b.CreatedOn) {
          return -1;
        }
        return 0;
      }
    }

    function buildHtmlPage(data, caseAccountId, caseAccountName, bpmcsrfCookie) {
      const html = `   ${getStyleForHtmlPage()}
                        <title>Краткая история обращений контрагента</title>
                        ${getTableForHtmlPage(data)}
                        ${getScriptForHtmlPage()}
                    `;

        const newPageMini = window.open("about:blank", "Краткая история обращений контрагента", "scrollbars=yes,resizable=yes,status=no,location=no,toolbar=no,menubar=no,width=600,height=400,left=1400,top=800");

      newPageMini.document.open();
      newPageMini.document.write(html);
      newPageMini.document.close();

      // Отправка статистики
      const caseId = location.href.split("/")[8];
      const statusRequestBody = getStatusRequestBody(caseId);

      fetch(`http://${location.hostname}/0/DataService/json/SyncReply/SelectQuery`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
          BPMCSRF: bpmcsrfCookie,
          Connection: "keep-alive",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statusRequestBody),
      })
        .then((response) => response.json())
        .then((data) => {
          try {
            let status = "Новое";
            if (data.rows.length) {
              status = data.rows[data.rows.length - 1].Status.displayValue;
            }
            BPMCommon.sendStats("bpm_case_to_account_autoclick", caseId, caseAccountId, status);
          } catch (error) {
            console.error(error);
          }
        });
    }

    function getScriptForHtmlPage() {
      return `
                <script>
                    function tableSearch() {
                        var phrase = document.getElementById('search-text');
                        var table = document.getElementById('info-table');
                        var regPhrase = new RegExp(phrase.value, 'i');
                        var flag = false;
                        for (var i = 1; i < table.rows.length; i++) {
                            flag = false;
                            for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
                                flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
                                if (flag) break;
                            }
                            if (flag) {
                                table.rows[i].style.display = "";
                            } else {
                                table.rows[i].style.display = "none";
                            }

                        }
                    }
                </script>

                <script>
                    function openLk(ls) {
                        const url = "${booster_environment.MA_WORK_NODE_URL}/webadmin-client/PRES-wa/lk";

                        fetch(url)
                            .then((data) =>
                            data.json().then((json) => {
                                try {
                                    if (json.data.result === true) {
                                        openPage(json.data, ls);
                                    }
                                } catch (error) {
                                    console.error("error: ", error);
                                }
                            })
                            )
                            .catch((error) => {
                                console.error("error: ", error);
                            });


                        function openPage(data, ls) {
                            var form = document.createElement("form");
                            form.target = "_blank";
                            form.method = "POST";
                            form.action = data["ics-url"];
                            form.style.display = "none";

                            // fscontrol
                            var input = document.createElement("input");
                            input.type = "hidden";
                            input.name = "fscontrol";
                            input.value = ls;
                            form.appendChild(input);

                            // auth-type
                            var input = document.createElement("input");
                            input.type = "hidden";
                            input.name = "auth-type";
                            input.value = "webadmin";
                            form.appendChild(input);

                            // ticket
                            var input = document.createElement("input");
                            input.type = "hidden";
                            input.name = "ticket";
                            input.value = data["ticket"];
                            form.appendChild(input);

                            // timezoneoffset
                            var input = document.createElement("input");
                            input.type = "hidden";
                            input.name = "timezoneoffset";
                            input.value = data["timezone-offset"];
                            form.appendChild(input);

                            document.body.appendChild(form);
                            form.submit();
                            document.body.removeChild(form);

                            sendStats("bpm_to_lk", "${location.href.split("/")[8]}", ls, " ");
                        }
                    }

                    function sendStats(type, from, to, note) {
                        const requestParams = {
                          email: "${BPMCommon.getUserEmailFromCasePage()}",
                          type: type,
                          from: from,
                          to: to,
                          note: note
                        };

                        const formBody = [];
                        for (let param in requestParams) {
                            const encodedKey = encodeURIComponent(param);
                            const encodedValue = encodeURIComponent(requestParams[param]);
                            formBody.push(encodedKey + "=" + encodedValue);
                        }
                        const body = formBody.join("&");

                        fetch("${booster_environment.MA_WORK_NODE_URL}/add-statistic-bpm-otp-action", {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                            },
                            body: body
                        });
                      }
                </script>
                `;
    }

     function getTableForHtmlPage(data) {
      let table = `<table id="info-table" style="table-layout: fixed;">
                        <colgroup>
                            <col style="width:82px;">
                            <col style="width:85px;">
                            <col style="width:80px;">
                            <col style="width:80px;">
                            <col style="width:80px;">
                            <col style="width:250px">
                            <col style="width:250px">
                            <col style="width:82px">
                            <col style="width:82px">
                        </colgroup>
                        <tr>
                            <th>Номер</th>
                            <th>Дата создания заявки</th>
                            <th>Состояние</th>
                            <th>Контакт</th>
                            <th>Тема</th>
                            <th>Описание</th>
                            <th>Решение</th>
                            <th>Ответственный</th>
                            <th>Категория</th>
                        </tr>`;

      data.forEach((element) => {
        table += `  <tr>
                        <td>
                        <a href="http://${location.hostname}/0/Nui/ViewModule.aspx#CardModuleV2/CasePage/edit/${element.Id}" target="_blank">
                                ${element.Number}
                            </a>
                        </td>
                        <td class="td_white-space_pre">${getDateWithRightFormat(parseUndefinedToEmptyString(element.CreatedOn))}</td>
                        <td>${parseUndefinedToEmptyString(element.Status.displayValue)}</td>
                        <td>${parseUndefinedToEmptyString(element.Contact.displayValue)}</td>
                        <td>${parseUndefinedToEmptyString(element.Subject)}</td>
                        <td>${parseUndefinedToEmptyString(element.Symptoms)}</td>
                        <td>${parseUndefinedToEmptyString(element.Solution)}</td>
                        <td>${parseUndefinedToEmptyString(element.Owner.displayValue)}</td>
                        <td style="word-wrap: break-word;">${parseUndefinedToEmptyString(element.Category.displayValue)}</td>
                    </tr>
                `;
      });

      table += `</table>`;
      return table;
    }

    function parseUndefinedToEmptyString(element){
        return element || ""
    }

    function getDateWithRightFormat(stringDate) {
      if (stringDate.length) {
        const substrDate = stringDate.substring(0, stringDate.length - 7);
        const match = substrDate.match(/(\d{4})\-(\d{2})\-(\d{2})T(\d{2})\:(\d{2})/);
        if (match) {
          return `${match[3]}/${match[2]}/${match[1]}\n${match[4]}:${match[5]}`;
        }
      }
      return "";
    }

    function getStyleForHtmlPage() {
      return `<style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }

                    table button {
                        background: none!important;
                        border: none;
                        padding: 0!important;
                        font-family: arial, sans-serif;
                        color: #069;
                        text-decoration: underline;
                        cursor: pointer;
                    }

                    th {
                        text-align: center; /* Выравнивание по левому краю */
                        background: #ccc; /* Цвет фона ячеек */
                        padding: 5px; /* Поля вокруг содержимого ячеек */
                        border: 1px solid black; /* Граница вокруг ячеек */
                        font-size: 10pt;
                        }

                    td {
                        overflow-y: auto;
                        padding: 5px; /* Поля вокруг содержимого ячеек */
                        border: 1px solid black; /* Граница вокруг ячеек */
                        font-size: 10pt;
                        }

                    input {
                        margin: 10px 0;
                    }

                    .td_white-space_pre {
                        white-space: pre;
                    }
                </style>`;
    }

    function getAccountRequestBody(caseAccountId) {
      return {
        rootSchemaName: "Case",
        operationType: 0,
        filters: {
          items: {
            "0dad30e1-9b47-42d1-b3ae-1afb6797a1ea": {
              items: {
                masterRecordFilter: {
                  filterType: 1,
                  comparisonType: 3,
                  isEnabled: true,
                  trimDateTimeParameterToDate: false,
                  leftExpression: { expressionType: 0, columnPath: "Account" },
                  rightExpression: { expressionType: 2, parameter: { dataValueType: 1, value: caseAccountId } },
                },
              },
              logicalOperation: 0,
              isEnabled: true,
              filterType: 6,
            },
          },
          logicalOperation: 0,
          isEnabled: true,
          filterType: 6,
        },
     columns: {
          items: {
            Id: { caption: "", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Id" } },
            Number: { caption: "", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Number" } },
            CreatedOn: { caption: "Дата создания заявки", orderDirection: 2, orderPosition: 1, isVisible: true, expression: { expressionType: 0, columnPath: "CreatedOn" } },
            Status: { caption: "Состояние", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Status" } },
            Contact: { caption: "Контакт", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Contact" } },
            Subject: { caption: "Тема", orderDirection: 2, orderPosition: 1, isVisible: true, expression: { expressionType: 0, columnPath: "Subject" } },
            Symptoms: { caption: "Описание", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Symptoms" } },
            Solution: { caption: "Решение", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Solution" } },
            Owner: { caption: "Ответственный", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Owner" } },
            Category: { caption: "Категория", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Category" } },
            EntryPointsCount: {
              caption: "",
              orderDirection: 0,
              orderPosition: -1,
              isVisible: true,
              expression: {
                expressionType: 3,
                aggregationType: 1,
                columnPath: "[EntryPoint:EntityId].Id",
                subFilters: {
                  items: {
                    "3eec561d-abe0-45f2-895f-602a503d5f20": {
                      filterType: 1,
                      comparisonType: 3,
                      isEnabled: true,
                      trimDateTimeParameterToDate: false,
                      leftExpression: { expressionType: 0, columnPath: "IsActive" },
                      rightExpression: { expressionType: 2, parameter: { dataValueType: 1, value: true } },
                    },
                  },
                  logicalOperation: 0,
                  isEnabled: true,
                  filterType: 6,
                },
              },
            },
          },
        },
        isDistinct: false,
        rowCount: 100,
        rowsOffset: 0,
        isPageable: true,
        allColumns: false,
        useLocalization: true,
        useRecordDeactivation: false,
        serverESQCacheParameters: { cacheLevel: 0, cacheGroup: "", cacheItemName: "" },
        queryOptimize: false,
        useMetrics: false,
        querySource: 0,
        ignoreDisplayValues: false,
        conditionalValues: null,
        isHierarchical: false,
      };
    }

    function getStatusRequestBody(caseId) {
      return {
        rootSchemaName: "CaseLifecycle",
        operationType: 0,
        filters: {
          items: {
            "76ea03dc-a6eb-4dc6-af0b-f76f6fe90cd7": {
              items: {
                masterRecordFilter: {
                  filterType: 1,
                  comparisonType: 3,
                  isEnabled: true,
                  trimDateTimeParameterToDate: false,
                  leftExpression: { expressionType: 0, columnPath: "Case" },
                  rightExpression: { expressionType: 2, parameter: { dataValueType: 1, value: caseId } },
                },
              },
              logicalOperation: 0,
              isEnabled: true,
              filterType: 6,
            },
          },
          logicalOperation: 0,
          isEnabled: true,
          filterType: 6,
        },
      columns: {
          items: {
            Id: { caption: "", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Id" } },
            StartDate: { caption: "Дата начала", orderDirection: 1, orderPosition: 1, isVisible: true, expression: { expressionType: 0, columnPath: "StartDate" } },
            EndDate: { caption: "Дата завершения", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "EndDate" } },
            Status: { caption: "Состояние", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Status" } },
            Priority: { caption: "Приоритет", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Priority" } },
            Owner: { caption: "Ответственный", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Owner" } },
            Group: { caption: "Группа ответственных", orderDirection: 0, orderPosition: -1, isVisible: true, expression: { expressionType: 0, columnPath: "Group" } },
            EntryPointsCount: {
              caption: "",
              orderDirection: 0,
              orderPosition: -1,
              isVisible: true,
              expression: {
                expressionType: 3,
                aggregationType: 1,
                columnPath: "[EntryPoint:EntityId].Id",
                subFilters: {
                  items: {
                    "7e6de9fa-5614-43d3-b9fe-e155625a59f2": {
                      filterType: 1,
                      comparisonType: 3,
                      isEnabled: true,
                      trimDateTimeParameterToDate: false,
                      leftExpression: { expressionType: 0, columnPath: "IsActive" },
                      rightExpression: { expressionType: 2, parameter: { dataValueType: 1, value: true } },
                    },
                  },
                  logicalOperation: 0,
                  isEnabled: true,
                  filterType: 6,
                },
              },
            },
          },
        },
        isDistinct: false,
        rowCount: 10,
        rowsOffset: 0,
        isPageable: true,
        allColumns: false,
        useLocalization: true,
        useRecordDeactivation: false,
        serverESQCacheParameters: { cacheLevel: 0, cacheGroup: "", cacheItemName: "" },
        queryOptimize: false,
        useMetrics: false,
        querySource: 0,
        ignoreDisplayValues: false,
        conditionalValues: null,
        isHierarchical: false,
      };
    }
  }
}

setTimeout((onButtonClickAuto) => {
   document.getElementById('ma-case-to-account-button-auto').onclick();
  }, 20000);

class BPMBSampleButton {
    constructor() {
        this.init();
    }
    init() {
        const MA_INNER_BUTTON_HTML = `<span style="font-size:15px">Шаблон</span>`;
        getParameters().then(addButton).catch((error) => {
            console.error(error);
        });

        function getParameters() {
            return new Promise((resolve) => {
                const accountlabelSelector = `#CasePageServicePact00d7746a-0675-49ac-8608-323407985e07Container_Label`;
                let tryCount = 0;
                const changeAccountLabelinterval = setInterval(() => {
                    try {
                        const labelObject = document.querySelector(accountlabelSelector);
                        if (labelObject) {
                            clearInterval(changeAccountLabelinterval);
                            return resolve({
                                labelObject: labelObject
                            });
                        } else {
                            tryCount++;
                        }
                        if (tryCount >= 12) {
                            clearInterval(changeAccountLabelinterval);
                        }
                    } catch (error) {
                        console.error("error: ", error);
                        clearInterval(changeAccountLabelinterval);
                    }
                }, 1200);
            });
        }

        function addButton(params) {
            if ($(`button#ma-sample`).length) {
                return;
            }
            const button = document.createElement("button");
            button.id = "ma-sample";
            button.innerHTML = MA_INNER_BUTTON_HTML;
            button.onclick = onButtonClick;
            params.labelObject.append(button);
        }
        //Проверка условий шаблона
        //Первичная_Настройка_ТА
        function FitstSettingsTA() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '02. SIP оборудование';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '1. Первичная настройка оборудования';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Настройка телефона (написать модель)');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "76px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "76px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Краткое описание проблемы клиента:  \n 2. Учетная запись сотрудника: `);
                let SolutionButton = document.querySelector('div[data-item-marker="Solution"]');
                let templateWithSolut = document.createElement('span');
                let spanTemplateSol = document.getElementsByClassName('cke_editable_inline')[0];
                let spanTemplateSolution = spanTemplateSol.prepend(templateWithSolut);
                templateWithSolut.innerHTML = `1. Удаленное подключение: (Да/нет) <br>  2. Тип настройки: (Mangohelper или Web) <br> 3. Тестовый звонок: (контекст)`
            }
        }
        //Перенастройка_ТА
        function RESettingsTA() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '02. SIP оборудование';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '2. Перенастройка оборудования';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Перенастройка оборудования (написать модель)');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "76px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "76px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Краткое описание причины перенастройки:  \n 2. Учетная запись сотрудника:`);
                let SolutionButton = document.querySelector('div[data-item-marker="Solution"]');
                let templateWithSolut = document.createElement('span');
                let spanTemplateSol = document.getElementsByClassName('cke_editable_inline')[0];
                let spanTemplateSolution = spanTemplateSol.prepend(templateWithSolut);
                templateWithSolut.innerHTML = `1. Удаленное подключение: (Да/нет)  <br>  2. Тип настройки: (Mangohelper или Web)  <br> 3. Краткое описание выполненных действий:  <br>  4. Успешный тестовый звонок: (контекст)`
            }
        }
        //Консультация_по_СИП
        function ConsultSip() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '02. SIP оборудование';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '3. Консультация по SIP оборудованию';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Консультация по SIP оборудованию. (написать модель)');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "76px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "76px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Краткое описание консультации по SIP оборудованию: \n 2. Учетная запись сотрудника: `);
                let SolutionButton = document.querySelector('div[data-item-marker="Solution"]');
                let templateWithSolut = document.createElement('span');
                let spanTemplateSol = document.getElementsByClassName('cke_editable_inline')[0];
                let spanTemplateSolution = spanTemplateSol.prepend(templateWithSolut);
                templateWithSolut.innerHTML = `1. Удаленное подключение: (Да/нет) <br>  2. Краткое описание выполненных действий: <br> 3. Если клиент затрудняется в настройке, то отправить письмо с инструкцией`
            }
        }
        // Качество_связи
        function NetworkQuality() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '04. Качество связи';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '1. Потеря пакетов/задержки/джиттер';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Плохое качество связи');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "95px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "95px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Краткое описание проблемы клиента: (плохая слышимость, потери, задержки и т.д.)  \n 2. Учетная запись сотрудника:  \n 3. Контексты проблемных звонков: `);
                let SolutionButton = document.querySelector('div[data-item-marker="Solution"]');
                let templateWithSolut = document.createElement('span');
                let spanTemplateSol = document.getElementsByClassName('cke_editable_inline')[0];
                let spanTemplateSolution = spanTemplateSol.prepend(templateWithSolut);
                templateWithSolut.innerHTML = `Если обращение оффлайн, то выслать клиенту подтверждение наличие проблем с сетью (скриншот из Wireshark)`
            }
        }
        //Интеграции_записи
        function recordIntegration() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '07. Интеграция с CRM системами (Виджеты Интеграции Манго)';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '2. Нет записи разговора / невозможно прослушать запись разговора в CRM';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Нет записей разговоров в (указать интеграцию)');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "95px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "95px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Последовательность действий клиента: \n 2. Контексты проблемных звонков:  \n 3. Приложить (по возможности) настройки виджета интеграции: \n 4. Скриншоты сущностей с адресной строкой браузера в которую не попал факт вызова: `);
            }
        }
        //API_1
        function API_1() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '11. CallTracking';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '01 Консультация  по настройке CallTracking';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Первичная настройка CallTracking');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Сайт:`);
            }
        }
        //API_2
        function API_2() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '11. CallTracking';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '02 Не подменяется номер / некорректно подменяется номер';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Не подменяется номер / некорректно подменяется номер');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "95px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "95px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1.Сайт:  \n 2.Где именно расположен номер:  \n 3.Скрипт установлен на сайт? (Да/нет): \n 4. Скриншот: `);
            }
        }
        //API_3
        function API_3() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '11. CallTracking';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '03 Клиенту идут нецелевые звонки';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Нецелевые звонки');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "76px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "76px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1.Сайт: \n 2. Примеры звонков: `);
            }
        }
        //API_4
        function API_4() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '11. CallTracking';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '04 Не проходит звонок на подменный номер';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Не проходит звонок на подменный номер');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "76px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "76px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1.Сайт:  \n 2. Примеры звонков: `);
            }
        }
        //API_5
        function API_5() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '11. CallTracking';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '05 Некорректная статистика';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Некорректная статистика');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "114px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "114px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1.Сайт:  \n 2. Период для сравнения:  \n 3. С чем сравнивают:  \n 4. Скриншоты или Таблицы для подтверждения расхождения данных: `);
            }
        }
        //API_6
        function API_6() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '11. CallTracking';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '06 Проблема с интеграциями Манго (МД, ЗОЗ, ОЗ и тд)';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Проблема с интеграциями Манго (МД, ЗОЗ, ОЗ и тд)');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "38px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "38px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. ТЗ от клиента: `);
            }
        }
        //API_7
        function API_7() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '11. CallTracking';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '07 Проблема с интеграцией Yandex, Google, CRM и другое';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Проблема c интеграцией Yandex, Google, CRM (указать какая)');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "76px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "76px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1.Сайт:  \n 2. С какой интеграцией проблема:  \n 3. Отображение проблемы: `);
            }
        }
        //API_8
        function API_8() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '11. CallTracking';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '08 Проблема с JS API';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Проблема с JS API');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "76px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "76px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1.Сайт:  \n 2. В чем заключается проблема: `);
            }
        }
        //API_9
        function API_9() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '11. CallTracking';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '09 Проблема с версткой после установки кода';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Проблема с версткой после установки кода');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "76px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "76px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1.Сайт: \n 2. Скрипт установлен на сайт? (Да/нет): `);
            }
        }
        //API_10
        function API_10() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '11. CallTracking';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '10 Роботы в коллтрекинге';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Роботы в коллтрекинге');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "76px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "76px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1.Сайт: \n 2. С каким роботом проблема: \n 3. Где конкретно (скриншот): `);
            }
        }
        //API_11
        function API_11() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '11. CallTracking';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '11 E-mail трекинг';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('E-mail трекинг');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "76px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "76px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1.Сайт:  \n 2. Что не работает:  \n 3. Скриншот ошибки: `);
            }
        }
        //API_12
        function API_12() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '11. CallTracking';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '12 Проблема с API ДКТ';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Проблема с API ДКТ');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "76px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "76px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1.Сайт:  \n 2. С каким запросом проблема: `);
            }
        }
        //API_13
        function API_13() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '08. API';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '2 Ошибка выполнения запроса';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Ошибка выполнения запроса');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "95px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "95px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Какой метод используется:  \n 2. Точное время отправки запроса на наш сервер и ip, с которого отправлялся запрос  \n 3. Ответ (какая ошибка)`);
            }
        }
        //API_14
        function API_14() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '08. API';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '3 Проблема с получанием данных от сервера'; //орфографическая ошибка в самой Creatio
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Проблема с получением данных от сервера');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "95px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "95px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Какой метод используется: \n 2. Точное время отправки запроса на наш сервер и ip, с которого отправлялся запрос \n 3. Ответ (какая ошибка) `);
            }
        }
        //API_15
        function API_15() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '08. API';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '4 Консультация по запросам/ответам';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Консультация по запросам/ответам');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "95px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "95px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. О каком запросе идет речь и максимально детальное описание вопроса клиента: `);
            }
        }
        //API_16
        function API_16() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '08. API';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '5 Консультация о возможностях API';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Консультация о возможностях API');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "95px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "95px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Максимально подробно описать кейс клиента: `);
            }
        }
        //API_17
        function API_17() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '07. Интеграция с CRM системами (Виджеты Интеграции Манго)';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '2. Нет записи разговора / невозможно прослушать запись разговора в CRM';
            let CasePageMngCaseSupportProduct = document.getElementById('CasePageMngCaseSupportProductComboBoxEdit-el').value;
            let SupportProduct = 'Интеграция AmoCRM';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageMngCaseSupportProduct == SupportProduct) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Нет записи разговоров/Невозможно прослушать запись разговора в AmoCRM');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "228px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "228px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal}  1. Домен интеграции:  \n 2. Примеры звонков(2-3 контекста): \n 3. Убедиться, в том, что в ЛК есть запись разговора по примеру(да/нет): \n 4. Скриншоты сущности, в которую не попала запись(с адресной строкой): \n 5. Скриншоты настроек интеграции: \n 6. Проверка настройки "генерации ссылок"(да/нет): \n 7. Проверить, достаточно ли прав у сотрудника на прослушивание. \n 8. Контактные данные, почта клиента: \n Проверить, достаточно ли прав у сотрудника на прослушивание записей разговора: `);
            }
        }
        //API_18
        function API_18() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '07. Интеграция с CRM системами (Виджеты Интеграции Манго)';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '2. Нет записи разговора / невозможно прослушать запись разговора в CRM';
            let CasePageMngCaseSupportProduct = document.getElementById('CasePageMngCaseSupportProductComboBoxEdit-el').value;
            let SupportProduct = 'Интеграция Битрикс24';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem && CasePageMngCaseSupportProduct == SupportProduct) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Нет записи разговоров/Невозможно прослушать запись разговора в Битрикс24');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "285px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "285px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Домен интеграции:  \n 2. Примеры звонков(2-3 контекста): \n 3. Убедиться, в том, что в ЛК есть запись разговора по примеру(да/нет): \n 4. Скриншоты сущности, в которую не попала запись(с адресной строкой): \n 5. Скриншоты настроек интеграции: \n 6. Проверка настройки "генерации ссылок"(да/нет): \n 7. Контактные данные, почта клиента: \n !Коробочная версия! Скриншоты всех модулей. \n В случае озвучивания сообщения, "подождите окончания обработки", диагностика возможна только по истечению 12 часов, так как ответственность за добавление записи в сущность несет Битрикс24. `);
            }
        }
        //API_19
        function API_19() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '07. Интеграция с CRM системами (Виджеты Интеграции Манго)';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '3. Нет информации о звонке / неверная информация о звонке в CRM';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Нет информации о звонке / неверная информация о звонке в CRM');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "171px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "171px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Домен интеграции:  \n 2. Примеры звонков(2-3 контекста): \n 3. Временной промежуток, с которого не добавляется информация, вносимые изменения в интеграцию: \n 4. Скриншоты сущности, в которую не попала запись(с адресной строкой): \n 5. Скриншоты настроек интеграции: \n 6. Контактные данные, почта клиента: `);
            }
        }
        //API_20
        function API_20() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '07. Интеграция с CRM системами (Виджеты Интеграции Манго)';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '4. Не всплывает карточка / не закрывается карточка в CRM';;
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Не всплывает карточка/ Не закрывается карточка в CRM');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "171px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "171px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Домен интеграции:  \n 2. Примеры звонков(2-3 контекста): \n 3. Инцидент наблюдается у всех пользователей? \n 4. Есть ли расширения в браузере блокирующие всплывающие доп. окна, а так же разрешено ли всплывание окон на странице? \n 5. Скриншоты настроек интеграции: \n 6. Контактные данные, почта клиента: `);
            }
        }
        //API_21
        function API_21() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '07. Интеграция с CRM системами (Виджеты Интеграции Манго)';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '6. Не срабатывает перехват на ответственного сотрудника';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Не срабатывает перехват на ответственного');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "171px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "171px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Домен интеграции:  \n 2. Примеры звонков(2-3 контекста): \n Звуковое приветствие больше 5 секунд, условия ожидания окончания выполнено(да/нет): \n 4. Проверить наличие дублей сущностей с номером звонящего у клиента, переадресация может происходить на сотрудинка ответственного за дубль: \n 5. Скриншоты настроек интеграции: \n 6. Контактные данные, почта клиента: `);
            }
        }
                //API_22
        function API_22() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '08. API';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '6 Консультация о способах интеграции';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Консультация о способах интеграции');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "95px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "95px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Максимально подробно описать кейс клиента: `);
            }
        }
                //API_23
        function API_23() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '07. Интеграция с CRM системами (Виджеты Интеграции Манго)';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '5. Не работает исходящий вызов / Работает некорректно исходящий вызов через CRM';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Не работает исходящий вызов / Работает некорректно исходящий вызов через CRM');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "171px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "171px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Домен интеграции:  \n 2. Примеры звонков(2-3 контекста): \n Звуковое приветствие больше 5 секунд, условия ожидания окончания выполнено(да/нет): \n 4. Проверить наличие дублей сущностей с номером звонящего у клиента, переадресация может происходить на сотрудинка ответственного за дубль: \n 5. Скриншоты настроек интеграции: \n 6. Контактные данные, почта клиента: `);
            }
        }
                //API_24
        function API_24() {
            let CasePageServiceCategSelector = document.getElementById('CasePageServiceCategoryComboBoxEdit-el').value;
            let ServiceCateg = '07. Интеграция с CRM системами (Виджеты Интеграции Манго)';
            let CasePageServiceItemSelector = document.getElementById('CasePageServiceItemComboBoxEdit-el').value;
            let ServiceItem = '7. Консультация по работе или настройке интеграции';
            if (CasePageServiceCategSelector == ServiceCateg && CasePageServiceItemSelector == ServiceItem) {
                let Theme = $('#CasePageSubjectTextEdit-el').val('Консультация по работе или настройке интеграции');
                let SymptomsOriginal = $('#CasePageSymptomsHtmlEdit-el').val();
                let Symptoms_style_scroll = $("#CasePageSymptomsHtmlEdit-scroll").css("height", "95px");
                let Symptoms_style_el = $("#CasePageSymptomsHtmlEdit-el").css("height", "95px");
                let Symptoms = $('#CasePageSymptomsHtmlEdit-el').val(`${SymptomsOriginal} \n 1. Максимально подробно описать кейс клиента: `);
            }
        }

        function onButtonClick(event) {
            try {
                FitstSettingsTA(),
                    RESettingsTA(),
                    ConsultSip(),
                    NetworkQuality(),
                    recordIntegration(),
                    API_1(),
                    API_2(),
                    API_3(),
                    API_4(),
                    API_5(),
                    API_6(),
                    API_7(),
                    API_8(),
                    API_9(),
                    API_10(),
                    API_11(),
                    API_12(),
                    API_13(),
                    API_14(),
                    API_15(),
                    API_16(),
                    API_17(),
                    API_18(),
                    API_19(),
                    API_20(),
                    API_21(),
                    API_22(),
                    API_23(),
                    API_24()
            } catch (error) {
                console.error("error: ", error);
            }
            sendStatsOfBPM(' ', 'bpm_template', location.href.split("/")[8], ' ', ' ');

            function sendStatsOfBPM(email, type, from, to, note) {
                const requestParams = {
                    email: getUserEmailFromCasePage(),
                    type: type,
                    from: from,
                    to: getLs(),
                    note: note
                };

                function getLs() {
                    const lsSelector = `a#CasePageStnAccLookupEdit-link-el`;
                    const lsObject = document.querySelector(lsSelector);
                    let ls = "";
                    if (lsObject !== null) {
                        ls = lsObject.innerText;
                    }
                    return ls;
                }

                function getUserEmailFromCasePage() {
                    try {
                        const userEmail = sysValues.CURRENT_USER.displayValue;
                        if (typeof userEmail === "string" && userEmail.length > 0) {
                            return userEmail;
                        }
                        throw new Error("not userEmail");
                    } catch (err) {
                        return "stub";
                    }
                }
                $.post(`${booster_environment.MA_WORK_NODE_URL}/add-statistic-bpm-otp-action`, requestParams);
            };
        };
    }
};

class BPMCommon {
  static sendStats(type, from, to, note) {
    const requestParams = {
      email: BPMCommon.getUserEmailFromCasePage(),
      type: type,
      from: from,
      to: to,
      note: note
    };

    $.post(`${booster_environment.MA_WORK_NODE_URL}/add-statistic-bpm-otp-action`, requestParams);
  }

  static getUserEmailFromCasePage() {
    try {
      const userEmail = sysValues.CURRENT_USER.displayValue;

      if (typeof userEmail === "string" && userEmail.length > 0) {
        return userEmail;
      }
      throw new Error("not userEmail");
    } catch (err) {
      return "stub";
    }
  }

  static getCookie(name) {
    try {
      let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
      return matches ? decodeURIComponent(matches[1]) : "";
    } catch (err) {
      return "";
    }
  }
}
//---------------------------------------------
// модуль bpm
function bpmModule() {
  let prevHash = null;

  XHRListener.on(/.*/, (e) => {
    const currentHash = location.hash;

    if (prevHash !== currentHash) {
      prevHash = currentHash;

      if (/CardModuleV2\/CasePage\/edit\//i.test(prevHash)) {
        new BPMToSDAndRMButtons();
        new BPMToLkButton();
        new BPMToContextButton();
        new BPMCaseToAccountDateButton();
        new BPMCaseToAccountButton();
        new BPMCaseToAccountButtonAuto();
        new BPMBSampleButton();
        new BPMToRM();
      }
      if (/CardModuleV2\/Account1Page\/edit\//i.test(prevHash)) {
        new BPMCaseToAccountButton();

      }
    }
  });
}

//---------------------------------------------------------------------------------------------------------------------------------------
// ВЕБАДМИН


function insertContext() {
    if (!/\?context=/.test(window.location.search))
        return;
    if (window.location.hash != "#p=sswa-module-softplatform-cdrs")
        return;
    if (window.location.search.length < 3)
        return;
    var submbutton = false;
    if (typeof alreadyInsertContext == 'undefined')
        window.alreadyInsertContext = false;
    if (alreadyInsertContext)
        return;
    var timerCall = setInterval(function () {
        if (submbutton)
            return;
        var contextValue = window.location.search.replace(/\D/g, '');
        var contextElt = document.querySelector('#f-contextIds');
        if (contextElt)
            contextElt.value = contextValue;
        var fromDate = document.querySelector('#f-fromDate');
        if (fromDate)
            fromDate.value = new Date(new Date().setMonth(new Date().getMonth() -1)).toLocaleDateString();  //Берем дату на месяц раньше. Формат dd.mm.yyyy (LocaleDateString)
        var applyButton = document.querySelector('.x-btn.x-btn-noicon.x-box-item:not(.boosterBtn) > tbody');
        if (applyButton) {
            applyButton.click();
            submbutton = true;
            alreadyInsertContext = true;
        }
    }, 500);

    //  остановить повторы
    setTimeout(function () {
        clearInterval(timerCall);
    }, 10000);
}

function insertSip() {
    if (!/\?sip=/.test(window.location.search))
        return;
    if (typeof alreadyInsertSip == 'undefined')
        window.alreadyInsertSip = false;
    if (alreadyInsertSip)
        return;
    if (window.location.hash != "#p=sswa-module-sip-sessions-cluster")
        return;
    if (window.location.search.length < 3)
        return;

    var jCount = 0;
    var submbuttonSession = false;

    funcAutoSubmit = function () {
        if (submbuttonSession)
            return;
        var sip = window.location.search.replace('?sip=', '');
        var sipUser = sip.substr(0, sip.indexOf('@'));
        var sipDomain = sip.substr(sip.indexOf('@') + 1);
        if (document.querySelector('#f-name'))
            document.querySelector('#f-name').value = sipUser;

        if (document.querySelector('#f-domain'))
            document.querySelector('#f-domain').value = sipDomain;
        if (document.querySelector('#sswa-sip-sessions-cluster-filter')) {
            var applyButton = document.querySelector('#sswa-sip-sessions-cluster-filter .x-toolbar-cell > table > tbody')
            if (applyButton && document.querySelector('#f-name')) {
                applyButton.click();
                submbuttonSession = true;
                alreadyInsertSip = true;
                if (document.querySelector('#f-domain').value !== '' && document.querySelector('#f-name').value !== '') {
                    submbuttonSession = true;
                    alreadyInsertSip = true;
                }
            }
        }

        jCount++;
        if (jCount < 50)
            setTimeout(funcAutoSubmit, "300");
    }
    funcAutoSubmit();
}

function parseCustomUrl() {
    var paramColl = window.location.search.replace(/^\?/, '').split('&');
    paramColl.forEach(item => controller(item.split('=')));

    function controller(keyvalueArr) {
        let key = keyvalueArr[0];
        let value = keyvalueArr[1];
        if (key === 'interval')
            return buildInterval(value);

        if (key === 'acc') {
            buildAccount(value);
            pressSubmit();
            collapeFilterPanel();
            return;
        }
        if (key === 'from_number')
            return buildFromNumber(value);
    }

    function buildInterval(value) {
        let intervalMap = {
            'today': 'Сегодня'
        };

        document.getElementById('f-presetCombo').click();
        $('div.x-combo-list-item:contains(' + intervalMap[value] + ')').click();
    }

    function buildAccount(value) {
        document.getElementById('f-accountNames').value = value;
    }

    function buildFromNumber(value) {
        document.getElementById('f-callingNumbers').value = value;
    }

    function pressSubmit() {
        document.querySelector('.x-btn.x-btn-noicon.x-box-item:not(.boosterBtn)').click();
    }

    function collapeFilterPanel() {
        $('#addFilterPanel:not(.x-panel-collapsed) div.x-tool-toggle').click();
    }
}

function addHandlerButton() {
    var submitBtnCdrSelector = "#sswa-softplatform-cdrs-filter table.x-btn.x-btn-noicon.x-box-item:not(.boosterBtn):contains(Применить) tbody";
    $(document.body).delegate(submitBtnCdrSelector, "click", function (e) {
        contextToConsole();
        setVisibleColumn();
        waitLoadContextGrid();
    });

    var submitBtnSipSessionSelector = '#sswa-sip-sessions-cluster-filter td.x-toolbar-cell:contains(Применить) tbody';
    $(document.body).delegate(submitBtnSipSessionSelector, "click", waitLoadSipGrid);

    var firstPageCdrSelector = 'tbody.x-btn-small.x-btn-icon-small-left:has(button.x-btn-text.x-tbar-page-first)';
    $(document.body).delegate(firstPageCdrSelector, "click", pageTrigger);
    var prevPageCdrSelector = 'tbody.x-btn-small.x-btn-icon-small-left:has(button.x-btn-text.x-tbar-page-prev)';
    $(document.body).delegate(prevPageCdrSelector, "click", pageTrigger);
    var nextPageCdrSelector = 'tbody.x-btn-small.x-btn-icon-small-left:has(button.x-btn-text.x-tbar-page-next)';
    $(document.body).delegate(nextPageCdrSelector, "click", pageTrigger);
    var lastPageCdrSelector = 'tbody.x-btn-small.x-btn-icon-small-left:has(button.x-btn-text.x-tbar-page-last)';
    $(document.body).delegate(lastPageCdrSelector, "click", pageTrigger);
    var refreshPageCdrSelector = 'tbody.x-btn-small.x-btn-icon-small-left:has(button.x-btn-text.x-tbar-loading)';
    $(document.body).delegate(refreshPageCdrSelector, "click", pageTrigger);
    var perPageCdrSelector = 'div.x-combo-list-inner:has(div.x-combo-list-item:contains(20))';
    $(document.body).delegate(perPageCdrSelector, "click", pageTrigger);

}

function pageTrigger() {
    if (window.location.hash == '#p=sswa-module-softplatform-cdrs')
        waitLoadContextGrid();
    if (window.location.hash == '#p=sswa-module-sip-sessions-cluster')
        waitLoadSipGrid();
}

function send_stat_from_wa() {
  var buttonAreaSessions = document.getElementsByClassName('x-panel-btns x-panel-btns-center')[0];
  var applyButtonSessions = buttonAreaSessions.querySelector('tbody > tr:nth-child(2) > td.x-btn-mc > em > button');
  applyButtonSessions.addEventListener("click", function() {
    Statistic.send('wa:sipsessionclusterclick');
  });
}

function webAdminHotKey() {
      if (window.location.hash == "#p=sswa-module-sip-sessions-cluster") {
    document.addEventListener("DOMContentLoaded", send_stat_from_wa());
  }
    document.onkeyup = function (e) {
        e = e || window.event;
        if (e.keyCode == 13) { // ENTER
            if (window.location.hash == "#p=sswa-module-sip-sessions-cluster") {
                //получить кнопку "применить" из вебадмин  - вкладка SIP регистрации
                var buttonAreaSessions = document.getElementsByClassName('x-panel-btns x-panel-btns-center')[0];
                var applyButtonSessions = buttonAreaSessions.querySelector('tbody > tr:nth-child(2) > td.x-btn-mc > em > button');
                applyButtonSessions.click();
            }
            if (window.location.hash == "#p=sswa-module-softplatform-cdrs") {
                var contextFind = true;
                if (document.getElementById('f-accountNames').value.indexOf("Введите название счета, можно ввести до 2-х через") == -1) // Название счета:
                    contextFind = false;
                if (document.getElementById('f-callingNumbers').value.indexOf("Введите номер, можно ввести до 2-х через") == -1) // С номера:
                    contextFind = false;
                if (document.getElementById('f-calledNumbers').value.indexOf("Введите номер, можно ввести до 2-х через") == -1) // На номер:
                    contextFind = false;
                if (contextFind && document.getElementById('f-contextIds').value.indexOf("Введите контекст, можно ввести до 2-х через") == -1)
                    document.getElementById('f-fromDate').value = "01.01.2019";
                //получить кнопку "применить" из вебадмин-вкладка контексты
                var buttonAreaCdr = document.getElementsByClassName('x-box-inner')[0];
                var applyButtonCdr = document.querySelector('.x-btn.x-btn-noicon.x-box-item:not(.boosterBtn)');
                applyButtonCdr.click();
                waitLoadContextGrid();
            }
        }
        if (e.keyCode == 27) { // ESCAPE
            if (window.location.hash == "#p=sswa-module-sip-sessions-cluster") {
                var inputElem = document.getElementsByClassName('x-form-text x-form-field');
                for (i = 0; i < inputElem.length - 1; i++) {
                    inputElem[i].value = "";
                }
            }
            if (window.location.hash == "#p=sswa-module-softplatform-cdrs") {
                //получить кнопку "применить" из вебадмин-вкладка контексты
                var buttonAreaCdrReset = document.getElementsByClassName('x-box-inner')[0];
                var applyButtonCdrReset = document.querySelectorAll('.x-btn.x-btn-noicon.x-box-item:not(.boosterBtn)');
                applyButtonCdrReset[1].click();
            }
        }
        if (e.shiftKey && e.keyCode == 65) { }
    };
}

function contextToConsole() {
    function copyContext(contextRaw) {
        var link = null;
        if (document.getElementsByClassName('contextForCopy').length === 0) {
            link = document.createElement('input');
            link.className = "contextForCopy";
            link.value = contextRaw;
            document.body.appendChild(link);
        } else {
            link = document.getElementsByClassName('contextForCopy')[0];
            link.value = contextRaw;
        }

        link.select();
        try {
            var successful = document.execCommand('copy');
        } catch (err) {
            log('err');
        }
        window.getSelection().removeAllRanges();
        return false;
    }

    function buildContext() {
        var st = document.getElementsByClassName('x-grid3-cell-inner x-grid3-col-contextId');
        var result = "";
        var contextCount = 0;
        for (i = 0; i < st.length; i++) {
            if (result.indexOf(st[i].firstChild.innerText) == -1) {
                result += st[i].firstChild.innerText + " ";
                contextCount++;
            }
        }
        copyContext(result);
        copyContextCounter(contextCount);
    }

    function copyContextCounter(contextCount) {
        var postData = {
            'action': 'clickCopyContext',
            'count': '1'
        };

        $.ajax({
            url: BACKEND + '/booster/count',
            type: 'POST',
            data: postData,
            success: function (e) { },
            error: function (err) {
                log(err);
            }
        });

        var postData = {
            'action': 'contextCopy',
            'count': contextCount
        };

        $.ajax({
            url: BACKEND + '/booster/count',
            type: 'POST',
            data: postData,
            success: function (e) { },
            error: function (err) {
                log(err);
            }
        });
    }

    function buildCopyContextBtn() {
        var newBtn = document.querySelector('#softplatformCdrsFilterExportBtn').cloneNode(true);
        newBtn.addEventListener('mouseover', btnOver);
        newBtn.addEventListener('mouseout', btnOut);
        newBtn.addEventListener('mousedown', btnMouseDown);
        newBtn.addEventListener('click', buildContext);
        newBtn.id = 'copyCtx';
        newBtn.className = 'x-btn x-btn-noicon x-box-item boosterBtn';
        newBtn.style.left = '10px';
        newBtn.querySelector('button').innerText = 'Скопировать контексты';
        newBtn.querySelector('button').id = '';
        var panelFilter = document.querySelector('#sswa-softplatform-cdrs-filter');
        var panelButton = panelFilter.querySelector('.x-box-inner');
        panelButton.insertBefore(newBtn, panelButton.children[1]);

        function btnOver() {
            this.className = 'x-btn x-btn-noicon x-box-item x-btn-over boosterBtn';
        }

        function btnOut() {
            this.className = 'x-btn x-btn-noicon x-box-item boosterBtn';
        }

        function btnMouseDown() {
            this.className = 'x-btn x-btn-noicon x-box-item x-btn-click boosterBtn';
        }
    }

    function buildPcapDownloadButton() {
        var newBtn = document.querySelector('#softplatformCdrsFilterExportBtn').cloneNode(true);
        newBtn.addEventListener('mouseover', btnOver);
        newBtn.addEventListener('mouseout', btnOut);
        newBtn.addEventListener('mousedown', btnMouseDown);
        newBtn.addEventListener('click', multiDownloadPcap);
        newBtn.id = 'pcapDownload';
        newBtn.className = 'x-btn x-btn-noicon x-box-item boosterBtn';
        newBtn.style.left = '160px';
        newBtn.querySelector('button').innerText = 'Скачать выделенные звонки';
        newBtn.querySelector('button').id = '';
        var panelFilter = document.querySelector('#sswa-softplatform-cdrs-filter');
        var panelButton = panelFilter.querySelector('.x-box-inner');
        panelButton.insertBefore(newBtn, panelButton.children[1]);

        function btnOver() {
            this.className = 'x-btn x-btn-noicon x-box-item x-btn-over boosterBtn';
        }

        function btnOut() {
            this.className = 'x-btn x-btn-noicon x-box-item boosterBtn';
        }

        function btnMouseDown() {
            this.className = 'x-btn x-btn-noicon x-box-item x-btn-click boosterBtn';
        }
    }

    function buildPcapMasterButton() {
        var newBtn = document.querySelector('#softplatformCdrsFilterExportBtn').cloneNode(true);
        newBtn.addEventListener('mouseover', btnOver);
        newBtn.addEventListener('mouseout', btnOut);
        newBtn.addEventListener('mousedown', btnMouseDown);
        newBtn.addEventListener('click', pcapMasterOpen);
        newBtn.id = 'pcapMaster';
        newBtn.className = 'x-btn x-btn-noicon x-box-item boosterBtn';
        newBtn.style.left = '335px';
        newBtn.querySelector('button').innerText = 'pcap master';
        newBtn.querySelector('button').id = '';
        var panelFilter = document.querySelector('#sswa-softplatform-cdrs-filter');
        var panelButton = panelFilter.querySelector('.x-box-inner');
        panelButton.insertBefore(newBtn, panelButton.children[1]);

        function btnOver() {
            this.className = 'x-btn x-btn-noicon x-box-item x-btn-over boosterBtn';
        }

        function btnOut() {
            this.className = 'x-btn x-btn-noicon x-box-item boosterBtn';
        }

        function btnMouseDown() {
            this.className = 'x-btn x-btn-noicon x-box-item x-btn-click boosterBtn';
        }
    }

    if (document.getElementById('copyCtx'))
        return;
    buildCopyContextBtn();
    buildPcapDownloadButton();
    buildPcapMasterButton();
}

function multiDownloadPcap() {
    const selected = selectedCallid();
    console.log(selected)
    Statistic.send('downloadPCAP', selected.length);
    selected.forEach(item => new MangoMonitor(item).download());
}

function pcapMasterOpen() {
    const selected = selectedCallid();
    const callIds = selected.forEach(item => {
        if (item.callId) {
            const url = PM + '/#/home;callId=' + item.callId;
            const target = '_blank';
            window.open(url, target);
        }
    });
}

class MangoMonitor {
    constructor(options) {
        const {
            callId,
            context = 'contextNo',
            direction = ''
        } = options;
        this.callId = callId;
        this.fileName = `${context} ${direction}.pcap`;
        this.retryAuth = false;
    }

    /** скачивает переименованный дамп  */
    async download() {
        await this.writeToken();
        await this.getCdrId();
        await this.filePath();
        this.open();
    }

    async getCdrId() {
        const options = {
            type: 'POST',
            url: `${MMAPI}/mmVMonitorModule/cdr/${this.token}`,
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                action: 'list',
                requestId: null,
                requestParams: JSON.stringify({
                    "dateFrom": "2018-01-27",
                    "timeFrom": "",
                    "dateTo": "",
                    "timeTo": "",
                    "lastDay": null,
                    "lastMin": null,
                    "numDirection": null,
                    "num": null,
                    "domainDirection": null,
                    "domain": null,
                    "ipAddressDirection": null,
                    "ipAddress": null,
                    "sipAgentDirection": null,
                    "sipAgent": null,
                    "callId": this.callId,
                    "start": 1,
                    "limit": 20,
                    "sort": "dateTime",
                    "dir": "desc",
                    "page": 1
                }),
            }),
            statusCode: {
                401: () => {
                    if (!this.retryAuth) {
                        log('got 401, remove token, retry download..');
                        this.retryAuth = true;
                        this.removeToken();
                        this.download();
                    }
                },
            },
        };

        const result = await $.ajax(options);
        const data = JSON.parse(result.response);
        const cdrId = data.list[0].id;
        log('cdrId', cdrId);
        this.cdrId = cdrId;
        return cdrId;
    }

    async writeToken() {
        const name = 'mm.token';
        const result = localStorage.getItem(name);
        if (result) {
            return this.token = result;
        }
        const token = await this.makeAuth(this.takeAuth());
        if (token) {
            localStorage.setItem(name, token);
            this.token = token;
        }
    }

    removeToken() {
        localStorage.removeItem('mm.token');
    }

    takeAuth() {
        const login = localStorage.getItem('mm.login');
        const password = localStorage.getItem('mm.password');
        return {
            login,
            password,
        };
    }


    async makeAuth(data) {
        const options = {
            url: MM + '/mmAuthModule/auth/',
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            dataType: 'json',
            data: JSON.stringify(data),
        };

        const {
            sessionId
        } = await $.ajax(options);
        log(sessionId);
        this.token = sessionId;
        return sessionId;
    }

    async filePath() {
        const options = {
            type: 'POST',
            url: `${MMAPI}/mmVMonitorModule/pcap/${this.token}`,
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                action: 'get',
                requestId: null,
                requestParams: JSON.stringify({
                    cdrId: this.cdrId,
                    idSensor: 1
                }),
            }),
        };

        const result = await $.ajax(options);
        const data = JSON.parse(result.response);
        this.fileData = data;
        return data;
    }

    open() {
        const qo = {
            ...this.fileData,
            action: 'load',
            isDeleteFile: true,
            fileName: this.fileName
        };
        log('qo', qo);
        const qs = $.param(qo);
        const link = `${MMAPI}/mmVMonitorModule/loadFile/${this.token}?${qs}`;
        const frame = $('<iframe>').attr('src', link);

        $(document.body).append(frame);
        setTimeout(frame.remove.bind(frame), 1000);
    }
}

/**
 * возвращает массив выделенных дампов
 * @return { { callId: string, context: string, direction: string }[] }
 */
function selectedCallid() {
    const rowColl = document.querySelectorAll('.x-grid3-row-selected');
    const result = [];

    for (let i = 0, size = rowColl.length; i < size; i++) {
        const iSipcallid = rowColl[i].querySelector('.x-grid3-col-sipCallId > a:last-child');
        if (!iSipcallid) continue;

        const callId = iSipcallid.innerText;
        const context = rowColl[i].querySelector('.x-grid3-td-contextId').innerText.replace(/\D/g, '');
        const outgoing = rowColl[i].querySelector('.x-grid3-td-inbound').querySelector('img').src.includes('up');
        const direction = outgoing ? 'OUT' : 'IN';

        result.push({
            callId,
            context,
            direction
        });
    }
    return result;
}

function waitInsertAccount() {
    var waitCount = 0;
    if (window.location.host.includes('192.168.37.150:8388') && window.location.hash.includes('#p=sswa-static-centrex') && window.location.search.length > 0) {
        waDone = ! function waDone() {
            waitCount++;
            if (waitCount > 10)
                return;
            if (document.getElementsByClassName('x-column-inner').length > 0) {
                doInsertAccount();
                return;
            } else
                setTimeout(waDone, 500);
        }();
    }
}

function doInsertAccount() {
    if (!/\?account=/.test(window.location.search))
        return;
    closeTab = function closeTab() {
        window.close();
    }

    function pushButton() {
        var allButton = document.getElementsByClassName('x-column-inner');
        allButton[1].querySelector('button').click();
    }


    var accNumber = window.location.search.replace(/\D/g, '');
    var input = document.getElementById('billingCode');
    input.value = accNumber;
    pushButton();
    setTimeout(closeTab, 1000);
    setTimeout(insertNumber, 2000);
}

var alreadySet = false;

function setVisibleColumn() {
    if (!window.location.host.includes("192.168.37.150:8388") || !window.location.hash.includes("#p=sswa-module-softplatform-cdrs") || alreadySet)
        return;
    $('.x-grid3-hd-inner.x-grid3-hd-expander > a')[0].click();
    var event = document.createEvent("MouseEvent");
    event.initMouseEvent("mouseover", true, true, null, 0, 0, 0, 100, 100, true, true, true, null, 1, null);
    $('.x-menu-item.x-menu-item-arrow')[0].dispatchEvent(event);

    $('#sswa-softplatform-cdrs-grid-hcols-menu').css('visibility', 'hidden');
    $('#sswa-softplatform-cdrs-grid-hcols-menu').prev().css('display', 'none');
    $('#sswa-softplatform-cdrs-grid-hctx').css('visibility', 'hidden');
    $('#sswa-softplatform-cdrs-grid-hctx').prev().css('display', 'none');

    setTimeout(function () {
        ! function checkColumn() {
            $('#sswa-softplatform-cdrs-grid-hcols-menu li.x-menu-list-item.x-menu-item-checked:contains(Расположение)').click();
            $('#sswa-softplatform-cdrs-grid-hcols-menu li.x-menu-list-item:not(.x-menu-item-checked):contains(User-agent)').click();
            $('#sswa-softplatform-cdrs-grid-hcols-menu li.x-menu-list-item:not(.x-menu-item-checked):contains(SIP-CALL-ID)').click();
        }();
        alreadySet = true;

        $('#sswa-softplatform-cdrs-grid-hcols-menu').css('visibility', 'hidden');
        $('#sswa-softplatform-cdrs-grid-hcols-menu').prev().css('display', 'none');
        $('#sswa-softplatform-cdrs-grid-hctx').css('visibility', 'hidden');
        $('#sswa-softplatform-cdrs-grid-hctx').prev().css('display', 'none');

    }, 200);
}

function buildQuickContext() {
    if (document.getElementsByClassName('quickContext').length > 0)
        return;
    var contextColl = document.getElementsByClassName('x-grid3-cell-inner x-grid3-col-contextId');
    for (i = 0; i < contextColl.length; i++) {
        var contextValue = contextColl[i].firstChild.innerText;
        var newElem = document.createElement('a');
        newElem.className = 'quickContext';
        newElem.target = '_blank';
        newElem.href = 'http://192.168.37.150:8388/webadmin-client/PRES-wa/?context=' + contextValue + '#p=sswa-module-softplatform-cdrs';
        newElem.innerText = ' ⚫ ';
        newElem.title = "Открыть контекст в новом окне";
        newElem.style = 'text-decoration: none !important; color:black; opacity: 0.5;';
        newElem.onclick = function () {
            this.innerText = ' ⚪ ';
            Statistic.send('context:reopen');
        };
        contextColl[i].appendChild(newElem);
    }
}

function minimizeAdvancedPanel() {
    var advancedPanel = document.getElementById('addFilterPanel');
    if (!advancedPanel.className.includes('x-panel-collapsed'))
        advancedPanel.querySelector('div.x-tool').click();
}

function buildButtonDownload() {
    if (document.getElementsByClassName('downloadPcap').length > 0)
        return;
    const sciColl = document.getElementsByClassName('x-grid3-col x-grid3-cell x-grid3-td-sipCallId x-grid3-cell-last');
    waSoftplatformCdrsAddClassToSipCallId();
    for (i = 0; i < sciColl.length; i++) {
        if (sciColl[i].querySelector('a') === null)
            continue;
        const currentCallid = sciColl[i].querySelector('a').innerText;
        const currentElem = document.createElement('a');
        currentElem.className = 'downloadPcap';
        currentElem.onclick = (e) => {
            const {
                target
            } = e;
            const context = $(target)
                .css('opacity', '0.7')
                .closest('tr')
                .find('.x-grid3-td-contextId a:first').text();
            const patternOUT = /arrow_up/i;
            const arrowLink = $(target).closest('tr').find('.x-grid3-td-inbound img').attr('src');
            const direction = patternOUT.test(arrowLink) ? 'OUT' : 'IN';

            const result = {
                callId: currentCallid,
                context,
                direction
            };
            Statistic.send('downloadPCAP');
            new MangoMonitor(result).download();
        }
        currentElem.innerHTML = '&#x1F4BE;';
        currentElem.href = 'javascript:void(0)';
        currentElem.style = 'padding-right: 10px; text-decoration: none;';
        currentElem.title = "Скачать дамп";
        sciColl[i].firstChild.insertBefore(currentElem, sciColl[i].firstChild.firstChild);
    }
}

function buildCopySingleContext() {
    if (document.getElementsByClassName('singleContext').length > 0)
        return;
    var directColl = document.getElementsByClassName('x-grid3-col x-grid3-cell x-grid3-td-inbound');
    for (i = 0; i < directColl.length; i++) {
        var directHTML = directColl[i].querySelector('img').outerHTML;
        directColl[i].querySelector('img').outerHTML = '<a href="javascript:void(0)" title="Скопировать контекст" onclick="copySingleContext(this); this.style.opacity = .5;" class="singleContext">' + directHTML + '</a>';
        //log(directHTML);
    }
}

window.copySingleContext = function copySingleContext(e) {
    var contextValue = e.parentElement.parentElement.parentElement;
    contextValue = contextValue.getElementsByClassName('x-grid3-col x-grid3-cell x-grid3-td-contextId')[0];
    contextValue = contextValue.querySelector('a').innerText.replace(/\D\s/g, '');
    copyContext(contextValue);
}

function copyContext(contextRaw) {
    var link = null;
    if (document.getElementsByClassName('contextForCopy').length === 0) {
        link = document.createElement('input');
        link.className = "contextForCopy";
        //link.setAttribute('value', contextRaw);
        link.value = contextRaw;
        document.body.appendChild(link);
    } else {
        link = document.getElementsByClassName('contextForCopy')[0];
        //link.setAttribute('value', contextRaw);
        link.value = contextRaw;
    }

    window.getSelection().removeAllRanges();
    link.select();

    try {

        var successful = document.execCommand('copy');
    } catch (err) {
        log('err');
    }
    window.getSelection().removeAllRanges();
    return false;
}



//для кнопки копирования номеров и даты
function buildCopyParamsOfCallWA() {
    // if (document.getElementsByClassName('singleContext').length > 0)
    //     return;
    var directColumn = document.getElementsByClassName('x-grid3-col x-grid3-cell x-grid3-td-callingNumber');
    for (i = 0; i < directColumn.length; i++) {
        var directHTML = directColumn[i].querySelector('div').outerHTML;
        directColumn[i].querySelector('div').outerHTML = '<a style="color:-webkit-link; font-weight:700" title="Скопировать Контекст/С номера/На номер/Создание" onmousedown="copyParamsOfCallWA(this); this.style.opacity = .7;" class="paramsOfData">' + directHTML + '</a>';
    }
}

//для кнопки копирования контекста, номеров и даты
window.copyParamsOfCallWA = function copyParamsOfCallWA(e) {
    var contextValue = e.parentElement.parentElement.parentElement;
    let needlyValues = contextValue.querySelectorAll('td');
    let arrUsefulInfoOfCallWA = [];
    for (element of needlyValues) {
        let textElement = element.textContent
        arrUsefulInfoOfCallWA.push(textElement);
    }
    let selectArrUsefulInfoOfCallWA = [arrUsefulInfoOfCallWA[3].substring(0, 11), arrUsefulInfoOfCallWA[8], arrUsefulInfoOfCallWA[9], arrUsefulInfoOfCallWA[12]]
    copyContext(selectArrUsefulInfoOfCallWA.join('   '));
}

//observer WA
function wrapperObserverForCallsWA() {
  let fullTableOfCallsWA = document.querySelector('.x-grid3-body'); //за чем будем следить
  const configForCallsWA = {
    childList: true,
    attributes: true
  };

  let observerForCopyCallWA = new MutationObserver(() => {
    let linkParams = document.querySelector('.paramsOfData');
    if(linkParams === null) {
      buildCopyParamsOfCallWA();
    }
  });

  observerForCopyCallWA.observe(fullTableOfCallsWA, configForCallsWA);
}

function waitLoadContextGrid() {
    setTimeout(function () {
        var wCount = 0;
        ! function waitIteration() {
            wCount++;
            var contextGrid = document.getElementsByClassName('x-grid3-row')[0];
            var eltLoader = document.getElementsByClassName('x-mask-loading')[0];
            if (wCount > 50)
                return;
            if (contextGrid == null || eltLoader) {
                setTimeout(waitIteration, 500);
                return;
            } else {
                buildButtonDownload();
                buildCopySingleContext();
                wrapperObserverForCallsWA();
                buildCopyParamsOfCallWA();
                buildApiLink();
                buildQuickContext();
                expandColumn('.x-grid3-td-contextId', '100px');
            }
        }();
    }, 200);
}

function buildApiLink() {
    if (window.location.host != "192.168.37.150:8388")
        return;
    if (document.getElementsByClassName('linkKibana').length > 0)
        return;
    var ctxElem = document.getElementsByClassName('x-grid3-cell-inner x-grid3-col-contextId');
    var arrSize = ctxElem.length;
    for (i = 0; i < arrSize; i++) {
        if (!ctxElem[i])
            return;
        var eventDiv = document.createElement("div");
        eventDiv.style = "display: inline; margin-left: 5px;";
        var eventElem = document.createElement('a');
        eventElem.href = 'javascript:void(0)';
        var mrcName = ctxElem[i].parentElement.parentElement.querySelector('.x-grid3-col-softPlatformName').innerText;
        eventElem.onclick = function () {
            this.style.opacity = .3;
            Statistic.send('kibana:call');
            openKibana(this, 'call');
        }
        eventElem.target = '_blank';
        eventElem.innerHTML = 'call';
        eventElem.className = 'linkKibana';

        var recElem = document.createElement('a');
        recElem.href = 'javascript:void(0)';
        recElem.onclick = function () {
            this.style.opacity = .3;
            Statistic.send('kibana:rec');
            openKibana(this, 'recording');
        }
        recElem.target = '_blank';
        recElem.innerHTML = 'rec';
        recElem.className = 'linkKibana';
        recElem.style = 'margin-left: 5px;';


        eventDiv.appendChild(eventElem);
        eventDiv.appendChild(recElem);
        var appendObj = document.getElementsByClassName('x-grid3-cell-inner x-grid3-col-softPlatformName');
        appendObj[i].appendChild(eventDiv);
    }

    function buildEntryID(contextID, softswitchID) {
        return btoa(contextID);
    }

    function openKibana(object, eventType) {
        const parentRow = object.parentElement.parentElement.parentElement.parentElement;
        const contextID = parentRow.querySelector('.x-grid3-col-contextId').innerText.replace(/\D/g, '');
        const entry_id = buildEntryID(contextID);
        const kibanaLink = `http://kibana-loadlog.by.mgo.su/app/discover#/?_g=(filters:!(),refreshInterval:(display:Off,pause:!f,value:0),time:(from:now-7d%2Fd,to:now))&_a=(columns:!(MSG,CODE,PARAMETERS.post.json,PARAMETERS.url),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:MSG,negate:!f,params:!('End%20send%20request'),type:phrases),query:(bool:(minimum_should_match:1,should:!((match_phrase:(MSG:'End%20send%20request')))))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',key:PARAMETERS.url,negate:!f,params:(query:%2Fevents%2F${eventType}%2F),type:phrase),query:(match_phrase:(PARAMETERS.url:%2Fevents%2F${eventType}%2F)))),index:'7ef17140-ab05-11ea-9fbe-8957ac0db32a',interval:auto,query:(language:lucene,query:${entry_id}),sort:!('@timestamp',desc))`;
        window.open(kibanaLink);
    }
}

function insertBID() {
    if (!/\?bid/.test(window.location.search))
        return;
    if (typeof alreadyInsertBID == 'undefined')
        window.alreadyInsertBID = false;
    if (alreadyInsertBID)
        return;
    if (window.location.hash == "#p=sswa-module-softplatform-cdrs" && window.location.search.length > 2) {
        var submbutton = false;
        var timerCall = setInterval(function () {
            if (!submbutton) {
                document.getElementById('f-accountCode').value = window.location.search.replace(/\D/g, '');
                document.getElementById('f-presetCombo').click();
                $('div.x-combo-list-item:contains("За последний час")').click();

                var buttonArea = document.getElementsByClassName('x-box-inner')[0];
                var applyButton = buttonArea.querySelector('tbody > tr:nth-child(2) > td.x-btn-mc > em > button');
                if (applyButton) {
                    applyButton.click();
                    submbutton = true;
                    alreadyInsertBID = true;
                }
            }
        }, 500);

        //  остановить повторы
        setTimeout(function () {
            clearInterval(timerCall);

        }, 10000);
    }
}

function waitLoadSipGrid() {
    var wCount = 0;

    function waitIteration() {
        wCount++;
        if (wCount > 100)
            return;
        if (document.querySelector('#sswa-sip-sessions-grid .ext-el-mask-msg.x-mask-loading')) {
            setTimeout(waitIteration, 200);
            return;
        }
    }
    setTimeout(waitIteration, 200);
}

function resizeUserAgent2() {
    var finalSizeUserAgent = 350;
    var delta = finalSizeUserAgent - $('td.x-grid3-col.x-grid3-cell.x-grid3-td-userAgent').width();

    $('td.x-grid3-td-userAgent').css('width', finalSizeUserAgent);
    $('div.x-grid3-row').width($('div.x-grid3-row').width() + delta);
    $('x-grid3-header-offset').width($('x-grid3-header-offset').width() + delta);
    $('x-grid3-body').width($('x-grid3-body').width() + delta);
}

function onclickSubmitSipSession() {
    if (!window.location.hash.includes('p=sswa-module-sip-sessions-cluster'))
        return;
    var submitBtn = document.querySelector('#sswa-sip-sessions-cluster-filter td.x-toolbar-cell tbody');
    submitBtn.addEventListener('click', waitLoadSipGrid);
}

function successCallHandler() {
    if (!/\?successcall=/.test(window.location.search))
        return;

    var sipURI = 'sip:' + getParam('successcall');
    var bid = getParam('bid');
    //document.getElementById('f-fromDate').value = '01.02.2017';
    document.getElementById('f-presetCombo').click();
    $('div.x-combo-list-item:contains("За последнюю неделю")').click();
    document.getElementById('f-calledNumbers').value = sipURI;
    document.getElementById('f-accountCode').value = bid;
    document.getElementById('f-discReasonHdw').value = '404';
    document.getElementById('f-discReasonHdwNot').checked = true;

    var p = document.getElementsByClassName('x-box-inner');
    p[0].querySelector('tbody[class="x-btn-small x-btn-icon-small-left"]').click();
}

function getParam(paramName) {
    var params = window
        .location
        .search
        .replace('?', '')
        .split('&')
        .reduce(
            function (p, e) {
                var a = e.split('=');
                p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                return p;
            }, {}
        );
    return params[paramName];
}

function buildBtnTestim() {
    if (!window.location.hash.includes('#p=sswa-static-centrex'))
        return;
    var waitCount = 0;
    ! function waDone() {
        waitCount++;
        if (waitCount > 10)
            return;
        if (document.getElementsByClassName('x-column-inner').length > 0) {
            beginBuild();
            return;
        } else
            setTimeout(waDone, 500);
    }();

    function beginBuild() {
        if (document.getElementsByClassName('buttonTestim').length > 0)
            return;
        var buttonColl = document.querySelectorAll('.x-btn-text.ics-logo');
        var buttonOpenIcs = buttonColl[1].parentElement.parentElement.parentElement.parentElement.parentElement;
        var buttonTestim = buttonOpenIcs.cloneNode(true);
        buttonTestim.querySelector('button').innerText = 'testim0000 ВАТС18';
        buttonTestim.addEventListener('click', openTestim);
        buttonTestim.addEventListener('mouseover', btnOver);
        buttonTestim.addEventListener('mouseout', btnOut);
        buttonTestim.addEventListener('mousedown', btnMouseDown);
        buttonTestim.className = 'x-btn x-btn-text-icon buttonTestim';
        buttonOpenIcs.parentElement.style.display = 'inline-flex';
        buttonOpenIcs.style.margin = '0px 15px 0px 0px';
        buttonOpenIcs.parentElement.appendChild(buttonTestim);
    }

    function openTestim() {
        SSWA.IcsRunner();
        SSWA.runByAbonentId('400547254', false);
    }

    function btnOver() {
        this.className = 'x-btn x-btn-text-icon buttonTestim x-btn-over';
    }

    function btnOut() {
        this.className = 'x-btn x-btn-text-icon buttonTestim';
    }

    function btnMouseDown() {
        this.className = 'x-btn x-btn-text-icon buttonTestim x-btn-click';
    }
}

function perpageAddHandler() {
    if (window.location.hash != "#p=sswa-module-softplatform-cdrs")
        return;
    $('[name="perpage"]').click().click();
    $('.x-layer.x-combo-list .x-combo-list-inner .x-combo-list-item:contains(20)').parent().click(waitLoadContextGrid);
}

function addHashChangeHandler() {
    window.addEventListener("hashchange", hashChangeHandler);

    function hashChangeHandler() {
        setTimeout(waModule, 200);
    }
}

/**
 * регистрирует обработчики логина в ВА
 */
function registerAuthIntercept() {
    const loginKey = 'mm.login';
    const passwordKey = 'mm.password';

    const loginInput = '#sswa-login-username';
    const passwordInput = 'input[name="password"]';

    const selectorSubmitButton = '#sswa-login-window table > tbody.x-btn-small:has(button)';
    const selectorForm = '#sswa-login-window form';

    $(document).on('click', selectorSubmitButton, authToStorage);
    $(document).keydown(e => {
        if (e.which !== 13) return;
        if (document.querySelector(selectorForm) === null) return;
        authToStorage();
    });

    function authToStorage() {
        const login = $(loginInput).val();
        const password = $(passwordInput).val();

        localStorage.setItem(loginKey, login);
        localStorage.setItem(passwordKey, password);
    };
}

/**
 * Меняет ширину колонки в cdr
 * @param {string} selector селектор колонок
 * @param {string} valuePx размер (например, '120px')
 */
function expandColumn(selector, valuePx) {
    log('expandColumn', selector, valuePx);
    const rows = document.querySelectorAll(selector);
    rows.forEach(item => item.style.width = valuePx);
}

class waApButtonSipSessionCluster {
    constructor() {
        this.sipUser = $('#f-name').val();
        this.sipDomain = $('#f-domain').val();
        this.sip = this.sipUser + '@' + this.sipDomain;
        this.init();
    }
    async init() {
        log('waApButtonSipSessionCluster init');
        this.clear();
        if (await this.check()) {
            this.build();
        }
    }
    async check() {
        const url = `${AP}/autoprovision/isconnect?sip=${this.sip}`;
        const { success } = await $.ajax(url);
        return success;
    }
    build() {
        const button = $('#sswa-sip-sessions-cluster-filter td.x-toolbar-cell').first().clone(true);
        button
            .attr('id', 'autoprovision-button')
            .attr('title', 'Открыть в новой вкладке этот SIP на автопровижне')
            .click(() => {
                window.open(`${AP}/autoprovision/start?sip=${this.sip}&action=bysip&autosearch=1`);
                Statistic.send('ap:wa-sip-sessions-cluster');
            })
            .find('button')
            .text('Autoprovision')
            .css('font-weight', '900');

        $('#sswa-sip-sessions-cluster-filter .x-toolbar-left-row').first().append(button);
    }

    clear() {
        $('#autoprovision-button').remove();
    }

}

function waSoftplatformCdrsAddClassToSipCallId() {
    $('.x-grid3-col-sipCallId > a').addClass('sipCallId');
};

class waSoftplatformCdrsReplaceCallIdLink {
  constructor() {
    setTimeout(() => {
      this.init();
    }, 1000);
  }
  init() {
    $(".x-grid3-col-sipCallId > a.sipCallId")
      .removeAttr("onmousedown onclick")
      .click((e) => {
        Statistic.send("wa:callId");
      })
      .each(function () {
        const item = $(this);
        const callId = item.text().trim();
        item.attr("target", "_blank").attr("href", `${booster_environment.DA}/?callId=${callId}`);
        item.click((event) => {
          const waLogin = document.querySelector("#ext-gen99").innerText;

          const requestParams = {
            email: waLogin,
            type: "wa_to_da",
            from: "webadmin",
            to: callId,
            note: "",
          };

          $.post(`${booster_environment.MA_WORK_NODE_URL}/add-statistic-bpm-otp-action`, requestParams);
        });
      });
  }
}

class waIcsRunner {
    constructor(options) {
        this.options = options;
        this.build();
    }

    build() {
        const { container, after } = this.options;
        const { html } = this;
        html.find('input')
            .on('input paste', this.clearInput)
            .keyup(e => {
                if (e.keyCode === 13) {
                    e.stopPropagation();
                    this.openLk();
                }
            });

        html.find('button')
            .click(this.openLk);

        if (after) {
            container.after(html);
        }
    }

    openLk() {
        const aid = $('#ics-account-number').val();
        SSWA.IcsRunner();
        SSWA.runByAccountId(aid, false);
        Statistic.send('wa:ics:runner:header');
    }

    clearInput(e) {
        const { target } = e;
        const { value } = target;
        target.value = value.replace(/[ \u200b]/g, '');
    }

    get html() {
        return $(`<td class="x-toolbar-cell"><span class="xtb-sep"></span></td><td class="x-toolbar-cell mango-booster" style="display: flex;">
            <input type="text" size="20" autocomplete="off" id="ics-account-number" class="x-form-text x-form-field" style="width: 100px;"
                placeholder="Лицевой счёт" value="testim0000">
            <button class="x-btn-text ics-logo" type="button" style="width: 30px;background-repeat: no-repeat;background-position: center;" title="Открыть личный кабинет"></button>
        </td>`);
    }
}

//---------------------------------------------
// модуль веб админ

function waModule() {
    addHashChangeHandler();
    insertContext();
    insertSip();
    insertBID();
    parseCustomUrl();
    addHandlerButton();
    webAdminHotKey();
    waitInsertAccount();
    buildBtnTestim();
    setTimeout(successCallHandler, 500);
};

function initwaModule() {
    $(document).ready(() => {
        setTimeout(waModule, 1500);
        XHRListener.on(/wa\/SSWAController\?module=SipSessionsCluster&action=list&waModelIdList=/i, e => {
            log(e);
            new waApButtonSipSessionCluster();
            expandColumn('.x-grid3-td-userAgent', '350px');
        });
        XHRListener.on(/wa\/SSWAController\?module=SoftplatformCdrs&action=list/i, e => {
            log(e);
            new waSoftplatformCdrsReplaceCallIdLink();
        });
        XHRListener.on(/wa\/SSWAController\?module=UserFavoriteMenus&action=list/i, e => {
            log(e, 'wa ready');
            new waIcsRunner({
                after: true,
                container: $('#sswa-current-date').closest('td'),
            });
        });
        registerAuthIntercept();

    });
}

//---------------------------------------------------------------------------------------------------------------------------------------
// HD

function quickLk() {
    if (!window.top.location.search.includes('woMode=viewWO&woID='))
        return;

    function goCentrex() {
        var accountNumber = window.top.document.getElementsByClassName('name');
        if (accountNumber.length > 0) {
            window.open('http://192.168.37.150:8388/webadmin-client/PRES-wa/?' + accountNumber[0].innerText + '#p=sswa-static-centrex')
        }
    }

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    ! function buildCopyButton() {
        var accountNumber = window.top.document.getElementsByClassName('name');
        if (accountNumber.length > 0 && window.top.document.getElementsByClassName('copyButton').length === 0) {
            if (!isNumeric(accountNumber[0].innerText))
                return;
            var newButton = window.top.document.createElement('input');
            newButton.type = 'button';
            newButton.className = 'copyButton linkborder';
            newButton.value = " ЛК ";
            newButton.style = 'height:20px; margin: 0% 2% 0% 2%;';
            newButton.onclick = function () {
                buildQuickLkFrame()
            };
            accountNumber[0].parentElement.parentElement.insertBefore(newButton, accountNumber[0].parentElement.parentElement.firstChild);
        }
    }();
}

function buildQuickLkFrame() {
    removeOldFrame();
    var accountNumber = window.top.document.getElementsByClassName('name');
    var quickLKframe = window.top.document.createElement('iframe');
    var urlWebAdminLink = 'http://192.168.37.150:8388/webadmin-client/PRES-wa/?account=' + accountNumber[0].innerText + '#p=sswa-static-centrex';
    quickLKframe.src = urlWebAdminLink;
    quickLKframe.className = 'quickLKframe';
    quickLKframe.style.display = 'none';
    window.top.document.body.appendChild(quickLKframe);
}

function removeOldFrame() {
    var oldFrameColl = window.top.document.getElementsByClassName('quickLKframe');
    for (i = 0; i < oldFrameColl.length; i++)
        oldFrameColl[i].remove();
}

function autoSetAttribute() {

    function updateCategory() {
        var e = window.top.document.getElementById('Inline_CATEGORYID');
        var c = window.top.document.getElementById('Inline_SUBCATEGORYID');
        var g = window.top.csi;
        var a = window.top.document.getElementById('Inline_ITEMID');
        var f;
        var b;
        window.top.categoryChange(e, c, g, a, f, b); // обновить список "подкатегория"
    }

    function updateSubCategory() {
        var b = window.top.document.getElementById('Inline_SUBCATEGORYID');
        var a = window.top.document.getElementById('Inline_ITEMID');
        var e = window.top.csi;
        var c;
        window.top.subCategoryChange(b, a, e, c);
    }

    function updateSpecialist() {
        var b = window.top.document.getElementById('Inline_QUEUEID');
        var g = window.top.document.getElementById('Inline_OWNERID');
        var f = window.top.csi;
        var e;
        var c = window.top.document.getElementById('Inline_SITEID');
        window.top.groupChange(b, g, f, e, c);
    }

    window.top.autosetAttributeMass = function autosetAttributeMass() {
        Statistic.send('hd:attributes:mass');
        mainDocument = window.top.document;
        //Редактировать
        mainDocument.getElementById('Inline_RequestEdit_ID').click();

        //   Тип заявки = Запрос информации
        // var typeTT = mainDocument.getElementById('Inline_REQUESTTYPEID');
        // typeTT.value = '3';

        //  Последствие = Затрагивает Бизнес
        var subSequence = mainDocument.getElementById('Inline_IMPACTID');
        subSequence.value = '1';

        //  Срочность = Обычная
        // var urgency = mainDocument.getElementById('Inline_URGENCYID');
        // urgency.value = '3';

        //Статус - In Work
        var statusTicket = mainDocument.getElementById('Inline_STATUSID');
        statusTicket.value = '602';

        //  Группа  = Группа 1-й линии Технической Поддержки
        var group = mainDocument.getElementsByName('QUEUEID')[0];
        group.value = '901';

        updateSpecialist();

        // Специалист
        var owner = mainDocument.getElementById('Inline_OWNERID');
        owner.value = window.top.sdp_user["LOGGEDIN_USERID"];

        // Уровень заявки = начальный
        var level = mainDocument.getElementById('Inline_LEVELID');
        level.value = '303';

        //Режим = E-Mail
        var mode = mainDocument.getElementById('Inline_MODEID');
        mode.value = '1';

        //Категория - 03. Заявки ОТП
        var cat = mainDocument.getElementById('Inline_CATEGORYID');
        cat.value = '1507';

        updateCategory();

        //Подкатегория - 09. Массовая проблема (Начальный)
        var subCat = mainDocument.getElementById('Inline_SUBCATEGORYID');
        subCat.value = '20409';

        updateSubCategory();

        var buttonUpdate = mainDocument.getElementsByClassName('formStylebuttonAct')[0];
        buttonUpdate.removeAttribute('disabled');

        //Обновить
        setTimeout(function () {
            mainDocument.getElementsByClassName('formStylebuttonAct')[0].click();
        }, 500);
    }

    window.top.autosetAttributeAPI = function autosetAttributeAPI() {
        Statistic.send('hd:attributes:api');
        mainDocument = window.top.document;
        //Редактировать
        mainDocument.getElementById('Inline_RequestEdit_ID').click();

        //   Тип заявки = Запрос информации
        // var typeTT = mainDocument.getElementById('Inline_REQUESTTYPEID');
        // typeTT.value = '1';
        // typeTT[1].selected = true;

        //  Последствие = Затрагивает Бизнес
        var subSequence = mainDocument.getElementById('Inline_IMPACTID');
        subSequence.value = '1';

        //  Срочность = Обычная
        // var urgency = mainDocument.getElementById('Inline_URGENCYID');
        // urgency.value = '3';

        //Статус - In Work
        var statusTicket = mainDocument.getElementById('Inline_STATUSID');
        statusTicket.value = '602';

        //  Группа  = Группа по обслуживанию API клиентов ОТП
        var group = mainDocument.getElementsByName('QUEUEID')[0];
        group.value = '12601';

        updateSpecialist();

        // Специалист = Артур Бобровских
        var owner = mainDocument.getElementById('Inline_OWNERID');
        owner.value = window.top.sdp_user["LOGGEDIN_USERID"];

        // Уровень заявки = экспертный
        var level = mainDocument.getElementById('Inline_LEVELID');
        level.value = '1';

        //Режим = E-Mail
        var mode = mainDocument.getElementById('Inline_MODEID');
        mode.value = '1';

        //Категория - 03. Заявки ОТП
        var cat = mainDocument.getElementById('Inline_CATEGORYID');
        cat.value = '1507';

        updateCategory();

        //Подкатегория - 13. API (Начальный/Экспертный)
        var subCat = mainDocument.getElementById('Inline_SUBCATEGORYID');
        subCat.value = '20413';

        updateSubCategory();

        //Позиция - 13.4 Проблема с получением данных от сервера (экспертный)
        var pos = mainDocument.getElementById('Inline_ITEMID');
        pos.value = '26406';

        //Обновить
        setTimeout(function () {
            mainDocument.getElementsByClassName('formStylebuttonAct')[0].click();
        }, 500);
    }

    window.top.autosetAttributeITG = function autosetAttributeITG() {
        Statistic.send('hd:attributes:itg');
        mainDocument = window.top.document;
        //Редактировать
        mainDocument.getElementById('Inline_RequestEdit_ID').click();

        //   Тип заявки = Запрос информации
        // var typeTT = mainDocument.getElementById('Inline_REQUESTTYPEID');
        // typeTT.value = '1';
        // typeTT[1].selected = true;

        //  Последствие = Затрагивает Бизнес
        var subSequence = mainDocument.getElementById('Inline_IMPACTID');
        subSequence.value = '1';

        //  Срочность = Обычная
        // var urgency = mainDocument.getElementById('Inline_URGENCYID');
        // urgency.value = '3';

        //  Группа  = Группа по обслуживанию API клиентов ОТП
        var group = mainDocument.getElementsByName('QUEUEID')[0];
        group.value = '12601';

        updateSpecialist();

        // Специалист -
        var owner = mainDocument.getElementById('Inline_OWNERID');
        owner.value = window.top.sdp_user["LOGGEDIN_USERID"];

        //Статус - In Work
        var statusTicket = mainDocument.getElementById('Inline_STATUSID');
        statusTicket.value = '602';

        //Режим = E-Mail
        var mode = mainDocument.getElementById('Inline_MODEID');
        mode.value = '1';

        // Уровень заявки - стандартный
        var level = mainDocument.getElementById('Inline_LEVELID');
        level.value = '302';

        //Категория - 03. Заявки ОТП
        var cat = mainDocument.getElementById('Inline_CATEGORYID');
        cat.value = '1507';

        updateCategory();

        //Подкатегория - 19. Интеграция с виджетами (Начальный / Стандартный / Экспертный)
        var subCat = mainDocument.getElementById('Inline_SUBCATEGORYID');
        subCat.value = '22806';

        updateSubCategory();

        //Обновить
        setTimeout(function () {
            mainDocument.getElementsByClassName('formStylebuttonAct')[0].click();
        }, 500);
    }

    window.top.autosetAttributeCT = function autosetAttributeCT() {
        Statistic.send('hd:attributes:ct');
        mainDocument = window.top.document;
        //Редактировать
        mainDocument.getElementById('Inline_RequestEdit_ID').click();

        //   Тип заявки = Запрос информации
        // var typeTT = mainDocument.getElementById('Inline_REQUESTTYPEID');
        // typeTT.value = '1';
        // typeTT[1].selected = true;

        //  Последствие = Затрагивает Бизнес
        var subSequence = mainDocument.getElementById('Inline_IMPACTID');
        subSequence.value = '1';

        //  Срочность = Обычная
        // var urgency = mainDocument.getElementById('Inline_URGENCYID');
        // urgency.value = '3';

        //  Группа  = Группа по обслуживанию API клиентов ОТП
        var group = mainDocument.getElementsByName('QUEUEID')[0];
        group.value = '12601';

        updateSpecialist();

        // Специалист -
        var owner = mainDocument.getElementById('Inline_OWNERID');
        owner.value = window.top.sdp_user["LOGGEDIN_USERID"];

        //Статус - In Work
        var statusTicket = mainDocument.getElementById('Inline_STATUSID');
        statusTicket.value = '602';

        //Режим = E-Mail
        var mode = mainDocument.getElementById('Inline_MODEID');
        mode.value = '1';

        // Уровень заявки - стандартный
        var level = mainDocument.getElementById('Inline_LEVELID');
        level.value = '302';

        //Категория - 03. Заявки ОТП
        var cat = mainDocument.getElementById('Inline_CATEGORYID');
        cat.value = '1507';

        updateCategory();

        //Подкатегория - 17. CallTracking (Начальный / Стандартный / Экспертный)
        var subCat = mainDocument.getElementById('Inline_SUBCATEGORYID');
        subCat.value = '22804';

        updateSubCategory();

        //Обновить
        setTimeout(function () {
            mainDocument.getElementsByClassName('formStylebuttonAct')[0].click();
        }, 500);
    }

    window.top.autosetAttributeSpam = function autosetAttributeSpam() {
        Statistic.send('hd:attributes:spam');
        mainDocument = window.top.document;
        //Редактировать
        mainDocument.getElementById('Inline_RequestEdit_ID').click();

        //   Тип заявки = Запрос информации
        // var typeTT = mainDocument.getElementById('Inline_REQUESTTYPEID');
        // typeTT.value = '1';
        // typeTT[1].selected = true;

        //  Последствие = Затрагивает Бизнес
        var subSequence = mainDocument.getElementById('Inline_IMPACTID');
        subSequence.value = '1';

        //  Срочность = Обычная
        // var urgency = mainDocument.getElementById('Inline_URGENCYID');
        // urgency.value = '3';

        //  Группа  = Группа по обслуживанию API клиентов ОТП
        var group = mainDocument.getElementsByName('QUEUEID')[0];
        group.value = '12601';

        updateSpecialist();

        // Специалист -
        var owner = mainDocument.getElementById('Inline_OWNERID');
        owner.value = window.top.sdp_user["LOGGEDIN_USERID"];

        //Статус - In Work
        var statusTicket = mainDocument.getElementById('Inline_STATUSID');
        statusTicket.value = '602';

        //Режим = E-Mail
        var mode = mainDocument.getElementById('Inline_MODEID');
        mode.value = '1';

        // Уровень заявки - начальный
        var level = mainDocument.getElementById('Inline_LEVELID');
        level.value = '303';

        //Категория - 03. Заявки ОТП
        var cat = mainDocument.getElementById('Inline_CATEGORYID');
        cat.value = '1507';

        updateCategory();

        //Подкатегория - Нецелевое обращение (Начальный)
        var subCat = mainDocument.getElementById('Inline_SUBCATEGORYID');
        subCat.value = '20416';

        updateSubCategory();

        //Обновить
        setTimeout(function () {
            mainDocument.getElementsByClassName('formStylebuttonAct')[0].click();
        }, 500);
    }


    ! function buildButtonMass() {
        if (window.top.document.getElementsByClassName('buttonMass').length > 0)
            return;

        var parEl = window.top.document.getElementsByClassName('formcancelbtn-label-ui1')[0].parentElement;
        var newButton = window.top.document.createElement('input');
        newButton.value = "Атрибуты 'Массовая'";
        newButton.type = "button";
        newButton.className = 'buttonMass formcancelbtn-ui1';
        newButton.style = "margin-left: 10px; height:26px;";
        newButton.setAttribute('onclick', 'autosetAttributeMass()');
        parEl.appendChild(newButton);
    }();

    ! function buildButtonAPI() {
        if (window.top.document.getElementsByClassName('buttonAPI').length > 0)
            return;
        var parEl = window.top.document.getElementsByClassName('formcancelbtn-label-ui1')[0].parentElement;
        var newButton = window.top.document.createElement('input');
        newButton.value = "Атрибуты 'API'";
        newButton.type = "button";
        newButton.className = 'buttonAPI formcancelbtn-ui1';
        newButton.style = "margin-left: 10px; height:26px;";
        newButton.setAttribute('onclick', 'autosetAttributeAPI()');
        parEl.appendChild(newButton);
    }();

    ! function buildButtonITG() {
        if (window.top.document.getElementsByClassName('buttonITG').length > 0)
            return;
        var parEl = window.top.document.getElementsByClassName('formcancelbtn-label-ui1')[0].parentElement;
        var newButton = window.top.document.createElement('input');
        newButton.value = "Атрибуты 'Интеграция'";
        newButton.type = "button";
        newButton.className = 'buttonITG formcancelbtn-ui1';
        newButton.style = "margin-left: 10px; height:26px;";
        newButton.setAttribute('onclick', 'autosetAttributeITG()');
        parEl.appendChild(newButton);
    }();

    ! function buildButtonCT() {
        if (window.top.document.getElementsByClassName('buttonCT').length > 0)
            return;
        var parEl = window.top.document.getElementsByClassName('formcancelbtn-label-ui1')[0].parentElement;
        var newButton = window.top.document.createElement('input');
        newButton.value = "Атрибуты 'Колтрекинг'";
        newButton.type = "button";
        newButton.className = 'buttonCT formcancelbtn-ui1';
        newButton.style = "margin-left: 10px; height:26px;";
        newButton.setAttribute('onclick', 'autosetAttributeCT()');
        parEl.appendChild(newButton);
    }();

    ! function buildButtonSpam() {
        if (window.top.document.getElementsByClassName('buttonSpam').length > 0)
            return;
        var parEl = window.top.document.getElementsByClassName('formcancelbtn-label-ui1')[0].parentElement;
        var newButton = window.top.document.createElement('input');
        newButton.value = "Атрибуты 'СПАМ'";
        newButton.type = "button";
        newButton.className = 'buttonSpam formcancelbtn-ui1';
        newButton.style = "margin-left: 10px; height:26px;";
        newButton.setAttribute('onclick', 'autosetAttributeSpam()');
        parEl.appendChild(newButton);
    }();
}

async function linkRedmineIssue() {
    if (!window.top.location.search.includes('woMode=viewWO&woID='))
        return;

    const reference = document.querySelector('#WorkOrder_Fields_UDF_LONG2_CUR');
    if (!reference) return;
    log('reference', reference);
    const issueNo = reference.innerText.replace(/\D+/, '');
    const linkElement = document.createElement('a');
    linkElement.innerText = 'Открыть';
    linkElement.setAttribute('href', `http://redmine.mango.local/issues/${issueNo}`);
    linkElement.setAttribute('target', '_blank');
    linkElement.style.margin = '0px 10px';

    reference.parentNode.insertBefore(linkElement, reference.nextSibling);
}

function resolutionFromConversations($) {

    const className = 'resolutionFromConversations';
    const alreadyInit = window.top.document.querySelector(`.${className}`);
    if (alreadyInit) return;
    const conversations = $('#notifications_div .recent-conversation .row .threadclickbox');

    const a = $('<a>')
        .text('Сделать решением')
        .css('margin', '0px 10px')
        .addClass(className)
        .click(async e => {
            e.stopPropagation();
            Statistic.send('hd:setResolution');
            const { target } = e;
            const parent = $(target).closest('.threadclickbox');
            const onclick = parent.attr('onclick');
            const [convId, reqId] = onclick.match(/\d+/g);

            const resolution = await (async () => {
                const url = `http://hd/ViewConversationDesc.do?operation=notificationDesc&notificationID=${convId}&workOrderID=${reqId}`;
                const res = await $.get(url);
                const resDocument = $('<document>').html(res);
                return resDocument.find('>p').text().trim();
            })();


            const setResolution = await (async () => {
                const woStatus = $('#STATUSID_CUR').attr('val') || 1;
                const options = {
                    type: 'POST',
                    url: 'http://hd/AddResolution.do',
                    data: {
                        woResolution: -1,
                        onHoldSet1: 'null',
                        'date1@@@1': 'null',
                        'selectedStatus@@@1': 'null',
                        'onHoldComments@@@1': 'null',
                        resolution,
                        woStatus,
                        MOD_IND: 'WorkOrder',
                        FORMNAME: 'addResolutionForm',
                        addResolutionButton: 'Сохранить',
                        requestID: reqId,
                    },
                };

                const res = await $.ajax(options);
                return res;
            })();

            $(`.${className}`).css('opacity', '1');
            $(target).css('opacity', '0.5');
        });
    conversations.append(a);
}

//---------------------------------------------
// модуль HD


function initHDModule() {
    window.top.jQuery(document).ready(function () {
        const $ = window.top.jQuery || $;
        quickLk();
        autoSetAttribute();
        linkRedmineIssue();
        resolutionFromConversations($);
    });
}


//---------------------------------------------------------------------------------------------------------------------------------------
// ЛОГИ

/**
 * Обработчик выгрузки SIP логов
 */
class SipHandler {
    constructor() {
        this.sip = QS.value;
        this.init();
    }

       init() {
        if (/^(sip|sip-registrar)$/.test(QS.type) && QS.value) {
            return this.build({ server: '#server20' }); 
        }
        if (QS.type === 'sip-worker' && QS.value) {  
            return this.build({ server: '#server19' }); 
        }
    }

    build({ server }) {
        $(server).click();
        $('#output_method1').click();
        $('#search_text').val(this.sip);
        $('#time_from').val(new Date().getHours() - 1); 
        $('#time_to').val(new Date().getHours()); 
        $('#submit1').click();
    }
}

/**
 * Обработчик выгрузки SIPUAC логов
 */
class SipUACHandler {
    constructor() {
        this.sip = QS.value;
        this.init();
    }

    init() {
        if (QS.type === 'sipuac' && QS.value) {
            this.build();
        }
    }

    build() {
        $('#server2').click();
        $('#output_method3').click();
        $('#search_text').val(this.sip);
        $('#submit1').click();
    }
}


function initLogsModule() {
    $(document).ready(() => {
        new SipHandler();
        new SipUACHandler();
    });
}

class SipHandlerVoip {  
    constructor() {
        this.sip = QS.value;
        this.init();
    }
       init() {
        if (/^(sip|sip-registrar)$/.test(QS.type) && QS.value) {
            return this.build({ server: '#server_p_5' }); 
        }
        if (QS.type === 'sip-worker' && QS.value) {  
            return this.build({ server: '#server_p_4' }); 
        }
    }

    getStartTime() {
        let startTime = new Date().getHours() - 1;
        if(startTime < 10) {
            return '0' + startTime;  
        }
        else return startTime;
    }

    getFinishTime() {
        let FinishTime = new Date().getHours();
        if(FinishTime < 10) {
            return '0' + FinishTime;  
        }
        else return FinishTime;
    }


    build({ server }) {
        $(server).click();
        $('#output_method1').click();
        $('#search_text').val(this.sip);
        $('#time_from').val(this.getStartTime() + ":00"); 
        $('#time_to').val(this.getFinishTime() + ":59"); 
        $('#submit1').click();
        
    }
}

function initVoipLogsModule() {  
    $(document).ready(() => {
        new SipHandlerVoip();
    });
}


//---------------------------------------------------------------------------------------------------------------------------------------
// RM

/** описание проблемы */
const descProblem = [
        'Здравствуйте, коллеги!',
        'Обратился клиент с проблемой:',
        '',
        'Просьба решить проблему клиента.',
        'Спасибо.',
    ].join('\n');

/** описание консультации */
const descCounsult = [
        'Здравствуйте, коллеги!',
        'Обратился клиент с вопросом:',
        '',
        'Спасибо.',
    ].join('\n');

/** описание ЗНИ */
const descResearch = [
        'Здравствуйте, коллеги!',
        'Обратился клиент с запросом на доработку:',
        '',
        'Просьба рассмотреть возможность доработки.',
        'Спасибо.',
    ].join('\n');

const vipWatchersProblem = [
  {
                id: 167,
                name: 'Техподдержка .',
            },
            {
                id: 1389,
                name: 'VIP-ORK .',
            },
            {
                id: 527,
                name: 'ОТП группа Vip',
            },
            // 27.08.2020 Убрал Группу тестирования по их просьбе
            /*{
                id: 194,
                name: 'Группа тестирования',
            },*/
];

const vipWatchersConsult = [
  {
                id: 167,
                name: 'Техподдержка .',
            },
            {
                id: 906,
                name: 'Группа опытной эксплуатации',
            },
            {
                id: 1389,
                name: ' VIP-ORK .',
            },
            {
                id: 527,
                name: ' ОТП группа Vip',
            },
            // 27.08.2020 Убрал Группу тестирования по их просьбе
            /*{
                id: 194,
                name: 'Группа тестирования',
            },*/
];

const vipWatchersResearch = [
  {
                id: 167,
                name: 'Техподдержка .',
            },
            {
                id: 906,
                name: 'Группа опытной эксплуатации',
            },
            {
                id: 1389,
                name: ' VIP-ORK .',
            },
            {
                id: 527,
                name: ' ОТП группа Vip',
            },
            {
                id: 59,
                name: 'Бизнес анализ',
            },
            // 27.08.2020 Убрал Группу тестирования по их просьбе
            /*{
                id: 194,
                name: 'Группа тестирования',
            },*/
];

const casualWatchersProblem = [
  {
                id: 167,
                name: 'Техподдержка .',
            },
            // 27.08.2020 Убрал Группу тестирования по их просьбе
            /*{
                id: 194,
                name: 'Группа тестирования',
            },*/
];

const casualWatchersConsult = [
  {
                id: 167,
                name: 'Техподдержка .',
            },
            {
                id: 906,
                name: 'Группа опытной эксплуатации',
            },
            // 27.08.2020 Убрал Группу тестирования по их просьбе
            /*{
                id: 194,
                name: 'Группа тестирования',
            },*/
];

const casualWatchersResearch = [
  {
                id: 167,
                name: 'Техподдержка .',
            },
            {
                id: 906,
                name: 'Группа опытной эксплуатации',
            },
            {
                id: 59,
                name: 'Бизнес анализ',
            },
            // 27.08.2020 Убрал Группу тестирования по их просьбе
            /*{
                id: 194,
                name: 'Группа тестирования',
            },*/
];

function makeTemplateITG() {

    const rmContainer = $('#issue-form');

    const rmButton = $('<input>')
        .attr('type', 'button')
        .css('margin', '0px 10px')
        .css('width', '190px');

    const itgAmoProblemOptionsVip = {
        subject: '[VIP][amoCRM]',
        description: descProblem,
        priority: 5,
        assignedName: 'Группа тестирования',
        assignedId: 194,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:itgAmo:problemVip',
        watchers: vipWatchersProblem,
        tags: 'VIP_клиент_проблема'
    };
    const itgAmoProblemVip = rmButton.clone()
        .attr('value', 'VIP amoCRM проблема')
        .click(() => changeRedmineZnii(itgAmoProblemOptionsVip));

    const itgBitrixProblemOptionsVip = {
        subject: '[VIP][Bitrix24]',
        description: descProblem,
        priority: 5,
        assignedName: 'Группа тестирования',
        assignedId: 194,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:itgBitrix:problemVip',
        watchers: vipWatchersProblem,
        tags: 'VIP_клиент_проблема'
    };
    const itgBitrixProblemVip = rmButton.clone()
        .attr('value', 'VIP Bitrix24 проблема')
        .click(() => changeRedmineZnii(itgBitrixProblemOptionsVip));

    const itgRetailProblemOptionsVip = {
        subject: '[VIP][RetailCRM]',
        description: descProblem,
        priority: 5,
        assignedName: 'Группа тестирования',
        assignedId: 194,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:itgRetail:problemVip',
        watchers: vipWatchersProblem,
        tags: 'VIP_клиент_проблема'
    };
    const itgRetailProblemVip = rmButton.clone()
        .attr('value', 'VIP RetailCRM проблема')
        .click(() => changeRedmineZnii(itgRetailProblemOptionsVip));

    const itgAmoConsultOptionsVip = {
        subject: '[VIP][amoCRM]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:itgAmo:consultVip',
        watchers: vipWatchersConsult,
    };
    const itgAmoConsultVip = rmButton.clone()
        .attr('value', 'VIP amoCRM консультация')
        .click(() => changeRedmineZnii(itgAmoConsultOptionsVip));

    const itgBitrixConsultOptionsVip = {
        subject: '[VIP][Bitrix24]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:itgBitrix:consultVip',
        watchers: vipWatchersConsult,
    };
    const itgBitrixConsultVip = rmButton.clone()
        .attr('value', 'VIP Bitrix24 консультация')
        .click(() => changeRedmineZnii(itgBitrixConsultOptionsVip));

    const itgRetailConsultOptionsVip = {
        subject: '[VIP][RetailCRM]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:itgRetail:consultVip',
        watchers: vipWatchersConsult,
    };
    const itgRetailConsultVip = rmButton.clone()
        .attr('value', 'VIP RetailCRM консультация')
        .click(() => changeRedmineZnii(itgRetailConsultOptionsVip));

    const itgAmoResearchOptionsVip = {
        subject: '[VIP][ЗНИ][amoCRM]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '< 10',
        statKey: 'redmine:template:itgAmo:researchVip',
        watchers: vipWatchersResearch,
        tags: 'VIP_доработка'
    };
    const itgAmoResearchVip = rmButton.clone()
        .attr('value', 'VIP amoCRM ЗНИ')
        .click(() => changeRedmineZnii(itgAmoResearchOptionsVip));

    const itgBitrixResearchOptionsVip = {
        subject: '[VIP][ЗНИ][Bitrix24]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '< 10',
        statKey: 'redmine:template:itgBitrix:researchVip',
        watchers: vipWatchersResearch,
        tags: 'VIP_доработка'
    };
    const itgBitrixResearchVip = rmButton.clone()
        .attr('value', 'VIP Bitrix24 ЗНИ')
        .click(() => changeRedmineZnii(itgBitrixResearchOptionsVip));

    const itgRetailResearchOptionsVip = {
        subject: '[VIP][ЗНИ][RetailCRM]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '< 10',
        statKey: 'redmine:template:itgRetail:researchVip',
        watchers: vipWatchersResearch,
        tags: 'VIP_доработка'
    };
    const itgRetailResearchVip = rmButton.clone()
        .attr('value', 'VIP ReatilCRM ЗНИ')
        .click(() => changeRedmineZnii(itgRetailResearchOptionsVip));

    const itgAmoProblemOptions = {
        subject: '[amoCRM]',
        description: descProblem,
        priority: 5,
        assignedName: 'Группа тестировани',
        assignedId: 194,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:itgAmo:problem',
        watchers: casualWatchersProblem,
    };
    const itgAmoProblem = rmButton.clone()
        .attr('value', 'amoCRM проблема')
        .click(() => changeRedmineZnii(itgAmoProblemOptions));

    const itgBitrixProblemOptions = {
        subject: '[Bitrix24]',
        description: descProblem,
        priority: 5,
        assignedName: 'Группа тестировани',
        assignedId: 194,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:itgBitrix:problem',
        watchers: casualWatchersProblem,
    };
    const itgBitrixProblem = rmButton.clone()
        .attr('value', 'Bitrix24 проблема')
        .click(() => changeRedmineZnii(itgBitrixProblemOptions));

    const itgRetailProblemOptions = {
        subject: '[RetailCRM]',
        description: descProblem,
        priority: 5,
        assignedName: 'Группа тестировани',
        assignedId: 194,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:itgRetail:problem',
        watchers: casualWatchersProblem,
    };
    const itgRetailProblem = rmButton.clone()
        .attr('value', 'RetailCRM проблема')
        .click(() => changeRedmineZnii(itgRetailProblemOptions));

    const itgAmoConsultOptions = {
        subject: '[amoCRM]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:itgAmo:consult',
        watchers: casualWatchersConsult,
    };
    const itgAmoConsult = rmButton.clone()
        .attr('value', 'amoCRM консультация')
        .click(() => changeRedmineZnii(itgAmoConsultOptions));

    const itgBitrixConsultOptions = {
        subject: '[Bitrix24]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:itgBitrix:consult',
        watchers: casualWatchersConsult,
    };
    const itgBitrixConsult = rmButton.clone()
        .attr('value', 'Bitrix24 консультация')
        .click(() => changeRedmineZnii(itgBitrixConsultOptions));

    const itgRetailConsultOptions = {
        subject: '[retailCRM]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:itgRetail:consult',
        watchers: casualWatchersConsult,
    };
    const itgRetailConsult = rmButton.clone()
        .attr('value', 'RetailCRM консультация')
        .click(() => changeRedmineZnii(itgRetailConsultOptions));

    const itgAmoResearchOptions = {
        subject: '[ЗНИ][amoCRM]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '1',
        statKey: 'redmine:template:itgAmo:research',
        watchers: casualWatchersResearch,
    };
    const itgAmoResearch = rmButton.clone()
        .attr('value', 'amoCRM ЗНИ')
        .click(() => changeRedmineZnii(itgAmoResearchOptions));

    const itgBitrixResearchOptions = {
        subject: '[ЗНИ][Bitrix24]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '1',
        statKey: 'redmine:template:itgBitrix:research',
        watchers: casualWatchersResearch,
    };
    const itgBitrixResearch = rmButton.clone()
        .attr('value', 'Bitrix24 ЗНИ')
        .click(() => changeRedmineZnii(itgBitrixResearchOptions));

    const itgRetailResearchOptions = {
        subject: '[ЗНИ][RetailCRM]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '1',
        statKey: 'redmine:template:itgRetail:research',
        watchers: casualWatchersResearch,
    };
    const itgRetailResearch = rmButton.clone()
        .attr('value', 'RetailCRM ЗНИ')
        .click(() => changeRedmineZnii(itgRetailResearchOptions));

    let brElt1 = document.createElement('br');

    let brElt2 = document.createElement('br');

    rmContainer.before(itgAmoProblemVip, itgBitrixProblemVip, itgRetailProblemVip, itgAmoProblem, itgBitrixProblem, itgRetailProblem);

    rmContainer.before(brElt1);

    rmContainer.before(itgAmoConsultVip, itgBitrixConsultVip, itgRetailConsultVip, itgAmoConsult, itgBitrixConsult, itgRetailConsult);

    rmContainer.before(brElt2);

    rmContainer.before(itgAmoResearchVip, itgBitrixResearchVip, itgRetailResearchVip, itgAmoResearch, itgBitrixResearch, itgRetailResearch);


    // var contentElt = document.getElementById('content');
    // (function buildButton() {
    //     var amoProblem = document.createElement('input');
    //     amoProblem.type = 'button';
    //     amoProblem.value = 'amoCRM проблема';
    //     amoProblem.id = 'amoProblem';
    //     amoProblem.style.width = '159px';
    //     amoProblem.style.marginRight = '15px';
    //     amoProblem.addEventListener('click', function () {
    //         clickHandler('amoCRM', 'Проблема', 194)
    //     });

    //     var amoConsult = document.createElement('input');
    //     amoConsult.type = 'button';
    //     amoConsult.value = 'amoCRM консультация';
    //     amoConsult.id = 'amoConsult';
    //     amoConsult.style.width = '159px';
    //     amoConsult.style.marginRight = '15px';
    //     amoConsult.addEventListener('click', function () {
    //         clickHandler('amoCRM', 'Консультация', 906)
    //     });

    //     var bxProblem = document.createElement('input');
    //     bxProblem.type = 'button';
    //     bxProblem.value = 'битрикс24 проблема';
    //     bxProblem.id = 'bxProblem';
    //     bxProblem.style.width = '159px';
    //     bxProblem.style.marginRight = '15px';
    //     bxProblem.addEventListener('click', function () {
    //         clickHandler('битрикс24', 'Проблема', 194)
    //     });

    //     var bxConsult = document.createElement('input');
    //     bxConsult.type = 'button';
    //     bxConsult.value = 'битрикс24 консультация';
    //     bxConsult.id = 'bxConsult';
    //     bxConsult.style.width = '159px';
    //     bxConsult.style.marginRight = '15px';
    //     bxConsult.addEventListener('click', function () {
    //         clickHandler('битрикс24', 'Консультация', 906)
    //     });

    //     var rcProblem = document.createElement('input');
    //     rcProblem.type = 'button';
    //     rcProblem.value = 'RetailCRM проблема';
    //     rcProblem.id = 'rcProblem';
    //     rcProblem.style.width = '167px';
    //     rcProblem.addEventListener('click', function () {
    //         clickHandler('RetailCRM', 'Проблема', 194)
    //     });

    //     var rcConsult = document.createElement('input');
    //     rcConsult.type = 'button';
    //     rcConsult.value = 'RetailCRM консультация';
    //     rcConsult.id = 'rcConsult';
    //     rcConsult.addEventListener('click', function () {
    //         clickHandler('RetailCRM', 'Консультация', 906)
    //     });
    //     var brElt = document.createElement('br');

    //     contentElt.insertBefore(amoProblem, contentElt.querySelector('#issue-form'));
    //     contentElt.insertBefore(bxProblem, contentElt.querySelector('#issue-form'));
    //     contentElt.insertBefore(rcProblem, contentElt.querySelector('#issue-form'));

    //     contentElt.insertBefore(brElt, contentElt.querySelector('#issue-form'));

    //     contentElt.insertBefore(amoConsult, contentElt.querySelector('#issue-form'));
    //     contentElt.insertBefore(bxConsult, contentElt.querySelector('#issue-form'));
    //     contentElt.insertBefore(rcConsult, contentElt.querySelector('#issue-form'));


    //     function clickHandler(subject, essence, appointed_watcher3) {
    //         Statistic.send('redmine:template:itg');
    //         $('#issue_subject').val(subject + ' '); //тема
    //         if (essence == 'Проблема')
    //             $('#issue_description').val('Здравствуйте, коллеги.' + '\r\n' + 'Обратился клиент с проблемой:' + '\r\n' + '\r\n' + 'В чем проблема? Спасибо'); // описание
    //         else
    //             $('#issue_description').val('Здравствуйте, коллеги.' + '\r\n' + 'Обратился клиент с вопросом:' + '\r\n' + '\r\n' + 'Что можно порекомендовать клиенту в данном случае? Спасибо');
    //         $('#issue_assigned_to_id').val(appointed_watcher3); // назначена - группа тестирования
    //         $('#issue_custom_field_values_36').val(essence); // суть вопроса - проблема
    //         $('#issue_custom_field_values_49').val(essence == 'Проблема' ? 'Ошибка возникла у клиента' : 'Потребность клиента(ов)'); // источник задачи - Потребность клиента(ов)
    //         $('#issue_custom_field_values_50').val('1'); // количество клиентов - 1
    //         $('#issue_watcher_user_ids_167').remove();
    //         $('#watchers_inputs').append('<label id=\"issue_watcher_user_ids_167\" class=\"floating\"><input type=\"checkbox\" name=\"issue[watcher_user_ids][]\" value=\"167\" checked=\"checked\" /> Техподдержка .<\/label>');

    //         $('#issue_watcher_user_ids_194').remove();
    //         $('#issue_watcher_user_ids_59').remove();
    //         $('#issue_watcher_user_ids_906').remove();
    //         $('#watchers_inputs').append('<label id=\"issue_watcher_user_ids_' + appointed_watcher3 + '\" class=\"floating\"><input type=\"checkbox\" name=\"issue[watcher_user_ids][]\" value=\"' + appointed_watcher3 + '\" checked=\"checked\" /> ' + (appointed_watcher3 === 906 ? 'Группа опытной эксплуатации' : 'Группа тестирования') + '<\/label>');
    //         // 27.08.2020 Убрал наблюдателя "Группа тестирования" при создании заявок в проект Интеграции
    //         $('#issue_watcher_user_ids_194').remove();
    //         if (essence === 'Консультация') {
    //             const html = '<label id=\"issue_watcher_user_ids_59\" class=\"floating\"><input type=\"checkbox\" name=\"issue[watcher_user_ids][]\" value=\"59\" checked=\"checked\" />Бизнес анализ<\/label>';
    //             $('#watchers_inputs').append(html);
    //         }
    //     }
    // })();
}


function makeTemplateDct() {

    const rmContainer = $('#issue-form');

    const rmButton = $('<input>')
        .attr('type', 'button')
        .css('margin', '0px 10px')
        .css('width', '180px');

    const dctProblemOptionsVip = {
        subject: '[VIP][ДКТ]',
        description: descProblem,
        priority: 6,
        assignedName: 'Группа тестирования',
        assignedId: 194,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:dct:problemVip',
        watchers: vipWatchersProblem,
        tags: 'VIP_клиент_проблема'
    };
    const dctProblemVip = rmButton.clone()
        .attr('value', 'VIP ДКТ проблема')
        .attr('id', 'dct_template')
        .click(() => changeRedmineZnii(dctProblemOptionsVip));

    const dctConsultOptionsVip = {
        subject: '[VIP][ДКТ]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:dct:consultVip',
        watchers: vipWatchersConsult,
    };
    const dctConsultVip = rmButton.clone()
        .attr('value', 'VIP ДКТ Консультация')
        .click(() => changeRedmineZnii(dctConsultOptionsVip))

const dctResearchOptionsVip = {
        subject: '[VIP][ЗНИ][ДКТ]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '< 10',
        statKey: 'redmine:template:dct:researchVip',
        watchers: vipWatchersResearch,
        tags: 'VIP_доработка'
    };
    const dctResearchVip = rmButton.clone()
        .attr('value', 'VIP ДКТ ЗНИ')
        .click(() => changeRedmineZnii(dctResearchOptionsVip));

const dctProblemOptions = {
        subject: '[ДКТ]',
        description: descProblem,
        priority: 5,
        assignedName: 'Группа тестирования',
        assignedId: 194,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:dct:problem',
        watchers: casualWatchersProblem,
    };
    const dctProblem = rmButton.clone()
        .attr('value', 'ДКТ проблема')
        .click(() => changeRedmineZnii(dctProblemOptions));

    const dctConsultOptions = {
        subject: '[ДКТ]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:dct:consult',
        watchers: casualWatchersConsult,
    };
    const dctConsult = rmButton.clone()
        .attr('value', 'ДКТ Консультация')
        .click(() => changeRedmineZnii(dctConsultOptions));

const dctResearchOptions = {
        subject: '[ЗНИ][ДКТ]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '1',
        statKey: 'redmine:template:dct:research',
        watchers: casualWatchersResearch,
    };
    const dctResearch = rmButton.clone()
        .attr('value', 'ДКТ ЗНИ')
        .click(() => changeRedmineZnii(dctResearchOptions))

    let brElt = document.createElement('br');
    rmContainer.before(dctProblemVip, dctConsultVip, dctResearchVip);

    rmContainer.before(brElt);

    rmContainer.before(dctProblem, dctConsult, dctResearch);

}


function makeTemplateBilling() {

    const rmContainer = $('#issue-form');

    const rmButton = $('<input>')
        .attr('type', 'button')
        .css('margin', '0px 10px')
        .css('width', '180px');

    const billingProblemOptionsVip = {
        subject: '[VIP]',
        description: descProblem,
        priority: 6,
        assignedName: 'Группа эксплуатации Биллинга',
        assignedId: 1279,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:billing:problemVip',
        watchers: vipWatchersProblem,
        tags: 'VIP_клиент_проблема'
    };
    const billingProblemVip = rmButton.clone()
        .attr('value', 'VIP Billing проблема')
        .attr('id', 'billing_template')
        .click(() => changeRedmineZnii(billingProblemOptionsVip));

    const billingConsultOptionsVip = {
        subject: '[VIP]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:billing:consultVip',
        watchers: vipWatchersConsult,
    };
    const billingConsultVip = rmButton.clone()
        .attr('value', 'VIP Billing Консультация')
        .click(() => changeRedmineZnii(billingConsultOptionsVip))

const billingProblemOptions = {
        subject: '[ВАТС]',
        description: descProblem,
        priority: 5,
        assignedName: 'Группа эксплуатации Биллинга',
        assignedId: 1279,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:billing:problem',
        watchers: casualWatchersProblem,
    };
    const billingProblem = rmButton.clone()
        .attr('value', 'Billing проблема')
        .click(() => changeRedmineZnii(billingProblemOptions));

    const billingConsultOptions = {
        subject: '[ВАТС]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:billing:consult',
        watchers: casualWatchersConsult,
    };
    const billingConsult = rmButton.clone()
        .attr('value', 'Billing Консультация')
        .click(() => changeRedmineZnii(billingConsultOptions));

    let brElt = document.createElement('br');
    rmContainer.before(billingProblemVip, billingConsultVip);

    rmContainer.before(brElt);

    rmContainer.before(billingProblem, billingConsult);

}


function makeTemplateMlk() {

    const rmContainer = $('#issue-form');

    const rmButton = $('<input>')
        .attr('type', 'button')
        .css('margin', '0px 10px')
        .css('width', '180px');

    const mlkProblemOptionsVip = {
        subject: '[VIP][МЛК]',
        description: descProblem,
        priority: 6,
        assignedName: 'Группа тестирования',
        assignedId: 194,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:mlk:problemVip',
        watchers: vipWatchersProblem,
        tags: 'VIP_клиент_проблема'
    };
    const mlkProblemVip = rmButton.clone()
        .attr('value', 'VIP МЛК проблема')
        .attr('id', 'mlk_template')
        .click(() => changeRedmineZnii(mlkProblemOptionsVip));

    const mlkConsultOptionsVip = {
        subject: '[VIP][МЛК]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:mlk:consultVip',
        watchers: vipWatchersConsult,
    };
    const mlkConsultVip = rmButton.clone()
        .attr('value', 'VIP МЛК Консультация')
        .click(() => changeRedmineZnii(mlkConsultOptionsVip))

const mlkResearchOptionsVip = {
        subject: '[VIP][ЗНИ][МЛК]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '< 10',
        statKey: 'redmine:template:mlk:researchVip',
        watchers: vipWatchersResearch,
        tags: 'VIP_доработка'
    };
    const mlkResearchVip = rmButton.clone()
        .attr('value', 'VIP МЛК ЗНИ')
        .click(() => changeRedmineZnii(mlkResearchOptionsVip));

const mlkProblemOptions = {
        subject: '[МЛК]',
        description: descProblem,
        priority: 5,
        assignedName: 'Группа тестирования',
        assignedId: 194,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:mlk:problem',
        watchers: casualWatchersProblem,
    };
    const mlkProblem = rmButton.clone()
        .attr('value', 'МЛК проблема')
        .click(() => changeRedmineZnii(mlkProblemOptions));

    const mlkConsultOptions = {
        subject: '[МЛК]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:mlk:consult',
        watchers: casualWatchersConsult,
    };
    const mlkConsult = rmButton.clone()
        .attr('value', 'МЛК Консультация')
        .click(() => changeRedmineZnii(mlkConsultOptions));

const mlkResearchOptions = {
        subject: '[ЗНИ][МЛК]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '1',
        statKey: 'redmine:template:mlk:research',
        watchers: casualWatchersResearch,
    };
    const mlkResearch = rmButton.clone()
        .attr('value', 'МЛК ЗНИ')
        .click(() => changeRedmineZnii(mlkResearchOptions))

    let brElt = document.createElement('br');
    rmContainer.before(mlkProblemVip, mlkConsultVip, mlkResearchVip);

    rmContainer.before(brElt);

    rmContainer.before(mlkProblem, mlkConsult, mlkResearch);

}

function makeTemplateContactCenter() {
    const rmContainer = $('#issue-form');

    const rmButton = $('<input>')
        .attr('type', 'button')
        .css('margin', '0px 10px')
        .css('width', '180px');

    const cccProblemOptionsVip = {
        subject: '[VIP][CCC]',
        description: descProblem,
        priority: 6,
        assignedName: 'ТКП-Софт (Минск)',
        assignedId: 110,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:ccc:problemVip',
        watchers: vipWatchersProblem,
        tags: 'VIP_клиент_проблема'
    };
    const cccProblemVip = rmButton.clone()
        .attr('value', 'VIP КЦ проблема')
        .click(() => changeRedmineZnii(cccProblemOptionsVip));

    const cccConsultOptionsVip = {
        subject: '[VIP][CCC]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:ccc:consultVip',
        watchers: vipWatchersConsult,
    };
    const cccConsultVip = rmButton.clone()
        .attr('value', 'VIP КЦ Консультация')
        .click(() => changeRedmineZnii(cccConsultOptionsVip));

const cccResearchOptionsVip = {
        subject: '[VIP][ЗНИ][CCC]]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '< 10',
        statKey: 'redmine:template:ccc:researchVip',
        watchers: vipWatchersResearch,
        tags: 'VIP_доработка'
    };
    const cccResearchVip = rmButton.clone()
        .attr('value', 'VIP КЦ ЗНИ')
        .click(() => changeRedmineZnii(cccResearchOptionsVip));

const cccProblemOptions = {
        subject: '[CCC]',
        description: descProblem,
        priority: 5,
        assignedName: 'ТКП-Софт (Минск)',
        assignedId: 110,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:ccc:problem',
        watchers: casualWatchersProblem,
    };
    const cccProblem = rmButton.clone()
        .attr('value', 'КЦ проблема')
        .click(() => changeRedmineZnii(cccProblemOptions));

    const cccConsultOptions = {
        subject: '[CCC]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:ccc:consult',
        watchers: casualWatchersConsult,
    };
    const cccConsult = rmButton.clone()
        .attr('value', 'КЦ Консультация')
        .click(() => changeRedmineZnii(cccConsultOptions));

const cccResearchOptions = {
        subject: '[ЗНИ][CCC]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '1',
        statKey: 'redmine:template:ccc:research',
        watchers: casualWatchersResearch,
    };
    const cccResearch = rmButton.clone()
        .attr('value', 'КЦ ЗНИ')
        .click(() => changeRedmineZnii(cccResearchOptions));

    let brElt = document.createElement('br');
    rmContainer.before(cccProblemVip, cccConsultVip, cccResearchVip);

    rmContainer.before(brElt);

    rmContainer.before(cccProblem, cccConsult, cccResearch);

}

function makeTemplateCommunicator() {
    const rmContainer = $('#issue-form');

    const rmButton = $('<input>')
        .attr('type', 'button')
        .css('margin', '0px 10px')
        .css('width', '180px');

    const communicatorProblemOptionsVip = {
        subject: '[VIP][МТ]',
        description: descProblem,
        priority: 6,
        assignedName: 'Группа тестирования',
        assignedId: 194,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:communicator:problemVip',
        watchers: vipWatchersProblem,
        tags: 'VIP_клиент_проблема'
    };
    const communicatorProblemVip = rmButton.clone()
        .attr('value', 'VIP МТ проблема')
        .click(() => changeRedmineZnii(communicatorProblemOptionsVip));

    const communicatorConsultOptionsVip = {
        subject: '[VIP][МТ]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:communicator:consultVip',
        watchers: vipWatchersConsult,
    };
    const communicatorConsultVip = rmButton.clone()
        .attr('value', 'VIP МТ Консультация')
        .click(() => changeRedmineZnii(communicatorConsultOptionsVip));

const communicatorResearchOptionsVip = {
        subject: '[VIP][ЗНИ][МТ]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '< 10',
        statKey: 'redmine:template:communicator:researchVip',
        watchers: vipWatchersResearch,
        tags: 'VIP_доработка'
    };
    const communicatorResearchVip = rmButton.clone()
        .attr('value', 'VIP МТ ЗНИ')
        .click(() => changeRedmineZnii(communicatorResearchOptionsVip));

const communicatorProblemOptions = {
        subject: '[МТ]',
        description: descProblem,
        priority: 5,
        assignedName: 'Группа тестирования',
        assignedId: 194,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:communicator:problem',
        watchers: casualWatchersProblem,
    };
    const communicatorProblem = rmButton.clone()
        .attr('value', 'МТ проблема')
        .click(() => changeRedmineZnii(communicatorProblemOptions));

    const communicatorConsultOptions = {
        subject: '[МТ]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:communicator:consult',
        watchers: casualWatchersConsult,
    };
    const communicatorConsult = rmButton.clone()
        .attr('value', 'МТ Консультация')
        .click(() => changeRedmineZnii(communicatorConsultOptions));

const communicatorResearchOptions = {
        subject: '[ЗНИ][МТ]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '1',
        statKey: 'redmine:template:communicator:research',
        watchers: casualWatchersResearch,
    };
    const communicatorResearch = rmButton.clone()
        .attr('value', 'МТ ЗНИ')
        .click(() => changeRedmineZnii(communicatorResearchOptions));

    let brElt = document.createElement('br');
    rmContainer.before(communicatorProblemVip, communicatorConsultVip, communicatorResearchVip);

    rmContainer.before(brElt);

    rmContainer.before(communicatorProblem, communicatorConsult, communicatorResearch);

}

function makeTemplateVats() {

    const rmContainer = $('#issue-form');

    const rmButton = $('<input>')
        .attr('type', 'button')
        .css('margin', '0px 10px')
        .css('width', '180px');

    const vatsProblemOptionsVip = {
        subject: '[VIP][ВАТС]',
        description: descProblem,
        priority: 6,
        assignedName: 'ТКП-Софт (Минск)',
        assignedId: 110,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:vats:problemVip',
        watchers: vipWatchersProblem,
        tags: 'VIP_клиент_проблема'
    };
    const vatsProblemVip = rmButton.clone()
        .attr('value', 'VIP ВАТС проблема')
        .click(() => changeRedmineZnii(vatsProblemOptionsVip));

    const vatsConsultOptionsVip = {
        subject: '[VIP][ВАТС]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:vats:consultVip',
        watchers: vipWatchersConsult,
    };
    const vatsConsultVip = rmButton.clone()
        .attr('value', 'VIP ВАТС Консультация')
        .click(() => changeRedmineZnii(vatsConsultOptionsVip));

const vatsResearchOptionsVip = {
        subject: '[VIP][ЗНИ][ВАТС]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '< 10',
        statKey: 'redmine:template:vats:researchVip',
        watchers: vipWatchersResearch,
        tags: 'VIP_доработка'
    };
    const vatsResearchVip = rmButton.clone()
        .attr('value', 'VIP ВАТС ЗНИ')
        .click(() => changeRedmineZnii(vatsResearchOptionsVip));

const vatsProblemOptions = {
        subject: '[ВАТС]',
        description: descProblem,
        priority: 5,
        assignedName: 'ТКП-Софт (Минск)',
        assignedId: 110,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:vats:problem',
        watchers: casualWatchersProblem,
    };
    const vatsProblem = rmButton.clone()
        .attr('value', 'ВАТС проблема')
        .click(() => changeRedmineZnii(vatsProblemOptions));

    const vatsConsultOptions = {
        subject: '[ВАТС]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:vats:consult',
        watchers: casualWatchersConsult,
    };
    const vatsConsult = rmButton.clone()
        .attr('value', 'ВАТС Консультация')
        .click(() => changeRedmineZnii(vatsConsultOptions));

const vatsResearchOptions = {
        subject: '[ЗНИ][ВАТС]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '1',
        statKey: 'redmine:template:vats:research',
        watchers: casualWatchersResearch,
    };
    const vatsResearch = rmButton.clone()
        .attr('value', 'ВАТС ЗНИ')
        .click(() => changeRedmineZnii(vatsResearchOptions));

    let brElt = document.createElement('br');
    rmContainer.before(vatsProblemVip, vatsConsultVip, vatsResearchVip);

    rmContainer.before(brElt);

    rmContainer.before(vatsProblem, vatsConsult, vatsResearch);

}

function makeTemplateLk7() {

    const rmContainer = $('#issue-form');

    const rmButton = $('<input>')
        .attr('type', 'button')
        .css('margin', '0px 10px')
        .css('width', '180px');

    const lk7ProblemOptionsVip = {
        subject: '[VIP][ЛК]',
        description: descProblem,
        priority: 6,
        assignedName: 'ТКП-Софт (Минск)',
        assignedId: 110,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:lk7:problemVip',
        watchers: vipWatchersProblem,
        tags: 'VIP_клиент_проблема'
    };
    const lk7ProblemVip = rmButton.clone()
        .attr('value', 'VIP ЛК проблема')
        .click(() => changeRedmineZnii(lk7ProblemOptionsVip));

    const lk7ConsultOptionsVip = {
        subject: '[VIP][ЛК]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:lk7:consultVip',
        watchers: vipWatchersConsult,
    };
    const lk7ConsultVip = rmButton.clone()
        .attr('value', 'VIP ЛК Консультация')
        .click(() => changeRedmineZnii(lk7ConsultOptionsVip));

const lk7ResearchOptionsVip = {
        subject: '[VIP][ЗНИ][ЛК]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '< 10',
        statKey: 'redmine:template:lk7:researchVip',
        watchers: vipWatchersResearch,
        tags: 'VIP_доработка'
    };
    const lk7ResearchVip = rmButton.clone()
        .attr('value', 'VIP ЛК ЗНИ')
        .click(() => changeRedmineZnii(lk7ResearchOptionsVip));

const lk7ProblemOptions = {
        subject: '[ЛК]',
        description: descProblem,
        priority: 5,
        assignedName: 'ТКП-Софт (Минск)',
        assignedId: 110,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:lk7:problem',
        watchers: casualWatchersProblem,
    };
    const lk7Problem = rmButton.clone()
        .attr('value', 'ЛК проблема')
        .click(() => changeRedmineZnii(lk7ProblemOptions));

    const lk7ConsultOptions = {
        subject: '[ЛК]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:lk7:consult',
        watchers: casualWatchersConsult,
    };
    const lk7Consult = rmButton.clone()
        .attr('value', 'ЛК Консультация')
        .click(() => changeRedmineZnii(lk7ConsultOptions));

const lk7ResearchOptions = {
        subject: '[ЗНИ][ЛК]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '1',
        statKey: 'redmine:template:lk7:research',
        watchers: casualWatchersResearch,
    };
    const lk7Research = rmButton.clone()
        .attr('value', 'ЛК ЗНИ')
        .click(() => changeRedmineZnii(lk7ResearchOptions));

    let brElt = document.createElement('br');
    rmContainer.before(lk7ProblemVip, lk7ConsultVip, lk7ResearchVip);

    rmContainer.before(brElt);

    rmContainer.before(lk7Problem, lk7Consult, lk7Research);

}

function makeTemplateApi() {

    const rmContainer = $('#issue-form');

    const rmButton = $('<input>')
        .attr('type', 'button')
        .css('margin', '0px 10px')
        .css('width', '180px');

    const apiProblemOptionsVip = {
        subject: '[VIP][API]',
        description: descProblem,
        priority: 6,
        assignedName: 'ТКП-Софт (Минск)',
        assignedId: 110,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:api:problemVip',
        watchers: vipWatchersProblem,
        tags: 'VIP_клиент_проблема'
    };
    const apiProblemVip = rmButton.clone()
        .attr('value', 'VIP API проблема')
        .click(() => changeRedmineZnii(apiProblemOptionsVip));

    const apiConsultOptionsVip = {
        subject: '[VIP][API]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:api:consultVip',
        watchers: vipWatchersConsult,
    };
    const apiConsultVip = rmButton.clone()
        .attr('value', 'VIP API Консультация')
        .click(() => changeRedmineZnii(apiConsultOptionsVip));

const apiResearchOptionsVip = {
        subject: '[VIP][ЗНИ][API]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '< 10',
        statKey: 'redmine:template:api:researchVip',
        watchers: vipWatchersResearch,
        tags: 'VIP_доработка'
    };
    const apiResearchVip = rmButton.clone()
        .attr('value', 'VIP API ЗНИ')
        .click(() => changeRedmineZnii(apiResearchOptionsVip));

const apiProblemOptions = {
        subject: '[API]',
        description: descProblem,
        priority: 5,
        assignedName: 'ТКП-Софт (Минск)',
        assignedId: 110,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:api:problem',
        watchers: casualWatchersProblem,
    };
    const apiProblem = rmButton.clone()
        .attr('value', 'API проблема')
        .click(() => changeRedmineZnii(apiProblemOptions));

    const apiConsultOptions = {
        subject: '[API]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:api:consult',
        watchers: casualWatchersConsult,
    };
    const apiConsult = rmButton.clone()
        .attr('value', 'API Консультация')
        .click(() => changeRedmineZnii(apiConsultOptions));

const apiResearchOptions = {
        subject: '[ЗНИ][API]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '1',
        statKey: 'redmine:template:api:research',
        watchers: casualWatchersResearch,
    };
    const apiResearch = rmButton.clone()
        .attr('value', 'API ЗНИ')
        .click(() => changeRedmineZnii(apiResearchOptions));

    let brElt = document.createElement('br');
    rmContainer.before(apiProblemVip, apiConsultVip, apiResearchVip);

    rmContainer.before(brElt);

    rmContainer.before(apiProblem, apiConsult, apiResearch);

}

function makeTemplateVoip() {

    const rmContainer = $('#issue-form');

    const rmButton = $('<input>')
        .attr('type', 'button')
        .css('margin', '0px 10px')
        .css('width', '180px');

    const voipProblemOptionsVip = {
        subject: '[VIP][VOIP]',
        description: descProblem,
        priority: 6,
        assignedName: 'VoIP .',
        assignedId: 79,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:voip:problemVip',
        watchers: vipWatchersProblem,
        tags: 'VIP_клиент_проблема'
    };
    const voipProblemVip = rmButton.clone()
        .attr('value', 'VIP VOIP проблема')
        .click(() => changeRedmineZnii(voipProblemOptionsVip));

    const voipConsultOptionsVip = {
        subject: '[VIP][VOIP]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:voip:consultVip',
        watchers: vipWatchersConsult,
    };
    const voipConsultVip = rmButton.clone()
        .attr('value', 'VIP VOIP Консультация')
        .click(() => changeRedmineZnii(voipConsultOptionsVip));

const voipResearchOptionsVip = {
        subject: '[VIP][ЗНИ][VOIP]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '< 10',
        statKey: 'redmine:template:voip:researchVip',
        watchers: vipWatchersResearch,
        tags: 'VIP_доработка'
    };
    const voipResearchVip = rmButton.clone()
        .attr('value', 'VIP VOIP ЗНИ')
        .click(() => changeRedmineZnii(voipResearchOptionsVip));

const voipProblemOptions = {
        subject: '[VOIP]',
        description: descProblem,
        priority: 5,
        assignedName: 'VoIP .',
        assignedId: 79,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:voip:problem',
        watchers: casualWatchersProblem,
    };
    const voipProblem = rmButton.clone()
        .attr('value', 'VOIP проблема')
        .click(() => changeRedmineZnii(voipProblemOptions));

    const voipConsultOptions = {
        subject: '[VOIP]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:voip:consult',
        watchers: casualWatchersConsult,
    };
    const voipConsult = rmButton.clone()
        .attr('value', 'VOIP Консультация')
        .click(() => changeRedmineZnii(voipConsultOptions));

const voipResearchOptions = {
        subject: '[ЗНИ][VOIP]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '1',
        statKey: 'redmine:template:voip:research',
        watchers: casualWatchersResearch,
    };
    const voipResearch = rmButton.clone()
        .attr('value', 'VOIP ЗНИ')
        .click(() => changeRedmineZnii(voipResearchOptions));

    let brElt = document.createElement('br');
    rmContainer.before(voipProblemVip, voipConsultVip, voipResearchVip);

    rmContainer.before(brElt);

    rmContainer.before(voipProblem, voipConsult, voipResearch);

}

function makeTemplateOtis() {

    const rmContainer = $('#issue-form');

    const rmButton = $('<input>')
        .attr('type', 'button')
        .css('margin', '0px 10px')
        .css('width', '180px');

    const otisProblemOptions = {
        subject: '[ОТИС]',
        description: descProblem,
        priority: 5,
        assignedName: 'Группа ОТИС',
        assignedId: 275,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:otis:problem',
        watchers: casualWatchersProblem,
    };
    const otisProblem = rmButton.clone()
        .attr('value', 'ОТИС проблема')
        .click(() => changeRedmineZnii(otisProblemOptions));

    rmContainer.before(otisProblem);
}

function makeTemplateWidget() {

    const rmContainer = $('#issue-form');

    const rmButton = $('<input>')
        .attr('type', 'button')
        .css('margin', '0px 10px')
        .css('width', '180px');

    const widgetProblemOptionsVip = {
        subject: '[VIP][виджет]',
        description: descProblem,
        priority: 6,
        assignedName: 'ТКП-Софт (Минск)',
        assignedId: 110,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:widget:problemVip',
        watchers: vipWatchersProblem,
        tags: 'VIP_клиент_проблема'
    };
    const widgetProblemVip = rmButton.clone()
        .attr('value', 'VIP виджет проблема')
        .click(() => changeRedmineZnii(widgetProblemOptionsVip));

    const widgetConsultOptionsVip = {
        subject: '[VIP][виджет]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '< 10',
        statKey: 'redmine:template:widget:consultVip',
        watchers: vipWatchersConsult,
    };
    const widgetConsultVip = rmButton.clone()
        .attr('value', 'VIP виджет консультация')
        .click(() => changeRedmineZnii(widgetConsultOptionsVip));

const widgetResearchOptionsVip = {
        subject: '[VIP][ЗНИ][виджет]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '< 10',
        statKey: 'redmine:template:widget:researchVip',
        watchers: vipWatchersResearch,
        tags: 'VIP_доработка'
    };
    const widgetResearchVip = rmButton.clone()
        .attr('value', 'VIP виджет ЗНИ')
        .click(() => changeRedmineZnii(widgetResearchOptionsVip));

const widgetProblemOptions = {
        subject: '[виджет]',
        description: descProblem,
        priority: 5,
        assignedName: 'ТКП-Софт (Минск)',
        assignedId: 110,
        essence: 'Проблема',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:widget:problem',
        watchers: casualWatchersProblem,
    };
    const widgetProblem = rmButton.clone()
        .attr('value', 'Виджет проблема')
        .click(() => changeRedmineZnii(widgetProblemOptions));

    const widgetConsultOptions = {
        subject: '[виджет]',
        description: descCounsult,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Консультация',
        deal: '1',
        source: 'Ошибка возникла у клиента',
        clientsCount: '1',
        statKey: 'redmine:template:widget:consult',
        watchers: casualWatchersConsult,
    };
    const widgetConsult = rmButton.clone()
        .attr('value', 'Виджет консультация')
        .click(() => changeRedmineZnii(widgetConsultOptions));

const widgetResearchOptions = {
        subject: '[ЗНИ][виджет]',
        description: descResearch,
        priority: 4,
        assignedName: 'Группа опытной эксплуатации',
        assignedId: 906,
        essence: 'Заявка на изменение',
        deal: '1',
        source: 'Потребность клиента(ов)',
        clientsCount: '1',
        statKey: 'redmine:template:widget:research',
        watchers: casualWatchersResearch,
    };
    const widgetResearch = rmButton.clone()
        .attr('value', 'Виджет ЗНИ')
        .click(() => changeRedmineZnii(widgetResearchOptions));

    let brElt = document.createElement('br');
    rmContainer.before(widgetProblemVip, widgetConsultVip, widgetResearchVip);

    rmContainer.before(brElt);

    rmContainer.before(widgetProblem, widgetConsult, widgetResearch);

}

function changeRedmineZnii(options) {
    /** тема */
    $('#issue_subject').val(options.subject || '');
    /** описание */
    $('#issue_description').val(options.description || '');
    /** суть вопроса */
    $('#issue_custom_field_values_36').val(options.essence || '');
    /** назначена */
    $('#issue_assigned_to_id').val(options.assignedId || 0);
    /** источник задачи */
    $('#issue_custom_field_values_49').val(options.source || '');
    /** кол-во клиентов */
    $('#issue_custom_field_values_50').val(options.clientsCount || 0);
    /** приоритет */
    $('#issue_priority_id').val(options.priority || 0);
    /** тэги */
    $('#issue_tags').val(options.tags || '');
    /** кол-во обращений */
    $('#issue_custom_field_values_296').val(options.deal || '');


    /** наблюдатели */
    const { watchers = [] } = options;
    const watchersHTML = watchers.map(w => `<label id="issue_watcher_user_ids_${w.id}" class="floating"><input type="checkbox" name="issue[watcher_user_ids][]" value="${w.id}" checked="checked"/>${w.name}</label>`);

    $('#watchers_inputs')
        .html('')
        .append(watchersHTML);

    sendStatsOfRedmineAction('rm_template', ' ', ' ', ' ');

    function sendStatsOfRedmineAction (type, from, to, note) {
        const requestParams = {
          email: getUserLogin(),
          type: type,
          from: from,
          to: to,
          note: note
        };

        $.post(`${booster_environment.MA_WORK_NODE_URL}/add-statistic-bpm-otp-action`, requestParams);
      };

      function getUserLogin () {
        const parent = document.querySelector("#loggedas");
        const userLogin = parent.querySelector(".user").innerText;
        return userLogin;
    }
}

function makeHDLink() {
    if (!window.location.pathname.match(/\issues\/\d+/))
        return;

        var text = document.getElementsByClassName('cf_101 attribute')[0].innerHTML;
        var ids = text.split('e">')[1].split('<')[0].split(' ');
        var textLink = '';
        ids.forEach((id)=>{
            if (id.substring(0,2) == 'SR') {textLink += '<a href="http://192.168.10.92/oe/otp_tg/gotobpm.php?id='+id+'">'+id+'</a> ';} else {textLink += id+' ';}
        });
        document.getElementsByClassName('cf_101 attribute')[0].innerHTML = '<div class="label"><span>Внешний № вопроса (ст.)</span>:</div><div class="value">'+textLink+'</div>';

    /* ДЛЯ SD
    var ticket_1 = $('span:contains(Внешний № вопроса)').closest('div.attribute').first().find('div.value');
    ticket_1.html(ticket_1.text().replace(/[12]\d{6}/, '<a href="http://hd/WorkOrder.do?woMode=viewWO&woID=$&&&fromListView=true" target="_blank">$&</a>'));

    var ticket_2 = $('span:contains(Внешний № вопроса (ст.))').closest('div.attribute').first().find('div.value');
    ticket_2.html(ticket_2.text().replace(/[12]\d{6}/g, '<a href="http://hd/WorkOrder.do?woMode=viewWO&woID=$&&&fromListView=true" target="_blank">$&</a>'));
    */
}

function makeBPMLink() {

        if (document.getElementsByClassName('value type-textarea editable-field inactive')[0] && document.getElementsByClassName('value type-textarea editable-field inactive')[0].innerHTML != '') {
            var text = document.getElementsByClassName('value type-textarea editable-field inactive')[0].innerHTML;
            var ids = text.split(' ');
            var textLink = '';
            ids.forEach((id)=>{
                if (id.substring(0,2) == 'SR') {textLink += '<a href="http://192.168.10.92/oe/otp_tg/gotobpm.php?id='+id+'" target="_blank">'+id+'</a> ';} else {textLink += id+' ';}
            });
            document.getElementsByClassName('value type-textarea editable-field inactive')[0].innerHTML = '<div class="value">'+textLink+'</div>';
        } else {
            return setTimeout(makeBPMLink, 2000);
        }
}

//---------------------------------------------
// модуль RM
function initRMmodule() {
    jQuery(document).ready(function () {
        if (window.location.pathname.includes('/projects/zniintegration/issues/new')) {
            makeTemplateITG();
        }
        if (window.location.pathname.includes('/projects/zniikskt/issues/new')) {
            makeTemplateDct();
        }
        if (window.location.pathname.includes('/projects/zniiksvjt/issues/new')) {
            makeTemplateWidget();
        }
        if (window.location.pathname.includes('/projects/zni-cc/issues/new')) {
            makeTemplateContactCenter();
        }
        if (window.location.pathname.includes('/projects/kommunikator/issues/new')) {
            makeTemplateCommunicator();
        }
        if (window.location.pathname.includes('/projects/zni-vats/issues/new')) {
            makeTemplateVats();
        }
        if (window.location.pathname.includes('/projects/lk7/issues/new')) {
            makeTemplateLk7();
        }
        if (window.location.pathname.includes('/projects/zni-minsk-api/issues/new')) {
            makeTemplateApi();
        }
        if (window.location.pathname.includes('/projects/zivoip/issues/new')) {
            makeTemplateVoip();
        }
        if (window.location.pathname.includes('/projects/zotis/issues/new')) {
            makeTemplateOtis();
        }
        if (window.location.pathname.includes('/projects/znimb/issues/new')) {
            makeTemplateBilling();
        }
        if (window.location.pathname.includes('/projects/znimoblk/issues/new')) {
            makeTemplateMlk();
        }
        makeHDLink();
    });
}

//---------------------------------------------
// модуль Jira
function initJIRAmodule() {
    jQuery(document).ready(function () {
        if (window.location.origin.includes('https://jira.ru.mgo.su')) {
            history.pushState = ( f => function pushState(){
                var ret = f.apply(this, arguments);
                window.dispatchEvent(new Event('pushState'));
                window.dispatchEvent(new Event('locationchange'));
                return ret;
            })(history.pushState);

            history.replaceState = ( f => function replaceState(){
                var ret = f.apply(this, arguments);
                window.dispatchEvent(new Event('replaceState'));
                window.dispatchEvent(new Event('locationchange'));
                return ret;
            })(history.replaceState);

            window.addEventListener('popstate',()=>{
                window.dispatchEvent(new Event('locationchange'))
            });

            if (document.location.href.indexOf('DITSUP-') != -1){
                    setTimeout(makeBPMLink, 2000);
            }
            window.addEventListener('locationchange', function(){
                if (document.location.href.indexOf('DITSUP-') != -1){
                    setTimeout(makeBPMLink, 2000);
                }
            });
        }
    });
}

//---------------------------------------------
// модуль AP
const initAPmodule = () => {
    apBySip();
    apByDomain();
    apAutoSearch();
}

const apBySip = () => {
    if (document.location.pathname !== '/autoprovision/start') return;
    if (QS.action !== 'bysip') return;
    if (!QS.sip) return;

    document.querySelector('input[name="sip"]').value = QS.sip;
    // document.querySelector('input[name="search"]').click();
}

const apByDomain = () => {
    if (document.location.pathname !== '/autoprovision/start') return;
    if (QS.action !== 'bydomain') return;
    if (!QS.domain) return;

    document.querySelector('input[name="sip"]').value = QS.domain;
}

const apAutoSearch = () => {
    if (QS.autosearch === '1') {
        document.querySelector('input[name="search"]').click();
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------
// Получение JQuery
function getJquery(callback, isCallBackIndepent){
        if (typeof jQuery == 'undefined') {
            var jq = document.createElement('script');
            jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js";
            document.head.appendChild(jq);
            jq.onload = callback;
            return;
        }

        if (isCallBackIndepent){
            callback();
        }
}

//---------------------------------------------------------------------------------------------------------------------------------------
// ТРИГЕРЫ
if (window.location.host.includes(booster_environment.lk.base)) {
  const self = this;

  const callback = function () {
    $(document).ready(function () {
      setTimeout(lkModule.bind(self), 300);
    });
  };

  getJquery(callback, true);
}

if (isRightBpm()) {
  $(document).ready(function () {
    setTimeout(bpmModule, 300);
  });
}

function isRightBpm() {
  for (let value of booster_environment.bpmSet) {
    if (window.location.host.includes(value)) {
      return true;
    }
  }

  return false;
}

if (window.location.host.includes("192.168.37.150:8388")) {
  const callback = function () {
    initwaModule();
    addHashChangeHandler();
    return;
  };

  getJquery(callback, false);
}

if (window.top.location.origin.includes('http://hd') && window.top.location.search.includes('woMode=view')) {
    initHDModule();
    return;
}

if (window.location.origin.includes('logs.mango.local')) {
    initLogsModule();
    return;
}

if (window.location.origin.includes('voip-logviewer-webapp-prod.ru.mgo.su')) {  
    initVoipLogsModule();
    return;
}


if (window.location.origin.includes('http://redmine.mango.local')) {
    initRMmodule();
    return;
}

if (window.location.origin.includes('https://jira.ru.mgo.su')) {
    initJIRAmodule();
    return;
}

if (window.location.origin.includes(AP)) {
    initAPmodule();
    return;
}