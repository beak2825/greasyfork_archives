// ==UserScript==
// @name         ThundrPlus
// @namespace    http://tampermonkey.net/
// @version      2025-10-25
// @description  avoid bots, save chat data and more features
// @author       YassinMi
// @match        https://thundr.com/text
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thundr.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_getValues
// @connect      ipapi.co
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534034/ThundrPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/534034/ThundrPlus.meta.js
// ==/UserScript==

//@ts-check



/**
 * @typedef {{ip:string,id:string,country:string,sex:string}} PartnerInfo
 */

/**
 * @typedef {{partnerInfo:PartnerInfo,matchedAt:Date,matchId:string}} Match
 */

/**
 * @typedef {{disconnectedAt:Date,matchId:string, from:string?, to:string}} DisconnectedArgs when disconection is pushed form me the from are nulll
 */
/**
 * @typedef {{from:"You"|"Stranger",content:string}[]} ConversationContent
 */
/**
 * @typedef {{match:Match,conversationContent:ConversationContent,disconnectedBy:"You"|"Stranger",disconnectedAt:Date}} Interaction
 */

class DBLayer {
    /**
     * 
     */
    static verifyReadyForNewMatchEntry() {
        if (this.matchesBuffer.length) {
            var latestMatchEntry = this.matchesBuffer[this.matchesBuffer.length - 1]
            if (latestMatchEntry.disconnectArgs === undefined) {
                console.warn("not ready for new match, the last match isn't properly disconnected, an implicit closure is made")
                latestMatchEntry.disconnectArgs = { disconnectedAt: new Date(), matchId: latestMatchEntry.match.matchId, from: "", to: "" }
            }
        }
    }

    /**
     * 
     * @param {string} matchId 
     * @returns {{match:Match,matchRaw:any,disconnectArgs:DisconnectedArgs?,scrapedConvo:ConversationContent?}|undefined}
     */
    static getMatchFromMatchBuffer(matchId) {
        return DBLayer.matchesBuffer.find(i => i.match.matchId === matchId);
    }

    /**
     * @type {DBLayer}
     */
    static DB = new DBLayer()
    /**
     * @type {{match:Match,matchRaw:any,disconnectArgs:DisconnectedArgs?,scrapedConvo:ConversationContent?}[]}
     */
    static matchesBuffer = []


    /**
     * @type {string?}
     */
    static latestKnownMatchId
    constructor() {

    }
    /**
     * Get all stored data
     * @returns {any}
     */
    getAllData() {
        // @ts-ignore
        var allKeys = GM_listValues()
        console.log(allKeys)
        // @ts-ignore
        const data = GM_getValues()
        const locStorageData = {...localStorage};
        const allData = { locStorage: locStorageData, GM: data }
       
        return allData
    }

   /**
    * created for a one time migration from local storage to GM storage,
    */
    copyToGMStorage(){
         //copy all keys that start with convoOf and noteOfIp_ and noteOfId_ from local storage to GM
        for (const key of Object.keys(localStorage)) {
            if (key.startsWith("convosOfId_") || key.startsWith("snapshotOfLegacyInteractions_") || key.startsWith("noteOfIp_") || key.startsWith("noteOfId_")) {
                // @ts-ignore
                GM_setValue(key, localStorage[key]);
            }
        }
    }

    /**
     * 
     * @param {string} matchId 
     * @param {ConversationContent} scrapedConvo 
     */
    updateScrapedConvoForMatchId(matchId, scrapedConvo) {
        console.log(`DB Cache: updating match entry ${matchId} with scraped convo ${scrapedConvo?.length}`)
        var matchEntry = DBLayer.getMatchFromMatchBuffer(matchId)
        if (matchEntry === undefined) {
            console.log("no such match entry registred")
            throw new Error("no such match entry registred")
        }
        else {

        }

        var maybeExists = matchEntry.scrapedConvo
        if (maybeExists) {

            if ((!scrapedConvo) || (maybeExists.length > scrapedConvo.length)) {
                return;
            }
            else {

            }
        }

        matchEntry.scrapedConvo = scrapedConvo


    }
    /**
     * 
     * @param {string} id 
     * @returns 
     */
    getInteractionssByID(id) {
        var oldData = window.localStorage.getItem("convosOfId_" + id)
        var parsedOldData = JSON.parse(oldData ?? "[]")
        return parsedOldData;
    }
    /**
     * 
     * @param {string} id 
     * return boolean
     */
    getIsIdPresentInLegacyHistory(id){
        //returns true if the id string appeans in any way in the local strorage
        return JSON.stringify(window.localStorage).includes(id)
    }
    /**
     * 
     * @param {Interaction} interaction 
     */
    addInteraction(interaction) {
        console.log("DB: saving interaction for id:", interaction)
        var oldData = window.localStorage.getItem("convosOfId_" + interaction.match.partnerInfo.id)
        var parsedOldData = JSON.parse(oldData ?? "[]")
        parsedOldData.push(interaction)
        window.localStorage.setItem("convosOfId_" + interaction.match.partnerInfo.id, JSON.stringify(parsedOldData))
        // @ts-ignore
        GM_setValue("convosOfId_" + interaction.match.partnerInfo.id, JSON.stringify(parsedOldData));
    }
    /**
     * 
     * @param {string} ip 
     * @param {string} note 
     */
    storeIPNote(ip, note) {
        console.log("DB: saving note:", note, ip)
        window.localStorage.setItem("noteOfIp_" + ip, note)
        // @ts-ignore
        GM_setValue("noteOfIp_" + ip, note);
    }
    /**
     * 
     * @param {string} ip 
     */
    getIPNote(ip) {
        return window.localStorage.getItem("noteOfIp_" + ip)
    }
    /**
     * 
     * @param {string} id 
     * @param {string} note 
     */
    storeIDNote(id, note) {
        console.log("DB: saving note:", note, id)
        window.localStorage.setItem("noteOfId_" + id, note)
        // @ts-ignore
        GM_setValue("noteOfId_" + id, note);
    }
    /**
     * 
     * @param {string} id 
     */
    getIDNote(id) {
        return window.localStorage.getItem("noteOfId_" + id)
    }
}

/**
 * this layer requires maintainance, it injects code that intercepts events and fires them in the the standard
 *  TP_MATCHED, TP_MESSAGE, TP_DISCONNECTED, TP_INIT layer 
 */
