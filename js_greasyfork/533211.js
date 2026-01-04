// ==UserScript==
// @name         server changer
// @version      0.1
// @description  gives you magical ping!
// @author       wealthydev
// @match        *://*.tankionline.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1347888
// @downloadURL https://update.greasyfork.org/scripts/533211/server%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/533211/server%20changer.meta.js
// ==/UserScript==

(function() {
const ws = WebSocket;
window.WebSocket = class extends ws {
    constructor(url) {
        let data = window.target_server?.split(":"),
            target = data ? `wss://${data[0]}.tankionline.com:${data[1]}/` : null;

        super(target || url);

        console.log("server", this.url);
    }
};

    const server_changer = (JSON.parse(localStorage.getItem("server_changer")) || {});
    window.target_server = server_changer.target;

    server_changer.target = null;
    if(window.target_server) {
        localStorage.setItem("server_changer", JSON.stringify(server_changer));

        return alert(`targeting server [${window.target_server}]`)
    }

    let shadow = { host: document.createElement("div") }
    document.body.appendChild(shadow.host);
    shadow.root = shadow.host.attachShadow({ mode: 'open' });

    shadow.root.innerHTML = `<style>.mini-box{z-index:999999;position:absolute;top:100px;left:100px;width:140px;background-color:#f9f9f9;border:1px solid #ccc;border-radius:6px;padding:10px;box-shadow:0 2px 10px rgba(0,0,0,.1);cursor:move;user-select:none}.mini-box label,.mini-box select{font-size:12px}.mini-box select{width:100%;padding:4px;margin-top:5px}</style><script></script><div class=mini-box id=box><div style=display:flex;justify-content:space-between;align-items:center;margin-bottom:6px><label style=font-size:large>servers</label> <button id=connect_server style="font-size:10px;padding:4px 8px">connect</button></div></div>`;

    const box = shadow.root.querySelector("#box")

    let hue = 0;

    function animate() {
        hue = (hue + 1) % 360;
        box.style["background-color"] = `hsl(${hue}, 100%, 60%)`;
    }

    setInterval(animate, 50);

    function update_list(servers) {
        const select = document.createElement("select");
        select.name = "servers";
        select.id = "server";
        select.style.marginTop = "8px";

        let option = document.createElement("option");
        option.value = option.text = `default`;
        select.appendChild(option);

        const sorted = Object.entries(servers).sort((a, b) => a[1] - b[1]);
        sorted.forEach(([name, ping]) => {
            option = document.createElement("option");
            option.value = name;
            option.text = `${name.split(":")[0]} / ${ping} ms`;
            select.appendChild(option);
        });

        box.appendChild(select);

        select.value = `default`;

        const button = shadow.root.querySelector("#connect_server");
        button.addEventListener("click", () => {
            if(select.value === "default") return box.remove();

            server_changer.target = select.value;
            localStorage.setItem("server_changer", JSON.stringify(server_changer));

            return window.location.reload();
        });
    }

    const scan = (url, callback) => {
        const ws = new WebSocket(url);

        let start, pause;

        ws.onopen = () => {
            start = Date.now();
            ws.close();
        }

        ws.onclose = () => {
            const responseTime = Date.now() - start;
            callback(Math.round(responseTime / 2));
            clearTimeout(pause);
        }

        ws.onerror = () => {
            callback();
            ws.close();
            clearTimeout(pause);
        }

        pause = setTimeout(() => {
            callback();
            ws.close();
        }, 500);
    }

    let servers;

    function update() {
        fetch("https://tankionline.com/s/status.js").then(async res => {
            const data = await res.json();
            servers = {};

            for (const [, value] of Object.entries(data.nodes)) {
                let server = value.endpoint,
                    key = server.host.split(".tanki")[0];

                if(server.status !== "NORMAL") continue;

                scan(`wss://${server.host}:${server.wsPorts[0]}`, function(ping) {
                    if(!ping) return null;

                    servers[`${key}:${server.wsPorts[0]}`] = ping;
                });
            }

            setTimeout(() => update_list(servers), 1e3)
        });
    }

    update();
})();