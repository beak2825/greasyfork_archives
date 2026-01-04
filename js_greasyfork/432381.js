// ==UserScript==
// @name         Recaptcha Skipper (Google Sorry)
// @namespace    c4ca4238a0b923820dcc509a6f75849b
// @version      0.4.0
// @description  Try to skip google recaptcha error page automatically through reloading the page. If not, redirect to configurable url
// @author       _SUDO
// @include      *://www.google.*/sorry/*
// @grant        GM_addStyle
// @compatible      chrome Chrome + Tampermonkey or Violentmonkey
// @compatible      firefox Firefox + Greasemonkey or Tampermonkey or Violentmonkey
// @compatible      opera Opera + Tampermonkey or Violentmonkey
// @compatible      edge Edge + Tampermonkey or Violentmonkey
// @compatible      safari Safari + Tampermonkey or Violentmonkey
// @downloadURL https://update.greasyfork.org/scripts/432381/Recaptcha%20Skipper%20%28Google%20Sorry%29.user.js
// @updateURL https://update.greasyfork.org/scripts/432381/Recaptcha%20Skipper%20%28Google%20Sorry%29.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function (){
    'use strict';
    const config = {
        redirect_to: true, // Will redirect the actual searched query to the defined url (from ?q=[terms])
        promp_redirect: true, // Create UI to cancel redirection
    }
    const searchEngines = [
        // The list of top buttons
        // Note: the `default` sets the search engine to use for the automatic redirection.
        { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: 'https://duckduckgo.com/favicon.ico', default: true },
        { name: 'Bing', url: 'https://bing.com/?q=', icon: 'https://www.bing.com/favicon.ico' },
        { name: 'Brave', url: 'https://search.brave.com/search?q=', icon: 'https://www.brave.com/favicon.ico' },
        { name: 'SearX', url: 'https://metasearx.com/?q=', icon: 'https://metasearx.com/favicon.ico' },
        { name: 'Yandex', url: 'https://yandex.com/search/?text=', icon: 'https://yandex.com/favicon.ico' },
        { name: 'Startpage', url: 'https://www.startpage.com/sp/search?q=', icon: 'https://www.startpage.com/favicon.ico' },
        { name: 'Ecosia', url: 'https://www.ecosia.org/search?q=', icon: 'https://www.ecosia.org/favicon.ico' },
        { name: 'Yahoo', url: 'https://search.yahoo.com/search;?p=', icon: 'https://www.yahoo.com/favicon.ico' },
    ];

    class SkipCaptcha {
        constructor() {
            this.url = false
            this.tries = 1
        }

        // Create a 3sec counter to allow the user to cancel automatic redirection
        create_Redirect_UI () {
            if (!config.promp_redirect) return this; // Will automatically allow

            let redirect_allowed = true // By default it's automatically allowed redirect

            // styles
            GM_addStyle(`
            .search-buttons {
            gap: 5px;
            display: flex;
            flex-wrap: wrap;
            padding-bottom: 10px;
        }
        .search-buttons a {
            display: flex;
            width: 40px;
            height: 40px;
            background: white;
            align-items: center;
            border-radius: 5px;
            border: 1px solid gray;
            justify-content: center;
            transition: background 0.3s, transform 0.2s;
        }
        .search-buttons a:hover {
            background: lightgray;
            transform: scale(1.1);
        }
        .search-buttons img {
            width: 24px;
            height: 24px;
        }
        #userUI {
            display: grid;
            border-radius: 5px;
            border: 1px solid gray;
            grid-template-columns: 0.3fr 1.6fr;
        }
        #redirect {
            display: flex;
            padding: 10px;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            border-right: 1px solid gray;
        }
        #redirect span {
            color: black;
            font-size: 24px;
            transition: transform 0.3s ease;
        }
        #redirect:hover span {
            transform: scaleX(-1);
        }
        #UIcounter[value] {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            border: none; /* Get rid of default border in Firefox. */

            width: 100%;
            height: 20px;
        }

        #UIcounter[value]::-moz-progress-bar {
            background-color: #09c;
            /* the stripe layer */
            background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.16) 25%,
            rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.16) 50%,
            rgba(255, 255, 255, 0.16) 75%, rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 0)),
            linear-gradient(to right, #09c, #f44);

            /* we also need background-size, because the stripe must repeat every 20 pixels */
            background-size: 60px 50px, 100%;
        }`)

            const UIfragmentElement = `
             <div style="position: fixed; bottom: 5px; right: 5px; z-index: 999999; padding: 10px;">
        <div class="search-buttons"></div>
        <div id="userUI">
            <a id="redirect" title="Skip Countdown"><span>►</span></a>
            <div style="cursor: pointer; padding: 10px;" role="button" title="Pause Countdown">
                <p>You will be automatically redirected...</p>
                <progress id="UIcounter" max="${100}" value="0"></progress>
            </div>
        </div>
    </div>`
            const range = document.createRange()
            const fragment = range.createContextualFragment(UIfragmentElement) //Creates a DOM object

            const searchEnginesContainer = fragment.querySelector('.search-buttons');
            let query = this.get_query()
            searchEngines.forEach(engine => {
                const button = document.createElement('a');
                button.href = engine.url + query;
                button.setAttribute('title', engine.name);

                const img = document.createElement('img');
                img.src = engine.icon;
                img.alt = `${engine.name} logo`;

                button.appendChild(img);
                searchEnginesContainer.appendChild(button);
            });

            document.body.append(fragment)

            const UI = document.getElementById('userUI')
            const UI_skipBTN = document.getElementById('redirect')
            const UI_Counter = document.getElementById('UIcounter')
            let counter = 0

            const processBar = setInterval(() => {
                if (counter >= 100) {
                    remove_event()
                    clearInterval(processBar)
                }
                counter = counter >= 100 ? 100 : counter+5
                UI_Counter.value = counter
            }, 135)

            // This event will allows us to just force skip
            const event_skip = UI_skipBTN.addEventListener('click', () => {
                clearInterval(processBar)

                this.handle_redirects()
            }, {once: true})

            const event = UI.addEventListener('click', () => {
                if (counter != 100) {
                    redirect_allowed = false
                    clearInterval(processBar)
                }
            }, {once: true})

            const remove_event = () => {
                UI.removeEventListener('click', event, true)
            }

            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(redirect_allowed)
                }, 3000)
            })
        }

        checkAttemps () {
            // Will check if there's a value of previous retries on the sesion storage, if not create one
            const storage = sessionStorage
            const storage_name = 'Captch_Retries'

            // Check if it's already a value
            if (storage.getItem(storage_name)) {
                this.tries = storage.getItem(storage_name)
                if (!typeof this.tries === 'number') {
                    this.tries = parseInt(this.tries)
                }
                this.tries++
                storage.setItem(storage_name, this.tries)
            }
            else {
                storage.setItem(storage_name, this.tries)
            }
            return this
        }

        async redirectURL_to_Google () {
            // Forced await
            const response = await this.create_Redirect_UI()
            if (!response) return;

            this.handle_redirects()
            return this
        }

        handle_redirects () {
            if (!this.url) return this

            if (this.tries < 3) window.location = this.url
            else {
                if (config.redirect_to) this.redirect_to_user_defined_url()
            }

            return this
        }

        get_query () {
            // this.url is the <title> string and we have to convert to an URL to use URLSearchParams constructor
            const gen_URL_to_search = new URL(this.url)
            const getSearchedParams = new URLSearchParams(gen_URL_to_search.search).get('q') // Only get the Query searched

            return getSearchedParams
        }

        redirect_to_user_defined_url () {
            const defaultEngine = searchEngines.find(engine => engine.default) || searchEngines[0];

            // this.url is the <title> string and we have to convert to an URL to use URLSearchParams constructor
            const getSearchedParams = this.get_query()
            const newURL = defaultEngine.url + getSearchedParams

            // Send to the new url formated
            window.location = newURL

            // If works properly, a return isn't necesary
            // return this
        }

        getURL () {
            // The search url/terms are in the page url and body,
            // because I'am lazy I will get it from the title element
            const url = document.getElementsByTagName('title')[0].textContent
            if (url.lenght != 0) this.url = url

            return this
        }

        init () {
            this.getURL().checkAttemps().redirectURL_to_Google()
        }
    }

    const init = new SkipCaptcha().init()

    if (document.readyState === 'complete') {
        init
    } else {
        document.addEventListener('readystatechange', function () {
            if (document.readyState === 'complete') {
                init
            }
        })
    }
})()
