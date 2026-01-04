// ==UserScript==
// @name        Mafia jail breaker
// @namespace   util
// @description Automatically removes people from prison, or something like that
// @include     https://mafiareturns.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35651/Mafia%20jail%20breaker.user.js
// @updateURL https://update.greasyfork.org/scripts/35651/Mafia%20jail%20breaker.meta.js
// ==/UserScript==
const HTMLALL = document.querySelector("#all");
/**
 * 
 * @param {string} URL
 * @param {string} method
 * @param {{}|FormData} data
 * @param {CancellationToken} cancellationToken
   @returns {Promise<string>}
 */
function PromiseXHR(URL, method = "get", data = null, cancellationToken = CancellationToken.none) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open(method, URL);
        req.setRequestHeader("SDI", "yes");
        var time;
        try {
            time = 1 * localStorage.ui_data_check;
        }
        catch (e) {
            time = Math.round(new Date().getTime() / 1000);
        }

        req.setRequestHeader("X-LAST-SS", time);
        req.setRequestHeader("LAST_CREW_CHAT", "undefined");

        function cancelRequest() {
            req.abort();
            reject(cancellationToken.cancelError());
        }
        cancellationToken.addOncancel(cancelRequest);

        req.addEventListener("load", function (e) {
            if (cancellationToken.cancellationRequested) {
                return;
            }
            else {
                cancellationToken.removeOncancel(cancelRequest);
            }
            if (this.status == 200) {
                try {
                    resolve(this.responseText);
                }
                catch (e) {
                    reject(e);
                }
            }
            else {
                reject(new Error("HTTP ERROR " + this.status));
            }
        });
        req.addEventListener("error", function (e) {
            if (!cancellationToken.cancellationRequested) {
                cancellationToken.removeOncancel(cancelRequest);
                reject(e);
            }
        });
        if (typeof data == "object" && data != null && !(data instanceof FormData))
            data = JSON.stringify(data);
        if (method != "get" && data != null)
            req.send(data);
        else
            req.send();
    });
}
/**
 * 
 * @param {Document} doc
 */
function appendNewBody(doc) {
    HTMLALL.innerHTML = "";
    const fragment = document.createDocumentFragment();


    const div = doc.body;
    //    document.createElement("div");
    //div.innerHTML = doc.body.innerHTML;

    var limit = 20;
    while (div.childNodes.length > 0) {
        const item = div.childNodes[0];
        //console.log("Append ", item);
        fragment.appendChild(item);

        if (limit-- < 0) {
            break;
        }
    }
    HTMLALL.appendChild(fragment);
}
Promise.timeout = function (delay, cancellationToken = CancellationToken.none) {
    return new Promise((resolve, reject) => {
        cancellationToken.addOncancel(timeoutCancel);
        const timeoutRef = setTimeout(
            function () {
                cancellationToken.removeOncancel(timeoutCancel);
                resolve();
            },
            delay);
        function timeoutCancel() {
            clearTimeout(timeoutRef);
            reject(cancellationToken.throwIfCancelled());
        }
    });
};
window.Promise.timeout = Promise.timeout;
/**
 * 
 * @param {string} path
 * @param {"get"|"post"} method
 * @param {objec|string} data
 * @param {string} selector
 * @returns {Promise<Document>}
 */
async function PromiseHTML(path, method = "get", data = null, selector = null, cancellationToken = CancellationToken.none) {

    const result = await PromiseXHR(path, method, data);
    /** @type {Array<string>} **/
    const resultSplit = result.split("<<<\"ui_data\">>>");
    //console.log(resultSplit);
    const HTML = resultSplit[0];
    const parser = new DOMParser();
    const domobj = parser.parseFromString(HTML, "text/html");

    const object = typeof selector == "string" && selector.length > 0 ? domobj.querySelector(selector) : domobj;
    try {
        if (resultSplit.length > 0) {
            object.ui_data = JSON.parse(resultSplit[1]);
            localStorage.ui_data = resultSplit[1];
        }
    } catch (e) {
        console.error("[PromiseHTML] Invalid JSON data arrrived with HTML", e);
    }

    return object;
}



