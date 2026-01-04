// ==UserScript==
// @name         Instagram Following
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Try to get following data from creators
// @author       Ken Kwok
// @match        *://www.instagram.com/*/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461864/Instagram%20Following.user.js
// @updateURL https://update.greasyfork.org/scripts/461864/Instagram%20Following.meta.js
// ==/UserScript==
var myJq = $.noConflict();
let accessor = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText'),
    followings;
const readyState = new Proxy({ followingRequest: '', headerVals: {}}, {
    set (target, prop, val) {
        switch(prop)
        {
            case 'followingRequest':
                if(val && target[prop] != val.toString())
                {
                    followings = [];
                    target[prop] = val.toString();
                    getFollowing();
                }
                break;
            case 'headerVals':
                if(Object.keys(target[prop]).length <= 0)
                {
                    followings = [];
                    target[prop] = val;
                    getFollowing();
                }
                break;
        }
    }
});
// Reasign the existing setRequestHeader function to
// something else on the XMLHtttpRequest class
XMLHttpRequest.prototype.wrappedSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

// Override the existing setRequestHeader function so that it stores the headers
XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
    // Call the wrappedSetRequestHeader function first
    // so we get exceptions if we are in an erronous state etc.
    this.wrappedSetRequestHeader(header, value);

    // Create a headers map if it does not exist
    if(!this.headers) {
        this.headers = {};
    }

    // Create a list for the header that if it does not exist
    if(!this.headers[header]) {
        this.headers[header] = [];
    }

    // Add the value to the header
    this.headers[header].push(value);
}

Object.defineProperty(XMLHttpRequest.prototype, 'responseText', {
	get: function() {
        let requestUrl = this._url,
            responseUrl = this.responseURL,
            headers = this.headers,
            requestHeader = {};
        if(responseUrl){
            if(responseUrl.match(/api\/v1\/friendships\/[0-9]+\/following/g))
            {
                readyState.followingRequest = responseUrl.match(/api\/v1\/friendships\/([0-9]+)\/following/g);
                for (const [key, value] of Object.entries(headers)) {
                    requestHeader[key] = value[0];
                }
                readyState.headerVals = requestHeader;
            }
        }
		return accessor.get.call(this);
	},
	set: function(str) {
		console.log('set responseText: %s', str);
		//return accessor.set.call(this, str);
	},
	configurable: true
});

async function getFollowing(maxId = 0)
{
    let users = [],
        nextMaxId = 0;
    if(readyState.followingRequest && Object.keys(readyState.headerVals).length > 0)
    {
        myJq.ajax({
            url: 'https://www.instagram.com/' + readyState.followingRequest,
            data: {
                count: 200,
                max_id: maxId
            },
            headers: readyState.headerVals,
            xhrFields: {
                withCredentials: true
            }
        }).done(function(data) {
            users = data.users;
            if(data.next_max_id)
            {
                nextMaxId = parseInt(data.next_max_id || 0);
            }
            users.forEach(function(values){
                followings.push({full_name: values.full_name, username: values.username});
            });
        }).fail(function(error,text) {
            console.log(error);
            console.log(text);
        }).always(function() {
            console.log("complete");
        });
        await sleep();
        if(nextMaxId > maxId)
        {
            getFollowing(nextMaxId);
        }
        else
        {
            let csv = convertToCSV(followings);
            // Create a new anchor element
            const downloadLink = document.createElement('a');

            // Set the download attribute to the desired filename
            downloadLink.setAttribute('download', 'data.csv');

            // Set the href attribute to a data URI representing the CSV string
            downloadLink.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);

            // Trigger a click event on the anchor element to initiate the download
            downloadLink.click();
        }
    }
}

async function sleep(ms = 3000)
{
    return new Promise(r => setTimeout(r, ms));
}

function convertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    // Get the keys from the first object in the array
    const keys = Object.keys(array[0]);

    // Add the keys as the first row of the CSV string
    str += keys.join(',') + '\n';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let j = 0; j < keys.length; j++) {
            if (line !== '') line += ',';
            line += `"${array[i][keys[j]]}"`;
        }

        str += `${line}\n`;
    }

    return str;
}