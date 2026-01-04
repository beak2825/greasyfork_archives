    // ==UserScript==
    // @name         Open gitpod.io newtab
    // @description  Open gitpod.io new tab on github          
    // @version      1.0.4
    // @namespace    github.com
    // @author       f97
    // @iconURL      https://github.com/fluidicon.png
    // @include      *://github.com/*
    // @homepage     https://f97.xyz
    // @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.slim.min.js
    // @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/435433/Open%20gitpodio%20newtab.user.js
// @updateURL https://update.greasyfork.org/scripts/435433/Open%20gitpodio%20newtab.meta.js
    // ==/UserScript==
     
    (function () {
      $('ul.pagehead-actions').append(`
        <li>
          <div class="d-block js-toggler-container js-social-container">
            <button id="gitpod-btn" class="btn btn-sm" aria-label="Open in VS Code" title="Open in Gitpod">
              <svg t="1613473201265" class="octicon octicon-repo-forked" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1503" width="16" height="16"><path d="M746.222933 102.239573l-359.799466 330.820267L185.347413 281.4976 102.2464 329.864533l198.20544 182.132054-198.20544 182.132053 83.101013 48.510293 201.076054-151.558826 359.799466 330.676906 175.527254-85.251413V187.4944z m0 217.57952v384.341334l-255.040853-192.177494z" fill="#2196F3" p-id="1504"></path></svg>
              <span>Gitpod</span>
            </button>
          </div>
        </li>
      `)
      $('#gitpod-btn').click(() => { 
        window.open('https://gitpod.io/#' + window.location.href, "_blank") 
      })
    })() 
