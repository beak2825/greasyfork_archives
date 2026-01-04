// ==UserScript==
// @name         Opinion's Handling Editor for slowroads.io
// @namespace    https://github.com/Opinion/slowroads-handling-editor
// @version      1.3
// @description  This mod adds a handling editor for slowroads.io. Supports game version v1.0.2.
// @author       Opinion
// @match        https://slowroads.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slowroads.io
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/497017/Opinion%27s%20Handling%20Editor%20for%20slowroadsio.user.js
// @updateURL https://update.greasyfork.org/scripts/497017/Opinion%27s%20Handling%20Editor%20for%20slowroadsio.meta.js
// ==/UserScript==

/* globals unsafeWindow, window */

const Core = {
    settings: {
        supportedVersion: '1.0.2',
        originalGameScriptPattern: /https?:\/\/slowroads\.io\/static\/js\/main\.([a-z0-9]+)\.chunk\.js$/gm,
        originalGameScript: null,
        modifiedGameScript: {
            prefix: 'https://cdn.jsdelivr.net/gh/Opinion/slowroads-handling-editor/dist/main.modified.',
            suffix: '.chunk.js',
            identifier: null,
            get() {
                return `${this.prefix}${this.identifier}${this.suffix}`
            },
        },
    },

    /**
     * Custom logger
     *
     * @param  {...any} args Arguments you want to log
     */
    log(...args) {
        console.log('[🔧]', '[OPINION]', ...args)
    },
}

const WindowInteraction = {
    /**
     * Get window 'unsafeWindow' or 'window'
     *
     * To support Greasemonkey, we need to access 'window' through 'unsafeWindow'.
     * Details: https://wiki.greasespot.net/UnsafeWindow
     *
     * @returns {Window}
     */
    getWindow() {
        return typeof unsafeWindow === 'object'
            ? unsafeWindow
            : window
    },

    /**
     * Get Toastify through window
     *
     * @returns {Toastify|function|null}
     */
    getToastify() {
        return this.getWindow()?.Toastify
    },

    /**
     * Get 'exposedI' through window
     *
     * @returns {object|null}
     */
    getExposedI() {
        return this.getWindow()?.exposedI
    },

    /**
     * Get 'exposedVersion' through window
     *
     * @returns {string|null}
     */
    getExposedVersion() {
        const version = this.getWindow()?.exposedVersion
        return typeof version === 'string'
            ? version
            : null
    },
}

const DocumentInteraction = {
    /**
     * Append a <script> element to <head>
     *
     * @param {string} url URL for 'src' attribute
     */
    appendScript(src) {
        const element = document.createElement('script')
        element.src = src
        document.head.append(element)
        Core.log('Appended script', { element, src })
    },

    /**
     * Append a <link> element to <head>
     *
     * @param {string} url URL for rel attribute
     */
    appendStyle(src) {
        const element = document.createElement('link')
        element.href = src
        element.rel = 'stylesheet'
        document.head.append(element)
        Core.log('Appended style', { element, src })
    },

    /**
     * Append a <script> element to <body> with raw code
     *
     * Useful because we can de-elevate (is that a word?) code and let it run from the page.
     * Code will NOT run with the elevated permissions of the userscript.
     *
     * @param {string} code Javascript code
     */
    appendRawScript(code) {
        const element = document.createElement('script')
        element.innerHTML = code
        document.body.append(element)
        Core.log('Appended raw script', { element, code })
    },

    /**
     * Get game's canvas element
     *
     * @returns {HTMLElement|null}
     */
    getGameCanvasElement() {
        return document.querySelector('#game-main > canvas.render-canvas')
    },
}

/**
 * Dependency Manager
 *
 * ## Brief overview
 *  - Loaded state is stored in 'dependency.loaded' as a boolean.
 *  - When a dependency has loaded, it will not load again on subsequent requests.
 *  - Dependencies are stored in object keys so we can easily load necessary depedencies out-of-order.
 *  - If a javascript or css dependency is a function, it will be executed.
 *    - If the output of the function is a string, the string will be loaded as a dependency.
 *
 * ## Dependency structure
 *  - dependency.name     | {string} (Required) Name of the dependency (used in logs)
 *  - dependency.js       | {array|string[]|function[]|null|undefined} (Optional) Array of URLs to javascript files
 *  - dependency.css      | {array|string[]|function[]|null|undefined} (Optional) Array of URLs to CSS files
 *  - dependency.isLoaded | {function|null|undefined} (Optional) A function to check if the dependency has loaded (for use outside the Dependency Manager)
 *  - dependency.loaded   | {boolean|null|undefined} (Automatic) Has this dependency been loaded yet?
 *
 * Note: 'dependency.loaded' is handled automatically. Please don't touch it.
 */
