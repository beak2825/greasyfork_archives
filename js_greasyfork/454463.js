// ==UserScript==
// @name         wikipedia show all languages link and old Layout Design
// @description  show all languages link
// @namespace    wikipedia_lang
// @author       Covenant
// @version      1.0.5
// @license      MIT
// @homepage
// @match        https://*.wikipedia.org/*
// @exclude      https://*.m.wikipedia.org/*
// @exclude      https://www.wikipedia.org/*
// @icon         data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAEAgQAhIOEAMjHyABIR0gA6ejpAGlqaQCpqKkAKCgoAPz9/AAZGBkAmJiYANjZ2ABXWFcAent6ALm6uQA8OjwAiIiIiIiIiIiIiI4oiL6IiIiIgzuIV4iIiIhndo53KIiIiB/WvXoYiIiIfEZfWBSIiIEGi/foqoiIgzuL84i9iIjpGIoMiEHoiMkos3FojmiLlUipYliEWIF+iDe0GoRa7D6GPbjcu1yIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/454463/wikipedia%20show%20all%20languages%20link%20and%20old%20Layout%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/454463/wikipedia%20show%20all%20languages%20link%20and%20old%20Layout%20Design.meta.js
// ==/UserScript==
const search_useskin=['','monobook','vector','timeless','vector-2022'];
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    //let params=new URLSearchParams(obj_url.search);
    return [obj_url,params];
}
//console.log("break");
function main_01(){
    var lang=document.querySelectorAll('ul>li.interlanguage-link');//vector
    if(lang.length!=0){
        for(let i = 0; i < lang.length; i++){
            lang[i].style.display="";
        }
    }
    if(document.querySelectorAll('body')[0].classList.contains('skin-'+'vector-2022')){
        var tmp=document.querySelectorAll('nav#mw-panel-toc')[0];
        tmp.appendChild(document.querySelectorAll('div#p-lang-btn>div>ul')[0].cloneNode(true));
    }
}
(function() {
    'use strict';
    //GM_registerMenuCommand("Hello, world (simple)", () => {alert("Hello, world!");});
    let url=fn_url(document.location);
    let useskin=GM_getValue('useskin','');
    console.log("GM_getValue: "+useskin);
    if(useskin!=''){
        let apply_skin=!document.querySelectorAll('body')[0].classList.contains('skin-'+(useskin=='vector'?useskin+'-legacy':useskin));
        if(apply_skin){
            if(url[1].get('useskin')==null){
                url[0].searchParams.append('useskin',useskin);
                window.location.replace(url[0].toString());
            }
            else{//?useskin=
                if(url[1].get('useskin')=="cologneblue"||url[1].get('useskin')=="modern"||url[1].get('useskin')=="minerva"){
                    useskin=url[1].get('useskin');
                }
                else{
                    url[0].searchParams.set('useskin',useskin);
                    window.location.replace(url[0].toString());
                }
            }
        }
        {//?useskin=
            let anchor=document.querySelectorAll('a');
            for(let n = 0; n < anchor.length; n++){
                if(anchor[n].href.search(new RegExp("javascript:", "i"))==-1&&anchor[n].href!=''&&anchor[n].href.search(new RegExp(document.location.host, "i"))!=-1){
                    let anchor_href=fn_url(anchor[n].href);
                    if(anchor_href[1].get('useskin')==null){
                        anchor_href[0].searchParams.append('useskin',useskin);
                        anchor[n].href=anchor_href[0].toString();
                    }
                }
            }
        }
    }
    else{//default useskin
        if(url[1].get('useskin')!=null){
            url[0].searchParams.delete('useskin');
            window.location.replace(url[0].toString());
        }
    }
    for (let i = 0; i < search_useskin.length; i++){//script menu
        let click=(useskin==search_useskin[i]?'✔️':"");
        GM_registerMenuCommand((search_useskin[i]==''?'default':search_useskin[i])+click, () => {
            GM_setValue('useskin', search_useskin[i]);
            url[0].searchParams.set('useskin',search_useskin[i]);
            window.location.replace(url[0].toString());
            //alert(search_useskin[i]);
            //location.reload();
        });
    }
    //alert(useskin);
    window.setTimeout(( () => main_01() ), 3000);
})();