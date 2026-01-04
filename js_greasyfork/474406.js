// ==UserScript==
// @name            ViewXtend
// @description     Youtube with extra features
// @icon            None
// @version         1.0.2
// @author          Fate (https://github.com/FateNotAvailable)
// @namespace       https://github.com/FateNotAvailable/ViewXtend
// @supportURL      https://github.com/FateNotAvailable/ViewXtend/issues
// @license         GPL-3
// @icon            https://i.ibb.co/cwvhZQN/View-Xtend.png
// @match           https://www.youtube.com/*
// @match           https://www.youtube-nocookie.com/*
// @match           https://m.youtube.com/*
// @grant           none
// @run-at          document-start
// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      edge
// @compatible      safari
// @downloadURL https://update.greasyfork.org/scripts/474406/ViewXtend.user.js
// @updateURL https://update.greasyfork.org/scripts/474406/ViewXtend.meta.js
// ==/UserScript==


/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/api/ViewXtend.js
class ViewXtendAPI {
    constructor () {
        
    }

    waitForElementBy(by, selector, timeout) {
        return new Promise((resolve, reject) => {
          const startTime = Date.now();
      
          function checkElement() {
            let element;
            if (by == "q") {
                element = document.querySelector(selector);
            }
            else if (by == "t") {
                element = document.getElementsByTagName(selector);
            }
            
            if (element) {
              resolve(element);
            } else if (Date.now() - startTime >= timeout) {
              reject(new Error(`Element '${selector}' not found within ${timeout}ms`));
            } else {
              setTimeout(checkElement, 100); // Check again in 100ms
            }
          }
      
          checkElement();
        });
    }

    waitForElementNotHidden(selector, timeout) {
        return new Promise((resolve, reject) => {
          const startTime = Date.now();
      
          function checkElement() {
            let element = document.querySelector(selector);
            
            if (element) {
                if (element.style.display != 'none') {
                    resolve(element);
                }
                else {
                    setTimeout(checkElement, 100); // Check again in 100ms
                }
            } else if (Date.now() - startTime >= timeout) {
              reject(new Error(`Element '${selector}' not found within ${timeout}ms`));
            } else {
              setTimeout(checkElement, 100); // Check again in 100ms
            }
          }
      
          checkElement();
        });
    }

    get_player() {
        /**
         * Gets video player element
         */

        return this.waitForElementBy("q", "#movie_player > div.html5-video-container > video", 25000);
    }

    get_logo() {
        /**
         * Gets youtube logo
         */

        return this.waitForElementBy("q", "#logo-icon > yt-icon-shape > icon-shape > div > svg", 25000)
    }

    get_videos() {
        /**
         * Gets videos as html tags
         */
        //return this.waitForElementBy("t", "ytd-rich-grid-media", 25000);
        return document.getElementsByTagName("ytd-rich-grid-media");
        
    }

    get_fake_videos() {
        /**
         * Get ads that look like videos
         */
        //return this.waitForElementBy("t", "ytd-ad-slot-renderer", 25000);
        return document.getElementsByTagName("ytd-ad-slot-renderer");
    }

    set_title(title) {
        /**
         * Set page title
         */
        document.title = title
    }

    get_title() {
        /**
         * Get page title
         */
        return document.title
    }

    get_video_download_button() {
        return this.waitForElementBy("q", "#action-button > yt-button-shape > button > div > span", 25000)
    }

    get_download_dialog() {
        return this.waitForElementNotHidden("body > ytd-app > ytd-popup-container > tp-yt-paper-dialog", 25000)
    }

