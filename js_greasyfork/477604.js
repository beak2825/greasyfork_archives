const waitFor = (target, selector) => {
    return new Promise(resolve => {
        if (target.querySelector(selector)) {
            return resolve(target.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (target.querySelector(selector)) {
                resolve(target.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
};

const gmGet = async (url, cacheKey, cacheDuration) => {

    if (cacheKey) {
        cacheDuration = (cacheDuration == undefined) ? 604800 * 1000 : cacheDuration;
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTimestamp = parseInt(localStorage.getItem(cacheKey + "_timestamp"));
        const cachedSince = (Date.now() - cachedTimestamp)
        if (cachedData && cachedTimestamp && cachedSince < cacheDuration) {
            console.log(`[gmGet] get cached key ${cacheKey} (${cachedSince / 1000}s < ${cacheDuration / 1000}s)`)
            return JSON.parse(cachedData);
        }
    }

    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            url,
            method: "GET",
            onload: (response) => {
                resolve(new Response(response.response, { statusText: response.statusText, status: response.status }));
            },
            onerror: (error) => {
                reject(error);
            }
        });
    })
        .catch((error) => {
            throw { message: "critical error", code: error.status };
        })
        .then((response) => {
            const result = response.json();
            return result.then((body) => {
                if (typeof body.error == 'undefined') {
                    if (cacheKey) {
                        localStorage.setItem(cacheKey, JSON.stringify(body));
                        localStorage.setItem(cacheKey + "_timestamp", Date.now());
                    }
                    return body;
                } else {
                    throw { message: body.error.error, code: body.error.code };
                }
            });
        });
};

function floatFormat(num, digits) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "m" },
        { value: 1e9, symbol: "b" },
        { value: 1e12, symbol: "t" },
        { value: 1e15, symbol: "q" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toPrecision(digits).replace(rx, "$1") + item.symbol : "0";
}

const playerIdFromChat = () => {
    const wsData = document.getElementById("websocketConnectionData");
    const chat = JSON.parse(wsData.innerHTML);
    return {"id": chat.userID, "name": chat.playername};
}

const clearLocalStorage = (prefix) => {
    for (var key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith(prefix)) {
            localStorage.removeItem(key);
        }
    }
}

const getPlayerId = (element, type) => {
    player_id = null

    if(type == "honor") {
        // honor bar without user name
        const url = new URLSearchParams(
            element.querySelector("div.member.icons")
            .querySelector("div[class^=honorWrap]")
            .querySelector("a[class^=linkWrap]").href.split("?")[1]
            );
            player_id = url.get("XID");
        } else if (type == "username") {
        // classical honor with user.name
        const url = new URLSearchParams(
            element.querySelector("a.user.name").href.split("?")[1]
        );
        player_id = url.get("XID");
    }

    // desperate fallback
    if(player_id == null) {
        element.querySelectorAll("a").forEach(a => {
            const url = new URLSearchParams(a.href.split("?")[1])
            if (url.has("XID")) {
                player_id = url.get("XID");
                console.warn(`[getPlayerId] Desperate fall back to get player id: ${player_id}`);
                return;
            }
        })
    }

    return player_id;
}
