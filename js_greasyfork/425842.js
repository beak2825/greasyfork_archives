// ==UserScript==
// @name           Replace Text On Atenea
// @namespace      @Gelo02_
// @description    Replaces text on Atenea
// @include        https://atenea.upc.edu/*
// @include        https://atenea.upc.edu/my/*
// @copyright      Gerard López López
// @version        1.1.3
// @license        http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @downloadURL https://update.greasyfork.org/scripts/425842/Replace%20Text%20On%20Atenea.user.js
// @updateURL https://update.greasyfork.org/scripts/425842/Replace%20Text%20On%20Atenea.meta.js
// ==/UserScript==

//Page Title
var newtitle = document.title;
newtitle = newtitle.replace('Curs: 300019 - ','');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('Curs: 300205 - ','');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('Curs: 300206 - ','');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('Curs: 300207 - ','');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('Curs: 300208 - ','');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('Curs: 300219 - ','');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('(Curs Total)','');
document.title = newtitle;


var newtitle = document.title;
newtitle = newtitle.replace('2020/21-02:EETAC-300019-CUTotal','CSL');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('2020/21-02:EETAC-300205-CUTotal','AM');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('2020/21-02:EETAC-300206-CUTotal','MEC');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('2020/21-02:EETAC-300207-CUTotal','I1');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('2020/21-02:EETAC-300208-CUTotal','TA');
document.title = newtitle;

var newtitle = document.title;
newtitle = newtitle.replace('2020/21-02:EETAC-300219-CUTotal','EG');
document.title = newtitle;



(function () {
    'use strict';

    var words = {
        // Burger Menu,
        '2020/21-02:EETAC-300019-CUTotal' : 'Circuits i Sistemes Lineals',
        '2020/21-02:EETAC-300205-CUTotal' : 'Ampliació de Matemàtiques',
        '2020/21-02:EETAC-300206-CUTotal' : 'Mecànica',
        '2020/21-02:EETAC-300207-CUTotal' : 'Informàtica I',
        '2020/21-02:EETAC-300208-CUTotal' : 'Tecnologia Aeroespacial',
        '2020/21-02:EETAC-300219-CUTotal' : 'Expressió Gràfica',
        '2017/18-00:EETAC-DABL-CU1' : "Delegació d'Alumnes",
        '2016/17-00:EETAC-EETACTU673-CUTotal' : 'Tutoria',
        // Subject List,
        "300019 - CIRCUITS I SISTEMES LINEALS (Curs Total)" : 'Circuits i Sistemes Lineals',
        "300205 - AMPLIACIÓ DE MATEMÀTIQUES (Curs Total)" : 'Ampliació de Matemàtiques',
        "300206 - MECÀNICA (Curs Total)" : 'Mecànica',
        "300207 - INFORMÀTICA 1 (Curs Total)" : 'Informàtica I',
        "300208 - TECNOLOGIA AEROESPACIAL I TRANSPORT AERI (Curs Total)" : 'Tecnologia Aeroespacial',
        "300219 - EXPRESSIÓ GRÀFICA (Curs Total)" : 'Expressió Gràfica',
        "TUTORIA: ROYO CHIC, Pablo (Curs Total)" : 'Tutoria: Pablo Royo',
        "No s'ha respost encara" : "",
        "Puntuat sobre 1,00" : "",
        "Marca la pregunta" : ""
};
    //////////////////////////////////////////////////////////////////////////////
    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // prepareRegex by JoeSimmons
    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words['']; // so the user can add each entry ending with a comma,
    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);
            // add the search/needle/query
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

            // add the replacement
            replacements.push( words[word] );
        }
    }

    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if ( isTagOk(text.parentNode.tagName) ) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace( value, replacements[index] );
            });
        }
    }

}());


(function() {
let css = `

`;

}());