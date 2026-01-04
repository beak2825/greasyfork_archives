// ==UserScript==
// @name        Auto wacker
// @namespace   util
// @description Automatically WACK!s in a set interval
// @include     https://mafiareturns.com/war/wack.php*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35862/Auto%20wacker.user.js
// @updateURL https://update.greasyfork.org/scripts/35862/Auto%20wacker.meta.js
// ==/UserScript==

/**
 * AUTO WACK
 */
class Wacking {
    constructor() {
        this.wackStartTime = -1;
        this._wackTimeout = 10000;

        try {
            var savedTimeout = localStorage["MT_WACK_TIMEOUT"];
            if (typeof savedTimeout != "undefined") {
                savedTimeout = 1 * savedTimeout;
                if (!Number.isNaN(savedTimeout))
                    this._wackTimeout = savedTimeout;
            }
        }
        catch(e) {console.warn("[WACK] Local storage not available.",e);}
        this.cancelAnimationFrameId = -1;

        this.changeTimeout = document.createElement("input");
        this.changeTimeout.type = "number";
        this.changeTimeout.value = this._wackTimeout;
        this.changeTimeout.addEventListener("input", () => {
            this.wackTimeout = 1*this.changeTimeout.value;
        });
        this.changeTimeout.style.width = "10ch";

        this.startStopButton = document.createElement("button");
        this.startStopButton.type = "button";
        this.startStopText = new Text("");
        this.startStopButton.appendChild(this.startStopText);
        this.startStopButton.style.fontWeight = "bold";
        this.startStopButton.style.border = "1px solid black";
        this.startStopButton.style.marginLeft = "2ch";
        this.startStopButton.style.backgroundImage = "none";
        this.startStopButton.addEventListener("click", () => {
            this.toggle();
        });

        this.timeoutId = -1;

        this.controlsDiv = document.createElement("div");
        this.controlsDiv.className = "wbox";

        const title = document.createElement("div");
        title.appendChild(new Text("Auto wacking:"));
        title.className = "title";

        this.controlsDiv.appendChild(title);
        this.controlsDiv.appendChild(new Text("Timeout: "));
        this.controlsDiv.appendChild(this.changeTimeout);
        this.controlsDiv.appendChild(this.startStopButton);

        /** @type {HTMLButtonElement} **/
        this.wackButton = document.querySelector("div.wbutton .moving_button");

        const safeties = document.querySelectorAll(".wbox .ui-toggle-switch label");
        this.safetyOn = safeties[1];
        this.safetyOff = safeties[0];

        const wackDiv = this.safetyOff.parentElement.parentElement.parentElement;
        wackDiv.insertBefore(this.controlsDiv, this.safetyOff.parentElement.parentElement);
        
        this.wackNameInput = document.querySelector("#vname");
        this.wackNameInput.addEventListener("input",()=>{
            this.wackTargetUpdated();
        });
        this.wackTargetUpdated();
    }
    wackTargetUpdated() {
        const emptyWackName = this.wackNameInput.value=="";
        this.startStopButton.disabled = emptyWackName;

        if (this.timeoutId >= 0 && emptyWackName) {
            this.stop();    
        }
        if(emptyWackName) {
            this.startStopButton.style.backgroundColor = "#AAA";
            this.startStopButton.style.color = "#EEE";
        }
        else {
            this.timeoutId = this.timeoutId;
        }
    }
    toggle() {
        if (this.timeoutId >= 0 || this.paused) {
            this.stop();
        }
        else {
            this.start();
        }
    }
    start(isRecursion) {
        if(this._timeoutId!=-1 && !isRecursion)
            return;
    
        this.wackStartTime = this.now;
        document.querySelectorAll(".wbox .ui-toggle-switch label")[1].click();
        this.timeoutId = setTimeout(() => {
            this.WACK(true);
            //this.start();
        }, this.wackTimeout);
        if (this.cancelAnimationFrameId == -1)
            this.startRenderingState();
    }
    stop() {
        this.clearTimeout();
        cancelAnimationFrame(this.cancelAnimationFrameId);
        this.cancelAnimationFrameId = -1;
        document.querySelectorAll(".wbox .ui-toggle-switch label")[0].click();
    }
    clearTimeout() {
        if (this._timeoutId >= 0) {
            clearTimeout(this._timeoutId);
        }
        this.timeoutId = -1;
    }
    pause() {
        throw new Error("This does not work yet!");
        this.paused = true;
        this.clearTimeout();
        this.tmpRemaining = this.remainingTime;
    }
    get remainingTime() {
        return this.wackStartTime + this.wackTimeout-this.now;
    }
    startRenderingState(once) {
        if (this._timeoutId >= 0 || once===true) {
            var remaining = this.remainingTime;
            //console.log("Remaining time: ", remaining);
            if (remaining < 0)
                remaining = 0;
            
            const percentage = remaining / this.wackTimeout;
            const percentage100 = Math.round(percentage * 100);
            const percentageLarger = Math.min(100, Math.round(percentage * 105));
            const color = this.getGradientColor(percentage);
            this.wackButton.style.backgroundImage = "linear-gradient(to left, "
                + color + " 0%,"
                + color + " " + percentage100 + "%,"
                + "transparent " + percentageLarger + "%,"
                + "transparent 100%)";

            if(once!=true)
                this.cancelAnimationFrameId = requestAnimationFrame(() => { this.startRenderingState(); });
        }
    }
    getGradientColor(percentage) {
        if (this.paused)
            return "blue";
        else {
            return "rgb(" + Math.round(255-255 * percentage) + ","+ Math.round(255*percentage)+",0)";
        }
    }
    WACK(shouldContinue = true) {
        document.querySelectorAll(".wbox .ui-toggle-switch label")[1].click();
        setTimeout(() => {
            if(this._timeoutId>=0) {
                this.wackButton.click();
                if (shouldContinue && this._timeoutId>=0) {
                    clearTimeout(this._timeoutId);
                    this._timeoutId = setTimeout(() => { if(this._timeoutId>=0)this.start(true); }, 200);
                }
            }

        },10);
    }
    get now() {
        return new Date().getTime();
    }
    get wackTimeout() {
        return this._wackTimeout;
    }
    set wackTimeout(value) {
        this._wackTimeout = value;
        localStorage["MT_WACK_TIMEOUT"] = value;
    }
    /** @type {number} **/
    get timeoutId() {
        return this._timeoutId;
    }
    /** @type {number} **/
    set timeoutId(value) {
        this._timeoutId = value;
        if (value >= 0 || this.paused) {
            this.startStopButton.style.backgroundColor = "red";
            this.startStopButton.style.color = "yellow";
            this.startStopText.data = "Stop WACK!ing";
        }
        else {
            this.startStopButton.style.backgroundColor = "green";
            this.startStopButton.style.color = "white";
            this.startStopText.data = "Start WACK!ing";
            if(this.wackButton)
                this.wackButton.style.backgroundImage = "";
        }
    }

}
window.Wacking = Wacking;
if (window.location.href.indexOf("wack.php") != -1) {
    window.addEventListener("load", () => {
        new Wacking();
    })
}