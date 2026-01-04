// ==UserScript==
// @name         Rufuker 2ch
// @name:ru      Руфакер для Двач 2ch
// @namespace    https://2ch.hk/
// @version      0.55
// @description  Culturally enriches the pidorussian lingamus on 2ch
// @description:ru  Культурна облагарожывает росейскую языку на Дваче 2ch
// @author       Anon
// @copyright    2021-2022, Anon
// @match        *://2ch.hk/*
// @match        *://2ch.pm/*
// @match        *://2ch.life/*
// @license      GPL-3.0-only
// @homepageURL  https://github.com/adisloom/rufuker/blob/main/README.md
// @supportURL   https://github.com/adisloom/rufuker/issues
// @icon         https://www.google.com/s2/favicons?domain=2ch.life
// @defaulticon  https://www.google.com/s2/favicons?domain=2ch.life
// @icon64       https://www.google.com/s2/favicons?domain=2ch.life&sz=64
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432951/Rufuker%202ch.user.js
// @updateURL https://update.greasyfork.org/scripts/432951/Rufuker%202ch.meta.js
// ==/UserScript==

/**********************************************************************************
*
*                           NOTICE
*
* The script requires the browser plugin "Tampermonkey".
* Set "Run only in top frame" to "No" in plugin's settings for the script.
*
* It may also work in other usercript manager plugins:
* GreaseMonkey, ViolentMonkey, FireMonkey.
*
***********************************************************************************/