const DependencyManager = {
    dependencies: {
        toastify: {
            name: 'Toastify.js',
            js: [
                'https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js',
            ],
            css: [
                'https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css',
            ],
            isLoaded: () => typeof WindowInteraction.getToastify() === 'function',
        },
        modifiedGameScript: {
            name: 'Modified game script',
            js: [
                () => Core.settings.modifiedGameScript.get(), // Function -- Will be resolved when loaded.
            ],
            isLoaded: () => typeof WindowInteraction.getExposedI() === 'object',
        },
    },

    /**
     * Custom logger for dependencies
     *
     * @param {object} dependency
     * @param  {...any} args
     */
    log(dependency, ...args) {
        Core.log(`[Dependency: ${dependency.name}]`, ...args)
    },

    internal: {
        /**
         * Resolve url
         *
         * A url can either be a string or a function.
         * If the url is a function, the function will be resolved and the output returned (as long as it is a string).
         *
         * @param {string|function|null|undefined} url
         * @returns {string|null}
         */
        resolveUrl(url) {
            // Set output to whatever the url is
            let output = url

            // Check if the url is a function and resolve it
            if (typeof url === 'function') {
                output = url()
            }

            // Return the output if it is a string
            return typeof output === 'string'
                ? output
                : null
        },
    },

    /**
     * Load a dependency
     *
     * Appends necessary <script> and <link> elements to <head>.
     * When a dependency has loaded it will not load again.
     *
     * @param {object} dependency
     */
    loadDependency(dependency) {
        if (typeof dependency !== 'object') {
            throw Error('Dependency must be an object.')
        }

        // Checking state
        if (dependency.loaded === true) {
            this.log(dependency, 'Already loaded. Ignoring.')
            return
        }

        this.log(dependency, 'Loading dependency...', { dependency: dependency })

        // Append javascript URLs
        if (Array.isArray(dependency.js) && dependency.js.length) {
            for (let i = 0; i < dependency.js.length; i++) {
                // Resolve url
                const url = this.internal.resolveUrl(dependency.js[i])

                // Append if the url was correctly resolved
                if (url !== null) {
                    DocumentInteraction.appendScript(url)
                }
            }
        }

        // Append CSS URLs
        if (Array.isArray(dependency.css) && dependency.css.length) {
            for (let i = 0; i < dependency.css.length; i++) {
                // Resolve url
                const url = this.internal.resolveUrl(dependency.css[i])

                // Append if the url was correctly resolved
                if (url !== null) {
                    DocumentInteraction.appendStyle(url)
                }
            }
        }

        // Saving state
        dependency.loaded = true
    },

    /**
     * Load dependencies
     *
     * @param {array|object[]|null} dependencies Custom dependencies. Use 'null' to use configured dependencies.
     */
    load(dependencies = null) {
        // -- Attempt to use dependencies from parameter

        // Check if we can use dependecies from parameter
        if (Array.isArray(dependencies) && length) {
            // Load dependencies (from an array)
            for (let i = 0; i < dependencies.length; i++) {
                const dependency = dependencies[i]
                this.loadDependency(dependency)
            }
            return // -- Important
        }

        // -- Fallback to configured dependencies

        // Make sure dependencies are stored in an object
        if (typeof this.dependencies !== 'object') {
            throw Error('Expected \'this.dependencies\' to be an object.')
        }

        // Load dependencies
        for (const key in this.dependencies) {
            if (Object.hasOwnProperty.call(this.dependencies, key)) {
                const dependency = this.dependencies[key]
                this.loadDependency(dependency)
            }
        }
    },
}

/**
 * Toastmaker
 *
 * It makes toasts (:
 */
