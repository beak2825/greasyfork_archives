// ==UserScript==
// @name        Quest Finder
// @namespace   jasper.groupironmen.questfinder
// @match       https://groupiron.men/*
// @grant       GM_addStyle
// @run-at      document-idle
// @version     2.1
// @author      JasperV
// @description Find quests selected group members have yet to complete. Requires browser versions newer than ~June 2024
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/545753/Quest%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/545753/Quest%20Finder.meta.js
// ==/UserScript==

// Possible Improvements:
// - turn all snake_case into camelCase (at least be consistent bro)
// - show result count
// - on hover over a quest, show each player's status
// - refactor code, especially into different files
// - checkbox for filtering out quests that player doesn't have required skills for
// - check skill requirements
// - check if completed required quests

// unique identifier used for css classes
const id = "questfinder"


//#region ENUMs
const QuestStatus = {
    NOT_STARTED: 'Not Started',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed'
}

/**
 * Represents the difficulty levels of quests
 * @typedef {Object} QuestDifficulty
 * @property {number} rank sorting order
 * @property {string} name The name of the difficulty level
 * @property {string} icon The URL to the icon. Both used to get the difficulty from the site's quest list,
 *                           and to show the icon again in the quest finder list.
 */
const QuestDifficulty = {
    NOVICE: {
        rank: 1,
        name: "Novice",
        icon: "/icons/3399-0.png"
    },
    INTERMEDIATE: {
        rank: 2,
        name: "Intermediate",
        icon: "/icons/3400-0.png"
    },
    EXPERIENCED: {
        rank: 3,
        name: "Experienced",
        icon: "/icons/3402-0.png"
    },
    MASTER: {
        rank: 4,
        name: "Master",
        icon: "/icons/3403-0.png"
    },
    GRANDMASTER: {
        rank: 5,
        name: "Grandmaster",
        icon: "/icons/3404-0.png"
    }
}

const SortOption = {
    ALPHABETICAL: 'Alphabetical',
    DIFFICULTY: 'Difficulty'
}
//#endregion


//#region Models
class Player
{
    constructor(name, panelElement)
    {
        this.name = name // unique identifier
        this.panelElement = panelElement // reference to the player's panel element in the DOM. used for data-gathering
        // keep track of the player's quests by status for easy filtering
        this.quests = {
            [QuestStatus.NOT_STARTED]: new Set(),
            [QuestStatus.IN_PROGRESS]: new Set(),
            [QuestStatus.COMPLETED]: new Set()
        }
    }
}

/**
 * Represents a quest with its details and player statuses.
 * @typedef {Object} Quest
 * @property {string} name unique identifier: name of the quest
 * @property {string} wiki_url The URL to the quest's runescape.wiki page
 * @property {string, QuestStatus} playerStatuses key: player name, value: quest status for this quest
 */
const Quest = {
    name: "",
    wiki_url: "",
    difficulty: QuestDifficulty.NOVICE,
}
//#endregion


/**
 * Represents the filters the user has currently selected in the UI,
 * which will be applied to the quest list
 */
const Filters = {
    playersNotStarted: [], // players that must not have started a quest for it to be included
    playersCompleted: [], // players that must have completed a quest for it to be included
    sort: SortOption.ALPHABETICAL,
    unfinished: false,
    countInProgressAsCompleted: false,

    removePlayer(player)
    {
        this.playersNotStarted = this.playersNotStarted.filter(p => p !== player)
        this.playersCompleted = this.playersCompleted.filter(p => p !== player)
    }
}

//#region quest management
const QuestManager = {
    // key = quest name, value = Quest object
    quests: new Map(),

    /**
     * @param {string} name
     * @returns {Quest | null} the quest with the given name, or null if not found
     */
    GetQuest(name)
    {
        return this.quests.get(name) || null
    },

    /**
     * Register a new quest.
     * First use GetQuest() to ensure doesnt already exist
     * @param {string} name
     * @param {string} wiki_url
     * @param {QuestDifficulty} difficulty
     * @returns {Quest} the newly created quest
     */
    AddQuest(name, wiki_url, difficulty)
    {
        const quest = Object.create(Quest)
        quest.name = name
        quest.wiki_url = wiki_url
        quest.difficulty = difficulty
        quest.statuses = {}
        
        this.quests.set(name, quest)
        return quest
    }
}


