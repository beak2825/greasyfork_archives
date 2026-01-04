// ==UserScript==
// @name        MS Teams changes
// @description change Teams emoji to old (skype) version
// @author      ptixed
// @match       https://teams.microsoft.com/v2/*
// @match       https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks*
// @version     0.0.5
// @namespace   https://greasyfork.org/users/843175
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/528343/MS%20Teams%20changes.user.js
// @updateURL https://update.greasyfork.org/scripts/528343/MS%20Teams%20changes.meta.js
// ==/UserScript==

/// skip 'Veryfying link...' screen for trusted domains
if (window.location.href.startsWith('https://statics.teams.cdn.office.net/evergreen-assets/safelinks/1/atp-safelinks.html')) {
    let url = new URL(new URL(window.location).searchParams.get("url"));
    let trusted = ['.adrentech.com', '.mediacomcorp.com', '.mediacomcable.com'];
    if (trusted.find(x => url.hostname.endsWith(x)))
        window.location = url;
}

// switch to skype emojis
if (window.location.host == 'teams.microsoft.com') {

    function intercept(push) {
        return function() {
            if (arguments[0] && arguments[0][1])
                arguments[0][1] = new Proxy(arguments[0][1], {
                    get: function (target, prop, receiver) {
                        let webpack = Reflect.get(...arguments);
                        if (typeof webpack != 'function')
                            return webpack;
                        return function () {
                            let result = webpack(...arguments);
                            if (arguments[1] && arguments[1].default && arguments[1].default.configs && arguments[1].default.configs.messaging)
                                try {
                                    // arguments[1].default.configs.messaging.safelinksBypassList[0].value.push('*.adrentech.com'); // does not work for some
                                    arguments[1].default.configs.messaging.pesEmoticonCdnAssetsUrl[0].value = arguments[1].default.configs.messaging.pesEmoticonCdnAssetsUrl[0].value.replace('/v2', '/v1');
                                    arguments[1].default.configs.messaging.emoticonCdnAssetsUrl[0].value = arguments[1].default.configs.messaging.emoticonCdnAssetsUrl[0].value.replace('/v2', '/v1');
                                } catch {}
                            return result;
                        };
                    }
                });
            return push(...arguments);
        }
    }

    let a = [];
    a.push = intercept(a.push.bind(a));

    unsafeWindow.webpackChunk_msteams_react_web_client = new Proxy(a, {
        set: function(target, prop, value, receiver) {
            if (prop != 'push')
                return Reflect.set(...arguments);
            return target[prop] = intercept(value);
        }
    });
}