const Toastmaker = {
    /**
     * Configured toast styles
     */
    styles: {
        default: {
            background: 'linear-gradient(to right bottom, rgb(158, 168, 170), rgb(124, 147, 155))',
            cursor: 'initial',
        },
        info: {
            background: 'linear-gradient(to bottom right, rgb(17, 130, 114), rgb(70, 110, 125))',
            cursor: 'initial',
        },
        error: {
            background: 'linear-gradient(to right bottom, rgb(162, 51, 56), rgb(130, 6, 12))',
            cursor: 'initial',
            maxWidth: '800px',
        },
    },

    /**
     * Get toast style
     *
     * @param {string|null} style Name of a toast style
     * @returns {object}
     */
    getStyle(style = null) {
        return this.styles[style]
            ? this.styles[style]
            : this.styles.default
    },

    /**
     * Make a toast
     *
     * Passed through a script tag to let it execute from the page.
     *
     * @param {string} message Toast message
     * @param {string|null} style Name of a toast style
     * @param {number} duration Duration in milliseconds
     * @param {boolean} close Do you want a close button to be shown?
     */
    makeToast(message, style = null, duration = 5000, close = true) {
        // Create toastify payload
        const payload = {
            text: message,
            duration: duration,
            escapeMarkup: false,
            close: close,
            gravity: 'top',
            position: 'center',
            stopOnFocus: 'true',
            style: this.getStyle(style),
        }

        // Turn payload into JSON so we can pass it through a raw script element
        const payloadAsJson = JSON.stringify(payload)
        DocumentInteraction.appendRawScript(`
{
    // Greasemonkey doesn't like it when we call a function through 'unsafeWindow'
    // This script block is appended to the page and will not be executed with elevated permissions.
    // This payload was converted to JSON by the handling editor and is accessible as an object
    // without any changes
    const payload = ${payloadAsJson}
    // Since this code block runs from the page, we can access Toastify without going through 'window'
    Toastify(payload)?.showToast()
}`)
        // end of multiline string
    },
}

/**
 * Condition Checker
 *
 * ## Behavior
 *  - Condition state is stored in 'condition.state'.
 *  - When a condition fails, the loop will break and the condition will be checked again next time.
 *  - When a condition passes, 'condition.state.passed' will be set to 'true'.
 *    - Next loop, the condition will not be checked through 'condition.passes' because 'condition.state.passed' is set
 *      to 'true'.
 *    - Even if 'condition.state.passed' is 'true', 'condition.onPass' will be used ('condition.onPass' behaves like
 *      normal).
 *    - This descision might seem a little weird. It is needed to avoid an already-passing conditon to fail later.
 *    - Example; Checking the game version requires a specific HTML element. The element is removed when you 'begin' the
 *      game.
 *    - TL;DR When a condition has passed, it will never fail during later checks.
 *
 *
 *
 * ## Condition structure
 *  - condition.name        | {string} (Required) Name of the condition.
 *  - condition.passes      | {function} (Required) Requirement to pass the condition.
 *  - condition.beforeCheck | {object|null|undefined} (Optional) Properties documented below.
 *  - condition.onPass      | {object|null|undefined} (Optional) Properties documented below.
 *  - condition.onFail      | {object|null|undefined} (Optional) Properties documented below.
 *  - condition.state       | {object|null|undefined} (Automatic) Properties documented below.
 *
 *
 * ### Properties for 'beforeCheck', 'onPass' and 'onFail'
 *  - message        | {string|null|undefined} Message to be logged.
 *  - messageOnce    | {boolean|null|undefined} Do you want the message to be logged once? Defaults to 'true'.
 *  - run            | {function|null|undefined} A function you want to run.
 *  - runOnce        | {boolean|null|undefined} Do you want the run function to execute once? Defaults to 'true'.
 *  - throwException | {boolean|null|undefined} Do you want to exit the script at this point (after executing 'run'
 *                                              function)? Defaults to 'false'.
 *
 * Be careful with how you set up the 'run' function. In most cases you will want 'runOnce' to be 'true'.
 *
 * Remember: Conditions will run again if one fails. 'beforeCheck', 'onPass' and 'onFail' can happen many times before
 *           all conditions have passed.
 *
 *
 * ### Properties for 'state' (handled automatically)
 *  - passed             | {boolean|null|undefined} Has the condition passed once?
 *  - beforeCheckMessage | {boolean|null|undefined} Has 'beforeCheck.message' been logged once?
 *  - beforeCheckRun     | {boolean|null|undefined} Has 'beforeCheck.run' been executed once?
 *  - onPassMessage      | {boolean|null|undefined} Has 'onPass.message' been logged once?
 *  - onPassRun          | {boolean|null|undefined} Has 'onPass.run' been executed once?
 *  - onFailMessage      | {boolean|null|undefined} Has 'onFail.message' been logged once?
 *  - onFailRun          | {boolean|null|undefined} Has 'onFail.run' been executed once?
 *
 * Note: 'condition.state' is handled automatically. please don't define anything here.
 *
 *
 *
 * ## Full object example (with state)
 * ```
 *  const condition = {
 *      name: 'Example condition',
 *      passes: () => typeof 'Hello' === 'string',
 *      beforeCheck: {
 *          message: 'Logged before checking the condition.',
 *          messageOnce: true,
 *          run: () => console.log('I was executed at \'beforeCheck\'.'),
 *          runOnce: true,
 *          throwException: false,
 *      },
 *      onPass: {
 *          message: 'Logged after passing the condition.',
 *          messageOnce: true,
 *          run: () => console.log('I was executed at \'onPass\'.'),
 *          runOnce: true,
 *          throwException: false,
 *      },
 *      onFail: {
 *          message: 'Logged after failing the condition.',
 *          messageOnce: true,
 *          run: () => console.log('I was executed at \'onFail\'.'),
 *          runOnce: true,
 *          throwException: true,
 *      },
 *      state: {
 *          passed: false,
 *          beforeCheckMessage: false,
 *          beforeCheckRun: false,
 *          onPassMessage: false,
 *          onPassRun: false,
 *          onFailMessage: false,
 *          onFailRun: false,
 *      },
 *  };
 * ```
 */
