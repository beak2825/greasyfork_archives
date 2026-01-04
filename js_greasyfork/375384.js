// ==UserScript==
// @name               Picture In Picture
// @name:zh-CN         HTML5画中画
// @namespace          http://github.com/eternal-flame-AD/picture-in-picture/
// @version            0.2
// @homepage           http://github.com/eternal-flame-AD/picture-in-picture/
// @description        Provide picture in picture functionality to HTML5 videos on supported browsers
// @description:zh-CN  向兼容浏览器中的HTML5视频添加画中画按钮
// @compatible         chrome 70+
// @author             eternal-flame-AD
// @include            *
// @grant              GM_info
// @license            Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/375384/Picture%20In%20Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/375384/Picture%20In%20Picture.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!("pictureInPictureEnabled" in document)) {
        console.log("Your browser does not support picture in picture. Exiting...")
        return
    }
    if (!document.pictureInPictureEnabled) {
        console.log("Picture in picture is disabled. Exiting...")
        return
    }

    window["PIP_URL_BASE"] = "https://cdn.jsdelivr.net/gh/eternal-flame-AD/picture-in-picture/";

    function formatURL(url) {
        return (!/^(https?:)?\/\//.test(url))?(window['PIP_URL_BASE'] + url):url;
    }

    function createStylesheet(url) {
        url = formatURL(url);
        let elt = document.createElement('link');
        elt.rel = 'stylesheet';
        elt.href = url;
        document.documentElement.appendChild(elt);
    };

    const locateVideoElement = function _self(DOM=document.body) {
        let video = DOM.querySelector("video")
        if (video) return video
        let iframes = DOM.querySelectorAll("iframe")
        for (let iframe of iframes) {
            video = _self(iframe.contentDocument.body)
            if (video) return video
        }
        return null
    }

    let loaded = false;
    const load = function(target) {
        if (loaded) return
        loaded = true;
        createStylesheet('style.css');
        class PIP {
            constructor(target) {
                this.target = target || locateVideoElement(document.body);
                this.outside = false
    
                let holder = document.createElement('div')
                holder.className = 'pip-indicator-holder pip-off'
            
                let img = document.createElement('img');
                img.className = 'pip-indicator-logo'
                img.src = formatURL("logo.svg")
                holder.appendChild(img)
            
                document.body.appendChild(holder)
                
                this.off = this.off.bind(this)
                this.on = this.on.bind(this)
                this.updateTarget = this.updateTarget.bind(this)
                
                holder.onclick = () => {
                    (this.outside?this.off:this.on)().catch(console.error)
                }
                this.elem = holder;
            }
    
            updateTarget() {
                if (!this.target.isConnected) this.target = locateVideoElement(document.body);
                let _this = this;
                this.target.addEventListener('enterpictureinpicture', function _self() {
                    if (!_this.target.isConnected) {
                        _this.target.removeEventListener('enterpictureinpicture', _self)
                        return
                    }
                    _this.outside = true
                    _this.elem.classList.replace("pip-off","pip-on")
                });
            
                this.target.addEventListener('leavepictureinpicture', function _self() {
                    if (!_this.target.isConnected) {
                        _this.target.removeEventListener('leavepictureinpicture', _self)
                        return
                    }
                    _this.outside = false
                    _this.elem.classList.replace("pip-on","pip-off")
                });
            }
    
            async on() {
                this.updateTarget()
                await this.target.requestPictureInPicture()
            }
    
            async off() {
                await document.exitPictureInPicture()
            }
            
        }
        
        //new PIP(target)
        new PIP() // Fixed ad problem
    }

    {
        let observers = []
        let observe = function _self(DOM=document.body, _window=window, debug=false) {
            const gotVideo = function(video) {
                if (video.disablePictureInPicture) return;
                console.log("Got video element! Loading...")
                load(video)
                observers.forEach(obs=>{
                    obs.disconnect()
                })
            }
            
            {
                // Existing video
                let video = locateVideoElement(DOM)
                if (video) gotVideo(video)
            }
            
            {
                // Existing iframe
                DOM.querySelectorAll("iframe").forEach(iframe=>{
                    iframe.contentWindow.onload = function() {
                        iframe.contentWindow["PIP_OBSERVING"] = true;
                        _self(iframe.contentDocument.body,iframe.contentWindow)
                    }
                })
            }
            
            console.log("No video elements. Watching for changes...")

            let callback = function(mutationList) {
                mutationList.forEach((mutation)=>{
                    mutation.addedNodes.forEach((node)=>{
                        if (debug) console.log(node)
                        const search = function (node,tag) {
                            if (node.tagName && node.tagName.toUpperCase()==tag.toUpperCase()) {
                                return node
                            }
                            return node.querySelector && node.querySelector(tag)
                        }
                        
                        {
                            // Dynamically added video
                            let video = search(node, "video")
                            if (video) gotVideo(video)
                        }

                        {
                            // Dynamically added iframe
                            let iframe = search(node, "iframe")
                            if (iframe) {
                                iframe.contentWindow.onload = function() {
                                    if (iframe.contentWindow["PIP_OBSERVING"] == true) return;
                                    iframe.contentWindow["PIP_OBSERVING"] = true;
                                    _self(iframe.contentDocument.body,iframe.contentWindow)
                                }
                            }
                        }

                    })
                })
            }
            let observer = new _window.MutationObserver(callback)
            observer.observe(DOM,{
                childList: true,
                attributes: false,
                subtree: true
            })
            observers.push(observer)
            window.observers = observers;
        }
        observe(document.body)
    }

})();
