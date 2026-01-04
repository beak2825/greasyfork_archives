;
(function() {
    if (typeof window.ImageEvent === "function") return false;

    function ImageEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    ImageEvent.prototype = window.Event.prototype;

    window.ImageEvent = ImageEvent;
})();
;
(function() {
    function imgEventTrigger(event) {
        var newImageEvent = new ImageEvent(event, { detail: this });
        window.dispatchEvent(newImageEvent);
    }

    var oldImg = window.Image;

    function newIMG() {
        var realImg = new oldImg();
        realImg.addEventListener('abort', function() { imgEventTrigger.call(this, 'imgAbort'); }, false);
        realImg.addEventListener('error', function() { imgEventTrigger.call(this, 'imgError'); }, false);
        realImg.addEventListener('load', function() { imgEventTrigger.call(this, 'imgLoad'); }, false);


        return realImg;
    }

    window.Image = newIMG;
})();