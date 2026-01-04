// ==UserScript==
// @name        Torn Crime Success Rates Logger All OCs - Torn PDA - Test
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/factions.php*
// @grant       GM_xmlhttpRequest
// @version     1.35
// @license     MIT
// @author      BillyBourbon (Bilbosaggings[2323763])
// @description A script to export the crime success rate for each role a member of the faction is in.
// @downloadURL https://update.greasyfork.org/scripts/538587/Torn%20Crime%20Success%20Rates%20Logger%20All%20OCs%20-%20Torn%20PDA%20-%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/538587/Torn%20Crime%20Success%20Rates%20Logger%20All%20OCs%20-%20Torn%20PDA%20-%20Test.meta.js
// ==/UserScript==


// ===== Constants =====


// Place The webapps Url inbetween the ''.
// You can find this on the tools and scripts channel of the unbroken family discord server
const webAppUrl = 'https://script.google.com/macros/s/AKfycbwQsfCnyqZfAy5_SP-Pd-FTC4kgrNiM4DbYa8RnoYODzjZB1S5LnuGsRgUl7DQSSfLZ/exec';

const localStorageKey = 'OCSuccessRateLogger'; // Key for where the data is stored in localStorage
const maxAttempts = 1; // Max attempts for connecting to the webapp to upload data before ending. Id suggest 3. dont do loads as youll annoy me :[
const timeBetweenCalls = 15 * 60 * 1000 // 15 minutes in ms. Takes effect after the next scheduled run. changing will not make it run sooner
const forceToRunOnEachUpdate = false // Setting to true will force the script to attempt to upload data on page load bypassing the cooldown
const selectorCrimeRoot = '#faction-crimes-root';


// ===== Helper Functions =====


// Function to get the currently signed in user.
// For use with recruiting crime roles
const getCurrentTornUser = () => {
  const user = JSON.parse(document.getElementById("torn-user").value)

  // { playername, id, avatar, role }
  return user
}

// Crime wrapper to object.
const crimeWrapperToObject = (crime, currentUser = getCurrentTornUser()) => {
  // Base crime object
  const crimeObject = {
    title : '',
    tier : 0,
    roles : {  }
  }

  const crimeTitle = crime.querySelector('.panelTitle___aoGuV').innerHTML.split(' ').join('_');
  const crimeTier = crime.querySelector('.levelValue___TE4qC').innerHTML;
  const roles = crime.querySelectorAll('.wrapper___Lpz_D');

  crimeObject.title = crimeTitle
  crimeObject.tier = crimeTier

  roles.forEach(async (role) => {
    const roleName = role.querySelector('.title___UqFNy').innerHTML.replace(/ #\d+/, "");
    const roleSuccess = role.querySelector('.successChance___ddHsR').innerHTML;
    const roleUserId = role.querySelector('.slotMenuItem___vkbGP')?.href.match(/XID=(\d+)/)[1] // Undefined on joinable roles

    if(!crimeObject.roles[roleName]) crimeObject.roles[roleName] = [  ]
    crimeObject.roles[roleName].push({
      success: roleSuccess,
      userId: roleUserId || currentUser.id // sets userId to currentUserId if its a joinable role
    });
  })

  return crimeObject
}

// Upload json data to webapps post route
const sendDataToWebApp = async (data, url) => {
  const response = await window.flutter_inappwebview.callHandler(
    'PDA_httpPost',
    url,
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'https://torn.com',
      'Referer': 'https://torn.com',
      'X-Requested-With': 'XMLHttpRequest'
    },
    JSON.stringify(data)
  );


  if (response && typeof response === "object") {
    console.log("POST Response:", response.status, response.statusText);
  } else {
    console.log("POST Response is bad", response);
  }

  return response;
}

