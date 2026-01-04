// ==UserScript==
// @name           wayq?
// @author         sanya_v_litvyak
// @version        0.1.2
// @description    Who are you quoting?
// @include        http://boards.4chan.org/*
// @include        https://boards.4chan.org/*
// @connect        4chan.org
// @connect        4cdn.org
// @connect        *
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @run-at         document-end
// @namespace https://greasyfork.org/users/173264
// @downloadURL https://update.greasyfork.org/scripts/39132/wayq.user.js
// @updateURL https://update.greasyfork.org/scripts/39132/wayq.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //begin handwritten "API"
    var is4chanX = !!(dom('class', 'settings-link fa fa-wrench').length);

    function Arrayfrom(obj){
        if (typeof obj === 'undefined') return [];
        return Array.prototype.slice.call(obj);
    }

    function isInArray(value, array){
        return array.indexOf(value) > -1;
    }

    function seq(length, from, step){
        var arr = [];
        from = from || 0;
        step = step || 1;
        for (var value = from; length > 0; value += step, length--) arr.push(value);
        return arr;
    }

    function uniq(arr){
        function onlyUnique(value, index, self){
            return self.indexOf(value) === index;
        }

        var unique = arr.filter(onlyUnique);
        return unique;
    }

    function rand(arg) {
        if (Array.isArray(arg)) return arg[rand(arg.length)];
        else if (typeof arg === "number") return Math.floor(Math.random() * arg);
        else return Math.random();
    }

    function dom(type, query){
        var getelem = 'getElement';
        var by, queryfunc;
        if (type === 'id') by = 'ById';
        else if (type === 'class') by = 'sByClassName';
        else if (type === 'name') by = 'sByName';
        else if (type === 'tag') by = 'sByTagName';
        else if (type === 'all') {getelem = 'querySelector'; by = 'All';}
        else return [];
        queryfunc = getelem + by;
        return type === 'id' ? [document[queryfunc](query)]
                             : Arrayfrom(document[queryfunc](query));
    }

    function get(elem, arr){
        function getpstr(obj){
            return obj[pstr];
        }
        var pstr;
        if (elem === 'text') pstr = 'textContent';
        else if (elem === 'html') pstr = 'innerHTML';
        else pstr = elem;
        return arr.map(getpstr);
    }

    function insertAtCursor(elem, text){
        var start = elem.selectionStart;
        var end = elem.selectionEnd;
        var oldtext = elem.value;
        var before = oldtext.substring(0, start);
        var after  = oldtext.substring(end, oldtext.length);
        elem.value = (before + text + after);
        elem.selectionStart = elem.selectionEnd = start + text.length;
        elem.focus();
    }

    function listenKbd(key1, key2, action, args){ //key1 is one of 'ctrl', 'alt', 'shift', or 'meta'
        document.body.addEventListener("keydown", function(e){
            e = e || window.event;
            var key = e.which || e.keyCode;
            var keytype = key1 + 'Key';
            var ckey = e[keytype] || false;

            if ((key == key2.charCodeAt(0) || key == key2.charCodeAt(0) - 32) && ckey) {
                e.preventDefault();
                action(args);
            }

        }, false);
    }
    //end handwritten "API"

    //begin wayq
    function wayq(){
        var postnos = get('id', dom('class', 'postMessage')).map(function (e){return e.slice(1);});
        var greenteenpostnos = uniq(dom('class', 'quote')
                                    .map(function (e){return e.parentNode.id.slice(1);}));
        if (!is4chanX) QR.show(postnos[0]);
        var textform = is4chanX ? dom('class', 'textarea')[0].firstElementChild
                                : dom('name', 'com')[1];
        var comment = '';
        for (var index in seq(greenteenpostnos.length)){
            comment += '>>' + greenteenpostnos[index] + '\n';
        }

        comment += 'Who are you quoting?';
        textform.value = comment;
    }
    //end wayq

    //begin inserttext
    function insertText(args){
        var postnos = get('id', dom('class', 'postMessage')).map(function (e){return e.slice(1);});
        var oppostno = postnos[0];
        var textform = is4chanX ? dom('class', 'textarea')[0].firstElementChild
                                : dom('name', 'com')[1];
        var text = args.text.replace('$RANDOM', rand(postnos)).replace('$OP', oppostno);
        if (textform) insertAtCursor(textform, text);
    }
    //end inserttext

    //begin savekopipe
    function saveKopipe(){
        var textform = is4chanX ? dom('class', 'textarea')[0].firstElementChild
                                : dom('name', 'com')[1];
        var name = prompt('Enter the name for the kopipe you have entered');
        if (textform && name) GM_setValue(name, textform.value);
    }
    //end savekopipe

    //begin insertkopipe
    function insertKopipe(){
        var textform = is4chanX ? dom('class', 'textarea')[0].firstElementChild
                                : dom('name', 'com')[1];
        var kopipelist = GM_listValues().join(', ');
        var name = prompt('Enter the name for the kopipe you want to insert\n' +
                          '(currently saved kopipe: ' + kopipelist + ')');
        if (textform) insertAtCursor(textform, GM_getValue(name, ''));
    }
    //end insertkopipe

    //begin deletekopipe
    function deleteKopipe(){
        var kopipes = GM_listValues();
        var kopipelist = kopipes.join(', ');
        var name = prompt('Enter the name for the kopipe you want to delete\n' +
                          '(currently saved kopipe: ' + kopipelist + ')');
        if (name && isInArray(name, kopipes)) GM_deleteValue(name);
    }
    //end deletekopipe

    //begin bumprandomthreadatcurrentpageifnotmatchregexp
    function bumpRandomThreadAtCurrentPageIfNotMatchRegexp(args){
        var regexp = args.regexp;
        var opposts = get('lastChild', dom('class', 'post op'));
        var oppostsnotmatchregexp = opposts.filter(function (e){
            return !(e.textContent.match(regexp));});
        var oppostnos = oppostsnotmatchregexp.map(function (e){return e.id.slice(1);});
        var ranoppostno = rand(oppostnos);
        var ranmsg = rand(args.ranmsgs).replace('$OP', ranoppostno);

        if (ranoppostno) {
            QR.show(ranoppostno);
            var textform = dom('name', 'com')[1];
            textform.value = ranmsg;
        }
        //sorry, no free captcha/proxy for you
    }
    //end bumprandomthreadatcurrentpageifnotmatchregexp

    //begin newthread
    function newThread(){
        QR.show(0);
        dom('id', 'qrHeader')[0].innerHTML =
            'Start a New Thread<img alt="X" src="//s.4cdn.org/image/buttons/burichan/cross.png" id="qrClose" class="extButton" title="Close Window">';
    }
    //end newthread

    //customize key bindings
    listenKbd('alt', 'w', wayq);
    listenKbd('alt', 'c', saveKopipe);
    listenKbd('alt', 'v', insertKopipe);
    listenKbd('alt', 'd', deleteKopipe);
    if (!is4chanX) listenKbd('alt', 'n', newThread);

    var option_insertrandomno = {}; option_insertrandomno.text = '>>$RANDOM\n';
    var option_insertopno = {}; option_insertopno.text = '>>$OP\n';
    var option_insertkita = {}; option_insertkita.text = 'ｷﾀ━━━(ﾟ∀ﾟ)━━━!!\n';
    listenKbd('alt', 'r', insertText, option_insertrandomno);
    listenKbd('alt', 'o', insertText, option_insertopno);
    listenKbd('alt', 'k', insertText, option_insertkita);

    var option_bump = {};
    option_bump.regexp = />>>|\bmod(erator)?s?\b|\bjanitors?\b/i;
    option_bump.ranmsgs = ['bump', 'nice thread', '>>$OP', 'age'];
    if (!is4chanX) listenKbd('alt', 'b', bumpRandomThreadAtCurrentPageIfNotMatchRegexp, option_bump);

})();
