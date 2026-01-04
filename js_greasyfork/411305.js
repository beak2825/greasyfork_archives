// ==UserScript==
// @name        facebook set posts to private public or friends
// @description Automation tool that sets posts in facebooks activity log to private public or friends for the new 2020 design
// @author      Yorai Levi
// @namespace   https://github.com/YoraiLevi
// @update      https://github.com/YoraiLevi/SetFacebookPostsPrivate/raw/master/GreaseMonkeySetFacebookPrivate.user.js
// @supportURL  https://github.com/YoraiLevi/SetFacebookPostsPrivate/issues
// @include     https://www.facebook.com/*
// @version     0.22.3
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM.openInTab
// @grant       window.close
// @run-at      document-idle


// @downloadURL https://update.greasyfork.org/scripts/411305/facebook%20set%20posts%20to%20private%20public%20or%20friends.user.js
// @updateURL https://update.greasyfork.org/scripts/411305/facebook%20set%20posts%20to%20private%20public%20or%20friends.meta.js
// ==/UserScript==

//3 user scripts merged into a single file:
(function () {
    'use strict';

    const SCRIPT_NAME = "facebook set posts to private"
    console.log('Loading', SCRIPT_NAME)
    let GLOBAL_TIMEOUT = Infinity
    function delayPromise(delay) {
        return new Promise(resolve => setTimeout(() => { resolve() }, delay))
    }
    async function get_selector_visible(selector, period, timeout = GLOBAL_TIMEOUT) {
        let s_time = performance.now()
        while (performance.now() - s_time < timeout) {
            let obj = document.querySelector(selector)
            if (obj && !(window.getComputedStyle(obj).display === "none" || window.getComputedStyle(obj).visibility === "hidden"))
                // checks if exists in dom? and supposedly? visible
                return obj
            await delayPromise(period)
        }
        TamperLog("Waiting timed out: " + selector)
        throw "Waiting timed out: " + selector;
    }
    async function get_selector_not_visible(selector, period, timeout = GLOBAL_TIMEOUT) {
        let s_time = performance.now()
        while (performance.now() - s_time < timeout) {
            let obj = document.querySelector(selector)
            if (!obj || (window.getComputedStyle(obj).display === "none" || window.getComputedStyle(obj).visibility === "hidden"))
                // checks if exists in dom? and supposedly? visible
                return obj
            await delayPromise(period)
        }
        TamperLog("Waiting timed out: " + selector)
        throw "Waiting timed out: " + selector;
    }
    const privacy_mode =  {
            "public": "public",
            "friends" : "friends",
            // "friends_except" : "friends_except",
            // "specific_friends" : "specific_friends",
            "private": "private"
        }
    const post_privacy_mode_icons = {
        "public": "https://static.xx.fbcdn.net/rsrc.php/v3/yJ/r/YSM7OHnZVHv.png",
        "friends" : "https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/9EJBw2oYDPv.png",
        "friends_except" : "https://static.xx.fbcdn.net/rsrc.php/v3/yA/r/cV1LK8Ks1o7.png",
        "specific_friends" : "https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/NmyxV_4nmDz.png",
        "private": "https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/JSmL99pVrUz.png"
    }
    function TamperLog(str){
        let log = GM_getValue("log", [])
        log.push(Date.now()+": "+str)
        GM_setValue("log",log)
    }
    function addInput(parentElement = document.body, cssObj) {
        cssObj = cssObj || { position: 'relative', 'z-index': 3 }
        let input = document.createElement('input'), btnStyle = input.style
        parentElement.appendChild(input)
        input.type = "number"
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return input
    }
    function addButton(text, onclick, parentElement = document.body, cssObj) {
        cssObj = cssObj || { position: 'relative', 'z-index': 3 }
        let button = document.createElement('button'), btnStyle = button.style
        parentElement.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    }
    function stopButtonHandle(){
        GM_setValue("active",false)
    }
        //set privacy action
    if (document.URL.match("https://www.facebook.com/.+/posts/.+|https://www.facebook.com/photo.+") && GM_getValue("active",false)) {
        (function () {
            'use strict';
            console.log("Initializing")
            window.addEventListener('load', async () => {
                let parent = document.body
                let divButtons = document.createElement('div')
                addButton('Stop',stopButtonHandle,divButtons)
                let div = document.createElement('div')
                let cssObj = { position: 'fixed', display: "block", 'z-index': 3, background: "#ffffff", border: "3px solid red" }
                Object.keys(cssObj).forEach(key => div.style[key] = cssObj[key])
                div.appendChild(divButtons)
                parent.insertBefore(div, parent.childNodes[0])
            })
            let three_dot_menu_selector = "div > div.nqmvxvec.j83agx80.jnigpg78.cxgpxx05.dflh9lhu.sj5x9vvc.scb9dxdr.odw8uiq3 > div > div"
            let menu_buttons_selector = "div.cwj9ozl2.ue3kfks5.pw54ja7n.uo3d90p7.l82x9zwi.nwpbqux9.rq0escxv.jgsskzai.ni8dbmo4.stjgntxs > div > div.j83agx80.cbu4d94t.buofh1pr > div.tojvnm2t.a6sixzi8.k5wvi7nf.q3lfd5jv.pk4s997a.bipmatt0.cebpdrjk.qowsmv63.owwhemhu.dp1hu0rb.dhp61c6y.l9j0dhe7.iyyx5f41.a8s20v7p > div"
            const privacy_choice_selector =  {
                "public": "div.kr520xx4.pedkr2u6.ms05siws.pnx7fd3z.b7h9ocf4.pmk7jnqg.j9ispegn.k4urcfbm > div.cbu4d94t.j83agx80 > div > div > div > div > div > div > div:nth-child(1) > div",
                "friends" : "div.kr520xx4.pedkr2u6.ms05siws.pnx7fd3z.b7h9ocf4.pmk7jnqg.j9ispegn.k4urcfbm > div.cbu4d94t.j83agx80 > div > div > div > div > div > div > div:nth-child(2) > div",
                "friends_except" : "div.kr520xx4.pedkr2u6.ms05siws.pnx7fd3z.b7h9ocf4.pmk7jnqg.j9ispegn.k4urcfbm > div.cbu4d94t.j83agx80 > div > div > div > div > div > div > div:nth-child(3) > div",
                "specific_friends" : "div.kr520xx4.pedkr2u6.ms05siws.pnx7fd3z.b7h9ocf4.pmk7jnqg.j9ispegn.k4urcfbm > div.cbu4d94t.j83agx80 > div > div > div > div > div > div > div:nth-child(4) > div",
                "private": "div.kr520xx4.pedkr2u6.ms05siws.pnx7fd3z.b7h9ocf4.pmk7jnqg.j9ispegn.k4urcfbm > div.cbu4d94t.j83agx80 > div > div > div > div > div > div > div:nth-child(5) > div"
            }
            window.addEventListener('load', async () => {
                await delayPromise(1000)
                await setPrivate(GM_getValue("privacy_mode",privacy_mode["private"]))
                TamperLog("closing page: "+document.URL)
                close()
            })
            //p
            async function setPrivate(selected_privacy_mode) {
                let only_me_choice_selector = privacy_choice_selector[selected_privacy_mode]
                console.log("Setting post to",selected_privacy_mode)
                
                //checking privacy state:
                const privacy_settings_icon = post_privacy_mode_icons[privacy_mode[selected_privacy_mode]]
                let audience = document.querySelector("div > span > span > div > div > div> img")
                if (audience && audience.src === privacy_settings_icon){
                    TamperLog(document.URL+" Post was detected to be "+privacy_mode[selected_privacy_mode]+"This is the correct privacy mode for this post.")
                    return
                }
                //The actual action to set a post to the desired privacy
                let three_dot_menu = await get_selector_visible(three_dot_menu_selector)
                three_dot_menu.click()
                TamperLog(document.URL+" Opened 3 dot menu")
                let edit_audience_menu_button = null
                await get_selector_visible(menu_buttons_selector)
                let buttons = document.querySelectorAll(menu_buttons_selector)

                const privacy_selector_icons = {
                    "public": "https://static.xx.fbcdn.net/rsrc.php/v3/yS/r/k1K2sJ70emI.png",
                    "friends" : "https://static.xx.fbcdn.net/rsrc.php/v3/yH/r/hHt2U1bRtLs.png",
                    "friends_except" : "https://static.xx.fbcdn.net/rsrc.php/v3/yH/r/hHt2U1bRtLs.png",
                    "specific_friends" : "https://static.xx.fbcdn.net/rsrc.php/v3/yv/r/cD5R2-Z_DDa.png",
                    "private": "https://static.xx.fbcdn.net/rsrc.php/v3/yU/r/cfUGV2EoMCu.png"
                }
                TamperLog(document.URL+" Searching for audience settings images")
                let imgs = Object.values(privacy_selector_icons);
                for (const b of buttons) {
                    //make cross language with icon detection instead?
                    let img = b.querySelector("*> img")
                    if (img && imgs.indexOf(img.src) !== -1)
                        edit_audience_menu_button = b
                }
                if (edit_audience_menu_button) {
                    edit_audience_menu_button.click()
                }
                else {
                    TamperLog(document.URL+" Couldn't detect edit_audience_menu_button")
                    return
                }
                let only_me_choice = await get_selector_visible(only_me_choice_selector)

                await delayPromise(1000)
                //dummy(presses the x to close window)
                // let closeX = await get_selector_visible("#mount_0_0 > div > div:nth-child(1) > div.rq0escxv.l9j0dhe7.du4w35lb > div:nth-child(5) > div > div > div.rq0escxv.l9j0dhe7.du4w35lb > div > div.iqfcb0g7.tojvnm2t.a6sixzi8.k5wvi7nf.q3lfd5jv.pk4s997a.bipmatt0.cebpdrjk.qowsmv63.owwhemhu.dp1hu0rb.dhp61c6y.l9j0dhe7.iyyx5f41.a8s20v7p > div > div > div > div > div.kr520xx4.pedkr2u6.ms05siws.pnx7fd3z.b7h9ocf4.pmk7jnqg.j9ispegn.k4urcfbm > div.cypi58rs.pmk7jnqg.fcg2cn6m.tkr6xdv7 > div")
                // closeX.click()
                TamperLog(document.URL+" Changing Privacy")

                only_me_choice.click()
                await get_selector_not_visible(only_me_choice_selector)
                //wait for privacy to change in page
                while (audience && audience.src !== post_privacy_mode_icons[selected_privacy_mode]) {
                    console.log("Waiting for audience to update")
                    TamperLog(document.URL+" Waiting for audience to update")
                    await delayPromise(100)
                }
                TamperLog(document.URL+" Processing done. Post is correctly set to "+privacy_mode[selected_privacy_mode])
                return
            }
        })();
    }
    //inject activity manager
    else if (document.URL.match("https://www.facebook.com/.+/allactivity.+")) {
        (function () {
            'use strict'
            console.log("Initializing")
            function get_items() {
                let activity_selector = "div > div:nth-child(1) > div.rq0escxv.l9j0dhe7.du4w35lb > div.rq0escxv.l9j0dhe7.du4w35lb > div > div > div.j83agx80.cbu4d94t.d6urw2fd.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.jifvfom9.gs1a9yip.owycx6da.btwxx1t3.buofh1pr.dp1hu0rb.ka73uehy > div.rq0escxv.l9j0dhe7.tkr6xdv7.j83agx80.cbu4d94t.pfnyh3mw.d2edcug0.hpfvmrgz.dp1hu0rb.rek2kq2y.o36gj0jk > div > div.q5bimw55.rpm2j7zs.k7i0oixp.gvuykj2m.j83agx80.cbu4d94t.ni8dbmo4.eg9m0zos.l9j0dhe7.du4w35lb.ofs802cu.pohlnb88.dkue75c7.mb9wzai9.d8ncny3e.buofh1pr.g5gj957u.tgvbjcpo.l56l04vs.r57mb794.kh7kg01d.c3g1iek1.k4xni2cv > div.j83agx80.cbu4d94t.buofh1pr > div.aov4n071 > div *> div> a"
                let activities = document.querySelectorAll(activity_selector)
                TamperLog("found selector scrolling_container_selector: "+Boolean(activities)+"  "+activity_selector)
                if(!activities){
                    throw "No activities detected"
                }
                return activities
            }
            window.addEventListener('load', async () => {
                console.log("Injecting GUI")
                let parent = document.body
                function insertAfter(referenceNode, newNode) {
                    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
                }
                let divInputs = document.createElement('div')
                let spanMin = document.createElement('div'); spanMin.innerText = "From:(Blank=First)", divInputs.appendChild(spanMin)
                let min = addInput(divInputs)
                min.value = GM_getValue("from", null) + 1 //one based
                let spanMax = document.createElement('div'); spanMax.innerText = "To:(Blank=No Limit)", divInputs.appendChild(spanMax)
                let max = addInput(divInputs)

                function openRangeButtonActionClosure(min_input_element, max_input_element) {
                    return function openRangeButtonAction() {
                        //The gui is 1 indexed and the functions are 0 indexed
                        let from = min_input_element.value ? min_input_element.value - 1 : 0
                        let to = max_input_element.value ? max_input_element.value - 1 : Infinity
                        console.log("Processing range [from:", from, "to:", to, ")")
                        openRange(from, to)
                    }
                }
                async function openButtonAction() {
                    openRange(0, Infinity)
                }
                let divButtons = document.createElement('div')
                addButton('Open Range', openRangeButtonActionClosure(min, max), divButtons)
                addButton('Open All', openButtonAction, divButtons)
                function downloadLogs(){
                    var a = document.createElement("a");
                    a.href = "data:text,"+JSON.stringify(GM_getValue("log",[]), null, 2);
                    a.download = "FacebookAutomationToolLog.txt";
                    a.click();
                }
                addButton('Download Logs', downloadLogs, divButtons)
                addButton('Stop',stopButtonHandle,divButtons)

                let SelectPrivacyMode = addOption(privacy_mode,divInputs)
                function setPrivacyMode(){
                    GM_setValue("privacy_mode",SelectPrivacyMode.value)
                    console.log(GM_getValue("privacy_mode",privacy_mode["private"]))
                }
                SelectPrivacyMode.value = GM_getValue("privacy_mode",privacy_mode["private"])
                SelectPrivacyMode.onchange = setPrivacyMode
                
                let div = document.createElement('div')
                let cssObj = { position: 'fixed', display: "block", 'z-index': 3, background: "#ffffff", border: "3px solid red" }
                Object.keys(cssObj).forEach(key => div.style[key] = cssObj[key])
                div.appendChild(divButtons)
                div.appendChild(divInputs)

                parent.insertBefore(div, parent.childNodes[0])

            })
            function addOption(options, parentElement = document.body,cssObj){
                cssObj = cssObj || { position: 'relative', 'z-index': 3 }
                let select = document.createElement('select'), btnStyle = select.style
                parentElement.appendChild(select)
                for (const [key, value] of Object.entries(options)) {
                    let option = document.createElement('option')
                    option.value = value
                    option.innerText = key
                    select.appendChild(option)
                }
                Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
                return select
            }
            async function openRange(from, to) {
                GM_setValue("active",true)
                //zero indexed [0from,to)
                async function handleRange(from, to) {
                    let items = Array.from(get_items())
                    let rangeItems = items.slice(from, to)
                    //reseting from value to valid value per iteration
                    GM_setValue("from", from)
                    const only_me_lock_icon = post_privacy_mode_icons[GM_getValue("privacy_mode",privacy_mode["private"])]
                    for (const item of rangeItems) {
                        if(!GM_getValue("active",false))
                            return
                        TamperLog("Processing element:"+ item)
                        console.log("Processing element:", item)
                        let audience = item.querySelector("*>img")
                        if (audience && audience.src !== only_me_lock_icon) {
                            await new Promise(async (resolve, reject) => {
                                let tab = await GM.openInTab(item.href, false)
                                tab.onclose = () => {
                                    resolve()
                                }
                            })
                        }
                        GM_setValue("from", GM_getValue("from", 0) + 1)
                    }
                    return items.length
                }
                async function scrollRange(from, max_failures = 30) {
                    //zero indexed [0from,to)
                    let failed = 0;
                    let prevscrollTop = null;
                    while (from > get_items().length - 1) {
                        //from is both an index and is inclusive!
                        let scrolling_container_selector = "div > div:nth-child(1) > div.rq0escxv.l9j0dhe7.du4w35lb > div.rq0escxv.l9j0dhe7.du4w35lb > div > div > div.j83agx80.cbu4d94t.d6urw2fd.dp1hu0rb.l9j0dhe7.du4w35lb > div.rq0escxv.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.jifvfom9.gs1a9yip.owycx6da.btwxx1t3.buofh1pr.dp1hu0rb.ka73uehy > div.rq0escxv.l9j0dhe7.tkr6xdv7.j83agx80.cbu4d94t.pfnyh3mw.d2edcug0.hpfvmrgz.dp1hu0rb.rek2kq2y.o36gj0jk > div > div.q5bimw55.rpm2j7zs.k7i0oixp.gvuykj2m.j83agx80.cbu4d94t.ni8dbmo4.eg9m0zos.l9j0dhe7.du4w35lb.ofs802cu.pohlnb88.dkue75c7.mb9wzai9.d8ncny3e.buofh1pr.g5gj957u.tgvbjcpo.l56l04vs.r57mb794.kh7kg01d.c3g1iek1.k4xni2cv"
                        let scrolling_container = document.querySelector(scrolling_container_selector)
                        TamperLog("found selector scrolling_container_selector: "+Boolean(scrolling_container)+"  "+scrolling_container_selector)
                        //are we at the bottom?
                        if (prevscrollTop === scrolling_container.scrollTop) {
                            failed++;
                            //yes we are and for too long, something is either wrong or we're done.
                            if (failed > max_failures){
                                TamperLog("Failure Scrolling Down, is that everything?")
                                throw "Failure Scrolling Down, is that everything?"
                            }
                        }
                        prevscrollTop = scrolling_container.scrollTop
                        scrolling_container.scrollTop = scrolling_container.scrollHeight
                        await delayPromise(1000)
                    }
                }
                while (from < to) {
                    await scrollRange(from)
                    from = await handleRange(from, to)
                }
            GM_setValue("active",false)
            }
        }())
    }
    //ignore
    else if (document.URL.match("https://www.facebook.com/permalink.php.*|https://www.facebook.com/groups/.*")) {
        TamperLog(document.URL+" This is a post from a group or an unavailable source. cannot change this privacy")
        close()
    }
})();