/**
 * Get all quests that match the given criteria
 * @param {Player[]} notStartedPlayers players that must not have started the quest
 * @param {Player[]} completedPlayers players that must have completed the quest
 * @param {boolean} countInProgressAsCompleted if true, in-progress quests are counted as finished
 * @returns {Set<Quest>} a set of matching quests
 */
function getMatchingQuests(notStartedPlayers, completedPlayers, countInProgressAsCompleted)
{
    if(completedPlayers.length === 0 && notStartedPlayers.length === 0)
        return new Set()

    const notStartedQuests = (player) =>
        countInProgressAsCompleted
        ? player.quests[QuestStatus.NOT_STARTED]
        : player.quests[QuestStatus.NOT_STARTED].union(player.quests[QuestStatus.IN_PROGRESS])

    let result = null

    for(const player of notStartedPlayers)
    {
        const playerNotStartedQuests = notStartedQuests(player)
        if(result === null)
            result = new Set(playerNotStartedQuests)
        else
            result = result.intersection(playerNotStartedQuests)
    }

    for(const player of completedPlayers)
    {
        const playerCompletedQuests = player.quests[QuestStatus.COMPLETED]
        if(result === null)
            result = new Set(playerCompletedQuests)
        else
            result = result.intersection(playerCompletedQuests)
    }

    return result
}
//#endregion


//#region DOM data-gathering
/**
 * Set the completion status of each quest for a given player in the QuestManager.
 * From the player's panel element in the DOM.
 * @param {Player} player
 */
function UpdateQuestStatusesForPlayer(player)
{
    const playerPanelElement = player.panelElement

    // get the currently active tab so we can restore it later
    const activeTab = playerPanelElement.querySelector('.player-panel__tab-active')
    let openOldActiveTabAfter = (activeTab != null)
    // if no tab was open, the quests tab must be closed after instead
    let closeTabAfter = (activeTab === null)

    // reset player's quest data
    for(const status of Object.values(QuestStatus))
        player.quests[status] = new Set()

    // open Quests tab in UI (it's dynamically loaded by the site, so it must be clicked for us to see the data)
    const questsButton = playerPanelElement.querySelector('button[data-component="player-quests"]')
    if(questsButton != activeTab)
        questsButton.click()
    // quest tab is already active, so it can stay open
    else
        openOldActiveTabAfter = false

    // get all quests from list
    // and store in Player.quests the completion status of each
    const questList = playerPanelElement.querySelector('.player-quests__list')
    const questLinkElements = questList.getElementsByTagName('a')
    for(const questLinkElement of questLinkElements)
    {
        const questElement = questLinkElement.querySelector('.player-quests__quest')
        const questName = questElement.textContent.trim() // .replace(/\s+/g, ' ')

        // the site gives different CSS classes
        // depending on the status of the player's quest (completed, in progress or completed)
        let questStatus = QuestStatus.NOT_STARTED
        if(questElement.classList.contains('player-quests__not-started'))
            questStatus = QuestStatus.NOT_STARTED
        else if(questElement.classList.contains('player-quests__in-progress'))
            questStatus = QuestStatus.IN_PROGRESS
        else if(questElement.classList.contains('player-quests__finished'))
            questStatus = QuestStatus.COMPLETED

        // create a quest object with info about the quest
        // or if one already exists for this quest, get that instead
        let quest = QuestManager.GetQuest(questName)
        if(!quest)
        {
            const wiki_url = questLinkElement.getAttribute('href')
            const difficultyIcon = questElement.querySelector('.player-quests__difficulty-icon').getAttribute('src')
            const difficulty = Object.values(QuestDifficulty).find(difficulty => difficulty.icon === difficultyIcon) || QuestDifficulty.NOVICE

            quest = QuestManager.AddQuest(questName, wiki_url, difficulty)
        }

        // add quest to player's quest list
        player.quests[questStatus].add(quest)
    }

    // restore old tab
    if(openOldActiveTabAfter)
        activeTab.click()
    if(closeTabAfter)
        questsButton.click()
}


/**
 * get all players in the group from the site's DOM
 * and create a Player object for them
 * @returns {Player[]}
 */
function getPlayers()
{
    const panels = document.querySelectorAll('player-panel')
    const players = []
    panels.forEach(panelElement => {
        const name = panelElement.getAttribute('player-name')
        const player = new Player(name, panelElement)
        players.push(player)
    })
    return players
}
//#endregion


