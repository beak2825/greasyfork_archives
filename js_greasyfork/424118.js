// ==UserScript==a
// @name         </> Kurt & Java Arka Plan Değiştirilebilir
// @namespace    http://tampermonkey.net/
// @version      17.9
// @description  Kurt & Java
// @author       Kurt
// @match        zombs.io
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424118/%3C%3E%20Kurt%20%20Java%20Arka%20Plan%20De%C4%9Fi%C5%9Ftirilebilir.user.js
// @updateURL https://update.greasyfork.org/scripts/424118/%3C%3E%20Kurt%20%20Java%20Arka%20Plan%20De%C4%9Fi%C5%9Ftirilebilir.meta.js
// ==/UserScript==

    // Linki Buraya Giriyorsunuz
(() => {
    const backgroundImageURL = "https://media.discordapp.net/attachments/812262125409271808/825842956623282216/20210328_175354.jpg?width=960&height=579";

    const background = {
        ready: false,
        image: new Image()
    };

    background.image.src = backgroundImageURL;
    background.image.onload = function () {
        background.ready = true;
    };

    // Yerel İşlevleri Edinin
    let _fillText = CanvasRenderingContext2D.prototype.fillText;
    let _fillRect = CanvasRenderingContext2D.prototype.fillRect;
    let _alert = window.alert;
    let _toString = Function.prototype.toString;

    // Onlar İçin Ayrı Çengelli Sürümler Oluşturun
    let fillText = function () {
        if (arguments[0] == "Bir Reklam Engelleyici Kullanıyorsunuz, Lütfen Oyunu Desteklemek İçin Onu Devre Dışı Bırakmayı Düşünün") {
            arguments[0] = "";
        }
        return _fillText.apply(this, arguments);
    };
    let fillRect = function () {
        if (arguments[2] > 1000 && arguments[3] > 1000 && background.ready){
            this.fillStyle = "rgba(0,0,0,0)";
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.drawImage(background.image, 0, 0, this.canvas.width, this.canvas.height);
        }
        return _fillRect.apply(this, arguments);
    };
    let alert = function () {
        return _alert.call(this, "Uzantı Tespiti Tetiklendi. Lütfen Yenileyin.");
    };
    let toString = function () {
        if (this == CanvasRenderingContext2D.prototype.fillText) return _toString.call(_fillText);
        if (this == CanvasRenderingContext2D.prototype.fillRect) return _toString.call(_fillRect);
        if (this == window.alert) return _toString.call(_alert);
        if (this == Function.prototype.toString) return _toString.call(_toString);
        return _toString.call(this);
    };

    // Varsayılan İşlevlerin Prototiplerini Geçersiz Kılın
    fillText.proto = _fillText.prototype;
    fillText.prototype = _fillText.prototype;
    fillRect.proto = _fillRect.prototype;
    fillRect.prototype = _fillRect.prototype;
    toString.proto = _toString.prototype;
    toString.prototype = _toString.prototype;
    // Kancaları Ayarlayın
    CanvasRenderingContext2D.prototype.fillText = fillText;
    CanvasRenderingContext2D.prototype.fillRect = fillRect;
    window.alert = alert;
    Function.prototype.toString = toString;

    document.currentScript && document.currentScript.remove();
})();