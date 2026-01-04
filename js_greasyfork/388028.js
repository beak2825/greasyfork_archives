// ==UserScript==
// @name         quizlet match game cheat
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://quizlet.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388028/quizlet%20match%20game%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/388028/quizlet%20match%20game%20cheat.meta.js
// ==/UserScript==

document.onclick = ()=>{main();}

function main(){
    let suc = false;
    try{
        let container = document.getElementsByClassName('MatchModeQuestionScatterBoard is-ready')[0],
            all_options = container.children,
            words = [],
            description = [],
            color_code = ['pink','blue','yellow','red','black','green'];
        for(let i = 0;i<all_options.length;i++){
            if(all_options[i].innerText.split(' ').length <= 3){
                words.push(all_options[i]);
            }else{
                description.push(all_options[i]);
            }
        }
        for(let j = 0;j<words.length;j++){
            let a = words[j],
                b = description[j],
                c = a.style.transform.split('e')[1];
            b.style.backgroundColor = color_code[j];
            a.style.backgroundColor = color_code[j];
        }
        console.log(words,description);
        suc = true;
    }catch(e){
        window.setTimeout(()=>{main()},10);
        console.log(e)
    }
}