function hookEvents() {
    console.log("####### hookEvents called")
    // @ts-ignore
    if (( window)["tp_hookEvents_called"]) {
        throw new Error("hook events already called")
    }
    // @ts-ignore
    window["tp_hookEvents_called"] = true
    const originalLog = console.log;

    var matchLogDetector = /** @param {any[]} args */ function (...args) {
        if (args.length >= 2 && typeof args[0] === "string" && args[0].includes("$$$ matched! $$$")) {
            var arg = args[1]
            if (typeof arg === "object" && arg !== null && "match_id" in arg && "room" in arg && "partner" in arg) {
                return arg
            }
        }
    }
    var disconnectedLogDetector = /** @param {any[]} args */ function (...args) {
        if (args.length >= 2 && typeof args[0] === "string" && args[0].includes("$$$ user disconnected $$$")) {
            var arg = args[1]
            if (typeof arg === "object" && arg !== null && "match_id" in arg && "from" in arg && "to" in arg) {
                return arg
            }
        }
        return undefined
    }
    var disconnectedPushedFromMeLogDetector = /** @param {any[]} args */ function (...args) {
        if (args.length >= 1 && typeof args[0] === "string" && args[0].includes("$$$ push disconnect $$$")) {
            var concat = args.join("");
            var partnerId = (/**@type {string}*/(concat)).replace("$$$ push disconnect $$$", "").trim()
            return partnerId
        }
        return undefined
    }
    var experimentalPreDisconnectLog = /** @param {any[]} args */ function (...args) {
        if (args.length >= 1 && typeof args[0] === "string" && args[0].includes("fired event start_text_m")) {
            return true
        }
        return false
    }
    var experimentalLefRoomLog = /** @param {any[]} args */ function (...args) {
        if (args.length >= 1 && typeof args[0] === "string" && args[0].includes("left room")) {
            return true
        }
        return false
    }
    var startMatchLogDetector = /** @param {any[]} args */ function (...args) {
        if (args.length >= 1 && typeof args[0] === "string" && args[0].includes("$$$ start match $$$")) {
            return true
        }
        return false
    }
    //
    //$$$ push disconnect $$$ 230d75c2-d3f8-4bbb-86c0-16462add3fe7
    console.log = function (...args) {
        originalLog("fake log")
        originalLog.apply(console, args);

        var maybeMatchLogArg = matchLogDetector(...args)
        var maybeDisconnectLogArg = disconnectedLogDetector(...args)
        var maybeDisconnectFromMeLogArg = disconnectedPushedFromMeLogDetector(...args)
        var experimentalPreDisconnectLog_ = experimentalPreDisconnectLog(...args)
        var experimentalLefRoomLog_ = experimentalLefRoomLog(...args)
        var startMatchLogDetector_ = startMatchLogDetector(...args)
        if (startMatchLogDetector_) {
            console.log("####### TP_INIT fired")
            window.postMessage({ type: "TP_INIT", data: null }, "*");
        }
        else if (maybeMatchLogArg) {
            console.log(" log detected as maybeMatchLogArg")
            var arg = maybeMatchLogArg;
            const summary = {
                matchId: arg.match_id,
                matchedAt: new Date(),
                /**@type {PartnerInfo} */
                partnerInfo: { ip: arg.partner.ip, id: arg.partner.id, country: arg.partner?.country, sex: arg.partner.settings.profile.sex },

            };
            console.log("####### TP_MATCHED fired", summary)
            window.postMessage({ type: "TP_MATCHED", data: summary }, "*");
        }
        else if (maybeDisconnectLogArg) {
            console.log(" log detected as maybeDisconnectLogArg")
            //pollUpdateScrapedConvoForLatestMatch()
            var arg = maybeDisconnectLogArg;
            /**
             * @type {DisconnectedArgs}
             */
            const summary = {
                matchId: arg.match_id,
                disconnectedAt: new Date(),
                from: arg.from,
                to: arg.to
            };
            console.log("####### TP_DISCONNECTED fired", summary)
            window.postMessage({ type: "TP_DISCONNECTED", data: summary }, "*");
        }
        else if (maybeDisconnectFromMeLogArg) {
            console.log(" log detected as maybeDisconnectFromMeLogArg")
            //pollUpdateScrapedConvoForLatestMatch()
            var partnerId = maybeDisconnectFromMeLogArg;
            /**
             * @type {DisconnectedArgs}
             */
            const summary = {
                matchId: "DBLayer.latestKnownMatchId",
                disconnectedAt: new Date(),
                from: null,
                to: partnerId
            };
            console.log("####### TP_DISCONNECTED fired", summary)
            window.postMessage({ type: "TP_DISCONNECTED", data: summary }, "*");
        }
        else if (experimentalPreDisconnectLog_) {
            console.log(" log detected as experimentalPreDisconnectLog_")
            //pollUpdateScrapedConvoForLatestMatch()
        }
        else if (experimentalLefRoomLog_) {
            console.log(" log detected as experimentalLefRoomLog_")
            //pollUpdateScrapedConvoForLatestMatch()
        }
    };

}
/**
 * the part of injecting UI that relys on thundr UI and needs maintainance, only styling depends on thudr, the returned html structure does not change
 */