    get_download_options() {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
        
            function checkElement() {
              let element = document.querySelector("#premium-options");
              
              if (element) {
                return resolve(element.childNodes);
              } else if (Date.now() - startTime >= timeout) {
                reject(new Error(`Element '${selector}' not found within ${timeout}ms`));
              } else {
                setTimeout(checkElement, 100); // Check again in 100ms
              }
            }
            checkElement();
        });
    }

    get_checked_download() {
        let pr = document.querySelectorAll('paper-ripple');
        for (let i = 0; i < pr.length; i++) {
            if (pr[i].getAttributeNames().includes("checked")) {
                return pr[i]
            }
        }
        return null;
    }

    create_plugins_button() {
        const f = document.createElement("ytd-compact-link-renderer");
        f.setAttribute("injected", "true")
        f.className = "style-scope yt-multi-page-menu-section-renderer"
        f.setAttribute("compact-link-style", "")
        f.setAttribute("hide-secondary-string", "")
        f.onclick = () => {
            window.location.href = '/plugins';
        }
        f.innerHTML = `
        <a id="endpoint" class="yt-simple-endpoint style-scope ytd-compact-link-renderer" tabindex="-1" href="/plugins">
            <tp-yt-paper-item role="link" class="style-scope ytd-compact-link-renderer" style-target="host" tabindex="0" aria-disabled="false">
                <div id="content-icon" class="style-scope ytd-compact-link-renderer">
                    <yt-img-shadow height="40" width="40" class="style-scope ytd-compact-link-renderer" disable-upgrade="" hidden="">
                    </yt-img-shadow>
                    <yt-icon class="style-scope ytd-compact-link-renderer">
                        <yt-icon-shape class="style-scope yt-icon vxt-plugins-icon">
                            <icon-shape class="yt-spec-icon-shape">
                                <div style="width: 100%; height: 100%; fill: currentcolor;">
                                <svg viewBox="0 0 24 24" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1206 1.02129C12.109 1.0067 12.9592 1.54344 13.7096 2.29199L13.7104 2.29285L14.9707 3.5531C15.1118 3.34249 15.2753 3.14257 15.461 2.95679C17.0025 1.4153 19.5018 1.4153 21.0433 2.9568C22.5848 4.49829 22.5848 6.99754 21.0433 8.53904C20.8575 8.72481 20.6576 8.88828 20.447 9.02939L21.7072 10.2896L21.708 10.2905C22.4565 11.0408 22.9932 11.891 22.9787 12.8794C22.9642 13.8602 22.41 14.6797 21.7058 15.3789C21.7054 15.3793 21.7049 15.3798 21.7045 15.3802L20.4287 16.656C19.9519 17.1327 19.3279 17.0824 18.9512 16.9234C18.5783 16.7659 18.1803 16.4041 18.0897 15.8508C18.0262 15.4628 17.8456 15.0914 17.5452 14.791C16.7847 14.0306 15.5518 14.0306 14.7914 14.791C14.0309 15.5515 14.0309 16.7844 14.7914 17.5448C15.0917 17.8452 15.4631 18.0259 15.8511 18.0894C16.4044 18.18 16.7663 18.5779 16.9237 18.9509C17.0827 19.3276 17.1331 19.9516 16.6564 20.4283L15.377 21.7077C15.3766 21.7081 15.3762 21.7085 15.3757 21.709C14.6777 22.412 13.8591 22.965 12.8794 22.9795C11.8922 22.994 11.0429 22.4585 10.2938 21.7112L10.2929 21.7103L9.0295 20.4469C8.88841 20.6575 8.72496 20.8573 8.53922 21.0431C6.99773 22.5846 4.49847 22.5846 2.95698 21.0431C1.41549 19.5016 1.41549 17.0023 2.95698 15.4608C3.14272 15.2751 3.3426 15.1116 3.55317 14.9706L2.29294 13.7103L2.29208 13.7095C1.54353 12.9591 1.00681 12.1089 1.02141 11.1205C1.03589 10.1397 1.59009 9.32029 2.29424 8.62107C2.29469 8.62062 2.29515 8.62017 2.2956 8.61972L3.57165 7.34366C4.0484 6.86691 4.67249 6.9173 5.04916 7.07633C5.4221 7.23378 5.82003 7.59563 5.91062 8.14898C5.97414 8.53701 6.15479 8.90842 6.45519 9.20882C7.21563 9.96926 8.44856 9.96926 9.209 9.20882C9.96945 8.44837 9.96945 7.21545 9.20901 6.455C8.90861 6.1546 8.53719 5.97396 8.14917 5.91043C7.59581 5.81984 7.23397 5.42191 7.07652 5.04897C6.91749 4.6723 6.86709 4.04821 7.34384 3.57146L8.61978 2.29553C8.62025 2.29506 8.62071 2.29459 8.62118 2.29413C9.32039 1.58996 10.1398 1.03576 11.1206 1.02129ZM11.1501 3.02107C10.9456 3.02409 10.6003 3.13919 10.0393 3.70438L10.0367 3.70706L9.49334 4.25039C9.90279 4.44025 10.2863 4.70387 10.6232 5.04079C12.1647 6.58228 12.1647 9.08154 10.6232 10.623C9.08173 12.1645 6.58247 12.1645 5.04098 10.623C4.70406 10.2861 4.44044 9.9026 4.25058 9.49315L3.70715 10.0366L3.70449 10.0392C3.13933 10.6002 3.02421 10.9455 3.02119 11.1501C3.01827 11.3476 3.11651 11.7039 3.70773 12.2967C3.70782 12.2968 3.70792 12.2969 3.70801 12.297L6.03813 14.6271C6.30605 14.895 6.39954 15.2913 6.2796 15.6508C6.15966 16.0102 5.8469 16.2709 5.47177 16.3243C5.06894 16.3815 4.68196 16.5643 4.37119 16.8751C3.61075 17.6355 3.61075 18.8684 4.3712 19.6289C5.13164 20.3893 6.36456 20.3893 7.12501 19.6289C7.43577 19.3181 7.61854 18.9311 7.67581 18.5283C7.72914 18.1532 7.9899 17.8404 8.34931 17.7205C8.70872 17.6005 9.10505 17.694 9.37296 17.9619L11.7063 20.2953C11.7066 20.2955 11.7068 20.2958 11.7071 20.296C11.7071 20.2961 11.7071 20.2961 11.7072 20.2961C12.2975 20.8848 12.6529 20.9826 12.8499 20.9797C13.0539 20.9767 13.3986 20.8619 13.9575 20.2988L13.9601 20.2961L14.5069 19.7494C14.0975 19.5595 13.714 19.2959 13.3772 18.9591C11.8357 17.4176 11.8357 14.9183 13.3772 13.3768C14.9186 11.8353 17.4179 11.8353 18.9594 13.3768C19.2963 13.7137 19.5599 14.0972 19.7497 14.5065L20.2929 13.9633L20.2956 13.9607C20.8608 13.3998 20.9759 13.0544 20.9789 12.8499C20.9818 12.6524 20.8836 12.2961 20.2928 11.7036C20.2925 11.7034 20.2923 11.7031 20.2921 11.7029L17.9619 9.3728C17.694 9.10487 17.6005 8.70853 17.7205 8.34912C17.8404 7.9897 18.1532 7.72895 18.5284 7.67564C18.9312 7.61839 19.3183 7.43561 19.6291 7.12482C20.3895 6.36438 20.3895 5.13145 19.6291 4.37101C18.8686 3.61056 17.6357 3.61056 16.8752 4.37101C16.5644 4.6818 16.3817 5.06882 16.3244 5.4717C16.2711 5.84683 16.0104 6.15962 15.6509 6.27957C15.2915 6.39953 14.8952 6.30604 14.6273 6.03812L12.2971 3.70792C12.2969 3.70779 12.2968 3.70767 12.2967 3.70754C11.704 3.11638 11.3476 3.01815 11.1501 3.02107Z"></path>
        </svg></div>
                            </icon-shape>
                        </yt-icon-shape>
                    </yt-icon>
                </div>
                <div id="primary-text-container" class="style-scope ytd-compact-link-renderer">
                    <yt-formatted-string id="label" class="style-scope ytd-compact-link-renderer">Plugins</yt-formatted-string>
                    <yt-formatted-string id="subtitle" class="style-scope ytd-compact-link-renderer" is-empty="">
                        <yt-attributed-string class="style-scope yt-formatted-string"></yt-attributed-string>
                    </yt-formatted-string>
                </div>
                <yt-icon id="right-icon" class="style-scope ytd-compact-link-renderer" disable-upgrade="" hidden="">
                </yt-icon>
                <yt-formatted-string id="secondary-text" class="style-scope ytd-compact-link-renderer" is-empty="" hidden="">

                    <yt-attributed-string class="style-scope yt-formatted-string"></yt-attributed-string>
                </yt-formatted-string>
        
            </tp-yt-paper-item>
        </a>`;
        return f
    }
    suicidalInterval(callback, ms) {
        function die() {
          console.log("I'm ending myself!");
          clearInterval(interval);
        }
      
        const interval = setInterval(() => {
          callback(die);
        }, ms);
    }

}