const ConditionChecker = {
    conditions: [
        {
            name: 'Toastify.js',
            passes: () => DependencyManager.dependencies.toastify.isLoaded(),
            beforeCheck: {
                message: 'Waiting for Toastify.js to finish loading...',
                messageOnce: true,
            },
            onPass: {
                message: 'Dependency successfully loaded.',
                messageOnce: true,
            },
            onFail: {
                message: 'Dependency has not loaded yet.',
                messageOnce: false,
            },
        },
        {
            name: 'Modified game script',
            passes: () => DependencyManager.dependencies.modifiedGameScript.isLoaded(),
            beforeCheck: {
                message: `We have to make sure the modified game script has loaded. A modified script with the identifier '${() => Core.settings.modifiedGameScript.identifier}' might not exist in our repo yet.`,
                messageOnce: true,
            },
            onPass: {
                message: 'Modified game script has successfully loaded.',
                messageOnce: true,
            },
            onFail: {
                message: 'Unable to detect the modified game script. A slow connection can also cause this issue. Triggering failsafe...',
                messageOnce: true,
                run: () => {
                    const prefix = '[FAILSAFE]'
                    Core.log(prefix, 'Sorry, the modified game script didn\'t load. Reverting back to the original game script.')
                    Toastmaker.makeToast(
                        `<b><a style="color: #9bb5ff" href="https://github.com/Opinion/slowroads-handling-editor">Opinion's Handling Editor</a></b></br>
Unable to load modified game script. Game script identifier: '${Core.settings.modifiedGameScript.identifier}'. Please create an issue if one hasn't been
made yet. Remember to include any logs from your browsers console. Thanks. ~Opinion<br><br>
Likely reason for this error: slowroads.io has updated their game scripts and we have yet to include the new version in our repository.<br><br>
As a failsafe, we loaded the original game script so you can enjoy the unmodded game.`,
                        'error',
                        240000,
                    )
                    DocumentInteraction.appendScript(Core.settings.originalGameScript + '?ignore')
                    Core.log(prefix, 'Throwing an exception to stop the Handling Editor. Please check the repo to see if a matching script actually exists.')
                    throw Error('Modified game script didn\'t load. Failsafe triggered and loaded the original game script.')
                },
                runOnce: true,
            },
        },
        {
            name: 'Game version',
            passes: () => WindowInteraction.getExposedVersion() === Core.settings.supportedVersion,
            beforeCheck: {
                message: `Required game version: '${Core.settings.supportedVersion}'.`,
                messageOnce: true,
            },
            onPass: {
                message: 'The game version is supported.',
                messageOnce: true,
            },
            onFail: {
                message: `Game version '${WindowInteraction.getExposedVersion()}' is not supported. Please check if the Handling Editor has a new release available.`,
                messageOnce: true,
                run: () => Toastmaker.makeToast('<b><a style="color: #9bb5ff" href="https://github.com/Opinion/slowroads-handling-editor">Opinion\'s Handling Editor</a></b></br>Game version is not supported. Please check if the Handling Editor has a new release available.', 'error', 100000),
                runOnce: true,
                throwException: true,
            },
        },
        {
            name: 'Game start',
            passes: () => WindowInteraction.getExposedI()?.current?.firstFrame === true,
            beforeCheck: {
                message: 'Waiting for the game to start (press \'begin\')...',
                messageOnce: true,
            },
            onPass: {
                message: 'The game has started.',
                messageOnce: true,
            },
        },
        {
            name: 'Vehicle spawn',
            passes: () => typeof WindowInteraction.getExposedI()?.current?.vehicleController !== 'undefined',
            beforeCheck: {
                message: 'Waiting for the vehicle to spawn...',
                messageOnce: true,
            },
            onPass: {
                message: 'Found \'vehicleController\'.',
                messageOnce: true,
            },
            onFail: {
                message: 'Couldn\'t find \'vehicleController\'. This usually takes a few seconds.',
                messageOnce: false,
            },
        },
    ],

    internal: {
        /**
         * Internal logger for conditions
         *
         * @param {object} condition
         * @param {...any} args
         */
        log(condition, ...args) {
            Core.log(`[Condition: ${condition.name}]`, ...args)
        },

        /**
         * Handle condition sections; 'beforeCheck', 'onPass' and 'onFail'
         *
         * Default values described in parent-JSDoc are marked with inline comments.
         *
         * Steps in order:
         * 1. Log message if allowed
         * 2. Run function if allowed
         * 3. Throw exception if allowed
         *
         * @param {object} condition Condition object
         * @param {string} section Section name
         */
        handleSection(condition, section) {
            // Validate section type
            if (!['beforeCheck', 'onPass', 'onFail'].includes(section)) {
                throw Error(`Section '${section}' is not valid.`)
            }

            // Get state
            const stateMessageKey = `${section}Message`
            const stateRunKey = `${section}Run`
            const messageHasAlreadyBeenLogged = condition.state[stateMessageKey] === true
            const runHasAlreadyBeenExecuted = condition.state[stateRunKey] === true

            // Get section settings
            const sectionSettings = condition[section]
            const messageCanOnlyBeLoggedOnce = sectionSettings.messageOnce !== false // Note: Defaults to 'true' as described in JSDoc
            const runCanOnlyBeExecutedOnce = sectionSettings.messageOnce !== false // Note: Defaults to 'true' as described in JSDoc

            // Check if we are allowed to log a message
            const messageIsAString = typeof sectionSettings.message === 'string'
            const messageCanBeLogged = messageHasAlreadyBeenLogged
                ? !messageCanOnlyBeLoggedOnce
                : true
            if (messageIsAString && messageCanBeLogged) {
                // Log the message
                this.log(condition, sectionSettings.message)

                // Save to state
                condition.state[stateMessageKey] = true
            }

            // Check if we are allowed to run a function
            const runIsAFunction = typeof sectionSettings.run === 'function'
            const runCanBeExecuted = runHasAlreadyBeenExecuted
                ? !runCanOnlyBeExecutedOnce
                : true
            if (runIsAFunction && runCanBeExecuted) {
                // Run the function
                sectionSettings.run()

                // Save to state
                condition.state[stateRunKey] = true
            }

            // Check if we are allowed to throw an exception
            if (sectionSettings.throwException === true) {
                // Note: Defaults to 'false' as described in JSDoc
                this.log(
                    condition,
                    'Halting script exectution because \'throwException\' was true.',
                    { conditionName: condition.name, condition, sectionName: section, section: sectionSettings },
                )
                throw Error(`This exception was thrown by a condition in order to halt script execution. Condition name: '${condition.name}', Section: '${section}'.`)
            }
        },

        /**
         * Check a condition
         *
         * Triggers 'beforeCheck', 'onPass' and 'onFail' when needed.
         *
         * @param {*} condition
         */
        checkCondition(condition) {
            // Make sure 'beforeCheck', 'onPass' and 'onFail' is an object
            if (typeof condition.beforeCheck !== 'object') {
                condition.beforeCheck = {}
            }
            if (typeof condition.onPass !== 'object') {
                condition.onPass = {}
            }
            if (typeof condition.onFail !== 'object') {
                condition.onFail = {}
            }

            // Make sure state is an object
            if (typeof condition.state !== 'object') {
                condition.state = {}
            }

            // Get state
            const conditionHasAlreadyPassed = condition.state.passed === true

            // Section :: 'beforeCheck'
            this.handleSection(condition, 'beforeCheck')

            // Checking condition
            if (conditionHasAlreadyPassed || condition.passes()) {
                // Save to state
                condition.state.passed = true // Important -- Condition will always pass on upcoming checks

                // Section :: 'onPass'
                this.handleSection(condition, 'onPass')

                // Output: The condition passed
                return true
            } else {
                // Section :: 'onFail'
                this.handleSection(condition, 'onFail')

                // Output: The condition failed
                return false
            }
        },
    },

    /**
     * Check all conditions
     *
     * @returns {boolean}
     */
    check() {
        const conditions = this.conditions
        for (let i = 0; i < conditions.length; i++) {
            const condition = conditions[i]
            if (!this.internal.checkCondition(condition)) {
                // Output: A condition has failed
                return false
            }
        }

        // Output: All conditions have passed
        return true
    },
}

