// ==UserScript==
// @name         RC
// @namespace    https://pbb.akioi.ml/
// @version      0.1.14
// @description  RC /se/qq
// @author       tiger0132
// @match        https://pbb.akioi.ml/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422421/RC.user.js
// @updateURL https://update.greasyfork.org/scripts/422421/RC.meta.js
// ==/UserScript==

const userMap = {
	400035: 'RC & tiger',
	278629: 'RC Main',
	487889: 'RC',
	78926: 'smdd',
	93237: 'smdd 2',
	96446: 'xyf',
	480054: 'Aestas16',
	185794: 'Aestas17',
	480014: 'Aestas18',
	166875: 'Aestas114514',
	366881: 'qst',
	487703: 'MC',
	800004: 'bot',
	207222: 'WYXkk',
	28762: 'tiger0133',
	106738: '_Felix',
	44805: 'Leap_Frog',
	154101: 'MatrixCascade',
	150879: 'quest_2',
	68273: 'xyf007',
	68030: 'sk',
	128369: 'rbq',
	70132: 'wz',
	158122: 'qx',
	58567: 'x义x',
	128141: 'Aestas16',
	121027: 'hpdf',
	133345: 'LT',
	114813: 'uu',
	122461: 'rui_er',
	73551: 'zjj',
	101984: 'RR',
	472839: 'qx',
};

var oldRenderName = renderName;
window.renderName = (_user, renderTag, renderBadge, renderLink) => {
    var user = Object.assign({}, _user);
	const uid = user.uid;

    if (user.admin)
        user.name = `${user.name} (tiger0133)`
	else if (uid in userMap)
		user.name = `${user.name} (${userMap[uid]})`;
	return oldRenderName(user, renderTag, renderBadge, renderLink);
}