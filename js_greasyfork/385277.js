// ==UserScript==
// @name       		Shikimori Live
// @name:zh-CN 		Shikimori现场动漫 
// @name:ru    		Shikimori Live
// @description     Скрипт возвращает кнопку [ Смотреть онлайн ] на Shikimori.one
// @description:zh-CN     该脚本返回Shikimori.one上的“在线观看”按钮
// @icon            https://shikimorilive.top/userscript/scriptlogo.test.png
// @default_icon	https://shikimorilive.top/userscript/scriptlogo.test.png
// @author			JuniorDEV <shikimorilive@gmail.com>
// @namespace       http://github.com/jund-dev
// @license         GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright       Copyright (C) 2019, by JuniorDEV <shikimorilive@gmail.com>
// @match         	https://shikimori.one/*
// @match         	https://shikimori.org/*
// @version         2.1
// @grant			none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/385277/Shikimori%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/385277/Shikimori%20Live.meta.js
// ==/UserScript==

/**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
 
 /**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
 
 /**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
 
 /**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
 
 /**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
 
 /**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
 
 /**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
 
 /**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
 
 /**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Скрипт добавляет кнопку "Смотреть онлайн" на новый сайт Shikimori.One для интеграции с сайтом beta.shikimorilive.top
 */
(function() {	
	function Run() {
		if (document.readyState != "complete") {
			window.setTimeout(Run, 100);
		} else {     
			function addJQuery(callback) {
				var script = document.createElement("script");
				script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
				script.addEventListener('load', function() {
				var script = document.createElement("script");
				script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
				document.body.appendChild(script);
			}, false);
				document.body.appendChild(script);
			}
			addJQuery(function(){
				//alert('test3');
				var interval = setInterval(function(){
				if(jQ( 'body' ).hasClass( "p-animes-show" ) && !jQ( '.c-info-right .watch-online-placeholer>div' ).hasClass( "block" )){
					//alert('test');
					var titleId = (document.location.href.split('/')[4]).split('-')[0];
					//var episodeId = '';
					jQ( '.c-info-right .watch-online-placeholer>div' ).attr('style', 'margin-bottom: 5px;');
					//jQ( '.c-info-right .watch-online-placeholer' ).append('<div class="block"><a style="border: 1px solid #4c86c8; background-color: #daf1ff; color: #4c86c8;" class="b-link_button dark watch_link watch-online" href="https://beta.shikimorilive.top/player/'+titleId+'/dubbed/1">Смотреть онлайн</a></div>');
					jQ( '.c-info-right .watch-online-placeholer' ).html('<div class="block"><a style="border: 1px solid #4c86c8; background-color: #daf1ff; color: #4c86c8;" class="b-link_button dark watch_link watch-online" href="https://beta.shikimorilive.top/player/'+titleId+'/dubbed/1">Смотреть онлайн</a></div>');
				} else {
					clearInterval(interval);
				}
				}, 1000);
			});
		}
		
	}
	Run();
	//if($(".search-query-container").html() == '') return false;
	//$(".search-query-container").html('');
})();