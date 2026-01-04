// ==UserScript==
// @name         algo-method-shorcut
// @name:ja      アルゴ式ショートカット
// @namespace    https://greasyfork.org/ja/users/570127
// @version      1.0.0
// @description  アルゴ式でCtrl＋Enterで、コードテストになります。
// @description:ja  アルゴ式でCtrl＋Enterで、コードテストになります。
// @author       universato
// @license      MIT
// @match        https://algo-method.com/tasks/*
// @supportURL   https://twitter.com/universato
// @downloadURL https://update.greasyfork.org/scripts/500681/algo-method-shorcut.user.js
// @updateURL https://update.greasyfork.org/scripts/500681/algo-method-shorcut.meta.js
// ==/UserScript==

const buttons = document.querySelectorAll('button');
for(let button of buttons){
  if(button.innerText.match(/コードを試す|クエリを試す/)){
      button.innerHTML += "(Ctrl + Enter)";
  }
}

(function() {
  document.addEventListener('keydown', function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter'){
          const buttons = document.querySelectorAll('button');;
          for(let button of buttons){
              if(button.innerText.match(/コードを試す|クエリを試す/)){
                  let inputTextarea = document.querySelector('textarea.EditorWrapper_codeTestInputArea__fxPTR');
                  if(inputTextarea.value === ''){
                      let sample1 = document.querySelector('h4').nextElementSibling.querySelector("span").innerText;
                      inputTextarea.value = sample1;
                  }
                  button.click();
              }
          }
      }
  });
})();
