// ==UserScript==
// @name         Telegram markup extension
// @namespace    https://gist.github.com/W-1/
// @version      0.2
// @description  presented below
// @author       W-1
// @match        *://web.telegram.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368276/Telegram%20markup%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/368276/Telegram%20markup%20extension.meta.js
// ==/UserScript==

/*
*
*    [_text_]   => t̲e̲x̲t̲
*    [-text-]   => ̶t̶e̶x̶t̶
*  [_[-text-]_] => ̶̶̲t̶̶̲e̶̶̲x̶̶̲t̶̲
*    [^text^]   => ᴛᴇxᴛ
*    [@text@]   => ????
*    [|text|]   => ????
*    [$text$]   => ????
*    [=text=]   => ????
*    [%text%]   => ｔｅｘｔ
*
*/

document.querySelector('.composer_rich_textarea').onkeydown = e => {
  if(e.keyCode!==13)
    return;
  
  const abc = ['abcdefghijklmnopqrstuvwxyz'],
        abcI = e => abc.join('').indexOf(e),
        mapjoin = (s,f) => [...s].map(l=>f(l,abcI(l))).join('');
  abc.push(abc[0].toUpperCase());

  const cmd = [
    ['_','̲'],
    ['-','̶'],
    ['^','ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ'],
    ['@','??????????????????????????'],
    ['|','????????????????????????????ℂ????ℍ?????ℕ?ℙℚℝ???????ℤ'],
    ['$','????????????????????????????????????????????????????'],
    ['=','????????????????????????????????????????????????????'],
    ['%','ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ']
  ];
  
  let text = e.target.innerText;
  
  for (let [r,s] of cmd){
    if(!(new RegExp(`\\[\\${r}.*\\${r}\\]`).test(text)))
      continue;
    
    let t = text.split(new RegExp(`\\[\\${r}|\\${r}\\]`));
    
    text = t[0];
    
    switch(r){
      case '^': text += mapjoin(t[1], (l,i) => i!==-1&&i<26?s[i]:l);
        break;
      case '@': text += mapjoin(t[1], (l,i) => i!==-1?[...s][i<26?i:i-26]:l);
        break;
      case '-':
      case '_': text += mapjoin(t[1], l => ['[',']',...cmd.map(c=>c[0])].indexOf(l)!==-1?l:s+l)+s;
        break;
      default: text += mapjoin(t[1], (l,i) => i!==-1?[...s][i]:l);
    }
    
    text += t[2];
  }
  
  e.target.innerText=text;
  return true;
}
