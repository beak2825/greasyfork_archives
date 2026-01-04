// ==UserScript==
// @name         Wanikani Forums: Bottled WaniMeKani
// @namespace    http://tampermonkey.net/
// @version      1.18.5
// @description  Adds WaniMeKani functions to your own posts
// @author       Kumirei
// @include      https://community.wanikani.com/*
// @grant        GM.xmlHttpRequest
// @connect      relevant-xkcd-backend.herokuapp.com
// @connect      xkcd.com
// @connect      jisho.org
// @downloadURL https://update.greasyfork.org/scripts/422428/Wanikani%20Forums%3A%20Bottled%20WaniMeKani.user.js
// @updateURL https://update.greasyfork.org/scripts/422428/Wanikani%20Forums%3A%20Bottled%20WaniMeKani.meta.js
// ==/UserScript==

;(function () {
    let rng
    // Wait until the save function is defined
    const i = setInterval(tryInject, 100)

    // Inject if the save function is defined
    function tryInject() {
        try {
            const old_save = unsafeWindow.require?.('discourse/controllers/composer')?.default.prototype.save
            if (old_save) {
                clearInterval(i)
                inject(old_save)
            }
        } catch {}
    }

    // Wrap the save function with our own function
    function inject(old_save) {
        const new_save = async function (t) {
            const composer = document.querySelector('textarea.d-editor-input') // Reply box
            composer.value += await commune(composer) // Modify message
            composer.dispatchEvent(new Event('change', { bubbles: true, cancelable: true })) // Let Discourse know
            old_save.call(this, t) // Call regular save function
        }
        unsafeWindow.require('discourse/controllers/composer').default.prototype.save = new_save // Inject
    }

    // Grabs the text then returns the WaniMeKani answers
    async function commune(composer) {
        rng_timestamp = String(Date.now())
        rng = prng(rng_timestamp)
        // Get draft text, without quotes
        const text = composer.value.replace(/\[quote.*?\[\/quote\]/gis, '') // Not sure if this will work the same as the negative lookahead
        // Don't do anything if results are already present
        if (text.match(/(<!-- WANIMEKANI REPLY -->|<wmki>)/i)) return ''
        // Get WaniMeKani responses
        const responses = await get_responses(text)

        // If no commands were found, don't modify the post
        if (responses === '') return ''
        // If commands were found, append a reply
        return (
            `\n\n<hr><wmki><aside class="quote"><div class="title"><img src="https://i.imgur.com/AWYlbcW.png" class="avatar" width="20" height="20"> WaniMeKani:</div><blockquote><p><!-- ${rng_timestamp} -->\n` +
            '<!-- START ANSWERS -->\n\n' +
            `${responses}\n\n` +
            '<!-- END ANSWERS -->\n' +
            // </p> and </blockquote> omitted because the Discourse parser wants to put them in a code block
            '</aside>\n'
        )
    }

    // Create responses to the commands
    async function get_responses(text) {
        // Get stored data
        const cache = get_local()
        if (cache.off && !text.match(/@WaniMeKani\s+(on|hello|hi)/i)) return ''
        // Extract the commands
        // Each command is formatted as [whole line, @wanimekani, word1, word2, ...]
        let regx = new RegExp('@wanimekani[^\n]+', 'gi')
        let commands = text.match(regx)?.map((c) => [c, ...c.replace(/\s+/g, ' ').split(' ')]) || []
        // Process commands
        let results = []
        for (let i = 0; i < commands.length; i++) {
            let command = commands[i]
            let listing, n
            let phrase = match_phrase(command[0], command[3])
            let word = command[2].toLowerCase()
            switch (word) {
                case 'help':
                case 'list':
                case 'commands':
                    listing = `Listing all commands\n${list_commands()}`
                    break
                // Roll dice
                case 'roll':
                    // Dice
                    if (command[3]?.match(/^\d+d\d+/i)) {
                        let [roll, count, faces] = command[3].match(/^(\d+)d(\d+)/i)
                        listing = lister(`Rolling ${roll}`, ':game_die:', dice(count, faces))
                        // Rick roll
                    } else if (command[3]?.match(/^rick$/)) {
                        listing = lister(`Rolling rick`, '', rick())
                    }
                    break
                // Tell your fortune
                case 'fortune':
                case '8ball':
                    listing = lister(`8ball says`, ':crystal_ball:', random_pick(lists.fortune))
                    break
                // Get a quote
                case 'quote':
                    n = command[3]?.match(/^\d+$/)?.[0] || random_int(0, lists.quote.length - 1)
                    listing = lister(`Quote #${n}`, '', quote(n))
                    break
                // Flip tables
                case 'flip':
                case 'coin':
                case 'table':
                    listing = lister(`Flipping a ~~coin~~ table`, '', random_pick(lists.table))
                    break
                // Rate something
                case 'rate':
                    listing = lister(`Rating "${phrase || 'nothing'}"`, '', random_pick(lists.rate))
                    break
                // Echo something the user said
                case 'echo':
                case 'say':
                    listing = lister('', ':robot:', phrase || 'ERROR: YOU ARE A BUTT')
                    break
                // Tells a user something
                case 'tell':
                    listing = lister('', ':robot:', `${command[3]}: ${match_phrase(command[0], command[4]) || ''}`)
                    break
                // It's not like the bot likes you or anything!!
                case 'tsun':
                case 'tsundere':
                case 'tsuntsun': // because it's cute, ok
                    listing = lister(`WaniMeKani says`, ':anger:', random_pick(lists.tsundere))
                    break
                // Get a wikipedia article
                case 'wikipedia':
                case 'wiki':
                case 'pedia': // Rose why
                    listing = `Searching Wikipedia for "${phrase}"\n${await wikipedia(phrase)}`
                    break
                // Searches MAL for anime and manga
                case 'anime':
                case 'manga':
                    listing = `Searching MAL for "${phrase}" ${word}\n${await mal(word, phrase)}`
                    break
                // Searches Jisho
                case 'jisho':
                    listing = `Searching Jisho for "${phrase}"\nhttps://jisho.org/search/${phrase}`
                    break
                // Searches Wiktionary
                case 'wiktionary':
                    listing = `Searching Wiktionary for "${phrase}"\nhttps://en.wiktionary.org/wiki/${phrase}`
                    break
                // Single layer factorization
                case 'guzinda': // Rose why
                    listing = lister(`${command[3]} guzinda ${command[4]}`, '', guzinda(command[3], command[4]))
                    break
                // Mewos things!?
                case 'trunkify': // Rose why
                    listing = lister('As Trunklayer would put it', '', trunkify(phrase))
                    break
                // Makes a poll
                case 'poll': // Rose why
                    listing = poll(command[0])
                    break
                // Provides info on how to poll
                case 'poll?':
                    listing = lister(`Here's how you create a poll with WaniMeKani`, '', poll_help())
                    break
                // Links the bot thread
                case 'install':
                    listing = `To install WaniMeKani visit this thread\nhttps://community.wanikani.com/t/userscript-forums-bottled-wanimekani/49785/1`
                    break
                // Links the 6d6 button script
                case '6d6button':
                    listing = `Want a button to do the rolling for you? Use this\n\nhttps://greasyfork.org/en/scripts/422733-wanikani-forums-roll-6d6`
                    break
                // Quotes a random post from the say something threads
                case 'say-something':
                    listing = `In a thread far far away...\n${await quote_random_post(30543)}`
                    break
                // Gets a random OOQ from the OOQ thread
                case 'oocq':
                    listing = `Guess the context!\n${await oocq()}`
                    break
                // Gets a random or specific xkcd comic, or searches
                case 'xkcd':
                    listing = await xkcd(command)
                    break
                // Spells things for you?
                case 'spell':
                    listing = lister(`"${phrase}" is spelled`, ':memo:', Array.from(phrase.toUpperCase()).join('&#45;'))
                    break
                case 'morse':
                    const is_morse = !phrase.match(/[^.-\s\/]/)
                    listing = lister(is_morse ? `<pre>${phrase}</pre>` : `"${phrase}" is`, '', morse(is_morse, phrase))
                    break
                // Responds with the version and update date
                case 'version':
                    listing = lister(`You are running`, '', `Version ${GM_info.script.version}`)
                    break
                // Links the visual guide to installing scripts
                case 'scripts?':
                    listing = `Don't know how to install scripts? Have a look at this thread\nhttps://community.wanikani.com/t/visual-guide-on-how-to-install-a-userscript/12136`
                    break
                // Links the visual guide to installing scripts
                case 'remind':
                case 'remindme':
                case 'reminder':
                    const [reminder, rem_text] = set_reminder(cache, command[3], match_phrase(command[0], command[4]))
                    listing = lister(
                        `Setting a reminder for ${reminder}`,
                        ':timer_clock:',
                        `You will be reminded after ${rem_text}`,
                    )
                    break
                // Plays a slot machine game
                // TODO: make betterer
                case 'slot':
                    listing = lister(`:slot_machine:`, '', slot_machine())
                    break
                // Turns the bot off
                case 'off':
                case 'shut': // up, off, it, pancakes
                case 'silence':
                    cache.off = true
                    listing = 'Power off...'
                    break
                // Greeting
                case 'hello':
                case 'hi':
                    listing = 'Hello there!'
                // Turn the bot on
                case 'on':
                    cache.off = false
                    break
                // Thank the bot
                case 'thank':
                case 'thanks':
                    listing = lister('', ':high_touch:', `Thank you ${command[3]}!`)
                    break
                // Quotes a random dog thread post
                case 'dog':
                case 'doggie':
                case 'doggo':
                case '犬':
                case 'いぬ':
                    listing = `:dog: Is this a dog?\n${await quote_random_post(18157)}`
                    break
                // Quotes a random cat thread post
                case 'cat':
                case 'kitten':
                case 'kitty':
                case 'glias':
                    listing = `:cat: Is this a cat?\n${await quote_random_post(13057)}`
                    break
                // Quotes a random meme thread post
                case 'meme':
                    listing = `:robot: HA HA HA\n${await quote_random_post(15657)}`
                    break
                // Get stats
                case 'stats':
                    const stats = Object.entries(cache.stats)
                        .map((a) => a.join(': '))
                        .join('\n')
                    listing = lister(`Here are your stats`, '', stats)
                    break
                // Get user info
                case 'user':
                    listing =
                        `[details="Here is some info about ${phrase}"]\n` +
                        `[quote]\n${await user(phrase)}\n[/quote]\n[/details]`
                    break
                // Takes you to the greasyfork page
                case 'update':
                    const gf_link = 'https://greasyfork.org/en/scripts/422428-wanikani-forums-bottled-wanimekani'
                    listing = `Opening the [GreasyFork page](${gf_link})...`
                    unsafeWindow.open(gf_link)
                    break
                // More general commands
                default:
                    // I love you
                    if (command[0].match(/@WaniMeKani\s+i\s+love\s+you/i)) {
                        word = 'love'
                        listing = lister('Requiting love', ':kiss:', random_pick(lists.love))
                        break
                    }
                    break
            }
            if (listing) {
                results.push(listing)
                if (typeof Object.values(cache.stats || {})[0] == 'string') cache.stats = {} // Fixing an oops
                cache.stats = Object.assign(cache.stats || {}, { [word]: cache.stats?.[word] + 1 || 1 }) // Update stats
            }
        }
        results.push(...get_reminders(cache))
        set_local(cache)
        return results.join('\n\n')
    }

    // All the commands
    const command_list = [
        'Help / list / commands: List all the commands',
        'Roll <dice>d<faces>: Rolls a number of dice with a chosen number of faces',
        'Roll rick: ???',
        'Fortune / 8ball: Gives you a random fortune',
        'Quote <number?>: Gives you a random or specific quote',
        'Flip / coin / table: Flips a coin (table)',
        'Rate <word / "phrase">: Rates your word or phrase',
        'Echo / say <word / "phrase">: Makes WaniMeKani repeat something',
        'Tell @<user> <word / "phrase">: Makes WaniMeKani @mention a user and tell them something',
        'Tsundere: Makes WaniMeKani a tsundere',
        'Wikipedia <word / "phrase">: Search Wikipedia for something',
        'I love you: Makes WaniMeKani respond to your confession',
        'Anime <word / "phrase">: Searches MyAnimeList for an anime',
        'Manga <word / "phrase">: Searches MyAnimeList for a manga',
        'Jisho <word / "phrase">: Searches Jisho for a query',
        'Wiktionary <word / "phrase">: Searches Wiktionary for a query',
        'Guzinda <number> <number>: What guzinda number???',
        'Trunkify <word / "phrase">: Meows things',
        'Poll: Do @WaniMeKani poll? for more info',
        'Install: Links the installation thread',
        'Say-something: Quotes a random post from the Say Something About The Person Above You thread',
        'OOCQ: Quotes a random post from the Out Of Context Quotes thread',
        'xkcd <number?>/latest/search <word / "phrase">: Gives you the a random, a specific, the latest, or a searched for xkcd comic',
        'Spell <word / "phrase">: Teaches you how to combine letters into words',
        'Morse <word / "phrase">: Translates to and from morse code',
        'Remindme <num?>y<num?>mon<num?>w<num?>d<num?>h<num?>s <word / "phrase">: Sets a reminder for a relative time in the future',
        'Off: Makes the bot ignore you',
        'On: Makes the bot not ignore you',
        'Dog: Quotes a random post from the dog thread',
        'Cat: Quotes a random post from the cat thread',
        'Meme: Quotes a random post from the memes thread',
        'Stats: Lists your usage of the commands',
        'User <username>: Returns info about the user',
    ]

    // Create a response listing
    function lister(title, icon, text) {
        return `${title}\n[quote]\n${icon} ${text}\n[/quote]`
    }

    // Roll some dice
    function dice(count, faces) {
        return new Array(Number(count))
            .fill(null)
            .map((_) => random_int(1, faces))
            .join(', ')
    }

    // Rick roll the butt who issued the command
    function rick() {
        unsafeWindow.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
        return `Never gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry\nNever gonna say goodbye\nNever gonna tell a lie and hurt you`
    }

    // Pick quote number n
    function quote(n) {
        return lists.quote[n]?.join(' – ') || `There is no quote #${n}`
    }

    // Searches for a wikipedia article
    async function wikipedia(query) {
        let url = 'https://en.wikipedia.org/w/api.php?origin=*'
        const params = {
            action: 'query',
            list: 'search',
            srsearch: query,
            srlimit: 1,
            format: 'json',
        }
        Object.entries(params).forEach(([key, param]) => (url += `&${key}=${param}`))
        const res = await fetch(url).then((r) => r.json())
        const title = res.query.search[0]?.title.replace(/ /g, '_')
        return title ? `https://en.wikipedia.org/wiki/${title}` : `[quote]\nNo results\n[/quote]`
    }

    // Lists all the available commands (hopefully)
    function list_commands() {
        return `\`\`\`http\n${command_list.join('\n')}\n\`\`\``
    }

    // Searcher MyAnimeList for manga and anime
    async function mal(type, query) {
        const result = await fetch(`https://api.jikan.moe/v3/search/${type}?q=${query}`).then((r) => r.json())
        return result?.results?.[0]?.url || '<blockquote>No results</blockquote>'
    }

    // Factorizes sillily
    function guzinda(factor, n) {
        return Number(factor) > Number(n) ? 'no guzinda' : `${factor} guzinda ${n} ${Math.floor(n / factor)} thymes`
    }

    // Creates a poll from nothing
    function poll(line) {
        // Remove @wanimekani poll
        line = line.replace(/@wanimekani\s+poll\s+/i, '')
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
        }
        if (config.close) config.close = new Date(Date.now() + Number(config.hours) * 60 * 60 * 1000).toISOString()
        // Find poll options
        const options_line = line.replace(/!\w+(=["“„«]([^"””»\n]+)["””»])?/gi, '') // Remove configs
        const options =
            options_line
                .match(/(["“„«][^"””»\n]+["””»])|(\S+)/g)
                ?.map((o) => `* ${o.replace(/["“”„”«»]/g, '')}`)
                ?.slice(0, 20) || [] // Match options, max 20
        config.max = line.match(/!max(\d+)/i)?.[1] || options.length || 10 // Default max for multiple choice

        // Build poll
        return (
            `[poll name=MekaniPOLL-${Date.now()} type=${config.type} results=${config.result} ` +
            `min=${config.min} max=${config.max} step=${config.step} chartType=${config.chart} ` +
            `public=${config.public} ` +
            (config.close ? `close=${config.close}` : '') +
            `]\n` +
            (config.title ? `# <big><b>${config.title}</b></big>\n` : '') +
            (config.type == 'number' ? '' : options.join('\n')) +
            `\n[/poll]`
        )
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
        ]
        const response =
            `Polls are made with the command "@WaniMeKani poll" followed by poll options.\n` +
            `Any word not prefixed by ! will be interpreted as a poll option.\n\n` +
            `To quickly configure your poll, use these commands, prefixed with !\n` +
            `\`\`\`http\n${config_list.join('\n')}\n\`\`\``
        return response
    }

    // Finds a random post from the say something threads
    async function oocq() {
        const post = await random_post(30523)
        const text = post.raw.match(/\[quote.*\]([^\[]*)\[\/quote\]/i)[0].replace(/, post.*"\]/i, '"]')
        return text || '> No quote found, try again'
    }

    // Quotes a random post from a thread
    async function quote_random_post(thread_id) {
        const post = await random_post(thread_id)
        return `[quote="${post.username}"]\n${post.raw}\n[/quote]`
    }

    // Finds a random post from a thread
    async function random_post(topic_id) {
        const thread = await fetch(`/t/${topic_id}.json`).then((r) => r.json())
        const post = await fetch('/posts/' + random_pick(thread.post_stream.stream) + '.json').then((r) => r.json())
        return post
    }

    //Processes the replacable substrings into a valid case-correct replacement
    function trunkify_get_subst(phrase) {
        let result = ''
        //Basic replacement
        switch (phrase.toLowerCase()) {
            case 'nice':
                result = trunkify_get_subst('ni') + 'aaaaaaaaaice'
                break
            case 'ni':
            case 'na':
                result = 'nya' + 'a'.repeat(random_int(0, 3))
                break
            case 'ma':
            case 'now':
                result = 'meow'
                break
            case 'per':
                result = 'purr' + 'r'.repeat(random_int(0, 3))
                break
            case 'cat':
                result = '**cat**'
                break
        }

        //Match case (all uppercase, first letter capitalized, all lowercase)
        if (phrase === phrase.toUpperCase()) return result.toUpperCase()
        else if (phrase[0] === phrase[0].toUpperCase()) return result[0].toUpperCase() + result.slice(1)
        return result
    }

    //Trunkifies the input text
    function trunkify(txt) {
        //Simple regex to get the first trunkifyable phrase from every word
        let regex = /(nice|ni|na|ma|per|cat|now)\w*/gi

        let matches = txt.matchAll(regex)

        //Substitution loop
        let offset = 0
        let result = txt
        for (let match of matches) {
            let matched_txt = match[1]
            let subst_str = trunkify_get_subst(matched_txt)
            result =
                result.slice(0, match.index + offset) +
                subst_str +
                result.slice(match.index + offset + matched_txt.length)

            offset += subst_str.length - matched_txt.length
        }

        return result
    }

    // Morse code interpreter
    function morse(is_morse, text) {
        if (is_morse) return text.replace(/([.-][.-]*|\/|\s)/g, (_, x) => lists.morse.decode[x])
        else return '<pre>' + text.toLowerCase().replace(/./g, (x) => (lists.morse.encode[x] || x) + ' ') + '</pre>'
    }

    // Can either search for a comic, get a specific comic (number), or a random comic
    async function xkcd(command) {
        if (command[3]?.toLowerCase() == 'search') {
            const query = match_phrase(command[0], command[4])
            return `Searching XKCD for "${query}"\n${await xkcd_search(query)}`
        } else if (command[3]?.toLowerCase() == 'latest') {
            return `https://xkcd.com/${await latest_xkcd()}`
        } else {
            const n = command[3]?.match(/^\d+$/)?.[0] || random_int(1, await latest_xkcd())
            return `XKCD #${n}\nhttps://xkcd.com/${n}`
        }
    }

    // Promise the number of the latest xkcd comic
    function latest_xkcd() {
        return new Promise((res, rej) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'https://xkcd.com/info.0.json',
                onload: (xhr) => res(JSON.parse(xhr.responseText).num),
            })
        })
    }

    // Searches for an XKCD comic
    function xkcd_search(query) {
        query = unsafeWindow.encodeURI(query.replace(/\s+/g, '+'))
        const promise = new Promise((res, rej) => {
            GM.xmlHttpRequest({
                method: 'POST',
                url: new URL('https://relevant-xkcd-backend.herokuapp.com/search'),
                data: 'search=' + query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                onload: function (xhr) {
                    const first_result = JSON.parse(xhr.responseText).results[0].url
                    res(first_result)
                },
            })
        })
        return promise
    }

    // Creates a reminder
    function set_reminder(cache, rel_time, text) {
        const times = parse_rel_time(rel_time)
        // Reduce to ms
        const ms_day = 24 * 60 * 60 * 1000
        const ms_map = [365 * ms_day, 31 * ms_day, 7 * ms_day, ms_day, ms_day / 24, 60 * 1000, 1000]
        const ms = times.map((item, i) => item * ms_map[i]).reduce((a, b) => a + b, 0)
        // Set reminder
        const date = Date.now() + ms
        text = text || document.querySelector('.reply-to .user-link')?.href || ''
        cache.reminders.push([date, text])
        // Return strings
        const time_map = ['y', 'mon', 'w', 'd', 'h', 'm', 's']
        const rel = times
            .map((item, i) => (item ? item + time_map[i] : 0))
            .filter((a) => !!a)
            .join('')
        const msg = new Date(date).toLocaleString()
        return [rel, msg]
    }

    // Parses relative time
    function parse_rel_time(str) {
        const times = [0, 0, 0, 0, 0, 0, 0] // [years, months, weeks, days, hours, minutes, seconds]
        const matches = str.matchAll(/(\d+)y|(\d+)mon|(\d+)w|(\d+)d|(\d+)h|(\d+)m|(\d+)s/gi)
        Array.from(matches).forEach((match) => {
            for (let i = 1; i <= 7; i++) times[i - 1] = times[i - 1] || Number(match[i]) || 0
        })
        return times
    }

    // Gets expired reminders
    function get_reminders(cache) {
        const date = Date.now()
        const listings = []
        cache.reminders
            .filter((r) => r[0] < date)
            .forEach((r) => {
                const r_date = new Date(r[0]).toLocaleString()
                listings.push(lister(`REMINDER FOR ${r_date}`, ':timer_clock:', r[1] || `You did not set a message`))
            })
        cache.reminders = cache.reminders.filter((r) => r[0] > date)
        return listings
    }

    // Fetches user data
    async function user(user) {
        const user_data = fetch(`/u/${user}.json`).then((r) => r?.json())
        const user_summary = fetch(`/u/${user}/summary.json`).then((r) => r?.json())
        let [data, summary] = await Promise.all([user_data, user_summary])
        if (summary.errors) return `:robot: Error: user profile is hidden`
        user = data.user
        summary = summary.user_summary
        const now = Date.now()
        const heart = `<img class="emoji" src="https://emoji.discourse-cdn.com/apple/purple_heart.png?v=9">`
        const users_map = (u) => [u.avatar_template.replace(/{size}/, '20'), u.username, u.count]
        const liked_by = summary.most_liked_by_users.map(users_map)
        const liked = summary.most_liked_users.map(users_map)
        const replied = summary.most_replied_to_users.map(users_map)
        const users_item = (l, i) =>
            `<td><img class="avatar" src="${l[i]?.[0] || ''}" width=20 height=20> ` +
            `${l[i]?.[1] || ''}<td>${(l[i]?.[2] || 0).toLocaleString()}`
        const users_row = (i) => `<tr>` + users_item(liked, i) + users_item(liked_by, i) + users_item(replied, i)
        const users_rows = () =>
            new Array(6)
                .fill(null)
                .map((_, i) => users_row(i))
                .join('\n')
        const html =
            `<div align="center">` +
            `<img class="avatar" src="${user.avatar_template.replace(/{size}/, '40')}" height=40 width=40>` +
            `<b>&nbsp; ${user.username}</b> - ${user.title || 'Guppies'}\n\n${user.bio_raw || ''}` +
            `<hr><table><thead><tr><th>Featured<td><a href="/t/x/${user.featured_topic?.id || ''}">` +
            `${user.featured_topic?.title || ''}<th>Level<td>${user.primary_group_name?.split('-')[1] || ''}` +
            `<tr><th>Website<td><a href="${user.website || ''}">${user.website_name || ''}` +
            `<th>Location<td>${user.location || 'Durtle Hell'}</table>` +
            `<hr><table><thead><tr><th>Joined<td>${user.created_at.slice(0, 10)}` +
            `<th>Seen<td>${rel_time(user.last_seen_at, now)}<th>Posted<td>${rel_time(user.last_posted_at, now)}` +
            `<tr><th>Posts<td>${summary.post_count.toLocaleString()}<th>Topics<td>` +
            `${summary.topic_count.toLocaleString()}<th>Read<td>${rel_time(0, summary.time_read * 1000)}` +
            `<tr><th>Visits<td>${summary.days_visited.toLocaleString()}<th>Views` +
            `<td>${user.profile_view_count.toLocaleString()}<th>Badges<td>${user.badge_count}` +
            `<tr><th>Given<td>${summary.likes_given.toLocaleString()} ${heart}<th>Received<td>` +
            `${summary.likes_received.toLocaleString()} ${heart}</table><hr>` +
            `<table><thead><tr><th>Most Liked<th><th>Most Liked By<th><th>Most Replied To<th>` +
            `</thead>` +
            users_rows() +
            `</table>`
        return html
    }

    // Gets a relative time difference
    function rel_time(t0, t1) {
        t0 = new Date(t0).getTime()
        t1 = new Date(t1).getTime()
        const diff = t1 - t0
        const time_map = [31536000000, 2592000000, 86400000, 3600000, 60000, 1000] // ms in year, month, day, hour, minute, second
        const rel = time_map.map((d, i) => Math.floor((i > 0 ? diff % time_map[i - 1] : diff) / d))
        const times = ['y', 'mon', 'd', 'h', 'm', 's']
        const i = rel.findIndex((a) => a !== 0)
        return rel[i] + times[i] + ' ' + (i < times.length - 2 ? rel[i + 1] + times[i + 1] : '')
    }

    // Fetch local storage cache
    function get_local() {
        return JSON.parse(localStorage.getItem('WMKI') || '{ "reminders": [] }')
    }

    // Saves to local storage
    function set_local(cache) {
        localStorage.setItem('WMKI', JSON.stringify(cache))
    }

    // Does a slotty slot
    function slot_machine() {
        const slot_item = () => `![image|50x50](upload://${random_pick(lists.slot)}.png)`
        const slot_row = () => slot_item() + slot_item() + slot_item() + '\n'
        return slot_row() + slot_row() + slot_row()
    }

    // Matches a quoted string in a string
    function match_phrase(string, fallback) {
        return fallback?.match(/^["“”„”«»]/) ? string.match(/["“„«]([^"””»\n]+)["””»]/i)?.[1] : fallback
    }

    // Picks a random item from an array
    function random_pick(array) {
        return array[random_int(0, array.length - 1)]
    }

    // Get random integer in inclusive interval [min, max]
    function random_int(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(rng() * (max - min + 1)) + min
    }

    // Creates a new PRNG
    function prng(seed) {
        const seeder = xmur3(seed)
        const new_prng = mulberry32(seeder())
        return new_prng
    }

    // Seed generator for PRNG
    function xmur3(str) {
        for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
            (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)), (h = (h << 13) | (h >>> 19))
        return function () {
            h = Math.imul(h ^ (h >>> 16), 2246822507)
            h = Math.imul(h ^ (h >>> 13), 3266489909)
            return (h ^= h >>> 16) >>> 0
        }
    }

    // Seedable PRNG
    function mulberry32(a) {
        return function () {
            var t = (a += 0x6d2b79f5)
            t = Math.imul(t ^ (t >>> 15), t | 1)
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296
        }
    }

    const lists = {
        fortune: [
            'It is certain',
            'It is decidedly so',
            'Without a doubt',
            'Yes definitely',
            'You may rely on it',
            'As I see it, yes',
            'Most likely',
            'Outlook good',
            'Yes',
            'Signs point to yes',
            'Reply hazy, try again',
            'Ask again later',
            'Better not tell you now',
            'Cannot predict now',
            'Concentrate and ask again',
            "Don't count on it",
            'My reply is no',
            'My sources say no',
            'Outlook not so good',
            'Very doubtful',
        ],
        rate: [
            'It is literally the worst. -1/10',
            "It's trash! 0/10",
            'Terrible! 1/10',
            'Not worth it 2/10',
            'I think you should reconsider 3/10',
            'I guess it could be worse 4/10',
            'MEH 5/10',
            `${Math.random() < 0.5 ? 'Girl' : 'Boy'}, you can do better 6/10`,
            'I like this 7/10',
            "Whatever it is, it's great! 8/10",
            'You should marry this thing before it gets away 9/10',
            'Wow! 10/10',
            'OMG I LOVE IT 11/10',
        ],
        table: ['(╯°□°）╯︵ ┻━┻', '┬─┬ノ(ಠ_ಠノ)'],
        tsundere: [
            'B-Baka!',
            "I'm not a tsundere!",
            'Urusai, urusai, urusai!!',
            'ANTA BAKA',
            'BAKA CHI',
            'What are you, stupid?',
            "I-It's not like I do this for you! I do this because I have freetime, that's all! ┐(￣ヘ￣;)┌",
            'I like you, you idiot!',
            "BAKAAAAAAAAAAAAAAA!!!!! YOU'RE A BAKAAAAAAA!!!!",
            "I'm just here because I had nothing else to do!",
            'I hate you!',
            'Are you stupid?',
            "You should be grateful I'm even responding to you!",
            "Don't misunderstand, it's not like I like you or anything...",
            'H-Hey.... (//・.・//)',
            '....T-Thanks.....',
            'T-Tch! S-Shut up!',
            'Can you be ANY MORE CLUELESS?',
            "HEY! It's a privilege to even be able to talk to me! You should be honored!",
        ],
        love: [
            'I love you too!!!',
            'Uhhh',
            'What?',
            'Um, no',
            "I don't want to ruin our friendship",
            'Not now',
            "When's our first date? :)",
            'Is it April 1st?',
            'Do I know you?',
            'Omg, I thought it was one sided!',
            "I'm married",
            "I'll marry you for a green card",
            'i like you too :blush: :hug:',
        ],
        morse: {
            decode: {
                '-----': '0',
                '.----': '1',
                '..---': '2',
                '...--': '3',
                '....-': '4',
                '.....': '5',
                '-....': '6',
                '--...': '7',
                '---..': '8',
                '----.': '9',
                '.-': 'a',
                '-...': 'b',
                '-.-.': 'c',
                '-..': 'd',
                '.': 'e',
                '..-.': 'f',
                '--.': 'g',
                '....': 'h',
                '..': 'i',
                '.---': 'j',
                '-.-': 'k',
                '.-..': 'l',
                '--': 'm',
                '-.': 'n',
                '---': 'o',
                '.--.': 'p',
                '--.-': 'q',
                '.-.': 'r',
                '...': 's',
                '-': 't',
                '..-': 'u',
                '...-': 'v',
                '.--': 'w',
                '-..-': 'x',
                '-.--': 'y',
                '--..': 'z',
                '-.-.--': '!',
                '.-.-.-': '.',
                '--..--': ',',
                '..--..': '?',
                '/': ' ',
                ' ': '',
                '.----.': `'`,
            },
            encode: {
                '!': '-.-.--',
                ',': '--..--',
                '.': '.-.-.-',
                '!': '-.-.--',
                ',': '--..--',
                '.': '.-.-.-',
                ' ': '/',
                '?': '..--..',
                "'": '.----.',
                0: '-----',
                1: '.----',
                2: '..---',
                3: '...--',
                4: '....-',
                5: '.....',
                6: '-....',
                7: '--...',
                8: '---..',
                9: '----.',
                a: '.-',
                b: '-...',
                c: '-.-.',
                d: '-..',
                e: '.',
                f: '..-.',
                g: '--.',
                h: '....',
                i: '..',
                j: '.---',
                k: '-.-',
                l: '.-..',
                m: '--',
                n: '-.',
                o: '---',
                p: '.--.',
                q: '--.-',
                r: '.-.',
                s: '...',
                t: '-',
                u: '..-',
                v: '...-',
                w: '.--',
                x: '-..-',
                y: '-.--',
                z: '--..',
            },
        },
        slot: [
            `zmzm1HU4TpWujqV4Bca6nt2Rztq`,
            `mOEUSid4owlDYDPB2grNETMb5sL`,
            `cTJtuGX9Kra2nVzkV0DOtgqwsgi`,
            `jHiXb5LKZIfuqtYJsvmTurafG0l`,
            `2byFtD33Qs8jRQ3KADw2UfDuHAo`,
            `3Ir7ZX8JIfEVsdZYGoQsVWeXvOw`,
            `i2OPKunXTyXP8bwicsL2VuDWfo3`,
            `jaLSZDS1OeWqm16cBr4VJSBkzfK`,
            `lkKQdF9e59B8svfGKYJsVGJBpug`,
            `o78II7QewaNL854kkadrllyESjb`,
            `5LXUspgVc43bg0fkSypYjBbmIqr`,
            `FGlfuxnsb0zTHTv1ziCNC6jaEV`,
            `k1RCNGuJsWt6h1rwk0xw6XmabQ9`,
            `90dipQgYpmI7aeSi3v7X4RdTGqC`,
            `ss0tf2pTbWlLZtpCeHFokyuNm3o`,
            `bpeoTG7tCF6xkJXTS7kHDq10NCS`,
            `eF3fe6BL4c33xylT8Tq5yrTNHZ6`,
            `A8POKmGHQltyXZOv8lx1K0b9BEz`,
            `icsvWh3HHW7T2vLyN0sBVjMeE8Q`,
            `eKI1hnHmyC3uFwSa2lrb0Mts6Gn`,
            `9FngeGMo7HV7M6596OBx9Fpbvm8`,
            `wyG64i3lTq2NmvJXA3TChMo3VkQ`,
        ],
        quote: [
            [`In the middle of every difficulty lies opportunity`, `Albert Einstein`],
            [`Freedom is not worth having if it does not connote freedom to err.`, `Mahatma Gandhi`],
            [`Don’t cry because it’s over, smile because it happened.`, `Dr Seuss`],
            [`If you want something done right, do it yourself.`, `Charles-Guillaume Étienne`],
            [`Believe you can and you’re halfway there.`, `Theodore Roosevelt`],
            [`Life is like a box of chocolates. You never know what you’re gonna get.`, `Forrest Gump’s Mom`],
            [`That’s one small step for a man, a giant leap for mankind.`, `Neil Armstrong`],
            [`Do one thing every day that scares you.`, `Eleanor Roosevelt`],
            [`Mistakes are always forgivable, if one has the courage to admit them.`, `Bruce Lee`],
            [`Whatever the mind of man can conceive and believe, it can achieve.`, `Napoleon Hill`],
            [
                `If you know the kanji and know yourself, you need not fear the result of a hundred reviews. If you know yourself but not the kanji, for every right answer made you will also suffer a wrong, If you know neither the kanji nor yourself, you will fail every session.`,
                `Wyre, T. (500 BC). The Art of Kanji. Tokyo: WK Publishing, p.36`,
            ],
            [
                `“For all thy burns, thou shall celebrate with thy people, deep into the night.” And the people did rejoice and did feast upon the lambs and toads and tree-sloths and fruit-bats and orangutans breakfast cereals and crabs and turtles and tofu and vegan sausages and ramen and cyanide. Now did the Crabigator say, “Though if thou faileth in thy task of reviews, thou shall be punished with not two, and not three, but one level down. Four is right out! Being one the level, that shall be put down on said item, which is a reasonable punishment, the user, who, being naughty in my sight, shall snuff it.”`,
                `The Book of Spaced Repetition, Chapter 7, Verses 42 - 48.`,
            ],
            [`I don’t need vacation mode.`, `Memoirs from Forever Level 11, Chapter 1, Page 1`],
            [
                `In the beginning The Crabigator created the radicals and the kanji. The kanji were formless and written with the wrong stroke order, and romaji was over the kanji of the unlearned, and the Spirit of The Crabigator was moving over the radicals of the the unlearned. Then The Crabigator said, “Let there be learning”; and there was learning. The Crabigator saw that the learning was good; and The Crabigator separated the learning from the romaji. The Crabigator called the learning studying, and the romaji He called trash. And there was weeb and there was student, one learning.`,
                `Kanji Genesis 1, Page 1`,
            ],
            [
                `Through out all my research I have found many things that haunt me. This man. This man who has tried to strangle me yet admits to being my friend. The class clown that steals fins from children and old ladies. The tall monster with 2 mouths. On top of all this, he is my father. こういち. Who are you?`,
                `The Mysteries of こういち`,
            ],
            [`This thread is confusing.`, `Book of Suika, Verse 1, Chapter 1`],
            [
                `Verily verily, I say onto thee, thy shall not post in a thread that’s been dead for a year,
    for it will evoke the anger of senior site members!`,
                `Syphus, a Kanji veteran`,
            ],
            [
                `“This is too easy.”
    “These reviews are so slow.”
    “I’m learning Japanese so fast.”
    “I’ll spend all my time on the forums since there are no reviews.”
    “Give me a sect name Koichi!”`,
                `Confessions of a Sect Guppie`,
            ],
            [
                `Thou arth doomed, for none shall request a sect title, for they suffer the consequences of a lowercase t.`,
                `Everyone on this thread`,
            ],
            [
                `But what is a jo?
    I keep getting whacked with it.
    Revenge will be swift.`,
                `WaniKani Haikus, vol. 2`,
            ],
            [`I study therefore I am.`, `Descartes. R.  Discourse on the Kanji. (1637)`],
            [
                `In the beginning was the radical, and the radical was ground, yet the kanji was one.`,
                `Book of Nemesis, Chapter 42, Verse 1`,
            ],
            [
                `Ask not what the Userscript can do for you; ask how you too can become awesome at creating Userscripts.`,
                `The inauguration of rfindley (taking over from Mempo)`,
            ],
            [
                `I’m on the pursuit of happiness and I know, everything that’s かね ain’t always gonna be gold, I’ll be fine once I get, on the next review…`,
                `Kin Cudi`,
            ],
            [
                `One does not simply walk into Wanikani. Its kanji are guarded by more than just radicals. There is evil there that does not sleep, and the Great Crabigator is ever watchful.
    It is a barren wasteland, riddled with reviews and lessons and mnemonics, the very keys you press on your keyboard are a treacherous pit of doom. Not with ten thousand members could you do this. It is folly.`,
                `Captain Boromir. Lord of the Kanji, Second Book, Chapter II.`,
            ],
            [
                `2,000 kanji.
     6,000 vocabulary words.
     In just over a year.`,
                `Koichi, How To Win Friends And Influence People, 2nd edition
                   (or was it QVC shopping network?  Can’t remember)`,
            ],
            [`Kanji ain’t sh*t but strokes and tricks.`, `Graduate dissertation by Dr Dre`],
            [
                `Either be the Kanji as you are seen,
    or be seen as you kanji.`,
                `Rumi`,
            ],
            [`All hail Koichi!`, `Forgotten sect member`],
            [`Glenn Coco? FOUR for you, Glenn Coco! You go, Glenn Coco. …and none for Koichi, bye.`, `Mean Guppies`],
            [`To review, or not to review. That is the question.`, `Viet / Act 3, Scene 1`],
            [`Now I am become Crabigator, the destroyer of Kanji`, `J. Robert Oppenheimer, 1945`],
            [
                `Aye, study and you may die. Procrastinate, and you’ll live… at least a while.
    And dying in your beds, many years from now, would you be willin’ to
    trade ALL the days, from this day to that, for one chance, just one
    chance, to come back here and finish your reviews, and to tell them that they may take our
    lives, but they’ll never take… OUR FREEDOM!`,
                `William Wallace, The Battle of a Thousand Reviews`,
            ],
            [
                `What we think, or what we know, or what we believe is, in the end, of little consequence.
    The only consequence is the reviews we do.`,
                `John Ruskin`,
            ],
            [`Reviews are a dish best served by Koichi.`, `Unknown Origin`],
            [`I came, I typed, I guru’d!`, `Julius Kaenji, letter to the senate, 47 BC, after the Battle of Radicals.`],
            [`Live long and review. 🖖`, `Spock, son of Sarek. `],
            [
                `So, first of all, let me assert my firm belief that the only thing we
    have to fear are saws cutting into your heart —nameless, unreasoning, unjustified saws
    which paralyze needed efforts to convert radicals into kanji.`,
                `Franklin D. Roosevelt`,
            ],
            [`My heart rows as the cocoa flows`, `歌の心`],
            [`YOU SHALL NOT PASS to the next level`, `ガンダルフ, a great Kanji-sorcerer from 中地球`],
            [
                `I am wiser than this fellow Turtle, for neither of us appears to know anything great and good; but he fancies he knows something, although he knows nothing; whereas I, as I do not know anything, so I do not fancy I do. In this trifling particular, then, I appear to be wiser than he, because I do not fancy I know what I do not know.`,
                `The Apology of a Turtle, Forum Dialogue 29b-c`,
            ],
            [`I knew this`, `Override Script Abuser`],
            [`When in doubt, こう or ちょう!`, `Colin McRae`],
            [
                `I hate the word ‘radical.’  Wolverine, hick, Longcat, boob and boob grave, ground and Tie Fighter as radical names. If there are already official radicals, then why were these even born? There are kanji parts that use the official name, Constructicons left untouched, and kanji-pets that were needlessly changed or made on a whim. If that’s all caused by radicals, then the Crabigator is incredibly unfair and cruel. Because, ever since that day, none of us had a future in Japanese, and the only certain thing was that we would never reach level 60.`,
                `Mawaru Crabigatordrum intro`,
            ],
            [
                `The defeat of a large group of reviews is a matter of division into small groups. The defeat of a small group of reviews is a matter of division into forms and radicals.`,
                `Tripwyre`,
            ],
            [
                `Koichi creates Textfugu
    Koichi destroys Textfugu
    Koichi creates Etoeto
    Etoeto destroys Koichi
    Kanji destroys man
    Wanikani inherits the earth`,
                `イアンマルコム`,
            ],
            [`To improve is to review, to be perfect is to review often.`, `Crabigator’s Book of Wisdom`],
            [
                `Fear is the path to the dark side… fear leads to not reviewing… not reviewing leads to a pile of reviews… a pile of reviews leads to suffering. `,
                `Yoda, in The Phantom Menace`,
            ],
            [
                `When nine hundred kanji learned you reach, remember as well you will not.`,
                `Yoda, in Return of the Jedi`,
            ],
            [
                `Never doubt that a small group of nearly identical Radicals can change the Kanji meaning. ® Indeed, it is the only thing that ever has.`,
                `Margaret Mead, Kanjithropologist.`,
            ],
            [
                `And when The Crabigator saw the breadth of his domain, he wept, for there were no more turtles to burn`,
                `Anonymous`,
            ],
            [`When there is nothing left to burn, you have to set yourself on fire.`, `Stars, "Your Ex-Lover is Dead"`],
            [
                `Twenty years from now you will be more disappointed by the turtles you didn’t burn than by the ones you did. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover.`,
                `Not Mark Twain`,
            ],
            [
                `Of all the communities available to us there is not one I would want to devote myself to, except for the society of the true kanji students, which has very few living members at any time.`,
                `Albert Einstein`,
            ],
            [
                `The way I hear it, Ms. Chou is some kind of butcher. A peerless, psycho, fucked-up butcher.`,
                `Fenster, The Usual Suspect`,
            ],
            [
                `Give a man kanji and you teach him for a day; give a man radicals and you teach him for a lifetime.`,
                `Common Proverbs (1987), p6`,
            ],
            [`I do not know how to teach kanjis without becoming a disturber of the peace.`, `Spinoza`],
            [
                `This is my reading. There are many others like it, but this one is mine (in this context). My reading is my best friend (in this context). It is my life (in this context). You must master it as you must master my stroke order. Without me, my reading is a different kanji. Without my reading, I am useless. You must fire my reading true. You must read me correctly, differently than my alternate readings, who are trying to confuse you. You must identify me before they mislead you. You will. Before the Crabigator, swear this creed: my study and my vocab list are defenders of the language, we are the masters of our kanji, we are the saviors of mnemonics . So be it, until there is no study, but reading fluently. Amen.`,
                `Kanji Creed`,
            ],
            [
                `I have a dream that one day this Turtle will rise up and type out the true meaning of this kanji: “We hold these truths to be self-evident; that all radicals are created equal.”…I have a dream that these four little radicals will one day live in a nation where they will not be judged by the kanji that they’re in, but by the vocab containing that character.
    `,
                `Martin Luther King Jr., March on Portland, 2017`,
            ],
            [`Is マヨネーズ an instrument?`, `パトリック`],
            [
                `I am the disciple of the Crabigator.
    Nihongo is my body and kanji is my blood.
    I have written over a thousand kanji.
    Unaware of radicals,
    Nor aware of SRS.
    Withstood pain to write kanji, waiting for Koichi’s arrival.
    I have no regrets. This is the only path.
    My whole life is Unlimited Wanikani works.`,
                `A boy who desires to become one with the Kanji`,
            ],
            [
                `There must be something in burning turtles, something we can’t imagine, to make a woman stay in a burning house; there must be something there. You don’t review for nothing.`,
                `Ray Bradbury, Fahrenheit 451 Turtles`,
            ],
            [
                `The burning of a turtle is a happy, happy sight, for even though a turtle is nothing but radicals and readings, it feels as if the ideas contained in the kanji are being learned as the radicals turn to bits and the kun- and on-readings --which are what is holding kanji together-- blacken and curl as the flames do their wondrous work. When someone is burning a turtle, they are showing utter respect for all of the thinking that produced its kanji, all of the labor that went into its words and sentences, and all of the trouble that befell the student. . . `,
                `Lemony Snicket, The Penultimate Burning`,
            ],
            [
                `There is more than one way to burn a turtle. And the world is full of people running around with pending reviews. `,
                `Ray Bradbury`,
            ],
            [
                `Vengeful conquerors burn turtles as if the kanji's souls reside there, too.`,
                `James Gleick, The Turtle: A Radical, a Kanji, a Flood`,
            ],
            [
                `How often have I said to you that when you have eliminated the impossible, whatever remains, however improbable, must be the onyomi reading?`,
                `Arthur Conan Doyle, while backseat-reviewing kanji readings.`,
            ],
            [
                `There is a fifth dimension beyond that which is known to guppies and turtles alike. It is a dimension as vast as homonyms and as timeless as infinity. It is the middle ground between reading and writing, between listening and speaking, and it lies between the pit of man’s fears and the summit of his knowledge. This is the dimension of Japanese fluency. It is an area which we call the Twilight Zone.`,
                `Twilight Zone, season 1`,
            ],
            [
                `Crabigatoria est omnis divisa in partes tres, quarum unam incolunt Radici, aliam Kanji, tertiam qui ipsorum lingua 単語, nostra Vocabulari appelantur. Hi omnes lectio, significatio, forma  inter se differunt.`,
                `Gaius Julius Caesar, De Bello Crabii`,
            ],
            [
                `Because I could not spell "two folks"– /
    Crab kindly wrote for me – /
    The Kanji meant but just Ourselves – /
    But pronounced it "ふたり."`,
                `Exerpt from "死", poet unknown, c. 1800s`,
            ],
            [
                `Because I could not spell “two folks” – /
    Crab kindly wrote for me – /
    The Kanji meant but just Ourselves – /
    But pronounced it “ふたり”.


    We slowly drilled – Crab knew no haste /
    And I had put away /
    My labor and my leisure too, /
    For learning the right way – /


    We passed the School, where Children strove /
    Both 少年 – and 女子 – /
    I could never remember when to use – /
    That Vocab or 少女– /

    …

    Since then – 'tis Centuries – and yet /
    Feels shorter than the Day /
    I first surmised I’d be doing drills /
    Until Eternity –`,
                `"死", poet unknown, c. 1800s`,
            ],
            [
                `Hermione was now teaching Krum how to say ‘national police department’; he kept saying ‘警視庁’.
    ‘警 - 察 - 庁,’ she said, slowly and clearly.
    ‘警 - 視 - 庁’
    ‘Close enough,’ she said, catching Kanji’s eye and grinning.`,
                `Kanji Potter and the Bento of Fire`,
            ],
            [
                `Nearly all men can stand radicals, but if you want to test a man’s character, give him kanji.
    /
    And in the end, it’s not the years in your life that count. It’s the reviews in your queue.
    /
    Better to remain silent and and do your reviews than to speak on the forums and face 1000 reviews.`,
                `Abrakanji Lincoln`,
            ],
            [
                `I’ve got a bad 感じ about this.`,
                `Kan Solo, pilot of the Wanikani Falcon, smuggler, rogue, all-around Tofugu kind of guy`,
            ],
            [
                `For all wrong answers there are two remedies - reviews and the override script. `,
                `Alexandre Durtle, The Count of Monte Kanji`,
            ],
            [
                `All human wisdom is contained in these two words - Kanji and Radical`,
                `Alexandre Durtle, The Count of Monte Kanji`,
            ],
            [
                `Life is a review session, my young turtle. You will bask in the radicals one moment, be shattered on the kanji the next. What makes you a turtle is what you do when that review session comes. You must look into the pile of reviews and shout. Do your worst, for I will do mine! Then the Crabigator will know you as we know you`,
                `Alexandre Durtle, The Count of Monte Kanji`,
            ],
            [
                `Your words give voice to that which we all feel, Koichi. That is why you’ll be Enlightened. But the day when words are enough will be the day Guppies like us are no longer needed.`,
                `Galmar Stone-Fist and Ulfric, The Kanji Scrolls V: Skyrim `,
            ],
            [
                `Crabigator: What is best in Wanikani?
    Cronan: To crush your reviews, to see them driven before you, and to hear the lamentations of their radicals.`,
                `The Book of Cronan, shortly before Cronan is crushed beneath the weight of a thousand vocab`,
            ],
            [
                `Mnemonics are not required to be anatomically correct.`,
                `Hensharu Kennetsugi, A Guide to Trying to Remember Japanese Characters`,
            ],
            [
                `For want of a stroke the radical was lost.
    For want of a radical the kanji was lost.
    For want of a kanji the compound was lost.
    For want of a compound the sentence was lost.
    For want of a sentence the grammar was lost.
    For want of a grammar the language was lost.
    And all for the want of a kanji stroke.`,
                `unknown, ca. 13th century`,
            ],
            [
                `This kills the crab`,
                `Koichi’s prophecied last words, “Tales of Ragnarock and the End Times”, circa 3rd Century BC`,
            ],
            [
                `The most important days in life are the day they were born… and the day you fry them to crispy blackened charred shell.`,
                `Mark Twain in his book The Life of Turtles`,
            ],
            [
                `3. The antiquity of burning turtles

    A curiosity. This ancient mausoleum (tomb of Sultan Mustafa), was built by King (-) at the time of the construction of Aya Sofya, (-) years before the Prophet. So it is a thousand and (-) years old. While (recently) the master builder and miners, with chisels like that of Farhad, were carving a hole in the south wall to put a window, a fossilized turtle shell appeared between two bricks. All of them saw it, and they could still detect the writings of Kanji characters on it. This is evident proof that burning turtles is an ancient practice.`,
                `An Ottoman Traveller, Selections from the Book of Travels of Evliya Celebi`,
            ],
            [`Ask not what your kanji can do for you, but what you can do to learn more kanji.`, `John F. Wanikani-dy`],
            [
                `Reviews gather, and now my session begins. It shall not end until I die. I shall take no shortcut, use no script, leave no vocab. I shall wear no shell and win no glory. I shall live and die at Wanikani. I am the radical in 暗. I am the 見物人 of the forums. I am the fire that burns turtles, the joy that brings enlightenment, the persistence that wakes the masters, the reviewer that guards the realms of gurus. I pledge my life and honor to the WaniKani, for this night and all the nights to come.
    `,
                `George Radical Radical Martin`,
            ],
            [`You know nothing, Turtle  雪`, `George Radical Radical Martin`],
            [
                `Bran thought about it. ‘Can a turtle still learn if he fails a review?’
    ‘That is the only time a turtle can learn,’ his father told him.`,
                `George Radical Radical Martin, A Game of Kanji`,
            ],
            [`Fear cuts deeper than failed reviews.`, `George Radical Radical Martin, A Game of Kanji`],
            [`Kanji is coming.`, `George Radical Radical Martin, A Game of Kanji`],
            [
                `The man who learns the sentence should learn the word. If you would take a turtle’s life, you owe it to the turtle to look into its eyes and hear its final reading. And if you cannot do that, then perhaps the turtle does not yet deserve to burn.`,
                `George Radical Radical Martin, A Game of Kanji`,
            ],
            [
                `What do we say to the Lord of Death?’
    'Not today, I have reviews.`,
                `George Radical Radical Martin, A Game of Kanji`,
            ],
            [
                `Oh, my sweet little guppy," Old Nan said quietly, “what do you know of fear?
    Fear is for the later levels, my little turtle, when the lessons pile a hundred feet deep and the radicals come howling out of the SRS.  Fear is for the long session, when the fun hides its face for hours at a time, and little turtles are born and live and burn all at the same time, while the vocabulary grow gaunt and unlearned, and the levels stop moving.`,
                `George Radical Radical Martin, A Game of Kanji`,
            ],
            [`Different kanji sometimes lead to the same meaning.`, `George Radical Radical Martin, A Game of Kanji`],
            [
                `"You are your mother’s trueborn guppy of Japannister.”
    “Am I?” the turtle replied, sardonic. “Do tell my lord Crabigator. My mother burned birthing me, and he’s never been sure.”
    “I don’t even know who my mother was,” 雪 said.
    “Some woman, no doubt. Most of them are.” He favored 雪 with a rueful grin. "Remember this, turtle. All guppies may be turtles, yet not all turtles need be guppies."
    And with that he turned and sauntered back into the feast, whistling a tune.
    When he opened the door, the light from within threw his shadow clear across the yard, and for just a moment the guppy Japannister stood tall as a Turtle.`,
                `George Radical Radical Martin, A Game of Kanji`,
            ],
            [
                `Sect Arryn: As High As Enlightened
    Sect Baratheon: Ours is The Kanji
    Sect Bolton: Our Levels Are High
    Sect Forrester: Kanji From Radical
    Sect Fowler: Let Me Review
    Sect Greyjoy: We Do Not Pay
    Sect Hightower: We Light The Turtles
    Sect Hornwood: Righteous In Reviews
    Sect Jordayne: Let It Be Written In Kanji
    Sect Karstark: The Kanji of Winter
    Sect Japannister: Hear Me Learn! (A Japannister Always Finishes Their Session)
    Sect Martell: Unburned, Unreviewed, Unlearned
    Sect Mormont: Here We Level
    Sect Mallister: Above the Guppies
    Sect Merryweather: Behold Our Burned Turtles
    Sect Mooton: Wisdom And Scripts
    Sect Oakheart: Our Radicals Go Deep
    Sect Redfort: As Strong As Mnemonics
    Sect Royce: We Remember
    Sect Stark: Kanji is Coming
    Sect Stokeworth: Proud to Be Subscribed
    Sect Targaryen: Fire and Mnemonics
    Sect Tarly: First to Level
    Sect Tollet: When Reviews Pile Up
    Sect Trant: So Burn Our Turtles
    Sect Tully: Radicals, Kanji, Vocabulary
    Sect Tyrell: Leveling Up
    Sect Westerling: Turtle, not turtle
    Sect Yronwood: We Keep The Pace`,
                ``,
            ],
            [`Review kanji and prosper.`, `Spock of the USS Crabigator.`],
            [`I haven’t failed another review… I’ve simply found another answer that isn’t right!`, `Thomas Edi-san`],
            [`The first time a kanji tells you what it is, believe it.`, `Maya Angelou kinda`],
            [`Don’t let the jukugo grind you down.`, `Margret Atwood sorta`],
            [`I hate reviewing, I love having reviewed. `, `Dorothy Parker after a fashion`],
            [
                `The best time for planning a book is when you’re supposed to be doing your wanikani reviews.`,
                `Agatha Christie in the barest sense.`,
            ],
            [
                `Reviews that say that something was the wrong reading are always interesting to me, because as we know, there are known knowns; there are kanji we know we know. We also know there are known unknowns; that is to say we know there are some kanji we do not know. But there are also unknown unknowns – the ones we don’t know we don’t know. And if one looks throughout the history of wanikani and other review websites, it is the latter category that tend to be the difficult ones.`,
                `Udon Rumsfeld, 2002`,
            ],
            [
                `Koichi: Viet, our lives are in your hands and you have butterfingers?
    Viet Hoang: [laughs] I am totally unappreciated in my time. You can run this whole website from this room with minimal staff for up to 3 days. You think that kind of automation is easy? Or cheap? You know anybody who can migrate an entire forum and handle  2 million kanji reviews a day for what I bid for this job? Because if he can I’d like to see him try.
    …
    Koichi: I don’t blame people for their review mistakes. But I do ask that they pay for them.
    Viet: Thanks, Dad. `,
                `Japanic Park, 1993`,
            ],
            [
                `Only two things are infinite, the universe and human stupidity, and your review queue only makes me doubt the former.`,
                `Albert Einstein`,
            ],
            [
                `There is no vocabulary review so miserable that it cannot be made worse by the presence of an unlearned kanji.`,
                `Bren-kan Be-san`,
            ],
            [
                `General Koichi. Years ago you served The Crabigator in the Romaji Wars. Now he begs you to help him in his struggle against the Furigana. I regret that I am unable to convey The Crabigator’s request to you in person, but my ship has fallen under reviews, and I’m afraid my mission to bring you to The Forums has failed. I have placed information vital to the survival of the Turtles into the memory systems of this RTK2 unit. The Crabigator will know how to retrieve it. You must see this kanji safely delivered to him on The Forums. This is our most desperate hour. Help me, Koichi. You’re my only hope.`,
                `Princess Leia`,
            ],
            [`No amount of reviewing can ever prove me right; a single typo can prove me wrong.`, `Albert Einstein`],
            [
                `Koichi: Do not try and bend the kanji. That’s impossible. Instead… only try to realize the meaning.
    Neo: What meaning?
    Koichi: There is no kanji.
    Neo: There is no kanji?
    Koichi: Then you’ll see, that it is not the kanji that bends, it is only yourself.`,
                ``,
            ],
            [
                `:notes::notes::notes:
    Do you hear the people sing
    Singing the song of angry men
    It is the music of a turtle
    Who will not be burned again

    When the meaning you type in
    Echos the meaning of the kanji
    There is a level about to start when tomorrow comes

    Will you join in our crusade
    Who will be strong and stand with me?
    Beyond the Crabigator is there
    A world you long to see?

    Then join in the fight that will give you the right to be free!`,
                `Popular song during the Sect Name Revolution`,
            ],
            [
                `Turtle, turtle, burning bright
    In the reviews of the night,
    What immortal hand or eye
    Could name thy fearful on’yomi?

    In what distant deep or hell
    Burnt the fire of thine shell?
    At what names dare we aspire?
    What the hand dare seize the fire?

    And what kana and what part
    Could twist the meanings of thy heart?
    And when thy heart began to beat,
    What dread hand and what dread feet?

    What the meaning? what the pain?
    In what furnace was thy brain?
    What the reading? What dread grasp
    Dare its deadly terrors clasp?

    When Miss Chou threw down her nails,
    And crazy Sheen shook off his veils,
    Did He smile His work to see?
    Did He who made Hard Gay make thee?

    Turtle, turtle, burning bright
    In the reviews of the night,
    What immortal hand or eye
    Dare name thy fearful kun’yomi?`,
                `Tribute to the Great @crabigator `,
            ],
            [
                `Turtle: I get it.
    WaniKani: You don’t.

    Turtle: I think I get it.
    WaniKani: “Think”? You don’t.

    Turtle: I feel I get it?
    WaniKani: “Feel”? Mmm, close but no cigar.

    Turtle: I don’t get it.
    WaniKani: Excellent progress!`,
                ``,
            ],
            [
                `To review, or not to review, that is the question:
    Whether 'tis nobler in the mind to suffer
    The slings and arrows of an outrageous queue,
    Or to take Arms against a Sea of turtles,
    And by opposing end them: to die, to sleep`,
                `Biru Shakespeare`,
            ],
            [`You’re a wanikanian, Harry.`, `Hagrid to the Boy Who Reviewed.`],
            [
                `There was a boy called ウスタス クレンス スクルブ, and he almost deserved those endless reviews.`,
                `CS Koichi, Voyage of the Kanji Dreader`,
            ],
            [
                `For never was a story of more woe
    Than this of Joseph and his Toe.`,
                `W. Shakespeare, Jospeh’s Toe and Crabette`,
            ],
            [
                `Morpheus: Free your mind
    [Morpheus uses the Override Script]
    Neo: Whoa.

    [After 2000 review items]
    Neo: Am I done?
    Morpheus: Far from it.

    Morpheus: This is your last chance. After this, there is no turning back. You enter the kun’yomi reading - the story ends. You wake up in your bed and believe whatever you want to believe. You enter the un’yomi reading - you stay in the session and I show you how deep the reviews go.`,
                ``,
            ],
            [
                `Insanity is entering the on’yomi reading, over and over again, when the app is expecting kun’yomi results.`,
                `Anonymous Wanikanians everywhere`,
            ],
            [`復習するのに一番良かった時期は２０年前だった。 二番目に良い時期は今だ。`, `中国のことわざ`],
            [
                `Ian Malcolm 先生: No, hold on. This isn’t some species that was obliterated by deforestation, or the building of a dam. Turtles had their shot, and nature selected them for extinction.
    John Hammond: I simply don’t understand this Luddite attitude, especially from a scientist. I mean, how can we stand in the light of the crabigator, and not act?
    Malcolm 先生: What’s so great about reviews? It’s a violent, penetrative act that scars what it explores. What you call discovery, I call the rape of the natural world.`,
                `Japanic Park: Chronices, 1993`,
            ],
            [
                `I learn and I forget
    I review and I remember
    I burn and I understand`,
                `Confucius`,
            ],
            [
                `Our greatest glory is not in never getting an answer wrong,
    but in rising every time we fail a review`,
                `Confucius`,
            ],
            [`The golden user has failed more times than the guppy has tried`, `Confucius`],
            [`It does not matter how slowly you go, as long as you do not stop`, `Confucius`],
            [
                `Choose a mnemonic you love,
    and you will never have to fail a review in your life`,
                `Confucius`,
            ],
            [
                `The superior Turtle thinks always of reading;
    The common turtle thinks of meaning`,
                `Confucius`,
            ],
            [`Be the kanji you want to se in the world`, `Confucius`],
            [`![|640x424](upload://z4ODWSI3bBLl1zqvluhINwVvMKg.jpg)`, ``],
            [`the death of one turtle is a tragedy, the death of a million is a statistic.`, `Joe “the toe” Stalin`],
            [
                `Here is the test to find whether your mission on Wanikani is finished. If you’re not Level 60, it isn’t.`,
                `Richard Bach Sensei`,
            ],
            [
                `For now, I’m just going to hang out with these two smoking hotties and fly privately around the world. It might be lonely up here, but I sure like the view.`,
                `Charlie Sheen (after abducting your favorite child and marrying your older sister)`,
            ],
            [
                `Two things are infinite: the universe and the learning of Japanese language; and I’m not sure about the universe.`,
                `Albert Einstein`,
            ],
            [
                `You know you’re in love when you can’t fall asleep because WaniKani is finally better than your dreams.`,
                `Dr. Seuss`,
            ],
            [`Be the guppie that you wish to see in the world.`, `Mahatma Ghandi`],
            [`In three words I can sum up everything I’ve learned about Japanese: baka kawaii desu.`, `Robert Frost`],
            [
                `To put the world in order, we must first put the nation in order; to put the nation in order, we must first put the language in order; to put the language in order; we must first cultivate our kanji; we must first finish our reviews.`,
                `Confucius`,
            ],
            [
                `So it is said that if you know the meaning and know the reading, you will not be put at risk even in a hundred reviews.
    If you only know the meaning, but not the reading, you may win or may lose.
    If you know neither the meaning nor the reading, you will always endanger the session.`,
                `Sun Tsu, The Art of WaniKani`,
            ],
            [`Wheresoever you go, go with all your かんじ`, `Confucius `],
            [`Every kanji has beauty, but not every turtle sees it`, `Confucius `],
            [`The turtle who knows all the answers has not unlocked all levels`, `Confucius `],
            [`The turtle who passes Kentei L1 begins by learning simple radicals`, `Confucius `],
            [`A journey of a thousand kanji begins with just a single radical`, `Confucius `],
            [`She seemed nice`, `neighbors of Mrs. Chou following the raid `],
            [`SRS does not hurry, yet every turtle is burned.`, `Lao Tzu `],
            [
                `Turtle blood will drip from my veins in my quest. Defeat is not an option. The On’yomi is an absolute traitor and it must be banished. It will be living under a bridge, toothless and confused.

    I wish him nothing but pain in his silly travels especially if they wind up in my Square. Clearly I have defeated this earthworm with my Kanji- imagine what I would have done with my fire breathing 手

    It’s been a tsunami of reviews and I’ve been riding it on a mercury surfboard.`,
                `The Collected Wisdom of Charlie し `,
            ],
            [`I love sleep. My reviews has the tendency to fail when I’m awake, you know?`, `Ernest Hemingway `],
            [`One cannot think well, love well, sleep well, if one has not reviewed well`, `Virginia Woolf`],
            [
                `Perhaps the greatest faculty our minds possess is the ability to cope with reviews. Classic thinking teaches us of the four doors of the mind, which everyone moves through according to their need.

    First is the door of sleep. Sleep offers us a retreat from the kanji and all their reviews. Sleep marks passing time, giving us distance from the kanji that have been forgotten. When a person fails a session they will often fall unconscious. Similarly, someone who hears they have 120 new lessons will often swoon or faint. This is the mind’s way of protecting itself from reviews by stepping through the first door.

    Second is the door of forgetting. Some kanji are too hard to learn, or too hard to learn quickly. In addition, many memories are simply not good enough, and there is no learning to be done. The saying ‘time teaches all kanji’ is false. Time teaches most kanji. The rest are hidden behind this door.

    Third is the door of madness. There are times when the mind is dealt such a session it hides itself in insanity. While this may not seem beneficial, it is. There are times when reality is nothing but reviews, and to escape those reviews the mind must leave reality behind.

    Last is the door of death. The final resort. Nothing can make us review us after we are dead, or so we have been told.`,
                `Patrick Rothfuss, The Nanori of the Wind`,
            ],
            [`Are you ‘Koichi’`, `asked a companion to Doctor Koichi.`],
            [
                `“It’s reviewing still," said Eeyore gloomily.
    “So it is.”
    “And lessoning.”
    “Is it?”
    “Yes,” said Eeyore. “However,” he said, brightening up a little, "we haven’t had a weird mnemonic lately.”`,
                `A.A. Milne, The House at Kanji Corner`,
            ],
            [
                `Far over the Misty Mountains cold
    To dungeons deep and caverns old
    We must away, ere break of day
    To finish all these fucking reviews`,
                ``,
            ],
            [`BURN THEM ALL`, `the mad king Koichi`],
            [
                `@koichi sat on an egg by the sea. The egg jumped. “I must get something for my baby to review!” he said. So away he went.
    Inside the website, the egg jumped. It jumped and jumped and jumped until out came a baby turtle! He looked up at a big “人”. “What is this reading?” he said. He could not read it out loud. “I will go and find out” he said.
    He went up to the big character and typed in じん. “Are you my reading?” said the baby turtle. The 人 just looked and looked. It did not say a thing.
    The baby turtle typed in "にん”. “No” said the vocab, I am not your reading."
    The baby turtle squinted. Maybe it was actually a 入？ “Are you にゅう？” said the baby turtle. “Are you はい？Are you い？” But none of them were his reading.
    The baby turtle stopped to think. The にん and the じん were not his reading. にゅう and はい and い were not his reading.
    “I have a reading!” said the baby turtle. "I know I do. I will find it. I will. I WILL!"
    Just then the baby turtle saw Koichi. “I will type in what I always do when I guess!” said the baby turtle. “こう！” Koichi said, “SNORT!”
    ”Oh no!“said the baby turtle, “You are not the reading. You are a scary Snort!” Koichi lifted the turtle up, up, up. Then something happened. The correct reading popped into the baby’s head!
    “I know what you are” said the baby turtle. You are a ひと！You are not a にん, or a じん, or even a こう！” You are a ひと, and you are my reading!”`,
                `Are You My Reading? by P. D. 東男`,
            ],
            [
                `Crying cannot drive out reviews; only reviewing can do that. Hiding cannot drive out lessons; only lessoning can do that.
    `,
                `Martin Luther Kanji, Jr.`,
            ],
            [
                `Like many hybrids, I am completely sterile.`,
                `the Crabigator, the Crabigator’s really big book of pick-up lines.`,
            ],
            [
                `Did you know alligator blood kills herpes?`,
                `the Crabigator, the Crabigator’s really big book of pick-up lines, Vol II.`,
            ],
            [`Kanji was a mistake.`, `Hayao Miyazaki`],
            [`The creation of a single kanji comes from a huge number of fragments and chaos.`, `Hayao Miyazaki`],
            [
                `If you want a picture of the future, imagine a kanji stamping on a human face—for ever.`,
                `George Orwell, 1984`,
            ],
            [
                `I applied my heart to know kanji, and to know madness and folly. I perceived that this also was a chasing at the wind. For in much reviews, is much grief, and he that increaseth levels, increaseth sorrow.`,
                `Ecclesiastes 1:17-18`,
            ],
            [
                `It is a truth universally acknowledged, that a single Wanikanian in possession of an advanced level, must be in want of several hundred reviews.`,
                `Jane Austengator, Pride and Prejudice and Language Learning`,
            ],
            [
                `“Don’t panic.”

    “The answer to the ultimate question of life, the universe and Everything is 33. For life has found that Kanji’s beginning and end has thirty three strokes and the meaning of life is -rough-.”`,
                `The Crabigator’s Guide to the Galaxy`,
            ],
            [`When life gives you kanji, make Japanese.`, `Elbert Hubbard, ca 1915`],
            [
                `To write the kanji, to say the vocabulary, to contemplate the radicals: that is enough for one man’s life.`,
                `T.S. Eliot, The Use of Kanji and the Use of Criticism`,
            ],
            [`You want the kanji? You can’t handle the kanji!`, `Colonel Nathan R. (Radical) Jessep`],
            [
                `The turtle killer
    points the way
    with his turtle`,
                `Kobayashi Issa (first draft, before going with daikon picker)`,
            ],
            [`Rendaku you shall, or dock you I will.`, `Yoda, Master reviewer, “wisdom of the kanji”`],
            [
                `I fear not the man who has reviewed 10,000 Kanji once, but I fear the man who has reviewed one Kanji 10,000 times.`,
                ``,
            ],
            [`Japanese is dark and full of turtles, old man, but the fire burns them all away.`, `Melisandre`],
            [
                `If you had not totally cheated and looked at jisho.org during your reviews,
    God would not have sent a punishment like me upon you.`,
                `Genghis Khanji`,
            ],
            [
                `There was a young man named Koichi
    whose brain was so big it got itchy
    He then said, “Alright!
    Let’s make a website
    to help other people learn kanji”`,
                `Tune: Won’t you come to Limerick`,
            ],
            [
                `Give a guppy one radical, and he can read Japanese for a second, give him the Wanikani app, and he will study kanji for a lifetime.`,
                `Anonymous again`,
            ],
            [`I have no idea. People who boast about their kanji are losers.`, `Stephen Hawking`],
            [
                `Woland: Let me have a look at it.
    the Master: I can’t do that…I burned it in the stove.
    Woland: This cannot be…Kanji don’t burn.`,
                `Mikhail Bulgakov, early manuscript of “The Master and Margarita” (probably one of the ones he burned)`,
            ],
            [`Ahh Japan… land of the golden balls… Wait what?`, `Me upon learning testicles…`],
            [
                `In Kanadu did Koichi Khan
    A stately pleasure-dome decree
    Where Alph, the sacred reviewer, ran
    Through Kanji measureless to man
    Down to a sunless sea`,
                `Samuel Taylor Coleridge, A Vision in a Dream: A Radical`,
            ],
            [
                `If you gaze long into a kanji, the kanji also gazes into you.`,
                `Friedrich Nietzsche, on the kanji 目 as an ideographic symbol`,
            ],
            [
                `We should consider every day lost on which we have not reviewed at least once. And we should call every kanji false which was not accompanied by at least one radical.`,
                `Friedrich Nietzsche`,
            ],
            [
                `The only thing necessary for the triumph of evil Mrs. Chou is for good Koichi to do nothing.`,
                `Edmund Burke, British Parliamentarian and Kanji visionary ahead of his time.`,
            ],
            [`I just molted, so I’m totally mortal right now.`, `a drunken confession from the Crabigator`],
            [
                `The Cruciatus, Imperius, and Avoid Kanji Curses were first classified as Unforgivable in 1717, with the strictest penalties attached to their use.`,
                ` Professor Dumbledore’s Notes from The Tales of Beedle the Bard [3]`,
            ],
            [`「日本語を学んでいる事。 ああ、それは、何というやりきれない息もたえだえの大事業であろうか」`, `太宰治`],
            [`「幸福感というものは、漢字の川の底に沈んで、幽かに光っている砂金のようなものではなかろうか」`, `太宰治`],
            [
                `“What level are you?” “Seventeen,” he answered promptly. “And how long have you been seventeen?” His lips twitched as he stared at the road. “A while,” he admitted at last.”`,
                `Stephkanji Meyers`,
            ],
            [
                `"The ancient Oracle said that I was the wisest of all the Wanikanians. It is because I alone, of all the Wanikanians, know that I am but an ant in comparison to the great beast above.`,
                `Socks In Crates`,
            ],
            [
                `There is a theory which states that if ever anyone discovers exactly what the on’yomi is for and why it is here, it will instantly disappear and be replaced by something even more bizarre and inexplicable.
    There is another theory which states that this has already happened`,
                `douglas adams, ancient philosopher`,
            ],
            [`You review and learn. At any rate, you review`, `douglas adams, from ‘mostly painful’’`],
            [
                `Go forth, my young 学生 Study hard, burn well…`,
                `こいち on issuing a new student his turtle burning kit, and key to the 大学 of the Crabigator

    kit includes, Katakana chart, Hiragana chart and Several bottles of propane for the torch`,
            ],
            [
                `Sir Bedevere: “Tell me, what do you do with turtles?”
    (Crowd yells various things to the effect of "Burn them!")
    Sir Bedevere: “And what do you burn apart from turtles?”
    Villager: “More turtles!”`,
                `Monty Python and the Holy Crabigator`,
            ],
            [
                `All this for a flamethrower?

                ![|288x270](upload://lG2dokf1bzWmeOjTSKaK9BVA6tJ.jpg)`,
                `the Crabigator on background checks`,
            ],
            [
                `In the beginning the Crabigator created the kanji and the radical. Now Wanikani was vocabless and empty, darkness was over the surface of the forums, and the Spirit of the Crabigator was hovering over the website.`,
                ``,
            ],
            [`SRS means never having to say you’re done.`, `Crab Redford, Alligator McGraw, Kanji Story`],
            [
                `"What are we going to do today Brain?
    “Same thing we do every day Pinky… Remembering when to rendaku”`,
                `Pinky and the Brain, Learn Japanese, Adventure with the Crabigator series.`,
            ],
            [
                `Kanji and Vocab, Kanji and Vocab,
    One is a reading the other is Chinese.`,
                `Pinky and the Brain, Learn Japanese, Adventure with the Crabigator series.

    (This version did not do as well in the states.)`,
            ],
            [
                `Do not give your children the kanji you wish you’d had as a child. Teach your children the onyomi and kunyomi readings you wish you’d known as a child instead.`,
                `Kanonoymous`,
            ],
            [
                `Are you there Crabigator? It’s me, Margaret. I just told my mother I want a lifetime subscription. Please help me grow Crabigator. You know where.`,
                `Judy Blume, Are You There Crabigator? It’s Me, Margaret`,
            ],
            [
                `The kun’yomi is
    The reading we deserve. But…
    Not the one we need`,
                `Commisioner Jimu Gorudon`,
            ],
            [`I am not afraid of death, I am afraid of what comes after.`, `Guppy Allen`],
            [`Always remember: Life is for kanji.`, `Alligator Lincoln`],
            [
                `The turtle must know that they are a miracle, that since the beginning of the world there hasn’t been, and until the end of the world there will not be, another turtle like it.`,
                `Pablo Crab`,
            ],
            [`Motivation gets you to level 3 but habit gets you to level 60.`, `Jig Jiglar`],
            [`The act of subscribing is what separates the turtles from the guppies.`, `Brian Tracy`],
            [`I came, I saw, I rendaku’d`, `Julius Crabigator, Upon Conquering Kanji.`],
            [
                `我は汝… 汝は我…
    汝、ここに新たなる契りを得たり
    契りは即ち、囚われを破らんとする反逆の翼なり
    我、**鰐蟹**のペルソナの生誕に祝福の風を得たり
    自由へと至る、更なる力とならん…

    I am thou, Thou art I
    Thou hast acquired a new vow
    It shall become the wings of rebellion
    That breaketh thy chains of captivity
    With the birth of the Wanikani persona
    I have obtained the winds of blessing that
    Shall lead to freedom and new power`,
                `The Contract between Disciple and the Crabigator`,
            ],
            [
                `And on the pedestal, these words appear:
    My name is Crabigator, Wani of Kani;
    Look on my Reviews Page, ye Mighty, and despair!`,
                `Percy Blysse Shelley, Crabigator`,
            ],
            [
                `It’s a dangerous business, turtle, learning Japanese. You step onto the road, and if you don’t keep your feet, there’s no knowing where you might be swept off to.`,
                `J.R.R. Koichi, The Lord of the Kanji`,
            ],
            [
                `Worry not if you instantly understand the Japanese meaning of a word, but can’t remember the equivalent English word. It just means you suck at two languages. Scrub.`,
                `Arisdurtle c. 2017 BC`,
            ],
            [`Turtles cannot be separated from fire, or beauty from The Eternal.`, `Dante Alicrab`],
            [
                `Konnichiha!
    My name is Koichi
    And I would like to share with you
    the most amazing site

    It has so many great kanji
    You simply won’t believe how much
    It’ll make you hate your life

    Konnichiha!
    My name is Koichi
    And I would like to share with you
    This site of Allicrabs

    Crabigator
    It’s super fun
    And if you let us in
    We’ll show you how it can be done!

    "No thanks?"
    You’re sure?
    Oh well
    That’s fine
    goodbye
    HAVE FUN IN HELL`,
                `The only fragments ever recovered from The Site of Wanikani, c. 1830`,
            ],
            [
                `Kanji club? You know you can’t trust those little freaks!`,
                `半 Solo, shortly before being devoured by turtles`,
            ],
            [`Will this site teach me to speak Japanese?`, `Confessions of a Sect Guppy`],
            [
                `All the turtles you have burned until now, they are watching you from The Kanji Heaven and they are waiting to see you succeed… Do not disappoint us or their sacrifice would have been useless and shame will become your comrade for the rest of your life.`,
                `Turtle of Fire, chapter 10, verse 97-99`,
            ],
            [
                `It’s okay to override for rendaku right? I was pretty close on that meaning so it’s probably fine to override right? If I get it wrong next time I wont override.`,
                `Anonymous`,
            ],
            [
                `I hold kanji knowledge of so light a quality that it is but a review’s review.`,
                `On'yomi Shakespeare (1564 - 1616), Crablet, Act II, sc. 2`,
            ],
            [`Crabigator, I am your Rendaku…`, `Darth Kanji, on meeting the Crabigator… and burning his shell.`],
            [`When you review a session on WaniKani you win or you die.`, `George R.R. Martin`],
            [
                `Some people have the talent for the secrets of kanji, but not the will. Some people have the will to learn the secrets of kanji, but not the talent. The former are master skiers: swift down the slopes of the Levels, dodging from side to side as they conquer the slaloms called Reviews. The only ones they can call rivals are themselves. The latter are amateur mountain climbers, hikers, and marathon runners: it is harder for them to progress, but they have no shortage of opponents and guideposts. Eventually, the talented will tire of riding back to the top of the Levels, and the Reviews will become no more than an obligation. But the determined, the ‘untalented’, will continue to conquer one mountain of Reviews after another, blaze trails to new Levels, and slowly run through their Lessons. The do it not because they must, nor because they are made to, but simply, as one put it, ‘Because the Kanji are there!`,
                `Some guy named Alex, speaking up in defense of slow studiers.`,
            ],
            [`It’s the turtle that’s never started as takes longest to burn.`, `J.R.R. Koichi, The Lord of the Kanji`],
            [`There is nothing to rendaku except rendaku itself.`, `Anonykanji`],
            [
                `All we have to decide is what to do with the kanji that is given us.`,
                `J.R.R. Koichi, The Lord of the Kanji`,
            ],
            [`Kanji-Happy`, `Pocky commercial, Glico`],
            [
                `We’ve listened to your complaints on the forums and your 10,000 signature petition. The following offensive Japanese phonemes are now banned from Wanikani, effective immediately:
    -じゅう
    -げい
    -しつ
    We apologize for the indiscretion`,
                `Fragment from Prophecies of the Last Days of the Allicrab, author unknown, recovered from a Phoenician tablet c.500 BC`,
            ],
            [
                `Kanji is feeling
    On’yomi is Kun’yomi
    Fail is Winning`,
                `1984, George Orwell`,
            ],
            [
                `Just as On’yomi coexists with Kun’yomi, Turtles shall coexist with The Burn`,
                `Turtle of Fire, chapter 9, verse 33`,
            ],
            [
                `The true measure of a kanji is not how it looks but how it sounds.
    It’s not what they appear to be but what they mean by that appearance that proves their worth.`,
                `Jiraiya`,
            ],
            [
                `I am become death, destroyer of kanji. Look upon my reviews, ye mighty, and despair.`,
                `J. Robert Krabbenheimer`,
            ],
            [
                `Yea, though I walk through the valley of the shadow of death, I will fear no rendaku: for thou art with me; thy On’yomi and thy Kun’yomi they comfort me`,
                `The prophet Koichi Upon discovering the hell that is the Rendaku.`,
            ],
            [
                `I think that’s the single best piece of advice: constantly think about how you could be learning Japanese better and quizzing yourself.`,
                `Elon Musk`,
            ],
            [
                `If you wanna survive out here you’ve gotta know where your Kanji is.`,
                `WaniKani’s Guide to the Galaxy, Douglas Adams`,
            ],
            [`I’ve got a bad radical about this`, `Kan Solo, every Star Wars movie ever`],
            [`Study kanji, love kanji, stay close to kanji. It will never fail you.`, `Frank Lloyd Write`],
            [`In Koichi we trust`, `Official motto of the United States of America`],
            [`Kumirei for president (y’know, once Koichi’s done with it)`, `Me`],
            [
                `I am Koichi (How do you do sir?)
    They are Koichi (The man maintains a fortune)
    I am the Spamneko
    Goo goo g’joob, goo goo goo g’joob`,
                `The Beatles`,
            ],
            [
                `People say learning Japanese is harder than learning English, but I believe it can be learned through tough thorough thought, though.`,
                ``,
            ],
            [
                `Failure should be our teacher, not our undertaker. Failure is delay, not defeat. It is a temporary detour, not a dead end. Failure is something we can avoid only by not reviewing, doing no lessons, and quenching our torches.`,
                `Denis Waitley`,
            ],
            [`I will actually behave.`, `Some Watermelon`],
            [
                `Japanese might be hard, but at least it isn’t held together by the hopes and dreams of those learning it, like English is.`,
                `Someone from Twitter`,
            ],
            [
                `Japanese: the final frontier. These are the voyages of the scholarship Enterprise. Its five-year mission: to explore strange new words, to seek out new kanji and new grammar, to boldly rendaku where no one has rendaku’d before.`,
                `Star Trek`,
            ],
            [`I have not failed. I have just found 10,000 readings that don’t work.`, `Thomas Guppy Edison`],
            [
                `It behooves no one to dismiss any novel reading with the statement, 'It can’t be for that kanji.`,
                `William “Onyokunmi” Boeing`,
            ],
            [
                `And the CRABIGATOR spake, saying, “First shalt thou start your reviews, then shalt thou enter the reading for 三つ, no more, no less. 三つ shall be the number thou shalt answer, and the reading of the answer shall be みっつ. さんつ shalt thou not answer, neither answer thou みつつ, excepting that thou make the middle つ small. さん is right out. Once the answer みっつ, being the correct answer, be entered, then lobbest thou thy Holy Hand Grenade of Antioch-oichi towards thy turtle, who being naughty in My sight, shall snuff it.”`,
                `Book of Wanikaniments Chapter 2, verses 9-21`,
            ],
            [
                `I hope that in this year to come, you make mistakes. Because if you are making mistakes, then you are learning new things, trying new things, living, pushing yourself, changing yourself, changing your world. You’re doing things you’ve never done before, and more importantly, you’re learning Japanese.`,
                `Neil Gaijin`,
            ],
            [
                `Unus pro omnibus, omnes pro kanji`,
                `Proclaimed at a meeting in 1618 which resulted in the defenestrations of Prague`,
            ],
            [
                `When I first looked at the kanji, standing on the street, I cried.`,
                `Alan Shepard talking about his time on the Japanese surface during the Apollo 14 mission in February 1971.`,
            ],
            [
                `I am the Crabigator thy God, which have brought thee out of the land of kaigai, out of the house of gaijin.

    You shall have no other gods before Me.
    You shall not make new kanji.
    You shall not take the name of the Crabigator your God in vain.
    Remember the level up day, to keep it holy.
    Honor Koichi and Viet.
    You shall not unburn.
    You shall not commit mistakes.
    You shall not cheat.
    You shall not bear false witness against your reviews.
    You shall not covet other languages.`,
                `The Ten Commandments`,
            ],
            [`My name is Kanji, for we are many`, `New Testament, gospels of Mami and Kristen`],
            [`Now I am become desu, the amusement of weebs.`, `J. Robert Oppenheimer`],
            [`The noblest pleasure is the joy of understanding Japanese.`, `Reonardo da Vinci`],
            [`You can lead a horticulture, but you can’t make her think.`, `Dorothy Parkani.`],
            [
                `A radical at rest, will look for a kanji to be a part of. Thus the inertia of reviewing is preserved.`,
                `Sir Isaac NewKan, physics linguist`,
            ],
            [
                `Obama took a tour of the Great Wall of Kanji and said, 'We need one of these things around the White House.’`,
                `David Letterman`,
            ],
            [
                `I can no longer trust Google. I tried looking up lighters and all they had was 48,200,000 matches.`,
                `Sir (Hard) Gay Brin`,
            ],
            [`Only those who review greatly can ever learn greatly.`, `Radical F. Kennedy`],
            [`Fortune favours the reviewing mind`, `Pasteur, Louis`],
            [
                `I’m here because I was told to say hi in that chat.

    Where is the chat?`,
                `Confessions of a Sect Guppie`,
            ],
            [`There is always something left to review.`, ` Gabriel García Márquez, One Hundred Years of Wanikani`],
            [
                `I’m going to finish WaniKani in just over a year.
    Sir, the possibility of successfully completeting at the fastest speed is approximately three thousand seven hundred and twenty to one!"
    Never tell me the odds.`,
                `Hanzi Solo`,
            ],
            [
                `If life hands you melons…

    You might be dyslexic.`,
                `Kaniwani`,
            ],
            [
                `All the audio in this review had been programmed to have a cheerful and sunny disposition.`,
                `マーヴィン`,
            ],
            [
                `You watch this review session. It’s about to start again. I can tell by the intolerable air of smugness it suddenly generates.`,
                `マーヴィン`,
            ],
            [
                `OK! Don’t think. Nobody think. No ideas. No theories, no nothing.`,
                `Fōrudo Purufekuto, WaniKani’s Guide to the Reviews`,
            ],
            [
                `I like big burns and I can not lie
    You turtle burners can’t deny
    That when a girl walks in with an itty bitty radical
    And a marui thing in your face
    You get enlightened, wanna pull up tough
    Cause you notice that lesson was stuffed
    Deep in the kimono she’s wearing
    I’m hooked and I can’t stop reviewing
    Oh baby, I wanna sect wit’cha
    And take your screenshot
    My shogun tried to warn me
    But that vocab you got makes (me so apprentice!)
    Ooh, rump-o’-turtle shell
    You say you wanna get in my wall of shame?
    Well, guru me, guru me
    Cause you ain’t that average turtle
    I’ve seen them leveling up
    The hell with reviewing
    She’s baka, baka
    Got it going like a turbo Toyota
    I’m tired of mangas
    Sayin’ flat burns are the thing
    Take the average turtle and ask him that
    She gotta pack much baka
    So, turtles! (Yeah!) Turtles! (Yeah!)
    Has Mrs. Chou got the burn? (Hell yeah!)
    Tell 'em to resurrect it! (Resurrect it!) Resurrect it! (Resurrect it!)
    Resurrect that healthy burn!
    Baby got baka!`,
                `Sir-Koichi-A-Lot`,
            ],
            [
                `In my spare time I like to help blind kids.
    Corollary: Learn the difference between verbs and adjectives.`,
                `WK Grammar Police`,
            ],
            [`The root of all suffering is kanji.`, `Buddha`],
            [
                `Don’t ever, for any reason, do anything to anyone, for any reason, ever, no matter what. No matter … where. Or who, or who you are with, or where you are going, or … wherever you’ve been … ever. For any reason, whatsoever.`,
                `Michael Koichi Scott`,
            ],
            [`I anything can’t do right since… because… rendaku.`, `SpongeBob 四角いpants`],
            [`You do not truly understand someone until you’ve burned them`, `Abert Einstein`],
            [
                `Not many things say “this is someone else’s problem now” more than a leaf blower does.`,
                `Found embedded in the Reorder Script code`,
            ],
            [`Success is stumbling through reviews with no loss of enthusiasm.`, `Winningston Churchill`],
            [
                `Instead of brushing your teeth for two minutes, twice daily; just brush your teeth for 120 minutes, once a month (but only 112-116 minutes in February).`,
                `SRS: It’s not just for Wanikani!`,
            ],
            [
                `"Forgive me Father for I have sinned"
    vs
    "I’m sorry daddy; I’ve been very naughty"`,
                `“Kanji Denotation vs Kanji Connotation”, page 42`,
            ],
            [`A WaniKani is for life, not just for christmas`, ``],
            [`Life’s a meatball`, `Natsuki Shakespeare`],
            [`Life is balloons`, `Natsuki Shakespeare`],
            [`これはペンです。`, `Borx`],
            [`All generalizations are false.`, `How to read kanji in 6 easy steps`],
            [
                `Japan has been flown by, orbited, smacked into, radar examined, and rocketed onto, as well as bounced upon, rolled over, shoveled, drilled into, baked and even blasted. Still to come: Japan being understood.`,
                `Buzz Aldrin, in his book Mission to Japan: My Vision for Kanji Exploration (2013).`,
            ],
            [
                `You’ve reached the maximum number of likes today. Please wait 14 minutes before trying again.`,
                `The Uncaring Monster that is Discourse`,
            ],
            [
                `Since I joined WK, my knowledge of cereal ingredients has decreased dramatically.`,
                `“Confessions of a Kanji Addict”, page 3`,
            ],
            [
                `Me: Where do you want to eat?
    Her: Anywhere is fine.`,
                `Koichi: Wherever he picked was not fine.`,
            ],
            [`Fool me once, shame on me. Fool me twice, shame on kanji.`, ``],
            [
                `Just because something is a radical and a kanji doesn’t mean it can’t be real.`,
                `Death aka Bill Door, ‘Kanji Man’ by Terry Radicalchett`,
            ],
            [`Sappari Wakaranai`, `Manabu Yukawa, Galileo`],
            [`When does it teach Grammar`, `Sect Guppy`],
            [`To be, or not to be, which is the meaning?`, `Hamlet, Act III, Review I, by William Shakespeare`],
            [
                `Second Law of Wanikanymics: the change in the number of readings for the kanji is always greater than zero.`,
                `William Thomson, Lord Kelvin Kun’yomi`,
            ],
            [`That’s what`, `she`],
            [`I’m definitely ready to take on all of my reviews`, ``],
            [
                `Failure is so important. We speak about high accuracy all the time but it is the ability to resist failure or use failure that often leads to greater retention. I’ve met people who don’t want to review for fear of failing.`,
                `J.K. Reviewing`,
            ],
            [
                `There are two kinds of failures: those who did lessons and never did reviews, and those who did reviews and never did lessons`,
                `Laurence J. Crabigator`,
            ],
            [`The less wrong reviews, the faster and more accurate your review sessions will be.`, `Bruce Leebo`],
            [`He who crams has little. He who uses SRS has much.`, `Lao Tzurtle`],
            [`What is necessary to change a turtle is to violently change his temperature.`, `Abraham Maslow`],
            [
                `There was always more in the world than guppies could learn, reviewed they ever so slowly; they will learn it no better for going fast. The really precious things are kanji and vocab, not radicals. It does a bullet no good to go fast; and a turtle, if he truly be a turtle, no harm to go slow; for his glory is not at all in reviewing, but in learning.`,
                `John Rushingkin`,
            ],
            [
                `What if you slept? And what if, in your sleep, you dreamed?
    And what if, in your dream, you went to heaven
    and there learned a strange and beautiful kanji?
    And what if, when you awoke, you had that kanji in your review queue?
    Ah, what then?`,
                `Samuel Turtle Coleridge`,
            ],
            [
                `If the Crabigator were to come today, people would not even burn him. They would ask him to dinner, and hear what he has to say, and call him a weeaboo.`,
                `Thomas Crablyle`,
            ],
            [
                `If someone were to prove to me that boobgrave is outside the official 214 kangxi radicals, then I would prefer to remain with boobgrave than with the official 214 kangxi radicals.`,
                `Fyodor Dostoevietsky`,
            ],
            [`An ounce of practice is equal to a ton of mnemonics`, `Kanji Junor`],
            [
                `I’m not in this forum to live up to your expectations and you’re not in this forum to live up to mine.`,
                `Bruce Leebo`,
            ],
            [
                `There are only two mistakes one can make on the path to level 60: not going all the way, and not starting.`,
                `Buddha`,
            ],
            [`I can’t believe that The Crabigator put us on this earth to be pleasants.`, `Lou Holtz`],
            [`Don’t settle for a relationship that won’t let you learn kanji`, `Oprah Winfrey`],
            [
                `N1 can be reached if you care more than others think is wise, risk more than others think is safe, dream more than others think is practical, expect more than others think is possible.`,
                `A Crabigator Apprentice`,
            ],
            [`The day you decide to do review is your lucky day`, `Japanese Proverb`],
            [
                `Wheather you think you guessed the kanji right, or think you didn’t guess the kanji right - you’re right`,
                `Waniry Kard`,
            ],
            [`Living at risk is starting WaniKani and memorising your kana between reviews`, `Hikari Bradbury`],
            [
                `:left_speech_bubble: I’m not trying to be sexy. It’s just my way of expressing myself when I do reviews.

    :left_speech_bubble: Kanji, if you like it, if you feel it, you can’t help but move to it.

    :left_speech_bubble: When I was a boy, I always saw myself as a hero in Wanikani.

    :left_speech_bubble: Wanikani community to me is exciting because of all the electricity that is generated in the crowd and on stage. It’s my favorite part of the business, the community.

    :left_speech_bubble: Man, I really like Wanikani.`,
                `Elvis Presley


    `,
            ],
            [`If you’re going through Hell, keep going.`, ``],
            [`Knowing the answer is no better than not knowing the answer, unless that’s what you put down`, `SRS`],
            [`Believe in the Crabigator, and all your fears shall be cast aside`, `Buddha, circa 420 BCE`],
            [
                `Anyone who sits on top of the largest turtle fueled system in the world, knowing they’re going to light the bottom, and doesn’t get a little worried, does not fully understand WaniKani.`,
                `John Young, after being asked if he was nervous about making the first Space Turtle flight in 1981.`,
            ],
            [
                `And as I stared into the void, it stared back. A new world that was no more than rediscovered by my eyes. A new route engendered in what was otherwise thought to be a one way path. Familiar yet unfamiliar to my untouched mind.`,
                `Barack Obama after his first encounter with anal sex.`,
            ],
            [`Soccer…`, `Timothy Gregory Matt after his parents told him his name.`],
            [
                `It’s not about how much reviewing you do between Christmas and New Years, its about how much reviewing you do between New Years and Christmas`,
                `M’aik the Liar`,
            ],
            [
                `There is no review session so miserable that it cannot be made worse by the presence of leech kanji.`,
                `BrenKan BeWan, Irish poet kanjeate`,
            ],
            [`Not reviewing is the only sure way to fail.`, `Guru Showalter`],
            [
                `“Do you hate turtles?”

    “I don’t hate them…I just feel better when they’re not around.”`,
                `Charlie Sheen Bukowski`,
            ],
            [
                `When you review you learn that there will be times when you succeed and there will be times when you fail, and both are equally important.`,
                `Ellen DeGuru`,
            ],
            [
                `There is only one thing that makes level 60 impossible to achieve: the fear of your reviews.`,
                `Paulo Coelho`,
            ],
            [`There are no short cuts to to clearing your queue.`, `Beverly Sills`],
            [`If you are feeling stressed, you can always reset to a lower level.`, `Paul McCartney`],
            [
                `For some nights I slept profoundly; but still every morning I felt the same lassitude during my reviews, and a languor weighed upon me all day. I felt myself a changed person. A strange melancholy was stealing over me, a melancholy that I would not have interrupted. Dim thoughts of deleting wanikani began to open, and an idea that I was slowly being drained alive by leeches took gentle, and, somehow, not unwelcome possession of me. If it was sad, the tone of mind which this induced was also sweet. Whatever it might be, my little weeaboo soul acquiesced in it.`,
                ` J. Sheridan Le Fanu, from Kanjimilla`,
            ],
            [
                `Once Upon a time, in a land, far, far away, there was a little crab. There was also an alligator. They were alone, and they were not loved. The tale to be told here gentlefriend, is that love can be found even when one is in a dark place, love can come from an unexpected source. Not long after the Crabigator came into existence, a testament to their love. It was beautiful`,
                `The Brothers Grimm, from The Brothers Grimm’s Fairy tale collection; extended edition.`,
            ],
            [`As the phoenix must burn to emerge, the turtle must burn to be understood.`, `Janet Fitch`],
            [
                `Aruba: Always learning.
    Austria: It is Austria’s destiny to rule the kanji.
    Azerbaijan: The land of rendaku.`,
                `Official Mottos`,
            ],
            [
                `Azores: Rather die as free turtles than be enslaved with SRS
                Belize: Under the Crabigator I flourish
                Bermuda: Whither the lessons carry us`,
                `Official Mottos`,
            ],
            [
                `Bolivia: Reviewing is strength
                Brazil: Reorder and progress
                British Virgin Islands: Be watchful for leeches`,
                `Official Mottos`,
            ],
            [`Canada: from kanji to shining kanji`, `Official Mottos`],
            [
                `Brittany: Rather death than not reviewing
    Brunei: Always in service with Koichi’s guidance
    Bulgaria: Strength and strength make strength`,
                `Official Mottos`,
            ],
            [
                `Cambodia: Nation Religion King Koichi
    Cape Verde: Lessons, reviews, progress
    Cayman Islands: He hath founded it upon the durtles`,
                `Official Mottos`,
            ],
            [
                `Chile: Through reason or override
    China: Serve the durtles
    Cuba: Kanji or death`,
                `Official Mottos`,
            ],
            [
                `Czech Republic: Truth prevails
    Denmark: Koichi’s help, the love of the turtles, Denmark’s SRS
    Dominica: After Crabigator, the Turtles`,
                `Official Mottos`,
            ],
            [
                `East Timor: Honour, homeland, and durtles
    Easter Island: May Koichi let the clarity of this vital study plan be extended to all turtles
    England: SRS and my fight`,
                `Official Mottos`,
            ],
            [
                `Ethiopia: Ethiopia holds up her hands unto the Crabigator
    Ethiopian Empire: Conquering Turtle of the Sect of Durthova’s Witness
    European Union: United in procrastination`,
                `Official Mottos`,
            ],
            [
                `Falkland Islands: Desire the kanji
    Fiji: Fear Viet and honor Koichi
    Florentine Republic: Fall, you kingdoms of RTK, for the cities of SRS shall thrive!`,
                `Official Mottos`,
            ],
            [
                `French Polynesia: Great Tahiti of the Golden Burn
    Galicia: What do the durtles say?
    Kingdom of Galicia: Here is the mystery of mnemonics that we strongly profess`,
                `Official Mottos`,
            ],
            [
                `East Germany: Turtles of the world, unite!
    German Empire: Crabigator with us
    Nazi Germany: One People, One Realm, One Leader, One SRS`,
                `Official Mottos`,
            ],
            [
                `Gibraltar: Conquered by no kanji
    Greece: SRS or Death
    Kingdom of Greece: The love of the turtles is my strength`,
                `Official Mottos`,
            ],
            [
                `Grenada: Ever Conscious of Koichi We Aspire, and Advance as Turtlekind
    Guyana: One Turtlekind, One Wanikani, One Crabigator
    Kingdom of Hawaii: The life of the kanji is perpetuated in students`,
                `Official Mottos`,
            ],
            [
                `Hungary: With the help of Koichi for kanji and vocab
    India: Truth alone triumphs(unless you have override)
    Iraq: Koichi is the greatest`,
                `Official Mottos`,
            ],
            [
                `Isle of Man: Whithersoever you go, Japanese is hard
    Kingdom of Italy: We are held together by sect and by title
    Italian Social Republic: For the honor of Japanese`,
                `Official Mottos`,
            ],
            [
                `Japan: Endless discovery
    Ancient Japan:
    Spread the spirit of nurturing turtles
    Accumulate kanji and stack vocab
    Draw three lines and make it roof
    Empire of Japan:
    Open nation and do reviews
    Establishing of Great Wanikanian new order`,
                `Official Mottos`,
            ],
            [
                `焼き芋を食べた後のおならは、他のおならよりも長い間空気中を漂う気がするよ。

    Farts after eating roasted sweet potatoes seem to hang in the air longer than normal farts.`,
                `WK`,
            ],
            [`What is a kanji? A miserable little pile of radicals`, `Dracula, Kanjivania, Symphony of the Reviews`],
            [
                `Jamaica: Out of many radicals, one kanji
    Kenya: All burn together
    North Korea: Powerful and prosperous learning
    South Korea: Benefit broadly the forums`,
                `Official Mottos`,
            ],
            [
                `Latvia: Honor to serve for Wanikani
    Liberia: The love for Japanese has brought us here
    Lower Saxony: Always a good mnemonic`,
                `Official Mottos`,
            ],
            [
                `Luxembourg: We wish to remain lowercase turtles
    Madeira: Of the islands, the most beautiful and wkationed
    Marshall Islands: Accomplishment through fiery effort`,
                `Official Mottos`,
            ],
            [
                `Mauritius: Mnemonic and key of the Indian Ocean
    Moldova: Your Language is a Treasure
    Morocco: If you study God, He will study you`,
                `Official Mottos`,
            ],
            [
                `Nepal: Simple hiragana is better than romaji
    Netherlands: I will maintain the 100 apprentice count
    Newfoundland: Seek ye first the kingdom of Wanikani`,
                `Official Mottos`,
            ],
            [
                `New Zealand: Onward
    North Borneo: I review and I achieve
    Nuevo León: Always progressing.`,
                `Official Mottos`,
            ],
            [
                `Mmm, all that fatty meat. Think about fatty meat on your own body. If you have a lot of fatty meat, then you need a way to support said fatty meat. To do that, you would use a bra.`,
                `WaniKani mnemonic`,
            ],
            [
                `“the mad Koichi: “Why is a turtle like a writing-desk?”
    “Have you guessed the riddle yet?” the mad man said, turning to Alice again.
    “No, I give up,” Alice replied: “What’s the answer?”
    “they both burn,” said the mad Koichi”`,
                `Lewis Carroll, Alice in Wanikaniland`,
            ],
            [
                `出産後、妻の胎盤を食べてみました。
    I ate my wife’s placenta after she gave birth.`,
                `WK`,
            ],
            [
                `The following anecdote is told of William James. […] After a lecture on cosmology and the structure of the solar system, James was accosted by a little old lady.

    “Your theory that the sun is the centre of the solar system, and the earth is a ball which rotates around it has a very convincing ring to it, Mr. James, but it’s wrong. I’ve got a better theory,” said the little old lady.

    “And what is that, madam?” inquired James politely.

    “That we live on a crust of earth which is on the back of a giant turtle.”

    Not wishing to demolish this absurd little theory by bringing to bear the masses of scientific evidence he had at his command, James decided to gently dissuade his opponent by making her see some of the inadequacies of her position.

    “If your theory is correct, madam,” he asked, “what does this turtle stand on?”

    “You’re a very clever man, Mr. James, and that’s a very good question,” replied the little old lady, “but I have an answer to it. And it’s this: The first turtle stands on the back of a second, far larger, turtle, who stands directly under him.”

    “But what does this second turtle stand on?” persisted James patiently.

    To this, the little old lady crowed triumphantly,

    “It’s no use, Mr. James — it’s turtles all the way down.”`,
                `J. R. Ross, Constraints on Variables in Syntax 1967[10]`,
            ],
            [
                `1. The big durtle in the sky begat kanji and saw that is was good.
    2. It bestowed them onto humans and said
    3. “Learn those, as they hold the truth”
    4. “And do your reviews, instead of lurking on the forum.”`,
                ``,
            ],
            [`What is a Facebook? A miserable little pile of secrets!`, `Dracula, 1931`],
            [
                `Cake is the best. Many scholars have thought the same over the last 400 years. However. some scholars have argued the opposite, much to the chagrin of the mainstream scholars. They argue that “Cake is irrelevant” and “Who needs cake”. Such blatantly falsified words require close examination. In the argument that follows, such arguments will be examined and the explanation for the necessity and in fact the worklessness of cake shall be heretofore explored. Many shholars have argued “Cake is not food” or “Cake is bad for your health” or even “Cake is bad for you”. Such scholars miss an essential factor of cake. Ceke is, at its very heart, fun and happiness and piles of bones. Anyone who lives and has no time for cake is in fact, a recluse and a lonesome person and a person whose life has no meaning. Therein lies the answer to the age old question “Is Cake worth it?”
    The obvious, and yet easily deniable answer is that cake is a dangerous fiend. Opponents argue “Cake leads to diabetes” further “Cake leads to obesity” and yet again “Cake is death”. But the truth is far from these feathered lies. Cake can be found in the traditions of societies going all the way back to the Incas. Cake was there at the founding and served as the backbone of thousands of cultures from the dawn of time. Cake provides happiness in times of dark forbodding. When all has lost hope, Cake still remains. And so, without further adieu, the council motions for the protection of Cake as a special species who may not be maligned nor mistreated til the end of days. Work shall not be imposed on the Cake lest sadness be imposed on us all. And lest we forget the origins of mother Cake, and thus our own origins, Such chant shall become inherent in our daily meal and in our daily practice: “We thank theee cake, in thee partake, thy organs do we gorge. In happiness, in perfect bliss, all swell with smorgasbord " In such a manner shall the legacy of cake be protected”`,
                ``,
            ],
            [`There are no mistakes, only happy little rendakus.`, `Bob Ross`],
            [`He who lives in harmony with ice cream lives in harmony with the Universe`, `Marcus Aurelius.`],
            [
                `A student asked the Crabigator, “Does a kanji have Buddha nature or not?” The Crabigator said, “こう”.`,
                ` The Radical-less Radical`,
            ],
            [
                `Mrs. Chou always said life was like a box of reviews. You never know what you’re gonna get.`,
                `Koichi Gump`,
            ],
            [`No, I am a radical.`, `Darth Shinnosuke in Kanji Wars: Episode IV - Return of the Wani`],
            [`The only reason for time is so that all reviews don’t happen at the same time.`, `Albert Einstein`],
            [
                `Start by doing what’s necessary;
    then do what’s possible;
    and suddenly you are doing the impossible;
    Japanese.`,
                `Francis of Assisi`,
            ],
            [`By failing to review, you are reviewing to fail.`, `Benjamin Franklin`],
            [
                `Stop worrying on what you’re not reviewing
    and start focusing on what you are.`,
                `Gary Vaynerchule`,
            ],
            [
                `Just because you are happy
    it does not mean that the day is perfect
    but that you have looked beyond your pending reviews.`,
                `Bob Marley`,
            ],
            [`Joy in reading and comprehending is nature’s most beautiful gift.`, `Albert Einstein`],
            [
                `The story so far:
    In the beginning the Kanji was created.
    This has made a lot of people very angry and been widely regarded as a bad move.`,
                `Douglas Adams`,
            ],
            [
                `Our Crabigator who art in durtle heaven,
    hallowed be Thy kanji
    Thy radicals come
    Thy vocabs be burned
    on level 1 as it is on level 42+
    Give us this day our daily apprentice items
    and forgive us our vacation mode,
    as we forgive those who have lots of leeches;
    and lead us not into Reorder Script
    but deliver us from Ignore Answer Script
    For thine is the Pleasant and the Painful and the Death and the Hell and the Paradise and the Reality and the Teenage Mutant Ninja Turtles III
    for ever,
    Amen`,
                ``,
            ],
            [
                `Straight outta Portland
    crazy kanjilover named Koichi
    from the gang called Nikkeis Wit Attitudes
    When I’m called off, I got my kanji-off
    squeeze the trigger and durtles are hauled off`,
                ``,
            ],
            [
                `A WK users asks a durtle to carry it across a river. The durtle hesitates, afraid of being burned by the user, but the user argues that if they did that, they would both drown. The durtle considers this argument sensible and agrees to transport the user. The user climbs onto the durtle’s back and the durtle begins to swim, but midway across the river, the user burns the durtle, dooming them both. The dying durtle asks the user why it burned, to which the user replies “I couldn’t help it. It’s in my nature.”`,
                ``,
            ],
            [`To err is durtle; to forgive, crabigator.`, ``],
            [`Alexander Pope`, ``],
            [`Learning Japanese: the path from cocky ignorance to miserable uncertainty.`, `Mark Twain`],
            [`Cow, or noon? That is the question.`, `Hamlet Act 3 Scene 1`],
            [`:bird:`, `Alfred Hitchcock, 1963`],
            [`Life is like a box of POLLs. You never know what you’re gonna get.`, `Forrest Gump`],
            [
                `“Verily I say unto thee, as the Crab mergeth with the Gator, and the Kumiko Oumae with the Reina Kousaka, so shall the Crabigator and the Kumirei.”`,
                `Koichi 42:42`,
            ],
            [
                `Litany against Override

    I must not override.
    Override is the mind-killer.
    Override is the little-death that brings total obliteration.
    I will face my reviews.
    I will permit them to pass over me and through me.
    And when the reviews have gone past I will turn the inner eye to see their path.
    Where the reviews have gone there will be nothing. Only kanji will remain.`,
                `Frank Kanjert`,
            ],
            [
                `So, Koichi went and made this puzzle for us, a dungeon if you will. It was all fun and games, until we got to B2. That one took us a few days.
                Gosh. We thought that was bad. We didn't know what lied ahead. B3 took us a fucking month. So much time wasted when the answer was right there all along. Fucking eGoooott, can you believe it.
                Anyway, so Koichi ended up being burned alive and redurtled by the durtlic church, and soon after we started getting these weird emails by some stalker. Needless to say we solved that one pretty quicky. Now B5 is something else`,
                `Rambles of a durthlic priest`,
            ],
            [`eGoooott`, `B5`],
        ],
    }
})()
