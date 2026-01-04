// ----------Куча комментариев----------------------------------------------
//
// ==UserScript==
// @name Get Aliexpress Link And Parameters
// @namespace absolvo.ru
// @version 0.02
// @description Этот скрипт собирает выбранные кнопки в строку на странице товара ali
// @include *aliexpress.ru*
// @downloadURL https://update.greasyfork.org/scripts/395786/Get%20Aliexpress%20Link%20And%20Parameters.user.js
// @updateURL https://update.greasyfork.org/scripts/395786/Get%20Aliexpress%20Link%20And%20Parameters.meta.js
// ==/UserScript==

function toClipBoard(text){
  console.log(text);
navigator.clipboard.writeText(text).then(function() {
  console.error('copy done ', err);
}, function(err) {
  console.error('Could not copy text: ', err);
});
}

function handleButtonClick(){
  var blocks = document.getElementsByClassName('sku-property-list');

	var res = window.location.href.match(new RegExp('http.?://.*html'))[0];
	for (var i = 0, c = blocks.length; i < c; i++ )
	{
  	var arr = blocks[i].children;
  	res += '\t#';
    
    for (var j = 0, c1 = arr.length; j < c1; j++ )
    { 
      if ( arr[j].className == 'sku-property-item selected')
      {
        res += (j + 1);
      }
    }
	}

	toClipBoard(res);
}

var but = document.createElement("input");
but.setAttribute('type', 'button');
but.setAttribute('value', 'Скопировать в буфер');
but.setAttribute('id', 'addButton');
but.onclick = handleButtonClick;

var form = document.createElement("form");
form.append(but);

var ctrl = document.getElementsByClassName('product-sku')[0];
ctrl.append(form);

