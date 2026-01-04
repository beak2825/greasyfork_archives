// ==UserScript==
// @name         X Image Zoom
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds zoom functionality to images on X (formerly Twitter)
// @author       Your Name
// @match        https://x.com/*
// @match        https://www.x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513370/X%20Image%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/513370/X%20Image%20Zoom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const zoom_class = 'zoom-element';
    const zoom_svg_path = 'M21 19.9l-4.7-4.7c1.1-1.3 1.7-2.9 1.7-4.7 0-4.2-3.4-7.5-7.5-7.5-4.1 0-7.5 3.3-7.5 7.5 0 4.1 3.4 7.5 7.5 7.5 1.8 0 3.5-.6 4.7-1.7l4.7 4.7c.3.3 .8.3 1.1 0S21.3 20.2 21 19.9zM4.5 10.4c0-3.3 2.7-6 6-6 3.3 0 6 2.7 6 6 0 3.3-2.7 6-6 6C7.2 16.4 4.5 13.7 4.5 10.4z';

    function Zoom(width, height) {
        this.maxWidth = width;
        this.maxHeight = height;
        this.resetState();
    }

    Zoom.prototype.setXTranslation = function (translation) {
        this.xTranslation = Math.min(Math.max(-50, translation), 50);
    }

    Zoom.prototype.setYTranslation = function (translation) {
        this.yTranslation = Math.min(Math.max(-50, translation), 50);
    }

    Zoom.prototype.setScale = function (scale) {
        if (scale < 1) {
            this.scale = 1;
        } else if (scale > 50) {
            this.scale = 50;
        } else {
            this.scale = scale;
        }
        this.translate(this._lastPercentX, this._lastPercentY);
    }

    Zoom.prototype.resetState = function () {
        this.scale = 1;
        this.xTranslation = 0;
        this.yTranslation = 0;
        this._lastPercentX = 0;
        this._lastPercentY = 0;
    }

    Zoom.prototype.translate = function (percentX, percentY) {
        this._lastPercentX = percentX;
        this._lastPercentY = percentY;

        var height, width;
        var heightRatio = this.maxHeight / window.innerHeight;
        var widthRatio = this.maxWidth / window.innerWidth;
        if (heightRatio > widthRatio) {
            height = window.innerHeight;
            width = this.maxWidth * height / this.maxHeight;
        } else {
            width = window.innerWidth;
            height = this.maxHeight * width / this.maxWidth;
        }

        if (this.maxHeight < height && this.maxWidth < width) {
            width = this.maxWidth;
            height = this.maxHeight;
        }

        width *= this.scale;
        height *= this.scale;

        percentX = this.mapPercent(percentX);
        percentY = this.mapPercent(percentY);

        if (width > window.innerWidth) {
            var overflow = width - window.innerWidth;
            var scroll = percentX * overflow / 200;
            var scrollPercent = scroll * 100 / width;
            this.setXTranslation(-scrollPercent);
        } else {
            this.setXTranslation(0);
        }

        if (height > window.innerHeight) {
            var overflow = height - window.innerHeight;
            var scroll = percentY * overflow / 200;
            var scrollPercent = scroll * 100 / height;
            this.setYTranslation(-scrollPercent);
        } else {
            this.setYTranslation(0);
        }
    }

    Zoom.prototype.mapPercent = function (percent) {
        percent -= 50;
        var sign = 1;
        if (percent < 0) {
            sign = -1;
        }
        percent = Math.abs(percent);
        percent = Math.min(30, percent);
        percent = percent * 100 / 30;

        return sign * percent;
    }

    function Controller(image, zoom) {
        if (image && zoom) {
            this.init(image, zoom);
        }
    }

    Controller.prototype.init = function (image, zoom) {
        this.zoom = zoom;
        this.image = image;
        this._translationListeners = [];
        this._scaleListeners = [];
        this._createScrollListener();
        this._createMouseListener();
        this._createZoomListener();
        this._createTranslateListener();
    }

    Controller.prototype._createZoomListener = function () {
        this.addScaleListener((scale) => {
            this.image.style.transform = `scale(${scale}) translate(${this.zoom.xTranslation}%, ${this.zoom.yTranslation}%)`;
        });
    }

    Controller.prototype._createTranslateListener = function () {
        this.addTranslationListener((xTranslation, yTranslation) => {
            this.image.style.transform = `scale(${this.zoom.scale}) translate(${xTranslation}%, ${yTranslation}%)`;
        });
    }

    Controller.prototype._createScrollListener = function () {
        if (this.wheelListenerFunction) {
            this.image.removeEventListener('wheel', this.wheelListenerFunction);
        }
        this.wheelListenerFunction = (event) => {
            if (this.image.matches('.zoomed *')) {
                if (event.deltaY < 0) {
                    this.zoomIn();
                } else if (event.deltaY > 0) {
                    this.zoomOut();
                }
                return false;
            } else {
                if (event.deltaY < 0) {
                    this.resetZoom();
                    this.toggleZoom();
                }
            }
        }

        this.image.addEventListener('wheel', this.wheelListenerFunction, false);
    }

    Controller.prototype._createMouseListener = function () {
        this.image.addEventListener('mousemove', (event) => {
            if (this.image.matches('.zoomed *')) {
                var x = event.clientX;
                var y = event.clientY;
                var w = window.innerWidth;
                var h = window.innerHeight;
                this.translate((100 * x) / w, (100 * y) / h);
            }
        }, false);
    }

    Controller.prototype.addScaleListener = function (listener) {
        this._scaleListeners.push(listener);
    }

    Controller.prototype.addTranslationListener = function (listener) {
        this._translationListeners.push(listener);
    }

    Controller.prototype._notifyScaleListeners = function () {
        if (this._scaleListeners) {
            this._scaleListeners.forEach((listener) => {
                listener(this.zoom.scale);
            });
        }
    }

    Controller.prototype._notifyTranslationListeners = function () {
        if (this._translationListeners) {
            this._translationListeners.forEach((listener) => {
                listener(this.zoom.xTranslation, this.zoom.yTranslation);
            });
        }
    }

    Controller.prototype.zoomIn = function () {
        this.zoom.setScale(this.zoom.scale * 1.2);
        this._notifyScaleListeners();
    }

    Controller.prototype.zoomOut = function () {
        if (this.zoom.scale !== 1) {
            this.zoom.setScale(this.zoom.scale / 1.2);
            this._notifyScaleListeners();
        } else {
            this.resetZoom();
            this.toggleZoom();
        }
    }

    Controller.prototype.resetZoom = function () {
        this.zoom.resetState();
        this._notifyScaleListeners();
        this._notifyTranslationListeners();
    }

    Controller.prototype.translate = function (percentX, percentY) {
        this.zoom.translate(percentX, percentY);
        this._notifyTranslationListeners();
    }

    Controller.prototype.toggleZoom = function (image) {
        if (image == undefined) {
            var imageSelector = 'div[aria-labelledby="modal-header"] img[alt]';
            var images = document.querySelectorAll(imageSelector);
            if (images == null) {
                return;
            }
            var image = null;
            images.forEach(im => {
                if (isInViewport(im)) {
                    image = im;
                }
            });
            if (image == null) {
                return;
            }
        }
        var modalbox = document.querySelector('[aria-labelledby="modal-header"]');
        var isZoomed = modalbox.classList.toggle('zoomed');

        if (!isZoomed && this.image) {
            this.image.style.transform = "";
            this.resetZoom();
        } else {
            var zoom = new Zoom(image.naturalWidth, image.naturalHeight);
            this.init(image, zoom);
        }
    };

    var isInViewport = function (elem) {
        var bounding = elem.getBoundingClientRect();
        var notVisible = bounding.bottom <= 0 ||
            bounding.right <= 0 ||
            bounding.top >= (window.innerHeight || document.documentElement.clientHeight) ||
            bounding.left >= (window.innerWidth || document.documentElement.clientWidth);
        return !notVisible;
    };

    function ZoomButton(commentButton) {
        this._createElements(commentButton);
        this.node.addEventListener('click', (event) => {
            if (this._clickListeners) {
                this._notifyClickListeners();
                event.stopPropagation();
            }
        });
    }

    ZoomButton.prototype.addClickListener = function (listener) {
        if (!this._clickListeners) {
            this._clickListeners = [];
        }
        this._clickListeners.push(listener);
    }

    ZoomButton.prototype._notifyClickListeners = function () {
        if (this._clickListeners) {
            this._clickListeners.forEach((listener) => {
                listener();
            });
        }
    }

    ZoomButton.prototype._createElements = function (commentButton) {
        var zoomNode = commentButton.cloneNode(true);
        zoomNode.classList.add(zoom_class);
        if (zoomNode.querySelector('div>div>div+div') != null) {
            zoomNode.querySelector('div>div>div+div').remove();
        }
        var zoomOutline = zoomNode.querySelector('div>div>div>div>div');
        zoomOutline.id = zoom_class + "-hover";
        zoomOutline.className = "";
        zoomNode.querySelector('div>div>div>svg path').setAttribute("d", zoom_svg_path);
        this.node = zoomNode;
    }

    var controller = new Controller();

    var galleryObserver = new MutationObserver(function (mutations) {
        var shareSelector = '[aria-labelledby="modal-header"]>div>div>div>div+div>div>div>div:last-child';
        var commentSelector = '[aria-labelledby="modal-header"]>div>div>div>div+div>div>div>div:first-child';
        var imageSelector = 'div[aria-labelledby="modal-header"] img[alt]';
        var shareButton = document.querySelector(shareSelector);
        var commentButton = document.querySelector(commentSelector);
        var zoomButton = document.querySelector(`.${zoom_class}`);

        mutations.forEach(function (mutation) {
            var nodes = Array.from(mutation.addedNodes);
            for (var node of nodes) {
                if (shareButton == null && node.matches && node.matches(shareSelector)) {
                    shareButton = node;
                }
                if (commentButton == null && node.matches && node.matches(commentSelector)) {
                    commentButton = node;
                }
                if (node.querySelector('img[alt]') != null || node.matches && node.matches(imageSelector)) {
                    var image = (node.querySelector('img[alt]') || node);

                    if (controller.zoom != null) {
                        controller.resetZoom();
                    }
                    if (!image.getAttribute("clickable")) {
                        image.addEventListener('click', (event) => { controller.toggleZoom() });
                        image.addEventListener('wheel', (event) => { controller.toggleZoom() }, { once: true });
                        image.setAttribute("clickable", true);
                    }
                }
            }
        });

        if (zoomButton != null) {
            return;
        }
        if (commentButton != null && shareButton != null) {
            zoomButton = new ZoomButton(commentButton);
            zoomButton.addClickListener(() => { controller.toggleZoom() });
        }
    });

    var reactConfig = { subtree: true, childList: true };
    var galleryConfig = { subtree: true, childList: true, characterData: false };
    var reactTarget = document.querySelector('#react-root');
    var galleryTarget = null;

    var reactObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                var modalWindowHolder = document.querySelector('#react-root>div>div>h2+div');
                var pictureHolder = document.querySelector('#react-root div[aria-hidden] main');
                if (modalWindowHolder == null && pictureHolder != null) {
                    //modalWindowHolder = pictureHolder.parentNode;
                }
                if (modalWindowHolder != null && galleryTarget == null) {
                    galleryTarget = modalWindowHolder;
                    galleryObserver.observe(modalWindowHolder, galleryConfig);
                    reactObserver.disconnect();
                }
            }
        });
    });

    reactObserver.observe(reactTarget, reactConfig);

    function logKey(e) {
        if (document.querySelector('.zoomed') != null) {
            if (e.code == 'ArrowLeft' || e.code == 'ArrowRight') {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }
    }

    document.addEventListener('keydown', logKey);
})();
