// ==UserScript==
// @name         Выделение меток спецпроекта
// @version      0.3.5
// @description  ///
// @author       Gusev
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk
// @include	 https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/375055/%D0%92%D1%8B%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BC%D0%B5%D1%82%D0%BE%D0%BA%20%D1%81%D0%BF%D0%B5%D1%86%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/375055/%D0%92%D1%8B%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BC%D0%B5%D1%82%D0%BE%D0%BA%20%D1%81%D0%BF%D0%B5%D1%86%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0.meta.js
// ==/UserScript==
$('<style/>',{
	html: '#blink2 { -webkit-animation: blink2 0.5s linear infinite; animation: blink2 0.5s linear infinite;}@-webkit-keyframes blink2 {100% { box-shadow: 1px 0px 33px rgb(255, 0, 0,6); opacity: 1}}@keyframes blink2 {100% { box-shadow: 1px 0px 33px rgb(255, 0, 0,6);opacity: 1 }} .specTag {animation: blink2 1s cubic-bezier(0.18, 0.89, 0.32, 1.28) infinite; background-color: red;} .myMetkaDKK {font-size: 18px; font-style: normal; padding: 0.1em 0.3em; border-radius: 0.2em; position: relative; background: red; background: linear-gradient(to right, mediumpurple, red); transform: skewX(-20deg); display: inline-block; background: linear-gradient(90deg, rgba(150,110,215,0.87718837535014) 0%, rgba(255,0,0,1) 100%);}',
}).appendTo('head');
var specTags = ['Перевес ГРЗ', 'Фейк ГРЗ', 'Эмулятор', 'на кузове есть пыль/загрязнения','на кузове есть вмятины/повреждения/царапины','в салоне есть мелкие посторонние предметы','в салоне есть крупные посторонние предметы','в салоне есть загрязнения/пятна','на сиденьях есть накидки/покрывала'];
function checkAndBlink(){
	$('.js-tag-label.dkk-tag.dkk-tag-gray').each(function(){
		if(specTags.indexOf($(this).text())>= 0){
			$(this).addClass('specTag')
		};
	})
};
$('.js-tag-container').bind('DOMSubtreeModified',checkAndBlink);
$(document).bind('item_info', checkAndBlink);

$("#table").on('selected', function(e, sender) {
    let dataInvite = sender.dataset.invite.toLowerCase().trim(),
        metka = document.getElementById('mkk-invite')
    if (dataInvite.includes('#бизнескз')) {
        metka.classList.add('myMetkaDKK')
        metka.classList.add('specTag')
    } else {
        metka.classList.remove('myMetkaDKK')
        metka.classList.remove('specTag')
    }
})