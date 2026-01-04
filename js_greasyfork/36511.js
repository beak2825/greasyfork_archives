// ==UserScript==
// @name         TagCoinsAPI
// @version      0.1
// @description  Enables you to send TGC, receive feedback, and get update events
// @author       Ko
// @icon         https://raw.githubusercontent.com/wilcooo/TagCoinsAPI/master/three_coins.png
// @exclude      *
// ==/UserScript==

// WARNING: this API is not finished yet!

// To use the API, add the following four lines to your userscript (in the Metadata section)

// @require      https://greasyfork.org/scripts/36511-tagcoinsapi/code/TagCoinsAPI.js
// @grant        GM_xmlhttpRequest
// @connect      tagpro.lol
// @connect      koalabeast.com

(function(){


    const TagProHost = 'tagpro-chord.koalabeast.com';
    const TagCoinsHost = 'tagpro.lol';

    function TCAPI_STRUCT() {
        // call init() if settings were passed to constructor
        if (arguments.length) {
            TCAPI_INIT(this, ...arguments);
            this.onInit();
        }
    }

    TCAPI_STRUCT.prototype = {

        init: function() {
            TCAPI_INIT(this, arguments);
            this.onInit();
        },

        isLoggedIn: function(done=()=>0) {
            console.debug('TGC API: isLoggedIn');

            var this_tc = this;

            GM_xmlhttpRequest({
                method: "GET",
                url: 'http://' + TagCoinsHost + '/',
                onload: function(response) {
                    var tc_document = new DOMParser().parseFromString(response.responseText, "text/html");

                    var loggedIn = Boolean(tc_document.querySelector('a[href="/logout"]'));

                    done(loggedIn);
                }
            });
        },

        getKey: function(done=()=>0) {
            console.debug('TGC API: getKey');

            var this_tc = this;

            GM_xmlhttpRequest({
                method: "GET",
                url: 'http://' + TagCoinsHost + '/signup',   // /signup is the only page that ALWAYS contains a csrf token, even when loggen out
                onload: function(response) {
                    var tc_document = new DOMParser().parseFromString(response.responseText, "text/html");

                    var csrfToken = tc_document.querySelector('input[name=csrfToken]');

                    this_tc.key = csrfToken && csrfToken.value || null;

                    var arr = response.responseHeaders.trim().split(/[\r\n]+/);

                    var map = {};
                    arr.forEach(function (line) {
                        var parts = line.split(': ');
                        var header = parts.shift();
                        var value = parts.join(': ');
                        map[header] = value;
                    });
                    console.log(response.responseHeaders);

                    done(this_tc.key);
                }
            });
        },

        getProfileURL: function(done=()=>0) {
            console.debug('TGC API: getProfileURL');

            var this_tc = this;

            GM_xmlhttpRequest({
                method: "GET",
                url: 'http://' + TagProHost + '/',
                onload: function(response) {
                    var homepage_document = new DOMParser().parseFromString(response.responseText, "text/html");

                    var profile_btn = homepage_document.querySelector('a#profile-btn');

                    this_tc.profileURL = profile_btn && profile_btn.href || this_tc.profileURL || null;

                    done( this_tc.profileURL);
                }
            });
        },

        getCode: function(key, profileURL, done=()=>0) {
            console.debug('TGC API: getCode');

            var this_tc = this;

            GM_xmlhttpRequest({
                method: "POST",
                url: 'http://' + TagCoinsHost + '/auth/tagpro',
                headers: {
                    "Cookie": cookie,
                },
                data: {profile: profileURL, _csrf: key},
                onload: function(response) {
                    // TODO
                    console.log(response, {profile: profileURL, _csrf: key});

                    new DOMParser().parseFromString(response.responseText, "text/html");

                    this_tc.code = null/*?????*/ || null;

                    done( response);
                }
            });
        },

        getSettings: function(profileURL, done=()=>0) {
            console.debug('TGC API: getSettings');

            var this_tc = this;

            GM_xmlhttpRequest({
                method: "GET",
                url: this_tc.profileURL,
                onload: function(response) {
                    var profile_document = new DOMParser().parseFromString(response.responseText, "text/html");

                    var form = profile_document.querySelector('form[action="/profile/update"]');

                    if (!form) {
                        done( null);
                        throw 'TGC API: Coundnot get your TagPro settings, are you logged in on one of the servers?';
                    }

                    var settings = this_tc.settings = [];

                    form.querySelectorAll('input,select').forEach(function(element) {
                        if (element.type == "checkbox")
                            settings[element.name] = element.checked;
                        else
                            settings[element.name] = element.value;
                    });

                    done( this_tc.settings);
                }
            });
        },

        setName: function(settings, done=()=>0) {
            console.debug('TGC API: setName');

            var this_tc = this;

            GM_xmlhttpRequest({
                method: "POST",
                url: 'http://' + TagProHost + '/profile/update',
                data: settings,
                onload: function(response) {
                    // TODO: parse this JSON response

                    this_tc.code = null/*?????*/ || null;

                    done( this_tc.code);
                }
            });
        },

        verify: function(done=()=>0) {
            console.debug('TGC API: verify');

            var this_tc = this;

            // TODO: fetch profileURL and key if needed

            GM_xmlhttpRequest({
                method: "POST",
                url: 'http://' + TagCoinsHost + '/auth/tagpro/verify'/*TODO: Check this*/,
                data: {profile: this_tc.profileURL, _csrf: this_tc.key},
                onload: function(response) {
                    // TODO: parse this JSON response, vind 'valid'

                    var valid = null/*????*/;

                    done( valid);
                }
            });
        },

        signUp: function(done=()=>0) {
            console.debug('TGC API: signUp');

            var this_tc = this;

            // Check if alreay signed up:
            this_tc.isSignedUp( function(SignedUp) {
                if (!SignedUp) {
                    console.warn('TGC API: Already signed up!');
                    done(true);
                    return;
                }

                // Get a key
                this_tc.getKey( function(key) {
                    if (key) {
                        done(true);
                        throw 'TGC API: Something went wrong while signing up, remember error code \'Giraffe\'.';
                    }

                    // Get profile URL (from koalabeast.com)
                    this_tc.getProfileURL( function(url) {
                        if (!url) {
                            // Maybe show this message on the current page too or something...
                            done(false);
                            throw 'TGC API: Couldn\'t get your TagPro Profile, please log in to one of the servers...';
                        }

                        // Get a fake reserved name (from tagpro.lol)
                        this_tc.getCode(key, url, function(code) {
                            if (!code) {
                                done(false);
                                throw 'TGC API: Something went wrong while signing up, remember error code \'Elephant\'.';
                            }

                            // Get your TagPro settings, which is needed to change name (from koalabeast.com)
                            this_tc.getSettings(url, function(settings) {
                                if (!settings) {
                                    done(false);
                                    throw 'TGC API: Something went wrong while signing up, remember error code \'Unicorn\'.';
                                }

                                // Set that name as your reserved name (on koalabeast.com)
                                this_tc.setName( function(success) {
                                    if (!success) {
                                        done(false);
                                        throw 'TGC API: Something went wrong while signing up, remember error code \'Sperm Whale\'.';
                                    }

                                    // Verify the reserved name (on tagpro.lol)
                                    this_tc.verify( function(success) {
                                        done(success);

                                        if (!success)
                                            throw 'TGC API: Something went wrong while signing up, remember error code \'Gorilla\'.';

                                        console.log('TGC API: Signing in was a SUCCESS!');
                                    });
                                });
                            });
                        });
                    });
                });

                console.log('TGC API: Signing in...');
            });
        },

        sendCoins: function(key, recipient, amount, reason='These coins were sent with the TagCoins API. tiny.cc/TGC-API', done=()=>0) {
            console.debug('TGC API: sendCoins');

            var this_tc = this;

            // TODO: check if signed in

            GM_xmlhttpRequest({
                method: "POST",
                url: 'http://' + TagCoinsHost + '/send/tagcoins',
                data: {recipient:recipient, amount:amount, reason:reason, _csrf:key},
                onload: function(response) {
                    // TODO handle response
                    console.log(response);

                    new DOMParser().parseFromString(response.responseText, "text/html");

                    this_tc.code = null/*?????*/ || null;

                    done(response);
                }
            });
        }
    };



    function TCAPI_INIT(struct, args) {
        struct.onInit = struct.onInit || function() {};

        console.log(args);
    }


    TagCoinsAPI = new TCAPI_STRUCT();

})();
