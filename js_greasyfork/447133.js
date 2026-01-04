// ==UserScript==
// @name        npmjs -> unpkg.com && copy script tag
// @namespace   Violentmonkey Scripts
// @match       https://www.npmjs.com/package/*
// @match       https://unpkg.com/browse/*/dist/
// @grant       GM_setClipboard
// @version     1.0
// @author      hunmer
// @description 2022/6/28 00:37:30
// @downloadURL https://update.greasyfork.org/scripts/447133/npmjs%20-%3E%20unpkgcom%20%20copy%20script%20tag.user.js
// @updateURL https://update.greasyfork.org/scripts/447133/npmjs%20-%3E%20unpkgcom%20%20copy%20script%20tag.meta.js
// ==/UserScript==

if(location.host == 'www.npmjs.com'){
  let span = document.querySelector('._50685029');
  let url = 'https://unpkg.com'+location.pathname.replace('package', 'browse')+'/dist/';
  span.innerHTML = '<a href="'+url+'" target="_blank">'+span.innerHTML+'</a>'
}else{
  let [first, second, ...trs] = document.querySelectorAll('tr');
  for(let tr of trs){
    let btn = document.createElement('button');
    btn.onclick = e => {
      let url = tr.querySelector('a').href.replace('/browse/', '/')
      let ext = url.split('.').at(-1).toLowerCase();
      let format = '{url}';
      switch(ext){
        case 'css':
          format = '<link href="{url}" rel="stylesheet" />';
          break;
          
        case 'js':
            format = '<script src="{url}"></script>';
           break;
      } 
      GM_setClipboard(format.replace('{url}', url));
    }
    btn.innerHTML = `Copy`;
    let td = document.createElement('td');
    td.append(btn);
    tr.append(td);
  }
}
