'use strict';

if (typeof Notification !== "function") throw Error("Not Support yet!");

const notify = (() => {
    const open = (typeof GM_openInTab === "function") ?
          GM_openInTab : (uri) => window.open(uri, "_blank");

    if (typeof GM_notification === "function") {
        const ver = GM_info.version;
        const handler = GM_info.scriptHandler;
        if (handler === "Violentmonkey" && ver >= "2.15.4") {
            const V2_15_4 = (opti) => {
                const noti = GM_notification({
                    onclick: () => (open(opti.url), noti.remove()),
                    ...opti
                });
                return noti;
            };
            if (ver > "2.16.1") // v 2.16.1 has some bugs
                return (opti) => {
                    opti.zombieUrl = opti.url;
                    opti.zombieTimeout = 2147483647;
                    return V2_15_4(opti);
                };
            return V2_15_4;
        } else if (handler === "Tampermonkey" && ver >= "5.0")
            return GM_notification;
    }
    return ({text, title, image, silent, tag, url: uri, ondone}) => {
            Notification.requestPermission();
            const options = {
                body: text,
                silent, tag,
                data: uri,
                icon: image,
            };
            if (!!tag) options.renotify = true;
            const noti = new Notification(title, options);
            noti.onclick = () => (open(noti.data), noti.close());
            noti.onclose = ondone;
            return {remove: () => noti.close()};
        };
})();