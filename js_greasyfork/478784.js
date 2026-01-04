// ==UserScript==
// @name         Invidious set quality and speed
// @namespace    Invidious
// @version      1.1
// @description  This sets the quality and the speed of every invidious instance to 2x speed and medium quality. It does not affect music videos when in lisen mode
// @author       ccuser44
// @license      CC0
// @match        https://*/watch?v=*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAE60lEQVR42q1XQ5glaRCstX1a277ON7Zt27batm3btm3bto1/Mw5vWqra7jLTiOSELP/888/b69ev/3nXrl1bDh48eP7o0aN3ab9H1xfo2dYNGzb88u+//77NLeXy559/vrJ169bfTp48ee/Ro0f+Wlpalfb29j1+fn4joaGh49hx7eDg0KutrV31+PHjwFOnTj2kf/4ggV9dFPNt27b9evHiRS1NTc3asLCw8fLyctbW1sa6u7tZT0/PlB3P8K6iooJFRESMk6D1ly5d0tu+ffsfH3300UuCGK9evfrNI0eOXFBQUCiNi4tjLS0tDAy6urpYZ2fnvDu+wbetra0sISGBKSkpVZCbrqxZs4afazZu3PjRuXPnNGxtbQfq6upATERc8I5/6+vrGbln8MKFC3qbNm36ZF7mFEQfktlMfXx8xtrb2/lozMsiHR0dzN/ff+zKlSvWpODHszJfvnz562fPnlX28vIa5Uu8AwwECEPBOkbW1Vy5cuWbMwSgVDpqbm7ei0Diw1izqJNdzOhkZS38hYBVra2t+w8dOnR6CvPNmzd/JSEhkVlZWcnL7K0dnexQSif7OryTpTaQr7v4u6O6uppJS0vnbdmy5bsXAlCOPw4KCuIdcNC4iDRPaehi7R3CA5NSmp0+fVqSw7J27drPJSUl02trayEhb00a6utYclLi/wpKZIasrGwOVdWvuX379h1xdHTsh2RCtEhKSmJPnz5lVVVVgrMF/7u6ug7u37//DHf+/HkzEBMoAHKbUTAxSlncCxYgLS2NUZW14x48eJBeVlYmSIumpiZmZ2fHbt++zag/MBQsIf/jWwQ89Y18TkpKqqWhoUGQ9Pn5+Sw8PJx5e3szKrMoMoKtACXk5OS6OEVFxYHm5mZBAkRGRrLs7GyGwL137x40EWwF9ApVVdVRwQKgUEFzUZ/w9PRksEJAQADuBQsgxAXQEO0WJp9SWO7evcuePHmC9MIzIS7o5O7fv58mCkK+6ZeYmIjrF8/c3d0ZrBAYGIh7vooggPM4ag4mIMjXfNAewEQkMM6oBXfu3EFd4GUF8EpNTUUa2nJ79+49RDndj594VDD4H/6bQdDNzY3BCsHBwbhfUAAXFxcUolMcIZVPqRGlLlCK8RMiH3AL17PmNerC8+fPGWIKz+ZTREZGJnvdunVfcVhOnDjxUOS/hZpIXl4erucqr+zYsWMsJCRkTlp4TkCWEXAV40QLQaUvxMTE0hEYc0kOrVB+a2pq5q1ut27dmjMWRPFCzS+HIMC3UzDBgQMHDpmZmfVQns/4EZAqOjqaGRsbs5SUlHnjBJZUUVGBpXA/A5BYWlr2UQ85MQMRLVu27DXq0fIeHh6jYDhLAcIOIryQz2w0gDUJ9qmuWLHijblA6fuUGobAhUsJSkHL19d3jACvOYHSDxdCxh+QlCpWVlZ98PdiYTmyCxCf2r4mID/HZ1m1atUbhw8fPk2lsigmJoahVwgdTDDMYKjBcIMhB8MOJ3Sh+e4nklxVTU2tilJrvLS0FEVIxGTKWIZneIeyjnlRQ0OjhoYRTRrvfuEWs/z6668vU8r8RLXiJoEXb3V19VIbG5suqojDBGRHqfKN4prM3E1Myx4+fOhL394h1PvLH3/88Qq3lAsRfJNA7Pc7d+5cT2l7kkx7FTtdn6JnG6iy/UDT9FtCaP4Huc4TMWKLwA0AAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/478784/Invidious%20set%20quality%20and%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/478784/Invidious%20set%20quality%20and%20speed.meta.js
// ==/UserScript==

/*
To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide.
This software is distributed without any warranty.
You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
*/

var isLisen = /&listen\=(1|true)/.test(window.location.href);

function run() {
	for (let textObject of document.getElementsByClassName("vjs-menu-item-text")) {
		if (!isLisen && textObject.textContent == "2x" || isLisen && textObject.textContent == "1x") {
			textObject.parentNode.click();
			console.log(isLisen, textObject.textContent);
		};
	};
};

for (let textObject of document.getElementsByClassName("vjs-menu-item-text")) {
	if (textObject.textContent == "medium") {
		textObject.parentNode.click();
		console.log(isLisen, textObject.textContent);
	};
};

setTimeout(run, 200);