//#region Update Quest List
/**
 * Updates the quest list UI based on the currently selected filters and players
 * @param {Element} quests_container the element which the list will be added to
 */
function updateQuestList(quests_container)
{
    const questsSet = getMatchingQuests(Filters.playersNotStarted, Filters.playersCompleted, Filters.countInProgressAsCompleted)

    // helper to strip leading "A ", "An ", "The " for sorting (case-insensitive)
    function stripLeadingArticle(name) 
    {
        return name.replace(/^(a |an |the )/i, '').trim()
    }

    // sort alphabetically
    let sortedQuestsArray = [...questsSet].sort((a, b) =>
        stripLeadingArticle(a.name).localeCompare(stripLeadingArticle(b.name))
    )

    // apply other sort if selected
    if(Filters.sort === SortOption.DIFFICULTY)
        sortedQuestsArray = sortedQuestsArray.sort((a, b) => a.difficulty.rank - b.difficulty.rank)

    populateQuestList(sortedQuestsArray, quests_container)
}

/**
 * Creates a list of quests using the provided set and appends it to the container in the DOM
 * @param {Quest[]} quests quests to put in container
 * @param {HTMLElement} container container to place quests in
 */
function populateQuestList(quests, container)
{
    // clear quest list
    while(container.firstChild)
        container.removeChild(container.firstChild)

    // show informative text when no quests match
    if(quests.length === 0)
    {
        const message = document.createElement("div")
        if(Filters.playersNotStarted.length === 0 && Filters.playersCompleted.length === 0)
            message.textContent = "Select players to compare"
        else
            message.textContent = "No matching quests found"
        container.appendChild(message)
    }

    // create a quest entry in the list for each given quest
    for(const quest of quests)
    {
        const link = document.createElement("a")
        link.target = "_blank"
        link.href = quest.wiki_url

        const element = document.createElement("div")
        element.classList.add(`${id}__quest__item`)//, `${id}__quest__${quest.status.toLowerCase()}`)
        link.appendChild(element)

        // Difficulty icon
        const difficultyImage = document.createElement("img")
        difficultyImage.classList.add(`${id}__quest__difficulty-image`)
        difficultyImage.src = quest.difficulty.icon
        difficultyImage.alt = quest.difficulty.name
        difficultyImage.title = quest.difficulty.name
        element.appendChild(difficultyImage)

        const nameSpan = document.createElement("span")
        nameSpan.textContent = quest.name
        element.appendChild(nameSpan)

        container.appendChild(link)
    }
}
//#endregion


//#region UI Panel Creation
/**
 * @param {Player[]} players 
 */
function createUIPanel(players)
{
    const container = document.createElement("div")
    container.id = id
    container.classList.add(`${id}__window`, `${id}-dark-background`, `${id}-border`)

    // these elements are added to body later, but created here so they can be referenced
    const body = document.createElement("div")
    const quests_container = document.createElement("div") // container for list of matching quests

    // header
    const header = createHeader(players, body, quests_container)
    container.appendChild(header)

    body.classList.add(`${id}__body`)
    container.appendChild(body)

    // title
    const playersTitle = document.createElement("h4")
    playersTitle.textContent = "Select players to compare"
    body.appendChild(playersTitle)

    // checkboxes to toggle players
    const players_container = createPlayerSelection(players, quests_container)
    body.appendChild(players_container)

    // title
    const questsTitle = document.createElement("h4")
    questsTitle.textContent = "Matching quests"
    body.appendChild(questsTitle)

    // sort by
    const sortContainer = createSortSelect(quests_container)
    body.appendChild(sortContainer)

    // exclude in-progress quests
    const excludeCheckbox = createExcludeInProgressCheckbox(quests_container)
    body.appendChild(excludeCheckbox)

    // list of matching quests
    quests_container.classList.add(`${id}__quest-list`)
    body.appendChild(quests_container)

    document.body.appendChild(container)
    updateQuestList(quests_container)

    makeDraggable(container, header)
}


/**
 * Creates the header for the quest finder UI
 * @param {Player[]} players
 * @param {Element} body body to hide when the minimise button is clicked
 * @param {Element} quests_container container for the list of matching quests
 */
