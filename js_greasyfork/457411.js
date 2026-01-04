// ==UserScript==
// @name        Invidious Local Subscriptions
// @author      mthsk
// @homepage    https://codeberg.org/mthsk/userscripts/src/branch/master/inv-local-subscriptions
// @match       *://invidio.xamh.de/*
// @match       *://vid.puffyan.us/*
// @match       *://watch.thekitty.zone/*
// @match       *://y.com.sb/*
// @match       *://yewtu.be/*
// @match       *://youchu.be/*
// @match       *://youtube.076.ne.jp/*
// @match       *://inv.*.*/*
// @match       *://invidious.*/*
// @version     2024.06
// @description Implements local subscriptions on Invidious.
// @run-at      document-end
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.xmlHttpRequest
// @license     AGPL-3.0
// @namespace https://greasyfork.org/users/751327
// @downloadURL https://update.greasyfork.org/scripts/457411/Invidious%20Local%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/457411/Invidious%20Local%20Subscriptions.meta.js
// ==/UserScript==
/**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(async function() {
    "use strict";
    let subscriptions = await GM.getValue("subscriptions") || [];
    let settings = await GM.getValue("settings") || {redirect: false, odysee: false, usepiped: true, pipedinstance: "https://pipedapi-libre.kavin.rocks"};

    if (settings.redirect && location.pathname === "/")
        location.replace(location.protocol + "//" + location.hostname + "/search?q=" + makeid((Math.floor(Math.random() * 16) + 16)) + "#invlocal");
    else if (settings.redirect)
        document.body.querySelectorAll('a[href="/"]').forEach((el) => el.setAttribute("href","/search?q=" + makeid((Math.floor(Math.random() * 16) + 16)) + "#invlocal"));

    if (location.pathname.toLowerCase() === "/search" && location.search.toLowerCase().startsWith("?q=") && !location.search.includes('&') && location.hash.toLowerCase() === "#invlocal")
    {
        const navbar = document.createElement("div");
        navbar.classList.add("feed-menu");
        navbar.innerHTML = '<a href="/feed/popular" class="feed-menu-item pure-menu-heading">Popular</a><a href="/feed/trending" class="feed-menu-item pure-menu-heading">Trending</a><a id="invlocal-refresh" href="javascript:void(0);" class="feed-menu-item pure-menu-heading">Refresh Subscriptions</a>';
        const filters = document.getElementById("filters");
        filters.parentElement.replaceChild(navbar, filters);
        document.body.querySelector('#contents div[class="pure-g"]').innerHTML = '\<center id="invlocal-loading" style="letter-spacing: 0 !important;">Fetching subscriptions...</center>';
        document.body.querySelectorAll('#contents div > a[href*="&page="]').forEach(el => el.parentElement.remove());
        document.body.querySelectorAll("#contents div.no-results-error").forEach(el => { el.remove(); document.body.querySelector("#contents footer > div.pure-g").parentElement.replaceWith(document.body.querySelector("#contents footer > div.pure-g")); });
        document.body.querySelectorAll('a[href$="?referer=' + encodeURIComponent(location.pathname + location.search) + '"]').forEach(el => el.href = el.href + location.hash);
        document.getElementById("contents").getElementsByTagName("hr")[0].remove();
        document.getElementById("searchbox").value = "";
        document.title = "Local Subscription Feed - Invidious";
        let feed;
        if (settings.hasOwnProperty("usepiped") && settings.usepiped)
            feed = await getPipedSubscriptionFeed(settings.pipedinstance);
        else
            feed = await getSubscriptionFeed(false);
        displaySubscriptionFeed(feed);
        let st = 40;
        addEventListener('scroll', function() {
         if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight && !document.getElementById("invlocal-loading")) {
          displaySubscriptionFeed(feed, st);
          st = st + 40;
         }});

        document.getElementById("invlocal-refresh").addEventListener('click', async function (e) {
            if (!e.target.hasAttribute('disabled'))
            {
                e.target.setAttribute('disabled', '');
                document.body.querySelector('#contents div[class="pure-g"]').innerHTML = '\<center id="invlocal-loading" style="letter-spacing: 0 !important;">Fetching subscriptions...</center>';

                if (settings.hasOwnProperty("usepiped") && settings.usepiped)
                    feed = await getPipedSubscriptionFeed(settings.pipedinstance);
                else
                    feed = await getSubscriptionFeed(true);

                displaySubscriptionFeed(feed);
                st = 40;
                e.target.removeAttribute('disabled');
            }
        });
    }
    else if (location.pathname.toLowerCase().startsWith("/feed/"))
    {
        document.getElementsByClassName("feed-menu")[0].innerHTML = document.getElementsByClassName("feed-menu")[0].innerHTML + "\<a href=\"/search?q=" + makeid((Math.floor(Math.random() * 16) + 16)) + "#invlocal\" class=\"feed-menu-item pure-menu-heading\">Local Subscriptions</a>"
    }
    else if (location.pathname.toLowerCase().startsWith("/channel/") || location.pathname.toLowerCase() === "/watch")
    {
        const invsubbutton = document.getElementById("subscribe");
        const localsubbutton = invsubbutton.cloneNode(true);
        localsubbutton.id = "localsubscribe";
        localsubbutton.removeAttribute("href");
        invsubbutton.parentElement.appendChild(localsubbutton);

        let chid = "";
        let chname = "";
        if (location.pathname.toLowerCase().startsWith("/channel/"))
        {
            chid = location.pathname.split('/')[2];
            chname = document.body.querySelector('div[class="channel-profile"] span').textContent.trim();
        }
        else
        {
            chid = document.body.querySelector('a[href] .channel-profile').parentElement.getAttribute("href").split('/')[2];
            chname = document.getElementById("channel-name").textContent.trim();
        }

        if (subscriptions.length > 0 && subscriptions.some(e => e.id === chid))
            localsubbutton.innerHTML = "\<b>Unsubscribe Locally</b>";
        else
            localsubbutton.innerHTML = "\<b>Subscribe Locally</b>";

        localsubbutton.addEventListener("click", async function(ev) {
            if (subscriptions.length > 0 && subscriptions.some(e => e.id === chid)) { //unsubscribe if already subscribed
                if (!confirm("Do you really want to unsubscribe from \"" + chname + "\"?"))
                    return;

                let x = 0;
                subscriptions.forEach(function(e) {
                    if (e.id === chid)
                    {
                        subscriptions.splice(x, 1);
                        ev.target.innerHTML = "\<b>Subscribe Locally</b>";
                    }
                    x++;
                });
            }
            else // subscribe if not
            {
                subscriptions.push({id: chid, name: chname})
                ev.target.innerHTML = "\<b>Unsubscribe Locally</b>";
            }
            console.log(subscriptions);
            await GM.setValue('subscriptions', subscriptions);
        });

        if (location.pathname.toLowerCase() === "/watch")
        {
            if (!settings.usepiped) window.setInterval(getSubscriptionFeed(false, true), 300000);
        }
    }
    else if (location.pathname.toLowerCase() === "/preferences")
    {
        let fieldset = document.body.getElementsByTagName("fieldset");
        fieldset = fieldset[fieldset.length - 1];
        const savebtn = fieldset.getElementsByTagName("button")[0];
        const nulegend = document.createElement('legend');
        nulegend.textContent = "Local Subscribe Preferences";
        const nusettings = document.createElement('div');
        nusettings.setAttribute("class", "pure-control-group");
        nusettings.innerHTML = '\<div class="pure-control-group"><div class="pure-control-group"><label for="invlocal_redirect">Redirect from the invidious home page to local subscriptions page: </label><input id="invlocal_redirect" type="checkbox"></div><div class="pure-control-group"><label for="invlocal_odysee">Display a "Watch on Odysee" button for videos that were synced to Odysee: </label><input id="invlocal_odysee" type="checkbox"></div><div class="pure-control-group"><label for="invlocal_usepiped">Fetch Subscriptions Through Piped: </label><input id="invlocal_usepiped" type="checkbox"></div><div class="pure-control-group"><label for="invlocal_pipedinstance">Database Instance:</label><input id="invlocal_pipedinstance" type="text"></div><div class="pure-control-group"><label for="invlocal_import">Import subscriptions: </label><a id="invlocal_import" href="javascript:void(0);">Import...</a></div><div class="pure-control-group"><label for="invlocal_export">Export subscriptions: </label><a id="invlocal_export" href="javascript:void(0);">Export...</a></div></div>';
        fieldset.insertBefore(nulegend, savebtn.parentElement);
        fieldset.insertBefore(nusettings, savebtn.parentElement);

        document.getElementById("invlocal_redirect").checked = settings.redirect;
        document.getElementById("invlocal_odysee").checked = settings.odysee || false;
        document.getElementById("invlocal_usepiped").checked = settings.usepiped || false;
        document.getElementById("invlocal_pipedinstance").value = settings.pipedinstance || "https://pipedapi-libre.kavin.rocks";

        document.getElementById("invlocal_import").addEventListener("click", (ev) => {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", ".json");
            input.addEventListener("change", async function(e) {
                try {
                    const file = await input.files[0].text();
                    const newpipe_subs = JSON.parse(file);
                    const nusubs = [];
                    newpipe_subs.subscriptions.forEach((i) => {
                        if (i.service_id === 0) {
                            const chanurl = new URL(i.url);
                            const chanid = chanurl.pathname.split("/channel/").pop().split('/')[0];
                            nusubs.push({id: chanid, name: i.name});
                        }
                    });
                    subscriptions = nusubs;
                    await GM.setValue('subscriptions', subscriptions);
                    await GM.setValue('feed', {last: 0, feed: []});
                    alert("Subscriptions imported successfully!");
                }
                catch (ex) { alert("File is corrupted or not supported."); }
            });
            input.click();
        });

        document.getElementById("invlocal_export").addEventListener("click", (ev) => {
            const date = new Date();
            const YYYYMMDDHHmm = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours() ).slice(-2) + ("0" + date.getMinutes()).slice(-2);
            const newpipe_subs = {app_version: "0.24.0", app_version_int: 990, subscriptions: []};
            subscriptions.forEach((e) => {
                newpipe_subs.subscriptions.push({service_id: 0, url: "https://www.youtube.com/channel/" + e.id, name: e.name});
            });
            const a = document.createElement("a");
            const file = new Blob([JSON.stringify(newpipe_subs)], {type: "application/json"});
            a.href = URL.createObjectURL(file);
            a.download = "newpipe_subscriptions_" + YYYYMMDDHHmm + ".json";
            a.click();
        });

        savebtn.addEventListener("click", (ev) => {
            settings.redirect = document.getElementById("invlocal_redirect").checked;
            settings.odysee = document.getElementById("invlocal_odysee").checked;
            settings.usepiped = document.getElementById("invlocal_usepiped").checked;
            if (document.getElementById("invlocal_pipedinstance").value.trim() != "")
                settings.pipedinstance = document.getElementById("invlocal_pipedinstance").value.trim();
            GM.setValue('settings', settings);
        });
    }

    function makeid(length) {
        let result = "";
        const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

        for (let x = 0; x < length; x++)
            result += characters.charAt(Math.floor(Math.random() * characters.length));

        return result;
    }

    function roundViews(views) {
        let rounded = 0;
        let mode = "";

        if (views >= 1000000000) {
            rounded = views / 1000000000;
            mode = "B";
        }
        else if (views >= 1000000) {
            rounded = views / 1000000;
            mode = "M"
        }
        else if (views >= 1000) {
            rounded = views / 1000;
            mode = "K"
        }
        else if (views > 1) {
            return views + " views";
        }
        else {
            return views + " view";
        }

        if (rounded < 10)
            rounded = Math.floor(rounded * 10) / 10;
        else
            rounded = Math.floor(rounded);

        return rounded + mode + " views";
    }

    function msToHumanTime(ms) {
        const seconds = (ms / 1000);
        let tvalue = 0;
        let human = "";

        if (seconds >= 31536000) {
            tvalue = Math.floor(seconds / 31536000);
            human = "year";
        }
        else if (seconds >= 2628000) {
            tvalue = Math.floor(seconds / 2628000);
            human = "month";
        }
        else if (seconds >= 604800) {
            tvalue = Math.floor(seconds / 604800);
            human = "week";
        }
        else if (seconds >= 86400) {
            tvalue = Math.floor(seconds / 86400);
            human = "day";
        }
        else if (seconds >= 3600) {
            tvalue = Math.floor(seconds / 3600);
            human = "hour";
        }
        else if (seconds >= 60) {
            tvalue = Math.floor(seconds / 60);
            human = "minute";
        }
        else {
            tvalue = Math.floor(seconds);
            human = "second";
        }

        if (tvalue > 1)
            return tvalue + ' ' + human + "s ago";
        else
            return tvalue + ' ' + human + " ago";
    }

    function durationString(scs) {
        const durDate = new Date(0);
        durDate.setSeconds(scs);
        const durHour = Math.floor(durDate.getTime() / 1000 / 60 / 60);
        const durMin = durDate.getUTCMinutes();
        const durSec = durDate.getUTCSeconds();

        return (durHour > 0 ? durHour + ':' : '') + (durHour === 0 || durMin > 9 ? durMin : '0' + durMin) + ':' + (durSec > 9 ? durSec : '0' + durSec);
    }

    async function displaySubscriptionFeed(feed,start = 0) {
        const container = document.getElementById("contents").querySelector('div[class="pure-g"]');

        if (!container || start >= feed.length) {
            const elloading = document.getElementById('invlocal-loading');
            if (!!elloading && feed.length === 0)
                elloading.textContent = "No subscriptions to fetch.";
            return;
        }

        if (start === 0)
            container.innerHTML = "";

        let finish = start + 39;
        if (finish > (feed.length - 1))
            finish = feed.length - 1;

        const vidIds = [];
        for (let x = start; x <= finish; x++)
        {
            vidIds.push(feed[x].videoId);
            container.innerHTML += '\<div class="pure-u-1 pure-u-md-1-4"><div class="h-box"><a style="width:100%" href="/watch?v=' + feed[x].videoId + '"><div class="thumbnail"><img tabindex="-1" class="thumbnail" src="/vi/' + feed[x].videoId + '/mqdefault.jpg"/> <div class="bottom-right-overlay"><p class="length">' + durationString(feed[x].lengthSeconds) + '\</p></div></div><p dir="auto">' + feed[x].title + '\</p></a><div class="video-card-row flexible"><div class="flex-left"><a href="/channel/' + feed[x].authorId + '"><p class="channel-name" dir="auto">' + feed[x].author + '\</p> </a></div> <div class="flex-right"><div class="icon-buttons"><a title="Watch on YouTube" href="https://www.youtube.com/watch?v=' + feed[x].videoId + '"><i class="icon ion-logo-youtube"></i></a> <a class="invlocal-odysee" style="visibility: hidden !important;" title="Watch on Odysee" href="' + feed[x].videoId + '"><i class="icon ion-md-rocket"></i></a> <a title="Discuss on Reddit" href="https://www.reddit.com/search?q=url%3A%22' + feed[x].videoId + '%22+AND+%28site%3Ayoutube.com+OR+site%3Ayoutu.be+OR+site%3Ayoutube-nocookie.com%29&amp;restrict_sr=&amp;sort=top&amp;t=all"><i class="icon ion-logo-reddit"></i></a> <a title="Audio mode" href="/watch?v=' + feed[x].videoId + '&amp;listen=1"><i class="icon ion-md-headset"></i></a> <a title="Switch Invidious Instance" href="https://redirect.invidious.io/watch?v=' + feed[x].videoId + '"><i class="icon ion-md-jet"></i></a></div></div></div> <div class="video-card-row flexible"><div class="flex-left"><p class="video-data" dir="auto">Shared ' + msToHumanTime(Date.now() - (feed[x].published * 1000)) + '\</p></div><div class="flex-right"><p class="video-data" dir="auto">' + roundViews(feed[x].viewCount) + '\</p></div></div></div></div>';
        }
        /*container.querySelectorAll('a[href^="https://www.reddit.com/search?q=url%3A%22"]').forEach((el) => {
            const vId = el.href.split("%22")[1];
            el.href = "javascript:void(0);";
            el.addEventListener("mouseover", async (ev) => {
                if (ev.target.parentElement.href === "javascript:void(0);") {
                    const vEl = ev.target.parentElement.parentElement.parentElement.parentElement.parentElement;
                    const reddit = await getJson("https://rss-to-json-serverless-api.vercel.app/api?feedURL=https%3A%2F%2Fwww.reddit.com%2Fsearch.rss%3Fq%3Durl%253A%2522" + vId + "%2522%2BAND%2B%2528site%253Ayoutube.com%2BOR%2Bsite%253Ayoutu.be%2BOR%2Bsite%253Ayoutube-nocookie.com%2529%26restrict_sr%3D%26sort%3Dtop%26t%3Dall", 0);
                    if (reddit.items.length > 0)
                    {
                        ev.target.parentElement.href = reddit.items[0].url;
                    }
                    else
                    {
                        const vTitle = vEl.querySelector('a[href*="/watch?v="] p[dir="auto"]').textContent;
                        const vChannel = vEl.getElementsByClassName("channel-name")[0].textContent;
                        ev.target.parentElement.href = "https://www.reddit.com/r/videos/submit?title=" + encodeURIComponent(vTitle + " — " + vChannel) + "&url=" + encodeURIComponent("https://www.youtube.com/watch?v=" + vId);
                    }
                }
            });
        });*/
        let odyUrls = {};
        if (!!settings.odysee && settings.odysee) {
            odyUrls = await getJson("https://api.odysee.com/yt/resolve?video_ids=" + encodeURIComponent(vidIds.join(',')), 0);
            odyUrls = (!!odyUrls.data && !!odyUrls.data.videos ? odyUrls.data.videos : {});
        }
        const odyseeEls = document.body.querySelectorAll("a.invlocal-odysee[href]");
        odyseeEls.forEach((ody) => {
            let vId = ody.getAttribute('href');
            if (!!settings.odysee && settings.odysee && odyUrls.hasOwnProperty(vId) && odyUrls[vId] !== null)
            {
                ody.href = "https://odysee.com/" + odyUrls[vId].replaceAll('#',':');
                ody.removeAttribute("class");
                ody.removeAttribute("style");
            }
            else {
                ody.remove();
            }
        });
    }

    async function getJson(url,timeout=10000) {
        console.log("Connecting to " + url);
        try {
            const resp = await (function() {
                return new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: 'GET',
                        url: url,
                        timeout: timeout,
                        headers: {
                            'Accept': 'application/json'
                        },
                        onload: resolve,
                        onabort: reject,
                        onerror: reject,
                        ontimeout: reject
                    });
                });
            })();
            return JSON.parse(resp.responseText);
        } catch (e) { return { error: true }; }
    }

    async function getSubscriptionFeed(forced = false, background = false) {
        let feed = await GM.getValue('feed');
        if (forced || !feed || feed.last < (Date.now() - 1800000))
        {
            let hadError = false;
            feed = [];
            const instances = [];
            let jsonInstances = await getJson("https://api.invidious.io/instances.json");

            if ((Object.keys(jsonInstances).length === 0 && jsonInstances.construct) || (jsonInstances.hasOwnProperty("error") && jsonInstances.error))
                return;

            jsonInstances.forEach(function(e) {
                if (e[1].type === "https" && e[1].api)
                {
                    instances.push(e[0]);
                }
            });
            console.log(instances);

            if (instances.length <= 0)
                return;

            for (let x = 0; x < subscriptions.length; x++)
            {
                if (!!document.getElementById('invlocal-loading'))
                    document.getElementById('invlocal-loading').textContent = "Fetching channel " + (x + 1) + " out of " + subscriptions.length;

                let response = await getJson("https://" + instances[Math.floor(Math.random()*instances.length)] + "/api/v1/channels/videos/" + subscriptions[x].id + "?fields=title,videoId,author,authorId,viewCount,published,lengthSeconds,videos");

                if (response.hasOwnProperty("error") && background)
                    return;
                else if (response.hasOwnProperty("error"))
                {
                    hadError = true;
                    continue;
                }
                else if (response.hasOwnProperty("videos"))
                    response = response.videos;

                let playlist = await getJson("https://" + instances[Math.floor(Math.random()*instances.length)] + "/api/v1/playlists/" + subscriptions[x].id + "?fields=videos(title,videoId,author,authorId,lengthSeconds)");
                if (playlist.hasOwnProperty("videos"))
                {
                    playlist = playlist.videos;

                    if (playlist.length > 10)
                        playlist = playlist.slice(0, 10);

                    let plv = 0;
                    playlist.forEach(async function(vid) {
                        if (!response.some(e => e.videoId === vid.videoId))
                        {
                            let vidData = await getJson("https://" + instances[Math.floor(Math.random()*instances.length)] + "/api/v1/videos/" + vid.videoId + "?fields=viewCount,published");
                            if (!vidData.hasOwnProperty("error"))
                            {
                                vid.viewCount = vidData.viewCount;
                                vid.published = vidData.published;
                                feed.push(vid);
                            }
                        }
                        plv++;
                    });
                }

                feed = feed.concat(response);
            }

            feed.sort((a, b) => b.published - a.published);

            if (!hadError)
                await GM.setValue('feed', {last: Date.now(), feed: feed});
            else
                await GM.setValue('feed', {last: 0, feed: feed});

            return feed;
        }
        else
            return feed.feed;
    }

    async function getPipedSubscriptionFeed(api = "pipedapi.kavin.rocks") {
        let feed = [];
        const channels = [];
        subscriptions.forEach(ch => channels.push(ch.id));
        const response = await getJson(api + "/feed/unauthenticated?channels=" + encodeURIComponent(channels.join(',')), 0);

        if (response.hasOwnProperty("error"))
        {
            feed = await GM.getValue('feed');

            if (!!feed && !!feed.feed)
                return feed.feed;
            else
                return [];
        }

        response.forEach((e) => {
            feed.push({title: e.title, videoId: e.url.split("?v=").pop(), author: e.uploaderName, authorId: e.uploaderUrl.split("/channel/").pop(), viewCount: e.views, published: (e.uploaded / 1000), lengthSeconds: e.duration});
        });
        await GM.setValue('feed', {last: Date.now(), feed: feed});
        return feed;
    }
})();