function injectUI_impl() {
    /**
     * @type {HTMLDivElement}
     */
    const targetDiv = /**@type {HTMLDivElement}*/(document.evaluate("//div[@class='css-17vaizm']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
    var tpRoot = document.createElement("div")
    tpRoot.classList.add("css-1pum37", "tp-panel")
    tpRoot.innerHTML = `
    <style>
    /* ThundrPlus Modern Styling - Scoped to avoid site conflicts */
    .tp-panel {
      background: linear-gradient(135deg, rgba(20, 20, 30, 0.95), rgba(10, 10, 20, 0.95));
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #ffffff;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      overflow: hidden;
      width: 640px;
      max-width: 90vw;
    }

    .tp-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px 8px;
      background: linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tp-nav-section {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 12px;
    }

    .tp-nav-buttons {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .tp-nav-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      font-size: 14px;
      color: #ffffff;
      cursor: pointer;
      padding: 6px 10px;
      transition: all 0.2s ease;
      min-width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tp-nav-btn:hover:not(:disabled) {
      background: rgba(59, 130, 246, 0.3);
      border-color: rgba(59, 130, 246, 0.5);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    }

    .tp-nav-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      background: rgba(255, 255, 255, 0.05);
    }

    .tp-cursor-status {
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.8);
      background: rgba(255, 255, 255, 0.1);
      padding: 4px 8px;
      border-radius: 6px;
      min-width: 40px;
      text-align: center;
    }

    .tp-status-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-size: 12px;
      gap: 4px;
    }

    .tp-match-id {
      font-family: 'Courier New', monospace;
      background: rgba(0, 0, 0, 0.3);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.7);
    }

    .tp-connection-status {
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
    }

    .tp-connection-status.connected {
      background: rgba(34, 197, 94, 0.2);
      color: #22c55e;
    }

    .tp-connection-status.disconnected {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }

    .tp-legacy-indicator {
      display: none;
      align-items: center;
      gap: 6px;
      color: #22c55e;
      font-weight: 600;
      font-size: 11px;
      background: rgba(34, 197, 94, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .tp-legacy-indicator.hasHistory {
      display: inline-flex;
    }

    .tp-donation-container {
      position: relative;
      display: inline-block;
      margin-top: 4px;
    }

    .tp-donation-trigger {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: help;
      transition: all 0.2s ease;
      position: relative;
    }

    .tp-donation-trigger:hover {
      color: rgba(255, 255, 255, 0.8);
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .tp-donation-tooltip {
      position: absolute;
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(20, 20, 30, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 11px;
      color: #ffffff;
      white-space: normal;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      z-index: 1000;
      margin-right: 4px;
      min-width: 180px; 
    }

    .tp-donation-tooltip::after {
      content: "";
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border: 4px solid transparent;
      border-left-color: rgba(255, 255, 255, 0.2);
    }

    .tp-donation-container:hover .tp-donation-tooltip,
    .tp-donation-container.active .tp-donation-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateY(-50%) translateX(-2px);
    }

    .tp-donation-link {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }

    .tp-donation-link:hover {
      text-decoration: underline;
    }

    .tp-content {
      padding: 12px 16px;
    }

    .tp-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 8px;
      margin-bottom: 12px;
    }

    .tp-info-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .tp-info-label {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tp-info-value {
      font-size: 13px;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      word-break: break-all;
    }

    .tp-info-value.has-history {
      color: #22c55e;
      font-weight: 600;
    }

    .tp-notes-section {
      margin-bottom: 12px;
    }

    .tp-note-group {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 8px;
    }

    .tp-note-textarea {
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      color: #ffffff;
      font-family: inherit;
      font-size: 13px;
      padding: 6px 8px;
      resize: vertical;
      min-height: 40px;
      transition: all 0.2s ease;
    }

    .tp-note-textarea:focus {
      outline: none;
      border-color: rgba(59, 130, 246, 0.5);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background: rgba(255, 255, 255, 0.08);
    }

    .tp-note-textarea::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    .tp-save-btn {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border: none;
      border-radius: 6px;
      color: #ffffff;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      padding: 6px 12px;
      transition: all 0.2s ease;
      min-width: 70px;
    }

    .tp-save-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, #2563eb, #1e40af);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .tp-save-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: rgba(255, 255, 255, 0.1);
    }

    .tp-toast {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 4px;
      color: #22c55e;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 8px;
      margin-bottom: 8px;
      text-align: center;
    }

    .tp-history-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tp-history-table th {
      background: linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 6px 6px;
      font-size: 11px;
      font-weight: 600;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tp-history-table td {
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 6px 6px;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.9);
    }

    .tp-history-table tbody tr {
      transition: background-color 0.2s ease;
    }

    .tp-history-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .tp-toggle-chat-btn {
      background: linear-gradient(135deg, #7c3aed, #a855f7);
      border: none;
      border-radius: 6px;
      color: #ffffff;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 16px;
      margin: 8px 0;
      transition: all 0.2s ease;
      width: 100%;
    }

    .tp-toggle-chat-btn:hover {
      background: linear-gradient(135deg, #6d28d9, #9333ea);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
    }

    .tp-chat-popup {
      position: absolute;
      display: flex;
      top: 80px;
      width: calc(100% - 32px);
      left: 16px;
      background: linear-gradient(135deg, rgba(15, 15, 25, 0.95), rgba(5, 5, 15, 0.95));
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      max-height: 35vh;
      flex-direction: column;
      z-index: 1000;
    }

    .tp-chat-header {
      display: flex;
      justify-content: flex-end;
      padding: 8px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: linear-gradient(90deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05));
    }

    .tp-chat-content {
      max-height: calc(100% - 50px);
      min-height: 0;
      padding: 12px;
      overflow-y: auto;
    }

    .tp-chat-content::-webkit-scrollbar {
      width: 6px;
    }

    .tp-chat-content::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }

    .tp-chat-content::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
    }

    .tp-chat-content::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    .tp-message {
      margin-bottom: 12px;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.4;
    }

    .tp-info-item.hidden {
        display: none;
    }

    .tp-message b {
      font-weight: 600;
      margin-right: 8px;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .tp-panel {
        width: 95vw;
        max-width: none;
      }

      .tp-header {
        padding: 8px 12px 6px;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .tp-content {
        padding: 8px 12px;
      }

      .tp-info-grid {
        grid-template-columns: 1fr;
        gap: 6px;
      }

      .tp-note-group {
        flex-direction: column;
        gap: 6px;
      }

      .tp-chat-popup {
        width: calc(100% - 24px);
        left: 12px;
        max-height: 30vh;
      }
    }
    </style>


    <div id="pt-panel-header" class="tp-header">
      <div class="tp-nav-section">
        <div class="tp-nav-buttons">
          <button class="tp-nav-btn" id="tp-prev-btn">▲</button>
          <button class="tp-nav-btn" disabled id="tp-next-btn">▼</button>
        </div>
        <div id="tp-cursor-status" class="tp-cursor-status">No match yet</div>
      </div>
      <div class="tp-status-section">
        <div id="tp-match-id-lbl" class="tp-match-id">1254-5468-56548-54654</div>
        <div id="tp-connected-status" class="tp-connection-status disconnected">Disconnected</div>
        <div id="tp-has-legacy-history-indicator" class="tp-legacy-indicator">history</div>
        <div class="tp-donation-container">
          <div class="tp-donation-trigger" title="You like this tool? support the developer">?</div>
          <div class="tp-donation-tooltip">
            you like this tool? 
            <a href="https://ko-fi.com/yassmi" target="_blank" class="tp-donation-link">☕ donate</a>
            <br>
            <br>
            copy <a href="#" id="share-link-anchor" class="tp-donation-link">installation link</a> to share with a friend
          </div>
        </div>
      </div>
    </div>

    <div class="tp-content">
      <div class="tp-info-grid">
        <div class="tp-info-item">
          <div class="tp-info-label">IP Address</div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div id="ip-span" class="tp-info-value">-</div>
              <button id="fetch-city-btn" class="tp-nav-btn" style="font-size: 10px; padding: 2px 6px;">City</button>
            </div>
            <div id="city-info" class="tp-info-value" style="font-size: 12px; color: rgba(255, 255, 255, 0.7); display: none;"></div>
          </div>
        </div>
        <div class="tp-info-item">
          <div class="tp-info-label">User ID</div>
          <div id="id-span" class="tp-info-value">-</div>
        </div>
        <div class="tp-info-item hidden">
          <div class="tp-info-label">IP Notes</div>
          <div id="ipNote-span" class="tp-info-value">-</div>
        </div>
        <div class="tp-info-item hidden">
          <div class="tp-info-label">ID Notes</div>
          <div id="notes-span" class="tp-info-value">-</div>
        </div>
        <div class="tp-info-item">
          <div class="tp-info-label">Country</div>
          <div id="info-span" class="tp-info-value">-</div>
        </div>
        <div class="tp-info-item">
          <div class="tp-info-label">Conversation Count</div>
          <div id="convoCount-span" class="tp-info-value">-</div>
        </div>
      </div>

      <div class="tp-notes-section">
        <div class="tp-note-group">
          <textarea rows="1" cols="50" placeholder="Write IP notes..." id="tp-ipnote-textarea" class="tp-note-textarea"></textarea>
          <button type="button" id="tp-save-ipnote-btn" class="tp-save-btn">Save</button>
        </div>
        <div class="tp-note-group">
          <textarea rows="1" cols="50" placeholder="Write ID notes..." id="tp-idnote-textarea" class="tp-note-textarea"></textarea>
          <button type="button" id="tp-save-idnote-btn" class="tp-save-btn">Save</button>
        </div>
      </div>


      <table id="history-table" class="tp-history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Msg Count</th>
            <th>Duration</th>
            <th>Last Message</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2025-04-23</td>
            <td>They skipped</td>
            <td>12</td>
            <td>5m 42s</td>
            <td>They: Thanks, got..!</td>
          </tr>
        </tbody>
      </table>

      <div id="toast-status" class="tp-toast">ready</div>

      <div style="display: flex; justify-content: center; margin-top: 10px;">
        <button id="export-data-btn" class="tp-nav-btn" style="font-size: 12px; padding: 4px 8px;">Export Data</button>
      </div>

    </div>

    <div id="tp-convo-popup" class="tp-chat-popup" style="display: none;">
      <div class="tp-chat-header">
        <button type="button" class="tp-toggle-chat-btn tp-toggle-convo-popup-btn">Hide Chat</button>
      </div>
      <div class="tp-chat-content hide-scrollbar css-1qs2dh2 tp-convo-popup">
      </div>
    </div>
    `;
    targetDiv.appendChild(tpRoot)
    return tpRoot;
}

/**
 * 
 * @returns {ConversationContent}
 */
function scrapeConversationContent() {
    /**
     * @type {ConversationContent} 
     */
    var res = []
    /**
     * @type {HTMLDivElement}
     */
    const chatRootDiv = /**@type {HTMLDivElement}*/(document.evaluate("//div[contains(@class,'css-1qs2dh2')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
    if(!chatRootDiv) throw new Error("cannot find chatRootDiv, selector may need to be updated")
    var messagesDivs = Array.from(chatRootDiv.querySelectorAll(".css-wtl4b5"))

    messagesDivs.forEach(d => {
        var from =/**@type {"Stranger"|"You"}*/(d.querySelector("b")?.innerHTML)
        var content = ""
        d.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                content += node.textContent;
            }
        });
        res.push({ from: from, content: content })
    })
    //div[@class='css-1sl5lif']
    return res;
}

class Convo {
    /**
     * 
     * @param {PartnerInfo} partnerInfo
     */
    constructor(partnerInfo) {
        this.partner = partnerInfo;
        this.messages = []
    }

}

class TPUIComponent {
    /**
     * 
     * @param {Interaction} interaction 
     */
    notifyInteractionAdded(interaction) {
        this.pages.forEach(p => {
            if (p.match.partnerInfo.ip == interaction.match.partnerInfo.ip) {
                p.interactions.push(interaction)
                if (this.pages[this._current] === p) {
                    this.pushPartnerHistoryDetail(p.interactions, p.ipNote, p.idNote, p.hasLegacyHistory);
                }
            }
        })
    }
    /**
     * @typedef {{match:Match,interactions:Interaction[], ipNote:string?,idNote:string?,dirtyIpNote:string?,dirtyIdNote:string?,pageIndex:number,disconnectedArg:DisconnectedArgs?, hasLegacyHistory:boolean}} UIPage
     */
    /**
     * @type {TPUIComponent}
     */
    static mainPanel

    /**
     * 
     * @param {HTMLDivElement} root 
     */
    constructor(root) {
        console.log("constructing TPUIComponent")
        this._root = root;

        this._cursorStatusDiv = (/**@type {HTMLDivElement} */ (this._root.querySelector("#tp-cursor-status")))
        this._connectedStatusDiv = (/**@type {HTMLDivElement} */ (this._root.querySelector("#tp-connected-status")))
        this._navPrevBtn = (/**@type {HTMLButtonElement} */ (this._root.querySelector("#tp-prev-btn")))
        this._navNextBtn = (/**@type {HTMLButtonElement} */ (this._root.querySelector("#tp-next-btn")))
        this._tpMatchHeaderDiv = (/**@type {HTMLDivElement} */ (this._root.querySelector("#tp-match-id-lbl")))
        this._ipNoteTextarea = (/**@type {HTMLTextAreaElement} */ (this._root.querySelector("#tp-ipnote-textarea")))
        this._idNoteTextarea = (/**@type {HTMLTextAreaElement} */ (this._root.querySelector("#tp-idnote-textarea")))
        this._historyTable = (/**@type {HTMLTextAreaElement} */ (this._root.querySelector('#history-table')))
        this._hasLegacyHistoryIndicator = (/**@type {HTMLDivElement} */ (this._root.querySelector("#tp-has-legacy-history-indicator")))

        this._saveIpnoteBtn = (/**@type {HTMLButtonElement} */ (this._root.querySelector("#tp-save-ipnote-btn")))
        this._saveIdnoteBtn = (/**@type {HTMLButtonElement} */ (this._root.querySelector("#tp-save-idnote-btn")))
        this._toggleConvoPopupVisibilityBtns = (/**@type {HTMLButtonElement[]} */ (Array.from(this._root.querySelectorAll(".tp-toggle-convo-popup-btn"))))
        this._convoPopupDiv = (/**@type {HTMLDivElement} */ (this._root.querySelector("#tp-convo-popup")))
        this._navPrevBtn.addEventListener("click", this._onPrevClick.bind(this))
        this._navNextBtn.addEventListener("click", this._onNextClick.bind(this))
        this._navNextBtn.addEventListener('contextmenu', (ev) => {
            ev.preventDefault();
            this._onNextToEndClick();
            return false;
        }, false);
        this._saveIpnoteBtn.addEventListener("click", this._onSaveIpnoteClick.bind(this))
        this._saveIdnoteBtn.addEventListener("click", this._onSaveIdnoteClick.bind(this))
        this._toggleConvoPopupVisibilityBtns.forEach(b => {
            b.addEventListener("click", this._onToggleConvoPopupClick.bind(this))
        })
        this._ipNoteTextarea.addEventListener("input", this._onIpNoteInputChange.bind(this));
        this._idNoteTextarea.addEventListener("input", this._onIdNoteInputChange.bind(this));
        this.isAutoPaging = true;
        this._isTransparent = false;
        /**
         * @type {UIPage[]}
         */
        this.pages = []
        this._donationTrigger = (/**@type {HTMLDivElement} */ (this._root.querySelector('.tp-donation-trigger')));
        this._donationContainer = (/**@type {HTMLDivElement} */ (this._root.querySelector('.tp-donation-container')));
        this._fetchCityBtn = (/**@type {HTMLButtonElement} */ (this._root.querySelector("#fetch-city-btn")));
        this._fetchCityBtn.addEventListener("click", this._onFetchCityClick.bind(this));
        this._exportDataBtn = (/**@type {HTMLButtonElement} */ (this._root.querySelector("#export-data-btn")));
        this._exportDataBtn.addEventListener("click", this._onExportDataClick.bind(this));
        this._shareLinkAnchor = (/**@type {HTMLAnchorElement} */ (this._root.querySelector("#share-link-anchor")));
        this._shareLinkAnchor.addEventListener("click", this._onShareLinkClick.bind(this));

        this._root.querySelector("#pt-panel-header")?.addEventListener("dblclick", (ev) => {
            if (ev.srcElement !== this._root.querySelector("#pt-panel-header")) {
                return;
            }
            console.log(ev)
            this._isTransparent = !this._isTransparent;
            this._root.style.opacity = this._isTransparent ? "0.2" : "100%"
        })
        this._current = 0;
    }

    /**
     * 
     * @param {boolean} open 
     */
    _updateConvoPopupOpenStatus(open) {
        this._isConvoPopupOpen = open;
        this._convoPopupDiv.style.display = open ? "flex" : "none";
    }
    /**
     * 
     * @param {Interaction} interaction 
     */
    _populateConvoPopupWithContent(interaction) {
        var container = /**@type {HTMLDivElement} */ (this._convoPopupDiv.querySelector(".css-1qs2dh2"));
        container.innerHTML = ""
        interaction.conversationContent.forEach(m => {
            var messageDiv = document.createElement("div")
            messageDiv.classList.add("css-wtl4b5")
            messageDiv.innerHTML = (m.from?.includes("Stranger")) ? `<b style="color: var(--chakra-colors-messages-stranger);">Stranger:</b>`
                : `<b style="color: var(--chakra-colors-messages-you);">You:</b>`
            messageDiv.appendChild(document.createTextNode(m.content));

            container?.appendChild(messageDiv);


        })
    }
    _onToggleConvoPopupClick() {
        this._updateConvoPopupOpenStatus(!this._isConvoPopupOpen);
    }
    _onDonationTriggerClick() {
        this._donationContainer.classList.toggle('active');
    }
    _onFetchCityClick() {
        const ipElement = /**@type {HTMLDivElement} */ (this._root.querySelector("#ip-span"));
        if (!ipElement) return;
        const ip = ipElement.innerText.trim();
        if (!ip || ip === "-") {
            this.pushToast("No IP address to fetch city for");
            return;
        }
        const cityInfoElement = /**@type {HTMLDivElement} */ (this._root.querySelector("#city-info"));
        if (!cityInfoElement) return;
        this._fetchCityBtn.disabled = true;
        this._fetchCityBtn.innerText = "Loading...";
        cityInfoElement.innerText = "Fetching city...";
        cityInfoElement.style.display = "block";
        // @ts-ignore
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://ipapi.co/${ip}/json/`,
            onload: (/** @type {{ responseText: string; }} */ response) => {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.city) {
                        cityInfoElement.innerText = `City: ${data.city} | region: ${data.region} | country: ${data.country_name} | ISP: ${data.org}`;
                        this.pushToast("City fetched successfully");
                    } else {
                        cityInfoElement.innerText = "City: Unknown";
                        this.pushToast("Failed to fetch city");
                    }
                } catch (e) {
                    cityInfoElement.innerText = "City: Error";
                    this.pushToast("Error parsing response");
                }
            },
            onerror: (/** @type {any} */ error) => {
                cityInfoElement.innerText = "City: Error";
                console.error("Error fetching city:", error);
                this.pushToast("Error fetching city");
            },
            ontimeout: () => {
                cityInfoElement.innerText = "City: Timeout";
                this.pushToast("Request timed out");
            }
        });
        // Re-enable button after a delay or in onload
        setTimeout(() => {
            this._fetchCityBtn.disabled = false;
            this._fetchCityBtn.innerText = "City";
        }, 1000); // Adjust as needed
    }
    _onExportDataClick() {
        const data = DBLayer.DB.getAllData();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        //example "2025-10-05 dump.json" (do not use iso)
        var now = new Date();
        const formattedName  = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, '0') + "-" + String(now.getDate()).padStart(2, '0') + " dump.json";
        a.download = formattedName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.pushToast("Data exported successfully");
    }
    _onShareLinkClick(/** @type {Event} */ event) {
        event.preventDefault();
        const link = "https://greasyfork.org/en/scripts/534034-thundrplus";
        navigator.clipboard.writeText(link).then(() => {
            this.pushToast("Link copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy link: ", err);
            this.pushToast("Failed to copy link");
        });
    }
    _onSaveIpnoteClick() {
        //save to db and update dirty note and note in the page
        if (!this._getCurrentPage()) { return }
        console.log("saving ipnote", this._getCurrentPage().dirtyIpNote)
        DBLayer.DB.storeIPNote(this._getCurrentPage().match.partnerInfo.ip, this._getCurrentPage()?.dirtyIpNote || "");
        this._getCurrentPage().ipNote = this._getCurrentPage().dirtyIpNote;
        this._refreshButtonsEnabledState()
        console.log("saved ipnote", this._getCurrentPage().dirtyIpNote)
        this.pushToast("saved note")

    }
    _onSaveIdnoteClick() {
        //save to db and update dirty note and note in the page
        if (!this._getCurrentPage()) { return }
        console.log("saving idnote", this._getCurrentPage().dirtyIdNote)
        DBLayer.DB.storeIDNote(this._getCurrentPage().match.partnerInfo.id, this._getCurrentPage()?.dirtyIdNote || "");
        this._getCurrentPage().idNote = this._getCurrentPage().dirtyIdNote;
        this._refreshButtonsEnabledState()
        console.log("saved idnote", this._getCurrentPage().dirtyIdNote)
        this.pushToast("saved note")

    }
    _onIpNoteInputChange() {
        if (!this._getCurrentPage()) {
            return;
        }
        var newNote = this._ipNoteTextarea.value
        this.pages[this._current].dirtyIpNote = newNote;

        this._refreshButtonsEnabledState()
        console.log("change detected", this._getCurrentPage()?.dirtyIpNote)
    }
    _onIdNoteInputChange() {
        if (!this._getCurrentPage()) {
            return;


        }
        var newNote = this._idNoteTextarea.value
        this.pages[this._current].dirtyIdNote = newNote;

        this._refreshButtonsEnabledState()
        console.log("change detected", this._getCurrentPage()?.dirtyIdNote)
    }

    /**
     * 
     * @param {number} current 
     */
    _updateCursor(current) {
        this._current = current;
        this._refreshButtonsEnabledState()
        this._refreshDisplayedCursor()

    }
    _refreshButtonsEnabledState() {
        this._navPrevBtn.disabled = !this._canClickPrev()
        this._navNextBtn.disabled = !this._canClickNext()
        this._saveIpnoteBtn.disabled = !this._canClickSaveIpnote()
        this._saveIdnoteBtn.disabled = !this._canClickSaveIdnote()
    }
    _refreshDisplayedCursor() {
        if (this.pages.length > 0) {
            this._cursorStatusDiv.innerHTML = `${this._current + 1}/${this.pages.length}`
        }
        else {
            this._cursorStatusDiv.innerHTML = `(no matches)`
        }
    }
    _canClickPrev() {
        return (this.pages.length > 0 && this._current > 0)
    }
    _canClickNext() {
        return (this.pages.length > 0 && this._current < this.pages.length - 1)

    }
    _getCurrentPage() {
        return this.pages[this._current]
    }
    _canClickSaveIpnote() {
        if (!this._getCurrentPage()) {
            return false;
        }
        return this._getCurrentPage() && this._getCurrentPage().ipNote !== this._getCurrentPage().dirtyIpNote
    }
    _canClickSaveIdnote() {
        if (!this._getCurrentPage()) {
            return false;
        }
        return this._getCurrentPage() && this._getCurrentPage().idNote !== this._getCurrentPage().dirtyIdNote
    }
    /**
     * 
     * @param {Event} ev
     */
    _onPrevClick(ev) {
        ev.stopPropagation();
        if (!this._canClickPrev()) return;
        this.displayPageOfIndex(this._current - 1)
    }
    /**
     * 
     * @param {Event} ev
     */
    _onNextClick(ev) {
        ev.stopPropagation();
        if (!this._canClickNext()) return;
        this.displayPageOfIndex(this._current + 1)


    }
    _onNextToEndClick() {
        if (!this._canClickNext()) return;
        this.displayPageOfIndex(this.pages.length - 1)
    }
    /**
     * 
     * @param {string} date 
     * @param {*} type 
     * @param {*} msgCount 
     * @param {*} duration 
     * @param {string?} lastMsg 
     * @param {Interaction} interactionRef 
     */
    _addTableRow(date, type, msgCount, duration, lastMsg, interactionRef) {
        const table = this._historyTable.getElementsByTagName('tbody')[0];
        const row = table.insertRow();

        const cells = [date, type, msgCount, duration, lastMsg];
        for (let i = 0; i < cells.length; i++) {
            const cell = row.insertCell();
            if (i === 0) {
                //making the date clickable to open the chat popup
                cell.innerHTML = `<a href="javascript:;">${cells[i]}</a>`
                cell.querySelector("a")?.addEventListener("click", () => {
                    this._populateConvoPopupWithContent(interactionRef)
                    this._updateConvoPopupOpenStatus(true);
                })
            }
            else if (i === 1) {
                cell.innerHTML = cells[i];//for advanced convo type styling (comes as html)
            }
            else if (i === 4) {

                const div = document.createElement("div");
                div.textContent = lastMsg;
                div.title = cells[i];

                Object.assign(div.style, {
                    maxWidth: "100px",
                    whiteSpace: "normal",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical"
                });

                cell.textContent = ""; // Clear cell's default text
                cell.appendChild(div);
            }
            else {
                cell.textContent = cells[i];
            }
            cell.style.border = "1px solid white";
            cell.style.padding = "4px";
        }
    }

    _clearTableRows() {
        const tbody = this._historyTable.getElementsByTagName('tbody')[0];
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
    }

   /**
    * 
    * @param {boolean} visible 
    */
    _toggleTableVisibility(visible) {
        this._historyTable.style.display = (!!visible) ? 'table' : 'none';
    }
    /**
     * 
     * @param {boolean} isConnected 
     * @param {string} connectedInfo 
     * @param {boolean} hasHistory 
     */
    _renderTitleState(isConnected, connectedInfo, hasHistory){
      if(!isConnected){
        //@ts-ignore
        document.title = window.originalTitle;
      }
      else{
        document.title = `${connectedInfo} ${(hasHistory ? '🟢' : '⚪')}`;
      }
    }
    /**
     * 
     * @param {string} ip 
     * @param {string} mId 
     * @param {string} id
     * @param {string} sex 
     * @param {string} country 
     */
    _renderMatchDetails(ip, mId, id, sex, country) {

        (/**@type {HTMLSpanElement} */ (this._root.querySelector("#ip-span"))).innerHTML = ip;
        (/**@type {HTMLSpanElement} */ (this._root.querySelector("#id-span"))).innerHTML = id;
        (/**@type {HTMLSpanElement} */ (this._root.querySelector("#info-span"))).innerHTML = `${sex?.toUpperCase() ?? "?"} - ${country?.toUpperCase()}`;
        const cityInfoElement = /**@type {HTMLDivElement} */ (this._root.querySelector("#city-info"));
        cityInfoElement.innerText = "";
        cityInfoElement.style.display = "none";
        this._tpMatchHeaderDiv.innerText = mId
    }
    /**
     * @param {string | number} convoCount
     * @param {Interaction?} lastInteraction
     * @param {string | null} ipNote
     * @param {string | null} idNote
     * @param {boolean} hasLegacyHistory
     */
    _renderPartnerHistory(convoCount, lastInteraction, ipNote, idNote, hasLegacyHistory) {
        const convoCountSpan = /**@type {HTMLDivElement} */ (this._root.querySelector("#convoCount-span"));
        convoCountSpan.innerHTML = convoCount?.toString() ?? "never";
        convoCountSpan.classList.toggle('has-history', !!convoCount);

        this._ipNoteTextarea.value = ipNote || "";
        this._idNoteTextarea.value = idNote || "";
        this._hasLegacyHistoryIndicator.classList.toggle('hasHistory', hasLegacyHistory);
    }
    _isInLastPageOrEmptyPage() {
        return (this.pages.length === 0) || (this._current == this.pages.length - 1);
    }
    /**
     * 
     * @param {Match} match 
     * @param {Interaction[]} interactions 
     * @param {string?} ipNote 
     * @param {string?} idNote
     * @param {boolean} hasLegacyHistory
     */
    pushPage(match, interactions, ipNote, idNote, hasLegacyHistory) {
        var shouldAutoPage = this.isAutoPaging && this._isInLastPageOrEmptyPage();
        /**
         * @type {UIPage}
         */
        var newPag = { match: match, interactions: interactions, ipNote: ipNote, idNote: idNote, dirtyIpNote: null, dirtyIdNote: null, pageIndex: this.pages.length, disconnectedArg: null, hasLegacyHistory: hasLegacyHistory }

        this.pages.push(newPag)
        this._renderTitleState(true,`${newPag?.match?.partnerInfo?.sex} - ${newPag?.match?.partnerInfo?.country}`, hasLegacyHistory);

        if (shouldAutoPage) {
            this._updateCursor(this.pages.length - 1)
            this.displayPageOfIndex(this._current)
        }
        else {
            this._updateCursor(this._current)
        }
    }
    _refreshPageConnectinStatus() {
        if (!this._getCurrentPage()) {
            this._connectedStatusDiv.innerText = ""
            this._connectedStatusDiv.classList.remove('connected', 'disconnected');
            return;
        }
        const isConnected = !this._getCurrentPage().disconnectedArg;
        this._connectedStatusDiv.innerText = isConnected ? "Connected" : "Disconnected";
        this._connectedStatusDiv.classList.toggle('connected', isConnected);
        this._connectedStatusDiv.classList.toggle('disconnected', !isConnected);
    }
    /**
     * 
     * @param {string} matchId 
     * @param {DisconnectedArgs} disconnectedArgs 
     */
    _updatePageConnectionStatus(matchId, disconnectedArgs) {
        this.pages.forEach(p => {
            if (p.match.matchId === matchId) {
                p.disconnectedArg = disconnectedArgs
            }
        })
        this._refreshPageConnectinStatus()
    }
    /**
     * 
     * @param {number} ix 
     */
    displayPageOfIndex(ix) {
        if (ix > (this.pages.length - 1)) {
            console.log("requested to diplay out of range page ", ix, this.pages)
            return;
        }
        var page = this.pages[ix]
        this.clear()
        this.pushMatch(page.match)
        this.pushPartnerHistoryDetail(page.interactions, page.ipNote, page.idNote, page.hasLegacyHistory)

        if (page.dirtyIpNote !== page.ipNote) {
            this._ipNoteTextarea.value = page.dirtyIpNote || ""
        }
        if (page.dirtyIdNote !== page.idNote) {
            this._idNoteTextarea.value = page.dirtyIdNote || ""
        }
        this._updateCursor(ix)
        this._refreshPageConnectinStatus()

    }
    clear() {
        this._clearTableRows();
        this._toggleTableVisibility(false)
    }
    /**
     * 
     * @param {Match} match 
     */
    pushMatch(match) {

        this._renderMatchDetails(match.partnerInfo.ip, match.matchId, match.partnerInfo.id, match.partnerInfo.sex, match.partnerInfo.country)
    }
    /**
     * 
     * @param {Interaction[]?} interactions 
     * @param {string?} ipNote 
     * @param {string?} idNote
     * @param {boolean} hasLegacyHistory
     */
    pushPartnerHistoryDetail(interactions, ipNote, idNote, hasLegacyHistory) {
        console.log("push history ", interactions)
        this._clearTableRows()
        /**
         * 
         * @param {string} str 
         */
        function truncateString(str) {
            return str.length > 20 ? str.slice(0, 19) + '…' : str;
        }
        if (interactions === null) {
            this._renderPartnerHistory("-", null, null, null, false)
            return;
        }
        var latestInteraction = interactions.length == 0 ? null : interactions.sort((a, b) => new Date(a.match.matchedAt).getTime() - new Date(b.match.matchedAt).getTime())[0]
        this._renderPartnerHistory(interactions.length, latestInteraction, ipNote, idNote, hasLegacyHistory)
        if (interactions && interactions.length) {
            this._toggleTableVisibility(true)
            interactions.forEach(i => {
                var msgCc = i.conversationContent.length
                var dur = getDurationString(i?.match.matchedAt, i?.disconnectedAt);
                var fullMessage = i.conversationContent.length > 0 ? (i.conversationContent[i.conversationContent.length - 1].from + i.conversationContent[i.conversationContent.length - 1].content) : null
                const date = new Date(i?.match.matchedAt);
                const friendlyDateTime = date.toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
                this._addTableRow(friendlyDateTime, getInteractionType(i), msgCc, dur, fullMessage, i)
            })
        }
        else {
            this._toggleTableVisibility(false)
        }
    }
    onCloseConvoClick() {

    }
    /**
     * 
     * @param {string} message 
     */
    pushToast(message) {
        (/**@type {HTMLSpanElement} */ (this._root.querySelector("#toast-status"))).innerText = message;
    }

}