function createHeader(players, body, quests_container)
{
    const header = document.createElement("div")
    header.classList.add(`${id}__header`)

    const title = document.createElement("h1")
    title.classList.add(`${id}__header__title`)
    title.textContent = "Quest Finder"
    header.appendChild(title)

    // manual refresh button
    const refreshButton = document.createElement("button")
    refreshButton.classList.add(`${id}__header__button`, 'men-button')
    refreshButton.textContent = "↻"
    refreshButton.title = "Update quest data"
    refreshButton.addEventListener("click", () =>
    {
        players.forEach(player => {
            UpdateQuestStatusesForPlayer(player)
        })
        updateQuestList(quests_container)
    })
    header.appendChild(refreshButton)

    // minimise button
    const minimiseButton = document.createElement("button")
    minimiseButton.classList.add(`${id}__header__button`, 'men-button')
    minimiseButton.textContent = "−"
    minimiseButton.addEventListener("click", () =>
    {
        body.classList.toggle("hidden")
        if(body.classList.contains("hidden"))
        {
            minimiseButton.textContent = "+"
            refreshButton.classList.add("hidden")
        }
        else
        {
            minimiseButton.textContent = "−"
            refreshButton.classList.remove("hidden")
        }
    })
    header.appendChild(minimiseButton)

    return header
}


/**
 * Creates a container for player selection checkboxes
 * @param {Player[]} players
 * @param {Element} quests_container container element which the quest list will be added to
 */
function createPlayerSelection(players, quests_container)
{
    const players_container = document.createElement("div")
    players_container.classList.add(`${id}__player-list`)

    for (let i = 0; i < players.length; i++)
    {
        const player = players[i]

        const playerContainer = document.createElement("div")
        playerContainer.classList.add(`${id}__player`)

        // checkbox
        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.id = `${id}__player-checkbox__${i}`
        checkbox.value = player.name
        checkbox.checked = false
        playerContainer.appendChild(checkbox)

        // label
        const label = document.createElement("label")
        label.textContent = player.name
        label.htmlFor = checkbox.id
        playerContainer.appendChild(label)

        // dropdown with {finished, not started}
        const filterSelect = document.createElement("select")
        filterSelect.classList.add("hidden")
        playerContainer.appendChild(filterSelect)

        const notStartedOption = document.createElement("option")
        notStartedOption.value = "not_started"
        notStartedOption.textContent = "Not Started"
        filterSelect.appendChild(notStartedOption)

        const finishedOption = document.createElement("option")
        finishedOption.value = "finished"
        finishedOption.textContent = "Finished"
        filterSelect.appendChild(finishedOption)

        // on dropdown changed, set filter & update the quest list
        filterSelect.addEventListener("change", () =>
        {
            Filters.removePlayer(player)
            
            if(checkbox.checked)
            {
                if(filterSelect.value === "finished")
                    Filters.playersCompleted.push(player)
                else
                    Filters.playersNotStarted.push(player)
            }
            else
                Filters.removePlayer(player)

            updateQuestList(quests_container)
        })

        // on checkbox change, toggle status checkbox visibility
        checkbox.addEventListener("change", () =>
        {
            if(!checkbox.checked)
                filterSelect.classList.add("hidden")
            else
                filterSelect.classList.remove("hidden")

            // trigger filterSelect change event,
            // to let it handle setting the filter and updating the quest list
            filterSelect.dispatchEvent(new Event("change"))
        })

        players_container.appendChild(playerContainer)
    }
    return players_container
}


function createSortSelect(quests_container)
{
    const sortContainer = document.createElement("div")
    sortContainer.classList.add(`${id}__sort`)

    const sortLabel = document.createElement("label")
    sortLabel.htmlFor = `${id}__sort-select`
    sortLabel.textContent = "Sort by:"
    sortContainer.appendChild(sortLabel)

    const sortSelect = document.createElement("select")
    sortSelect.id = `${id}__sort-select`
    sortSelect.classList.add(`${id}__sort-select`)
    sortContainer.appendChild(sortSelect)

    // add options based on SortOption enum
    for(const [key, value] of Object.entries(SortOption))
    {
        const optionElement = document.createElement("option")
        optionElement.value = key
        optionElement.textContent = value
        sortSelect.appendChild(optionElement)
    }

    // update the filter and automatically refresh the quest list when the user changes selection
    sortSelect.addEventListener("change", () =>
    {
        Filters.sort = SortOption[sortSelect.value]
        updateQuestList(quests_container)
    })

    return sortContainer
}


