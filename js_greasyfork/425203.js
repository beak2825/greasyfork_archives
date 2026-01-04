// ==UserScript==a
// @name         </> Kurt & Java FPS Arttırıcı
// @namespace    http://tampermonkey.net/
// @version      17.9
// @description  Kurt & Java
// @icon         https://cdn.discordapp.com/emojis/822554630705643520.png?v=1
// @author       Kurt
// @match        http://zombs.io/
// @match        http://optimized-zombs.glitch.me/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/425203/%3C%3E%20Kurt%20%20Java%20FPS%20Artt%C4%B1r%C4%B1c%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/425203/%3C%3E%20Kurt%20%20Java%20FPS%20Artt%C4%B1r%C4%B1c%C4%B1.meta.js
// ==/UserScript==

    // Linki Buraya Giriyorsunuz
(() => {
    const backgroundImageURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARwAAACxCAMAAAAh3/JWAAAAA1BMVEUAAACnej3aAAAASElEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIALA8UNAAFusnLHAAAAAElFTkSuQmCC";

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