/**
 * set up the TP UI parts and injects them in the html and have the various standard events and TP UI events integrated,
 * this contains most of the app logic 
 */
function initTPUI() {
    console.log("initTPUI called")
    // @ts-ignore
    if (window["tp_initTPUI_called"]) {
        throw new Error("initTPUI already called")
    }
    // @ts-ignore
    window["tp_initTPUI_called"] = true
    var tpRoot = injectUI_impl()
    TPUIComponent.mainPanel = new TPUIComponent(tpRoot)

    var testIp = "yassinMi"
    TPUIComponent.mainPanel.pushMatch({ matchedAt: new Date(), matchId: "yass", partnerInfo: { ip: testIp, country: "ma", sex: "M", id: "111" } })
    TPUIComponent.mainPanel.pushPartnerHistoryDetail([], null, null, false)

    window.addEventListener("message", (event) => {
        if (event.data.type === "TP_MESSAGE") {

        }
        if (event.data.type === "TP_MATCHED") {
            /**
             * @type {Match}
             */
            const m = event.data.data
            console.log("matched recieved,", m)
            const gender = m.partnerInfo.sex === 'female' ? 'F' : 'M';
            const country = m.partnerInfo.country || '??';
            const hasHistory = DBLayer.DB.getIsIdPresentInLegacyHistory(m.partnerInfo.id);
            document.title = `${gender} - ${country}${hasHistory ? '*' : ''}`;
            var interactions = DBLayer.DB.getInteractionssByID(m.partnerInfo.id);
            var idNote = DBLayer.DB.getIDNote(m.partnerInfo.id)
            var ipNote = DBLayer.DB.getIPNote(m.partnerInfo.ip)
            TPUIComponent.mainPanel.pushPage(m, interactions, ipNote, idNote, hasHistory)
            DBLayer.verifyReadyForNewMatchEntry()
            DBLayer.matchesBuffer.push({ match: m, matchRaw: null, disconnectArgs: null, scrapedConvo: null })
            DBLayer.latestKnownMatchId = m.matchId
        }
        if (event.data.type === "TP_DISCONNECTED") {
            /**
             * @type {DisconnectedArgs}
             */
            const disconnectedArgs = event.data.data;
            if(disconnectedArgs.matchId=="DBLayer.latestKnownMatchId"){
                console.warn("a disconnected event was received with matchId equal to the latest known match id")
                disconnectedArgs.matchId = DBLayer.latestKnownMatchId??"-"
            }

            pollUpdateScrapedConvoForLatestMatch()


            var matchEntry
            if (disconnectedArgs.from === null) {
                console.log("handeling diconnection from pushed")
                var latestMatchEntry = DBLayer.latestKnownMatchId === null ? null : DBLayer.getMatchFromMatchBuffer(DBLayer.latestKnownMatchId)
                if (!latestMatchEntry) {
                    throw new Error("a pushed disconnected without existing current match entry")
                }
                if (latestMatchEntry.match.partnerInfo.id !== disconnectedArgs.to) {
                    throw new Error("a pushed disconnected without existing current match entry matching the destinated partner")
                }
                matchEntry = latestMatchEntry;
            }
            else {
                console.log("handeling diconnection from user")
                matchEntry = DBLayer.getMatchFromMatchBuffer(disconnectedArgs.matchId)
                if (matchEntry === undefined) { throw new Error("cannot find match with id form disconnected args") }
            }

            if (matchEntry.disconnectArgs) {
                if (matchEntry.disconnectArgs.to !== "")
                    throw new Error("the match entry is already disconnected properly")
                else {
                    throw new Error("the match entry is already disconnected implecitly")

                }
            }
            matchEntry.disconnectArgs = disconnectedArgs;
            console.log("marked match entry as disconnected")
            TPUIComponent.mainPanel.pushToast(`disconnected from ${disconnectedArgs.matchId}`);
            /**
             * @type {"Stranger"|"You"}
             */
            var disconnectedBy;
            if (matchEntry.match.partnerInfo.id == disconnectedArgs.from) {
                disconnectedBy = "Stranger"
            }
            else if (matchEntry.match.partnerInfo.id === disconnectedArgs.to) {
                disconnectedBy = "You"

            }
            else {
                throw new Error("disconnected args from and to do not match partner id")
            }

            console.log(`the disconnected match entry had scraped convo of ${matchEntry.scrapedConvo?.length}`)
            /**
             * @type {Interaction}
             */
            var interaction = { conversationContent: matchEntry.scrapedConvo || [], disconnectedBy: disconnectedBy, match: matchEntry.match, disconnectedAt: disconnectedArgs.disconnectedAt }
            DBLayer.DB.addInteraction(interaction)
            TPUIComponent.mainPanel.notifyInteractionAdded(interaction)
            TPUIComponent.mainPanel._updatePageConnectionStatus(interaction.match.matchId, matchEntry.disconnectArgs)
            // @ts-ignore
            document.title = window.originalTitle;

        }
    });

}

