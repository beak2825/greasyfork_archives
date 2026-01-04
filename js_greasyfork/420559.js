// ==UserScript==
// @name            queer wisdom for Twitter
// @namespace       stephfuchs.queer.wisdowm.for.twitter
// @version         1.1.0
// @author          Stephanie Fuchs
// @description     The "Queer wisdom for Twitter" script adds a button with a queer flag for the LGBTQIA+ community. By clicking the flag the script will add a random wisdom. There is a list of quotes provided by a JSON file. So the script automatically gets quote-updates. Updates concerning the script are just as features or bugfixing.
// @homepage        https://github.com/stephfuchs/queer-wisdom-for-twitter-userscript
// @include         https://twitter.com/home
// @include         https://twitter.com/intent/*
// @include         https://twitter.com/compose/*
// @run-at          document-body
// @supportURL      https://github.com/stephfuchs/queer-wisdom-for-twitter-userscript/issues
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/420559/queer%20wisdom%20for%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/420559/queer%20wisdom%20for%20Twitter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Start the plugin stuff to tweet queer stuff.
     */
    class Plugin {

        /**
         * Run the stuff when document body is loaded
         */
        start() {
            var twitterIsReady = setInterval(function () {
                let version = '1.1.0';
                let name = 'Queer wisdom for Twitter';
                let copyright = '(c) 2021 • Stephanie Fuchs • https://github.com/stephfuchs';
                let classes = '.css-1dbjc4n.r-1awozwy.r-18u37iz.r-156q2ks';

                if (document.querySelector(classes) !== null || document.querySelector(classes) !== undefined) {
                    let wisdom = new QueerWisdom();
                    console.info('loaded script: "' + name + '" with version: ' + version + '\n' + copyright);
                    clearInterval(twitterIsReady);
                    console.debug(wisdom.debug + 'removed interval');
                    wisdom.init();
                    console.debug(wisdom.debug + 'created new wisdom object');
                }
            }, 3000); // check every 3sec

            /**
             * Check the system every min whether the button is been missing.
             */
            setInterval(function () {
                if (document.getElementById('queer_wisdom') === null) {
                    console.debug('Button was deleted. Restarts.');
                    let wisdom = new QueerWisdom();
                    wisdom.init();
                    console.info('reloaded the queer button, because it disappeared.');
                    console.debug('Restart finished.');
                }
            }, 60000); // check every minute
        }
    }

    var plugin = new Plugin();
    plugin.start();

    /**
     * Make the queer wisdom great again.
     */
    class QueerWisdom {

        /**
         * Provide some variables for the the extra button.
         */
        constructor() {
            this.debug = '## Queer wisdom for Twitter debugger ##\n';
            this.info = '## Queer wisdom for Twitter information ##\n';
            this.queerElement = null;
            this.queerElementId = 'queer_wisdom';
            this.lesbianJesus = new HayleyKiyoko();
        }

        /**
         * Initialization of the script.
         */
        init() {
            let tweetOptionContainerElement = document.querySelector('.css-1dbjc4n.r-1awozwy.r-18u37iz.r-156q2ks');
            console.debug(this.debug + 'Initialization of the script starts.');
            console.debug(this.debug + tweetOptionContainerElement);

            this._createQueerElement();
            tweetOptionContainerElement.append(this.queerElement);
            console.debug(this.debug + 'Added lgbtqia+ flag.');
            console.debug(this.debug + tweetOptionContainerElement);
            console.debug(this.debug + 'Initialization of the script ended.');
        }

        /**
         * Creates a new div container with the queer flag.
         *
         * @returns {HTMLDivElement}
         * @private
         */
        _createQueerElement() {
            this.queerElement = document.createElement('a');
            this.queerElement.id = this.queerElementId;
            this.queerElement.style.paddingLeft = '10px';
            this.queerElement.title = 'add a random queer wisdom';
            this.queerElement.innerHTML = this._getFlagSVG();
            this.queerElement.setAttribute('href', 'https://twitter.com/intent/tweet?text=' + encodeURI(this._getJsonWisdom()));
            console.debug(this.debug + 'Created tweet: https://twitter.com/intent/tweet?text=' + encodeURI(this._getJsonWisdom()));
        }

        /**
         * Get the wisdom from the JSON.
         *
         * @returns {string}
         * @private
         */
        _getJsonWisdom() {
            console.info(this.info + 'We have to call Hayley Kiyoko for help.');
            let girlsLikeGirls = this.lesbianJesus.girlsLikeGirls().wisdoms;
            let wisdomCount = girlsLikeGirls.length;
            console.info(this.info + 'The answer from Hayley Kiyoko has arrived with ' + wisdomCount + ' wisdoms.');

            let random = Math.floor(Math.random() * wisdomCount);
            let hayleyWisdom = girlsLikeGirls[random];
            console.debug(this.debug + 'random number: ' + random);
            console.debug(this.debug + 'random wisdom: ' + hayleyWisdom.quote);

            if (hayleyWisdom.copyright === null) {
                return hayleyWisdom.quote;
            }

            return hayleyWisdom.quote + '\n-- ' + hayleyWisdom.copyright;
        }

        /**
         * Get the LGBTQIA+ flag.
         * Credits for the svg: https://commons.wikimedia.org/wiki/File:LGBTQ%2B_rainbow_flag_Quasar_%22Progress%22_variant.svg
         *
         * @returns {string}
         * @private
         */
        _getFlagSVG() {
            return '<svg style="width: 27px; height: auto;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6000 3810">\n' +
                '\t<rect fill="#750787" width="6000" height="3810"/>\n' +
                '\t<rect fill="#004dff" width="6000" height="3175"/>\n' +
                '\t<rect fill="#008026" width="6000" height="2540"/>\n' +
                '\t<rect fill="#ffed00" width="6000" height="1905"/>\n' +
                '\t<rect fill="#ff8c00" width="6000" height="1270"/>\n' +
                '\t<rect fill="#e40303" width="6000" height="635"/>\n' +
                '\n' +
                '    <polygon points="-1,960 950,1905 -1,2850" fill="#ffffff"/>\n' +
                '    <polygon points="-1,960 -1,480 1420,1905 -1,3330 -1,2850 950,1905" fill="#ffafc8"/>\n' +
                '    <polygon points="-1,480 -1,0 1912,1905 -1,3810 -1,3330 1420,1905 -1,480" fill="#74d7ee"/>\n' +
                '    <polygon points="-1,0 1912,1905 -1,3810 480,3810 2384,1905 480,0" fill="#613915"/>\n' +
                '    <polygon points="480,0 960,0 2864,1905 960,3810 480,3810 2384 1905 480,0" fill="#000000"/>\n' +
                '</svg>';
        }
    }

    /**
     * The class for the lesbian jesus to give us the queer wisdom.
     */
    class HayleyKiyoko {

        /**
         * It's obvious.
         *
         * @returns {JSON}
         */
        girlsLikeGirls() {
            return {
                "wisdoms": [
                    {
                        "quote": "I am here, I am queer.",
                        "copyright": null
                    },
                    {
                        "quote": "It's LGBTQIA\+\nL\=lesbian\nG\=gay\nB\=bi\nT\=trans\nQ\=queer\nI\=intersex\nA\=ace\/aro\n\+\=ally",
                        "copyright": null
                    },
                    {
                        "quote": "There is no man in a wlw relationship. That is the point.",
                        "copyright": null
                    },
                    {
                        "quote": "Did I hit my head and wake up in patriarchal bullshit land?",
                        "copyright": "Nicole Haught \('Wynonna Earp'\)"
                    },
                    {
                        "quote": "Others: \"How do you know, you are queer?\" - Me: \"How do you know you are not?\" ",
                        "copyright": null
                    },
                    {
                        "quote": "When someone tells you they are < insert label >, accept it. They know best, who they are.",
                        "copyright": null
                    },
                    {
                        "quote": "\"Really, I don't know why I did this. I guess it's probably because I've got a big lesbian crush on you! Suck on that! AY-YI-YI-YI-YI-YI!\"",
                        "copyright": "Janis \('Mean Girls'\)"
                    },
                    {
                        "quote": "Hetero people when they see women kissing: \"Oh, they must be good friends\" - Queer women: \"Me n who???\"",
                        "copyright": null
                    },
                    {
                        "quote": "There is no wrong or right about beeing queer. You are who you are and this should be always right.",
                        "copyright": null
                    },
                    {
                        "quote": "\"You are a lesbian, not a unicorn, right?\"",
                        "copyright": "Waverly Earp \('Wynonna Earp'\)"
                    },
                    {
                        "quote": "My religion is called Hayley Kiyoko and she is the lesbian jesus.",
                        "copyright": null
                    },
                    {
                        "quote": "This is Damian. He's almost too gay to function.",
                        "copyright": "Janis \('Mean Girls'\)"
                    },
                    {
                        "quote": "I'm beautiful in my way\n" +
                            "'Cause God makes no mistakes\n" +
                            "I'm on the right track, baby\n" +
                            "I was born this way",
                        "copyright": "'Born this way' by Lady Gaga"
                    },
                    {
                        "quote": "Oh there ain't no other way\n" +
                            "Baby I was born this way",
                        "copyright": "'Born this way' by Lady Gaga"
                    },
                    {
                        "quote": "No matter gay, straight, or bi,\n" +
                            "Lesbian, transgendered life,\n" +
                            "I'm on the right track baby,\n" +
                            "I was born to survive",
                        "copyright": "'Born this way' by Lady Gaga"
                    },
                    {
                        "quote": "No matter black, white or beige\n" +
                            "Chola or orient made,\n" +
                            "I'm on the right track baby,\n" +
                            "I was born to be brave.",
                        "copyright": "'Born this way' by Lady Gaga"
                    }
                ]
            };
        }
    }
})();
