// ==UserScript==
// @name         ДКВУ, шаблоны для вызовов
// @version      0.1
// @description  ///
// @author       Yandex
// @include		 https://taximeter-admin.taxi.yandex-team.ru/invite?exam=dkvu
// @grant        none
// @namespace https://gre
// @downloadURL https://update.greasyfork.org/scripts/393819/%D0%94%D0%9A%D0%92%D0%A3%2C%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%20%D0%B4%D0%BB%D1%8F%20%D0%B2%D1%8B%D0%B7%D0%BE%D0%B2%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/393819/%D0%94%D0%9A%D0%92%D0%A3%2C%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%20%D0%B4%D0%BB%D1%8F%20%D0%B2%D1%8B%D0%B7%D0%BE%D0%B2%D0%BE%D0%B2.meta.js
// ==/UserScript==

//массив списка
const arrayCalling = [
  {'id': 'clickOne', 'text': 'ДКВУ, зеленые точки'},
  {'id': 'clickTwo', 'text': 'ДКВУ, проверить на подлинность'},

];
//стили для списка
$('head').append($('<style/>',{
  text: '.right_click_menu{margin: 0; padding: 0; position: fixed; list-style: none; background: #ffffff; border: 1px solid #000000; border-radius: 2px; font-size: 13px; display: none;}.right_click_menu li{width: 100%; padding: 10px; box-sizing: border-box; cursor: pointer; }.right-click-menu_li:hover{background: #eaeaea}.right-click-menu_active{display: block}'
}));
//определение переменных
const textArea = $("textarea[name='description']");
let divtextArea = $(textArea).parent('div');//див причина вызова
//создание списка
$(divtextArea).append($('<ul/>', {class: 'right_click_menu'}));
//заполнение списка
arrayCalling.forEach(function(i){
	$('.right_click_menu').append($('<li/>', {id: i ['id'], class: 'right-click-menu_li', text: i ['text']}));
});
//определение доп переменных
let labeltextArea = $(textArea).siblings('label');//лэйбл причина вызова
const listCalling = $('.right_click_menu');//всплывающее меню
let modalWindow = $('.modal-dialog');//общая форма
//при правом клике вместо контексного меню всплывает мое меню
labeltextArea.contextmenu(function(e){
  $('.right_click_menu').addClass("right-click-menu_active");
  e.preventDefault();
  let el_modal_dialog = document.querySelector('.modal-dialog');
  let position_modal_dialog = el_modal_dialog.getBoundingClientRect();
//  console.log(position_modal_dialog.top, position_modal_dialog.right, position_modal_dialog.bottom, position_modal_dialog.left);
//  console.log(position_modal_dialog.x, position_modal_dialog.y);
//  console.log(position_modal_dialog.width, position_modal_dialog.height);
  $('.right_click_menu').attr('style', 'top:' + (`${e.clientY}`-position_modal_dialog.y)+'px' + ';' + 'left:' + (`${e.clientX}`-position_modal_dialog.x)+'px');

});
//клик на общем экране, мое меню исчезает
modalWindow.click(function(e){
	if (e.button !== 2) {
  	listCalling.removeClass("right-click-menu_active");
  }
});
//по клике на моем меню оно не исчезает
listCalling.click(function(e){
  e.stopPropagation();
  listCalling.removeClass("right-click-menu_active")
});
//функции клика и добавления в текстарея
//простые
/*$('#clickOne').click(function(){
	textArea.val('ДКВУ, зеленые точки');
})
$('#clickTwo').click(function(){
	textArea.val('ДКВУ, проверить на подлинность');
})*/

//циклы и фукнции
function getCalling(id, text){
	$('#'+id).click(function(){
  	textArea.val(text);
  });
}

let menuList = $('.right_click_menu li');
for (let i = 0; i < menuList.length; i++){
	let idList = menuList[i].id;
  let textList = menuList[i].innerText;
	switch (i){
  	case 0: getCalling(idList, textList)
    case 1: getCalling(idList, textList)

  }
}