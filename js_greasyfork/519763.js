// ==UserScript==
// @name         wikiroute
// @namespace    https://wikiroute.revig.nl/
// @version      0.5.2
// @description  Finds the shortest routes between two wikipedia pages and marks the corresponding links
// @author       Revi
// @license      MIT
// @match        https://*.wikipedia.org/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/519763/wikiroute.user.js
// @updateURL https://update.greasyfork.org/scripts/519763/wikiroute.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let defaultServ = "https://wikiroute.revig.nl/wikiroute?"
    let servOverwritesByLang = new Map()
    let isWikipedia = location.hostname.indexOf("wikipedia")!==-1
    let lang = isWikipedia ? location.hostname.split(".")[0] : "en-text"
    let wikirouteServ = servOverwritesByLang.get(lang) ?? defaultServ

    GM_registerMenuCommand("route", getRoute, "r");
    async function getRoute() {
        let dest = prompt("Destination","");
        if (dest==null) {
            sessionStorage.route=null;
            sessionStorage.articlesVisited=null;
            return;
        }
        let source = me;
        try {
            let res = await fetch(wikirouteServ+"source="+encodeURIComponent(source)+"&dest="+encodeURIComponent(dest)+"&lang="+encodeURIComponent(lang));
            sessionStorage.route = await res.text();
            sessionStorage.articlesVisited=JSON.stringify([]);
        } catch(err) {
            alert(err);
            sessionStorage.route = null;
            sessionStorage.articlesVisited=null;
        }
        start();
    }
    function inMainNamespace(link) {
        let namespaces = ["media","special","user","wikipedia","file","mediawiki","template","help","category","portal","draft","timedtext","module","gadget","gadget definition"];
        let talks = namespaces.map(a=>a+" talk");
        talks.push("talk");
        namespaces = namespaces.concat(talks);
        link = link.toLowerCase();
        for (let i=0;i<namespaces.length;i++) {
            if (link.startsWith(namespaces[i]+":")) return false;
        }
        return true;
    }
    function getLinksInArticle() {
        return Array.from((document.getElementById("bodyContent")||document.getElementsByClassName("mw-parser-output")[0]).getElementsByTagName("a")).map(a=>a.dataset?.url?.split("_").join(" ")||a.href.split("#")[0].split("/wiki/")[1]&&decodeURIComponent(a.href.split("#")[0].split("/wiki/")[1])).filter(a=>a!=undefined)
    }
    async function updateRoute() {
        let route = JSON.parse(sessionStorage.route);
        let dests = route.destinations;
        let sources = Array.from(new Set(getLinksInArticle().map(a=>a.split("_").join(" ")).filter(a=>a!==me&&inMainNamespace(a))));
        if (sources.some(source=>dests.includes(source))) {
            route.route[me] = sources.filter(source=>dests.includes(source));
            console.log("Direct link");
        } else {
            let exclude;
            try { exclude = JSON.parse(sessionStorage.articlesVisited) } catch(e) { exclude=[];console.log("failed to parse articlesVisited") }
            let res = await fetch(wikirouteServ+"lang="+encodeURIComponent(lang), {method:"POST",body:JSON.stringify({sources,dests,exclude})});
            route = await res.json();
            if (route.route==null) {
                let res = await fetch(wikirouteServ+"lang="+encodeURIComponent(lang), {method:"POST",body:JSON.stringify({sources,dests})});
                route = await res.json();
            }
            console.log("source find ratio: "+route.sources.length/sources.length)
            if (route.route==null) {
                alert("No route found when trying to update route");
                // maybe return?
            }
            route.route[me] = route.sources.filter(a=>route.route[a]&&route.route[a].length);
            if (marked.length&&!route.route[(marked[0].dataset.url||getPlainLink(marked[0])).split("_").join(" ")]) {
                console.log("Found faster route");
                marked.forEach(a=>{a.style=""}) // TODO: make better, such that old styles are kept
                marked=[];
                markedI=0;
            }
        }
        sessionStorage.route = JSON.stringify(route);
        console.log("Updated route", route.route[me]);
        routeUpdated = true;
        let urls = route.route[me].map(a=>a.split(" ").join("_"));
        urls.forEach(url=>Array.from(document.getElementsByTagName("a")).forEach(a=>{if((getPlainLink(a)===url||a.dataset.url===url)&&!marked.includes(a)) { a.style.color = "white";a.style.backgroundColor="green";marked.push(a);console.log(a) }}));
    }
    function delay(ms) {
        return new Promise(res=>setTimeout(res, ms));
    }
    var marked = [];
    var markedI = 0;
    let redirectsResolved = false;
    let routeUpdated = false;
    let active = false;
    let me = decodeURIComponent(document.querySelector('link[rel="canonical"]').href.split("#")[0].split("_").join(" ").split("/wiki/")[1]);
    async function resolveRedirects(callback) {
        let as = document.getElementsByTagName("a");
        console.time("Redirect resolution");
        let toResolve = [];
        let redirectas = [];
        for (let i=0;i<as.length;i++) {
            let a = as[i];
            if (!a.classList.contains("mw-redirect")) continue;
            let link = getPlainLink(a);
            if (!link) continue;
            link = link.split("_").join(" ");
            redirectas.push({a,link});
            if (!toResolve.includes(link)) toResolve.push(link);
        }
        let redirectMap = await getRedirectMap(toResolve,redirectMap=>{
            for (let i=0;i<redirectas.length;i++) {
                let link = redirectas[i].link;
                if (!redirectMap.has(link)) continue
                let a = redirectas[i].a;
                a.dataset.url = redirectMap.get(link).split(" ").join("_");
                callback(a);
                redirectas.splice(i,1);i--;
            }
        });
        if (redirectas.length) {
            console.log("Unable to resolve the following redirects:",redirectas,redirectMap);
        }
        console.timeEnd("Redirect resolution");
        redirectsResolved = true;
    }
    async function getRedirectMap(toResolve, callback) {
        let redirectMap = new Map();
        if (!isWikipedia) return redirectMap;
        for (let i=0;i<toResolve.length;i+=50) {
            let requestURL = "/w/api.php?action=query&titles="+toResolve.slice(i,Math.min(i+50,toResolve.length)).map(encodeURIComponent).join("|")+"&formatversion=2&redirects=1&format=json";
            console.time("fetch");
            let res = await fetch(requestURL, {headers:{"api-user-agent":"wikiroute.revig.nl/wikiroute.user.js"}});
            console.timeEnd("fetch");
            let redirects = (await res.json()).query.redirects;
            for (let j=0;j<redirects.length;j++) {
                redirectMap.set(redirects[j].from, redirects[j].to);
            }
            callback(redirectMap);
        }
        return redirectMap;
    }
    function getPlainLink(a) {
        let link = a.href.split("#")[0].split("/wiki/")[1];
        if (!link) return undefined;
        return decodeURIComponent(link);
    }
    function markURLS(urls) {
      Array.from(document.getElementsByTagName("a")).forEach(a=>{if(!a.classList.contains("mw-redirect")&&urls.includes(getPlainLink(a))) { a.style.color = "white";a.style.backgroundColor="black";marked.push(a);console.log(a) }});
    }

    function focusMarkedLink() {
        if (!marked.length) {
            if (!redirectsResolved) {
                alert("Please wait for redirect resolution");
            } else if (!routeUpdated) {
                alert("Please wait for route update");
            } else {
                alert("Fail");
            }
            return;
        }
        if (!marked[markedI].checkVisibility()) uncollapseAll()
        marked[markedI].focus();
        if (marked[markedI].offsetParent==null) {
            console.log(marked,markedI);
            Array.from(document.getElementsByClassName("mw-collapsible-text")).forEach(a=>a.click());
            marked[markedI].focus()
        }
        markedI = (markedI+1)%marked.length;
    }
    function uncollapseAll() {
        Array.from(document.getElementsByClassName("mw-collapsible-toggle-collapsed")).forEach(e=>e.click())
        Array.from(document.getElementsByClassName("mf-icon-expand")).forEach(e=>e.click())
    }
    start();
    document.body.addEventListener("keydown", e=>{if(e.key=="r"&&(e.altKey||e.target===document.body)) getRoute()});
    function start() {
        let route ;
        try { route=JSON.parse(window.sessionStorage.route); } catch {console.log("No valid current route");return;}
        if (!route) return;
        if (route.sources.length===0) {
            console.log("Source not found");
            route.route={};
            route.route[me] = [];
            sessionStorage.route=JSON.stringify(route);
            //no return
        } else if (route.route==null) {
            if (route.destinations.length===0) {
                alert("Destination not found");
            } else {
                alert("No route found");
            }
            window.sessionStorage.route=null;
            window.sessionStorage.articlesVisited=null;
            return;
        }
        if (route.destinations.includes(me)) {
            sessionStorage.route=null;
            sessionStorage.articlesVisited=null;
            return;
        }
        console.log(me, route.route[me]);
        let urls = route.route[me]
        if (!urls) {
            console.log("Page not on route");
            sessionStorage.articlesVisited="[]"; // maybe store two seperate articlesVisited arrays?
            urls=[];
        }
        urls = urls.map(a=>decodeURIComponent(a).split(" ").join("_"));
        markURLS(urls);
        active = true
        redirectsResolved = false;
        routeUpdated = false;

        resolveRedirects(a=>{
          urls.forEach(url=>{
            if (a.dataset.url===url) {a.style.color = "white";a.style.backgroundColor="gray";marked.push(a);console.log(a)}
          })
        }).then(updateRoute)

        GM_registerMenuCommand("link", focusMarkedLink);
        document.body.addEventListener("keydown", function(e) {
            if (e.target!==document.body&&e.target.tagName!=="A") return;
            if (e.key==="k") {
                focusMarkedLink()
            } else if (e.key==="c") {
                uncollapseAll()
            } else if (e.key==="d") {debugger;}
        });
        try { let visited=JSON.parse(window.sessionStorage.articlesVisited);visited.push(me);sessionStorage.articlesVisited=JSON.stringify(visited) } catch(e) { console.log("error updating articlesvisited",e) }
    }
})();