(function () {
    console.log("tp script started")
    // @ts-ignore
    window.originalTitle = document.title;
    var initialized = false
    var injectedCode = hookEvents.toString();
    injectedCode = "(" + injectedCode + ")();";
    var script = document.createElement('script');
    script.textContent = injectedCode;
    
    console.log("adding event listener for TP_INIT")
    window.addEventListener("message", (event) => {
        console.log("received message event from ext", event)
        if (initialized) return;
        

        if (event.data.type === "TP_INIT") {
            console.log("received TP_INIT event, initializing")
            initialized = true


            initTPUI();
            var pollingScrap = setInterval(() => {
                pollUpdateScrapedConvoForLatestMatch()
            }, 10000);
        }
    })
    console.log("injecting script")
    document.head.appendChild(script);

})();

class AnalyticsHelper {
    
}

function pollUpdateScrapedConvoForLatestMatch() {
    try {
        if (DBLayer.latestKnownMatchId) {
            DBLayer.DB.updateScrapedConvoForMatchId(DBLayer.latestKnownMatchId, scrapeConversationContent())
        }
    }
    catch (e) {
        console.error(e);
    }

}
/**
 *
 * @param {Date | string} startDate
 * @param {Date | string} endDate
 * @returns
 */
function getDurationString(startDate, endDate) {
    let diffMs = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());

    let seconds = Math.floor(diffMs / 1000) % 60;
    let minutes = Math.floor(diffMs / (1000 * 60)) % 60;
    let hours = Math.floor(diffMs / (1000 * 60 * 60));

    return `${hours}h ${minutes}m ${seconds}s`;
}

/**
 * Returns a colored label with interaction type and who skipped.
 * @param {Interaction} interaction 
 */
function getInteractionType(interaction) {
    const whoSkipped = interaction.disconnectedBy === "Stranger" ? "they skipped" : "you skipped";
    const msgCount = interaction.conversationContent.length;

    if (msgCount === 0) {
        return `<span style="color:crimson;">empty — ${whoSkipped}</span>`;
    }

    if (msgCount < 10) {
        const color = interaction.disconnectedBy === "Stranger" ? "orangered" : "tomato";
        return `<span style="color:${color};">short — ${whoSkipped}</span>`;
    }

    const color = interaction.disconnectedBy === "Stranger" ? "mediumseagreen" : "limegreen";
    return `<span style="color:${color};">meaningful — ${whoSkipped}</span>`;
}