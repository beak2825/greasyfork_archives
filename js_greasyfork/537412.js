// ==UserScript==
// @name     PokerMugHelper
// @version  1
// @grant    none
// @run-at   document-start
// @include  https://www.torn.com/page.php?sid=holdem*
// @include  https://www.torn.com/loader.php?sid=attack*
// @description poker-mug-script
// @namespace https://greasyfork.org/users/1407401
// @downloadURL https://update.greasyfork.org/scripts/537412/PokerMugHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/537412/PokerMugHelper.meta.js
// ==/UserScript==


const apiKey = ""
// Check if we're on the correct page
const isPokerPage = () => {
  return window.location.href.includes('torn.com/page.php?sid=holdem')
}

// Only run the script if we're on the poker page
if (!isPokerPage()) {
  console.log('Not on poker page, PokerMugHelper not running')
} else {
  // Add console log to confirm script is running
  console.log('Poker WebSocket initialized')

  // Function to check and play notification sound
  let lastPlayedTime = 0
  const playNotificationIfNeeded = (players) => {

    const now = Date.now()
    // Only play sound once every 30 seconds to avoid spamming
    if (now - lastPlayedTime < 30000) {
      return
    }

    // Look for players who are sitting out and haven't been active for 5+ minutes
    const inactivePlayers = players.filter((player) => {
      if (player.playerState !== 'Sitting out') return false
      if (!player.lastAction) return false

      // Check if last action contains a time indicator
      const lastActionText = player.lastAction.toLowerCase()
      if (lastActionText.includes('minute')) {
        // Extract the number of minutes
        const minutesMatch = lastActionText.match(/(\d+)\s*minute/)
        if (minutesMatch && parseInt(minutesMatch[1]) >= 5) {
          return true
        }
      }
      // Also match if it's been hours or days
      if (lastActionText.includes('hour') || lastActionText.includes('day')) {
        return true
      }

      return false
    })

    if (inactivePlayers.length > 0) {
      // Check if sound is enabled
      const soundToggle = document.getElementById('toggleSound')
      if (soundToggle && soundToggle.textContent.includes('ON')) {
        const soundPlayed = playNotificationSound()
        if (soundPlayed) {
          lastPlayedTime = now
        }
      }

      // Highlight inactive players in the table
      inactivePlayers.forEach((player) => {
        const row = document.getElementById(`player-row-${player.playerId}`)
        if (row) {
          row.style.backgroundColor = '#ffe6e6' // Light red background
          row.style.fontWeight = 'bold'
        }
      })

      // Show a notification message
      const statusText = document.getElementById('statusText')
      if (statusText) {
        statusText.innerHTML = `<span style="color: red; font-weight: bold;">⚠️ ${inactivePlayers.length} player(s) sitting out for 5+ minutes!</span>`
      }
    }
  }

  // Add CSS for the modal
  const addStyles = () => {
    const style = document.createElement('style')
    style.textContent = `
          .poker-modal {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgb(0,0,0);
            background-color: rgba(0,0,0,0.4);
            transition: opacity 0.3s ease;
          }

          .poker-modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 90%;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            border-radius: 5px;
            max-width: 1000px;
          }

          .poker-close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
          }

          .poker-close:hover,
          .poker-close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
          }

          .poker-player-list {
            margin-top: 20px;
            border-collapse: collapse;
            width: 100%;
          }

          .poker-player-list th, .poker-player-list td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }

          .poker-player-list tr:nth-child(even) {
            background-color: #f2f2f2;
          }

          .poker-player-list tr:hover {
            background-color: #ddd;
          }

          .poker-player-list th {
            padding-top: 12px;
            padding-bottom: 12px;
            background-color: #4CAF50;
            color: white;
          }

          .poker-controls {
            margin-top: 15px;
            text-align: right;
          }

          .poker-button {
            background-color: #4CAF50;
            color: white;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 10px;
          }

          .poker-button:hover {
            background-color: #45a049;
          }

          .attack-button {
            background-color: #f44336;
            color: white;
            padding: 4px 8px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
          }

          .attack-button:hover {
            background-color: #d32f2f;
          }

          .inactive-player {
            background-color: #ffe6e6 !important;
            font-weight: bold;
          }

          .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top-color: #4CAF50;
            animation: spin 1s ease-in-out infinite;
            margin-left: 5px;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `
    document.head.appendChild(style)
  }

  // Create the modal HTML
  const createModal = () => {
    const modal = document.createElement('div')
    modal.className = 'poker-modal'
    modal.id = 'pokerModal'

    modal.innerHTML = `
          <div class="poker-modal-content">
            <span class="poker-close">&times;</span>
            <h2>Poker Player Information</h2>
            <div id="pokerPlayerInfo">
              <table class="poker-player-list">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Level / Age</th>
                    <th>Refills / Xanax</th>
                    <th>Clothing Store</th>
                    <th>Money</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th>Game State</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="pokerPlayerList">

                </tbody>
              </table>
            </div>
            <div class="poker-controls">
              <span id="statusText"></span>
              <button id="refreshPlayers" class="poker-button">Refresh</button>
              <button id="toggleAutoRefresh" class="poker-button">Auto Refresh: OFF</button>
              <button id="toggleSound" class="poker-button">Sound: ON</button>
            </div>
          </div>
        `

    document.body.appendChild(modal)

    const closeBtn = document.querySelector('.poker-close')
    closeBtn.onclick = () => {
      document.getElementById('pokerModal').style.display = 'none'
    }

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = 'none'
      }
    }

    document.getElementById('refreshPlayers').onclick = refreshAllData

    let autoRefreshInterval
    const toggleBtn = document.getElementById('toggleAutoRefresh')
    toggleBtn.onclick = () => {
      if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval)
        autoRefreshInterval = null
        toggleBtn.textContent = 'Auto Refresh: OFF'
      } else {
        autoRefreshInterval = setInterval(refreshAllData, 30000) // Longer interval for API calls
        toggleBtn.textContent = 'Auto Refresh: ON'
      }
    }

    // Add sound toggle button
    // Add sound toggle button
    let soundEnabled = true
    const toggleSoundBtn = document.getElementById('toggleSound')
    toggleSoundBtn.onclick = () => {
      soundEnabled = !soundEnabled
      toggleSoundBtn.textContent = soundEnabled ? 'Sound: ON' : 'Sound: OFF'
    }
  }
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(587.33, audioContext.currentTime) // D5 note
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Start with a higher volume then fade out
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 1)

      // Play a second tone for a more noticeable alert
      setTimeout(() => {
        const osc2 = audioContext.createOscillator()
        osc2.type = 'sine'
        osc2.frequency.setValueAtTime(880, audioContext.currentTime) // A5 note
        osc2.connect(gainNode)

        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)

        osc2.start(audioContext.currentTime)
        osc2.stop(audioContext.currentTime + 0.8)
      }, 300)

      return true
    } catch (e) {
      console.error('Failed to play notification sound:', e)
      return false
    }
  }
  // Function to get player information from the poker table
  const scrapePlayerInfo = async () => {
    const playerWrapperClassName = 'playerPositioner___nbx0c'
    const playerIdClassName = 'opponent___ZyaTg'
    const playerStateClassName = 'state___Bf8_1'
    const playerMoneyClassName = 'potString___pM1js'

    const playerWrappers = document.getElementsByClassName(playerWrapperClassName)
    const playerInfoArr = []

    // Loop through each wrapper element
    for (let i = 0; i < playerWrappers.length; i++) {
      try {
        const wrapper = playerWrappers[i]
        const opponentElem = wrapper.getElementsByClassName(playerIdClassName)[0]
        const stateElem = wrapper.getElementsByClassName(playerStateClassName)[0]
        const moneyElem = wrapper.getElementsByClassName(playerMoneyClassName)[0]

        if (opponentElem && stateElem) {
          const playerId = opponentElem.id.replace(/\D/g, '')
          const playerState = stateElem.querySelector('span') ? stateElem.querySelector('span').innerText : 'Unknown'
          const money = moneyElem ? moneyElem.innerText : '$0'

          // Check if we have this player in the database
          const storedPlayer = await getPlayerFromDb(playerId)

          if (storedPlayer) {
            // Update the game state and money from the current UI
            storedPlayer.playerState = playerState
            storedPlayer.money = money
            playerInfoArr.push(storedPlayer)
          } else {
            // This is a new player, create a basic object
            playerInfoArr.push({
              playerId: playerId,
              playerState: playerState,
              money: money,
              playerName: null,
              age: null,
              level: null,
              lastAction: null,
              status: null,
              refills: null,
              xanax: null,
              isClothingStore: null
            })
          }
        }
      } catch (e) {
        console.log('Error getting player info:', e)
      }
    }

    return playerInfoArr
  }

  const isPlayerInactive = (player) => {
    if (player.playerState !== 'Sitting out' || !player.lastAction) return false

    const lastActionText = player.lastAction.toLowerCase()
    if (lastActionText.includes('minute')) {
      const minutesMatch = lastActionText.match(/(\d+)\s*minute/)
      if (minutesMatch && parseInt(minutesMatch[1]) >= 5) {
        return true
      }
    }
    if (lastActionText.includes('hour') || lastActionText.includes('day')) {
      return true
    }

    return false
  }

  // Function to get player data from the Torn API
  const getPlayerData = async (player) => {
    try {
      const response = await fetch(
        `https://api.torn.com/v2/user?selections=profile,personalstats&id=${player.playerId}&cat=all`,
        {
          method: 'GET',
          headers: {
            Authorization: `ApiKey ${apiKey}`
          }
        }
      )
      const data = await response.json()

      // Check if the API returned an error
      if (data.error) {
        console.error(`API Error for player ${player.playerId}:`, data.error)
        return null
      }

      // Update player object with API data
      player.playerName = data.name
      player.age = data.age
      player.lastAction = data.last_action.relative
      player.level = data.level
      player.xanax = data?.personalstats?.drugs?.xanax || 0
      player.refills = data?.personalstats?.other?.refills?.energy || 0
      player.isClothingStore = data?.job?.company_type == 5 ? 'Yes' : 'No'
      player.status = data.status.state
      player.lastUpdated = Date.now()

      // Save to database
      await savePlayerToDb(player)

      return player
    } catch (error) {
      console.error(`Error fetching data for player ${player.playerId}:`, error)
      return null
    }
  }

  const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PokerHelperDB', 1)

      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.error)
        reject(event.target.error)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Create an object store for players if it doesn't exist
        if (!db.objectStoreNames.contains('players')) {
          const store = db.createObjectStore('players', { keyPath: 'playerId' })
          store.createIndex('lastUpdated', 'lastUpdated', { unique: false })
        }
      }

      request.onsuccess = (event) => {
        const db = event.target.result
        resolve(db)
      }
    })
  }

  const savePlayerToDb = async (playerData) => {
    try {
      const db = await initializeDatabase()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['players'], 'readwrite')
        const store = transaction.objectStore('players')

        // Add timestamp to the data
        playerData.lastUpdated = Date.now()

        const request = store.put(playerData)

        request.onerror = (event) => {
          console.error('Error saving player data:', event.target.error)
          reject(event.target.error)
        }

        request.onsuccess = (event) => {
          resolve(event.target.result)
        }
      })
    } catch (error) {
      console.error('Database error when saving player:', error)
      return null
    }
  }

  const getPlayerFromDb = async (playerId) => {
    try {
      const db = await initializeDatabase()
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['players'], 'readonly')
        const store = transaction.objectStore('players')
        const request = store.get(playerId)

        request.onerror = (event) => {
          console.error('Error getting player data:', event.target.error)
          reject(event.target.error)
        }

        request.onsuccess = (event) => {
          resolve(request.result)
        }
      })
    } catch (error) {
      console.error('Database error when getting player:', error)
      return null
    }
  }

  // Helper function to create an attack button
  const createAttackButton = (playerId) => {
    const button = document.createElement('button')
    button.className = 'attack-button'
    button.textContent = 'Attack'
    button.onclick = () => {
      window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${playerId}`, '_blank')
    }
    return button
  }

  // Update the modal table with player information
  const updatePlayerTable = async () => {
    // Show status message
    const statusText = document.getElementById('statusText')

    // Get the players with any data from IndexedDB merged in
    const players = await scrapePlayerInfo()

    if (players.length === 0) {
      if (statusText) statusText.textContent = 'No poker players found.'
      return
    }

    const tableBody = document.getElementById('pokerPlayerList')
    if (!tableBody) return

    // Clear existing rows
    tableBody.innerHTML = ''

    // Add rows with current info (either from cache or empty)
    players.forEach((player) => {
      const row = document.createElement('tr')
      row.id = `player-row-${player.playerId}`

      // Check if player is inactive (sitting out for 5+ minutes)
      const inactive = isPlayerInactive(player)
      if (inactive) {
        row.classList.add('inactive-player')
      }

      // Show what we know already or loading indicators
      let nameContent = player.playerName || 'Loading... <div class="loading-spinner"></div>'
      let ageContent = player.age && player.level ? `${player.age} / ${player.level}` : '...'
      let refillsContent = player.refills && player.xanax ? `${player.refills} / ${player.xanax}` : '...'
      let clothingContent = player.isClothingStore || '...'
      let moneyContent = player.money || '$0'
      let statusContent = player.status || '...'
      let lastActionContent = player.lastAction || '...'

      // Highlight last action text if inactive
      if (inactive) {
        lastActionContent = `<span style="color: red; font-weight: bold;">${lastActionContent}</span>`
      }

      row.innerHTML = `
            <td id="name-${player.playerId}">${nameContent}</td>
            <td id="age-${player.playerId}">${ageContent}</td>
            <td id="refills-${player.playerId}">${refillsContent}</td>
            <td id="clothing-${player.playerId}">${clothingContent}</td>
            <td id="money-${player.playerId}">${moneyContent}</td>
            <td id="status-${player.playerId}">${statusContent}</td>
            <td id="lastAction-${player.playerId}">${lastActionContent}</td>
            <td id="state-${player.playerId}">${player.playerState}</td>
            <td id="actions-${player.playerId}"></td>
          `
      tableBody.appendChild(row)

      // Add attack button
      const actionsCell = document.getElementById(`actions-${player.playerId}`)
      if (actionsCell) {
        actionsCell.appendChild(createAttackButton(player.playerId))
      }
    })

    // Check for inactive players and play notification if needed
    const soundToggle = document.getElementById('toggleSound')
    if (soundToggle && soundToggle.textContent.includes('ON')) {
      playNotificationIfNeeded(players)
    }

    // Determine which players need to be fetched (missing data or sitting out)
    const playersToFetch = players.filter((player) => !player.playerName || player.playerState === 'Sitting out')

    if (statusText) {
      if (playersToFetch.length > 0) {
        statusText.textContent = `Fetching data for ${playersToFetch.length} players...`
      } else {
        statusText.textContent = 'Using cached data for all players.'
      }
    }

    // Process players that need to be fetched
    if (playersToFetch.length > 0) {
      let completedCount = 0

      // Process players in batches to avoid overwhelming the API
      const batchSize = 3
      for (let i = 0; i < playersToFetch.length; i += batchSize) {
        const batch = playersToFetch.slice(i, i + batchSize)

        // Process each player in the batch in parallel
        await Promise.all(
          batch.map(async (player) => {
            try {
              console.log(`Fetching data for player: ${player.playerId}, state: ${player.playerState}`)

              const apiData = await getPlayerData(player)
              completedCount++

              if (statusText) {
                statusText.textContent = `Updated ${completedCount}/${playersToFetch.length} players`
              }

              if (apiData) {
                // Update the row with API data
                document.getElementById(`name-${player.playerId}`).innerHTML = apiData.playerName
                document.getElementById(`age-${player.playerId}`).textContent = `${apiData.age} / ${apiData.level}`
                document.getElementById(`refills-${player.playerId}`).textContent =
                  `${apiData.refills} / ${apiData.xanax}`
                document.getElementById(`clothing-${player.playerId}`).textContent = apiData.isClothingStore
                document.getElementById(`money-${player.playerId}`).textContent = apiData.money
                document.getElementById(`status-${player.playerId}`).textContent = apiData.status

                // Check if we need to highlight last action
                const lastActionCell = document.getElementById(`lastAction-${player.playerId}`)
                if (lastActionCell) {
                  if (isPlayerInactive(apiData)) {
                    lastActionCell.innerHTML = `<span style="color: red; font-weight: bold;">${apiData.lastAction}</span>`
                    const row = document.getElementById(`player-row-${player.playerId}`)
                    if (row) row.classList.add('inactive-player')
                  } else {
                    lastActionCell.textContent = apiData.lastAction
                  }
                }

                document.getElementById(`state-${player.playerId}`).textContent = apiData.playerState
              } else {
                // Update with error message
                document.getElementById(`name-${player.playerId}`).innerHTML = 'API Error'
                document.getElementById(`age-${player.playerId}`).textContent = '-'
                document.getElementById(`refills-${player.playerId}`).textContent = '-'
                document.getElementById(`clothing-${player.playerId}`).textContent = '-'
                document.getElementById(`status-${player.playerId}`).textContent = '-'
                document.getElementById(`lastAction-${player.playerId}`).textContent = '-'
              }
            } catch (error) {
              console.error(`Error processing player ${player.playerId}:`, error)
              document.getElementById(`name-${player.playerId}`).innerHTML = 'Error'
            }
          })
        )

        // Small delay between batches to be nice to the API
        if (i + batchSize < playersToFetch.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }
    }

    // After all updates, check again for inactive players
    const inactivePlayers = players.filter(isPlayerInactive)

    // Update status message
    if (statusText) {
      if (inactivePlayers.length > 0) {
        statusText.innerHTML = `<span style="color: red; font-weight: bold;">⚠️ ${inactivePlayers.length} player(s) sitting out for 5+ minutes!</span> Last refresh: ${new Date().toLocaleTimeString()}`
      } else if (playersToFetch.length > 0) {
        statusText.textContent = `Data updated for ${playersToFetch.length} players. Last refresh: ${new Date().toLocaleTimeString()}`
      } else {
        statusText.textContent = `Using cached data for all ${players.length} players. Last refresh: ${new Date().toLocaleTimeString()}`
      }
    }

    return players
  }

  // Combined refresh function
  const refreshAllData = () => {
    const refreshBtn = document.getElementById('refreshPlayers')
    if (refreshBtn) {
      refreshBtn.disabled = true
      refreshBtn.innerHTML = 'Refreshing... <div class="loading-spinner"></div>'
    }

    updatePlayerTable().then(() => {
      if (refreshBtn) {
        refreshBtn.disabled = false
        refreshBtn.textContent = 'Refresh'
      }
    })
  }

  // Add keyboard shortcut to open modal
  document.addEventListener('keydown', (e) => {
    // Alt+P to toggle the modal
    if (e.altKey && e.key === 'p') {
      const modal = document.getElementById('pokerModal')
      if (modal) {
        if (modal.style.display === 'block') {
          modal.style.display = 'none'
        } else {
          modal.style.display = 'block'
          refreshAllData()
        }
      }
    }
  })

  const addMenuButton = () => {
    const linksContainer = document.getElementById('top-page-links-list')
    if (!linksContainer) {
      setTimeout(addMenuButton, 1000)
      return
    }

    const newButton = document.createElement('a')
    newButton.setAttribute('role', 'button')
    newButton.setAttribute('aria-labelledby', 'poker-helper')
    newButton.className = 'back t-clear h c-pointer line-h24 link___L22OV'

    newButton.innerHTML = `
            <span class="icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="15">
                    <path fill="#777" d="M12.4,1.4l-1.9,4.7h-7L1.6,1.4H12.4z M15.2,1.4l-2,5c-0.1,0.3-0.4,0.5-0.7,0.5h-8.8c-0.3,0-0.6-0.2-0.7-0.5l-2-5
                    C0.9,0.9,1,0.4,1.4,0.1C1.5,0,1.7,0,1.9,0h12.2c0.4,0,0.8,0.3,0.8,0.8C14.9,0.9,14.9,1.1,15.2,1.4z M13.8,8.1H2.2
                    c-0.5,0-0.8-0.3-0.8-0.8c0-0.4,0.3-0.8,0.8-0.8h11.7c0.4,0,0.8,0.3,0.8,0.8C14.6,7.8,14.3,8.1,13.8,8.1z M11.7,14.6H4.3
                    c-0.4,0-0.8-0.3-0.8-0.8c0-0.4,0.3-0.8,0.8-0.8h7.4c0.4,0,0.8,0.3,0.8,0.8C12.4,14.3,12.1,14.6,11.7,14.6z M9.5,11.4H6.5
                    c-0.4,0-0.8-0.3-0.8-0.8c0-0.4,0.3-0.8,0.8-0.8h3.1c0.4,0,0.8,0.3,0.8,0.8C10.3,11,10,11.4,9.5,11.4z"></path>
                </svg>
            </span>
            <span class="icon-label" id="poker-helper">Poker Helper</span>
        `

    // Add click event to toggle the modal
    newButton.onclick = () => {
      const modal = document.getElementById('pokerModal')
      if (modal) {
        modal.style.display = 'block'
        refreshAllData()
      }
    }

    // Insert the button before the links-footer
    const linksFooter = linksContainer.querySelector('.links-footer')
    if (linksFooter) {
      linksContainer.insertBefore(newButton, linksFooter)
    } else {
      // If no footer, just append to the end
      linksContainer.appendChild(newButton)
    }

    console.log('Poker Helper button added to menu')
  }

  // Initialize when DOM is fully loaded
  const initialize = () => {
    console.log('Initializing Poker Helper')
    addStyles()
    createModal()

    // Try to add the menu button (this will retry if the container isn't found)
    addMenuButton()

    // Also add the floating button as a fallback
    const button = document.createElement('button')
    button.textContent = 'Poker Helper'
    button.style.position = 'fixed'
    button.style.bottom = '20px'
    button.style.right = '20px'
    button.style.zIndex = '9998'
    button.style.padding = '10px'
    button.style.backgroundColor = '#4CAF50'
    button.style.color = 'white'
    button.style.border = 'none'
    button.style.borderRadius = '4px'
    button.style.cursor = 'pointer'

    button.onclick = () => {
      document.getElementById('pokerModal').style.display = 'block'
      refreshAllData()
    }

    document.body.appendChild(button)

    // Automatically open the modal
    setTimeout(() => {
      const modal = document.getElementById('pokerModal')
      if (modal) {
        modal.style.display = 'block'
        refreshAllData()
      }
    }, 1000)
  }

  // Check if document is ready or wait for it to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize)
  } else {
    initialize()
  }

  // Add a mutation observer to detect when the menu appears if it's not immediately available
  const observeForMenu = () => {
    const observer = new MutationObserver((mutations) => {
      if (document.getElementById('top-page-links-list') && !document.getElementById('poker-helper')) {
        addMenuButton()
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  // Start observing for menu
  setTimeout(observeForMenu, 2000)
}
