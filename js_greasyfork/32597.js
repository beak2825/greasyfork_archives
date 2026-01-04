// ==UserScript==
// @name        GitHubReleasesCount
// @description To show download counter for each attachment from Releases page on GitHub.com
// @namespace   net.r_eg.GitHubReleasesCount
// @version     0.4
// @grant       none
// @include     https://github.com/*/*/releases*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @author      https://github.com/3F
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/32597/GitHubReleasesCount.user.js
// @updateURL https://update.greasyfork.org/scripts/32597/GitHubReleasesCount.meta.js
// ==/UserScript==

/* 
 Here's sandbox as the main page of this script at this time:
 - https://github.com/3F/sandbox/tree/master/javascript/_user_scripts/GitHubReleasesCount
 
 Tested via: 
    - Firefox 61.0.2 + Greasemonkey 4.6
    - Firefox 59.0.2 + Greasemonkey 4.3
    - Firefox 55.0.3 & 54.0.1 + Greasemonkey 3.11
    
 Changes:
     * 0.4: Fixed the work with modern GitHub Releases ~ Aug 2018
     * 0.3: Fixed the work with modern GitHub Releases ~(Jan 2018 - Apr 2018)
     * 0.2: individual tags & multi-pages support (+async).
     * 0.1: first idea.
*/
(function()
{
    'use strict';

    class GhrCounter extends function(){ this.constructor.prototype.$ =
    {
        /** assets from the releases page */
        pageFiles: ".release-header + :first-of-type li a",

        /** 'user/project' from url */
        usrprj: /^\/([^/]+)\/([^/]+)/g,

        apiserver: 'api.github.com',

        out: {
            class: 'Label Label--outline Label--outline-green text-gray',
            style: 'margin-right: 3px;',
        },

        debug: false,

        /* --------------- */ }}{ /* --------------- */

        showCount(elem, count)
        {
            let _= this;
            if(_.isNull(elem) || _.isNull(count)) {
                throw new GhrcNullException('elem', 'count'); 
            }

            elem.prepend("<span class='" + _.$.out.class + "' style='" + _.$.out.style 
                            + "'>" + count + "</span>");
        }

        process()
        {
            let _= this;
            _.dbg('started for: ' + location.pathname);

            let url = _.getInfoAPI();
            _.dbg('get info: ' + url);

            $.get(url, function(apidata)
            {
                $(_.$.pageFiles).each(function()
                {
                    let root = $(this);
                    let durl = root.attr('href');

                    if(durl.indexOf('releases/download') == -1) {
                        return true; // means 'continue' statement
                    }

                    for(let idx in apidata)
                    for(let asset in apidata[idx].assets)
                    {
                        let lnk = apidata[idx].assets[asset];

                        if(!lnk.browser_download_url.endsWith(durl)) {
                            continue;
                        };
                        
                        _.dbg('insert data for #' + lnk.id + ': ' + durl);
                        _.showCount(root, lnk.download_count);
                    }
                });
            });
        }

        constructor(debug)
        {
            super();

            this.$.debug = debug;
            this.process();
        }

        getInfoAPI()
        {
            let l = this.$.usrprj.exec(location.pathname);
            return location.protocol 
                    + '//' + this.$.apiserver + '/repos/' + l[1] + '/' + l[2] + '/releases';
        }

        dbg(msg, ...args)
        {
            if(!this.$.debug) {
                return;
            }

            let stamp = new Date().toISOString().substr(11, 12) + '] ';
            if(this.isNull(args) || args.length < 1) {
                console.log(stamp + msg);
            }
            else {
                console.log(stamp + msg, args);
            }
        }

        isNull(val)
        {
            return val == null || val === undefined;
        }
    };

    class GhrcException
    {
        constructor(message, arg)
        {
            this.message    = message;
            this.arg        = arg;
        }
    }

    class GhrcNullException extends GhrcException
    {
        constructor(...args)
        {
            super("'" + args + "' cannot be null.", null);
        }
    }


    // ...

    let ghrс = new GhrCounter(false);

    // when async loading
    $(window).bind('pjax:success', function() { ghrс.process(); });

})();