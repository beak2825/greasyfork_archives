// ==UserScript==
// @name         Zombia.io Mobile Controls (w/ joysticks)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  -
// @author       rdm
// @match        http://zombia.io
// @icon         http://zombia.io/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/491289/Zombiaio%20Mobile%20Controls%20%28w%20joysticks%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491289/Zombiaio%20Mobile%20Controls%20%28w%20joysticks%29.meta.js
// ==/UserScript==

let StickStatus={xPosition:0,yPosition:0,x:0,y:0,cardinalDirection:"C"};var JoyStick=function(t,e,i){var o=void 0===(e=e||{}).title?"joystick":e.title,n=void 0===e.width?0:e.width,a=void 0===e.height?0:e.height,r=void 0===e.internalFillColor?"#00AA00":e.internalFillColor,c=void 0===e.internalLineWidth?2:e.internalLineWidth,s=void 0===e.internalStrokeColor?"#003300":e.internalStrokeColor,d=void 0===e.externalLineWidth?2:e.externalLineWidth,u=void 0===e.externalStrokeColor?"#008000":e.externalStrokeColor,h=void 0===e.autoReturnToCenter||e.autoReturnToCenter;i=i||function(t){};var S=document.getElementById(t);S.style.touchAction="none";var f=document.createElement("canvas");f.id=o,0===n&&(n=S.clientWidth),0===a&&(a=S.clientHeight),f.width=n,f.height=a,S.appendChild(f);var l=f.getContext("2d"),k=0,g=2*Math.PI,x=(f.width-(f.width/2+10))/2,v=x+5,P=x+30,m=f.width/2,C=f.height/2,p=f.width/10,y=-1*p,w=f.height/10,L=-1*w,F=m,E=C;function W(){l.beginPath(),l.arc(m,C,P,0,g,!1),l.lineWidth=d,l.strokeStyle=u,l.stroke()}function T(){l.beginPath(),F<x&&(F=v),F+x>f.width&&(F=f.width-v),E<x&&(E=v),E+x>f.height&&(E=f.height-v),l.arc(F,E,x,0,g,!1);var t=l.createRadialGradient(m,C,5,m,C,200);t.addColorStop(0,r),t.addColorStop(1,s),l.fillStyle=t,l.fill(),l.lineWidth=c,l.strokeStyle=s,l.stroke()}function D(){let t="",e=F-m,i=E-C;return i>=L&&i<=w&&(t="C"),i<L&&(t="N"),i>w&&(t="S"),e<y&&("C"===t?t="W":t+="W"),e>p&&("C"===t?t="E":t+="E"),t}"ontouchstart"in document.documentElement?(f.addEventListener("touchstart",function(t){k=1},!1),document.addEventListener("touchmove",function(t){1===k&&t.targetTouches[0].target===f&&(F=t.targetTouches[0].pageX,E=t.targetTouches[0].pageY,"BODY"===f.offsetParent.tagName.toUpperCase()?(F-=f.offsetLeft,E-=f.offsetTop):(F-=f.offsetParent.offsetLeft,E-=f.offsetParent.offsetTop),l.clearRect(0,0,f.width,f.height),W(),T(),StickStatus.xPosition=F,StickStatus.yPosition=E,StickStatus.x=((F-m)/v*100).toFixed(),StickStatus.y=((E-C)/v*100*-1).toFixed(),StickStatus.cardinalDirection=D(),i(StickStatus))},!1),document.addEventListener("touchend",function(t){k=0,h&&(F=m,E=C);l.clearRect(0,0,f.width,f.height),W(),T(),StickStatus.xPosition=F,StickStatus.yPosition=E,StickStatus.x=((F-m)/v*100).toFixed(),StickStatus.y=((E-C)/v*100*-1).toFixed(),StickStatus.cardinalDirection=D(),i(StickStatus)},!1)):(f.addEventListener("mousedown",function(t){k=1},!1),document.addEventListener("mousemove",function(t){1===k&&(F=t.pageX,E=t.pageY,"BODY"===f.offsetParent.tagName.toUpperCase()?(F-=f.offsetLeft,E-=f.offsetTop):(F-=f.offsetParent.offsetLeft,E-=f.offsetParent.offsetTop),l.clearRect(0,0,f.width,f.height),W(),T(),StickStatus.xPosition=F,StickStatus.yPosition=E,StickStatus.x=((F-m)/v*100).toFixed(),StickStatus.y=((E-C)/v*100*-1).toFixed(),StickStatus.cardinalDirection=D(),i(StickStatus))},!1),document.addEventListener("mouseup",function(t){k=0,h&&(F=m,E=C);l.clearRect(0,0,f.width,f.height),W(),T(),StickStatus.xPosition=F,StickStatus.yPosition=E,StickStatus.x=((F-m)/v*100).toFixed(),StickStatus.y=((E-C)/v*100*-1).toFixed(),StickStatus.cardinalDirection=D(),i(StickStatus)},!1)),W(),T(),this.GetWidth=function(){return f.width},this.GetHeight=function(){return f.height},this.GetPosX=function(){return F},this.GetPosY=function(){return E},this.GetX=function(){return((F-m)/v*100).toFixed()},this.GetY=function(){return((E-C)/v*100*-1).toFixed()},this.GetDir=function(){return D()}};

