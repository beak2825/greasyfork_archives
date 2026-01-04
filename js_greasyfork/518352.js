// ==UserScript==
// @name           blacklist habr
// @author         Nemo (S1egfr1ed)
// @namespace      Papageno
// @version        1.2
// @description    Clear the main page of habr.com from blacklisted authors
// @match          https://habr.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon           http://habr.com/favicon.ico
// @grant          GM_log
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/518352/blacklist%20habr.user.js
// @updateURL https://update.greasyfork.org/scripts/518352/blacklist%20habr.meta.js
// ==/UserScript==

var blacklist=[];
// populate blacklist with you authors
blacklist.push('AlexBaggins');
blacklist.push('Androgenom');
blacklist.push('amorev');
blacklist.push('ATOM_Team');
blacklist.push('dbalabolin');
blacklist.push('dhppc');
blacklist.push('divolko3');
blacklist.push('editor_agima');
blacklist.push('EddyLan');
blacklist.push('Dataist');
blacklist.push('DRoman0v');
blacklist.push('GeeksCat');
blacklist.push('HannaBilova');
blacklist.push('ilusha_sergeevich');
blacklist.push('Itstorytelling');
blacklist.push('klimensky');
blacklist.push('ko_ya');
blacklist.push('Lexx_Nimofff');
blacklist.push('m_ss');
blacklist.push('oleg_rico');
blacklist.push('olegmalahov1989');
blacklist.push('PaskalEnotov');
blacklist.push('RationalAnswer');
blacklist.push('RED_SOFT');
blacklist.push('RSHB_tsyfra');
blacklist.push('rinace');
blacklist.push('Seleditor');
blacklist.push('slava_rumin');
blacklist.push('shushara4241');
blacklist.push('sokolovps');
blacklist.push('spectr_dev');
blacklist.push('ssj100');
blacklist.push('Stas_smotrit_reklamu_1');
blacklist.push('tw0face');
blacklist.push('vStack');
blacklist.push('YourBusinessCase');
blacklist.push('yudeek');
blacklist.push('YuriPanchul');
blacklist.push('Wesha');
blacklist.push('Wladradchenko');
blacklist.push('Xcom-shop');

function main(){
    const articles = document.querySelectorAll('article');

    for(const article of articles){
        var author = article.getElementsByClassName('tm-user-info__userpic')[0];
        //GM_log(author);
        if (typeof author === 'undefined') {
        }
        else{
            var name = author.attributes.getNamedItem('title').value;
            if(blacklist.includes(name)){
                GM_log(name);
                const newDiv = document.createElement("div");
                const newContent = document.createTextNode(name);
                newDiv.appendChild(newContent);
                article.parentElement.appendChild(newDiv);
                article.parentNode.removeChild(article);
            }
        }
    }

    const links = document.querySelectorAll('link');
    for(const link of links){
        var as = link.getAttribute('as');
        if (typeof as === 'undefined') {
        }
        else{
            if ( as === 'script') {
                link.parentNode.removeChild(link);
                break;
            }
        }
    }
}


setTimeout(function(){
    main();
    }, 2000);

window.addEventListener(
    "scroll", main, false
);

