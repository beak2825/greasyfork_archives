// ==UserScript==
// @name          Evolve Idle Cloud Save
// @namespace     https://github.com/Alistair1231/my-userscripts/
// @version       1.3.3
// @description   Automatically upload your evolve save to a gist
// @author        Alistair1231
// @match         https://pmotschmann.github.io/Evolve/
// @icon          https://icons.duckduckgo.com/ip2/github.io.ico
// @license       GPL-3.0
// @grant         GM.addStyle
// @grant         GM.xmlHttpRequest
// @require       https://cdn.jsdelivr.net/npm/@trim21/gm-fetch@0.2.1
// @downloadURL https://update.greasyfork.org/scripts/490376/Evolve%20Idle%20Cloud%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/490376/Evolve%20Idle%20Cloud%20Save.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/490376-automatic-evolve-save-upload-to-gist
// https://github.com/Alistair1231/my-userscripts/raw/master/EvolveIdleSavegameBackup.user.js

/*
# Evolve Idle Cloud Save

I lost my save game 😞, so I created a quick backup solution using GitHub Gist to store save data. 

### Key Features:
- **Automatic Upload:** On first use, you'll be prompted to enter your Gist ID and Personal Access Token. These credentials are stored as plain text in the Userscript storage. The token must have the `gist` scope.
- **Manual Setup:** You need to manually create the Gist and enter its ID in the settings. 
- **Export Settings:** Saves are exported to the filename specified in the settings.
- **Import Flexibility:** Import your save from any file in the Gist, making it easy to restore data after switching devices or PCs.
- **Backup Options:**
  - Automatic backups are performed every 10 minutes.
  - Manual backups can be triggered by clicking the "Save to" button.
- **Advanced Use:** The `evolveCloudSave` object is exposed to the window, allowing for manual interaction.

With this setup, your progress is secure, and you can easily transfer your saves between devices.

![UI changes](https://i.imgur.com/G1QCIXU.png)
*/

