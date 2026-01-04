// ==UserScript==
// @name         More Ore - Notification+
// @namespace    https://syns.studio/more-ore/
// @version      1.0.3
// @description  Remakes the more ore notification system with stacking notifications
// @author       123HD123
// @match        https://syns.studio/more-ore/
// @icon         https://syns.studio/more-ore/misc-tinyRock.22ef93dd.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444840/More%20Ore%20-%20Notification%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/444840/More%20Ore%20-%20Notification%2B.meta.js
// ==/UserScript==
(function () {
    const MOD_NAME = "Notification Plus";
    const MOD_STORAGE_DEFAULT = {
        mutationObservers: [],
        notifications: []
    };
    
    window.mods = window.mods || {};
    
    if (Object.keys(window.mods).includes(MOD_NAME)) return;
    
    window.mods[MOD_NAME] = window.mods[MOD_NAME] || MOD_STORAGE_DEFAULT;
    
    const MOD_STORAGE = window.mods[MOD_NAME];
    
    if (MOD_STORAGE.mutationObservers != [])
    MOD_STORAGE.mutationObservers.forEach(mutationObserver => mutationObserver.disconnect());
    
    MOD_STORAGE.mutationObservers = [];
    
    // Get utils
    const i = utils();
    
    // Inject styles
    const styles = document.createElement("style");
    styles.innerHTML = `
    .notifications {
        position: absolute;
        right: 0;
        bottom: 0px;
        text-shadow: 0 0 5px gold,0 0 1px #000;
        font-family: Arial, sans-serif;
        letter-spacing: 0.5px;
        z-index: 10;
    }
    .game-container .notification {
        position: relative;
        border-bottom: 1px solid #00000011
    }
    .game-container .notification.show {
    }
    `;
    document.head.appendChild(styles);
    
    // Prepare notification container
    const notifications = document.createElement("div");
    notifications.classList.add("notifications");
    document.querySelector(".game-container").appendChild(notifications);
    
    // Create NotificationPlus
    window.NotificationPlus = window.NotificationPlus || new (class NotificationPlus {
        notify(msg, seconds) {
            let notification = MOD_STORAGE.notifications.find(({ text }) => text == msg);
            if (notification != undefined && document.body.contains(notification.ref)) {
                clearTimeout(notification.timeout);
                notification.amount++;
                notification.ref.innerHTML = msg + " x" + notification.amount;
                let r = notification.ref.dataset.notificationUuid;
                notification.timeout = setTimeout(function () {
                    var t = i.select('[data-notification-uuid="'.concat(r, '"]'));
                    if (!t) {
                        MOD_STORAGE.notifications.splice(MOD_STORAGE.notifications.findIndex(({ text }) => text == msg), 1);
                        return;
                    }
                    // Slide up
                    t.style.bottom = "0";
                    t.classList.remove("show");
                    
                    // Fade out
                    t.style.transition = "opacity 0.3s ease-out";
                    t.style.opacity = "0";
                    t.ontransitionend = function () {
                        MOD_STORAGE.notifications.splice(MOD_STORAGE.notifications.findIndex(({ text }) => text == msg), 1);
                        return i.removeEl(t);
                    }
                }, seconds * 1000);
                
                let index = MOD_STORAGE.notifications.indexOf(notification);
                MOD_STORAGE.notifications[index] = notification;
                return;
            } else if (notification != undefined && !document.body.contains(notification.ref)) {
                clearTimeout(notification.timeout);
                MOD_STORAGE.notifications.splice(MOD_STORAGE.notifications.indexOf(notification), 1);
            }
            
            var r = i.getUUID(),
            a = i.createEl("div", ["notification", "notification-default"], msg);
            a.dataset.notificationUuid = r;
            i.select(".notifications").append(a);
            
            a.getBoundingClientRect();
            a.classList.add("show");
            let timeout = setTimeout(function () {
                var t = i.select('[data-notification-uuid="'.concat(r, '"]'));
                if (!t) return;
                // Slide up
                t.style.bottom = "0";
                t.classList.remove("show");
                
                // Fade out
                t.style.transition = "opacity 0.3s ease-out";
                t.style.opacity = "0";
                t.ontransitionend = function () {
                    MOD_STORAGE.notifications.splice(MOD_STORAGE.notifications.findIndex(({ text }) => text == msg), 1);
                    return i.removeEl(t);
                }
            }, seconds * 1000);
            MOD_STORAGE.notifications.push({text: msg, timeout, amount: 1, ref: a});
        }
        load(name) {
            window.NotificationPlus.notify("Loading " + name, 1.5);
        }
    })();
    
    // Add override for default notifications
    let m = new MutationObserver(overrideNotifications);
    m.observe(document.querySelector(".game-container"), {childList: true});
    MOD_STORAGE.mutationObservers.push(m);
    
    if (typeof volume == "undefined") {
        m = new MutationObserver(onLoad);
        m.observe(document.body, {childList: true});
    }
    
    function onLoad(mutationList, observer) {
        for(let mutation of mutationList) {
            if (mutation.removedNodes.keys().length == 0) return;
            let node = mutation.removedNodes.item(0);
            if (node?.className !== "loading-screen") return;
            
            // Get volume
            document.querySelector(".icon-settings")?.click();
            window.volume = Array.from(document.querySelectorAll(".setting-section")).find(setting => setting.children[0]?.innerText == "Volume").children[2].value;
            
            document.querySelector(".close-btn")?.click();
            observer.disconnect();
        }
    }
    
    function overrideNotifications(mutationList, observer) {
        for(let mutation of mutationList) {
            if (mutation.addedNodes.keys().length == 0) return;
            let node = mutation.addedNodes.item(0);
            if (!node?.className?.includes("notification") ||
            node?.parentNode?.className?.includes("notifications")) return;
            node.remove();
            NotificationPlus.notify(node.innerHTML, 2.5)
        }
    }
    
    function utils() {
        return {
            getRandomNum: function () {
                var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
                t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1,
                o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
                n = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
                r = Math.pow(10, Math.max(o, 0)),
                i = t * r,
                a = e * r,
                c = n ? 1 : 0;
                return (Math.floor(Math.random() * (i - a + c)) + a) / r
            },
            getUUID: function () {
                return "".concat(this.getRandomNum(1e3, 9999), "-").concat(this.getRandomNum(1e3, 9999), "-").concat(this.getRandomNum(1e3, 9999), "-").concat(this.getRandomNum(1e3, 9999));
            },
            createEl: function (e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
                o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "",
                n = document.createElement(e);
                return t.forEach(function (e) {
                    return n.classList.add(e)
                }),
                n.innerHTML = o + "",
                n
            },
            select: (e, t) => t ? t.querySelector("".concat(e)) : document.querySelector("".concat(e)),
            removeEl: function (e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                null != e && e.parentNode && (t ? (e.style.opacity = e.style.opacity || "1",
                e.style.transition = "opacity .3s",
                e.addEventListener("transitionend", function () {
                    e && e.parentNode.removeChild(e)
                }),
                e.style.opacity = "0") : e.parentNode.removeChild(e))
            }
        };
    }
})();