// ==UserScript==
// @name        Neopets Training Timer
// @description notification for training schools on neopets
// @version     1.1
// @author      systematic-meerca
// @match       *://www.neopets.com/*
// @grant       GM.setValue
// @grant       GM.getValue
// @namespace https://greasyfork.org/users/1453361
// @downloadURL https://update.greasyfork.org/scripts/531643/Neopets%20Training%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/531643/Neopets%20Training%20Timer.meta.js
// ==/UserScript==

(async () => {
    const TYPES = { PIRATE: 'pirate', MYSTERY: 'mystery', NINJA: 'ninja' };
    /** ======== v CUSTOMIZATION OPTIONS BELOW v ============**/
    //  If you only want some school to appear in your report, remove the undesired ones from below:
    const SHOW_SCHOOLS = [
        TYPES.PIRATE, // Swashbuckling Academy
        TYPES.MYSTERY, // Mystery Island Training School
        TYPES.NINJA // Secret Ninja Academy
    ];

    // If you want links to open in a new tab instead of current
    const CLICKED_LINKS_TO_NEW_TAB = true;

  	// PERSIST_OPEN_STATE: If you open/close the details on one page, it'll remember on the next page.
    // If persist_open_state is true, the tool will remember if you opened the details panel when you change pages.
    // If persist_open_state is false, the details panel will be always be closed when a new page loads
  	const PERSIST_OPEN_STATE = false;

    // Replace the URLs below with your favorite item or images if you'd like.
    //  NONE_TRAINING_ICON - will appear when no pets are in training
    const NONE_TRAINING_ICON = "//images.neopets.com/items/slu_greentea.gif";
    //  TRAINING_IN_PROGRESS_ICON - will appear at least 1 pet is in training
    const TRAINING_IN_PROGRESS_ICON = "//images.neopets.com/items/bd_krawk_sword.gif";
    // TRAINING_COMPLETE_ICON - Appears if 1 or more pet is done training. If this value is "",
    //                          then icon will represent one of the training schools where a pet is waiting.
    const TRAINING_COMPLETE_ICON = "";
    /** ======== ^ CUSTOMIZATION OPTIONS ABOVE ^ ============ **/


    const SCHOOL_DATA = {
        [TYPES.PIRATE]: {
            name: 'Swashbuckling Academy',
            link: '//www.neopets.com/pirates/academy.phtml?type=status',
            completeIcon: '//images.neopets.com/items/dubloon5.gif'
        },
        [TYPES.MYSTERY]: {
            name: 'Mystery Island Training School',
            link: '//www.neopets.com/island/training.phtml?type=status',
            completeIcon: "//images.neopets.com/items/codestone5.gif"
        },
        [TYPES.NINJA]: {
            name: 'Secret Ninja Training School',
            link: '//www.neopets.com/island/fight_training.phtml?type=status',
            completeIcon: '//images.neopets.com/items/codestone15.gif'
        }
    }

    const STORAGE = 'training-storage';
    const NOW = new Date().getTime();
    const PROPS = {
        timersOpen: false,
        trainingComplete: false,
        completeTrainingLocation: [],
        petsInTraining: false
    };
    const getPetData = async () => {
      return JSON.parse(await GM.getValue(STORAGE, '{}'));
    }
    const petData = await getPetData();
    // Start pet status check / validation:
    const updateTrainingData = (school) => {
        const timeCells = [];
        const xpr = document.evaluate(`//td[contains(text(), 'Time till course finishes : ')]`, document, null, 7, null);
        for (let i = 0; item = xpr.snapshotItem(i); i++) {
            timeCells.push({cell: item, complete: false});
        }
        const completeXpr = document.evaluate(`//td[.//b[contains(text(),'Course Finished!')]]`, document, null, 7, null);
        for (let i = 0; item = completeXpr.snapshotItem(i); i++) {
            if (!item.classList.contains('content')) {
                timeCells.push({cell: item, complete: true});
            }
        }
        petData[school] = timeCells.map(({cell, complete}) => {
            const petname = cell.parentElement.firstChild.innerHTML.match(/neopets.com\/cpn\/(.+)\/1\/2.png/g)[0].split('/')[2];
            let totalTime = -1;
            if (!complete) {
                const time = cell.innerText.match(/(\d+)/g);
                let cookie = 0;
                if (cell.innerHTML.includes("strikethrough")) cookie = 3;
                totalTime = (
                    Number.parseInt(time[0+cookie]) * 60 * 60 * 1000 //hours
                    + Number.parseInt(time[1+cookie]) * 60 * 1000 //min
                    + Number.parseInt(time[2+cookie]) * 1000 //sec
                );
            }

            return {
                name: petname,
                endTime: NOW + totalTime
            }

        });
        GM.setValue(STORAGE, JSON.stringify(petData));
    }


    const processTraining = () => {
        const congrats = document.evaluate(`//p[contains(text(), 'Congratulations! ')]`, document, null, 7, null).snapshotItem(0);
        if (congrats) {
            console.log("congr")
            const petName = congrats.innerHTML.match(/<b>(.+)<\/b>/)[1];
            for (key in SCHOOL_DATA) {
                console.log("key", key)
                if (petData[key]) {
                    console.log("petdata ey", petData[key])
                    petData[key] = petData[key].filter(pet => petName != pet.name);
                }
            }
        }
        GM.setValue(STORAGE, JSON.stringify(petData));
    }

    const checkPetsInTraining = () => {
        PROPS.completeTrainingLocation = [];
        const types = Object.values(TYPES);
        types.forEach(school => {
            if (petData[school] && petData[school].length) {
                petData[school].forEach(pet => {
                    PROPS.petsInTraining = true;
                    if (pet.endTime <= NOW) {
                        PROPS.trainingComplete = true;
                        PROPS.completeTrainingLocation.push(school);
                    }
                });
            }
        });
    }

    for (key in SCHOOL_DATA) {
        if (location.href.includes(SCHOOL_DATA[key].link)) {
            updateTrainingData(key);
            break;
        }
    }

    if (location.href.includes("/process_training.phtml")) {
        processTraining();
    }
    checkPetsInTraining();



    // Start display-related functions:
    const getTrainingIcon = () => {
        if (PROPS.trainingComplete) {
            if (TRAINING_COMPLETE_ICON) {
                return TRAINING_COMPLETE_ICON;
            } else {
                if (PROPS.completeTrainingLocation && PROPS.completeTrainingLocation.length) {
                    return SCHOOL_DATA[PROPS.completeTrainingLocation[0]].completeIcon;
                }
            }
        }
        if (PROPS.petsInTraining) {
            return TRAINING_IN_PROGRESS_ICON;
        }
        return NONE_TRAINING_ICON;
    };

const setDisplayIcon = async ()=> {
    const petData = await getPetData();
    const element = `
  <style>
    #trainingTimers {
        position: fixed;
        bottom: 20px;
        right: 30px;
        z-index: 1000;
    }
    #trainingTimersToggleContainer {
    	text-align: right;
    }
    .trainingIcon {
      width: 50px;
      height: 50px;
      border-radius: 25px;
    }
    .trainingIcon.inProgress {
      opacity: 0.7;
    }
    .trainingIcon.complete {
        border: 6px solid orange;
    }
    .pointer {
        cursor: pointer;
    }
    #trainingTimersReport {
	    width: 260px;
        border: 2px solid #EFEFEF;
        background: white;
    }

    .trainingCompleteHeader {
        background-color: orange;
    }
    .trainingTimerPets {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        flex-direction: row;
    }
    .trainingTimerPets-detail{
        display: flex;
        align-items: center;
        width:60%;
    }
    .trainingTimerPets-time {
        width: 40%;
    }
    .trainingTimesHiddenItem {
        display: none;
    }
    ${document.getElementById("content") == null ? `
    #trainingTimers .sidebarHeader {
        background-color: #676B6C;
        border-bottom: 2px solid #C9C9C9;
        color: #000000;
    }
    #trainingTimers .sidebarHeader {
        height: 22px;
        font-weight: bold;
        text-align: left;
        padding-left: 3px;
    }
    #trainingTimers .sidebarHeader A:link, #trainingTimers .sidebarHeader A:hover, #trainingTimers .sidebarHeader A:visited {
        color: #A0EFE3;
    }
    #trainingTimers .sidebarHeader A:link, #trainingTimers .sidebarHeader A:hover, #trainingTimers .sidebarHeader A:visited {
        text-decoration: none;
    }
    #trainingTimers A:link, #trainingTimers A:visited {
        color: #2E72C0;
    }
    #trainingTimers a:link, #trainingTimers a:visited, #trainingTimers a:hover {
        text-decoration: none;
    }
    #trainingTimers a {
        font-weight: bold;
    }
    ` : ''}
  </style>
  <div id="trainingTimers">
      <div id="trainingTimersReport" class="trainingTimesHiddenItem">
        ${SHOW_SCHOOLS.map((s) => {
        const schoolData = SCHOOL_DATA[s];
        return `
          <div class="schoolContainer">
            <div class="sidebarHeader
              ${PROPS.completeTrainingLocation.indexOf(s) !== -1 ? 'trainingCompleteHeader' : ''}">
              <a href="${schoolData.link}"
              ${CLICKED_LINKS_TO_NEW_TAB ? 'target="_blank"' : ''}>
                <b>${schoolData.name}</b>
                </a>
            </div>
            ${petData && petData[s] && petData[s].length ? petData[s].map(pet => {
                const timeLeft = pet.endTime - NOW;
                let hr, min, displayTime;
                if (timeLeft > 0) {
                    hr = (timeLeft) / (60 * 60 * 1000);
                    min = (hr - Math.floor(hr)) * 60;
                    displayTime = new Date(pet.endTime).toLocaleTimeString();
                }
                return `
              <div class="trainingTimerPets">
                <div class="trainingTimerPets-detail">
										<img src="//pets.neopets.com/cpn/${pet.name}/1/1.png">
										<b>${pet.name}</b>
								</div>
                <div class="trainingTimerPets-time">
                ${timeLeft > 0 ?
                    `${Math.floor(hr)}hrs, ${Math.floor(min)}mins (${displayTime})` : `<b>Complete!</b>`}
                </div>
              </div>
              `
        }).join(' ')
                : ''}
      		</div>
      `;
    }).join(' ')}
      </div>
			<div id="trainingTimersToggleContainer">
            <img
            id="trainingTimersToggleIcon"
            class="trainingIcon  ${PROPS.completeTrainingLocation.length ? 'complete' : ''} pointer"
            src="${getTrainingIcon()}">
      </div>
  </div>
  `;
    const trainingTimer = document.createElement('div');
    trainingTimer.id = "trainingTimerElementContainer";
    trainingTimer.innerHTML = element;
    const parentEl = document.getElementById("content") || document.getElementsByTagName("body")[0]
    parentEl.append(trainingTimer);

    const toggle = document.getElementById("trainingTimersToggleIcon");

  	const openDetails = (e, n, dontSave) => {
        const report = document.getElementById("trainingTimersReport");
        report.classList.toggle("trainingTimesHiddenItem");
        if (PERSIST_OPEN_STATE && !dontSave && petData) {
            petData.detailsOpened = !petData.detailsOpened;
            GM.setValue(STORAGE, JSON.stringify(petData));
        }
    }
    toggle && toggle.addEventListener('click', openDetails);

    if (PERSIST_OPEN_STATE && petData && petData.detailsOpened) {
      openDetails(null, null, true);
    }
};

await setDisplayIcon();
setInterval(async ()=>{
   const container = document.getElementById("trainingTimerElementContainer");
    if (container) {
        container.parentNode.removeChild(container);
    }
    await setDisplayIcon();
}, 60 * 1000);

})().then();