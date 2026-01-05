// ==UserScript==
// @name           VK.com lottery filter  (Фильтр розыгрышей ВК)
// @description    Фильтр слов и новостей вКонтакте. В данном виде скрипт навсегда избавит вас от назойливых розыгрышей призов за репосты. При желании вы можете сами добавить нужные вам фильтры.
// @author         Anton Zr.
// @homepage       https://github.com/excel23/vknewsfilter
// @include        *://vk.com/feed*
// @include        *://vk.com/al_feed*
// @version        0.0.2.5
// @grant          none
// @namespace vk.nf
// @downloadURL https://update.greasyfork.org/scripts/25561/VKcom%20lottery%20filter%20%20%28%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D1%80%D0%BE%D0%B7%D1%8B%D0%B3%D1%80%D1%8B%D1%88%D0%B5%D0%B9%20%D0%92%D0%9A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/25561/VKcom%20lottery%20filter%20%20%28%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D1%80%D0%BE%D0%B7%D1%8B%D0%B3%D1%80%D1%8B%D1%88%D0%B5%D0%B9%20%D0%92%D0%9A%29.meta.js
// ==/UserScript==

//Основан на фильтре политических новостей https://greasyfork.org/ru/scripts/1978-vk-com-no-politic-feed
//чтобы отфильтровать новости по другим ключевым словам, замените '.розыгрыш.', например на '(медведев|путин|навальн|гитлер|ленин|сталин|ельцин|митинг|фальсификац|выборов|выборах|парламент|триумфальн|избирательн|оппозиц|госдум|единая\sросс|единую\sросс|голосовал|нашист|омон|национализм|\sедро|партии|партия|арест)'
//как в фильтре политических новостей
//чтобы дополнить фильтры - добавьте ключевые слова
function vanillafeed() {
	var li = document.getElementsByClassName("wall_text");
	var filters = [
		'.розыгрыш.',
		'.выбирател(ь|ем|я).',
		'.рандомайзер.',
		'.случайн(ый|ому).подписчик.',
		'победител(я|ей)\sопределим',
		'вступить.в.(нашу.)?группу',
		'состоять.в.(нашей.)?группе',
		'сдела(й|ет|ть|йте).репост(.)+()|((эт|данн)(ой|ого)).(записи|новости|поста)',
		'быть.нашим.подписчиком',
		'победител(ь|и|я)(.)+((определ(им|ятся|яются))|(выбер(у|ем|ается))|(выб(и|е)раться)|(буд(ет|ут)(.)+выбран))(.)+случайн(ым|о)'
	];
	var buff = filters.join('|');
	var patt = new RegExp(buff, 'mi');

	for (var i = 0; i < li.length; i++) {
		if (li[i].getAttribute('vfx') != 'true') {
			li[i].setAttribute('vfx', 'true');
			if (patt.test(li[i].innerHTML) == true) {
				li[i].parentNode.parentNode.parentNode.setAttribute('style', 'display: none;');
			}
		}
	}
}
setInterval(vanillafeed, 1000);