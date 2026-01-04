// ==UserScript==
// @name         Activity instead of promos
// @namespace    https://dreamdb.com/
// @version      20240701.3
// @description  Makes the inbox button link directly to activity, marks all gifts as read, keeping the number of notifications in the red dot equal to the number of unread activity (old number - promos = only activity).
// @author       ajcrwl
// @match        https://tapas.io/*
// @match        https://m.tapas.io/*
// @icon         data:image/gif;base64,R0lGODlhJgAmALMPAPyln/dediYmJvmvz/r09Ph/j5KSkv7ZvPvW89PT0//t1fyZWvZGVgAAAP///wAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkJFOEM3QjI3MzZDOTExRUY4MjU1Q0Y4NTIyQjAzQkZGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkJFOEM3QjI4MzZDOTExRUY4MjU1Q0Y4NTIyQjAzQkZGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QkU4QzdCMjUzNkM5MTFFRjgyNTVDRjg1MjJCMDNCRkYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QkU4QzdCMjYzNkM5MTFFRjgyNTVDRjg1MjJCMDNCRkYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQBAAAPACwAAAAAJgAmAAAE//DJSau9OOvNu/+WI45kSYKPeBRB675wMRCO5wxMru98D4ibW29IzBVqGWFxyfslmdAd7aJkIFSMAM0BYAxEigDRGSrkvocv4Lp2HNOOw1muO1LFXsdCe0Ao8gd6Vn9edDkBSBUOeGpoCARtgQc/Cl8jdIhUZllXBAQrNAp6nZ9zO3YhOEYFV3sFa38FMlymOl8YDoc0kHkOCgtWDrxEiSFRUbe4AsdLycoNm8w7gUECDQ4ILMcBr0DV1ybhDeAnHA7W4eICxTbW4+MGJAbv4+soKe7v6yP59ewd58ARgOdpnoAEIhrYQxFwxDx6DeIlXAiioUN3B0ko/GcOXboSGy7vWfw4IiRDawhJOkhgsuJAiDDpIbyXgoCAmzhz5vRGU2U5mkCDCh1KtKhRoREAADs=
// @grant        none
// @license      CC BY-NC-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/499290/Activity%20instead%20of%20promos.user.js
// @updateURL https://update.greasyfork.org/scripts/499290/Activity%20instead%20of%20promos.meta.js
// ==/UserScript==

const style = 'color: black; background: orange; font-weight: bold;padding:5px;';

var a = document.querySelector('a.js-tiara-tracking-nav[href="/inbox/gift"]');
var a2 = document.querySelector('a.relative[href="/inbox/gift"]');
var sauce;

 if (a) {sauce = a;}
if (a2) {sauce = a2;}
//console.log('%c ', style, sauce);

if (sauce) {
    sauce.setAttribute('href', '/activities');
    if (a2) { var dot = sauce.querySelector('div'); } else {
    dot = sauce.querySelector('.js-new-dot');}
    if (dot) { //if dot element exists
        var mesloc = 'https://' + window.location.host + '/inbox/message';
        //send xhr to grab promos page
        const mxhr = new XMLHttpRequest();
        mxhr.open("GET", mesloc);
        mxhr.send();
        mxhr.responseType = "text";
        mxhr.onload = () => {
            //on success look for NEW badges
            if (mxhr.readyState == 4 && mxhr.status == 200) {
                const data = mxhr.response;
                console.log('%cnew promos: ',style,data.includes('<div class="badge--new">'));
                if (data.includes('<div class="badge--new">')) {
                    //send request to mark promos as read
                    const xhr = new XMLHttpRequest();
                    xhr.open("PATCH", "https://tapas.io/inbox/message/messages/mark-viewed");
                    xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                    const body = JSON.stringify({
                        body: "friendly userscript clearing unread promo messages",
                    });
                    xhr.onload = () => {
                        var data = JSON.parse(xhr.responseText);
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            console.log('%cpatch success, will reload now',style);
                            location.reload();
                            //move window reload here?
                        } else {
                            console.log(`Error: ${xhr.status}`);
                        }
                    };
                    xhr.send(body);
                } else {console.log('%cno new promos! check activity.',style)} //no new promos so all numbers are for new activities
            } else { //failed to fetch promos page
                console.log(`Error: ${mxhr.status}`);
            }
        };
        console.log('%cafter message req',style);
    } else { console.log("%cdot is empty!",style);} //no new notifs
} else {console.log('%cno inbox button??',style);} //not logged in, so no button