// Check if data needs to be uploaded yet.
// If so then upload :P
const handleUpload = async () => {
  // Check theres stored crimes to send
  const storedData = JSON.parse(localStorage[localStorageKey])

  if(Object.keys(storedData.crimes).length === 0) {
    console.log('No Crimes To Upload')
    return
  }

  const currentUser = getCurrentTornUser()

  console.log(`Checking Upload Status`)
  // IF timeBetweenCalls + lastUploadTimestamp is less than now
  // OR lastUploadSuccess is false
  // OR forced run is enabled (set to true not false)
  if(forceToRunOnEachUpdate || storedData.lastUpload.success === false || Number(storedData.lastUpload.timestamp) + timeBetweenCalls < new Date().getTime()){
    console.log('Attempting to upload data')
    let attemptCounter = 0

    while(attemptCounter < maxAttempts){
      attemptCounter ++

      try{
        console.log(`Attempt Number ${attemptCounter}.`)
        // Attempt to connect to webapp via webAppUrl
        const response = await sendDataToWebApp({
          crimes: storedData.crimes,
          senderId: currentUser.id
          }, webAppUrl)

        // On bad response throw error - desktop
        // if(!response.success) throw new Error(response.message)
        if(response.status !== 302) throw new Error(`Expected redirect?? Response: ${JSON.stringify(response)}`)

        // On good response update the lastUpload in storedData
        storedData.lastUpload.timestamp = new Date().getTime()
        storedData.lastUpload.success = true

        // Clear the crimes data as its been uploaded
        storedData.crimes = {  }

        // Max retries to break while loop
        attemptCounter = maxAttempts
      } catch(e){
        // On bad response log error and wait 2000ms (2s) to retry
        console.error(`Error: `, e)
        await new Promise(resolve => setTimeout(resolve, 2000))

        // If fail and final attempt then set success to false to retry later
        if(attemptCounter === maxAttempts){
          storedData.lastUpload.success = false
        }
      }

      // Update stored data in localStorage
      console.log(`Updating Data In LocalStorage With Key '${localStorageKey}'`)
      localStorage[localStorageKey] = JSON.stringify(storedData)
    }
  } else{
    console.log(`Next Upload Scheduled For Anytime After ${
      new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour12: false
      }).format(Number(storedData.lastUpload.timestamp) + timeBetweenCalls)
    }`)
  }

}

// Convert crime wrappers to objects and insert them into the data object passed in
const handleCrimeWrapper = (crime, storedData, currentUser = getCurrentTornUser()) => {
  // Extract crime title, crime tier and crime roles from crime wrapper
  const { title, tier, roles } = crimeWrapperToObject(crime, currentUser)

  // If crime type isnt in stored data then create new entry
  if(!storedData.crimes[title]) storedData.crimes[title] = { tier, roles: {  } }

  // For each role of the crime insert role name and user/s into the stored data object
  Object.entries(roles).forEach(([ roleName, users ]) => {
    if(!storedData.crimes[title].roles[roleName]) storedData.crimes[title].roles[roleName] = {  }
    users.forEach(({ success, userId }) => {
      // If no user entry then create new entry
      // or
      // if success is greater than value stored then update
      if(!storedData.crimes[title].roles[roleName][userId] || Number(success) > Number(storedData.crimes[title].roles[roleName][userId])) {
        storedData.crimes[title].roles[roleName][userId] = success
      }
    })
  })

  return storedData
}

(async () => {
  // Wait for crime root
  while(!document.querySelector(selectorCrimeRoot)){
    console.log('Waiting For Crime Root :(')
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // run 1 time
  if (window[localStorageKey]) return;
  window[localStorageKey] = true;

  console.log('Crime Root Loaded :)')
  const crimeRoot = document.querySelector(selectorCrimeRoot)

  // Get current signed in user
  const currentUser = getCurrentTornUser()

  // Check if the script has setup the crime roles object in the localStorage.
  if(localStorage[localStorageKey] === undefined || localStorage[localStorageKey] === null) {
    localStorage[localStorageKey] = JSON.stringify({
      crimes : {  },
      lastUpload : {
        timestamp : null,
        success : false
      }
    })
  }

  if (crimeRoot) {
    // Create observer to check for new crimes
    const observer = new MutationObserver(async (mutationsList, observer) => {
      // Get storedData
      // console.log('New Mutation: ', {mutationsList})
      const storedData = JSON.parse(localStorage[localStorageKey])

      // console.log('Stored Data: ', {storedData})

      let counter = 0

      // For each change check if its a crime wrapper
      for (const mutation of mutationsList) {
        // console.log({addedNodes: mutation.addedNodes})
        if (
            mutation.type === 'childList' &&
            mutation.addedNodes.length > 0 &&
            mutation.addedNodes[0].classList !== undefined &&
            mutation.addedNodes[0].classList.contains('wrapper___U2Ap7')
           ) {
          // Oh it is :O then handle it :)
          handleCrimeWrapper(mutation.addedNodes[0], storedData, currentUser)
          counter++
        }
      }

      if(counter === 0) return

      console.log(`Added ${counter} Crimes`)

      // Update stored data in localStorage
      console.log(`Updating Data In LocalStorage With Key '${localStorageKey}'`)
      localStorage[localStorageKey] = JSON.stringify(storedData)

      // End observer callback :D
    });

    // Start observer
    observer.observe(crimeRoot, {
      childList: true,
      subtree: true
    });

    console.log('MutationObserver Started. Selector:', selectorCrimeRoot);

    // Upload data
    await handleUpload()
  } else {
    console.error('Crime Root Not Found :(');
  }
})()