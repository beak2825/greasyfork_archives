// ==UserScript==
// @name               sleep
// @description        Sleep for a certain milliseconds.
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.0
// @license            MIT
// ==/UserScript==

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sleepSync(ms)
{
    const endTime = Date.now() + ms;
    while (Date.now() < endTime) {}
}