/**
 * Creates a checkbox to exclude in-progress quests from the quest list
 * @param {Element} quests_container
 * @returns {Element}
 */
function createExcludeInProgressCheckbox(quests_container)
{
    const container = document.createElement("div")
    container.classList.add(`${id}__exclude-in-progress`)

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.id = `${id}__exclude-in-progress__checkbox`
    checkbox.checked = false
    checkbox.addEventListener("change", () =>
    {
        Filters.countInProgressAsCompleted = checkbox.checked
        updateQuestList(quests_container)
    })
    container.appendChild(checkbox)

    const label = document.createElement("label")
    label.textContent = "Consider In-Progress quests as Finished"
    label.htmlFor = checkbox.id
    container.appendChild(label)

    return container
}


/**
 * Makes an element draggable
 * @param {Element} draggedElement The element to move when dragging
 * @param {Element} handle The element that the user can mousedown on to drag the element
 */
function makeDraggable(draggedElement, handle)
{
    let isDragging = false
    let offsetX = 0
    let offsetY = 0

    handle.addEventListener('mousedown', (e) => 
    {
        isDragging = true
        offsetX = e.clientX - draggedElement.getBoundingClientRect().left
        offsetY = e.clientY - draggedElement.getBoundingClientRect().top
        document.body.style.userSelect = 'none' // prevent text selection while dragging
    })

    document.addEventListener('mousemove', (e) => 
    {
        if(isDragging)
            draggedElement.style.inset = `${e.clientY - offsetY}px auto auto ${e.clientX - offsetX}px`;
    })

    document.addEventListener('mouseup', () => 
    {
        isDragging = false
        document.body.style.userSelect = '' // re-enable text selection
    })
}