/* harmony default export */ const ViewXtend = (ViewXtendAPI);
;// CONCATENATED MODULE: ./src/utils/Plugins.js
class Plugins {
    constructor() {}

    loadFromLocalStorage(key, defaultValue) {
        // Check if the key exists in localStorage
        if (localStorage.hasOwnProperty(key)) {
            try {
                // Parse the JSON data from localStorage
                const data = JSON.parse(localStorage.getItem(key));
        
                // Check if the parsed data is an object (JSON)
                if (typeof data === 'object' && data !== null) {
                return data;
                } else {
                // Handle the case where the data is not a valid JSON object
                console.error('Data in localStorage is not a valid JSON object.');
                }
            } catch (error) {
                // Handle any errors that occur during JSON parsing
                console.error('Error parsing data from localStorage:', error);
            }
        }
        return defaultValue;
    }

    load_plugins() {
        const pluginsData = this.loadFromLocalStorage('plugins', {});

        for (const key in pluginsData) {
            if (pluginsData.hasOwnProperty(key)) {
                const value = pluginsData[key];
        
                // Check if the URL matches the regex pattern
                const regex = new RegExp(value['runs_on']);
                const currentURL = window.location.href;
        
                if (regex.test(currentURL)) {
                    const script = document.createElement('script');
                    script.src = value['url'];
                    document.head.appendChild(script);
                }
            }
        }
    }
}