;(async function () {
  'use strict'
  /**
   * Settings utility object for managing localStorage data
   */
  const storage = {
    /**
     * Retrieves and parses a JSON value from localStorage
     * @async
     * @param {string} key - Storage key to retrieve
     * @returns {Promise<any>} Parsed JSON value
     */
    get: async (key) => {
      key = `evolveCloudSave_${key}`
      const value = localStorage[key]
      return value === undefined ? null : JSON.parse(value)
    },

    /**
     * Stringifies and stores a value in localStorage
     * @async
     * @param {string} key - Storage key to set
     * @param {any} value - Value to stringify and store
     * @returns {Promise<string>} Stringified value that was stored
     */
    set: async (key, value) => {
      key = `evolveCloudSave_${key}`
      return (localStorage[key] = JSON.stringify(value))
    },

    /**
     * Lists all storage keys after splitting on underscore
     * @async
     * @returns {Promise<string[]>} Array of storage key second parts
     */
    list: async () => {
      let keys = Object.keys(localStorage)
      // filter out keys that don't start with "evolveCloudSave_"
      keys = keys.filter((key) => key.startsWith('evolveCloudSave_'))
      // remove the "evolveCloudSave_" prefix
      keys = keys.map((key) => key.replace('evolveCloudSave_', ''))
      return keys
    },

    /**
     * Removes an item from localStorage
     * @async
     * @param {string} key - Storage key to delete
     * @returns {Promise<void>}
     */
    delete: async (key) => {
      key = `evolveCloudSave_${key}`
      delete localStorage[key]
    },
  }

  /**
   * Waits for an element matching the selector to appear in the DOM
   * @param {string} selector - CSS selector to match element
   * @param {function} callback - Function to execute when element is found
   * @param {number} [interval=100] - Time in ms between checks for element
   * @param {number} [timeout=5000] - Maximum time in ms to wait before giving up
   */
  function waitFor(selector, callback, interval = 100, timeout = 5000) {
    const startTime = Date.now()
    const check = () => {
      const element = document.querySelector(selector)
      if (element) {
        callback(element)
      } else if (Date.now() - startTime < timeout) {
        setTimeout(check, interval)
      }
    }
    check()
  }

  const evolveCloudSave = {
    // Create an overlay to collect secrets from the user
    openSettings: () => {
      const saveSettings = () => {
        const gistId = document.getElementById('gist_id').value.trim()
        const token = document.getElementById('gist_token').value.trim()
        const frequency =
          document.getElementById('save_frequency').value.trim() || '10'
        const filename =
          document.getElementById('file_name').value.trim() || 'save.txt'
        if (!gistId || !token) {
          alert('Gist ID and Token are required!')
          return
        }
        storage.set('gistId', gistId)
        storage.set('token', token)
        storage.set('filename', filename)
        storage.set('frequency', frequency)
        document.body.removeChild(overlay)
      }

      const fillCurrentSettings = async () => {
        const gistId = await storage.get('gistId')
        const token = await storage.get('token')
        const filename = await storage.get('filename')
        const frequency = await storage.get('frequency')

        document.getElementById('gist_id').value = gistId || ''
        document.getElementById('gist_token').value = token || ''
        document.getElementById('file_name').value = filename || 'save.txt'
        document.getElementById('save_frequency').value = frequency || '10'
      }

      let overlay = document.createElement('div')
      overlay.innerHTML = `
        <div id="settings_overlay"
            style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000">
            <div id="settings_modal"
                style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); width: 400px">
                <div style="color: #333; font-size: 14px; margin-bottom: 15px; line-height: 1.4">
                    You will need a GistID (last part of URL when viewing a Gist) and a Personal Access Token to use this cloud-save script. Create a gist <a href="https://gist.github.com/">here</a>, and a token <a href="https://github.com/settings/tokens/new?scopes=gist&description=EvolveIdleSavegameBackup">here</a>
                </div>
                <form id="settings_form">
                    <div class="material-input" style="margin-bottom: 15px">
                        <input id="gist_id" type="text" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px">
                        <label for="gist_id" style="color: #666; font-size: 12px; margin-top: 4px; display: block">Gist ID</label>
                    </div>
                    <div class="material-input" style="margin-bottom: 15px">
                        <input id="gist_token" type="text" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px">
                        <label for="gist_token" style="color: #666; font-size: 12px; margin-top: 4px; display: block">Token with Gist scope</label>
                    </div>
                    <div class="material-input" style="margin-bottom: 15px">
                        <input id="file_name" type="text" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px">
                        <label for="file_name" style="color: #666; font-size: 12px; margin-top: 4px; display: block">Filename</label>
                    </div>
                    <div class="material-input" style="margin-bottom: 15px">
                        <input id="save_frequency" type="text" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px">
                        <label for="save_frequency" style="color: #666; font-size: 12px; margin-top: 4px; display: block">Save Frequency in minutes</label>
                    </div>
                    <button id="save_button" style="width: 100%; padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; transition: background-color 0.3s">Save</button>
                </form>
            </div>
        </div>

    `

      document.body.appendChild(overlay)
      //   clicking on overlay and esc handling
      overlay.addEventListener('click', (e) => {
        if (e.target.id === 'settings_overlay') {
          document.body.removeChild(overlay)
        }
      })
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (document.getElementById('settings_overlay')) {
            document.body.removeChild(overlay)
          }
        }
      })

      document.getElementById('save_button').addEventListener('click', (e) => {
        e.preventDefault()
        saveSettings()
        // force refresh
        location.reload()
      })

      fillCurrentSettings()
    },

    getFiles: async () => {
      const gistId = await storage.get('gistId')
      const token = await storage.get('token')

      let files = await GM_fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'GET',
        headers: { Authorization: `token ${token}` },
      })
      if (files.status === 200) {
        files = await files.json()
        return files.files
      } else {
        console.log(files)
        return {}
      }
    },

    createOrUpdateFile: async (filename, content) => {
      const files = await evolveCloudSave.getFiles()
      const gistId = await storage.get('gistId')
      const token = await storage.get('token')

      if (files[filename] === undefined) {
        let response = await GM_fetch(
          `https://api.github.com/gists/${gistId}`,
          {
            method: 'POST',
            headers: { Authorization: `token ${token}` },
            body: `{ "files": { "${filename}": { "content": "${content}" } } }`,
          }
        )
        return response
      } else {
        let response = await GM_fetch(
          `https://api.github.com/gists/${gistId}`,
          {
            method: 'PATCH',
            headers: { Authorization: `token ${token}` },
            body: `{ "files": { "${filename}": { "content": "${content}" } } }`,
          }
        )
        return response
      }
    },

    makeBackup: async () => {
      const saveString = unsafeWindow.exportGame()
      const filename = await storage.get('filename')

      const response = await evolveCloudSave.createOrUpdateFile(
        filename,
        saveString
      )
      return response
    },

    getBackup: async () => {
      const remote_files = await evolveCloudSave.getFiles()
      const remote_filename = document.getElementById(
        'cloudsave_fileSelect'
      ).value
      const content = remote_files[remote_filename].content

      document.querySelector('textarea#importExport').value = content
    },

    addButtons: async () => {
      const buttons = document.createElement('div')
      const remote_files = await evolveCloudSave.getFiles()
      const remote_filenames = Object.keys(remote_files)
      const local_filename = await storage.get('filename')

      buttons.innerHTML = `
    <div class='importExport' style='display: flex; margin-top: 1rem'>
      <button id='cloudsave_importGistButton' class='button' style='margin-top: .75rem;marging-right=1em'>Import selected</button>
      <select id='cloudsave_fileSelect' style='margin-top: .75rem'>
        ${remote_filenames.map((file) => `<option value='${file}'>${file}</option>`)}
      </select>
      </div>
      <button id='cloudsave_exportGistButton' class='button' style='margin-top: .75rem'>Save to "${local_filename}"</button>
      <br>
      <button id='cloudsave_settingsButton' class='button' style='margin-top: .75rem'>Settings</button>
    <div id='success_message' style='display: none; position: fixed; top: 20px; right: 20px; background-color: green; color: white; padding: 10px; border-radius: 5px;'>Backup successful!</div>
    `
      const div = document.querySelectorAll('div.importExport')[1]
      div.appendChild(buttons)
      document
        .getElementById('cloudsave_importGistButton')
        .addEventListener('click', () => {
          evolveCloudSave.getBackup()
        })
      document
        .getElementById('cloudsave_exportGistButton')
        .addEventListener('click', async () => {
          const response = await evolveCloudSave.makeBackup()
          if (response.status === 200) {
            const successMessage = document.getElementById('success_message')
            successMessage.style.display = 'block'
            setTimeout(() => {
              successMessage.style.transition = 'opacity 1s'
              successMessage.style.opacity = '0'
              setTimeout(() => {
                successMessage.style.display = 'none'
                successMessage.style.opacity = '1'
              }, 1000)
            }, 2000)
          }
          console.log(response)
        })
      document
        .getElementById('cloudsave_settingsButton')
        .addEventListener('click', () => {
          evolveCloudSave.openSettings()
        })
    },
  }

  waitFor('div#main', async () => {
    GM.addStyle(`
        .material-input {
          position: relative;
          margin-top: 15px;
          font-size: 14px;
      }

      .material-input input {
          width: 100%;
          padding: 10px 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          outline: none;
      }

      .material-input input:focus {
          border-color: #6200ee;
      }

      .material-input label {
          position: absolute;
          top: 50%;
          left: 10px;
          transform: translateY(-50%);
          transition: all 0.2s ease-out;
          color: #999;
          font-size: 14px;
          pointer-events: none;
          background: white;
          padding: 0 4px;
      }

      .material-input input:focus + label,
      .material-input input:not(:placeholder-shown) + label {
          top: -8px;
          transform: translateY(0);
          font-size: 12px;
          color: #6200ee;
      }`)
    const gistId = await storage.get('gistId')
    const token = await storage.get('token')
    const frequency = await storage.get('frequency')

    if (gistId === null || token === null) {
      evolveCloudSave.openSettings()
      return
    } else {
      evolveCloudSave.addButtons()

      // run every 10 minutes
      setInterval(evolveCloudSave.makeBackup, 1000 * 60 * frequency)

      // export for manual use
      unsafeWindow.evolveCloudSave = evolveCloudSave
      unsafeWindow.evolveCloudSave.settings = storage
    }
  })
})()