function loadCSS()
{
    GM_addStyle(`
        .hidden {
            display: none !important;
        }

        .${id}-dark-background {
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAA8BAMAAAAQ3mBLAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAwUExURSQkJCUlJSYmJgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPTtHbMAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIZSURBVEjHhZbZgcQgCEBJB2IH0n+RG7lBM5uPGY8ncidgz4NI8uDYk/1MWViyhRsb+xcdXgesIxSRKLsBY5fMsGJP7LxrDvvKHi6DscDQlmS4fGO5mCX3NDXeIRr8nlOWLpctm0PWgDcgYKKk9QlvV8DBmuwDBmiOS6LZ0TMtBpxYFV1h1uIGC8176a4vmGmokdrsbzhih5p/h4G6W7yZBXd4eypbVwR3Pd4H8slR4fkThqzFRXSGh8LzSzTDi1dRa3FGnt3gqDFQg++iFUZT+RFprkjm0eCpKj9THXPo/VpiMKrjUB0zWgVI1tlo9xZPqh2eD3jJGka2bthazR3ese9wWtlrBnNj8C2ND2R4BCydwexD65cYFo8sWZuJLLzesOCL4AK7VyhqmR3o8KsHWS8zdTwzRooKw2hwCJzRrgr8jhLsUcADXgwTWGo0eXFqmpyZkr9eXjyvZ2tZHfcLJD1/FphOywweFzjwoZnNh9D83WD3sZVBtpegV2X1mc41PtCrct1gTe1/4aUU/61Lt3QlFbYaA7w14qrHyDAekiWrbQ4Fnh0uc39zEOCx6drq3Frr/IA1HgWeRIBdD5vrVwaNaJeAXbRVpMLctbVdnu8xm9sFIXjDT1XEfFxgUng0Gy0iK+DHYSgNsFSAwXYvw1DiKF9UuwJJYP8S4G6/YU32As8LzFq5YgqTvsRWqEzeLDOsNiwqMNEfNgDswkZ+o/EAAAAASUVORK5CYII=) !important;
        }
        .${id}-light-background {
            background-color: #424343;
            /* background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAA8CAYAAADi8H14AAAEbklEQVR4nOWWQXLbMAxFG49P1H23vf+JmuZlBgkMEyRAgpLcvhlENCUCn18w47ffv36+/1jk9vb28feRt9vzXIT3P99y/rx/j6FVJ0KFFmGUS9aI9ttHPCCb4Ep4cI+oRMRdAU+LN+/xYLAYJldgTGj0Zz3eyVF1hFGnjkAvcf8Yfw4ijJ5bEZXtjCizmnp6uNfKy7zloYN7jMyt5usM+6hLzNLadAXRvLes+NabA28+gic2q62S7H68PXweEVGkqFxJKuNZyKGRzn0FrPYWIYM9E735KFrgLmNXNOq1WmuGkMHVWLEtc1ePB21OBeSzuiOE/8ntomXuKpixg5m899YGV7unx0wXZJgxIQP5M3s4tIOtsNbLfQUwmYjwdAbb7o0mslgz/0XEm95e79bQI3jVzp2he0TIG6okYu7KS+910y56Pj0dEb2HV9lt7plo3/RLfjBYP7SCLiAcaS71q/Yyg6591x92ETG3mrNNFrpncAVRc6u6V4PJZ7PV4Ki5HhUdeLbJD2ewh4iMbFiezZhru1fX0WPJnYV1Os+RDDsYcQJjohJtLiYQHr17I6p1Rwl1sAWxrc0yn8GauxvRRy0ZA5+rkfzDDvaQBC0yxwNEN2hrZusINk8FkpMrIUx1sEAizOGaRbqX9StgsuSaBf1ZHayxtOamO1iTEYcZRBYrHmMFPb4a3Q62m+ohJrMGA1ubZl4ja6qwNW29MyjpYI2YxuYIQY/PhJdAWGiMSqhBLBs8EoaxRCUIt4zmGBNHoOssGwyYTAjSxT0izwg6N2ReGJslRqzoIT/RosRgxBEa+9liRWbRJjOWmCWqJ/qcsGxwz8jePYiI7T2DoUQP7ksIerwD8hPg/orobUyoNLCVS+5lYGN8XblaWnM7od50B7cM0WTNyT7fg40dTasmHk0b7IFRxAx6nR5fhYwmzAX3iOghiy0ZAR4VOUA0VuXr5bHdK7XBNVg/9Gpo7Yx75ozIrqWepvSIIDlxNaKarJn2M/APVMLSquN28Aq2UEvoK9IydcQWgy3VhnsbtWehRjSManOfZ7l69OpYSo+IKGyAOAPqEj08czGW8Gitu9vJUfFKqGXrR+htMgq1IVOfb86ots331MH2gd3IRq8O5oJcozwZ/L+RfcGjDrbcsgV2UK2h8ltIxxKz3FpiWnO7OdNkr/aKsYL7M00EesWrkXo9olrIFX3Wo8JcGJ7BiL0CGcMyz7aoMBcNxNBguIrJUVb0VpkrhAy+AlHT5DmuxJFgLKFxz2ALYu3iq4FGC3NR3dnujeRNdTBidxERu6t+NK/+DRzRCymDATFENdGcPEdYWnMZRt07Yy48GTwqJKxuaJWz6mfMhQeDxVy5jjhrkwL1CchuPIPu3ixfBltT7WcPNkissmIQ9YkdaHNnNA5/RVijdUGNbHBGhMBayaPRGlr1WafROey9DK1aWW6IJ2ZhrQTozV2Bs/V8HREtxDRNa85y5KZaHcocUclsvuERYan42mTp1ZSX6RngzR/FX4+QgWqKX+gZAAAAAElFTkSuQmCC) !important; */
        }
        .${id}-border {
            border-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAAkJCQ4ODhAQEBMTExYWFhcXFxkZGRwcHB0dHR8fHyAgICIiIiUlJSYmJicnJykpKSoqKisrKy0tLS8vLzExMTQ0NDU1NTc3Nzw8PEFBQUJCQkNDQ0ZGRkhISAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANbpKagAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7CAAAOwgEVKEqAAAADhklEQVRoQ+1a7ZKiMBD0xIWQBIEsruLqvf9bej2TD+G8Ov/YV3VVjkpwJqSZkKQnOpvbhirS/PdZxIYwTkff90M/jP1+CAElNOO0Hz8PIRyKdW1fKVOJ+lYbnQXjez4dIbVpjPfGGt8aY/BpGmjqRr5F8U7Uv9vlkrsyl6aWNr8OHQDOp+slhNqgos1mEbnOWCghcojWB/taGUupX4dwvXgrAEdfhxo1W7TirJcGIS0knnloo6BsH+xLZS5F6uDrBID7d875zkMc3g5vfHzXJZVDGU9hfrQvlKnU+vAhA9R+W23xlte22sVyW1XVbofDtvrAMVkf7GtlKavK+92QAGrbVbeXSzDtTgEs+t8TAA540j/Q/ibghAGg7fYAOGBYcboIADIPPo117iNpXyiDbyNA3wJhl7QvlB7z2nsAKBKhiwbMawVQpG3SvlDQrnXqgSAxALAiKYAiEQC8MVhNBECQCABHLIb6DBSJ8JAnLLbqgSIRPBgx/NUDRSKtRZ14oEgEDxZrEZCYaxFrNdVFVDxgAegiGrSLOMv1mLuItVzvMXZ0qVAkggdT9kCRWBNNABSJ4MGpSR4oEqOLJFoZAKBIlFGE0SkAikTg5LFp4kRTJAKAMGVc7ASJ0EV9AyoWAEUiAITGtpGTBYkBkMMWRSJMNPRMjCoUiQCwl4gxPQNKVFECL0UiTTQdRazAqzwDRWLMA+kZWSpYz+C9P3gqZZgqEgNAuj558J/uDxx7f2AT6R9lFBE80AksHkyeQ/r3/YEgETx47w+eynt/8FTe+4On8u/2ByzCKbEpPS5iEU6JTVmEU0ifSjg6D0iEU54Bi3BKbMoinBKbsvhAI0bpIhZAiU1ZhFOGKYtwym/XLMIpsSmLcHQCiwcswtEJzCScEpuyCKfEpjzCwY1LZMciHAUQD1iEU2JTFuGU2JT1g1SJTVk/SJXY9OeFF7ZMQjjn48wKW+b8l/vs+36VOLFInTg9SawYp6UJhmwf7Vz+0w+zNTmtAjy0Sp1YJlascyhiYgVeqnOpXlvsc8gA10uYMWjviROprjTXQA2Rwx8SKxq5amFSiae4/5xX8SUJCrOmScQciZwdkVMnniRWRCmmZJf7r50AzAO42fsJ7JByJFapE/Ltb4kVoi4mMUT7FFUtADZe72+QxrQmCnyJV3a9NhJ6nCTdyjpAFiYt1T6oG9I+N/1nc/sFyCqLOrY9UXkAAAAASUVORK5CYII=) 32 32/32px/4px round;
        }

        #${id} h4 {
            margin-top: 8px;
            margin-bottom: 4px;
            color: var(--orange);
            font-size: 20px;
            font-weight: 400;
        }

        .${id}__window {
            position: fixed;
            z-index: 9999;
            bottom: 16px;
            right: 16px;
            width: 320px;
            padding: 8px;
        }

        .${id}__header {
            display: flex;
            align-items: center;
        }
        .${id}__header__title {
            font-size: 1em;
            flex-grow: 1;
            margin: 0;
        }
        .${id}__header__button {
            margin-left: 8px;
        }

        .${id}__player-list {
            display: flex;
            flex-direction: column;
        }

        .${id}__player {
            padding-top: 4px;
            padding-bottom: 4px;
            display: flex;
            justify-content: space-between;
        }

        .${id}__sort-select {
            margin-left: 4px;
            margin-bottom: 8px;
        }
        
        .${id}__exclude-in-progress {
            margin-bottom: 8px;
        }

        .${id}__quest-list {
            overflow: hidden;
            overflow-y: scroll;
            max-height: 50vh;
        }

        .${id}__quest__item:hover {
            background: rgba(255,255,255,.1);
        }

        .${id}__quest__difficulty-image {
            margin-right: 4px;
        }
    `)
}
//#endregion


//#region Initialisation
let QUEST_FINDER_INITIALISED = false
function init()
{
    if(QUEST_FINDER_INITIALISED) return
    QUEST_FINDER_INITIALISED = true

    const players = getPlayers()
    players.forEach(player => {
        UpdateQuestStatusesForPlayer(player)
    })

    createUIPanel(players)
    loadCSS()
}


// wait until site is finished loading before initialising
const loadingScreen = document.getElementsByTagName("loading-screen")[0]
const observer = new MutationObserver(() =>
{
    // loading is done when the <loading-screen> gets style="display:none"
    if(loadingScreen.style.display === 'none')
    {
        // make sure it's the https://groupiron.men/group that's loaded and not another
        if(window.location.href.startsWith("https://groupiron.men/group"))
        {
            init()
            observer.disconnect()
        }
    }
})

if(loadingScreen.style.display === 'none')
    init()
else
    observer.observe(loadingScreen, { attributes: true })
//#endregion
