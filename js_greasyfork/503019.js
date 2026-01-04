// ==UserScript==
// @name         MooMoo.io Server Fill Bots
// @namespace    MooMoo.io Server Fill Bots
// @description  gives you magical powers
// @version      0.1
// @match        *://*.moomoo.io/*
// @run-at       document-start
// @license      MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/503019/MooMooio%20Server%20Fill%20Bots.user.js
// @updateURL https://update.greasyfork.org/scripts/503019/MooMooio%20Server%20Fill%20Bots.meta.js
// ==/UserScript==

/*
My discord: wealthydev
My youtube: https://www.youtube.com/@wealthyDev

How To Use:

possible prefixes: ".", "!", "/"

prefix + fill to send countless bots into the server.
prefix + remove to remove bots from the server.
prefix + state to check player count.

ex: /fill /remove /state

issues:
if bots take a while to join(up to 120 seconds) it could be because of 2 reasons:
servers are waking up, so just wait
or
you got rate limited by google recaptcha so use VPN (extension or app)
recommended VPN extension: https://veepn.com/vpn-apps/vpn-for-chrome/
*/

const id = Math.floor(Math.random() * 9e16);
const project = "groovy-sore-enthusiasm";
const bots = 80;

const extractIp = (url) => {
    const match = url.match(/wss:\/\/([\w-]+\.[\w-]+\.[\w-]+)\./);
    return match ? match[1] : null;
};

const request = (type, ip, token, pid) => {
    let url = `https://${project}.glitch.me/?id=${id}&type=${type}&ip=${ip}`;
    if (token) url += `&pid=${pid || 0}&token=${token}`;
    fetch(url);
};

const verify = async (fill) => {
    if(fill && removed) {
        alert("reload the page or use another tab");

        return false;
    }

    const result = await prompt("do you wish to continue? (yes/no)", "yes");

    return result === "yes";
}

let removed = false;

const actions = {
    fill: async () => {
        if(!socket || !verify(true)) return null;
        console.log("Filling server with bots");

        for (let bot = 0; bot < bots; bot += 1) {
            if(removed) return null;

            const token = await window.grecaptcha.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", { action: "homepage" });
            request("fill", extractIp(socket.url), token, Math.ceil((bot + 1) / 4) - 1);
        }
    },
    remove: () => {
        if(!socket || !verify()) return null;
        console.log("Removing bots from the server");

        removed = true;

        request("remove", extractIp(socket.url));
    },
    state: () => {
        if(!socket) return null;

        console.log("Checking state")

        const { host } = window.location;
        const parent = host.split(".")[0];

        let url = "";

        switch(parent) {
            case "sandbox":
                url = "https://api-sandbox.moomoo.io"
                break;
            case "dev":
                url = "https://api-dev.moomoo.io";
                break;
            default:
                url = "https://api.moomoo.io"
                break;
        }

        const ip = extractIp(socket.url);

        fetch(`${url}/servers?v=1.22`).then((res) => res.json()).then((parsed) => {
            let serverData = parsed;

            for(let server of serverData) {
                if(`${server.key}.${server.region}.moomoo` === ip) alert(`players: ${server.playerCount}/${server.playerCapacity}`);
            }
        })
    }
};

let socket;

(async () => {
    try {
        const msgpackScript = await fetch("https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js").then(response => response.text());
        eval(msgpackScript);

        const originalWS = WebSocket;
        window.WebSocket = class extends originalWS {
            constructor(...args) {
                super(...args);
                this.send = new Proxy(super.send, {
                    apply: (target, thisArg, args) => {
                        const [type, [data]] = window.msgpack.decode(new Uint8Array(...args));
                        if (type === "6") {
                            const lowerData = data.toLowerCase();
                            if ([".", "!", "/"].includes(lowerData[0]) && lowerData.length > 1) {
                                window.onbeforeunload = () => actions.remove(socket);

                                const cmd = lowerData.slice(1).split(' ')[0];
                                const action = actions[cmd];

                                socket = this;
                                if (action) return action(this);
                            }
                        }
                        return target.apply(thisArg, args);
                    }
                });
            }
        };
    } catch (error) {
        console.error("Error:", error);
        location.reload();
    }
})();