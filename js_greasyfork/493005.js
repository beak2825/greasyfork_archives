// ==UserScript==
// @name         Simple Material Config
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Simple modern configuration builder for user scripts
// @author       DaveIT
// @license      MIT
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @resource     IMPORTED_CSS https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js
// @downloadURL https://update.greasyfork.org/scripts/493005/Simple%20Material%20Config.user.js
// @updateURL https://update.greasyfork.org/scripts/493005/Simple%20Material%20Config.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);

    /*
    $('body').append(`
    <div id="modal" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">{userScriptName} Settings</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">

        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
          <label class="form-check-label" for="flexSwitchCheckDefault">Automatically set the best quality for current video</label>
        </div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
          <label class="form-check-label" for="flexSwitchCheckDefault">Automatically set the best quality for recommendations</label>
        </div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault">
          <label class="form-check-label" for="flexSwitchCheckDefault">Enable hotkeys</label>
        </div>

        <hr/>

        <div class="row g-2 align-items-center">
  <div class="col-auto">
    <label for="inputPassword6" class="col-form-label">Mute hotkey</label>
  </div>
  <div class="col-auto">
    <input type="text" id="inputPassword6" class="form-control" aria-describedby="passwordHelpInline">
  </div>
</div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>
`);
    */

    class SimpleMaterialConfig {
        constructor(menu) {
            this._settings = [];
            this.menu = menu;
            this._initializeMenu();
        }

        _initializeMenu() {
            let modalHtml = `
                <div id="modal" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">{userScriptName} Settings</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      `;

            for (const setting in this.menu.settings) {
                let currentSetting = this.menu.settings[setting];

                console.log(currentSetting)

                let settingHtml;

                switch (currentSetting.type) {
                    case 'checkbox': {
                        settingHtml = `
                        <div class="form-check form-switch">
                          <input class="form-check-input" type="checkbox" id="${setting}" value="${currentSetting.default}">
                          <label class="form-check-label" for="${setting}">${currentSetting.label}</label>
                        </div>
                        `;
                        break;
                    }
                }

                modalHtml += settingHtml;
            }

            modalHtml += `
                  </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>
            `;

            $('body').append(modalHtml);
        }

        get(settingName) {
            return this._settings[settingName]
        }

        set(settingName, value) {
            this._settings[settingName] = value;
        }

    }


    new SimpleMaterialConfig({
                title: "AwesomeScript Configuration",
                displayMenu: true,
                settings: {
                    /*
                    font_size: {
                        label: "Font size",
                        type: "select",
                        choices: [ "Small", "Medium", "Large" ],
                        default: "Medium"
                    },
                    */
                    auto_hd: {
                        label: "Automatically set the best quality for current video",
                        type: 'checkbox',
                        default: true
                    },
                    auto_hd_recommendations: {
                        label: "Automatically set the best quality for recommendations",
                        type: 'checkbox',
                        default: true
                    },
                    enable_hotkeys: {
                        label: "Enable hotkeys",
                        type: 'checkbox',
                        default: true
                    }
                }
            });

    // $('#modal').modal('toggle');

    GM_registerMenuCommand("Test Menu", function () {
        $('#modal').modal('toggle');
    });
})();