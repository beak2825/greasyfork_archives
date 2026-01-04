// ==UserScript==
// @name        Buttons - gamedev.ru
// @namespace   Violentmonkey Scripts
// @match       https://gamedev.ru/site/forum/
// @grant       none
// @version     1.0
// @author      Viktor Eliseev
// @description 15.07.2023, 02:29:23
// @downloadURL https://update.greasyfork.org/scripts/470843/Buttons%20-%20gamedevru.user.js
// @updateURL https://update.greasyfork.org/scripts/470843/Buttons%20-%20gamedevru.meta.js
// ==/UserScript==
const area_tags = document.getElementById('areatags');
if (area_tags) {
	const div = document.createElement('div');
	div.innerHTML = `
		<a style="text-decoration:none" href="javascript:ins_tag('<sub>','</sub>')" title="<sub></sub> Нижний регистр">[y<sub>i</sub>]</a>
		<a style="text-decoration:none" href="javascript:ins_tag('<sup>','</sup>')" title="<sup></sup> Верхний регистр">[x<sup>2</sup>]</a>
		<a style="text-decoration:none" href="javascript:ins_tag('<span style=\\\'font:monospace;padding-inline:.3em;background-color:#7774\\\'>','</span>')" title="[monospace]">[monospace]</a>
		<a style="text-decoration:none" href="javascript:ins_tag('<tt>','</tt>')" title="<tt></tt> Телетайп">[tt]</a>
		<a style="text-decoration:none" href="javascript:ins_tag('[spoiler][code=cpp]','[/code][/spoiler]')" title="[spoiler][code]">[+code]</a>
		<a style="text-decoration:none" href="javascript:ins_tag('[spoiler][img=','][/spoiler]')" title="[spoiler][img]">[+img]</a>
	`;
	area_tags.parentNode.insertBefore(div, area_tags.nextSibling);
}
