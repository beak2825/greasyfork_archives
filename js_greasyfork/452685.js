// ==UserScript==
// @name         Flicksbar - free KinoPoisk
// @namespace    https://t.me/flicksbar
// @version      1.0.5
// @description  Смотри все фильмы и сериалы без подписки и бесплатно с КиноПоиска!
// @author       mandey-camapa
// @match        https://www.kinopoisk.ru/series/*/
// @match        https://www.kinopoisk.ru/film/*/
// @icon         none
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452685/Flicksbar%20-%20free%20KinoPoisk.user.js
// @updateURL https://update.greasyfork.org/scripts/452685/Flicksbar%20-%20free%20KinoPoisk.meta.js
// ==/UserScript==
function flicksbar()
{
	var a = document.location.pathname.split('/')[2];
	var b = a.split('-');
	var c = b[(b.length)-1];
	var id = parseInt(c);

	var url = window.location.href;
	var id_kp = url.match('/(series|film)/(?<id_kp>.+?)/');
	var end_url = 'https://flicksbar.cc/film/' + id_kp[2] + '';
    var on_click = "window.open('" + end_url + "','_blank')";
	var divframe = document.createElement('div');
	divframe.className='div_button_play';
	divframe.style.position='fixed';
	divframe.style.top='5px';
	divframe.style.right='15px';
	divframe.style.textAlign='center';
	divframe.style.zIndex='9999';
	divframe.innerHTML="<button type=\"button\" id=\"btnn\" onclick=\"" + on_click + "\" style='FONT-VARIANT: JIS04;background-color: #f60;align-items: center;width: auto;padding: 9px 15px 9px 38px;font-family: Graphik Kinopoisk LC Web,Arial,Tahoma,Verdana,sans-serif;font-size: 13px;font-weight: 500;cursor: pointer;color: #fff;border: 0;border-radius: 4.4px;background-repeat: no-repeat;/* display: inline-block; */margin-right: 1px;background-position: 15px 13px;background-size: 18px;height: 44px;display: inline;z-index: 9999999;position: fixed;bottom: 30px;right: 30px;'>Смотреть бесплатно</button>";
	document.body.appendChild(divframe);
	var divframe = document.createElement('div');
	divframe.className='div_one';
	divframe.style.position='fixed';
	divframe.style.top='0px';
	divframe.style.left='0px';
	divframe.style.background='rgba(0, 0, 0, 0.7)';
	divframe.style.width='100%';
	divframe.style.height='100%';
	divframe.style.textAlign='center';
	divframe.style.paddingTop='50px';
	divframe.style.zIndex='9999';
	divframe.style.display='none';
	document.body.appendChild(divframe);
var block = document.getElementById('btnn');
			block.style.backgroundImage = "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='%23fff'%3E %3Cpath fill-rule='evenodd' d='M3 1.3v9.4L10.311 6z'/%3E %3C/svg%3E\")";

}
window.onload = flicksbar();
//flicksbar();