// ==UserScript==
// @name         Add Play Again button back
// @namespace    https://tampermonkey.net/
// @version      0.3
// @description  Return the "Play Again" button to the end screen of a game. This button uses the old functionality, and allows for easy streaks.
// @author       TheFungusAmongUs
// @match        *://*.geoguessr.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/458926/Add%20Play%20Again%20button%20back.user.js
// @updateURL https://update.greasyfork.org/scripts/458926/Add%20Play%20Again%20button%20back.meta.js
// ==/UserScript==

const other_button_button_name = "button_button__CnARx button_variantPrimary__xc8Hp"
const other_button_div_name = "button_wrapper__NkcHZ"
const other_button_span_name = "button_label__kpJrA"
const buttons_class_name = "round-result_actions__5j26U"
let done = false


function copyNodeStyle(sourceNode, targetNode) {
  const computedStyle = window.getComputedStyle(sourceNode)
  Array.from(computedStyle).forEach(
    key => targetNode.style.setProperty(key, computedStyle.getPropertyValue(key), 'important')
  )
}

function check() {
    const view_summary_button = document.getElementsByClassName(other_button_span_name)[0]
    return view_summary_button != null && view_summary_button.innerText == "VIEW SUMMARY" && !done && location.pathname.startsWith("/game")
}

function get_map_slug() {
    const data = JSON.parse(document.getElementById("__NEXT_DATA__").innerText)
    const map_slug = data.query.slug || data.props.pageProps.map.id
    return map_slug
}

function get_redirect_link(map_slug) {

    return location.href.replace(location.pathname, "/maps/" + map_slug + "/play")
}

function add_button() {
    let buttons = document.getElementsByClassName(buttons_class_name)[0]
    let next_map_button = document.getElementsByClassName(other_button_button_name)[0]
    const new_button = buttons.appendChild(document.createElement("a"))
    copyNodeStyle(next_map_button, new_button)
    const new_div = new_button.appendChild(document.createElement("div"))
    copyNodeStyle(document.getElementsByClassName(other_button_div_name)[0], new_div)
    const new_span = new_div.appendChild(document.createElement("span"))
    copyNodeStyle(document.getElementsByClassName(other_button_span_name)[0], new_span)
    new_span.innerText = "Play Again"
    new_button.href = get_redirect_link(get_map_slug())
    done = true
}


function delete_other_button(other_button) {
    other_button.replaceChildren()
    other_button.remove()
}

function do_check() {
    if (check()) {
        add_button()
    }
}

function try_add_button_on_refresh() {
    setTimeout(do_check, 50)
    setTimeout(do_check, 300)
}

function try_add_button() {
    do_check();
    for (let timeout of [250,500,1200,2000]) {
        setTimeout(do_check, timeout)
    }
}

document.addEventListener('click', try_add_button, false)
document.addEventListener('load', try_add_button_on_refresh(), false)
window.addEventListener('popstate', try_add_button, false)