// ==UserScript==
// @name         Instagram Following
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Try to get following data from creators
// @author       Ken Kwok
// @match        *://www.instagram.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.1/jquery.toast.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464283/Instagram%20Following.user.js
// @updateURL https://update.greasyfork.org/scripts/464283/Instagram%20Following.meta.js
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
            await checkPB(followings);
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

async function checkPB(followings)
{
    try {
        for (const obj of followings) {
            console.log(obj.username);
            const data = await myJq.ajax({
                url: `https://www.instagram.com/${obj.username}/?__a=1&__d=dis`,
                method: "GET"
            });
            toastMessage(`Getting ${obj.username}`);
            obj.isBusiness = Boolean(data.graphql.user.is_business_account);
            obj.isProfessional = Boolean(data.graphql.user.is_professional_account);
            obj.eitherOne = obj.isBusiness || obj.isProfessional;
            await sleep(1000);
        }
    } catch (error) {
        console.error("AJAX error:", error);
    }
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

function toastMessage(message)
{
    myJq.toast({
        text: message,
        heading: 'Notice', // Optional heading to be shown on the toast
        loader: true,
        loaderBg: '#9EC600',
        showHideTransition: 'slide', // fade, slide or plain
        allowToastClose: true, // Boolean value true or false
        hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
        stack: 5, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
        bgColor: '#444444',
        textColor: '#eeeeee',
        beforeShow: function(){
            const container = myJq("body");
            const elements = myJq(".jq-toast-wrap");
            const sibling = container.children().eq(0);

            elements.each(function() {
                myJq(this).css("z-index", 99999999);
                myJq(this).css("position", 'absolute');
                myJq(this).children().eq(0).css("border-radius", '15px');
                myJq(this).insertBefore(sibling);
            });
        }
    });
}