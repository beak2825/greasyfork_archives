// ==UserScript==
// @name            Library: Additional DOM Window History-Stack Events (pushstate, replacestate)
// @namespace       org.sidneys.userscripts
// @homepage        https://gist.githubusercontent.com/sidneys/fb1cdcf6fa7eef8df903cc8c178e4144/raw/
// @version         0.1.5
// @description     Complementing the DOM Window 'popstate' event, this library adds the 'pushstate' and 'replacestate' events and corresponding event handlers ('onpushstate', 'onreplacestate').
// @author          sidneys
// @icon            https://i.imgur.com/nmbtzlX.png
// @match           *://*/*
// ==/UserScript==


/**
 * @overview
 *
 * @see {@link https://stackoverflow.com/a/4585031/1327892}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/History/pushState}
 */

/**
 * @public
 *
 * Emits a 'pushstate' event from <window> by Monkey-Patching History.pushState().
 * Calls corresponding window#onpushstate event handler.
 *
 * @mixin window.onpushstate
 */
const originalPushState = window.history.pushState
window.history.pushState = (state, title = '', url) => {
    // Create event
    const event = new Event('pushstate', { bubbles: false, composed: false })
    event.state = state

    // Emit event
    window.dispatchEvent(event)

    // Call 'on'-prefixed event handler method
    if (typeof window.onpushstate === 'function') {
        window.onpushstate(event)
    }
    
    // Call original method
    originalPushState.call(window.history, state, title, url)
}

/**
 * @public
 *
 * Emits a 'replacestate' event from <window> by Monkey-Patching History.replaceState().
 * Calls corresponding window#onreplacestate event handler.
 *
 * @mixin window.onreplacestate
 */
const originalReplaceState = window.history.replaceState
window.history.replaceState = (state, title = '', url) => {
    // Create event
    const event = new Event('replacestate', { bubbles: false, composed: false })
    event.state = state

    // Emit event
    window.dispatchEvent(event)

    // Call 'on'-prefixed event handler method
    if (typeof window.onreplacestate === 'function') {
        window.onreplacestate(event)
    }
    
    // Call original method
    originalReplaceState.call(window.history, state, title, url)
}