const HandlingEditor = {
    /* Include 'Core' */
    log: Core.log,
    settings: Core.settings,

    /* Include 'DocumentInteraction' */
    appendScript: DocumentInteraction.appendScript,
    appendStyle: DocumentInteraction.appendStyle,
    appendRawScript: DocumentInteraction.appendRawScript,
    getGameCanvasElement: DocumentInteraction.getGameCanvasElement,

    /* Include 'Toastmaker' */
    toastmaker: Toastmaker,

    /* Include 'ConditionChecker' */
    conditionChecker: ConditionChecker,

    /**
     * Hanling keys available in the handling editor
     * (if you want to add more, remember to add matching HTML inputs too)
     */
    handlingKeys: [
        'accel', /*      */'topSpeed',
        'brake', /*      */'reverse',
        'aeroFactor', /* */'dampening',
        'drag', /*       */'jerk',
        'rockFactor', /* */'rollResistance',
        'slipBase', /*   */'slipMod',
        'maxSteer', /*   */'steerSpeed',
        'steerAccel', /* */'steerInterval',
        'mass',
    ],

    /**
     * Initialize scripts and dependencies
     */
    initialize() {
        this.log('Initializing...')

        // Load dependencies
        DependencyManager.load()

        // Run ConditionChecker until we can start the Handling Editor
        this.log('Before we start the Handling Editor, we need to wait for some conditions...')
        const self = this
        this.settings.pleaseWait = setInterval(() => {
            // Checking conditions
            try {
                if (!self.conditionChecker.check()) {
                    return
                }
            } catch (exception) {
                self.log('Caught an exception in ConditionChecker. Stopping loop and halting the script.', exception)
                clearInterval(self.settings.pleaseWait) // Important -- stops timer
                return // Important -- halts script
            }

            // Stopping timer and starting handling editor
            self.log('Passed all conditions. Starting handling editor!')
            clearInterval(self.settings.pleaseWait)
            self.startHandlingEditor()
        }, 100)
    },

    /**
     * Starts handling editor (main)
     */
    startHandlingEditor() {
        this.toastmaker.makeToast('You can open the handling editor by pressing the cog in the <b>top left</b> corner.', 'default', 25000)
        this.toastmaker.makeToast('🔧 Now playing with Opinion\'s handling editor. Have fun out there :)', 'info', 12000)

        // Window toggled and position
        const windowX = '4.5rem'
        const windowY = '2rem'
        let windowActiveClass = ''
        if (localStorage.getItem('x-handling-editor-active')) {
            windowActiveClass = 'active'
        }

        // Create Handling Editor UI
        const handlingEditorOuterElement = document.createElement('div')
        handlingEditorOuterElement.id = 'handling-editor-outer'
        handlingEditorOuterElement.innerHTML = `
<div id="handling-editor-toggle" class="active">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
</div>
<div id="handling-editor" class="noselect ${windowActiveClass}">
    <div id="handling-editor-header" class="title">
        <div></div>
        Opinion's Handling Editor
        <div></div>
    </div>
    <div class="control-grid">
        <div class="left">
            <!-- Left side -->
            <div>
                <label for="handling-accel">accel</label>
                <input type="text" id="handling-accel">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-brake">brake</label>
                <input type="text" id="handling-brake">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-aeroFactor">aeroFactor</label>
                <input type="text" id="handling-aeroFactor">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-drag">drag</label>
                <input type="text" id="handling-drag">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-rockFactor">rockFactor</label>
                <input type="text" id="handling-rockFactor">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-slipBase">slipBase</label>
                <input type="text" id="handling-slipBase">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-maxSteer">maxSteer</label>
                <input type="text" id="handling-maxSteer">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-steerAccel">steerAccel</label>
                <input type="text" id="handling-steerAccel">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-mass">mass</label>
                <input type="text" id="handling-mass">
                <div class="saved">&#x2713; Saved</div>
            </div>
        </div>
        <div class="right">
            <!-- Right side -->
            <div>
                <label for="handling-topSpeed">topSpeed</label>
                <input type="text" id="handling-topSpeed">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-reverse">reverse</label>
                <input type="text" id="handling-reverse">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-dampening">dampening</label>
                <input type="text" id="handling-dampening">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-jerk">jerk</label>
                <input type="text" id="handling-jerk">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-rollResistance">rollResistance</label>
                <input type="text" id="handling-rollResistance">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-slipMod">slipMod</label>
                <input type="text" id="handling-slipMod">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-steerSpeed">steerSpeed</label>
                <input type="text" id="handling-steerSpeed">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-steerInterval">steerInterval</label>
                <input type="text" id="handling-steerInterval">
                <div class="saved">&#x2713; Saved</div>
            </div>
            <div>
                <label for="handling-reset">Messed up?</label>
                <button id="handling-reset" style="width: 100%;">reset handling</button>
            </div>
        </div>
    </div>
</div>
<style>
#handling-editor-outer {}
#handling-editor-toggle {
    display: none;
    position: absolute;
    top: 2rem;
    left: 2rem;
    width: 24px;
    height: 24px;
    color: hsla(0,0%,100%,.7333333333333333);
    z-index: 10;
    padding: 4px;
    border-radius: 50%;
    cursor: pointer;
    background-color: #22222242;
}
#handling-editor-toggle:hover {
    background-color: #222;
    color: #fff;
}
#handling-editor-toggle.active {
   display: block;
}
#handling-editor {
    position: absolute;
    left: ${windowX};
    top: ${windowY};
    display: none;
    width: 350px;
    background: rgba(30, 30, 30, 0.64);
    z-index: 10;
    color: #fff;
}
#handling-editor.active {
    display: block;
}
#handling-editor .title {
    display: flex;
    justify-content: space-between;
    place-items: center;
    gap: 16px;
    padding: 12px 16px 12px 16px;
    text-align: center;
    text-shadow: 2px 2px 0px #000;
    cursor: grab;
}
#handling-editor .title.grabbing {
    cursor: grabbing;
}
#handling-editor .title div{
    flex-grow: 1;
    border-bottom: 1px solid #999;
}
#handling-editor .control-grid{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 12px;
}
#handling-editor .control-grid * {
    box-sizing: border-box;
}
#handling-editor .control-grid > .left {
    margin-left: 16px;
}
#handling-editor .control-grid > .right {
    margin-right: 16px;
}
#handling-editor .control-grid > div > div {
    position: relative;
    margin-top: 10px;
}
#handling-editor .control-grid > div > div > input {
    display: inline-block;
    width: 100%;
    background: #222222aa;
    border: none;
    color: #BBBECE;
    padding: 2px 8px;
    border-bottom: 2px solid transparent;
    transition: all ease-in-out 200ms;
}
#handling-editor .control-grid > div > div > input:focus {
    border-bottom: 2px solid #424f82;
    box-shadow: 2px 2px 5px 0px #2424243d;
}
#handling-editor .control-grid > div > div > .saved {
    position: absolute;
    top: 22px;
    right: 4px;
    font-size: 10px;
    color: #CCC;
    opacity: 0;
    transition: all ease-in-out 500ms;
    pointer-events: none;
}
#handling-editor .control-grid > div > div > .saved.active {
    opacity: 1;
    color: #20FF00;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
</style>
`
        document.body.append(handlingEditorOuterElement)

        const handlingEditorToggleElement = document.getElementById('handling-editor-toggle')
        const handlingEditorElement = document.getElementById('handling-editor')

        // Making handling editor draggable
        this.dragElement(handlingEditorElement)

        // Event :: Toggle handling editor
        handlingEditorToggleElement.addEventListener('click', function() {
            handlingEditorElement.classList.toggle('active')
            if (handlingEditorElement.classList.contains('active')) {
                localStorage.setItem('x-handling-editor-active', true)
            } else {
                localStorage.removeItem('x-handling-editor-active')
            }
        })

        // Loading handling (and create event listeners)
        this.loadHandling(true)

        // Creating event listener for reset button
        const self = this
        const resetButtonElement = document.getElementById('handling-reset')
        resetButtonElement.addEventListener('click', () => {
            self.resetHandling()
        })
    },

    /**
     * Attempt to put focus on the game's canvas
     */
    putFocusOnGameCanvas() {
        function focus() {
            DocumentInteraction.getGameCanvasElement()?.focus()
        }

        // Get active element
        const activeElement = document.activeElement

        if (activeElement?.tagName === 'INPUT') {
            // -- Active element is an input

            // Only focus if the active element is the same element that was recently updated.
            // This allows you to click on another input (triggers 'change' event) without giving focus to the game.
            // We assume; if you click another input, you want to keep editing and not play right away.
            if (activeElement === this.recentlyUpdatedInputElement) {
                focus()
            }
        } else {
            // -- Active element is anything else

            // Always focus
            focus()
        }

        // Resetting
        this.recentlyUpdatedInputElement = null
    },

    updateHandling(handlingKey, value) {
        const handlingMetrics = WindowInteraction.getExposedI().current.vehicleController.vehicleDef.metrics
        handlingMetrics[handlingKey] = parseFloat(value)
        this.putFocusOnGameCanvas()
    },

    resetHandling() {
        if (typeof this.settings.defaultHandling === 'undefined') {
            this.toastmaker.makeToast('Can\'t reset handling. Default values have not been intialized yet.')
            return
        }
        for (let i = 0; i < this.handlingKeys.length; i++) {
            const handlingKey = this.handlingKeys[i]

            // Resetting handling for the current key
            const handlingMetrics = WindowInteraction.getExposedI().current.vehicleController.vehicleDef.metrics
            handlingMetrics[handlingKey] = this.settings.defaultHandling[handlingKey]
        }

        // Loading new values to UI
        this.loadHandling(false)
        this.putFocusOnGameCanvas()
    },

    loadHandling(firstRun = false) {
        if (firstRun) {
            this.settings.defaultHandling = {}
        }

        for (let i = 0; i < this.handlingKeys.length; i++) {
            const handlingKey = this.handlingKeys[i]

            // Getting corresponding input and setting initial value
            const inputElement = document.getElementById(`handling-${handlingKey}`)
            const handlingMetrics = WindowInteraction.getExposedI().current.vehicleController.vehicleDef.metrics
            const initialValue = handlingMetrics[handlingKey]
            inputElement.value = initialValue
            this.log('Set initial value of', handlingKey, 'to', initialValue)

            if (firstRun) {
                // Storing in default handling
                this.settings.defaultHandling[handlingKey] = initialValue

                // Creating event listener
                const self = this
                inputElement.addEventListener('change', () => {
                    self.recentlyUpdatedInputElement = inputElement
                    self.updateHandling(handlingKey, inputElement.value)

                    // Display saved text in UI
                    const savedElement = inputElement.parentElement.children[2]
                    savedElement?.classList?.add('active')
                    setTimeout(() => { savedElement?.classList?.remove('active') }, 2500)
                })
            }
        }
    },

    dragElement(element) {
        let pos1 = 0; let pos2 = 0; let pos3 = 0; let pos4 = 0
        const headerElement = document.getElementById(element.id + '-header')
        if (headerElement) {
            // if present, the header is where you move the DIV from:
            headerElement.onmousedown = dragMouseDown
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            element.onmousedown = dragMouseDown
        }

        function dragMouseDown(e) {
            e = e || WindowInteraction.getWindow().event
            e.preventDefault()
            // get the mouse cursor position at startup:
            pos3 = e.clientX
            pos4 = e.clientY
            document.onmouseup = closeDragElement
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag

            if (headerElement) {
                headerElement.classList.add('grabbing')
            }
        }

        function elementDrag(e) {
            e = e || WindowInteraction.getWindow().event
            e.preventDefault()
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX
            pos2 = pos4 - e.clientY
            pos3 = e.clientX
            pos4 = e.clientY
            // set the element's new position:
            element.style.top = (element.offsetTop - pos2) + 'px'
            element.style.left = (element.offsetLeft - pos1) + 'px'
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null
            document.onmousemove = null

            if (headerElement) {
                headerElement.classList.remove('grabbing')
            }
        }
    },
};

