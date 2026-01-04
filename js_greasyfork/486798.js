// ==UserScript==
// @name         Show Total Lesson Count - WaniKani
// @namespace    https://codeberg.org/lupomikti
// @version      0.6.3
// @description  Add the count of total lessons to the Today's Lessons widget
// @license      MIT
// @author       LupoMikti
// @match        https://www.wanikani.com/*
// @grant        none
// @supportURL   https://github.com/lupomikti/Userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/486798/Show%20Total%20Lesson%20Count%20-%20WaniKani.user.js
// @updateURL https://update.greasyfork.org/scripts/486798/Show%20Total%20Lesson%20Count%20-%20WaniKani.meta.js
// ==/UserScript==

// Additional supportURL: https://community.wanikani.com/t/userscript-show-total-lesson-count/66776

/** @import { Settings } from '../WKOF Types/wkof.d.ts' */

( async function () {
    "use strict";

    /* global wkof */

    /** @typedef {{[key: string]: any}} WKOFDictionary */

    const scriptId = "show_total_lesson_count";
    const scriptName = "Show Total Lesson Count";

    const globalState = {
        initialLoad: true,
        stateStarting: false,
        todaysLessonsFrameLoaded: false,
        navBarCountFrameLoaded: false,
        hasOutputLog: false,
        turboEventBusy: false,
        mainRetryCounter: 4,
    };

    let debugLogText = `START: ${scriptName} Debug Log:\n`;
    let mainSource = "";
    const INTERNAL_DEBUG_TURBO_HANDLING = false;

    let todaysLessonsCount = 0;

    /**
     * A dictionary of string keys to any type values which will be passed to wkof Settings.Module
     * @type {WKOFDictionary} */ let settings;

    /**
     * Creates a line to be added to a log of messages output to console.debug with ISO Timestamp
     *
     * @param {string} message
     */
    function addToDebugLog( message ) {
        debugLogText += `${new Date().toISOString()}: ${message}\n`;
    }

    function printDebugLog( force = false ) {
        if ( !globalState.hasOutputLog || force ) {
            console.log(
                `${scriptName}: Outputting a debug log to console.debug()\nTo disable this setting, open "Settings > ${scriptName}" and toggle "Enable console debugging" off`,
            );
            console.debug( debugLogText );
        }
        if ( !force ) globalState.hasOutputLog = true;
        debugLogText = `START: ${scriptName} Debug Log:\n`;
    }

    if ( !window.wkof ) {
        // deno-fmt-ignore
        if (confirm(`${scriptName} requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?`)) {
            window.location.href =
                "https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549";
        }
        return;
    }

    // destructure to explicitly use wkof without window prefix
    const { wkof } = window;

    const wkofTurboEventsScriptUrl =
        "https://update.greasyfork.org/scripts/501980/1426289/Wanikani%20Open%20Framework%20Turbo%20Events.user.js";
    addToDebugLog( `Attempting to load the TurboEvents library script...` );
    await wkof.load_script( wkofTurboEventsScriptUrl, /* use_cache */ true );
    addToDebugLog( `Checking if TurboEvents library script is loaded in...` );
    const injectedDependency = document.head.querySelector( 'script[uid*="Turbo"]' );
    addToDebugLog( `Turbo Events library ${injectedDependency ? "is" : "is NOT"} loaded.` );

    if ( INTERNAL_DEBUG_TURBO_HANDLING ) {
        window.addEventListener( "turbo:load", () => {
            console.log( `DEBUG: turbo:load has fired` );
        } );
        window.addEventListener( "turbo:before-frame-render", ( e ) => {
            // @ts-ignore: the target of turbo events should be an HTMLElement, so id property would exist
            console.log( `DEBUG: turbo:before-frame-render has fired for '#${e.target?.id}'` );
        } );
        window.addEventListener( "turbo:frame-load", ( e ) => {
            // @ts-ignore: the target of turbo events should be an HTMLElement, so id property would exist
            console.log( `DEBUG: turbo:frame-load has fired for '#${e.target?.id}'` );
        } );
    }

    /**
     * Initialization function that should only be called once per page load
     *
     * @param {string} source
     */
    const _init = async ( source ) => {
        if ( globalState.stateStarting ) {
            addToDebugLog(
                `SOURCE = "${source}" | We are already in the starting state, no need to initialize, returning...`,
            );
            return;
        }
        addToDebugLog( `SOURCE = "${source}" | Setting global state and calling _start()` );
        globalState.initialLoad = globalState.stateStarting = true;
        globalState.mainRetryCounter = 4; // ensure retries are set to 4 when initializing
        globalState.hasOutputLog = globalState.todaysLessonsFrameLoaded = globalState.navBarCountFrameLoaded = false;
        await _start();
    };

    wkof.ready( "TurboEvents" ).then( () => {
        addToDebugLog( `Start of TurboEvents ready callback` );

        const urlList = [
            wkof.turbo.common.locations.dashboard,
            wkof.turbo.common.locations.items_pages,
            // vvvv Any page with the nav bar that's not one of the above locations vvvv
            /^https:\/\/www\.wanikani\.com\/(settings|level|radicals|kanji|vocabulary)(\/|\?difficulty=).+\/?$/,
        ];

        wkof.turbo.events.load.addListener( async ( _e ) => {
            globalState.turboEventBusy = true;
            await _init( "turbo:load" ).then( () => {
                globalState.turboEventBusy = false;
            } );
        }, { urls: urlList, passive: true } );

        wkof.turbo.events.before_frame_render.addListener( async ( e ) => {
            globalState.turboEventBusy = true;
            if ( e.target ) {
                const frameId = /** @type {Element} */ ( e.target ).id;
                addToDebugLog( `turbo:before-frame-render has fired for "#${frameId}"` );
                if ( globalState.initialLoad && !globalState.stateStarting ) {
                    addToDebugLog(
                        `globalState.initialLoad is true (no frames were previously retrieved) and we are not already in starting state, starting initialization sequence...`,
                    );
                    await _init( "turbo:before-frame-render" );
                    return;
                }
                // NOTE: with the widget system in place, this ID is never present anymore
                if ( frameId === "todays-lessons-frame" ) {
                    globalState.todaysLessonsFrameLoaded = false;
                }
                // NOTE: this frame still fires on the dashboard but will never load content, it should only be checked if we are on a non-dashboard URL
                else if ( frameId === "lesson-and-review-count-frame" ) {
                    globalState.navBarCountFrameLoaded = false;
                }
            }
        }, { urls: urlList, passive: true } );

        wkof.turbo.events.frame_load.addListener( async ( e ) => {
            if ( e.target ) {
                const frameId = /** @type {Element} */ ( e.target ).id;
                addToDebugLog(
                    `turbo:frame-load was fired for "#${frameId}", ${
                        [ "todays-lessons-frame", "lesson-and-review-count-frame" ].includes( frameId )
                            ? "calling main function"
                            : "doing nothing..."
                    }`,
                );
                if ( !globalState.stateStarting ) {
                    addToDebugLog(
                        `DETOUR - turbo:frame-load was fired before we could begin starting or after main fully finished before frame events fired; changing following invocations of main() to _start() if we are not 'doing nothing'`,
                    );
                }
                mainSource = `turbo:frame-load for "#${frameId}"`;
                if ( frameId === "todays-lessons-frame" ) {
                    globalState.todaysLessonsFrameLoaded = true;
                    if ( !globalState.stateStarting ) {
                        globalState.stateStarting = true;
                        await _start();
                        return;
                    }
                    await main();
                }
                else if ( frameId === "lesson-and-review-count-frame" ) {
                    globalState.navBarCountFrameLoaded = true;
                    if ( !globalState.stateStarting ) {
                        globalState.stateStarting = true;
                        await _start();
                        return;
                    }
                    await main();
                }
                mainSource = "";
                globalState.turboEventBusy = false;
            }
        }, { urls: urlList, passive: true } );

        addToDebugLog( `All turbo callbacks have been sent to TurboEvents library to be registered` );
    } ).catch( ( err ) => {
        addToDebugLog( `TurboEvents library rejected with error: ${err}` );
    } ).finally( () => {
        if ( INTERNAL_DEBUG_TURBO_HANDLING ) {
            addToDebugLog( `SOURCE = "turbo ready finally"` );
            printDebugLog( INTERNAL_DEBUG_TURBO_HANDLING );
        }
        _init( `wkof.ready('TurboEvents') finally callback` );
    } );

    async function _start() {
        addToDebugLog( `Starting...` );
        wkof.include( "Settings, Menu, Apiv2" );
        await wkof.ready( "Settings, Menu, Apiv2" ).then( loadSettings ).then( insertMenu ).then( insertStylesheet )
            .then( main )
            .catch( ( err ) => {
                addToDebugLog(
                    `wkof.ready('Settings, Menu, Apiv2') rejected (or callbacks threw an exception) with error: ${err}`,
                );
            } )
            .finally( () => {
                if ( INTERNAL_DEBUG_TURBO_HANDLING ) {
                    addToDebugLog( `SOURCE = "wkof modules ready finally"` );
                    printDebugLog( INTERNAL_DEBUG_TURBO_HANDLING );
                }
            } );
    }

    async function loadSettings() {
        addToDebugLog( `Loading settings...` );

        const defaults = {
            showTotalOnly: false,
            enableDebugging: true,
        };

        settings = await wkof.Settings.load( scriptId, defaults );
    }

    function insertMenu() {
        addToDebugLog( `Inserting menu...` );

        const config = {
            name: scriptId,
            submenu: "Settings",
            title: scriptName,
            "on_click": openSettings,
        };

        wkof.Menu.insert_script_link( config );
        mainSource = `_start() -> loadSettings() -> insertMenu()`;
    }

    /**
     * Save function for wkof settings callback
     *
     * @param {WKOFDictionary} wkofSettings
     */
    async function saveSettings( wkofSettings ) {
        globalState.hasOutputLog = false;
        addToDebugLog( `Save button was clicked on settings, calling main() with new settings...` );
        mainSource = "wkof.Settings.save()";
        settings = wkofSettings;
        await main();
        mainSource = "";
    }

    function openSettings() {
        /** @type {Settings.Config} */
        const config = {
            "script_id": scriptId,
            title: scriptName,
            "on_save": saveSettings,
            content: {
                showTotalOnly: {
                    type: "checkbox",
                    label: "Show Only Total Lesson Count",
                    hover_tip:
                        `Changes display between "<today's lesson count> / <total lesson count>" and just "<total lesson count>"`,
                    default: false,
                },
                enableDebugging: {
                    type: "checkbox",
                    label: "Enable console debugging",
                    hover_tip: `Enable output of debugging info to console.debug()`,
                    default: true,
                },
            },
        };

        const dialog = new wkof.Settings( config );
        dialog.open();
    }

    function insertStylesheet() {
        const css = `
#lesson-and-review-count-frame .lesson-and-review-count__count {
  flex: 1 0 32px;
}

.todays-lessons-widget__title-container:has(.todays-lessons-widget__title-group-container) {
  display: inline-flex;
  gap: var(--spacing-normal);
  justify-content: space-evenly;
}

.todays-lessons-widget__title-group-container {
  display: flex;
  flex-direction: column;
}

.todays-lessons-widget__title-group-container .todays-lessons-widget__subtitle {
  margin-top: 2px;
}

.todays-lessons-widget__title-container:has(.todays-lessons-widget__title-group-container) + .todays-lessons-widget__text {
  align-self: center;
}

.todays-lessons-widget__title:has(.todays-lessons-widget__text-wrapper) {
  flex-direction: column;
}

.todays-lessons-widget__text-wrapper {
  display: flex;
  gap: var(--spacing-tight);
  align-items: center;
}
`;

        if ( document.getElementById( "total-lesson-count-style" ) === null ) {
            const styleSheet = document.createElement( "style" );
            styleSheet.id = "total-lesson-count-style";
            styleSheet.textContent = css;
            document.head.appendChild( styleSheet );
        }
    }

    function getCountContainers() {
        const dashboardTileCountContainer = document.querySelector(
            ".todays-lessons-widget__count-text .count-bubble",
        );
        const navBarCountContainer = document.querySelector( ".lesson-and-review-count__count" );

        if ( globalState.initialLoad && ( dashboardTileCountContainer || navBarCountContainer ) ) {
            const container = dashboardTileCountContainer ?? navBarCountContainer;
            if ( container ) todaysLessonsCount = parseInt( container.textContent );
            globalState.initialLoad = false;
        }

        return [ dashboardTileCountContainer, navBarCountContainer ];
    }

    async function main() {
        addToDebugLog( `Main function is executing... source of start = [${mainSource}]` );

        if ( !settings ) {
            addToDebugLog( `We do not have settings, setting timeout on _start()` );
            if ( !globalState.stateStarting ) setTimeout( _start, 50 );
            else addToDebugLog( `Did not set timeout due to already being in starting state` );
            addToDebugLog( `Main function is returning (source = [${mainSource}])` );
            return;
        }
        addToDebugLog( `We have settings` );

        if ( !globalState.stateStarting && globalState.hasOutputLog ) {
            globalState.hasOutputLog = false;
            addToDebugLog( `Main function successfully executed beforehand, preventing repeat execution...` );
            if ( settings.enableDebugging ) printDebugLog( INTERNAL_DEBUG_TURBO_HANDLING );
            return;
        }

        let lessonCountContainers;

        if ( globalState.todaysLessonsFrameLoaded || globalState.navBarCountFrameLoaded ) {
            addToDebugLog( `Frame(s) loaded, retrieving containers in frames containing the counts...` );
            lessonCountContainers = getCountContainers();
            addToDebugLog( `Count containers have been retrieved` );
        }
        else {
            addToDebugLog( `No frames loaded, checking to see if all listened-to turbo events have settled...` );
            addToDebugLog(
                `starting = ${globalState.stateStarting}, turboEventBusy = ${globalState.turboEventBusy}, retries = ${globalState.mainRetryCounter}`,
            );
            if ( globalState.stateStarting && !globalState.turboEventBusy && globalState.mainRetryCounter > 0 ) {
                addToDebugLog(
                    `Turbo Events have settled but we have not verified frames, using alternate verification...`,
                );
                /** @type {Element | null | undefined} */
                let tmpContainer = document.querySelector( ".todays-lessons-widget__count-text" );
                if ( tmpContainer && tmpContainer.childElementCount > 0 ) globalState.todaysLessonsFrameLoaded = true;
                tmpContainer = document.getElementById( "lesson-and-review-count-frame" )?.querySelector(
                    ".lesson-and-review-count",
                );
                if ( tmpContainer && tmpContainer.childElementCount > 0 ) globalState.navBarCountFrameLoaded = true;
                mainSource = "main() function, no frames alternate verification";
                globalState.mainRetryCounter--;
                addToDebugLog(
                    `Alternate verification process completed, retrying main(), ${globalState.mainRetryCounter} retries left...`,
                );
                await main();
                mainSource = "";
                return;
            }
            else if ( globalState.mainRetryCounter === 0 ) {
                addToDebugLog(
                    `Unable to verify loading of frames through alternate method, please refresh the page to try again from scratch`,
                );
            }
            else {
                addToDebugLog( `Turbo event callbacks are still executing, continuing...` );
            }
            addToDebugLog( `Main function is returning (source = [${mainSource}])` );
            //if (settings.enableDebugging) printDebugLog(INTERNAL_DEBUG_TURBO_HANDLING);
            return;
        }

        addToDebugLog( `Retrieving summary data via await of the endpoint...` );
        const summaryData = await wkof.Apiv2.get_endpoint( "summary" );
        addToDebugLog( `Summary data has been retrieved` );

        const totalLessonCount = summaryData.lessons[0].subject_ids.length;
        let isTileSizeOneThird = false;

        let todaysCountForDisplay = todaysLessonsCount.toString();

        if ( lessonCountContainers.every( ( node ) => node == null ) ) {
            addToDebugLog( `No nodes in containers` );
            addToDebugLog( `Main function is returning (source = [${mainSource}])` );
            //if (settings.enableDebugging) printDebugLog(INTERNAL_DEBUG_TURBO_HANDLING);
            return;
        }
        addToDebugLog( `At least one container exists` );
        globalState.stateStarting = false;

        if ( isNaN( todaysLessonsCount ) ) todaysCountForDisplay = "0";

        // must be the lesson tile container
        if ( lessonCountContainers[0] ) {
            const lessonCountContainer = lessonCountContainers[0];
            if ( settings.showTotalOnly ) {
                lessonCountContainer.textContent = totalLessonCount;
                addToDebugLog(
                    `Setting display amount for Today's Lessons tile, set to ${lessonCountContainer.textContent}`,
                );
            }
            else {
                // The following follows no style conventions or cleanliness conventions, it's more akin to a bandaid than anything due to limited time
                // If anyone would like to clean this up, please feel free to submit a PR

                lessonCountContainer.textContent = todaysCountForDisplay; // in case it is zero
                // @ts-ignore: This needs to be fixed later, but for now, it is hardcoded that the div we want is 3 ancestors up
                const titleContainer = lessonCountContainer.parentNode.parentNode.parentNode; // .todays-lessons-widget__title-container
                // deno-fmt-ignore
                isTileSizeOneThird =
                    /** @type {HTMLElement} */ ( titleContainer )?.closest( "turbo-frame.dashboard__widget--one-third" ) != null;

                if ( titleContainer ) {
                    if ( isTileSizeOneThird ) {
                        // Do the one-third stuff
                        const wrapper0 = document.createElement( "div" );
                        wrapper0.classList.add( `todays-lessons-widget__text-wrapper` );
                        titleContainer.querySelector( `.todays-lessons-widget__title` )?.firstElementChild
                            ?.insertAdjacentElement( "afterend", wrapper0 );
                        const countTextDiv = titleContainer.querySelector( `.todays-lessons-widget__count-text` );
                        const countTextClone =
                            /** @type {HTMLElement | undefined} */ ( countTextDiv?.cloneNode( true ) );
                        if ( countTextDiv && countTextClone ) {
                            // @ts-ignore: assert that firstElementChild will not be null
                            countTextClone.firstElementChild.textContent = totalLessonCount;
                            const forwardSlash = `<div class="todays-lessons-widget__title-text">/</div>`;
                            wrapper0.insertAdjacentHTML( "afterbegin", forwardSlash );
                            wrapper0.insertAdjacentElement( "afterbegin", countTextDiv );
                            wrapper0.insertAdjacentElement( "beforeend", countTextClone );

                            addToDebugLog( `Manipulated DOM and created new nodes as needed.` );
                        }
                        else {
                            addToDebugLog(
                                `Failed to manipulate the DOM due to one or more elements being null or undefined.`,
                            );
                        }
                    }
                    else {
                        // Do things that should only be done if not a one-third sized tile (half, two-thirds, full)
                        if ( !titleContainer.children[0].className.includes( `__title-group-container` ) ) {
                            // clone existing children, and modify clones to make new children, store in a temp array
                            const tempArray = [];
                            for ( const elem of titleContainer.children ) {
                                const clone = /** @type {HTMLElement} */ ( elem.cloneNode( true ) );
                                if ( clone && clone.className.includes( `__subtitle` ) ) {
                                    clone.textContent = "Total";
                                }
                                if ( clone.className.includes( `__title` ) ) {
                                    const tmpNode = clone.querySelector(
                                        `.todays-lessons-widget__count-text .count-bubble`,
                                    );
                                    if ( tmpNode ) tmpNode.textContent = totalLessonCount;
                                }
                                tempArray.push( clone );
                            }

                            // wrap the existing children in a new div.todays-lessons-widget__title-group-container
                            // wrap the new children in the same kind of wrapper
                            // append second wrapper after first wrapper

                            const wrapper1 = document.createElement( "div" );
                            wrapper1.classList.add( `todays-lessons-widget__title-group-container` );
                            // @ts-expect-error: Expect error about titleContainer possibly being null
                            titleContainer.insertAdjacentElement( "beforebegin", wrapper1 );
                            wrapper1.append( ...titleContainer.children );
                            titleContainer.prepend( wrapper1 ); // this should move the wrapper inside titleContainer

                            const wrapper2 = document.createElement( "div" );
                            wrapper2.classList.add( `todays-lessons-widget__title-group-container` );
                            // @ts-expect-error: Expect error about titleContainer possibly being null
                            titleContainer.insertAdjacentElement( "beforebegin", wrapper2 );
                            wrapper2.append( ...tempArray );
                            titleContainer.append( wrapper2 );

                            addToDebugLog( `Created additional cloned nodes to display Total Lesson Count.` );
                        }
                    }
                }
            }
        }

        // must be the nav bar container
        if ( lessonCountContainers[1] ) {
            // deno-fmt-ignore
            lessonCountContainers[1].textContent = settings.showTotalOnly ?
                `${totalLessonCount}` :
                `${todaysCountForDisplay} / ${totalLessonCount}`;
            addToDebugLog(
                `Setting display amount for navigation bar, set to ${lessonCountContainers[1].textContent}`,
            );
        }

        // hide "Today's" subtitle if showing only total OR if tile is only of size one-third

        const lessonSubtitle = document.querySelector( ".todays-lessons-widget__subtitle" );

        if ( ( settings.showTotalOnly || isTileSizeOneThird ) && lessonSubtitle && lessonSubtitle.checkVisibility() ) {
            addToDebugLog( `Hiding the "Today's" subtitle on the lesson tile` );
            /** @type {HTMLElement} */ ( lessonSubtitle ).style.display = "none";
        }

        addToDebugLog( `Main function has successfully executed` );

        if ( settings.enableDebugging ) printDebugLog( INTERNAL_DEBUG_TURBO_HANDLING );
    }
} )();
