// ==UserScript==
// @name         ДОПЫ
// @version      0.1.1
// @description  ...
// @author       NMYNOV
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=dkvu
// @grant        none
// @namespace
// @namespace https://greasyfork.org/users/468849
// @downloadURL https://update.greasyfork.org/scripts/418955/%D0%94%D0%9E%D0%9F%D0%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/418955/%D0%94%D0%9E%D0%9F%D0%AB.meta.js
// ==/UserScript==

let category=document.getElementById("category"),
      buttonRes=document.createElement('button'),
      divcategory=category.closest('div')
      category.style.width="80%"
      divcategory.append(buttonRes)
  const styleContent = `
  font-size: 20px;
  cursor: pointer;
  right: 1.5%;
  top: 0%;
  position: absolute;
  background-color: rgb(179,179,179);
  border-radius: 5px;
  width: 40px;
text-align:center;`,
      hoverStyleContent = `
  text-shadow: 0 0 10px #46b8da;`

buttonRes.textContent = '🔃'
buttonRes.style = styleContent
buttonRes.addEventListener('click',function(){update()})

function ite(){
let select= document.querySelector('tr.selected')
if (select==null){document.getElementById("dkvu-data-form-ok").style.background='red'
}
else{document.getElementById("dkvu-data-form-ok").style='/*background="red"*/'}}
setInterval( ite, 500 )
setInterval( update, 4 * 1000 )
