// ==UserScript==
// @name         All for one
// @namespace    http://tampermonkey.net/
// @version      1.3.7
// @description  just for one
// @license      GPLv3
// @author       bb
// @match        *://blog.csdn.net/*
// @match        *://www.gying.in/*
// @match        *://www.zkk79.com/dongmanplay/*
// @match        *://*/2048/*
// @match        *://space.bilibili.com/*
// @match        *://www.cunhua.pics/*
// @match        *://bbs.summer-plus.net/*
// @match        *://www.blue-plus.net/
// @match        *://www.spring-plus.net/*
// @match        *://www.level-plus.net/*
// @match        *://www.snow-plus.net/*
// @match        *://www.east-plus.net/
// @match        *://www.blue-plus.net/
// @match        *://www.north-plus.net/*
// @match        *://ikuuu.co/*
// @match        *://ikuuu.one/*
// @match        *://ikuuu.eu/*
// @match        *://ikuuu.art/*
// @match        *://ikuuu.me/*
// @match        *://ikuuu.pw/*
// @match        *://www.spcloud.us/*
// @match        *://www.tiaokan.me/*
// @match        *://www.tiaokan.live/*
// @match        *://www.tiaokan.org/*
// @match        *://www.tiaokan.ws/*
// @match        *://www.tiaokan.store/*
// @match        *://tiaokan.live/*
// @match        *://tiaokan.me/*
// @match        *://tiaokan.org/*
// @match        *://tiaokan.store/*
// @match        *://greasyfork.org/*
// @match        *://*.asmr.one/*
// @match        *://pan.baidu.com/*
// @match        *://*.qq.com/*
// @match        *://*.busfan.life/*
// @match        *://*.busfan.cfd/*
// @match        *://www.cdnbus.lol/
// @match        *://www.busjav.lol/
// @match        *://*.javdb35.com/*
// @match        *://yande.re/*
// @match        *://www.btnull.org/*
// @match        *://bbs.colg.cn/*
// @match        *://laowang.vip/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441596/All%20for%20one.user.js
// @updateURL https://update.greasyfork.org/scripts/441596/All%20for%20one.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const usr = {
        "su": "awslx",
        "hu": "faker",
        "au": "pretty",
        "bsu": "loveuu",
        "sp": "cc971030.",
        "hp": "Cc2062027.",
        "bp": "2062027?",
        "comm": "a123456",
        "pk": "sexy",
        "xas": "pretty",
        "lw": "nx",
    }
    const mcyAct = [
        "820257204",
        "2387802100",
        "2435985993",
    ]
    const websiteDomains  = {
        "hjd": "2048",
        "lw": "laowang",
        "ch": "cunhua",
        "sp": "-plus",
        "ik": "ikuuu",
        "spc": "spcloud",
        "tk": "tiaokan",
        "gf": "greasyfork",
        "ao": "asmr.one",
        "bd": "pan.baidu",
        "qq": "qq.com",
        "yd": "yande",
        "fbs": "bus",
        "jdb": "javdb",
        "pk": "gying",
        "csdn": "csdn",
        "yh":"dongmanplay",
        "colg":"colg",
    }

    const websiteSubMenus = {
        "colg":{
            "forum":"reply"
        },
    }

    const spPrefix = [
        "south",
        "north",
        "summer",
        "snow",
        "spring",
        "level",
        "east",
        "blue",
        "white",
    ]
    const hoverArgs = {
        "basic": "black",
        "dest": "rgb(52, 152, 219)",
    }
    const hjdIndex = {
        "selfSell": "136",
        "comic": "180",
        "prefix": "thread.php?fid-",
        "suffix": ".html",
        "deliIndex": 4,
    }
    const mcyIndex = {
        "main": "topics",
        "login": "user/signin",
        "deliIndex": 3,
    }
    const spIndex = {
        "main": "48",
        "prefix": "thread.php?fid=",
        "suffix": ".html",
        "deliIndex": 3,
    }
    const fontCss = {
        "fontWeight": "600",
        "fontFamily": "SF Pro Text,SF Pro Icons,Helvetica Neue,Helvetica,Arial,sans-serif",
    }
    const aCss = {
        "cursor": "pointer",
        "textDecoration": "none",
        "color": hoverArgs.basic,
    }
    const loginBtnCss = {
        "border": "0px none #fff",
        "fontSize": "14px",
        "backgroundColor": "#fff",
    }
    const regToUse = {
        "bd": {
            "mainPart": "复制这段内容后打开百度网盘App，操作更方便哦",
            "code": "提",
            "psw": "解密",
            "left": "【",
            "right": "】",
            "url": /https:[\w\/\.\?\-_&=]*/g,
            "urlStr": "pan.baidu",
            "codeStr": /^[\w]{4}$/,
        },
        "ok": "复制成功！",
        "buy": "购买",
        "login": "登",
    }
    const hjd = {
        "sellFromHjd": "/read",
        "hjdInit": "2048",
    }
    const ch = {
        "chSell": "thread"
    }
    const sp = {
        "spMsg": "action-read",
        "spRead": "thread",
        "spSell": "tid",
        "spCheck": "name-tasks",
        "spProfile": "u.php",
    }
    const gf = {
        "gfLogin": "sign_in",
    }
    const tk = {
        "tkCheck": "user",
    }
    const qq = {
        "qmLogin": "mail"
    }
    const jdb = {
        "jdbLogin": "session"
    }
    const spFont = {
        "basic": "rgb(255, 255, 255)",
        "dest": hoverArgs.dest,
    }

    let DOC = document;

    function handleColg() {
        if(!matchUrl("thread")) return;

        let parentNode = getById("pgt");
        let taskNode = create("div","task")
        let beforeNode = getByClass("y pgb")[0]
        addBefore(parentNode, [taskNode], beforeNode)
        let taskCss = {
            "position":"absolute",
            "left":"213px",
            "top":"273px",
            "cursor":"pointer",
            "backgroundColor":"#3391ff",
            "color":"E8E6E3",
            "display": "flex",
            "width": "94px",
            "height": "38px",
            "align-items": "center",
            "justify-content": "center",
            "border-radius": "5px"
        }
        setCss(taskNode, taskCss)

        let dailyTask = ""
        let twices = ["弓箭手","格斗家"]
        let makeTwice = false;

        let pt = getById("pt")
        let titles = getByTag("a",pt)[2]
        let isPriest = false;

        let isFighter = false;

        twices.forEach(item => {
            let title = titles.textContent
            if(title.match(item)){
                makeTwice = true;
                if(item == "格斗家") isFighter = true;
            }
            if(title.match("职者")) isPriest = true;
        })

        let allContent = getByClass("t_f")[0]
        let dayContent = Array.from(getByTag("font", allContent))

        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const dateStr = `${month}.${day}`;
        const cnDateStr = `${month}月${day}`;

        if(isFighter){
            let text = allContent.innerHTML
            const pattern = new RegExp(`${month}\\.${day}(.*?)<br>`);;
            dailyTask = pattern.exec(text)[0]
            dailyTask = dailyTask.replaceAll("&nbsp;"," ")
            dailyTask = dailyTask.replaceAll("<br>","")
        }else{
            for (let i = 0; i < dayContent.length; i++) {
                let text = dayContent[i].textContent
                if(text.match(dateStr) || text.match(cnDateStr)){
                    dailyTask = text
                    if(isPriest){
                        dailyTask += dayContent[i + 1].textContent
                    }
                    break;
                }
            }
        }
        console.log(dailyTask)
        copyToClipboard(dailyTask + "\n")

        taskNode.onclick = ()=>{
           let times = makeTwice ? 2 : 1
            let editor = getByClass("a-editor")[0]
            for(let i = 0; i < times; i++){
                editor.click()
            }
        }
    }

    function handleColgReply(){
        let bar = getByClass("z")[0]
        let btn = newBtn("copyWindows")
        bar.appendChild(btn)
        let btnCss = {
            "backgroundColor":"#202324",
            "cursor":"pointer",
            "border":"none",
        }
        setCss(btn, btnCss)
        btn.onclick = () => {
            openWindowByUrl()
        }
    }

    function writeDailyTask(taskName, newWindow = false){
        if(newWindow){

        }else{
            let frame = getById("editorIframeBody")
            let existP = getByTag("p", frame)
            let p = existP ? existP[0] : create("p")
            p.textContent = taskName;
            let nextLine = create("p")
            addChildren(frame,[p,nextLine])
        }
    }

    function handleCsdn() {
        let itvId = setInterval(() => {
            let loginCover = getByClass("passport-login-container")[0]
            if (loginCover) {
                loginCover.style.display = "none"
                clearInterval(itvId)
            }
        }, 500)
    }
    function handleYh() {
        let p = getByClass("row")[0]
        let right = getByClass("myui-header__user")[0]
        let headerBtn = newBtn("header")
        let btnCss = {
            "cursor":"pointer",
            "backgroundColor":"rgba(255, 255, 255, 0)",
            "position":"relative",
            "top":"19px",
            "left":"3px",
            "fontSize":"14px",
            "border":"none",
        }
        setCss(headerBtn, btnCss)
        addBefore(p, [headerBtn], right)
        headerBtn.onclick = () => {
            getById("header-top").style.display = "none"
            scrollDown(140)
        }
    }

    function handleLw() {
        if (!getByClass("deanadmin")[0].textContent) {
            let p = getByTag("h2")[0]
            let btn = create("a")
            let btnCss = {
                "position": "relative",
                "top": "-36px",
                "left": "400px",
            }
            setLoginBtn(btn, btnCss)
            btn.onclick = () => {
                goto("member.php?mod=logging&action=login")
            }
            p.appendChild(btn)
        } else {
            // handle(lw)
        }
    }
    function handleSp() {
        if (!matchAny(spPrefix)) return;
        let p = getById("user-login")
        if (p && !isLoginBtn(getChild(p))) {
            spInit(spBarBtn())
            handle(sp)
        } else {
            spInit(spBarBtn(true))
        }
    }
    function handleCh() {
        let p = getByClass("y pns");
        if (p.length > 0 && isLoginBtn(getByTag("a", p[0])[0])) {
            chLogin()
        } else {
            handle(ch)
        }
    }
    function handleHjd() {
        if (isLoginBtn(getByTag("a")[0])) {
            hjdAdjust()
            return
        }
        handle(hjd)
    }
    function handleGf() { handle(gf) }
    function handleQq() { handle(qq) }
    function handleJdb() { handle(jdb) }
    function handleTk() {
        if (!currentUrl.match("user")) {
            tkUser()
        } else {
            handle(tk)
        }
    }

    // current url
    const currentUrl = window.location.href

    function matchUrl(str){
        return currentUrl.match(str)
    }

    function getNowUrl(){
        return window.location.href
    }

    for (let websiteKey in websiteDomains) {
        const domain = websiteDomains[websiteKey];
        const domainMatch = currentUrl.match(domain);

        // 一级路由匹配
        if (domainMatch && domainMatch[0] === domain) {
            if (currentUrl.match("login")) {
                invoke(`${websiteKey}Login()`);
            } else {
                let firstChar = websiteKey[0];
                let handlerMethodName = `handle${websiteKey.replace(firstChar, firstChar.toUpperCase())}`;

                // 二级路由匹配
                const subMenus = websiteSubMenus[websiteKey];
                if (subMenus) {
                    for (let menuPath in subMenus) {
                        const menuHandler = subMenus[menuPath];
                        const menuMatch = currentUrl.match(menuPath);
                        if (menuMatch) {
                            firstChar = menuHandler[0];
                            handlerMethodName += menuHandler.replace(firstChar, firstChar.toUpperCase());
                        }
                    }
                }

                handlerMethodName += "()";
                try {
                    invoke(handlerMethodName);
                } catch (error) {
                    console.log(error, `No such function: ${handlerMethodName}`);
                }
            }
        }
    }

    function handle(site) {
        for (let i in site) {
            let re = site[i];
            if (currentUrl.match(re) != null && currentUrl.match(re)[0] === re) {
                invoke(i + "()")
            }
        }
    }
    function pkLogin() {
        let p = getById("hdul")
        let btn = newBtn()
        let btnCss = {
            "position": "relative",
            "top": "-2px",
            "left": "11px",
        }
        p.appendChild(btn)
        setLoginBtn(btn, btnCss)
        btn.onclick = function () {
            let u = getByName("username")[0]
            let p = getByName("password")[0]
            u.value = usr.pk
            p.value = usr.sp
            sendEvent(u, p)
            getById("button").click()
        }
    }
    function jdbLogin() {
        let p = getByClass("control")[8];
        let btn = newBtn();
        let btnCss = {
            "position": "relative",
            "top": "-25px",
            "left": "11px",
        }
        p.appendChild(btn)
        setLoginBtn(btn, btnCss)
        btn.onclick = function () {
            doJdbLogin()
        }
    }
    function doJdbLogin() {
        getById("email").value = usr.su
        getById("password").value = usr.comm
    }
    function fbsLogin() {
        let p = getByClass("rfm")[4];
        // let btn = create("a")
        let btn = newBtn()
        let btnCss = {
            "width": "44px",
            "height": "21px",
            "marginTop": "-146px",
            "marginLeft": "256px",

        }
        setLoginBtn(btn, btnCss, false)
        p.appendChild(btn)
        btn.onclick = function () {
            doFbsLogin()
        }
    }
    function doFbsLogin() {
        getByName("username")[0].value = usr.bsu
        getByName("password")[0].value = usr.hp
        getByName("loginsubmit")[0].click()
    }
    function ydLogin() {
        let btn = getByTag("h4")[0]
        setLoginBtn(btn)
        btn.onclick = function () {
            doYdLogin()
        }
    }
    function doYdLogin() {
        getById("user_name").value = usr.su
        getById("user_password").value = usr.comm
        getByName("commit")[0].click()
    }
    function qmLogin() {
        let p = getByClass("header_link")[0];
        let em = create("a", "em");
        let pw = create("a", "pw");
        let qqCss = {
            "color": "#1d5494",
            "float": "left",
            "fontSize": "14px",
            "marginLeft": "600px",
            "cursor": "pointer",
        }
        setCsses([em, pw], qqCss)
        pw.style.marginLeft = "640px"
        pw.style.marginTop = "-30px"
        em.onclick = function () {
            copyVal()
        }
        pw.onclick = function () {
            copyVal("pw")
        }
        addChildren(p, [em, pw])
    }
    function copyVal(text = null) {
        let tx = create("textarea");
        addNode(tx)
        let qq = null
        if (text) {
            qq = usr.qm
        }
        tx.value = text;
        tx.select();
        execCmd()
        rmNode(tx)
    }
    function bdLogin() {
        let p = getByClass("bd-login-header__out")[0];
        let btn = create("a", "login");
        let btnCss = {
            "float": "left",
            "display": "block",
            "marginTop": "18px",
            "marginLeft": "384px",
            "fontWeight": "unset",
            "fontSize": "14px",
        }
        wrapEle(btn, btnCss)
        btn.onclick = function () {
            doBdLogin()
        }
        p.insertBefore(btn, getByClass("bd-right-header")[0])
    }
    function doBdLogin() {
        getByClass("u-button")[9].click()
        setTimeout(function () {
            getByName("userName")[0].value = defEmail()
            getByName("password")[0].value = usr.bp
            getById("TANGRAM__PSP_11__submit").click()
        }, 1000)
    }

    function aoLogin() {
        let p = getById("q-app");
        let btn = create("a", "login");
        let btnCss = {
            "marginLeft": "740px",
            "marginTop": "120px",
            "display": "block",
            "fontSize": "14px",
        }
        wrapEle(btn, btnCss)
        btn.onclick = function () {
            doAoLogin()
        }
        p.appendChild(btn)
    }
    function doAoLogin() {
        let u = getByTag("input")[0]
        u.value = usr.au
        let p = getByTag("input")[1]
        p.value = usr.sp
        sendEvent(u, p)
        setTimeout(function () { getByClass("block")[0].click() }, 1000)
    }

    // ******************** Greasy Fork ***********************
    function gfLogin() {
        let btn = getByTag("h3")[1];
        setLoginBtn(btn)
        btn.onclick = function () {
            doGfLogin()
        }
    }
    function doGfLogin() {
        getById("user_email").value = defEmail()
        getById("user_password").value = usr.sp
        getByName("commit")[0].click()
    }

    //****************  tiaokan  ********************
    function tkBtn(name) {
        let p = getByClass("container")[0]
        let btn = create("a", name)
        let btnCss = {
            "marginLeft": "60px",
            "fontSize": "15px",
        }
        wrapEle(btn, btnCss)
        p.appendChild(btn)
        return btn;
    }
    function tkCheck() {
        tkBtn("check").onclick = () => {
            let unchecked = getByClass("usercheck erphp-checkin")
            if (unchecked && unchecked.length > 0) {
                unchecked[0].click()
            }
            setTimeout(function () {
                // let keyCoke = 13
                // let keyboardEvent = documentument.createEvent('KeyboardEvent')
                // let initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? 'initKeyboardEvent' : 'initKeyEvent'
                // keyboardEvent[initMethod]('keydown', true, true, window, false, false, false, false, keyCoke, 0)
                // documentument.dispatchEvent(keyboardEvent)
                window.location.href = "/"
            }, 1000)
        }
    }
    function tkUser() {
        tkBtn("my").onclick = () => {
            //getChild(getById("menu-item-8484")).click()
            getChild(getByClass("menu-item-has-children")[3]).click()
        }
    }
    function tkLogin() {
        console.log("123")
        let g = getById("login");
        let btn = create("a", "login");
        let btnCss = {
            "position": "relative",
            "right": "118px",
            "bottom": "504px",
            "fontSize": "15px",
        }
        wrapEle(btn, btnCss)
        g.appendChild(btn)
        btn.onclick = function () {
            doTkLogin()
        }
    }
    function doTkLogin() {
        getById("user_login").value = buildEmail(mcyAct[0]);
        getById("user_pass").value = usr.hp;
        getById("wp-submit").click()
    }

    //***************** ik *********************
    function ikLogin() {
        let btn = getByTag("h4")[0];
        setLoginBtn(btn);
        btn.onclick = function () {
            getById("email").value = buildEmail(mcyAct[0]);
            getById("password").value = usr.sp;
            getByTag("button")[0].click();
        }
    }
    //***************** spcloud *********************
    function spcLogin() {
        let btn = getByClass("text-3xl")[0];
        let text = btn.textContent
        let ftSize = btn.style.fontSize
        setLoginBtn(btn);
        setText(btn, text)
        btn.style.fontSize = ftSize
        btn.onclick = function () {
            let u = getById("email")
            u.value = buildEmail(mcyAct[1]);
            let p = getById("passwprd")
            p.value = usr.sp;
            sendEvent(u, p)
            getByTag("button")[0].click();
        }
    }

    //*********************** southplus ***********************
    function spInit(btns) {
        let bar = getById("guide")
        let barChild = getByTag("li", bar)[0]
        addBefore(bar, btns, barChild)
    }
    function spBarBtn(login = false) {
        let barCss = {
            "color": "#ffffff",
            "float": "left",
            "marginTop": "7px",
            "display": "inline-block",
            "padding": "0px 10px",
            "fontWeight": "unset",
        }
        let arr = []
        if (login) {
            let loginBtn = create("a", "login")
            loginBtn.onclick = function () {
                getChild(getById("user-login")).click()
            }
            wrapEle(loginBtn, barCss, spFont)
            loginBtn.style.marginRight = "200px"
            arr.push(loginBtn)
            return arr
        }
        let stuff = create("span", "main")
        let folds = [
            getByClass("gonggao")[0],
            getById("breadcrumbs")
        ]
        let trs = [...getByTag("tr", getByTag("tbody")[4])]
        for (let i = 0; i < 11; i++) {
            folds.push(trs[i])
        }
        let cp = clearSrc(null, "span", folds)
        let scrollBtn = create("span", "fall")
        scrollBtn.style.marginRight = "100px"

        stuff.onclick = function () {
            let crt = window.location.href
            window.location.href = "https://" + crt.split("/")[2] + "/thread.php?fid=48&page=1"
            scrollDown()
        }
        scrollBtn.onclick = function () {
            scrollDown();
        }
        arr = [stuff, cp, scrollBtn]
        wrapEles(arr, barCss, spFont)
        return arr
    }
    function spCheck() {
        let p = getByClass("fl")[0]
        let leftText = ""
        let rightText = ""
        let taskCss = {
            "display": "inline-block",
            "position": "relative",
            "top": "-42px",
            "left": "265px",
            "fontSize": "13px",
        }
        let left = create("a");
        let right = create("a");
        let btns = [left, right]
        right.style.marginLeft = "10px"
        wrapEles(btns, taskCss)
        addChildren(p, btns)
        p.style.height = "44px"
        if (currentUrl.match("new")) {
            leftText = "new"
            rightText = "finish"
            left.onclick = () => {
                getChild(getByClass("tr3 f_one")[1], 2).click()
            }
            right.onclick = () => {
                doSpCheck([getById("both_14"), getById("both_15")])
            }
        } else {
            leftText = "process"
            rightText = "assign"
            left.onclick = () => {
                getChild(getByClass("tr3 f_one")[2], 2).click()
            }
            right.onclick = () => {
                doSpCheck([getById("p_15"), getById("p_14")])
            }
        }
        setText(left, leftText)
        setText(right, rightText)
    }

    function doSpCheck(arr) {
        arr.forEach(ele => {
            if (ele) {
                setTimeout(() => {
                    try {
                        getChild(ele).click()
                    } catch (ignore) { }
                }, 1000)
            }
        })
    }
    function spLogin() {
        let errMsg = getByClass("f_one")[0]
        if (errMsg && errMsg.innerText.match("正")) return
        let p = getByTag("td")
        p = p[4]
        let btn = newBtn();
        let btnCss = {
            "marginLeft": "5px",
        }
        setText(btn)
        wrapEle(btn)
        setCss(btn, btnCss)
        setLoginBtn(btn)
        btn.onclick = function () {
            doSpLogin()
        }
        p.appendChild(btn)
    }
    function doSpLogin() {
        getByName("pwuser")[0].value = usr.su;
        getByName("pwpwd")[0].value = usr.sp;
        getByTag("input")[8].click();
        setTimeout(() => {
            spGoto(buildUrl(spIndex, spIndex.main))
        }, 1000)
    }

    //sp profiled
    function spProfile() {
        let topics = getByTag("dt", getById("minifeed"))
        for (let i = 0; i < topics.length; i++) {
            let link = getByTag("a", topics[i])[1]
            let url = link.href
            link.href = url.replace(url.split("/")[2], currentUrl.split("/")[2])
        }
    }

    //sp message
    function spMsg() {
        let btn = getByClass("current link5 b")[0]
        setText(btn, "goto")
        let btnCss = {
            "fontSize": "13px",
        }
        wrapEle(btn, merge(btnCss, fontCss))
        btn.onclick = function () {
            gotoArticle()
        }
    }
    function gotoArticle() {
        let re = /http.*\w/g;
        let dest = getByClass("td1")[3].nextElementSibling;
        let sender = getChild(getByClass("td1")[0].nextElementSibling).textContent

        if (sender == "SYSTEM" || sender == "3ccc287a") {
            dest = dest.getElementsByTagName("a")[0].href
        } else {
            dest = dest.textContent.match(re)[0]
        }
        window.open(dest.replace(dest.split("/")[2], currentUrl.split("/")[2]))
    }
    //sp mainpage order
    function spRead() {
        let btnCss = {
            "background": "#D6D6D6 transparent",
            "color": "#333333",
            "height": "18px",
            "padding": ".2em .6em",
            "display": "inline-block",
            "line-height": "16px",
            "fontSize": "12px",
            "cursor": "pointer",
            "textDecoration": "none"
        }
        let p = getByClass("fl")[6];
        let opts = getByName("orderway")[0].options
        for (let i = 0, len = opts.length; i < len; i++) {
            let btn = create("span");
            setText(btn, opts[i].textContent);
            setCss(btn, btnCss)
            p.appendChild(btn)
            btn.onclick = function () {
                spOrder(opts, i)
                scrollDown()
            }
            btn.onmousemove = function () {
                if (this.style.color == "rgb(51, 51, 51)") {
                    this.style.color = "#fff";
                    this.style.background = "#bbbbbb"
                }
            }
            btn.onmouseleave = function () {
                if (this.style.color == "rgb(255, 255, 255)") {
                    this.style.background = ""
                    this.style.color = "#333333";
                    this.style.background = "#D6D6D6 transparent"
                }
            }
        }
    }

    function spOrder(opts, i) {
        opts[i].selected = true;
        getByClass("btn")[0].click()
    }
    function spSell() {
        let sellLevel = [1, 3, 5, 7, 10]
        let candicates = getByClass("tpc_content")
        let total = candicates.length
        let p = candicates[total - 1]
        let btnCss = {
            "display": "inline-block",
            "padding": "4px 8px",
            "position": "relative",
            "top": "35px",
        }
        for (let i = 0, len = sellLevel.length; i < len; i++) {
            let levelBtn = create("a");
            setText(levelBtn, levelBtn.value = sellLevel[i]);
            wrapEle(levelBtn, merge(btnCss, fontCss, aCss))
            p.appendChild(levelBtn)
            levelBtn.onclick = function () {
                doSpSell(levelBtn);
            }
        }
        let sellInput = create("input");
        sellInput.setAttribute("type", "text");
        sellInput.setAttribute("id", "linkInput");
        sellInput.setAttribute('placeholder', 'type link');
        let siCss = {
            "position": "relative",
            "top": "34px",
            "left": "10px",
            "border": "1px solid #3498db",
        }
        setCss(sellInput, merge(siCss, fontCss))
        p.appendChild(sellInput)

    }
    function doSpSell(btn) {
        let price = btn.value;
        let link = getById("linkInput").value;
        let text = getByTag("textarea")[0].value
        if (text) {
            getByTag("textarea")[0].value += "\n"
        }
        let msg = "";
        if (link.match(regToUse.bd.urlStr)) {
            let mt = link.match(regToUse.bd.url)
            msg = mt[0] + "\n";
            link = getBdCode(link)
        }
        msg += "[sell=" + price + "]\n" + link;
        msg += "\n[/sell]"
        getByTag("textarea")[0].value += msg;
    }
    function lwLogin() {
        let p = getByTag("tr")[6]
        let btn = create("a")
        let btnCss = {
            "position": "relative",
            "top": "19px",
            "left": "9px",
        }
        setLoginBtn(btn, btnCss)
        btn.onclick = () => {
            getByName("username")[0].value = "li" + usr.lw
            getByName("password")[0].value = usr.sp
            getByName("loginsubmit")[0].click()
        }
        p.appendChild(btn)
    }
    //******************* 2048 **************************
    function hjdInit() {
        let linkCss = {
            "fontSize": "14px"
        }
        let p = getByClass("new_topbar_left")[0]
        hjdCheck(p, linkCss)
        let mainLink = create("a", "main")
        let comicLink = create("a", "comic")
        let folds = [
            getByClass("t")[1],
            getByClass("vt")[0],
            getByClass("tac")[0],
            getByClass("pw_list_a")[0],
            getById("tab_1"),
            getById("breadCrumb"),
            getById("cate_children")
        ]
        let trs = [...getByTag("tr", getByTag("tbody")[7])]
        for (let i = 0; i < 9; i++) {
            folds.push(trs[i])
        }
        let cpLink = clearSrc(null, "a", folds)
        let fallLink = create("a", "fall")
        let links = [mainLink, comicLink, cpLink, fallLink]
        mainLink.onclick = function () {
            hjdGoto(buildUrl(hjdIndex, hjdIndex.selfSell))
        }
        comicLink.onclick = function () {
            hjdGoto(buildUrl(hjdIndex, hjdIndex.comic))
        }
        fallLink.onclick = function () {
            scrollDown(1000);
        }
        addChildren(p, links)
        wrapEles(links, linkCss)

    }
    function hjdAdjust() {
        let btn = getByTag("a")[0]
        if (btn) {
            if (currentUrl.match("login")) {
                btn.style.marginLeft = "380px"
            } else {
                btn.style.marginLeft = "450px"
            }
        }
    }
    function hjdCheck(p, css) {
        let btn = create("a", "check")
        wrapEle(btn, css)
        p.appendChild(btn)
        if (currentUrl.match("qiandao")) {
            btn.textContent = "fast check"
        }
        btn.onclick = function () {
            doHjdCheck(this);
        }
    }
    function sellFromHjd() {
        if (currentUrl.match("thread")) { return }
        let btnCss = {
            "display": "inline-block",
            "padding": "0px 5px",
            "fontSize": "15px",
            "position": "relative",
            "top": "-1px",
            "marginLeft": "5px",
        }
        let sellLevel = [3, 5, 7, 10]
        let p = getById("subject_tpc");
        for (let l = 0, len = sellLevel.length; l < len; l++) {
            let levelBtn = create("a");
            levelBtn.textContent = levelBtn.value = sellLevel[l];
            wrapEle(levelBtn, merge(btnCss, fontCss, aCss))
            if (l == 0) {
                levelBtn.style.marginLeft = "10px"
            }
            p.appendChild(levelBtn)
            levelBtn.onclick = function () {
                doHjdSell(levelBtn.value);
            }
        }
        let sellInput = DOC.createElement("input");
        sellInput.setAttribute("type", "text");
        sellInput.setAttribute('placeholder', 'type price');
        let siCss = {
            "marginLeft": "10px",
            "marginTop": "-3px",
            "border": "1px solid #3498db",
        }
        setCss(sellInput, merge(siCss, fontCss))
        p.appendChild(sellInput)
        sellInput.onchange = function () { doHjdSell(sellInput.value) }
    }
    //hjd sell
    function doHjdSell(price) {
        let re = /https:[\.\?\=\/-\w]*/g;
        let tx = create("textarea");
        addNode(tx)
        let blk = getByTag("blockquote")[0].innerHTML.split("<br>");
        let msg = blk[0].match(re)[0];
        msg += "\n[sell=" + price + "]";
        if (blk.length == 1) blk = blk[0].split(" ");
        for (let i = 1; i < blk.length; i++) {
            if (blk[i] != "") msg += blk[i].replace(regToUse.bd.left, "").replace(regToUse.bd.right, "").replace("\n", "") + "\n"
        }
        msg += "[/sell]";
        tx.value = msg;
        tx.select();
        execCmd()
        rmNode(tx)
        console.log(regToUse.ok + "\n" + msg)
    }
    function hjdLogin() {
        if (currentUrl.indexOf("?") != -1) { return }
        hjdAdjust()
        let p = getByClass("cc")[0]
        let btnCss = {
            "fontSize": "14px",
            "position": "relative",
            "top": "-1px",
            "left": "2px",
        }
        let btn = create("a");
        setText(btn)
        wrapEle(btn, btnCss)
        p.appendChild(btn)
        btn.onclick = function () { doHjdLogin() }
    }
    function doHjdLogin() {
        getByName("lgt")[0].checked = true;
        getByName("pwuser")[0].value = usr.hu;
        getByName("pwpwd")[0].value = usr.hp;
        getByName("question")[0].options[8].selected = true;
        getByName("answer")[0].value = "black";
        getByName("submit")[1].click();
        setTimeout(function () {
            hjdGoto(buildHjdLink(hjdIndex.selfSell))
        }, 1000)
    }
    function doHjdCheck(btn) {
        if (btn.textContent == "check") {
            getByTag("a")[2].click();
        } else {
            getByName("qdxq")[Math.floor(Math.random() * 10)].checked = true;
            getById("hy_code").click();
        }
    }

    //**************** cunhua **************************
    function chLogin() {
        let p = getByClass("z cl")[0]
        let btn = create("a", "login");
        let btnCss = {
            "display": "block",
            "height": "26px",
            "padding": "0 8px",
            "fontSize": "14px",
        }
        wrapEle(btn, btnCss)
        p.appendChild(btn)
        btn.onclick = function () {
            getByTag("a", getByClass("y pns")[0])[0].click()
            setTimeout(function () {
                try {
                    chLoginBtn()
                } catch (igonre) { }
            }, 1000)
        }
    }
    function chLoginBtn() {
        let p = getByClass("rfm")[4]
        let btn = newBtn();
        let btnCss = {
            "marginLeft": "368px",
            "marginTop": "-167px",
        }
        setLoginBtn(btn, btnCss)
        p.appendChild(btn)
        btn.onclick = function () {
            doChLogin()
        }
    }
    function doChLogin() {
        getByName("username")[0].value = usr.su;
        getByName("password")[0].value = usr.sp;
        getByName("loginsubmit")[0].click()
    }
    function chSell() {
        chClearSrc()
        let sellLevel = [1, 3, 5, 7, 10]
        let p = getByClass("y pgb")[0]
        let s = getByTag("a", p)[0]
        let chCss = {
            "backgroundColor": "#FFF",
            "cursor": "pointer",
            "borderRadius": "6px",
            "border": "0px",
            "height": "26px",
            "padding": "0 8px",
            "margin": "2px 3px",
            "outline": "none",
            "float": "left",
        }
        for (let i = 0, len = sellLevel.length; i < len; i++) {
            let levelBtn = newBtn("");
            levelBtn.textContent = levelBtn.value = sellLevel[i];
            levelBtn.setAttribute('class', 'sellBtn');
            setCss(levelBtn, merge(chCss, fontCss, aCss))
            p.insertBefore(levelBtn, s)
            levelBtn.onclick = function () {
                let price = this.value;
                let btns = getByClass("sellBtn")
                let basicStyle = {
                    "color": "black",
                    "backgroundColor": "#FFF",
                }
                let afterClickStyle = {
                    "color": "white",
                    "backgroundColor": "#3498db",
                }
                for (let i = 0, len = btns.length; i < len; i++) {
                    if (btns[i].value != price) {
                        setCss(btns[i], basicStyle)
                    } else {
                        setCss(this, afterClickStyle)
                    }
                }
                doChSell(price)
            }
            hover(levelBtn)
        }
        let sellInput = DOC.createElement("input");
        sellInput.setAttribute("type", "text");
        sellInput.setAttribute('placeholder', 'type price');
        let pages = getByClass("pg")[0];
        let siCss = {
            "margin": pages == null || getByTag("a", pages).length < 3 ? "3px 100px 0px 5px" : "3px 5px",
            "float": "left",
            "border": "1px solid #3498db",
        }
        setCss(sellInput, merge(siCss, fontCss))
        p.insertBefore(sellInput, s)
        sellInput.onchange = function () { doChSell(sellInput.value) }
    }

    //ch sell
    function doChSell(price) {
        let tx = create("textarea");
        addNode(tx)
        let pwText = regToUse.bd.psw
        let pwReg = /[pwText].*/g;
        let dl = getByTag("div", getByClass("downinput cl")[0]);
        let linkInfo = getChild(dl[2])
        let msg = getChild(linkInfo).href;
        msg += "\n[sell=" + price + "]\n";
        let code = linkInfo.textContent.replace(regToUse.bd.mainPart, "").split(regToUse.bd.right);
        let m = code[0].match(regToUse.bd.codeStr);
        let pw = code[0].match(pwReg);
        if (m != null) msg += m[0] + "\n";
        if (pw != null) msg += pw[0] + "\n";
        if (dl.length > 4) {
            for (let i = 4; i < dl.length; i += 2) {
                let text = dl[i].textContent;
                if (text != "") msg += text.replace(regToUse.bd.left, "").replace(regToUse.bd.right, "").replace("\n", "") + "\n"
            }
        }
        msg += "[/sell]";
        tx.value = msg;
        tx.select();
        execCmd()
        rmNode(tx)
        console.log(regToUse.ok + "\n" + msg);
    }

    //************* tool *******************
    function scrollBtn(parent = null) {
        let btn = create("a", "fall")
        if (parent) {
            parent.appendChild(btn)
        }
        let btnCss = {
            "marginLeft": "5px",
            "display": "inline-block",
        }
        wrapEle(btn, btnCss)
        btn.onclick = function () {
            scrollDown(900);
        }
        return btn;
    }
    //scroll
    function scrollDown(offset = 1399) {
        DOC.documentumentElement.scrollTop = offset;
    }
    function chBuyBtn(parent) {
        let buyDiv = getByClass("downinput cl")[0]
        let buyBtn = getByTag("a", buyDiv)[0]
        let buyText = buyBtn.textContent;
        let pBtn = create("a", buyText)
        parent.appendChild(pBtn)
        let btnCss = {
            "fontWeight": "bold",
            "float": "right",
            "cursor": "pointer",
            "textDecoration": "none",
            "marginLeft": "10px"
        }
        setCss(pBtn, btnCss)
        if (!buyText.match(regToUse.buy)) {
            buyBtn = getByTag("span", buyDiv)[0];
            setText(pBtn, buyBtn.textContent)
            pBtn.style.color = "black";
            hover(pBtn)
        }
        pBtn.onclick = function () {
            buyBtn.click()
        }
    }

    function chClearSrc() {
        let p = getByClass("z", getById("pt"))[0]
        let cpCss = {
            "position": "relative",
            "left": "10px",
            "top": "2px",
            "marginRight": "5px",
            "fontSize": "13px",
        }
        let bts = [clearSrc(p), scrollBtn(p)]
        addChildren(p, bts)
        setCsses(bts, cpCss)
        chBuyBtn(p)
    }

    function clearSrc(parent = null, type = "a", arr = []) {
        let clear = "clear";
        let resume = "resume";
        let btn = create(type, clear)
        if (parent) {
            parent.appendChild(btn)
        }
        let btnCss = {
            "display": "inline-block",
        }
        let flag = true;
        let oldDisplays = []
        wrapEle(btn, btnCss)
        btn.onclick = function () {
            let srcs = [...getByTag("img")];
            if (arr) {
                arr.forEach(ele => {
                    if (ele) {
                        srcs.push(ele)
                    }
                })
            }
            if (!flag && oldDisplays.length > 0) {
                for (let i = 0, len = srcs.length; i < len; i++) {
                    srcs[i].style.display = oldDisplays[i]
                }
                flag = true;
                setText(btn, clear)
            } else {
                if (oldDisplays.length == 0) {
                    for (let i = 0, len = srcs.length; i < len; i++) {
                        oldDisplays.push(srcs[i].style.display);
                    }
                }
                for (let i = 0, len = srcs.length; i < len; i++) {
                    srcs[i].style.display = "none"
                }
                flag = false;
                setText(btn, resume)
            }
        }
        return btn;
    }
    function getById(id, parent = null) {
        return parent ? parent.getElementById(id) : DOC.getElementById(id)
    }
    function getEles(name, type, parent = null) {
        let root = parent ? parent : DOC
        switch (type) {
            case "name":
                // return parent ? parent.getElementsByName(name) : document.getElementsByName(name);
                return root.getElementsByName(name);
            case "tag":
                // return parent ? parent.getElementsByTagName(name) : document.getElementsByName(name);
                return root.getElementsByTagName(name);
            default:
                // return parent ? parent.getElementsByClassName(name) : document.getElementsByName(name);
                return root.getElementsByClassName(name);
        }

    }
    function getByClass(className, parent = null) {
        return getEles(className, null, parent)
    }
    function getByName(name, parent = null) {
        return getEles(name, "name", parent)
    }
    function getByTag(tagName, parent = null) {
        return getEles(tagName, "tag", parent)
    }
    function buildEmail(str) {
        return str + "@qq.com"
    }
    function defEmail() {
        return buildEmail(mcyAct[0])
    }
    //set hover
    function hover(ele, args = hoverArgs) {
        let basic = args.basic;
        let dest = args.dest;
        ele.onmousemove = function () {
            if (this.style.color == basic) {
                this.style.color = dest;
            }
        }
        ele.onmouseleave = function () {
            if (this.style.color == dest) {
                this.style.color = basic;
            }
        }
    }
    function hovers(eles, args = hoverArgs) {
        eles.forEach(ele => {
            hover(ele, args)
        });
    }
    function setText(ele, name = "login") {
        ele.textContent = name
    }
    function isLoginBtn(btn) {
        return btn && (btn.textContent || btn.value).match(regToUse.login);
    }

    function newBtn(text = null) {
        return text ? create("button", text) : create("button", "login");
    }
    function create(type, text = null) {
        let ele = DOC.createElement(type)
        if (text) ele.textContent = text;
        return ele;
    }
    function setCss(ele, styles = {}) {
        if (!styles) {
            console.log("styles can't be empty!")
        }
        for (let i in styles) {
            ele.style[i] = styles[i];
        }
    }
    function setCsses(eles, styles) {
        eles.forEach(ele => {
            setCss(ele, styles)
        });
    }
    function setLoginBtn(ele, styles = {}, hovered = true, args = hoverArgs) {
        setCss(ele, merge(fontCss, aCss, loginBtnCss, styles))
        setText(ele)
        if (hovered) {
            hover(ele, args)
        }
    }
    function wrapEle(ele, styles = {}, args = hoverArgs) {
        setCss(ele, merge(fontCss, aCss, styles))
        hover(ele, args)
    }
    function wrapEles(eles, styles = {}, args = hoverArgs) {
        eles.forEach(ele => {
            wrapEle(ele, styles, args)
        })
    }
    function addChildren(parent, children) {
        children.forEach(child => {
            parent.appendChild(child)
        });
    }
    function addChild(parent, one) {
        let children = [one]
        children.forEach(child => {
            parent.appendChild(child)
        });
    }
    function addBefore(parent, children, before) {
        children.forEach(child => {
            parent.insertBefore(child, before)
        });
    }
    function spGoto(target, rmTail = false, idx = spIndex.deliIndex, deli = "/") {
        gotoUrl(target, rmTail, idx, deli)
    }
    function mcyGoto(target, rmTail = false, idx = mcyIndex.deliIndex, deli = "/") {
        gotoUrl(target, rmTail, idx, deli)
    }
    function hjdGoto(target, rmTail = false, idx = hjdIndex.deliIndex, deli = "/") {
        gotoUrl(target, rmTail, idx, deli)
    }
    function gotoUrl(target, rmTail = false, idx, deli) {
        let newUrl = currentUrl.replace(currentUrl.split(deli)[idx], target)
        if (rmTail) {
            newUrl = newUrl.substr(0, newUrl.indexOf(target) + target.length)
        }
        window.location.href = newUrl
    }
    function gotoUrlReg(target, reg) {
        window.location.href = currentUrl.replace(reg, target)
    }
    function getChild(p, layer = 1) {
        let temp = p;
        for (let i = 0; i < layer; i++) {
            temp = temp.firstElementChild
        }
        return temp;
    }
    function buildUrl(target, index) {
        return target.prefix + index + target.suffix;
    }
    function matchAny(prefixes) {
        let flag = false;
        prefixes.forEach(prefix => {
            if (currentUrl.match(prefix)) {
                flag = true;
                return;
            }
        });
        return flag;
    }
    function merge() {
        let arr = [...arguments]
        if (arr.length == 1) return arr;
        let target = {}
        arr.forEach(obj => {
            for (let p in obj) {
                target[p] = obj[p]
            }
        });
        return target;
    }
    function getBdCode(link) {
        let idx = link.indexOf(regToUse.bd.code)
        if (idx > -1) {
            link = link.substr(idx)
        } else {
            let lkArr = link.split(" ")
            if (lkArr) {
                let len = lkArr.length
                let matched = 0;
                for (let i = 0; i < len; i++) {
                    if (lkArr[i].match(regToUse.bd.codeStr)) {
                        matched = i;
                        break;
                    }
                }
                if (matched > 0) {
                    link = "";
                    for (let i = matched; i < len; i++) {
                        link += lkArr[i]
                    }
                }
            }
        }
        return link;
    }
    function invoke(methodName) {
        eval(methodName) // eslint-disable-line no-eval
    }
    function execCmd(commandName = "Copy") {
        try{
            DOC.execCommand(commandName);
            console.log("复制内容成功")
        }catch(e){
            console.log("复制内容失败: ",e)
        }

    }
    async function copyToClipboard(text) {
        // 现代API优先
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            // 请求剪贴板写入权限
            const permissionStatus = await navigator.permissions.query({
              name: 'clipboard-write'
            });

            if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
              await navigator.clipboard.writeText(text);
              return true;
            }
            console.warn('剪贴板写入权限未授予');
          } catch (err) {
            console.warn('现代API复制失败，尝试传统方法', err);
          }
        }

        // 传统方法降级方案
        return fallbackCopyToClipboard(text);
      }

      // 传统复制方法
      function fallbackCopyToClipboard(text) {
        return new Promise((resolve) => {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);

          try {
            // 兼容不同浏览器的选择方法
            if (navigator.userAgent.match(/iphone|ipad|ipod/i)) {
              const range = document.createRange();
              range.selectNodeContents(textarea);
              const selection = window.getSelection();
              selection.removeAllRanges();
              selection.addRange(range);
              textarea.setSelectionRange(0, 999999);
            } else {
              textarea.select();
            }

            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            resolve(successful);
          } catch (err) {
            document.body.removeChild(textarea);
            console.error('传统复制方法失败:', err);
            resolve(false);
          }
        });
    }
    function sendEvent() {
        let eles = [...arguments]
        let evt = new CustomEvent('input');
        eles.forEach(ele => {
            ele.addEventListener(evt, function () { });
            ele.dispatchEvent(evt)
        });
    }
    function addNode(node) {
        DOC.body.appendChild(node)
    }
    function rmNode(node) {
        DOC.body.removeChild(node)
    }
    function goto(target) {
        window.location.href = target
    }
    function setReactInputValue(inputDom, newVal) {
        let oldVal = inputDom.value;
        inputDom.value = newVal;
        let event = new Event('input', { bubbles: true });
        event.simulated = true;
        let tracker = inputDom._valueTracker;
        if (tracker) {
            tracker.setValue(oldVal);
        }
        inputDom.dispatchEvent(event);
    }
    function addKeyDown(ele, fun, expectCode = 13) {
        ele.addEventListener("keydown", function (event) {
            if (event.keyCode == expectCode) {
                fun()
            }
        });
    }
    function tryInvoke(fun) {
        try {
            fun()
        } catch (error) {
            console.log(error)
        }
    }
    function tryClick() {
        let eles = [...arguments]
        if (eles) {
            try {
                eles.forEach(ele => {
                    ele.click()
                })
            } catch (error) {
            }
        }
    }
    function openWindowByUrl(url = window.location.href){
       // 打开新窗口
       return window.open(url, '_blank');
    }
})();