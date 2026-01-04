// ==UserScript==
// @name         Forum Media Content
// @namespace    isnt
// @version      1.0.4
// @description  Отображение видео и картинок вместо ссылок
// @author       isnt
// @include      /^https:\/\/((www|qrator|my)(\.heroeswm\.ru|\.lordswm\.com))\/forum_messages\.php.*/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/452238/Forum%20Media%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/452238/Forum%20Media%20Content.meta.js
// ==/UserScript==

(function (window, undefined) {
	let w;
	if (typeof unsafeWindow !== undefined) {
		w = unsafeWindow;
	} else {
		w = window;
	}
	if (w.self !== w.top) {
		return;
	}

	let comment = document.querySelectorAll("td[style='color: #000000; padding: 5px;font-size: 0.8125em;']")
    let author = document.querySelectorAll("td[style='min-width:200px;']");

	Array.from(comment || author).forEach(item => {
		let x = item.innerHTML;
		if (x.indexOf("http") !== -1) {
			if (x.indexOf(".png") !== -1 || x.indexOf(".jpg") !== -1 || x.indexOf(".jpeg") !== -1 || x.indexOf(".gif") !== -1) {
				let img = /(http(s?):\/\/.*\.(?:png|jpg|jpeg|gif|bmp))/g;
				let link = x.match(img);
				for(let i = 0; i < link.length; i++) {
                    if(author[i].innerText !== 'Империя' && author[i].innerText !== 'Empire') {
                        console.log(author[i].innerText)
                        item.innerHTML = item.innerHTML.replace(`${link[i]}`, `
                        <div style="display: flex;align-items: center;">
                            <a href="${link[i]}" target="_blank">${link[i]}</a>
                            <details style="border-radius: 4px;padding: 0.5em 0.5em;margin-left: 12px;background-color: #8F9FA2;color: #222c2d;cursor: pointer;">
                                 <summary>Посмотреть картинку</summary>
                                 <img src="${link[i]}" width="500">
                            </details>
                        </div>`);
                        // <img src="${link[i]}" width="500">
                    }
				}
				// item.innerHTML = item.innerHTML.replace(`${link}`, `<img src="${link}" width="500">`);
			}
		}
		if (x.indexOf("youtu") !== -1) {
                let re = /((ftp|http|https):\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
                let url = x.replace(re, `
                        <div style="display: flex;align-items: center;">
                            <a href="http://www.youtube.com/watch?v=$3" target="_blank">http://www.youtube.com/watch?v=$3</a>
                            <details style="border-radius: 4px;padding: 0.5em 0.5em;margin-left: 12px;background-color: #be3737;color: #fff;cursor: pointer;">
                                 <summary>Посмотреть видео</summary>
                                 <embed
                                     src="https://www.youtube.com/embed/$3"
                                     wmode="transparent"
                                     type="video/mp4"
                                     width="500" height="300"
                                     allowfullscreen
                                  >
                            </details>
                        </div>`);
                    item.innerHTML = `${url}`;
            }
	})

})(window);