function clickLink(name) {
    const UI_TIMERS = document.querySelector("#ui-timers");
    const links = document.querySelectorAll("a");
    //console.log(links);
    /** @type {HTMLAnchorElement} **/
    var link = null;
    for (let i = 0, l = links.length; i < l; ++i) {
        const item = links[i];
        const url = item.getAttribute("href");
        let isTheOne = false;
        if (item.parentElement == UI_TIMERS)
            continue;

        if (name instanceof RegExp) {
            isTheOne = name.test(url);
        }
        else {
            isTheOne = url.indexOf(name) != -1;
        }
        if (isTheOne) {
            link = item;
            break;
        }
        else {
            //console.log("Not the right link: ", item);
        }
    }
    if (link) {
        console.log("Click: ", link.href, link);
        link.click();
    }
    else {
        console.warn("Link not found!", name);
    }
}
window.clickLink = clickLink;
class Message {
    /**
     * 
     * @param {HTMLDivElement} div
     */
    constructor(div) {
        this.text = div.innerText;
        for (var i in Message.TYPE) {
            if (Message.TYPE[i].test.test(this.text)) {
                this.TYPE = Message.TYPE[i];
                break;
            }
        }
        if (this.TYPE) {
            const match = this.TYPE.test.exec(this.text);
            this.matches = match;
        }
        else {
            this.TYPE = { test: /$^/g };
            this.matches = [];
        }
    }
}
/**  @type {{[x:string]:{test:RegExp}}} **/
Message.TYPE = {
    PETTY_JOB_PAID: {
        test: /(You were paid \$[0-9, \.]+ for your time|you grabbed yourself \$[0-9, \.]+)/i
    },
    IN_JAIL: {
        test: /(You can't work from in jail!|You have ([0-9]+) minutes and ([0-9]+) seconds remaining in your sentence|You were thrown in the slammer)/i
    },
    JAIL_NOT_SO_FAST: {
        test: /Whoaa! Not so fast kid\. You still had 5 seconds left! A five second penalty has been added to your timer/i
    },
    BUST_SUCCESS: {
        test: /Success! ([a-z0-9_\- ]+) was set free/i
    },
    JAIL_EMPTY: {
        test: /jail is[a-z ]*empty/i
    },
    JAIL_GOT_OUT: {
        test: /Hm+\. You can'?t seem to find ([a-z0-9_\- ]+)/i
    }

}
/**
 * @returns {Array<Message>}
 */
function getMessages() {
    const messages = Array.prototype.map.call(
        document.querySelectorAll("#all .msg"),
        (msg) => {
            return new Message(msg)
        }
    );
    messages.findMessage = function (messageType) {
        return this.find((msg) => msg.TYPE == messageType);
    }
    return messages;
}
async function loadLink(url) {
    const result = await PromiseHTML(url);
    appendNewBody(result);
}

class MafiaAction {
    /**
     * 
     * @param {Document} docElement
     */
    constructor(docElement) {
        this.document = docElement;
        /** @type {HTMLElement} **/
        this.mainElement = this.getElement();
        this.available = this.mainElement != null;
    }
    /**
     * @returns {HTMLElement}
     */
    getElement() {
        return null;
    }
    /**
     * @returns {Promise<void>}
     */
    async doThis() {
    }
    /**
     * Start this task and return a cancellation token for it.
     */
    doWithCancelation() {
        const token = new CancellationToken();
        this.doThis(token);
        return token;
    }
    /**
     * Must load all data from HTML element again
     */
    updateHTMLData() {
        throw new Error("This class does not support reloading!");
    }
}



const TIMER_DURATIONS = {
    S: 0
    , Ma: 0
    , C: 7200
    , W: 60
    , P: 200
    , F: 720
    , T: 7200
    //, t: 300
    , t: 7200
    , A: 3600
    , Pp: 3600
    , J: 0
    , H: 0
};
class Timer {
    /**
     * 
     * @param {function():{ui_data:{timers:array}}} uiObjectGetter
     * @param {string} name
     */
    constructor(uiObjectGetter, name) {
        //
        this.uiGetter = uiObjectGetter;
        this.name = name;
    }
    get remaining() {
        return Math.max(this.duration - this.elapsed, 0);
    }
    get isRunning() {
        return this.remaining > 0;
    }
    get duration() {
        return TIMER_DURATIONS[this.name];
    }
    get elapsedCached() {
        return this.ui.ui_data.timers[this.name][0];
    }
    get elapsed() {
        return this.elapsedCached + this.timeCorrection;
    }
    get ui() {
        try {
            return this.uiGetter();
        }
        catch (e) {
            return {
                ui_data: {
                    timers: {
                        W: [0],
                        C: [0],
                        J: [0],
                        P: [0],
                        t: [0],
                        T: [0]
                    }
                }
            };
        }
    }

    /** Number of seconds since last ui update.
   @type {number} **/
    get timeCorrection() {
        return (new Date().getTime() / 1000) - (this.ui.last_ui_update / 1000);
    }
}
const TIMER_INFO = {};
for (var timerName in TIMER_DURATIONS) {
    TIMER_INFO[timerName] = new Timer(function () { return window.ui; }, timerName);
}
window.TIMER_INFO = TIMER_INFO;

class CityLocation {
    /**
     * 
     * @param {Document} document
     */
    constructor(document) {
        this.document = document;
        this.travelDialogLoadTime = -1;
    }
    /** @type {string} **/
    get locationText() {
        return this.document.querySelector("#loc").textContent;
    }
    get locationCity() {
        const parts = this.locationText.split(", ");
        if (typeof parts[1] == "string") {
            return parts[1].trim();
        }
        return "?";
    }
    get locationDistrict() {
        const parts = this.locationText.split(", ");
        if (typeof parts[0] == "string") {
            return parts[0].trim();
        }
        return "?";
    }
    get travelDialogCacheAge() {
        return new Date().getTime() - this.travelDialogLoadTime;
    }
    async getTravelDialog(cancellationToken = CancellationToken.none) {
        const document = await PromiseHTML("/manage/travel.php?ajax=true", "get", null, null, cancellationToken);

    }
    async canFly(cancellationToken = CancellationToken.none) {
        //const flyTimer = 
    }
    async canTravel(cancellationToken = CancellationToken.none) {
        return false;
    }
}

class ReloadWatcher {
    constructor() {
        this.watchElement = document.querySelector("#all");
        this.makeWatchPromise();
        this.lastChild = this.watchElement.firstChild;
        // create an observer instance
        this.observer = new MutationObserver((mutations) => {
            //console.log(mutations);
            if (this.watchElement.firstChild != this.lastChild) {
                this.notify();
                ///console.log("HTML reloaded!");
            }
        });

        // configuration of the observer:
        var config = { attributes: false, childList: true, characterData: true };

        // pass in the target node, as well as the observer options
        this.observer.observe(this.watchElement, config);
    }
    makeWatchPromise() {
        if (!this.watchPromise) {
            this.watchPromise = new Promise((resolve) => {
                this.unlockReload = resolve;
            })
        }
    }
    notify() {
        this.watchPromise = null;
        const resolve = this.unlockReload;
        this.makeWatchPromise();
        resolve();
    }
    get lock() {
        return this.watchPromise;
    }
}

const HTML_RELOAD = new ReloadWatcher();
const CURRENT_LOCATION = new CityLocation(document);
window.CURRENT_LOCATION = CURRENT_LOCATION;
Object.defineProperty(self, "CURRENT_LOCATION_CITY", {
    configurable: false,
    enumerable: false,
    get: () => CURRENT_LOCATION.locationCity
});

// \$([0-9]+)[ \t]+\$([0-9]+)  --> {min:$1, max:$2},

/** @type {{[x:string]:{[drugName:string]:{min:number, max:number,currentHistory:Array<number>, average:number}}}} **/
const DRUG_PRICES = {
    DT: {
        marijuana: { min: 4, max: 345 },
        mushrooms: { min: 62, max: 598 },
        hashish: { min: 231, max: 1024 },
        opium: { min: 269, max: 1004 },
        amphetamines: { min: 442, max: 1208 },
        "grain alcohol": { min: 206, max: 1199 },
        morphine: { min: 780, max: 2623 },
        barbiturates: { min: 2019, max: 6913 },
        heroin: { min: 3970, max: 10518 },
        cocaine: { min: 5209, max: 10063 },
    }
}
window.DRUG_PRICES = DRUG_PRICES;
for (var location in DRUG_PRICES) {
    for (var drug in DRUG_PRICES[location]) {
        const drug_price = DRUG_PRICES[location][drug];
        Object.defineProperty(drug_price, "average", {
            enumerable: true,
            get: drugPriceAverageGetter
        });
    }
}
/**
 * @returns {number}
 */
function drugPriceAverageGetter() {
    var count = 2;
    var sum = this.min + this.max;
    /// contains the list of costs encountered in real deals
    if (typeof this.currentHistory == "number") {
        for (let i = 0, l = this.currentHistory.length; i < l; ++i) {
            const item = this.currentHistory[i];
            count++;
            sum += item;
        }
    }
    return sum / count;
}
function drugLocationMap(source, target) {
    Object.defineProperty(DRUG_PRICES, source, {
        enumerable: true,
        configurable: true,
        get: () => DRUG_PRICES[target]
    });
}
drugLocationMap("Detroit", "DT");
drugLocationMap("CH", "DT");
drugLocationMap("Chicago", "CH");
class CancellationToken {
    constructor() {
        this._cancellationRequested = false;
        /** @type {Array<function:void>} **/
        this.oncancelArray = [];
    }
    get cancellationRequested() {
        return this._cancellationRequested;
    }
    set cancellationRequested(value) {
        if (value !== true) {
            throw new Error("You can only assign true to cancellationRequested. Once cancelled, task cannot be uncancelled.")
        }
        if (this._cancellationRequested == true)
            return;
        this._cancellationRequested = true;
        /// safely execute all oncancel callbacks
        for (let i = 0, l = this.oncancelArray.length; i < l; ++i) {
            const item = this.oncancelArray[i];
            try {
                item();
            }
            catch (e) {
                console.error("Error during oncancel callback!", e);
            }
        }
    }

    throwIfCancelled() {
        if (this._cancellationRequested)
            throw this.cancelError();
    }
    /**
     * @returns {Error} error for cancel action. It is returned even if task is not cancelled.
     */
    cancelError() {
        return CancellationToken.CANCEL_ERROR;
    }
    /**
     * Removes previously added callback. If there are multiple occurences, only the latest is removed.
     * @param {function():void} callback
     */
    removeOncancel(callback) {
        const index = this.oncancelArray.lastIndexOf(callback);
        if (index >= 0) {
            this.oncancelArray.splice(index, 1);
        }

    }
    /**
     * 
     * @param {function():void} callback
     */
    addOncancel(callback) {
        this.oncancelArray.push(callback);
    }
    /**
     * Removes the lastly added oncancel callback. Do this when
     * you finish the task and it's not cancelled
     */
    popOncancel() {
        this.oncancelArray.pop();
    }
    cancel() {
        this.cancellationRequested = true;
    }
}
CancellationToken.none = new CancellationToken();
CancellationToken.CANCEL_ERROR = new Error("Task cancelled.");
window.CancellationToken = CancellationToken;

class CancellationTokenButton extends CancellationToken {
    constructor() {
        super();
    }
    /**
     * Create a new button for cancelling
     * @param {string} buttonText text on button
     * @returns {HTMLButtonElement}
     */
    getButton(buttonText) {
        const button = document.createElement("button");
        button.appendChild(new Text(buttonText));
        const callback = () => {
            button.removeEventListener("click", callback);
            button.parentNode.removeChild(button);
            this.cancel();
        }

        button.addEventListener("click", callback);
        return button;
    }

}



const REGISTERED_ACTIONS = {

}
/**
 * 
 * @param {function} ctor
 * @param {string} name
 */
function registerAction(ctor, name) {
    const registry = {
        ctor: ctor,
        name: name,
        instance: null
    }
    REGISTERED_ACTIONS[name, ctor.name] = registry;
    const nameBig = ctor.name.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();;
    registry.nameBig = nameBig;
    registry.nameBigSpace = registry.nameBig.replace("_", " ");
    registry.nameLocalStorage = "MT_" + registry.nameBig;



    window[nameBig] = registry;

    if (localStorage[registry.nameLocalStorage] == "true") {
        startAction(registry)
    }
    else {
        stopAction(registry)
    }
}


function startAction(actionRegistry) {
    localStorage[actionRegistry.nameLocalStorage] = "true";
    var cancelDrugs = new CancellationTokenButton();

    actionRegistry.cancellationToken = cancelDrugs;

    var button = cancelDrugs.getButton("STOP " + actionRegistry.nameBigSpace);
    button.style.borderWidth = "1px";
    button.style.marginBottom = "2px";
    document.querySelector("#ui-name div.ui-extra").appendChild(button);

    cancelDrugs.addOncancel(function () {
        stopAction(actionRegistry);
    });

    actionRegistry.instance = new actionRegistry.ctor(document);
    actionRegistry.instance.doThis(cancelDrugs);
}
function stopAction(actionRegistry) {
    localStorage[actionRegistry.nameLocalStorage] = "true";

    if (actionRegistry.cancellationToken) {
        actionRegistry.cancellationToken.cancellationRequested = true;
    }
    actionRegistry.cancellationToken = null;
    actionRegistry.instance = null;


    var button = document.createElement("button");
    button.appendChild(new Text("START " + actionRegistry.nameBigSpace));
    button.style.borderWidth = "1px";
    button.style.marginBottom = "2px";
    button.addEventListener("click", function () {
        this.parentNode.removeChild(this);
        startAction(actionRegistry);
    });
    document.querySelector("#ui-name div.ui-extra").appendChild(button);
}

/**
 * **************************************
 *          JAIL BREAKING
 * **************************************
 */
class JailBreaking extends MafiaAction {
    constructor(document) {
        super(document);

    }
    /**
     * @returns {HTMLTableElement}
     */
    getElement() {
        return document.querySelector("#jail_table");
    }
    async doThis(cancellationToken = CancellationToken.none) {
        /// if jail is empty
        var msg;
        var messages = getMessages();
        while (msg = messages.findMessage(Message.TYPE.JAIL_EMPTY)) {
            console.log("[JAIL] Jail is emty, waiting 60 seconds.");
            await Promise.timeout(60 * 1000, cancellationToken);
            console.log("[JAIL] Reloading jail");

            clickLink("jail.php");
            await HTML_RELOAD.lock;
            this.updateHTMLData();
            messages = getMessages();
        }
        messages = await this.waitForJailEnd(messages, cancellationToken);


        if (!this.mainElement) {
            this.updateHTMLData();
            if (!this.mainElement) {
                console.error("[JAIL] Jail breaking terminated because main table not found.");
                return;
            }

        }

        /// Load all links
        /** @type {Array<HTMLAnchorElement>} **/
        const links = Array.prototype.filter.call(
            this.mainElement.querySelectorAll("a.button"),
            this.linkFilter
        );
        links.sort((a, b) => {
            return a.GUARDS > b.GUARDS;
        });
        console.log("[JAIL] Click: ", links[0], links[0].getAttribute("data-guards"));
        links[0].click();
        console.log("[JAIL] waiting for reload!");
        await HTML_RELOAD.lock;
        console.log("[JAIL] Reloaded, checking messages.")
        ///@todo
        var messages = getMessages();
        console.log(messages, messages.findMessage(Message.TYPE.IN_JAIL));

        messages = await this.waitForJailEnd(messages, cancellationToken);

        console.log("[JAIL] Messages ok, going back to jail.");
        clickLink("jail.php");
        await HTML_RELOAD.lock;

        /// check messages again
        messages = getMessages();

        console.log("[JAIL] Jail loaded, next click in", TIMER_INFO.J.remaining);
        await Promise.timeout(TIMER_INFO.J.remaining * 1000, cancellationToken);
        this.updateHTMLData();
        await this.doThis(cancellationToken);

    }
    async waitForJailEnd(messages, cancellationToken = CancellationToken.none) {
        var message;
        while (message = messages.findMessage(Message.TYPE.IN_JAIL)) {
            console.warn("[JAIL] You're in jail now. Waiting 15 seconds before reloading.");
            await Promise.timeout(15 * 1000, cancellationToken);
            clickLink("jail.php");
            await HTML_RELOAD.lock;
            this.updateHTMLData();
            messages = getMessages();
        }
        return messages;
    }
    updateHTMLData() {
        this.mainElement = this.getElement();
    }
    /**
     * 
     * @param {HTMLAnchorElement} link
     */
    linkFilter(link) {
        try {
            link.GUARDS = 1 * link.parentNode.parentNode.cells[0].innerText;
        }
        catch (e) {
            link.GUARDS = Infinity;
        }
        link.setAttribute("data-guards", link.GUARDS);

        const text = link.innerText.toLowerCase();
        if (text.indexOf("dont") != -1) {
            return false;
        }
        if (text.indexOf("bust out") == -1) {
            console.log("Invalid button", link);
            return false;
        }

        return true;
    }
}
registerAction(JailBreaking);