// ==UserScript==
// @name         MooMoo.io Force Connect
// @description  Connect to a 40/40 server
// @author       KOOKY WARRIOR
// @match        *://*.moomoo.io/*
// @icon         https://moomoo.io/img/favicon.png?v=1
// @run-at       document-start
// @license      MIT
// @version      0.1
// @namespace    https://greasyfork.org/users/999838
// @downloadURL https://update.greasyfork.org/scripts/499600/MooMooio%20Force%20Connect.user.js
// @updateURL https://update.greasyfork.org/scripts/499600/MooMooio%20Force%20Connect.meta.js
// ==/UserScript==

const symbol = Symbol("findServer")
Object.defineProperty(Object.prototype, "findServer", {
    get() {
		return this[symbol]
	},
	set() {
		this[symbol] = function (region, name) {
			for (let i = 0; i < this.servers[region].length; i++) {
				const server = this.servers[region][i]
                if (server.name === name) {
                    server.playerCapacity = 50
                    return server
                }
			}
		}
	},
	configurable: true
})
