// ==UserScript==
// @name                Resolve YouTube Network Error
// @namespace           UserScript
// @version             1.0.1
// @license             MIT
// @author              CY Fung
// @match               https://www.youtube.com/*
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page
// @run-at              document-start
// @description         To Fix issues like https://www.reddit.com/r/youtube/comments/14n9nql/
// @downloadURL https://update.greasyfork.org/scripts/469948/Resolve%20YouTube%20Network%20Error.user.js
// @updateURL https://update.greasyfork.org/scripts/469948/Resolve%20YouTube%20Network%20Error.meta.js
// ==/UserScript==

const RT = (this || window).Request
window.Request = (() => {

    class Request extends RT {

        constructor(...args) {
            if (args.length === 2) {
                const [url, conf] = args;
                if (url.startsWith('/youtubei/v1/next?key=') && conf && conf.headers) {

                    /*
                    conf.headers = {

                        "headers": {
                            "Content-Type": "application/json", // content type of the body data in POST request
                            "Accept-Encoding": "gzip, deflate, br", // YouTube Response - br
                            "Accept": "application/json",
                        },

                    };
                    */

                    // conf.headers = Object.assign({}, conf.headers, {
                    //     "X-Youtube-Bootstrap-Logged-In": false,
                    //     //  "Authorization": "",
                    //     // "X-Goog-AuthUser": "",
                    //     // "X-Origin": "",
                    //     // "X-Goog-PageId": "",
                    //     //     'X-Goog-PageId':''
                    // });
                    // //   delete conf.headers['X-Goog-PageId'];
                    // delete conf.headers['Authorization'];
                    // //   delete conf.headers['X-Goog-AuthUser'];
                    // //    delete conf.headers['X-Origin'];


                    const newHeaders = {}
                    const keep = ["X-Youtube-Client-Name", "X-Youtube-Client-Version", "X-Goog-Visitor-Id"];

                    for (var k in conf.headers) {
                        if (keep.indexOf(k)>=0) newHeaders[k] = conf.headers[k];
                    }


                    Object.assign(newHeaders, {

                        "Content-Type": "application/json", // content type of the body data in POST request
                        "Accept-Encoding": "gzip, deflate, br", // YouTube Response - br
                        "Accept": "application/json",
                        "X-Youtube-Bootstrap-Logged-In": false,

                    });

                    conf.headers = newHeaders;




                }

            }
            super(...args)

        }

    }

    return Request

})();

/*
*

    Authorization
    :
    "SAPISIDHASH xxxxxxxxxxxxxxxxxxxxx"
    Content-Type
    :
    "application/json"
    X-Goog-AuthUser
    :
    "0"
    X-Goog-PageId
    :
    "xxxxxxxxxxxxxxxxxxxxx"
    X-Goog-Visitor-Id
    :
    "xxxxxxxxxxxxxxxxxxxxx%3D%3D"
    X-Origin
    :
    "https://www.youtube.com"
    X-Youtube-Bootstrap-Logged-In
    :
    true
    X-Youtube-Client-Name
    :
    1
    X-Youtube-Client-Version
    :
    "2.20230629.06.00"

*/
