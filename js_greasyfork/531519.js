// ==UserScript==
// @name         qBittorrent API Helper
// @version      1.0
// @description  Funciones para interactuar con qBittorrent Web UI
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// ==/UserScript==

class QBittorrentAPI {
    constructor(host, username, password) {
        this.host = host;
        this.username = username;
        this.password = password;
        this.cookie = null;
    }

    async login() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `${this.host}/api/v2/auth/login`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Referer": this.host
                },
                data: `username=${encodeURIComponent(this.username)}&password=${encodeURIComponent(this.password)}`,
                onload: (response) => {
                    if (response.responseText.trim() === "Ok.") {
                        // Obtener la cookie de la respuesta
                        const setCookie = response.responseHeaders.match(/SID=([^;]+)/);
                        if (setCookie) {
                            this.cookie = setCookie[0];
                        }
                        resolve();
                    } else {
                        reject(new Error("Login fallido. Verifica usuario y contraseña."));
                    }
                },
                onerror: (error) => {
                    reject(new Error(`No se pudo conectar a qBittorrent: ${error.statusText}`));
                }
            });
        });
    }

    async addMagnet(magnetLink) {
        if (!this.cookie) {
            await this.login();
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `${this.host}/api/v2/torrents/add`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cookie": this.cookie,
                    "Referer": this.host
                },
                data: `urls=${encodeURIComponent(magnetLink)}`,
                onload: (response) => {
                    if (response.status === 200) {
                        resolve();
                    } else if (response.status === 403) {
                        // Sesión expirada, intentar reloguear
                        this.cookie = null;
                        this.addMagnet(magnetLink).then(resolve).catch(reject);
                    } else {
                        reject(new Error(`Error al agregar torrent: ${response.statusText}`));
                    }
                },
                onerror: (error) => {
                    reject(new Error(`Error de conexión: ${error.statusText}`));
                }
            });
        });
    }

    static isValidMagnet(magnetLink) {
        const magnetRegex = /^magnet:\?xt=urn:[a-zA-Z0-9]+:[a-zA-Z0-9]{32,}/i;
        return magnetRegex.test(magnetLink);
    }

    static showNotification(title, message, isError = false) {
        GM_notification({
            title: isError ? `⚠️ ${title}` : title,
            text: message,
            timeout: isError ? 6000 : 4000,
            silent: true
        });
    }
}