// ==UserScript==
// @name         Wanikani Forums: POLL helper
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  Adds an easy way to create new POLLs
// @author       latepotato
// @include      https://community.wanikani.com/*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/424969/Wanikani%20Forums%3A%20POLL%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/424969/Wanikani%20Forums%3A%20POLL%20helper.meta.js
// ==/UserScript==
// This is mostly a modified Version of Kumirei's Bottled WaniMekani script. A lot of the credit goes to them! This script is supposed to be
// an easy way to create new POLLs without needing to use the newly changed UI

;(function () {
    let rng_timestamp
    // Wait until the save function is defined
    const i = setInterval(tryInject, 100)

    // Inject if the save function is defined
    function tryInject() {
        const old_save = unsafeWindow.require('discourse/controllers/composer').default.prototype.save
        if (old_save) {
            clearInterval(i)
            inject(old_save)
        }
    }

    // Wrap the save function with our own function
    function inject(old_save) {
        const new_save = async function (t) {
            const composer = document.querySelector('textarea.d-editor-input') // Reply box
            composer.value += await commune(composer) // Modify message
            composer.value = await delete_commands(composer.value) // Deletes the lines with !poll commands
            composer.dispatchEvent(new Event('change', { bubbles: true, cancelable: true })) // Let Discourse know
            old_save.call(this, t) // Call regular save function
        }
        unsafeWindow.require('discourse/controllers/composer').default.prototype.save = new_save // Inject
    }

    // Grabs the text then returns the POLL
    async function commune(composer) {
        // Get draft text, without quotes
        const text = composer.value.replace(/\[quote((?!\[\/quote\]).)*\[\/quote\]/gis, '')
        // Don't do anything if results are already present
        if (text.match(/(<!-- START ANSWERS -->|<wmki>)/i)) return ''
        // Get responses
        const responses = await get_responses(text)

        // If no commands were found, don't modify the post
        if (responses === '') return ''
        // If commands were found, append a reply
        return (
            '\n\n<!-- START ANSWERS -->\n\n' +
            `${responses}\n\n` +
            '<!-- END ANSWERS -->\n'
            // </p> and </blockquote> omitted because the Discourse parser wants to put them in a code block
        )
    }

    // Create responses to the commands
    async function get_responses(text) {
        // Get stored data
        const cache = get_local()
        if (cache.off && !text.match(/!poll\s/i)) return ''
        // Extract the commands
        // Each command is formatted as [whole line, !poll, word1, word2, ...]
        let regx = new RegExp('!poll[^\n]+', 'gi')
        let commands = text.match(regx)?.map((c) => [c, ...c.replace(/\s+/g, ' ').split(' ')]) || []
        // Process commands
        let results = []
        for (let i=0; i<commands.length; i++) {
            let command = commands[i]
            let listing = ''
            let word = command[2].toLowerCase()
            switch (word) {
                case '!help':
                case '!h':
                case '-help':
                case '-h': listing = quote(poll_help())
                           break
                case '!l':
                case '!link': listing = quote(`You can get the latest version of POLL helper by clicking [here]\(https://greasyfork.org/en/scripts/424969-wanikani-forums-poll-helper\)`)
                              break
                case '!trilla': listing = `https://youtu.be/Qw5Vqg7Hq60?t=15\n`
                                break;
                case 'help': listing = quote(`You have entered [i]help[/i] as a POLL option. If you want to find out how to use the POLL `
                                       + `helper, try out [i]!poll -help[/i] or [i]!poll !help[/i] instead\n\n`)
                default: listing += poll(command[0],i)
            }
            //listing = poll(command[0], i)
            if (listing) {
                results.push(listing)
            }
        }
        set_local(cache)
        return results.join('\n\n')
    }

    // Deletes all lines that start with a !poll command from the text by first splitting the String into lines and filtering out command lines
    async function delete_commands(text) {
        return text.split('\n')
            .filter(function(line) {
                return line.substring(0,6).toLowerCase() != '!poll '
            }).join('\n')
    }

    // Provides info on how to poll
    function poll_help() {
        const config_list = [
            `title="<phrase>": Puts a title on your poll`,
            `multi / number: Make the poll multiple choice or number type poll. Omit for single choice`,
            `onvote / onclose: Decide when to show results, either after voting or after the poll closes. Omit to always show`,
            `min<number>: The minimum number of options to choose in a !multi, or the lowest number in a !number poll. Omit for min 1`,
            `max<number>: Same as min, but default is the number of poll options you specified`,
            `step<number>: The step between numbers in a number poll. Omit for step 1`,
            `pie: Make the chart a pie chart. Omit for bar chart`,
            `private: Don't show who voted. Omit for public votes`,
            `close<number>: Close the poll after a number of hours. Omit to never close`,
            `c: Adds a final POLL option that contains Coelacanth`
        ]
        const response =
            `Hi, thank you for using POLL helper!\n\n` +
            `With this tool, you're able to easily create POLLs without the need for clicking through menues.\n\n` +
            `To create a POLL, simply type \`!poll\` followed by the voting options. ` +
            `If an option contains multiple words, make sure to put quotation marks at the beginning and the end of the option.\n\n` +
            `Using the following commands prefixed by ! will change the configuration of the POLL:\n` +
            `\`\`\`http\n${config_list.join('\n')}\n\`\`\`\n` +
            `A sample command might look like \`!poll !multi "Let's start" "POLLing!" !c\`\n\n` +
            `If you write a command in a new line, it will automatically get deleted before posting.\n\n` +
            `By the way, if you're interested but don't have the POLLhelper script yet, check it out [here]\(https://greasyfork.org/en/scripts/424969-wanikani-forums-poll-helper\)!`
        return response
    }

    // Creates a poll from nothing
    // id is needed, so multiple POLLs can be created at the same time
    function poll(line, id) {
        // Remove !poll command
        line = line.replace(/!poll\s+/i, '')
        // Find optional configs
        const config = {
            title: line.match(/!title=["“„«]([^"””»\n]+)["””»]/i)?.[1] || '',
            type: (line.match(/!(multi|number)/i)?.[1] || 'regular').replace(/multi/, 'multiple'),
            result: (line.match(/!(onvote|onclose)/i)?.[1] || 'always').replace(/on/, 'on_'),
            min: line.match(/!min(\d+)/i)?.[1] || 1,
            step: line.match(/!step(\d+)/i)?.[1] || 1,
            chart: !!line.match(/!pie/i) ? 'pie' : 'bar',
            public: !line.match(/!private/i),
            hours: line.match(/!close(\d+)/i)?.[1] || 0,
            coelacanth: line.match(/!c(?!lose)/i) ? 1 : 0
        }
        if (config.close) config.close = new Date(Date.now() + Number(config.hours) * 60 * 60 * 1000).toISOString()
        // Find poll options
        const options_line = line.replace(/!\w+(=["“„«]([^"””»\n]+)["””»])?/gi, '') // Remove configs
        const options =
            options_line
                .match(/(["“„«][^"””»\n]+["””»])|(\S+)/g)
                ?.map((o) => `* ${o.replace(/["“”„”«»]/g, '')}`)
                ?.slice(0, 20) || [] // Match options, max 20
        config.max = line.match(/!max(\d+)/i)?.[1] || options.length + config.coelacanth || 10

        // Build poll
        return (
            `[poll name=MekaniPOLL-${Date.now()}-`+ id + ` type=${config.type} results=${config.result} ` +
            `min=${config.min} max=${config.max} step=${config.step} chartType=${config.chart} ` +
            `public=${config.public} ` +
            (config.close ? `close=${config.close}` : '') +
            `]\n` +
            (config.title ? `# ${config.title}\n` : '') +
            (config.type == 'number' ? '' : options.join('\n')) +
            (options.length < 20 && config.coelacanth==1 ? `\n* Coelacanth` : '') +
            `\n[/poll]`
        )
    }

    // Puts text in a quote by POLL helper
    function quote(text) {
        return `[quote=\"POLLhelper\"]\n${text}\n[/quote]\n`
    }

    // Fetch local storage cache
    function get_local() {
        return JSON.parse(localStorage.getItem('WMKI') || '{ "reminders": [] }')
    }

    // Saves to local storage
    function set_local(cache) {
        localStorage.setItem('WMKI', JSON.stringify(cache))
    }


})()