/* harmony default export */ const utils_Plugins = (Plugins);
;// CONCATENATED MODULE: ./src/web/index.html
// Module
var code = "<!DOCTYPE html> <html lang=\"en\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"> <title>ViewXtend Plugins</title> <style>body,html{background-color:#000}body{margin:0;padding:0;font-family:Arial,sans-serif}.vxt-grid-container{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:20px}.vxt-card{background-color:#212121;border:0 solid #ccc;padding:20px;box-shadow:0 2px 4px rgba(0,0,0,.1);display:flex;flex-direction:column;position:relative}.vxt-title{font-weight:700;margin-bottom:10px;color:#fff}.vxt-description{margin-bottom:10px;color:#fff}.vxt-switch{position:absolute;top:10px;right:10px;display:flex;align-items:center}.vxt-switch-input{display:none}.vxt-switch-slider{position:relative;width:40px;height:20px;background-color:#ccc;border-radius:20px}.vxt-switch-slider::before{content:'';position:absolute;width:18px;height:18px;border-radius:50%;background-color:#007bff;top:50%;transform:translateY(-50%);transition:.2s}.vxt-switch-input:checked+.vxt-switch-slider::before{transform:translateY(-50%) translateX(20px)}.tgl{display:none}.tgl,.tgl *,.tgl :after,.tgl :before,.tgl+.tgl-btn,.tgl:after,.tgl:before{box-sizing:border-box}.tgl ::-moz-selection,.tgl :after::-moz-selection,.tgl :before::-moz-selection,.tgl+.tgl-btn::-moz-selection,.tgl::-moz-selection,.tgl:after::-moz-selection,.tgl:before::-moz-selection{background:0 0}.tgl ::selection,.tgl :after::selection,.tgl :before::selection,.tgl+.tgl-btn::selection,.tgl::selection,.tgl:after::selection,.tgl:before::selection{background:0 0}.tgl+.tgl-btn{outline:0;display:block;width:4em;height:2em;position:relative;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.tgl+.tgl-btn:after,.tgl+.tgl-btn:before{position:relative;display:block;content:\"\";width:50%;height:100%}.tgl+.tgl-btn:after{left:0}.tgl+.tgl-btn:before{display:none}.tgl:checked+.tgl-btn:after{left:50%}.tgl-skewed+.tgl-btn{overflow:hidden;transform:skew(-10deg);-webkit-backface-visibility:hidden;backface-visibility:hidden;transition:all .2s ease;font-family:sans-serif;background:#888}.tgl-skewed+.tgl-btn:after,.tgl-skewed+.tgl-btn:before{transform:skew(10deg);display:inline-block;transition:all .2s ease;width:100%;text-align:center;position:absolute;line-height:2em;font-weight:700;color:#fff;text-shadow:0 1px 0 rgba(0,0,0,.4)}.tgl-skewed+.tgl-btn:after{left:100%;content:attr(data-tg-on)}.tgl-skewed+.tgl-btn:before{left:0;content:attr(data-tg-off)}.tgl-skewed+.tgl-btn:active{background:#888}.tgl-skewed+.tgl-btn:active:before{left:-10%}.tgl-skewed:checked+.tgl-btn{background:red}.tgl-skewed:checked+.tgl-btn:before{left:-100%}.tgl-skewed:checked+.tgl-btn:after{left:0}.tgl-skewed:checked+.tgl-btn:active:after{left:10%}.btm-left{position:fixed;z-index:999;bottom:5%;left:2%}.btm-left button{border-radius:15px;padding:12%;width:160%;background-color:#212121;color:#fff;border:0}.btm-left button:hover{background-color:#3a3a3a;cursor:pointer}</style> </head> <body> <div class=\"vxt-grid-container\"></div> <div class=\"btm-left\"> <button onclick='window.location.href=\"/\"'>Go back to YouTube</button> </div> <" + "script>const ld=()=>{let e=localStorage.getItem(\"plugins\");if(e){const t=JSON.parse(e);for(const e in t){t[e];const n=document.getElementById(`plugin-${e}`);n&&(n.checked=!0)}}};let container=document.getElementsByClassName(\"vxt-grid-container\")[0];var xhr=new XMLHttpRequest;xhr.onreadystatechange=function(){4===xhr.readyState&&200===xhr.status?(JSON.parse(xhr.responseText).forEach((function(e){const t=document.createElement(\"div\");t.className=\"vxt-card\";const n=document.createElement(\"div\");n.className=\"vxt-switch\";const s=document.createElement(\"input\");s.className=\"tgl tgl-skewed\",s.type=\"checkbox\",s.id=`plugin-${e.id}`,s.addEventListener(\"click\",(()=>{switch_click(e.id,e.url,e.runs_on)}));const a=document.createElement(\"label\");a.className=\"tgl-btn\",a.setAttribute(\"data-tg-off\",\"OFF\"),a.setAttribute(\"data-tg-on\",\"ON\"),a.setAttribute(\"for\",`plugin-${e.id}`);const c=document.createElement(\"div\");c.className=\"vxt-title\",c.textContent=e.name;const l=document.createElement(\"div\");l.className=\"vxt-description\",l.textContent=e.description,n.appendChild(s),n.appendChild(a),t.appendChild(n),t.appendChild(c),t.appendChild(l),container.appendChild(t)})),ld()):4===xhr.readyState&&200!==xhr.status&&console.error(\"Failed to load data.json\")},xhr.open(\"GET\",\"https://viewxtend.pages.dev/plugins/registry.json\",!0),xhr.send();const switch_click=(e,t,n)=>{if(document.getElementById(`plugin-${e}`).checked){const s=localStorage.getItem(\"plugins\"),a=s?JSON.parse(s):{};a[e]={url:t,runs_on:n},localStorage.setItem(\"plugins\",JSON.stringify(a))}else{const t=localStorage.getItem(\"plugins\"),n=t?JSON.parse(t):{};n.hasOwnProperty(e)&&(delete n[e],localStorage.setItem(\"plugins\",JSON.stringify(n)))}}<" + "/script> </body> </html> ";
// Exports
/* harmony default export */ const web = (code);
;// CONCATENATED MODULE: ./src/index.js




window.ViewXtendAPI_direct = ViewXtend;
window.ViewXtendAPI = new ViewXtend;

const vx_main_fun = () => {
    if (window.location.pathname == "/plugins") {
        document.open();
        document.write(web);
        document.close();
        return;
    }

    let API = new ViewXtend();
    let PLG = new utils_Plugins();

    PLG.load_plugins();

    const shouldBeInserted = () => {
      let items = document.querySelector("#sections > yt-multi-page-menu-section-renderer:nth-child(1)").querySelector("#items").childNodes;
      for (let i = 0; i < items.length; i++) {
        if(items[i].getAttribute("injected") == "true") {
          return false;
        }
      }
      return true;
    }
    
    setInterval(() => {
        try {
            var parentElement = document.querySelector("#sections > yt-multi-page-menu-section-renderer:nth-child(1)").querySelector("#items");
            
            if (shouldBeInserted()) {
                var firstItem = parentElement.firstElementChild;
                parentElement.insertBefore(API.create_plugins_button(), firstItem.nextSibling);
                var icon = document.querySelectorAll("#content-icon > yt-icon")[1];
                icon.innerHTML = `
                <icon-shape class="yt-spec-icon-shape">
                  <div style="width: 100%; height: 100%; fill: currentcolor;">
                    <svg viewBox="0 0 24 24" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1206 1.02129C12.109 1.0067 12.9592 1.54344 13.7096 2.29199L13.7104 2.29285L14.9707 3.5531C15.1118 3.34249 15.2753 3.14257 15.461 2.95679C17.0025 1.4153 19.5018 1.4153 21.0433 2.9568C22.5848 4.49829 22.5848 6.99754 21.0433 8.53904C20.8575 8.72481 20.6576 8.88828 20.447 9.02939L21.7072 10.2896L21.708 10.2905C22.4565 11.0408 22.9932 11.891 22.9787 12.8794C22.9642 13.8602 22.41 14.6797 21.7058 15.3789C21.7054 15.3793 21.7049 15.3798 21.7045 15.3802L20.4287 16.656C19.9519 17.1327 19.3279 17.0824 18.9512 16.9234C18.5783 16.7659 18.1803 16.4041 18.0897 15.8508C18.0262 15.4628 17.8456 15.0914 17.5452 14.791C16.7847 14.0306 15.5518 14.0306 14.7914 14.791C14.0309 15.5515 14.0309 16.7844 14.7914 17.5448C15.0917 17.8452 15.4631 18.0259 15.8511 18.0894C16.4044 18.18 16.7663 18.5779 16.9237 18.9509C17.0827 19.3276 17.1331 19.9516 16.6564 20.4283L15.377 21.7077C15.3766 21.7081 15.3762 21.7085 15.3757 21.709C14.6777 22.412 13.8591 22.965 12.8794 22.9795C11.8922 22.994 11.0429 22.4585 10.2938 21.7112L10.2929 21.7103L9.0295 20.4469C8.88841 20.6575 8.72496 20.8573 8.53922 21.0431C6.99773 22.5846 4.49847 22.5846 2.95698 21.0431C1.41549 19.5016 1.41549 17.0023 2.95698 15.4608C3.14272 15.2751 3.3426 15.1116 3.55317 14.9706L2.29294 13.7103L2.29208 13.7095C1.54353 12.9591 1.00681 12.1089 1.02141 11.1205C1.03589 10.1397 1.59009 9.32029 2.29424 8.62107C2.29469 8.62062 2.29515 8.62017 2.2956 8.61972L3.57165 7.34366C4.0484 6.86691 4.67249 6.9173 5.04916 7.07633C5.4221 7.23378 5.82003 7.59563 5.91062 8.14898C5.97414 8.53701 6.15479 8.90842 6.45519 9.20882C7.21563 9.96926 8.44856 9.96926 9.209 9.20882C9.96945 8.44837 9.96945 7.21545 9.20901 6.455C8.90861 6.1546 8.53719 5.97396 8.14917 5.91043C7.59581 5.81984 7.23397 5.42191 7.07652 5.04897C6.91749 4.6723 6.86709 4.04821 7.34384 3.57146L8.61978 2.29553C8.62025 2.29506 8.62071 2.29459 8.62118 2.29413C9.32039 1.58996 10.1398 1.03576 11.1206 1.02129ZM11.1501 3.02107C10.9456 3.02409 10.6003 3.13919 10.0393 3.70438L10.0367 3.70706L9.49334 4.25039C9.90279 4.44025 10.2863 4.70387 10.6232 5.04079C12.1647 6.58228 12.1647 9.08154 10.6232 10.623C9.08173 12.1645 6.58247 12.1645 5.04098 10.623C4.70406 10.2861 4.44044 9.9026 4.25058 9.49315L3.70715 10.0366L3.70449 10.0392C3.13933 10.6002 3.02421 10.9455 3.02119 11.1501C3.01827 11.3476 3.11651 11.7039 3.70773 12.2967C3.70782 12.2968 3.70792 12.2969 3.70801 12.297L6.03813 14.6271C6.30605 14.895 6.39954 15.2913 6.2796 15.6508C6.15966 16.0102 5.8469 16.2709 5.47177 16.3243C5.06894 16.3815 4.68196 16.5643 4.37119 16.8751C3.61075 17.6355 3.61075 18.8684 4.3712 19.6289C5.13164 20.3893 6.36456 20.3893 7.12501 19.6289C7.43577 19.3181 7.61854 18.9311 7.67581 18.5283C7.72914 18.1532 7.9899 17.8404 8.34931 17.7205C8.70872 17.6005 9.10505 17.694 9.37296 17.9619L11.7063 20.2953C11.7066 20.2955 11.7068 20.2958 11.7071 20.296C11.7071 20.2961 11.7071 20.2961 11.7072 20.2961C12.2975 20.8848 12.6529 20.9826 12.8499 20.9797C13.0539 20.9767 13.3986 20.8619 13.9575 20.2988L13.9601 20.2961L14.5069 19.7494C14.0975 19.5595 13.714 19.2959 13.3772 18.9591C11.8357 17.4176 11.8357 14.9183 13.3772 13.3768C14.9186 11.8353 17.4179 11.8353 18.9594 13.3768C19.2963 13.7137 19.5599 14.0972 19.7497 14.5065L20.2929 13.9633L20.2956 13.9607C20.8608 13.3998 20.9759 13.0544 20.9789 12.8499C20.9818 12.6524 20.8836 12.2961 20.2928 11.7036C20.2925 11.7034 20.2923 11.7031 20.2921 11.7029L17.9619 9.3728C17.694 9.10487 17.6005 8.70853 17.7205 8.34912C17.8404 7.9897 18.1532 7.72895 18.5284 7.67564C18.9312 7.61839 19.3183 7.43561 19.6291 7.12482C20.3895 6.36438 20.3895 5.13145 19.6291 4.37101C18.8686 3.61056 17.6357 3.61056 16.8752 4.37101C16.5644 4.6818 16.3817 5.06882 16.3244 5.4717C16.2711 5.84683 16.0104 6.15962 15.6509 6.27957C15.2915 6.39953 14.8952 6.30604 14.6273 6.03812L12.2971 3.70792C12.2969 3.70779 12.2968 3.70767 12.2967 3.70754C11.704 3.11638 11.3476 3.01815 11.1501 3.02107Z"></path>
                    </svg>
                  </div>
                </icon-shape> `;
                icon.parentNode.parentElement.querySelector("#label").innerText = "Plugins";
            }

        }
        catch {};
    }, 150);


}

vx_main_fun()
/******/ })()
;