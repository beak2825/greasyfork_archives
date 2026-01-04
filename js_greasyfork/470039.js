// ==UserScript==
// @name				Kemono.Party Discord Favourites
// @namespace		https://MeusArtis.ca
// @version     2.0.1
// @author			Meus Artis, gwhizzy
// @description	Allows favouriting of Discord servers
// @icon				https://www.google.com/s2/favicons?domain=kemono.party
// @supportURL	https://t.me/kemonoparty
// @include			/^https:\/\/kemono\.(party|su)\/discord\/server\/.*$/
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license     CC BY-NC-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/470039/KemonoParty%20Discord%20Favourites.user.js
// @updateURL https://update.greasyfork.org/scripts/470039/KemonoParty%20Discord%20Favourites.meta.js
// ==/UserScript==
const strs =
{
    loading: "⋯ Loading",
    fav:     "☆ Favorite",
    unfav:   "★ Unfavorite",
    error:   "! Error"
};
const classname_fav   = "__dcfav_tofav";
const classname_unfav = "__dcfav_tounfav";
const STATE_UNSET = -1;
const STATE_LOAD  = 0;
const STATE_FAV   = 1;
const STATE_UNFAV = 2;
const STATE_ERROR = 3;
var curr_favState = STATE_UNSET;
var cache_canread = true;
var cache_lastState = "[]";
function get_server_id()
{
    let id = location.href.split("/").pop();
    return id ? id : "";
}
function get_parent_el()
{
    return document.getElementById("channels");
}
function styles_inject()
{
    const style = document.createElement("style");
    style.innerText = `.__dcfav_base{box-sizing:border-box;font-weight:700;border:transparent;user-select:none;font-family:Helvetica,sans-serif;color:#888}.__dcfav_tofav{color:#fff}.__dcfav_tounfav{color:#ffdd1a}`;
    document.head.appendChild(style);
}
function button_inject(parent)
{
    let o = document.createElement("div");
    let e = document.createElement("div");
    e.classList.add("__dcfav_base");
    o.style.textAlign = "center";
    parent.appendChild(o).appendChild(e);
}
function button_change_state(e, favState)
{
    curr_favState = favState;
    let toFav = true;
    e.classList.remove(classname_fav);
    e.classList.remove(classname_unfav);
    switch (favState)
    {
        case STATE_LOAD:
        {
            e.innerText = strs.loading;
            e.onclick = undefined;
            e.style.cursor = "default";
            return; // nothing else to do, get out
        }
        case STATE_ERROR:
        {
            e.innerText = strs.error;
            e.style.cursor = "pointer";
            break; // nothing else to do, get out
        }
        case STATE_FAV:
        {
            e.innerText = strs.fav;
            e.classList.add(classname_fav);
            e.style.cursor = "pointer";
            break;
        }
        case STATE_UNFAV:
        {
            e.innerText = strs.unfav;
            e.classList.add(classname_unfav);
            e.style.cursor = "pointer";
            toFav = false;
            break;
        }
        default: return;
    }
    e.onclick = function ()
    {
        cache_canread = false;
        button_set_state(STATE_LOAD);
        fetch("https://kemono.party/favorites/artist/discord/" + get_server_id(), { method: toFav ? "POST" : "DELETE" })
        .catch(() => {})
        .then(_ => button_update());
    }
}
async function get_next_fav_state()
{
    let id = get_server_id();
    try
    {
        let json = await (await fetch("https://kemono.party/api/v1/account/favorites?type=artist")).json();
        // Update localstorage cache
        let cache_newState = JSON.stringify(json);
        localStorage.setItem("favs", cache_newState);
        cache_lastState = cache_newState;
        // Iterate over results to find a match
        for (let o of json)
            if (o?.id === id)
                // Favourite, show button to unfavourite
                return STATE_UNFAV;
    }
    catch (e)
    {
        console.error(e);
        return STATE_ERROR;
    }
    // Otherwise, show button to favourite
    return STATE_FAV;
}
function button_set_state(favState)
{
    let es = document.getElementsByClassName("__dcfav_base");
    if (!es.length)
        // Button not found, ignore
        return;
    button_change_state(es[0], favState);
}
async function button_update(showLoading=true)
{
    if (showLoading)
        // Set default state while querying server for favourite status
        button_set_state(STATE_LOAD);
    let favState = await get_next_fav_state();
    button_set_state(favState);
    cache_canread = true;
}
function cache_init()
{
    // Should be done by the site anyway
    if (!("favs" in localStorage))
        localStorage.setItem("favs", "[]");
    cache_lastState = localStorage.getItem("favs");
    if (!cache_lastState)
        cache_lastState = "[]";
}
function cache_update_from(force=false)
{
    if (cache_canread)
    {
        let id = get_server_id();
        // Update localstorage cache
        let favs = localStorage.getItem("favs");
        if (!favs)
            favs = "[]";
        if (force || favs !== cache_lastState)
        {
            // Detected an updated cache, load into dom
            let json = JSON.parse(favs);
            let showFav = true;
            // Iterate over results to find a match
            for (let o of json)
                if (o?.id === id)
                    // Favourite, show button to unfavourite
                    showFav = false;
            // Change state if not set already
            {
                if (showFav && curr_favState !== STATE_FAV)
                    button_set_state(STATE_FAV);
                else if (!showFav && curr_favState !== STATE_UNFAV)
                    button_set_state(STATE_UNFAV);
            }
        }
    }
    // Run on (safe) interval
    setTimeout(cache_update_from, 1000);
}
function main()
{
    let parent = get_parent_el();
    if (!parent)
        // Not a discord server
        return;
    cache_init();
    styles_inject();
    button_inject(parent);
    cache_update_from(true); // dispatch interval
    button_update(false); // dispatch async
}
main();
