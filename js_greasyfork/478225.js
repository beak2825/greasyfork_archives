// ==UserScript==
// ==UserLibrary==
// @name        Faster IndexedDB Geter
// @grant       unsafeWindow
// @version     0.0
// @description A library that can make you do the things of IndexedDB faster.
// @author      PPPxcy
// @include     *
// @namespace   PPPScript
// ==/UserLibrary==
// ==/UserScript==

unsafeWindow.ReadIndexedDB = function ReadIndexedDB(storeName, groupName, keyName) {
	return new Promise((rsl, rej) => {try {
		(r => r.onsuccess = () => (t => t.onsuccess = () => rsl(t.result))(r.result.transaction([groupName], 'readonly').objectStore(groupName).get(keyName)))(unsafeWindow.indexedDB.open(storeName));
	} catch(err) { rej(err); }});
};
