// ==UserScript==
// @name         Patch When Available Library
// @namespace    hoehleg.userscripts.private
// @version      0.1
// @description  Calls a function (getExpectedFnc()) repeatedly until it gives an expected result (confirmIsAvailableFnc()). Forwards it to (doPatchFnc()).
// @author       Gerrit Höhle
// @grant        none
// ==/UserScript==
 
/* jslint esnext: true */
const patchWhenAvailable = ({ getExpectedFnc, doPatchFnc, confirmIsAvailableFnc = null, timeOutRetryMillis = 200, maxPeriodTryMillis = 5000 }) => {
    const valueOrObject = getExpectedFnc();
    const isAvailable = confirmIsAvailableFnc ? confirmIsAvailableFnc(valueOrObject) : !!valueOrObject;
    
    if (!isAvailable) {
        if (timeOutRetryMillis <= maxPeriodTryMillis) {

            setTimeout(() => {
                maxPeriodTryMillis -= timeOutRetryMillis;
                patchWhenAvailable({ getExpectedFnc, doPatchFnc, confirmIsAvailableFnc, timeOutRetryMillis, maxPeriodTryMillis });

            }, timeOutRetryMillis);
        }

        return;
    }

    doPatchFnc(valueOrObject);
};