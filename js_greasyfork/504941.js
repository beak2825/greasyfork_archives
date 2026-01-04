// ==UserScript==
// @name        TVU Tools
// @namespace   Violentmonkey Scripts
// @match       https://lmstvu2.onschool.edu.vn/*
// @version     1.0.2
// @author      - HaiTT
// @description 6/13/2024, 9:21:30 AM
// @license     MIT
//
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @require https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js
// @resource bootstrapCSS https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/504941/TVU%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/504941/TVU%20Tools.meta.js
// ==/UserScript==

window.addEventListener("keydown",function(event){if(event.ctrlKey&&event.key==="0"){event.preventDefault();const container=document.getElementById("tvu-tool-container");if(container){container.remove()}else{tvuTools()}}});function tvuTools(){const head=document.head;const body=document.body;function init(){const menuButtonTemplate=`
      <div id="tvu-tool-container" class="position-fixed top-50 end-0 translate-middle-y me-2">
        <div class="row">
          <div class="col-12 position-relative">
            <div class="card position-absolute end-0 bottom-0 me-3 d-none" id="menuContainer">
              <div class="card-body" style="width: max-content;">
                <h5 class="card-title">TVU Assistant</h5>
                <ul class="nav nav-tabs">
                  <li class="nav-item">
                    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#provideAnswers"
                      type="button" role="tab" aria-controls="provideAnswers" aria-selected="true">Provide answers</button>
                  </li>
                  <li class="nav-item">
                    <button class="nav-link" id="doTestTab" data-bs-toggle="tab" data-bs-target="#doTest"
                      type="button" role="tab" aria-controls="moreTool" aria-selected="false">Do test</button>
                  </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                  <div class="tab-pane fade show active overflow-auto p-2" id="provideAnswers" role="tabpanel"
                    aria-labelledby="provideAnswers-tab" style="max-height: 15rem;">
                    <button class="btn btn-warning btn-sm" id="provideAnswersBtn" style="min-height: unset">
                        Provide answers
                    </button>
                    <div id="loadingProvideAnswersBtn" class="ms-2 spinner-border spinner-border-sm d-none" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                  <div class="tab-pane fade   p-2" id="doTest" role="tabpanel" aria-labelledby="doTest-tab">
                    <div class="overflow-auto" style="max-height: 15rem;" id="questionList">
                    
                    </div>
                    <button class="btn btn-warning btn-sm" id="doTestBtn" style="min-height: unset">Auto fill results</button>
                    <div id="loadingDoTestBtn" class="ms-2 spinner-border spinner-border-sm d-none" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-content-end mt-1">
          <div class="col-auto">
            <a class="rounded-circle fs-4 text-light" id="menuBtn" style="cursor: pointer">
                ${getIcon()}
            </a>
          </div>
        </div>
      </div>
    `;const cssElement=document.createElement("link");cssElement.rel="stylesheet";cssElement.href=GM_getResourceURL("bootstrapCSS");head.appendChild(cssElement);body.insertAdjacentHTML("beforeend",menuButtonTemplate);document.getElementById("menuBtn").addEventListener("click",function(){const menuContainer=document.getElementById("menuContainer");menuContainer.classList.toggle("d-none")})}}function getIcon(){return`
    <svg height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
      \t viewBox="0 0 295.996 295.996" xml:space="preserve">
      <g>
      \t<path style="fill:#FFCE00;" d="M270.996,123.998c0-11.334-1.363-22.348-3.907-32.9c-7.269-15.152-17.35-28.708-29.558-39.996
      \t\tc-22.391-13.376-48.766-20.666-76.771-19.645C83.492,34.273,23.139,99.196,25.955,176.463c0.413,11.304,2.17,22.239,5.087,32.673
      \t\tc6.303,12.01,14.397,22.938,23.934,32.42c21.892,14.189,47.99,22.44,76.022,22.44C208.316,263.996,270.996,201.316,270.996,123.998
      \t\tz M197.666,98.998c8.836,0,16,7.164,16,16s-7.164,16-16,16s-16-7.164-16-16S188.83,98.998,197.666,98.998z M98.666,98.998
      \t\tc8.836,0,16,7.164,16,16s-7.164,16-16,16s-16-7.164-16-16S89.83,98.998,98.666,98.998z M56,147.997h16
      \t\tc0,42,34.093,75.998,75.998,75.998s75.998-33.998,75.998-75.998h16c0,51-41.27,91.998-91.998,91.998
      \t\tC97.271,239.995,56,198.997,56,147.997z"/>
      \t<path style="fill:#FFB100;" d="M267.089,91.098c2.544,10.553,3.907,21.566,3.907,32.9c0,77.318-62.68,139.998-139.998,139.998
      \t\tc-28.032,0-54.131-8.251-76.022-22.44c23.88,23.744,56.766,38.44,93.022,38.44c72.784,0,131.998-59.214,131.998-131.998
      \t\tC279.996,127.636,275.358,108.337,267.089,91.098z"/>
      \t<path style="fill:#FFE454;" d="M160.76,31.457c28.006-1.021,54.381,6.269,76.771,19.645C213.985,29.328,182.521,16,147.998,16
      \t\tC75.214,16,16,75.214,16,147.998c0,22.049,5.442,42.849,15.042,61.138c-2.917-10.434-4.674-21.369-5.087-32.673
      \t\tC23.139,99.196,83.492,34.273,160.76,31.457z"/>
      \t<path d="M147.998,0C66.392,0,0,66.392,0,147.998s66.392,147.998,147.998,147.998s147.998-66.392,147.998-147.998
      \t\tS229.604,0,147.998,0z M147.998,279.996c-36.257,0-69.143-14.696-93.022-38.44c-9.536-9.482-17.631-20.41-23.934-32.42
      \t\tC21.442,190.847,16,170.047,16,147.998C16,75.214,75.214,16,147.998,16c34.523,0,65.987,13.328,89.533,35.102
      \t\tc12.208,11.288,22.289,24.844,29.558,39.996c8.27,17.239,12.907,36.538,12.907,56.9
      \t\tC279.996,220.782,220.782,279.996,147.998,279.996z"/>
      \t<path d="M239.996,147.997h-16c0,42-34.093,75.998-75.998,75.998S72,189.997,72,147.997H56c0,51,41.271,91.998,91.998,91.998
      \t\tC198.726,239.995,239.996,198.997,239.996,147.997z"/>
      \t<circle cx="98.666" cy="114.998" r="16"/>
      \t<circle cx="197.666" cy="114.998" r="16"/>
      </g>
      </svg>
    `}