function main(game) {

    const css = `
    #hud-movement-joy {
        position: fixed;
        left: 10vw;
        bottom: 5vh;
        opacity: 0.5;
    }
    #hud-yaw-joy {
        position: fixed;
        right: 10vw;
        bottom: 5vh;
        opacity: 0.5;
    }
    #hud-bottom > div.hud-resources {
        width: 120px;
    }
    #hud-bottom > div.hud-day-night-ticker {
        bottom: 140px;
        right: -190px;
    }
    #hud-bottom > div.hud-party-member-indicator {
        display: none;
    }
    .hud-resources .hud-resources-wood::before {
        content: "W";
    }
    .hud-resources .hud-resources-stone::before {
        content: "S";
    }
    .hud-resources .hud-resources-gold::before {
        content: "G";
    }
    .hud-resources .hud-resources-tokens::before {
        content: "T";
    }
    `;

    const styles = document.createElement("style");
    styles.type = "text/css";
    styles.appendChild(document.createTextNode(css));
    document.head.appendChild(styles);

    function getClass(DOMClass) {
        return document.getElementsByClassName(DOMClass);
    };

    function getId(DOMId) {
        return document.getElementById(DOMId);
    };

    getId("hud-bottom").insertAdjacentHTML("afterbegin", `
        <div id="hud-movement-joy" style="width: 200px;height: 200px;"></div>
        <div id="hud-yaw-joy" style="width: 200px;height: 200px;"></div>
    `);

    function predictDirection(d) {
        let direction = "";
        switch(d) {
            case "N":
                direction = "up";
                break;
            case "S":
                direction = "down";
                break;
            case "W":
                direction = "left";
                break;
            case "E":
                direction = "right";
                break;
        };
        return direction;
    };

    function handleInput({cardinalDirection: d}) {
        const input = {left: 0, right: 0, up: 0, down: 0};
        if (d != "C") {
            input[predictDirection(d[0])] = 1;
            d[1] && (input[predictDirection(d[1])] = 1);
        };
        game.network.sendInput(input);
    };

    const movementJoy = new JoyStick('hud-movement-joy', {
        internalFillColor: "#111",
        internalStrokeColor: "#000",
        externalStrokeColor: "#000"
    }, handleInput);

    function angleTo(_0x632631, _0x1e0428) {
        return (0xb4 * Math.atan2(_0x1e0428.y - _0x632631.y, _0x1e0428.x - _0x632631.x) / Math.PI + 0x5a + 360) % 360;
    }

    function toYaw(_0x18f78a, _0x5d5b9e, width, height) {
        return Math.round(angleTo({
            'x': width / 2,
            'y': height / 2
        }, {
            'x': _0x18f78a,
            'y': _0x5d5b9e
        })) % 360;
    };

    function handleYaw(stickData) {
        const {xPosition: x, yPosition: y, cardinalDirection: d} = stickData;
        const yaw = toYaw(x, y, 200, 200);
        const _this = game.network.inputPacketManager;
        if (d != "C") {
            _this.lastSentYaw = yaw;
            _this.sendInputPacket({
                mouseMoved: yaw,
                mouseDown: true,
            });
        } else {
            _this.sendInputPacket({
                mouseMoved: _this.lastSentYaw,
                mouseDown: false,
            });
        };
        console.log(stickData);
    };

    const yawJoy = new JoyStick('hud-yaw-joy', {
        internalFillColor: "#111",
        internalStrokeColor: "#000",
        externalStrokeColor: "#000",
        title: "joystick2",
    }, handleYaw);
};

if (window.game) main(window.game);
else {
    Object.defineProperty(Object.prototype, "ui", {
        get() {
            if (!window.game) main(window.game = this);
            return this._ui;
        },
        set(val) { this._ui = val; },
        configurable: true
    });
};