(function() {
    'use strict';

    if (!document.getElementById('js-posts'))
        if (!document.getElementById('posts-form'))
            return 1;


     /* 
     *  Converts a string of text according to the rules.
     *  Optionial argument (bool) to disable uppercase 
     *  text conversion. Default - enabled 
     */
    class Rufuker {
        rufuker_replacement_rules = [
            // xx -> yy
            ['ий народ', 'ай на рот'],
            ['осси', 'абсе'],
            ['сски', 'зке'],
            ['еще', 'есчо'],
            ['когда', 'када'],
            ['деньг', 'тэньг'],
            ['денег', 'дынек'],
            ['денеж', 'дыняш'],
            ['ого([ \\s,\\.\\-:])', 'ава$1'],
            ['о([влрт])о', 'а$1а'],
            ['[иы]й([ \\s,\\.\\-:])', 'ы$1'],
            ['([^ \\s,\\.\\-:])ие([ \\s,\\.\\-:])', '$1$1е$2'],
            ['ри', 'ґы'],
            ['ре', 'ґе'],
            ['ря', 'ґя'],
            ['рь', 'гх'],
            ['ти', 'це'],
            ['те', 'ця'],
            ['тя', 'ца'],
            ['ди', 'дэ'],
            ['де', 'ды'],
            ['ши', 'шэ'],
            ['ше', 'ша'],
            ['жи', 'жэ'],
            ['же', 'жа'],
            ['си', 'се'],
            ['ио', 'её'],
            ['иа', 'ея'],
            ['иу', 'ею'],
            ['ие', 'ее'],
            ['ться', 'ца'],
            ['тся', 'тсо'],
            ['дь', 'ц'],
            ['ть', 'ц'],
            ['ли', 'ле'],
            ['че', 'це'],
            ['([жшч])ь', '$1'],
            ['щ', 'ш'],
            ['([^ \\s,\\.\\-:])и([ \\s,\\.\\-:])', '$1е$2'],
            ['ъе', 'йэ'],
            ['ъё', 'йо'],
            ['ъю', 'йу'],
            ['ъя', 'йа'],
            [' и([ \\s,\\.\\-:])', ' ды$1'],
            ['и', 'ы'] ];
        addUpperCase = true;
        aReplacement = [];

        constructor(uppercaseOption){
            if (typeof uppercaseOption === 'boolean') this.addUpperCase = uppercaseOption;
            this.compileRegex();
            this.rufukString = this.covertText.bind(this);
        }
        compileRegex() {
            this.aReplacement = this.rufuker_replacement_rules.map( c => ({ sRegex: new RegExp(c[0],'g'), sSubst: c[1] }) );
            if (!this.addUpperCase) return;
            var aUpcasedReplacement = this.rufuker_replacement_rules.map( function(c) {
                let rgx = c[0];
                let upRgx = '';
                for (let i = 0; i < rgx.length; i++){
                    let res = rgx[i].match(/[а-я]/);
                    if (res) upRgx = upRgx + res[0].toString().toUpperCase();
                    else upRgx = upRgx + rgx[i];
                }
                let substitute = c[1].at(0).toUpperCase() + c[1].slice(1); //capitalize the first letter
                return { sRegex: new RegExp(upRgx,'g'), sSubst: substitute };
            });
            this.aReplacement = this.aReplacement.concat(aUpcasedReplacement);
        }
        covertText(txt) {
            var flagAllCaps = this.detectAllCaps(txt);
            for (let r of this.aReplacement) {
                let substitute = r.sSubst.toString();
                if (flagAllCaps) substitute = substitute.toUpperCase();
                txt = txt.toString().replace(r.sRegex, substitute);
            }
            return txt;
        }
        detectAllCaps(str){
           let part = str.slice(-200);
           let res;
           if (res = part.match(/[А-Я]/g))
               if (res.length / part.length > 0.30) return true;
           else return false;
        }
    } //class


    /* 
     *  Can traverse 2ch and replace text in all the posts
     *  including popups and dynamically loaded messages.
     *  Argument - a function for text conversion.
     */
    class TextReplacer2ch {
        workingElement;
        #flagObserveNewPosts = true;
        #flagObserveScrollAndPopup = true;
        delayPopup = 100; //ms

        constructor (txtConverter) {
            this.txtConverter = txtConverter;

            if (this.workingElement = document.getElementById('js-posts'));
              else if (this.workingElement = document.getElementById('posts-form'));
            		else return 1;

            const aThreads = this.workingElement.querySelectorAll('div.thread');
            if (aThreads.length === 0) return 2; //wrong page
            this.replaceAllDecendantArticles(this.workingElement);
            if (this.#flagObserveScrollAndPopup) {
                const board_observer = new MutationObserver(this.replaceScrollAndPopup.bind(this));
                board_observer.observe(this.workingElement, {childList:true});
            }
            //single thread page needs one more observer for added posts
            if (this.#flagObserveNewPosts && aThreads.length === 1) {
                const thread_observer = new MutationObserver(this.replaceNewPosts.bind(this));
                thread_observer.observe(aThreads[0], {childList:true});
            }
        } //constructor

        replaceAllDecendantArticles(pe) {
            const articles = pe.querySelectorAll('article.post__message');
            articles.forEach(a => a.innerHTML = this.txtConverter(a.innerHTML));
        }

        replaceArticleByNum(idNum) {
            const id_article = 'm' + idNum;
            const el = document.getElementById(id_article);
            el.innerHTML = this.txtConverter(el.innerHTML);
        }

        replaceScrollAndPopup(mutationsList, observer) {
            let postClasses = ['post', 'post_type_reply', 'post_preview'];
            setTimeout( () => {
                for(const mutation of mutationsList) {
                    if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) continue;
                    mutation.addedNodes.forEach( n => {
                        if (postClasses.every(name => n.classList.contains(name))) {
                            for (const idx in n.children) {
                                if (n.children[idx].nodeName === 'ARTICLE') {
                                    n.children[idx].innerHTML = this.txtConverter(n.children[idx].innerHTML);
                                }
                            }
                        } else if (n.className === 'thread') {
                            const thread = document.getElementById(n.id);
                            this.replaceAllDecendantArticles(thread);
                        }
                    });
                }
            }, this.delayPopup);
        }

        replaceNewPosts (mutationsList, observer) {
            for(const mutation of mutationsList) {
                if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) continue;
                for (const n of mutation.addedNodes[0].children) {
                    if (n.nodeName !== 'DIV' || ! n.hasAttribute('id')) continue;
                    let idNum = n.id.match( /\d{3,}/g).pop(); //last 3+ digits
                    this.replaceArticleByNum(idNum);
                }
            } //for
        }
    } //class

    var txtConverter = new Rufuker();
    new TextReplacer2ch(txtConverter.rufukString);

})();