(function() {
    'use strict'
    addEventListener('beforescriptexecute', (event) => {
        const url = event.target.src

        // If the URL ends with '?ignore' we know we know the failsafe has triggered.
        // We want to return as to let the original game script run like normal.
        if (url.endsWith('?ignore')) {
            return
        }

        // Check if URL matches pattern of the original game script
        const matches = Core.settings.originalGameScriptPattern.exec(url)

        // Skipping non-matching scripts
        if (matches === null || !Array.isArray(matches) || matches.length !== 2) {
            return
        }

        // Getting and storing original game script
        // This will be used in the failsafe built in to the ConditionChecker. If the modified game script doesn't
        // load it will revert back to the original game script instead. You won't get to use the Handling Editor
        // but at least you can play the game.
        const originalGameScript = matches[0]
        Core.settings.originalGameScript = originalGameScript

        // Getting and storing identifier
        // This identifier will be used when we load a modified game script in the repo's '/dist' directory.
        // By doing this we can essentially update the repo without mod users needing to update their userscript.
        const identifier = matches[1]
        Core.settings.modifiedGameScript.identifier = identifier
        Core.log('Detected original game script. The identifer:', identifier, 'will be used to load a modified game script from our repo.', { event: event, element: event.target, url: url })

        // Preventing execution of the original game script
        event.preventDefault()
        Core.log('Prevented execution of the original game script.')

        HandlingEditor.initialize()
    })
})()