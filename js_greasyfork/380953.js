// ==UserScript==
// @name           Депереименование Астаны
// @description    Заменяет Нур-Султан на Астану
// @include        http://*
// @include        https://*
// @copyright      пляшем
// @version        1.1.0
// @license        http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @namespace https://greasyfork.org/users/286542
// @downloadURL https://update.greasyfork.org/scripts/380953/%D0%94%D0%B5%D0%BF%D0%B5%D1%80%D0%B5%D0%B8%D0%BC%D0%B5%D0%BD%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%90%D1%81%D1%82%D0%B0%D0%BD%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/380953/%D0%94%D0%B5%D0%BF%D0%B5%D1%80%D0%B5%D0%B8%D0%BC%D0%B5%D0%BD%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%90%D1%81%D1%82%D0%B0%D0%BD%D1%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var words = {'Нур-Султане'  : 'Астане',
                 'Нур-Султана'  : 'Астаны',
                 'Нур-Султаном' : 'Астаной',
                 'в Нур-Султан' : 'в Астану',
                 'Нур-Султан'   : 'Астана',
                 'Токаев'       : 'Назарбаев',
                 'Касым-Жомарт' : 'Нурсултан'};

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }

    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words[''];

    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);

            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }

            replacements.push( words[word] );
        }
    }

    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if ( isTagOk(text.parentNode.tagName) ) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace( value, replacements[index]);
            });
        }
    }

}());