// ==UserScript==
// @name         触摸屏视频优化
// @namespace    https://github.com/HeroChan0330
// @version      2.23.3
// @description  触摸屏视频播放手势支持，上下滑调整音量，左右滑调整进度
// @author       AA
// @match        https://*/*
// @match        http://*/*
// @match        ftp://*/*
// @grant        GM_addStyle
// @grant        GM_setValue  
// @grant        GM_getValue  
// @downloadURL https://update.greasyfork.org/scripts/491511/%E8%A7%A6%E6%91%B8%E5%B1%8F%E8%A7%86%E9%A2%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/491511/%E8%A7%A6%E6%91%B8%E5%B1%8F%E8%A7%86%E9%A2%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

TouchGesture.VideoGesture.prototype.onTouchMove = function(e) {
    var videoElement = this._videoElement;
    if (this.startTouchFingers == 1) {
        var touchPt = e.touches[0];
        var delX = touchPt.clientX - this.touchDownPt.clientX;
        var delY = touchPt.clientY - this.touchDownPt.clientY;

        if (this.sweepDir == 0) {
            var radius = Math.sqrt(delX * delX + delY * delY);
            var w = videoElement.offsetWidth,
                h = videoElement.offsetHeight;
            var judge = Math.sqrt(w * w + h * h) / 30;
            if (radius > judge) {
                if (Math.abs(delX) > Math.abs(delY)) {
                    if (delX > 0)
                        this.sweepDir = 4;
                    else
                        this.sweepDir = 3;
                } else {
                    if (delY > 0)
                        this.sweepDir = 2;
                    else
                        this.sweepDir = 1;

                }

                this.startTouchVideoTime = Math.floor(videoElement.currentTime);
                this.startTouchVideoVolume = videoElement.volume;
                this.startTouchBrightness = this.videoBrightness;
                this.touchStartPt = touchPt;
            }
        } else if (this._options.progress == true && (this.sweepDir == 3 || this.sweepDir == 4)) {
            delX = touchPt.clientX - this.touchStartPt.clientX;
            var delXRatio = delX / videoElement.offsetWidth;
            var duration = videoElement.duration || 1800; // Default duration set to 1800s if duration is not available
            this.touchResult = Math.floor(delXRatio * 240);

            // Calculate the new video time based on touchResult
            var newTime = this.startTouchVideoTime + this.touchResult;
            if (newTime < 0) {
                newTime = 0;
                this.touchResult = -this.startTouchVideoTime;
            } else if (newTime > duration) {
                newTime = duration;
                this.touchResult = duration - this.startTouchVideoTime - 1;
            }

            // Update video current time and show toast
            videoElement.currentTime = newTime;
            this.setToast(seconds2TimeStr(newTime));

        } else if (this.sweepDir == 1 || this.sweepDir == 2) {
            if (this.touchStartPt.clientX - this._videoElementAbLeft < this._videoElement.clientWidth / 2) {
                // Adjust brightness if touch on the left half of the video
                this.adjustBrightness(touchPt.clientY);
            } else {
                // Adjust volume if touch on the right half of the video
                this.adjustVolume(touchPt.clientY);
            }
        } else if (this.sweepDir == 5) {
            // Adjust playback speed if sweep direction is 5
            var speed = this.calculateSpeed(delY);
            this.adjustPlaybackSpeed(speed);
        }
    } else if (this.startTouchFingers == 2) {
        var touchPt = e.touches[0];
        var delX = touchPt.clientX - this.touchDownPt.clientX;
        var delY = touchPt.clientY - this.touchDownPt.clientY;

        if (this.sweepDir == 0) {
            var radius = Math.sqrt(delX * delX + delY * delY);
            var w = videoElement.offsetWidth,
                h = videoElement.offsetHeight;
            var judge = Math.sqrt(w * w + h * h) / 30;
            if (radius > judge) {
                if (Math.abs(delX) > Math.abs(delY)) {
                    this._videoElement.playbackRate = this.originalPlayrate;
                    if (delX > 0)
                        this.sweepDir = 4;
                    else
                        this.sweepDir = 3;
                } else {
                    if (delY > 0)
                        this.sweepDir = 2;
                    else
                        this.sweepDir = 1;
                }

                this.touchStartPt = touchPt;
            }
        } else if (this.sweepDir == 3 || this.sweepDir == 4) {
            // Adjust playback speed if sweep direction is 3 or 4
            var speed = this.calculateSpeed(delX);
            this.adjustPlaybackSpeed(speed);
        }
    }
};

TouchGesture.VideoGesture.prototype.adjustBrightness = function(clientY) {
    var delY = clientY - this.touchStartPt.clientY;
    var plus = -delY / this._videoElement.offsetHeight * 4;
    this.touchResult = this.startTouchBrightness + plus;
    if (this.touchResult < 0) this.touchResult = 0;
    else if (this.touchResult > 1) this.touchResult = 1;
    this.videoBrightness = this.touchResult;
    var realBrightness = Math.sqrt(this.touchResult) * 0.85 + 0.15;
    this._videoElement.style.filter = "brightness(" + realBrightness + ")";
    this.setToast("Brightness: " + Math.floor(this.touchResult * 100) + "%");
};

TouchGesture.VideoGesture.prototype.adjustVolume = function(clientY) {
    var delY = clientY - this.touchStartPt.clientY;
    var plus = -delY / this._videoElement.offsetHeight * 4;
    this.touchResult = this.startTouchVideoVolume + plus;
    if (this.touchResult < 0) this.touchResult = 0;
    else if (this.touchResult > 1) this.touchResult = 1;
    this._videoElement.volume = this.touchResult;
    this.setToast("Volume: " + Math.floor(this.touchResult * 100) + "%");
};

TouchGesture.VideoGesture.prototype.calculateSpeed = function(delta) {
    var plus = delta / this._videoElement.offsetWidth * 4;
    return this.originalPlayrate + plus;
};

TouchGesture.VideoGesture.prototype.adjustPlaybackSpeed = function(speed) {
    if (speed < 0.5) speed = 0.5;
    else if (speed > 2) speed = 2;
    this._videoElement.playbackRate = speed;
    this.setToast("Speed: " + speed.toFixed(1) + "x");
};
