// ==UserScript==
// @name         New MangaDex Follows
// @namespace    https://greasyfork.org/scripts/430295-new-mangadex-follows
// @version      1.3.4
// @description  Manage your follows
// @author       Australis
// @match        https://mangadex.org/*
// @icon         https://www.google.com/s2/favicons?domain=mangadex.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/430295/New%20MangaDex%20Follows.user.js
// @updateURL https://update.greasyfork.org/scripts/430295/New%20MangaDex%20Follows.meta.js
// ==/UserScript==

function LoadSD(){
    if(localStorage.getItem("seriesdex") == null) seriesdex = []
    else seriesdex = JSON.parse(localStorage.getItem("seriesdex"))
    //1.2
    if(localStorage.getItem("forbidden") == null) forbidden = []
    else forbidden = JSON.parse(localStorage.getItem("forbidden"))
    //1.2.7
    if(localStorage.getItem("splitchaps") == null) splitchaps = []
    else splitchaps = JSON.parse(localStorage.getItem("splitchaps"))
}
LoadSD()

//GLOBAL VARIABLES
// var seriesdex,forbidden,whitelist,blacklist,titlepage,frutyloop,repeat,lista,new_r,new_c,new_d,new_o,new_p,follows,trigger,fstatus,funky
var classChapter = "flex chapter" //class of the elements containing the chapters
var classFeed = "chapter-feed__chapters-list" //class containing the chapter cluster
var grouptagclass = "group-tag lift" //1.3 "group-tag line-clamp-1 -my-1"
var loadedp = "flex gap-2 sm:mb-0 mb-2" //status
var feedone = "mb-4"//"mb-2"//mb-4
var MAXNUM = 10000
var MINNUM = -10
var disURL = ""
var unchecked = true
var preevent = null
whitelist = []
blacklist = []
var orphans = []
titlepage = null
var filter,pikapika
handler = false
var chapdata = "chapter-link" //1.3.1 "ml-2 font-bold line-clamp-1 break-all" //1.3
var chapterelement = "flex items-center"
var chaptergrid = "chapter-grid flex-grow"

var newStyle = newInner("style","text/css",".hideme {\ndisplay: none !important;\n} .levy {\nwhite-space: nowrap;\noverflow: hidden;\ntext-overflow: ellipsis;\nmax-width: 30vw;\ndisplay: block;} .centered{\ntext-align: center;} .yellow{\ncolor: yellow !important}") //1.3.1 //1.2
document.querySelector("head").append(newStyle)

filter = LoadCheckers("filter")
pikapika = LoadCheckers("pikapika")

//FUNCTIONS
function LoadCheckers(name){//1.2
    let varr = JSON.parse(localStorage.getItem(name))
    if(varr == undefined || varr == null) {
        console.info(`${name}: ${JSON.stringify(varr)}`)
        varr = true
        SafeSave(name,varr)
    }
    return varr
}

function SafeLoad(name){//1.2
    let temp = []
    if(localStorage.getItem(name)) temp = JSON.parse(localStorage.getItem(name))
    return temp
}

function GetNumero(text){
    let skip = false
    if(text.includes("Ch.") && text.includes(" - ")) text = text.split("Ch. ")[1].split("-")[0] //1.2.4 //text = text.split(" - ")[0] //1.2
    for(let t of text.replaceAll("\n"," ").replaceAll("\t"," ").split(" ")){
        if(t == "Vol.") skip = true
        else if(t.includes(".")){//1.2
            let num = t.split(".")
            if(num.length > 2){
                let resto = ""
                for(let i = 1; i<num.length; i++) resto+=num[i]
                t = num[0]+"."+resto
            }
        }
        if(t!="" && Number.isFinite(t*1)){//1.2
            if(skip){
                skip = false
            }
            else return t*1
        }
    }
    console.warn(`no number found in ${text}`)
    return NaN
}

function createModal(){
    if(!document.getElementById("daModal")){
        console.log("creating modal")
        var modal = newInner("div","modal",'<div class="modal-content"></div>')
        modal.id = "daModal"
        var body = document.querySelector("body")
        body.insertBefore(modal,body.firstElementChild) //1.2
        var daStyle = newInner("style","text/css",'.modal {display: none;position: fixed;z-index: 500;padding-top: 100px;right: 0;top: 0;width: 100%;height: 100%;overflow: auto;background-color: rgb(0,0,0);background-color: rgba(0,0,0,0.4);}.modal-content {background-color: var(--bg-color);margin: auto;padding: 20px;border: 1px solid #888;width: 80%;}.close {color: #aaaaaa;float: right;font-size: 28px;font-weight: bold;}.close:hover,.close:focus {color: #000;text-decoration: none;cursor: pointer;}')
        document.querySelector("head").append(daStyle)
        var daTableStyle = newInner("style","text/css",'table {border-collapse: collapse;border-spacing: 0;width: 100%;border: 1px solid #ddd;}th, td {text-align: left;padding: 16px;}')
        document.querySelector("head").append(daTableStyle)
    }
    else console.info("modal already exists")
}

function FS(array, number){//FindSeries
    return array.findIndex(q => q.id == number)
}

function HideThis(series,group){
    for(let g of group){//1.2
        if(blacklist.findIndex(q => q[0] == series && q[1] == g) >= 0){ //q[1] == group
            console.info("hide this!")
            return true
        }
        if(blacklist.findIndex(q => q[0] == 0 && q[1] == g) >= 0){
            console.info(`group ${g} globally blocked`)
            return true
        }
    }
    return false
}

function OnlyThis(series,group){
    let result = 0
    for(let g of group){//1.2
        if(whitelist.findIndex(q => q[0] == series && q[1] == g) >= 0) { //the series is listed with this group
            console.info("onlythis!")
            return 2
        }
        if(whitelist.findIndex(q => q[0] == series && q[1] != g) >= 0) { //the series is listed but not this group
            console.info("not whitelisted")
            result = 1
        }
    }
    return result
}

function newInner(tag,classN,inner){
    var temp = document.createElement(tag)
    if(classN == "text/css") temp.type = classN
    else temp.className = classN
    temp.innerHTML = inner
    return temp
}

function cloneDOM(tag,nodo){
    var temp = document.createElement(tag)
    console.debug(nodo) //1.3.4
    temp = nodo.cloneNode(true)
    return temp
}

function newDOM(tag,classN,style){
    var temp = document.createElement(tag)
    temp.className = classN
    temp.style.display = style
    return temp
}

function InverseIt(nodo){//ShowItgain
    let hideme = getCN2(nodo,"hideme")[0]
    let showme = getCN2(nodo,"showme")[0]
    if(!!hideme && !!showme){
        console.log("inversing in process")
        hideme.className = nodo.children[2].className.replace("hideme","showme")
        showme.className = nodo.children[3].className.replace("showme","hideme")
    }
}

function getTID(nodo){//1.2 (get title ID)
    let result = null
    if(nodo){//1.3
        // console.debug(nodo) //1.3.1
        if(typeof(nodo)=="string") result = nodo.split("/")[4] //1.3.2
        else if(getTAG(nodo,"a").length && getTAG(nodo,"a")[0].href.includes("/title/")) result = getTAG(nodo,"a")[0].href.split("/")[4] //1.3
        else if(nodo.href) result = nodo.href.split("/")[4] //1.3
        else if(nodo.firstChild.href) result = nodo.href.split("/")[4] //1.3
        else if(nodo.parentElement.href) result = nodo.parentElement.href.split("/")[4] //1.3.1
    }
    if(result && result.includes("?")) result = result.split("?")[0]
    return result
}

function getGID(nodo){//1.2 //getID2
    let result = []
    function Push(x){
        result.push(x)
        if(result.length == 0) result = [x]
    }
    if(document.URL.includes("/title/")){//1.3.2
        for(let a of getTAG(nodo,"a")){
            let b = a.href
            if(b.includes("?")) b = b.split("?")[0]
            if(b.includes("/group/")) Push(getID3(b))
        }
        // if(getCN("cursor-default").length) Push(0)
        if(getCN2(nodo,"group-tag none").length) Push(0) //1.2.7
    }
    if(nodo){ //1.3.2
        for(let g of nodo.getElementsByClassName(grouptagclass)){
            if(getCN2(nodo,"group-tag none").length) Push(0) //1.2.7
            else{
                let b = g.href
                if(b.includes("?")) b = b.split("?")[0]
                if(b.includes("/group/")) Push(getID3(b))
                }
        }
    }
    else return null
    return result
}

function getID3(text){
    return text.split("/")[4]
}

function HasBeenRead(nodo){
    if(getTAG(nodo,"svg")[0].parentElement.innerHTML.includes(" feather-eye ")) return false
    else{
        if(getTAG(nodo,"svg").length == 0){ //1.3
            console.debug(`NULL SVG: ${nodo.outerHTML}`)
            return null
        }
        // console.debug(`READ SVG: ${nodo.outerHTML}`)
        return true
    }
}

function getDec(n,x){ //1.2.7
    let m = n.toString()
    if(m.includes(".")) return m.split(".")[x]*1
    else {
        if(x==1) return 0
        else return n*1
    }
}

function CheckSplit(nodo,daONE){ //1.2.7
    console.info(`CheckSplit for ${daONE.name}`)
    for(let line of getCN2(nodo,classChapter)){
        let inline = line.getElementsByClassName(chapterelement)[0].innerText //1.3 line.getElementsByTagName("a")[0].innerText
        let ch = GetNumero(inline)*1
        console.log(`processing ${ch}`)
        // console.log(`getDec(ch,0):${getDec(ch,0)} | getDec(ch,1):${getDec(ch,1)}`)
        // console.log(`daONE.last < ch: ${daONE.last < ch}\n!!daONE.aval: ${!!daONE.aval}\ngetDec(daONE.aval,0) == getDec(ch,0): ${getDec(daONE.aval,0) == getDec(ch,0)}\ngetDec(ch,1) < daONE.split: ${getDec(ch,1) < daONE.split}`)
        console.log(daONE)
        if(daONE.last < ch && !!daONE.aval && getDec(ch,1) >= 1 && getDec(ch,1) < daONE.split) SPPush([daONE.id,getTID(line),ch])
    }
    SafeSave("splitchaps",splitchaps)
}

function HaySplit(nodo,daONE){ //1.2.7
    console.info(`HaySplit for ${daONE.name}`)
    for(let line of getCN2(nodo,classChapter)){
        if(splitchaps.findIndex(q => q[1] == getTID(line)) >= 0) return true
    }
    return false
}

function DeMark(){//1.2.7
    for(let i=splitchaps.length-1; i>=0; i--){
        let daONE = seriesdex[seriesdex.findIndex(q => q.id == splitchaps[i][0])]
        if(getDec(daONE.aval,1) == daONE.split) splitchaps.splice(i,1)
        else if(getDec(daONE.aval,0) > splitchaps[i][2]) splitchaps.splice(i,1)
    }
    SafeSave("splitchaps",splitchaps)
}

function ResetLast(id,ch){//1.2.7
    let ps = FS(seriesdex,id)
    seriesdex[ps].last = ch.id
    seriesdex[ps].lastl = ch.l
    seriesdex[ps].next = MAXNUM
    seriesdex[ps].nextl = null
    SafeSave("seriesdex",seriesdex)
    console.debug("resetlast")
}

function FollowsFeed(){
    whitelist = SafeLoad("whitelist")
    blacklist = SafeLoad("blacklist")
    let proxydex = seriesdex //1.3.2
    LoadSD()//1.1.3.3
    unreads = 0
    follows = []

    if(document.URL.includes("titles/feed")) {
        var chapfeed = "chapter-feed__container mb-4" //1.3.3 || feedwhole = "mb-12"

        if(getCN(chapfeed).length){//1.3.3 || if(getCN(feedwhole).length) //if page is loaded
            console.log("FollowsFeed")
            //lista = getCN2(getCN(feedwhole)[0],feedone)
            lista = getCN(chapfeed)[0].parentElement.children //1.3.3
            console.log("lista loaded")
            createModal()

            for(let i = seriesdex.length-1; i>=0; i--){//to correct previous bugs
                if(seriesdex[i].id.includes("/") || seriesdex[i].id.includes("?")) {
                    console.log("bug correction! removing this one:")
                    console.log(seriesdex[i])
                    seriesdex.splice(i,1)
                }
                else{
                    if(seriesdex[i].last == null) seriesdex[i].last = MINNUM
                    if(seriesdex[i].nextc == MAXNUM || seriesdex[i].nextc == null || forbidden.includes(seriesdex[i].nextl)) seriesdex[i] = DefaultNext(seriesdex[i])
                    if(!seriesdex[i].mu) seriesdex[i].mu = 0 //1.2
                    if(!Number.isFinite(seriesdex[i].last)){
                        if(Number.isFinite(seriesdex[i].last*1)) seriesdex[i].last*=1
                        else{
                            let digits = ["1","2","3","4","5","6","7","8","9","0","."]
                            let daNumber = ""
                            for(let j of seriesdex[i].last){
                                if(!digits.includes(j)) break
                                else daNumber+=j
                            }
                            if(daNumber.length) seriesdex[i].last = daNumber*1
                            else seriesdex[i].last = MINNUM
                        }
                    }
                    if(seriesdex[i].last == seriesdex[i].nextc) seriesdex[i] = DefaultNext(seriesdex[i])
                    if(seriesdex[i].lastl == undefined) seriesdex[i].lastl = null //1.2.8
                    if(seriesdex[i].nextl == null && seriesdex[i].nextc != MAXNUM) DefaultNext(seriesdex[i]) //1.2.8
                }
            }

            let rep = 0

            function DecideNext(pseries,nextc,nextl,last,link,id_series,l,nextv,lastv,lastl){//lastl added - 1.2.7 //nextv added - 1.2.5 //moved - 1.2
                let daName = l.children[1].title //1.2
                if(forbidden.includes(nextl)){
                    nextl = null
                    nextc = MAXNUM
                    if(nextv) nextv = MAXNUM
                }
                if(daName[0] == " ") daName = daName.slice(1)
                if(pseries >= 0) {
                    if(!!nextv) RevisaNext2(seriesdex[pseries],[nextc,nextl,nextv]) //1.2.5
                    else RevisaNext2(seriesdex[pseries],[nextc,nextl])
                }
                else {
                    if(!!nextv) seriesdex.push({id:id_series, mu:0, name:daName, last:last, lastl:lastl, nextc:nextc, nextl:nextl, time:0, nextv:nextv, lastv:lastv})
                    else seriesdex.push({id:id_series, mu:0, name:daName, last:last, lastl:lastl, nextc:nextc, nextl:nextl, time:0})
                }

                let index = FS(follows,id_series)
                if(index >= 0){
                    if(!!nextv){//1.2.5
                        if((seriesdex[pseries].last < last && nextv == seriesdex[pseries].lastv) || seriesdex[pseries].last == null) {
                            seriesdex[pseries].last = last
                            seriesdex[pseries].lastl = lastl //1.2.8
                            seriesdex[pseries].lastv = lastv
                            seriesdex[pseries].nextv = nextv
                        }
                        if(nextc > last && nextv == seriesdex[pseries].lastv){
                            RevisaNext2(follows[index],[nextc,nextl,nextv])
                            RevisaNext2(seriesdex[pseries],[nextc,nextl,nextv])
                        }
                        else seriesdex[pseries] = DefaultNext(seriesdex[pseries])
                        if(l != follows[index].pointer){//1.2
                            for(let n of getCN2(l,classChapter)){
                                let temp = cloneDOM("div",n)
                                if(!l.className.includes("dummy") && !follows[index].pointer.innerText.includes(n.innerText)) {//1.2.1
                                    getCN2(follows[index].pointer,classChapter)[0].parentElement.append(temp)
                                }
                            }
                            l.style.display = "none"
                        }
                    }
                    else{
                        if(seriesdex[pseries].last < last || seriesdex[pseries].last == null) seriesdex[pseries].last = last
                        if(nextc > last){
                            RevisaNext2(follows[index],[nextc,nextl])
                            RevisaNext2(seriesdex[pseries],[nextc,nextl])
                        }
                        else seriesdex[pseries] = DefaultNext(seriesdex[pseries])
                        if(l != follows[index].pointer){
                            //while(getCN2(l,classChapter)[0] != undefined) getCN2(follows[index].pointer,classChapter)[0].parentElement.append(getCN2(l,classChapter)[0])
                            //1.2
                            for(let n of getCN2(l,classChapter)){
                                let temp = cloneDOM("div",n)
                                if(!l.className.includes("dummy") && !follows[index].pointer.innerText.includes(n.innerText)) {//1.2.1
                                    getCN2(follows[index].pointer,classChapter)[0].parentElement.append(temp)
                                }
                            }
                            l.style.display = "none"
                        }
                    }
                }
                else{
                    if(!!nextv) follows.push({id:id_series, ch:last, url:link, nextc:nextc, nextl:nextl, pointer:l, nextv:nextv, lastv:lastv})
                    else follows.push({id:id_series, ch:last, url:link, nextc:nextc, nextl:nextl, pointer:l})
                }

                if(pseries == -1) pseries = FS(seriesdex,id_series) //should be the last
                let ati = seriesdex[pseries].nextc //1.2
                if(/*ati == 0 || */ati == null || ati == MAXNUM || (ati > nextc && seriesdex[pseries].last < nextc)){//1.2.8
                    seriesdex[pseries].nextc = nextc
                    seriesdex[pseries].nextl = nextl
                }
            }

            function ProcessGroups(batchi,id_series){
                if(filter){
                    var icono,newdiv
                    var gid = getGID(batchi)
                    let OTresult = OnlyThis(id_series,gid)
                    if(OTresult == 2) {
                        console.log("whitelisted!!")
                        return true
                    }
                    if(HideThis(id_series,gid)) {
                        console.log("blacklisted!! hidethis")
                        funky = "BLACKLIST"
                        return false
                    }
                    if(OTresult == 1) {
                        console.log("not in whitelist!!")
                        funky = "WHITELIST"
                        return false
                    }
                    //not part of any list
                    return true
                }
                else return true
            }

            function ChangeToBL(nodo){//moved - 1.2
                if(getCN2(nodo.parentElement,"showme").length) console.log("still blacklisted?")
                else {
                    var parche = newInner("div","ml-2 font-bold line-clamp-1 break-all showme blacklisted",`BLOCKED (${funky})`) //1.3
                    parche.setAttribute("data-v-7c8acb10","") //1.3
                    nodo.parentElement.insertBefore(parche, nodo.nextSibling) //1.3.4 nodo.parentElement.append(parche)
                    nodo.className += " hideme"
                }
            }

            let lastnode
            try{//1.3.1
                if(!getCN("dummy").length) lastnode = cloneDOM("div",lista[lista.length-2]) //1.3.4 length-1
                else lastnode = null
            }
            catch(e){
                setTimeout(FollowsFeed,1000)
                console.debug(e)
                return
            }
            function SkipLL(l){//1.3.4
                if(!l.className.includes("mb-4")){ //1.3.4
                    console.debug("skipping element")
                    if(l.className.includes("mb-6")) primerelem = l
                    if(l.className.includes("mt-6")) ultimoelem = l
                    return true
                }
                else{
                    console.debug("available")
                    return false
                }
            }
            do{//1.1.3.2
                for(let l of lista){//check the list
                // if(false){
                    try{
                        if(SkipLL(l)) continue //1.3.4
                        console.debug(l)
                        var id_series = getTID(l)
                        var batch = getCN2(l,chaptergrid) //1.3 getCN2(l,classChapter)
                        var chap, link, read, nextc, nextl, last, nextv, lastv
                        nextv = false
                        nextc = MAXNUM
                        nextl = null
                        lastv = MINNUM //1.2.5
                        let verylast = MINNUM //1.2.7
                        let pseries = FS(seriesdex,id_series)
                        if(pseries < 0) {
                            last = MINNUM
                            //1.2.6
                            let sdummy = DefaultObj()
                            sdummy.name = l.children[1].title
                            sdummy.id = id_series
                            seriesdex.push(sdummy)
                            pseries = FS(seriesdex,id_series)
                        }
                        else {
                            last = seriesdex[pseries].last
                            if(seriesdex[pseries].name == "") seriesdex[pseries].name = l.children[1].title //1.2
                        }

                        function GetVol(text){//1.1.3.2
                            if(text.includes("Vol. ")){//1.2.7
                                let t = text.split("Vol. ")[1].split(" ")[0]*1
                                if(!Number.isNaN(t)) {
                                    // console.info(`GetVol: ${t}`)
                                    return t*1
                                }
                            }
                            else {
                                // console.info(`GetVol: FALSE`)
                                return false
                            }
                        }

                        if(batch.length){//if there's chapters
                        //if(false){
                            let prevgid = false
                            for(let i=0; i<batch.length; i++){
                                var name = getCN2(batch[i],chapdata)[0].innerText.replace("\n"," ") //1.3 getTAG(batch[i],"a")[0].innerText.replace("\n"," ")
                                // console.info(`name: ${name}`)
                                var current = GetNumero(name)
                                var vol = GetVol(name)
                                var process = true //1.2 //false
                                var timestamp = 0
                                getCN2(batch[i],chapdata)[0].setAttribute("title",name.replaceAll('"','$').replaceAll('<','[').replaceAll('>',']')) //1.3 getTAG(batch[i],"a")[0].setAttribute("title",name.replaceAll('"','$').replaceAll('<','[').replaceAll('>',']'))

                                if(filter) process = ProcessGroups(batch[i],id_series)

                                function SetVolNext(){//1.2.8
                                    nextc = current
                                    nextl = thisLink
                                    nextv = vol //1.2.5
                                }

                                if(process){//should be shown
                                    if(!batch[i].innerHTML.includes("hideme") && HasBeenRead(batch[i]) == false){ //1.3.4
                                        thisLink = getTAG(batch[i],"a")[0].href //1.3.4 batch[i].parentElement.href //1.3 getTAG(batch[i],"a")[0].href.split("chapter/")[1] //1.2.3
                                        //if(!batch[i].parentElement.href.includes("mangadex")) thisLink = batch[i].parentElement.href //1.3 redundant??
                                        if(verylast < current) verylast = current //1.2.7
                                        if(!seriesdex[pseries].lastv && last > current && (name.toLowerCase().includes("extra") || name.toLowerCase().includes("omake") || name.toLowerCase().includes("bonus") || Number.isInteger(current - 0.5) || Number.isInteger(current - 0.9))) {
                                            getTAG(batch[i],"svg")[0].classList.add("amarillo") //1.2
                                        }
                                        if(seriesdex[pseries].lastv && last > current && vol <= seriesdex[pseries].lastv && (name.toLowerCase().includes("extra") || name.toLowerCase().includes("omake") || name.toLowerCase().includes("bonus") || Number.isInteger(current - 0.5) || Number.isInteger(current - 0.9))) {
                                            getTAG(batch[i],"svg")[0].classList.add("amarillo") //1.2.9
                                        }
                                        if(pseries >= 0 && !!seriesdex[pseries].lastv && vol){//1.1.3.2
                                            if(vol == seriesdex[pseries].lastv && last < current && nextc > last && nextc >= current){
                                                SetVolNext()
                                            }
                                            if(vol == seriesdex[pseries].lastv+1){//1.2.8
                                                if(seriesdex[pseries].nextv > vol){
                                                    SetVolNext()
                                                }
                                                else if(seriesdex[pseries].nextv == vol && nextc > current) {
                                                    SetVolNext()
                                                }
                                            }
                                        }
                                        else if(last < current && nextc >= last && nextc > current){
                                            nextc = current
                                            nextl = thisLink//getTAG(batch[i],"a")[0].href.split("chapter/")[1]
                                            if(forbidden.includes(nextl)) CleanFB(batch[i]) //1.2.1 //shouldn't be part of forbidden
                                            prevgid = getGID(batch[i]) //1.1.3.3
                                        }
                                        else if(current == nextc){//1.1.3.3
                                            let gids = getGID(batch[i])
                                            if(prevgid == [0]){//give priority to real groups
                                                nextl = thisLink//getTAG(batch[i],"a")[0].href.split("chapter/")[1]
                                            }
                                            prevgid = gids
                                        }
                                        if(seriesdex[pseries].aval){//1.2.7
                                            if(seriesdex[pseries].aval < verylast) seriesdex[pseries].aval = verylast
                                        }
                                        else seriesdex[pseries].aval = verylast
                                    }
                                    if(HasBeenRead(batch[i]) == true){//1.3
                                        let cid = getTID(batch[i].parentElement) //1.3
                                        if(getTAG(batch[i],"svg")[0].classList.contains("yellow")) {//1.2
                                            getTAG(batch[i],"svg")[0].classList.remove("yellow")
                                        }
                                        if(seriesdex[pseries].lastl == cid && current != last){//1.2.7
                                            ResetLast(id_series,{id:current,l:cid})
                                            setTimeout(FollowsFeed,100) //1.3
                                            return
                                        }
                                        if(last < current) last = current
                                        if(vol && lastv < vol) lastv = vol //1.2.5
                                        let thistmp = (new Date(getTAG(batch[i],"time")[0].dateTime)).getTime()
                                        if(thistmp > timestamp) timestamp = thistmp
                                    }
                                    //if(HasBeenRead(batch[i]) == null) ignore
                                    if(filter) InverseIt(getCN2(batch[i],chapdata)[0].parentElement) //1.3
                                }
                                else{//has to be hidden
                                    console.log("not to process")
                                    console.log(batch[i])
                                    console.log(seriesdex[pseries])
                                    let cid = getTID(batch[i].parentElement) //1.3
                                    if((!seriesdex[pseries].lastv && current > last) || (seriesdex[pseries].lastv && (vol > seriesdex[pseries].lastv || (vol == seriesdex[pseries].lastv && current > last)))){//1.2.1
                                        FBPush(cid)
                                        getTAG(batch[i],"svg")[0].style.color = "red"
                                        if(forbidden.includes(seriesdex[pseries].nextl)) {//1.3.4 //nextl
                                            console.log("resetting due forbidden")
                                            seriesdex[pseries] = DefaultNext(seriesdex[pseries])
                                        }
                                    }
                                    else{
                                        console.log(`${cid} less than last (${current} <= ${last}\n${name})`)
                                        if(vol) console.log(`vol: ${vol}`) //1.2.4
                                        CleanFB(batch[i])
                                        if(getTAG(batch[i],"svg")[0].style.color) getTAG(batch[i],"svg")[0].style.removeProperty("color")
                                    }
                                    let card = getCN2(l,"continue")
                                    if(card.length && card[0].firstChild.href == batch[i].parentElement.href.split("chapter/")[1]){ //1.3 getTAG(batch[i],"a")[0].href.split("chapter/")[1]){
                                        nextc = MAXNUM
                                        nextl = null
                                    }
                                    if(filter) ChangeToBL(getCN2(batch[i],chapdata)[0])//1.3 ChangeToBL(getTAG(batch[i],"a")[0])
                                }

                            }
                        }
                        DecideNext(pseries,nextc,nextl,last,link,id_series,l,nextv,lastv)
                    }
                    catch(e){
                        console.log("error processing lista")
                        console.log(e)
                    }
                }
                DeMark()
            }while(rep++ < 1)
                document.getElementsByClassName("chapter-feed__title")[0].className+=" caca" //1.3.2
                for(let l of lista){//add the continue link if necessary and add filtering button
                // if(false){
                    if(SkipLL(l)) continue //1.3.4
                    let fbtn = newInner("button","nmf-btn","🔧")
                    fbtn.style.float = "right"
                    fbtn.setAttribute("onclick","NMDFilter(event)")
                    let titu = getCN2(l,"chapter-feed__title")[0]
                    let fbtn_container = cloneDOM("a",titu)
                    fbtn_container.innerHTML = ""
                    fbtn_container.removeAttribute("href")
                    fbtn_container.append(fbtn)
                    fbtn_container.style.display = "block"
                    if(filter && !getCN2(l,"nmf-btn").length) {
                        titu.parentElement.insertBefore(fbtn_container,titu)
                        titu.style.width = "95%"
                    }
                    //let elem = getTAG(l,"a")[0]
                    let elem = getCN2(l,chaptergrid)[0] //1.3
                    if(elem){
                        let daONE = seriesdex[FS(seriesdex,getID3(getTAG(l,"a")[0].href))] //1.3
                        let extrainfo = ""
                        let currLink = `/chapter/${daONE.nextl}` //1.2.3
                        if(daONE.nextl && daONE.nextl.includes(".")) currLink = daONE.nextl //1.2.3
                        if(getCN2(l,classFeed).length == 0) l.style.display = "none"
                        else if(daONE.nextc > daONE.last && daONE.nextl){
                            if(daONE.last != MINNUM && (daONE.nextc - daONE.last >= 1.2)) extrainfo = " (WARNING: skipped chapters)"
                            if(daONE.last == MINNUM && daONE.nextc != 1) extrainfo = " (WARNING: no previous info)"
                            if(daONE.last == MINNUM && daONE.nextc <= 1.1) extrainfo = " (Start reading!)"//1.1.3.2
                            if(daONE.last != MINNUM && daONE.split){ //1.2.7
                                CheckSplit(l,daONE)
                                if(HaySplit(l,daONE)) extrainfo = " (WARNING: split chapter incomplete)"
                            }
                            let continuetext = `CONTINUE to Chapter ${daONE.nextc}${extrainfo}`
                            if(daONE.nextv) continuetext = `CONTINUE to Volume ${daONE.nextv} Chapter ${daONE.nextc}${extrainfo}`
                            let newbutton = newInner("div",classFeed,`<button class=\"continue\"><a href=\"${currLink}\" target="_blank" rel="noopener noreferrer">${continuetext}</button>`) //1.3.1
                            if(getCN2(l,"continue").length == 0) getCN2(l,"chapter-feed__chapters")[0].insertBefore(newbutton,getCN2(l,classFeed)[0])
                            else getCN2(l,"continue")[0].parentElement.innerHTML = newbutton.innerHTML
                        }
                        if(((daONE.nextl == null || daONE.nextl == "") || daONE.last >= daONE.nextc) && getCN2(l,"continue")[0] != undefined){
                            getCN2(l,"continue")[0].parentElement.remove()
                        }
                    }
                    let checker = [] //1.3.4
                    for(let ce of getCN2(l,classChapter)){//1.3.4
                        let state = true
                        for(let ch of checker){
                            if(getTAG(ch,"a")[0].href == getTAG(ce,"a")[0].href) state = false
                        }
                        if(state) checker.push(ce)
                        else ce.style.display = "none"
                    }
                }

            //TopWoNerae()//1.2
            console.info("TOP WO NERAE!")
            let amor = []
            for(let o of getCN("amarillo")){
                amor.push(o)
            }
            for(let a of amor){
                a.classList.replace("amarillo","yellow")
            }

            for(let n=follows.length-1; n >= 0; n--){//put unread chapters on top of the list
                if(getCN2(follows[n].pointer,"yellow").length || follows[n].pointer.innerHTML.includes(" feather-eye ")) {
                    lista[0].parentElement.insertBefore(follows[n].pointer,lista[0]) //1.2
                    console.log("unread UP!")
                }
            }
            for(let n=follows.length-1; n >= 0; n--){//put unread series on top of the list
                if(getCN2(follows[n].pointer,"continue").length) {
                    lista[0].parentElement.insertBefore(follows[n].pointer,lista[0]) //1.2
                    console.log("continue UP!")
                }
            }
            for(let n=follows.length-1; n >= 0; n--){//put comikey's unread series on top of the list since they expire quicker
                if(getCN2(follows[n].pointer,"continue").length && follows[n].pointer.innerText.includes("Comikey")) {
                    lista[0].parentElement.insertBefore(follows[n].pointer,lista[0]) //1.2
                    console.log("comikey UP!")
                }
            }
            //end TopWoNerae
            lista[0].parentElement.insertBefore(primerelem,lista[0]) //1.3.4

            if(lastnode && lista[lista.length-1].innerText != lastnode.innerText){//1.2 //to not mess up the pagination for some reason
                let ultimo = cloneDOM("div",lastnode)
                console.log("dummy this time:")
                console.log(ultimo)
                ultimo.style.display = "none"
                ultimo.className+= " dummy"
                lista[0].parentElement.append(ultimo)
                lista[0].parentElement.append(ultimoelem) //1.3.4
            }

            if(!frutyloop) {
                console.log("fruty fruty frutyloooop!")
                frutyloop = true
                // for(let i=1; i<6; i++) setTimeout(KeepChecking,i*2000)
                e2o = lista[0].parentElement
                observer = new MutationObserver(function() {
                    KeepChecking()
                })
                observer.observe(e2o, {subtree: true, attributes: true})
            }
            //1.3.2
            let counter = 0
            for(let i=0; i<proxydex.length;i++){
                if(seriesdex[i].last > proxydex[i].last) counter++
            }
            if(counter <= 1) SafeSave("seriesdex",seriesdex)
            else alert("Possible bug! Reload the page to be sure")
        }
        else setTimeout(FollowsFeed,1000)
    }
    else console.log("FollowsFeed doesn't apply") //1.3.3
}

function KeepChecking(){//1.2
    if(frutyloop){
        if(document.getElementsByClassName("chapter-feed__title").length){ //1.3.2
            let totales = getCN("flex-shrink-0 cursor-pointer").length
            let noleidos = getCN("flex-shrink-0 cursor-pointer feather-eye").length
            if(unreads != totales-noleidos){
                if(noleidos > 0) FollowsFeed()
                unreads = totales-noleidos
            }
        }
        else setTimeout(KeepChecking,2000) //1.3.2
        // setTimeout(KeepChecking,2000)
    }
}

function DefaultObj(){//moved - 1,2.6
    return {id:0,mu:0,name:"",avail:MINNUM,last:MINNUM,lastl:null,nextc:MAXNUM,nextl:null, time:0} //1.2.7
}

function Llenar2(){//1.1.3.2
    function Walala(){
        console.info("walala")
        let items = getCN("manga-card") //1.2.5 getCN("manga-card bg-accent")
        let temp = []
        let pgn = 1 //1.3.4

        function WaitElement(){
            console.info("waiting")
            if(items.length){
                setTimeout(Primero,1000)
                console.info("for primero")
            }
            else{
                setTimeout(WaitElement,5000)
                console.log("another 5 seconds")
            }
        }

        function Primero(){
            console.info("primero")
            try{
                for(let i of items){
                    let manga = DefaultObj()
                    manga.id = getTID(i)
                    manga.name = getTAG(i,"span")[0].innerText//1.2//i.firstChild.innerText
                    if(FS(temp,manga.id) < 0) temp.push(manga)
                }
                ClickSiguiente()
            }
            catch(e){
                console.warn("catch primero")
                console.error(e)
                setTimeout(Primero,500)
            }
        }

        function ClickSiguiente(){
            try{
                let pagination = getCN("flex justify-center flex-wrap gap-2 my-6")[0].children
                //1.2.7
                // let final = pagination[pagination.length-1]
                // final.href = final.href.replace("?page=1","?page=2")
                // if(!final.className.includes("disabled")){
                //     if(final.href.includes("?page=1")) pagination[2].click()
                //     else final.click()
                //     console.info(`click ${final.href}!`)
                //     Segundo()
                // }
                //1.3.4
                let state = true
                console.info(`seeking page ${pgn+1}`)
                for(let p of pagination){
                    console.info(p.href)
                    if(!p.className.includes("px-0") && p.href && p.href.includes((pgn+1).toString())){
                        state = false
                        console.info(`found page ${pgn+1}`)
                        p.click()
                        pgn++
                        Segundo()
                        return
                    }
                }
                if(state){
                    console.info(`no page ${pgn}, proceeding to next tab`) //1.3.4
                    NextTab()
                    pgn = 1 //1.3.4
                    console.log(temp)
                    return temp
                }
                console.info("ClickSiguiente failed?")
            }
            catch(e){
                if(!getCN("flex justify-center flex-wrap gap-2 my-6")[0]){
                    console.warn("no pagination")
                    NextTab()
                    pgn = 1 //1.3.4
                    console.log(temp) //1.2.7
                    return temp
                }
            }
        }

        function Segundo(){
            try{
                items = getCN("manga-card") //1.2.5 getCN("manga-card bg-accent")
                let dummy = DefaultObj()
                dummy.id = getTID(items[0])
                dummy.name = items[0].firstChild.innerText
                //1.2.7
                let pagination = getCN("flex justify-center flex-wrap gap-2 my-6")[0].children
                let final = pagination[pagination.length-1]

                if(final.href.includes("page=2")){ //1.2.7
                    console.info("segundo!!")
                    final.click()
                    setTimeout(Segundo,250)
                }
                else if(FS(temp,dummy.id)>=0) {
                    setTimeout(Segundo,250)
                }
                else Primero()
            }
            catch(e){
                console.warn("catch segundo")
                console.error(e)
                setTimeout(Segundo,5000)
            }
        }

        WaitElement()

        return temp
    }
    var tabs = getCN("select__tab")
    console.log(tabs)
    let firsttab = tabs[0]
    if(!firsttab.className.includes("active")) firsttab.click()
    function FillTitles(){
        try{
            console.info("Filling Titles")

            let oldr = SafeLoad("reading")
            let oldo = SafeLoad("onhold")
            let oldp = SafeLoad("planto")
            let oldd = SafeLoad("dropped")
            let oldc = SafeLoad("completed")

            function Copiar(arrA,argB){
                let indice = FS(arrA, argB.id)
                if(indice >= 0){
                    arrA[indice].last = argB.last
                    arrA[indice].nextc = argB.nextc
                    arrA[indice].nextl = argB.nextl
                    //1.2
                    if(!arrA[indice].mu) arrA[indice].mu = argB.mu
                    arrA[indice].time = argB.time
                }
            }

            for(let s of seriesdex){
                Copiar(new_c, s)
                Copiar(new_o, s)
                Copiar(new_r, s)
                Copiar(new_d, s)
            }

            function UpdateArrays(old,neww){
                for(let a of neww){
                    let indice = FS(old,a.id)
                    if(indice >= 0) {//1.2
                        let name = a.name
                        a = old[indice]
                        if(old[indice].name != name) a.name = name
                    }
                }
                return neww
            }

            new_r = UpdateArrays(oldr,new_r)
            new_p = UpdateArrays(oldp,new_p)
            new_o = UpdateArrays(oldo,new_o)
            new_d = UpdateArrays(oldd,new_d)
            new_c = UpdateArrays(oldc,new_c)

            SafeSave("reading",new_r)
            SafeSave("planto",new_p)
            SafeSave("onhold",new_o)
            SafeSave("dropped",new_d)
            SafeSave("completed",new_c)
            alert("Done!")
        }
        catch(e){
            console.log("error filling titles")
            console.log(e)
        }
    }
    function NextTab(){
        console.log("next tab")
        for(let x=0; x<tabs.length; x++){
            if(tabs[x].className.includes("active")){
                if(x+1 < tabs.length){
                    tabs[x+1].click()
                    setTimeout(Unbelievable,3000)
                }
                else{
                    console.log("End of loading mangas")
                    FillTitles()
                }
            }
        }
    }
    function Unbelievable(){
        console.log("unbelievable")
        try{
            getCN("flex justify-center flex-wrap gap-2 my-6")[0].children[0]//1.3.4 .click()
        }
        catch(e){
            console.warn("no pagination")
        }

        for(let t of tabs){
            if(t.className.includes("active")){//1.3.4 tab-active
                console.info("checking active tab")
                console.info(t.innerText+":")
                if(t.innerText == "Reading") new_r = Walala()
                if(t.innerText == "Plan To Read") new_p = Walala()
                if(t.innerText == "Completed") new_c = Walala()
                if(t.innerText == "On Hold") new_o = Walala()
                if(t.innerText == "Re-reading"){
                    console.info("who gives a shit lol")
                    NextTab()
                }
                if(t.innerText == "Dropped") {
                    new_d = Walala()
                    console.info("END!!")
                }
            }
        }
    }

    Unbelievable()
}

filling = false

function Loop(){
    try{
        if(disURL != document.URL){
            if(!document.URL.includes("https://mangadex.org/titles/follows")){
                console.log("loop")
                setTimeout(main,5000)
                disURL = document.URL
                trigger = false
                filling = false
            }
            else{
                if(!filling){
                    console.log("preparing to fill")
                    setTimeout(main,5000)
                    disURL = document.URL
                    trigger = false
                    filling = true
                }
            }
        }
    }
    catch(e){
        console.warn("error loop")
    }
    setTimeout(Loop,1000)
}

setTimeout(Loop,1000)

function UpdateSD(arrayname,sd){//1.2
    console.log("updating "+arrayname+"with new changes")
    let array = SafeLoad(arrayname)
    let index = FS(array,sd.id)
    if(index >= 0){
        let nextl = array[index].nextl
        let nextc = array[index].nextc
        let last = array[index].last
        let lastl = array[index].lastl //1.2.8
        let mu = array[index].mu
        let time = array[index].time
        array[index].last = sd.last
        array[index].lastl = sd.lastl //1.2.8
        if(nextl && nextc > sd.last && nextc < sd.nextc){
            console.log("there's a new chapter to consider")
            array[index].nextl = nextl
            array[index].nextc = nextc
        }
        if(sd.lastv){
            array[index].lastv = sd.lastv
            if(sd.nextv) array[index].nextv = sd.nextv
            console.log("volume sorting in consideration")
        }
        if(time){
            if(sd.time && time > sd.time){
                console.log("there was a latter update")
                array[index].time = time
            }
            if(!sd.time){
                console.log("there was no previous time")
                array[index].time = time
            }
        }
        if(mu){
            if(!sd.mu){
                console.log("there was no mangaupdate link before")
                array[index].mu = mu
            }
        }
    }
    else console.log("there's nothing to process??")
    SafeSave(arrayname,array)
    console.log(arrayname+" updated with sd:")
    console.log(array[index])
}

function CompareSD(arrayname,sd){//1.2
    console.log("Comparing SD with "+arrayname)
    let array = SafeLoad(arrayname)
    let index = FS(array,sd.id)
    if(index >= 0){
        let nextl = array[index].nextl
        let nextc = array[index].nextc
        let last = array[index].last
        let lastl = array[index].lastl //1.2.8
        let mu = array[index].mu
        let time = array[index].time
        array[index] = sd
        if(nextl && nextc > sd.last && nextc < sd.nextc){
            console.log("there's a new chapter to consider")
            array[index].nextl = nextl
            array[index].nextc = nextc
        }
        if(last > sd.last){
            console.log("a new last")
            array[index].last = last
            array[index].lastl = lastl //1.2.8
        }
        if(time){
            if(sd.time && time > sd.time){
                console.log("there was a latter update")
                array[index].time = time
            }
            if(!sd.time){
                console.log("there was no previous time")
                array[index].time = time
            }
        }
        if(mu){
            // console.log("mu "+arrayname+": "+mu)
            if(!sd.mu){
                console.log("there was no mangaupdate link before")
                array[index].mu = mu
            }
            else if(sd.mu && mu != sd.mu){
                console.log("mangaupdate link is different... updating it!")
                array[index].mu = mu
            }
        }
        else if(sd.mu){
            console.log(`adding mangaupdate link: ${sd.mu}`)
            array[index].mu = sd.mu
        }
        //1.2.7
        if(sd.split) array[index].split = sd.split
        if(sd.aval) array[index].aval = sd.aval
    }
    else console.log("there's nothing to process??")
    SafeSave(arrayname,array)
    console.log(arrayname+" updated with seriesdex:")
    console.log(array[index])
}

function getCN(classname){//1.2
    return document.getElementsByClassName(classname)
}

function getCN2(nodo,classname){//1.2
    return nodo.getElementsByClassName(classname)
}

function getTAG(nodo,tagname){//1.2
    return nodo.getElementsByTagName(tagname)
}

function SafeSave(item,array){//1.2
    localStorage.setItem(item,JSON.stringify(array))
    console.log(`${item} was saved sucessfully`) //1.2.6
}

function getFstatus(fstatus){//1.2
    let arrayname = null
    if(fstatus == "Reading") arrayname = "reading"
    if(fstatus == "Completed") arrayname = "completed"
    if(fstatus == "Dropped") arrayname = "dropped"
    if(fstatus == "On Hold") arrayname = "onhold"
    if(fstatus == "Plan to Read") arrayname = "planto"
    return arrayname
}

function RevisaNext(nodo){//1.2
    if(nodo.last >= nodo.nextc) nodo = DefaultNext(nodo)
}

function RevisaNext2(nodo,xxx){//1.2
    if(xxx.length == 2){
        if(nodo.last >= xxx[0] || nodo.last >= nodo.nextc) nodo = DefaultNext(nodo)
        if(nodo.nextl == xxx[1] && nodo.nextc != xxx[0]){//1.2.4
            console.log("updated link?")
            nodo.nextc = xxx[0]
        }
        if(xxx[0] > nodo.last && xxx[0] <= nodo.nextc){
            nodo.nextc = xxx[0]
            nodo.nextl = xxx[1]
        }
    }
    else{
        if(xxx[2] > nodo.lastv){
            if(!nodo.nextl){//there's no next chapter registered
                nodo.nextv = xxx[2]
                nodo.nextc = xxx[0]
                nodo.nextl = xxx[1]
            }
            if(nodo.last >= nodo.nextc){//change of volume //1.2.8
                nodo.nextv = xxx[2]
                nodo.nextc = xxx[0]
                nodo.nextl = xxx[1]
            }
        }
        if(xxx[2] == nodo.lastv){
            if(nodo.last >= xxx[0] || nodo.last >= nodo.nextc) nodo = DefaultNext(nodo)
            if(xxx[0] > nodo.last && xxx[0] <= nodo.nextc){
                nodo.nextc = xxx[0]
                nodo.nextl = xxx[1]
                nodo.nextv = xxx[2] //redundant?
            }
        }
    }
}

function DefaultNext(p){//1.2
    let q = p //1.2.2
    q.nextc = MAXNUM
    q.nextl = null
    if(q.lastv) q.nextv = MAXNUM
    return q
}

function CleanFB(nodo){
    let id = getTID(nodo)
    let index = forbidden.indexOf(id)
    if(index >= 0) {
        console.log(`deleting ${id} from forbidden`)
        forbidden.splice(index,1)
        console.log("length: "+forbidden.length)
    }
    // else console.log(`${id} not part of forbidden`)
    SafeSave("forbidden",forbidden)
}

function FBPush(x){//1.2
    if(forbidden.length == 0){ //1.2.7
        console.log(`adding ${x} to forbidden`)
        forbidden.push(x)
    }
    else{
        if(!forbidden.includes(x)){
            console.log(`adding ${x} to forbidden`)
            forbidden.push(x)
        }
        else console.log(`${x} already forbidden`)
    }
    SafeSave("forbidden",forbidden)
}

function SPPush(x){//1.2.7
    console.log("SPPush")
    console.log(x)
    if(getDec(x[2],1) >= 1){
        if(splitchaps.length == 0){
            console.log(`adding ${x} to splitchaps`)
            splitchaps.push(x)
        }
        else{
            if(splitchaps.findIndex(q => q[1] == x[1]) < 0){
                console.log(`adding ${x} to splitchaps`)
                splitchaps.push(x)
            }
            else console.log(`${x} already part of splitchaps`)
        }
        console.log(splitchaps)
        DeMark()
    }
}

function RemoveFromSD(mangaid){//moved 1.2.8 //1.1.3.3
    removedsd = false
    let index = FS(seriesdex,mangaid)
    if(index >= 0) {
        console.log("removed from seriesdex:")
        console.log(seriesdex[index])
        seriesdex.splice(index,1)
        SafeSave("seriesdex",seriesdex)
        removedsd = true
    }
}

//WINDOW FUNCTIONS

window.SC = function(){
    filter = document.getElementById("filter").checked
    SafeSave("filter",filter)
    alert("Changes saved successfully")//1.2
}

window.ReadNext = function(){//1.1.3.3
    console.log("ReadNext")
    FollowsFeed()
    var daModal = document.getElementById("daModal")
    if(!daModal) createModal()
    let reading = SafeLoad("reading")
    let daTable = '<table><tr><th>Name</th><th class="text-align: center;">Unread Chapter</th></tr>'
    for(let s of seriesdex){
        if(s.nextl && s.last < s.nextc){
            let name = s.name
            let currLink = `/chapter/${s.nextl}` //1.2.3
            if(s.nextl && s.nextl.includes(".")) currLink = s.nextl //1.2.3
            if(name == ""){
                let index = FS(reading,s.id)
                if(index >= 0) name = reading[index].name
            }
            if(s.nextc > s.last+1.1) name+=" ‼️"
            daTable+=`<tr><td><a href="/title/${s.id}/${name.replace(/\W\S*/g, '').replaceAll(" ","-")}" target="_blank" rel="noopener noreferrer">${name}</a></td><td><a href="${currLink}" target="_blank" rel="noopener noreferrer">CH. ${s.nextc}</a></td></tr>` //1.3.1 //1.2.5
        }
    }
    daTable+="</table>"
    let closebutton = '<span class="close">&times;</span>'
    daModal.firstChild.innerHTML= closebutton+daTable
    var closebtn = getCN("close")[0]
    closebtn.onclick = function() {
        daModal.style.display = "none"
    }
}

window.DisplayOrphans = function(){//1.2
    FollowsFeed()
    var daModal = document.getElementById("daModal")
    if(!daModal) createModal()
    let reading = SafeLoad("reading")
    let daTable = '<table><tr><th>Name</th><th style="text-align: center;">Unread Chapter</th></tr>'
    for(let o of orphans){
        let name = o.name
        let arl,kink
        if(o.nextc != MAXNUM) {
            //if(o.nextc > o.last+1.1) name+=" ‼️"
            arl = 'CH. '+o.nextc
            kink = ` href="/chapter/${o.nextl}"`
            if(o.nextl && o.nextl.includes(".")) kink = ` href="${o.nextl}"` //1.2.3
        }
        else {
            arl = '🚫'
            kink = ''
        }
        daTable+=`<tr><td><a href="/title/${o.id}/${name.replace(/\W/g, '').replaceAll(" ","-")}" target="_blank" rel="noopener noreferrer">${name}</a></td><td style="text-align: center;"><a${kink}>${arl}</a></td></tr>` //1.3.1
    }
    daTable+="</table>"
    let closebutton = '<span class="close">&times;</span><p>The following series aren\'t part of any list, they\'re just marked to be notified, visit their title page to add them to a list (like Reading, for example)</p>'
    daModal.firstChild.innerHTML= closebutton+daTable
    var closebtn = getCN("close")[0]
    closebtn.onclick = function() {
        daModal.style.display = "none"
    }
}

window.NMDF = function(){//1.1.3.3
    let fcheck,ycheck
    function Checkear(a){//1.2
        if(a) return " checked"
        else return ""
    }
    fcheck = Checkear(filter)
    ycheck = Checkear(pikapika)
    var daModal = document.getElementById("daModal")
    if(!daModal) createModal()
    let closebutton = '<span class="close" onclick="Close()">&times;</span>'
    let d1 = `<label><input type="checkbox" id="filter"${fcheck}> Filter by groups</label><details><summary>Description</summary><p>You can filter chapters by adding certain groups to a blacklist (so it\'s hidden) or whitelist (so it only shows that group releases), by clicking at the 🔧 besides the title. This only applies to 1 series at a time.</p></details>`
    let d2 = ''
    let body = `<h2>New MangaDex Follows Script Settings</h2>${d1+d2}<button id="nmdf_save" onclick="SC()" style="background-color: orangered;padding: 0.5rem;margin: 0.5rem;">Save Changes</button><button id="nmdf_exit" onclick="Close()">Exit</button>`
    let series = '<hr><button onclick="ReadNext()" style="padding: 0.5rem;background-color: var(--md-primary);">Check unread chapters</button><button onclick="ShowSD()" style="padding: 0.5rem;background-color: var(--md-secondary);margin: 0.5rem;">Check notification list</button>'

    function FindOrphans(){//1.2
        console.log("searching for orphans")
        let com = SafeLoad("completed")
        let ptr = SafeLoad("planto")
        let dro = SafeLoad("dropped")
        let rea = SafeLoad("reading")
        let onh = SafeLoad("onhold")

        let x = 0
        for(let s of seriesdex){
            let z = 0
            for(let y of [com,ptr,dro,rea,onh]) if(FS(y,s.id)>=0) z++
            if(z==0){
                console.log("an orphan!")
                console.log(s)
                if(FS(orphans,s.id) < 0) orphans.push(s)
                x++
            }
        }
        return x
    }

    if(FindOrphans()) series+='<button onclick="DisplayOrphans()">Orphan series</button>' //1.2
    daModal.firstChild.innerHTML= closebutton+body+series
    daModal.style.display = "block"
    if(unchecked){
        window.onclick = function(event) {
            var daModal = document.getElementById("daModal")
            if (event.target == daModal) {
                daModal.style.display = "none"
            }
        }
        unchecked = false
    }
}

window.Close = function(){
    document.getElementById("daModal").style.display = "none"
}

window.NMDFilter = function(event){
    if(document.URL.includes("/title/")) main()
    var daElement = event.target.parentElement.parentElement
    if(document.URL.includes("/title/")) daElement = document.getElementsByClassName(classChapter)[0].parentElement.parentElement.parentElement.parentElement.parentElement //1.3.2
    preevent = event //1.1.3.3
    var daModal = document.getElementById("daModal")
    let ttext
    let gtext = []
    let glink = []
    let id = getTID(daElement)
    if(document.URL.includes("/title/")) {
        id = getID3(document.URL)
        ttext = getCN("mb-1")[1].innerText //1.3.2
    }
    let daSeries = seriesdex[FS(seriesdex,id)]
    for(let link of getTAG(daElement,"a")){
        if(link.innerText != ""){
            console.debug(link) //1.3.2
            if(link.href.includes("/title/")) ttext = link.innerText.replaceAll("\n","")
            if(link.href.includes("/group/")) {
                if(!gtext.includes(link.innerText.replaceAll("\n",""))){
                    gtext.push(link.innerText.replaceAll("\n",""))
                    glink.push(link.href)
                }
            }
        }
    }
    let gtags = getCN2(daElement,chapterelement)
    for(let g of gtags){
        if(g.innerText.includes("No Group")){
            gtext.push("No Group")
            glink.push("0/0/0/0/0/0")
            break
        }
    }

    if(!daModal) createModal()
    let closebutton = '<span class="close" onclick="Close()">&times;</span>'
    let series = `<p id="${id}">SERIES NAME: ${ttext}</p>`
    if(document.URL.includes("/title/")){//1.2
        fstatus = getCN(loadedp)[0].firstChild.innerText //following status
        series+="<p>Status: "+fstatus.toUpperCase()+"</p>"
        let arrayname = getFstatus(fstatus)
        let temp
        if(arrayname != "planto") temp = SafeLoad(arrayname)
        daSeries = temp[FS(temp,id)]
    }
    if(daSeries.mu) series+=`<a href="https://www.mangaupdates.com/series.html?id=${daSeries.mu}" target="_blank" rel="noopener noreferrer">🔗 MangaUpdates Link 🔗</a>` //1.3.1
    if(daSeries.name == "") seriesdex[FS(seriesdex,id)].name = ttext
    let lastext = daSeries.last
    let lastvol = ""
    if(daSeries.lastv) {
        lastvol = "Vol "+daSeries.lastv
        lastext = " Ch "+daSeries.last //1.2
    }
    let nextext = daSeries.nextc
    if(daSeries.nextv) nextext = `Vol. ${daSeries.nextv} Ch. ${daSeries.nextc}`
    let nextlink = ''
    if(!!daSeries.nextl && !daSeries.nextl.includes(".")) nextlink = ` href="https://mangadex.org/chapter/${daSeries.nextl}"`
    if(daSeries.nextl && daSeries.nextl.includes(".")) nextlink = ` href="${daSeries.nextl}"` //1.2.3
    console.log(lastext)
    if(daSeries.last == MINNUM || daSeries.last == "-10" || JSON.parse(daSeries.last) == null) {
        lastext = "Not registered"
        nextext = "Not registered"
    }
    let last = `<div><span>Last chapter read: ${lastext}</span><button onclick="NewLast(event)">✍️</button></div>`
    let split = `<div><span>Split chapters?: </span><button onclick="SplitThis(event)">🪚</button></div>`
    if(daSeries.split) split = `<div><span>Split parts: ${daSeries.split}</span><button onclick="SplitThis(event)">🪚</button></div>`
    if(daSeries.lastv) last = `<div><span>Last chapter read: ${lastvol}</span><button onclick="NewLastV(event)">✍️ </button><span>${lastext}</span><button onclick="NewLast(event)">✍️</button></div>`
    if(nextext == MAXNUM) nextext = "Up to date"
    let next = `<div><a${nextlink}>Next chapter: ${nextext}</a><button onclick="ReloadFF()">⟳</button></div>`
    let groups = '<p>Groups:</p>'
    let daTable = '<table><tr><th>Name</th><th style="text-align: center;">Whitelisted</th><th style="text-align: center;">Blacklisted</th></tr>'//1.1.3.3
    for(let w=0;w<gtext.length;w++){
        let gid = getID3(glink[w])
        let wcheck = ""
        let bcheck = ""
        if(OnlyThis(id,[gid])==2) {
            wcheck = "checked"
            console.log(gtext[w]+" whitelisted")
        }
        if(HideThis(id,[gid])) {
            bcheck = "checked"
            console.log(gtext[w]+" blacklisted")
        }
        daTable+=`<tr><td><a href="https://mangadex.org/group/${gid}/" target="_blank" rel="noopener noreferrer">${gtext[w]}</a></td><td style="text-align: center;"><input type="checkbox" id="wl${w}" name="wl${w}" ${wcheck}></td><td style="text-align: center;"><input type="checkbox" id="bl${w}" name="bl${w}" ${bcheck}></td></tr>`//1.3.1 //1.1.3.
    }
    daTable+="</table>"
    let savebtn = '<div style="text-align: right;"><button onclick="SaveFilter(event)" style="margin: 0.5rem;">SAVE CHANGES</button></div>'

    daModal.firstChild.innerHTML= closebutton+series+next+last+split+groups+daTable+savebtn
    daModal.style.display = "block"
    if(unchecked){
        window.onclick = function(event) {
            var daModal = document.getElementById("daModal")
            if (event.target == daModal) {
                daModal.style.display = "none"
            }
        }
        unchecked = false
    }
}

window.ResetThis = function(event){//1.2.9
    if(document.URL.includes("/title/")){
        if(confirm(`Are you sure you want you reset this series' stored data?`)){//1.3
            console.log("Resetting")
            let nodo = event.target.parentElement.parentElement
            let id = nodo.children[1].id
            let temp = DefaultObj()
            temp.id = id
            let pseries = FS(seriesdex,id)
            let split = seriesdex[pseries].split //1.3
            seriesdex[pseries] = temp
            if(split) temp.split = split //1.3
            SafeSave("seriesdex",seriesdex)
            let fstatus = getCN(loadedp)[0].firstChild.innerText //following status
            if(fstatus == "Reading"){
                console.log("Resetting READING")
                let temp2 = SafeLoad("reading")
                let ptemp = FS(temp2,id)
                let thisSD = seriesdex[pseries]
                temp2[ptemp].id = thisSD.id
                temp2[ptemp].last = thisSD.last
                temp2[ptemp].mu = thisSD.mu
                temp2[ptemp].name = thisSD.name
                temp2[ptemp].nextc = thisSD.nextc
                temp2[ptemp].nextl = thisSD.nextl
                temp2[ptemp].time = thisSD.time
                if(split) temp2[ptemp].split = thisSD.split //1.3
                console.log(temp2[ptemp])
                SafeSave("reading",temp2)
            }
            else console.log(`Not READING, fstatus: ${fstatus}`)
            ReloadFF()
        }
    }
    else alert("To reset your data for this series go to its title page")

}

window.SaveFilter = function(event){
    let nodo = event.target.parentElement.parentElement
    if(document.URL.includes("/title/")) nodo = document.getElementById("daModal") //1.3.2

    function AddtoArray(array,id,gid){
        if(array.findIndex(q => q[0] == id && q[1] == gid) < 0) array.push([id,gid])
        return array
    }

    function RemoveFromArray(array,id,gid){
        let index = array.findIndex(q => q[0] == id && q[1] == gid)
        if(index >= 0) {
            array.splice(index,1)
            alert("Removed from the list")
        }
        return array
    }
    let count = 0
    let latabla = getTAG(nodo,"table")[0] //1.2
    for(let j of latabla.firstChild.children){
        if(j.cells[2].firstChild.checked) count++
    }
    if(count > 1){
        alert("There can only be one whitelisted group per series. If you want to block more than one group then you should add them to the blacklist")
    }
    else{
        for(let x=1; x<latabla.firstChild.childElementCount; x++){//1.2
            let gid = getGID(latabla.firstChild.children[x].cells[0]) //1.3.2 //1.1.3.3 getTID
            let wl = JSON.parse(latabla.firstChild.children[x].cells[1].firstChild.checked)
            let bl = JSON.parse(latabla.firstChild.children[x].cells[2].firstChild.checked)
            let id = 0 //1.3.2
            if(document.URL.includes("/title/")) id = getTID(document.URL)
            else id = nodo.children[1].id
            if(wl&&bl) alert("It can't be part of both lists")
            else if(wl) {
                whitelist = AddtoArray(whitelist,id,gid)
                alert("Whitelisted")
            }
            else if(bl) {
                blacklist = AddtoArray(blacklist,id,gid)
                alert("Blacklisted")
            }
            if(!wl) whitelist = RemoveFromArray(whitelist,id,gid)
            if(!bl) blacklist = RemoveFromArray(blacklist,id,gid)
        }
        SafeSave("whitelist",whitelist)
        SafeSave("blacklist",blacklist)
        alert("Changes saved successfully!") //1.3.2
    }
}

window.NewLast = function(event){//1.1.3.3
    LoadSD()
    var daElement = event.target.parentElement.parentElement
    // var daElement = event.target
    // while(daElement.tagName != "TR") daElement = daElement.parentElement
    var newvalue = prompt("Enter a new value for last read","1")
    var id = getTAG(daElement,"p")[0].id

    function Proceso(newvalue,i){
        if(i>=0){
            seriesdex[i].last = newvalue*1
            if(seriesdex[i].last >= seriesdex[i].nextc) seriesdex[i] = DefaultNext(seriesdex[i])
            if(document.URL.includes("/title/")){//1.2
                if(getCN(loadedp).length){
                    UpdateSD(getFstatus(getCN(loadedp)[0].firstChild.innerText),seriesdex[i])
                }
            }
            console.log("seriesdex entry:")
            console.log(seriesdex[i])
            SafeSave("seriesdex",seriesdex) //1.1.3.3
            ReloadFF()//1.1.3.3
        }
        else{
            if(document.URL.includes("/title/")){
                if(getCN(loadedp).length){
                    let arrayname = getFstatus(getCN(loadedp)[0].firstChild.innerText)
                    let temp = SafeLoad(arrayname)
                    let j = FS(temp,id)
                    temp[j].last = newvalue*1
                    if(temp[j].nextl && temp[j].nextc <= newvalue*1) temp[j] = DefaultNext(temp[j])
                    SafeSave(arrayname,temp)
                }
            }
            else console.log("error NewLast")
        }
    }

    if(Number.isNaN(newvalue*1)) alert("Enter a number!")
    else if(!newvalue){
        console.log("cancel by user")
    }
    else {
        console.log("New Last!")
        newvalue*=1
        let i = FS(seriesdex,id)
        if(newvalue < seriesdex[i].last){
            if(confirm("The new value is lower than the last one read, are you sure you want to set it to "+newvalue+"?")) Proceso(newvalue,i)
        }
        else{
            Proceso(newvalue,i)
        }
    }
}

window.NewLastV = function(event){//1.2
    LoadSD()
    var daElement = event.target.parentElement.parentElement
    var newvalue = prompt("Enter a new value for last vol","1")
    var id = getTAG(daElement,"p")[0].id
    if(Number.isNaN(newvalue*1)) alert("Enter a number!")
    else if(!newvalue){
        console.log("cancel by user")
    }
    else {
        console.log("New LastV!")
        newvalue*=1
        let i = FS(seriesdex,id)
        if(i >= 0){
            seriesdex[i].lastv = newvalue*1
            if(seriesdex[i].last >= seriesdex[i].nextc) seriesdex[i] = DefaultNext(seriesdex[i])
            if(document.URL.includes("/title/")){//1.2
                if(getCN(loadedp).length){
                    UpdateSD(getFstatus(getCN(loadedp)[0].firstChild.innerText),seriesdex[i])
                }
            }
            console.log("seriesdex entry:")
            console.log(seriesdex[i])
            SafeSave("seriesdex",seriesdex) //1.1.3.3
        }
        else{
            if(document.URL.includes("/title/")){
                if(getCN(loadedp).length){
                    let arrayname = getFstatus(getCN(loadedp)[0].firstChild.innerText)
                    let temp = SafeLoad(arrayname)
                    let j = FS(temp,id)
                    temp[j].lastv = newvalue
                    if(temp[j].nextv && temp[j].nextv < newvalue) temp[j] = DefaultNext(temp[j])
                    SafeSave(arrayname,temp)
                }
            }
            else console.log("error NewLastV")
        }

        ReloadFF()//1.1.3.3
    }
}

window.SplitThis = function(event){//1.2.7
    LoadSD()
    var daElement = event.target.parentElement.parentElement
    var newvalue = prompt("Enter a new value for split parts","2")
    var id = getTAG(daElement,"p")[0].id

    function Proceso(newvalue,i){
        if(i>=0){
            if(newvalue*1 >= 0) seriesdex[i].split = newvalue*1
            if(document.URL.includes("/title/")){
                if(getCN(loadedp).length){
                    UpdateSD(getFstatus(getCN(loadedp)[0].firstChild.innerText),seriesdex[i])
                }
            }
            console.log("seriesdex entry:")
            console.log(seriesdex[i])
            SafeSave("seriesdex",seriesdex)
            ReloadFF()
        }
        else{
            if(document.URL.includes("/title/")){
                if(getCN(loadedp).length){
                    let arrayname = getFstatus(getCN(loadedp)[0].firstChild.innerText)
                    let temp = SafeLoad(arrayname)
                    let j = FS(temp,id)
                    temp[j].split = newvalue*1
                    SafeSave(arrayname,temp)
                }
            }
            else console.error("error SplitThis")
        }
    }

    if(Number.isNaN(newvalue*1)) alert("Enter a number!")
    else if(!newvalue){
        console.log("cancel by user")
    }
    else {
        console.log("Split This!")
        newvalue*=1
        let i = FS(seriesdex,id)
        if(newvalue <= 1){
            if(confirm(`The new value is lower than 2, which would cancel the splitting, are you sure you want to set it to ${newvalue}?`)) Proceso(newvalue,i)
        }
        else{
            Proceso(newvalue,i)
        }
    }
}

window.ReloadFF = function(){
    main()
    //FollowsFeed()
    NMDFilter(preevent)
}

window.ShowSD = function(){//1.1.3.3
    console.log("ShowSD")
    FollowsFeed()
    var daModal = document.getElementById("daModal")
    if(!daModal) createModal()
    let reading = SafeLoad("reading")
    let daTable = '<table><tr><th>Name</th><th style="text-align: center;">Last Read</th><th style="text-align: center;">Next Chapter</th></tr>'
    for(let s of seriesdex){
        let name = s.name
        if(name == ""){
            let index = FS(reading,s.id)
            if(index >= 0) name = reading[index].name
        }
        if(s.nextc != MAXNUM && s.nextc > s.last+1.1) name+=" ‼️"
        let lastone = s.last
        if(lastone < 0 || lastone == null) lastone = '🚫'
        let nextone, nextlink
        if(s.nextl == null || s.nextl == "") {
            nextlink = ''
            nextone = '🚫'
        }
        else {
            nextlink = ` href="/chapter/${s.nextl}"`
            if(s.nextl.includes(".")) nextlink = ` href="${s.nextl}"` //1.2.3
            nextone = 'CH. '+s.nextc
        }
        daTable+=`<tr><td><a href="/title/${s.id}/${name.replace(/\W/g, '').replaceAll(" ","-")}" target="_blank" rel="noopener noreferrer">${name}</a></td><td style="text-align: center;"><span>${lastone} </span><button onclick="NewLast2(event)">✍️</button></td><td style="text-align: center;"><a${nextlink}>${nextone}</a></td></tr>` //1.3.1
    }
    daTable+="</table>"
    let closebutton = '<span class="close">&times;</span>'
    daModal.firstChild.innerHTML= closebutton+daTable
    var closebtn = getCN("close")[0]
    closebtn.onclick = function() {
        daModal.style.display = "none"
    }
}

window.NewLast2 = function(event){//1.1.3.3
    LoadSD()
    var daElement = event.target
    while(daElement.tagName != "TR") daElement = daElement.parentElement //1.2
    var newvalue = prompt("Enter a new value for last read","1")
    var id = getTID(daElement)
    let sid = FS(seriesdex,id) //1.2
    if(Number.isNaN(newvalue*1)) alert("Enter a number!")
    else if(!newvalue){
        console.log("cancel by user")
    }
    else {
        console.log("New Last2!")
        function McCloud(arraynode){//1.2
            arraynode.last = newvalue*1
            if(arraynode.last >= arraynode.nextc) arraynode = DefaultNext(arraynode)
            return arraynode
        }
        seriesdex[sid] = McCloud(seriesdex[sid])

        console.log(seriesdex[sid])
        SafeSave("seriesdex",seriesdex) //1.1.3.3
        FollowsFeed()
        //1.2
        let arrays = ["reading","completed","planto","onhold","dropped"]
        for(let a of arrays){
            let temp = SafeLoad(a)
            let index = FS(temp,seriesdex[sid].id)
            if(index >= 0){
                temp[index] = McCloud(temp[index])
                SafeSave(a,temp)
            }
        }
        ShowSD() //1.2
    }
}

window.NewLast3 = function(event){//1.2
    LoadSD()
    var daElement = event.target
    while(daElement.tagName != "TR") daElement = daElement.parentElement
    var newvalue = prompt("Enter a new value for last read","1")
    var id = getTID(daElement)

    if(Number.isNaN(newvalue*1)) alert("Enter a number!")
    else if(!newvalue){
        console.log("cancel by user")
    }
    else {
        console.log("New Last3!")
        let stat = getTAG(daElement,"td")[2].innerText
        let temp = []
        let sid = FS(seriesdex,id)
        let arrayname = getFstatus(stat) //1.2
        temp = SafeLoad(arrayname)
        let tid = FS(temp,id)

        function UpdateData(array,index){
            array[index].last = newvalue*1
            if(array[index].last >= array[index].nextc) array[index] = DefaultNext(array[index])
        }

        if(sid >= 0) {
            UpdateData(seriesdex,sid)
            console.log("seriesdex entry:")
            console.log(seriesdex[sid])
        }
        UpdateData(temp,tid)
        console.log(arrayname+" entry:")
        console.log(temp[tid])
        SafeSave("seriesdex",seriesdex) //1.1.3.3
        SafeSave(arrayname,temp) //1.2
        main() //1.2
    }
}

window.FS = function(array,number){//for debugging
    FS(array, number)
}

window.FF = function(){//for debugging
    FollowsFeed()
}

//THE MAIN FUNCTION
function main(){
    let logo = "ml-2 md:ml-4 cursor-pointer bg-accent rounded-full flex items-center justify-center" //1.3.4
    console.log("main")
    if(getCN(logo).length && getCN(logo)[0].firstChild.tagName == "IMG"){//is logged
        LoadSD()
        frutyloop = false
        if(document.URL.includes("https://mangadex.org/titles/follows")){
            console.log("Script ready")

            function EsperaBotones(){
                try{
                    let botones = getTAG(getCN("px-6 mb-4 mt-2")[0],"a")
                    }
                catch(e){
                    setTimeout(EsperaBotones,500)
                }
            }

            EsperaBotones()

            document.Fill = function(){
                console.log("Loading series...")
                alert("Please wait until the next alert, this can take several minutes depending of how many series you follow.")
                Llenar2()
            }

            function NewButton(){//moved - 1.2
                try{
                    let newb = document.createElement("button")
                    newb.innerHTML = '<button id="fill-btn" data-v-621772ff="" type="button" class="bg-primary v-btn v-btn--is-elevated v-btn--has-bg theme--dark v-size--default"><span class="v-btn__content"><span data-v-621772ff="" aria-hidden="true" class="v-icon notranslate theme--dark" onclick="Fill()"><a>FILL</a></span></span></button>'
                    if(!document.getElementById("fill-btn")) getCN("controls mb-auto ml-auto")[0].appendChild(newb)

                    let titulo = getCN("flex items-center mb-6 mt-2")[0]
                    let dl = cloneDOM('div',titulo)//document.createElement("div")
                    dl.id="dlbtn"
                    dl.innerHTML='<button class="rounded relative md-btn flex items-center px-3 my-6 justify-center text-white bg-primary hover:bg-primary-darken active:bg-primary-darken2 glow px-4 px-6" onclick="DownloadCSV()" style="margin-left: 0.5rem;margin-right: 1rem;background-color: var(--md-primary);border-width: 0.5rem;border-color: var(--md-primary);">Download CSV</button><button class="rounded relative md-btn flex items-center px-3 my-6 justify-center text-white bg-primary hover:bg-primary-darken active:bg-primary-darken2 glow px-4 px-6" onclick="DownloadJSON()" style="margin-left: 0.5rem;margin-right: 1rem;background-color: var(--md-primary);border-width: 0.5rem;border-color: var(--md-primary);">Download JSON</button>'
                    if(!!!document.getElementById("dlbtn") && !!dl) titulo.insertAdjacentElement('afterend',dl)
                }
                catch(e){
                    setTimeout(NewButton,500)
                }
            }
            if(!document.getElementById("dlbtn")) NewButton()
        }

        if(document.URL.includes("mangadex.org/titles/feed")){
            console.log("checking feed")
            function ScriptForm(){//moved - 1.2
                if(document.URL.includes("https://mangadex.org/titles/feed") && !document.getElementById("script_btn")){
                    console.log("executing ScriptForm")
                    var options_loc = "flex items-center mb-6" //1.2.8
                    if(getCN(options_loc).length){
                        var newButton = newInner("div","",'<button id="script_btn" onclick="NMDF()" style="right: 2rem;position: absolute;">📜 SCRIPT SETTINGS</button>')
                        getCN(options_loc)[0].append(newButton.children[0])
                        console.log("form added")
                    }
                    else setTimeout(ScriptForm,500)
                }
            }
            follows = []
            ScriptForm()

            if(getCN(feedone).length) FollowsFeed()
            else {//1.3.3
                console.log("waiting for FollowsFeed")
                setTimeout(main,2000)
            }
        }

        if(document.URL.includes("mangadex.org/title/")){
            console.log("Checking a series")
            var fstatus
            whitelist = SafeLoad("whitelist")
            blacklist = SafeLoad("blacklist")
            var chgrid = "chapter-grid"
            var id_series = getID3(document.URL)//moved 1.2.8 //1.2 //document.URL.split("/")[4]
            function UpdatingSeriesData(){
                var toConsider = ["Reading","Completed","On Hold","Dropped","Added To Library"]
                let timestamp = 0 //1.2
                let mu = 0 //1.2
                fstatus = getCN(loadedp)[0].firstChild.innerText //following status
                if(getCN(loadedp).length && getCN(chgrid).length){//if page is loaded
                    console.log("loaded")
                    var toProcess = false
                    let daIndex = FS(seriesdex,id_series)
                    var daLast = MINNUM
                    if(daIndex >= 0) daLast = seriesdex[daIndex].last
                    var daLastV = null
                    var daNext,daNLink,lastl //1.2.7
                    DefNext()
                    var nextvol = MAXNUM
                    var tags = getCN("tag bg-accent")
                    var volChange = getCN("col-span-4")
                    var sus = false
                    let prevvol = null
                    console.log("fstatus: "+fstatus)
                    if(fstatus == ""){
                        setTimeout(UpdatingSeriesData,500)
                        return
                    }
                    for(let x of getTAG(getCN("readmore")[0],"a")){//1.2
                        if(x.href.includes("mangaupdates")) mu = x.href.split("=")[1]*1
                    }

                    function GetChapter(dc,dv){//1.2
                        let current
                        if(dc.innerText.includes("BLOCKED (")) return 0 //1.3.4
                        if(dc.innerText.toLowerCase().includes("oneshot")) current = 0 //1.1.3.3
                        else if(dc.innerText.includes("Ch.")) current = GetNumero(dc.innerText)
                        else {
                            let turkey = dc.parentElement
                            while(!turkey.innerText.includes("Chapter ") && turkey != dv) turkey = turkey.parentElement
                            if(turkey.innerText.includes("Volume ")) current = 0
                            else current = GetNumero(turkey.innerText)
                        }
                        return current
                    }

                    function DefNext(){//1.2
                        daNext = MAXNUM
                        daNLink = null
                    }

                    function getVol(txt){//moved 1.2.5
                        let temp = txt.replaceAll("\n"," ").replaceAll("\t"," ")
                        for(let t of temp.split(" ")){
                            if(Number.isFinite(t*1)) return t*1
                        }
                        return 0
                    }

                    if(!sus){
                        for(let v of document.getElementsByClassName("grid grid-cols-12 volume-head mb-2")){
                            if(v.innerText.includes("No Volume")){
                                console.log("volume sorting doesn't apply!")
                                break
                            }
                            if((v.innerText.includes("Ch. 1 -") || v.innerText.includes("Ch. 0 -")) && getVol(v.innerText) > 1){
                                console.log("SUS!")
                                sus = true
                                break
                            }
                        }
                    }

                    function Apoo(){
                        if(toConsider.includes(fstatus)){//(fstatus == "Reading"){
                            console.log("reading series:")
                            console.log(seriesdex[daIndex])
                            toProcess = true
                            let continuar = true //1.2

                            function DefaultProcess(dv,dc,current,currvol){//1.2
                                let cid = getTID(dc)
                                if(forbidden.includes(cid)){//if chapter is marked as forbidden
                                    console.log("forbidden chapter "+cid)
                                    if((!HideThis(id_series,getGID(dc)) || OnlyThis(id_series,getGID(dc))==2) && OnlyThis(id_series,getGID(dc))!=1 && HasBeenRead(dc) == false){//1.2.5
                                        CleanFB(dc)
                                    }
                                    else if(GetChapter(dc,dv) > seriesdex[daIndex].last) getTAG(dc,"svg")[0].style.color = "red"
                                    else{
                                        if(getTAG(dc,"svg")[0].style.color) getTAG(dc,"svg")[0].style.removeProperty("color")
                                        CleanFB(dc)
                                    }
                                    if(seriesdex[daIndex].nextl == cid) {
                                        seriesdex[daIndex] = DefaultNext(seriesdex[daIndex]) //if it's stored as next one, ignore it
                                    }
                                }
                                else if(HasBeenRead(dc) == false){//1.3
                                    if((!HideThis(id_series,getGID(dc)) || OnlyThis(id_series,getGID(dc))==2) && OnlyThis(id_series,getGID(dc))!=1 && HasBeenRead(dc) == false && daNext >= current && daNext > daLast && current > daLast){
                                        daNext = current
                                        console.log("daNext: "+daNext)
                                        daNLink = cid//getTID(dc)
                                        console.log("daNLink: "+daNLink)
                                    }
                                    else if((HideThis(id_series,getGID(dc)) || OnlyThis(id_series,getGID(dc))==1) && HasBeenRead(dc) == false){// && daNext > current && daNext > daLast){//not consider if it's blacklisted
                                        if(daNext >= current && daNext > daLast && current > daLast){//1.2
                                            FBPush(cid)
                                        }
                                        if(current <= daLast){ //check for a forbidden chapter that can be ignored
                                            console.log(`ignore ${cid} for forbidden`)
                                            CleanFB(dc)
                                        }
                                        if(daIndex >= 0 && cid == seriesdex[daIndex].nextl){//ignores a next chapter if it's blacklisted
                                            console.log("reseting daNext")
                                            DefNext()
                                        }
                                    }
                                }
                                else if(!(HideThis(id_series,getGID(dc)) || OnlyThis(id_series,getGID(dc))==1) && HasBeenRead(dc) == true){//1.3
                                    if(cid == seriesdex[daIndex].lastl) {
                                        if(current != last){
                                            ResetLast(id_series,{id:current,l:cid})
                                        }
                                        let thistmp = (new Date(getTAG(dc,"time")[0].dateTime)).getTime()
                                        if(thistmp > timestamp) timestamp = thistmp
                                        if(daNext <= daLast) {
                                            DefNext()
                                        }
                                        console.log("found a last one: "+daLast)
                                    }
                                    if(daLast < current){
                                        daLast = current
                                        let thistmp = (new Date(getTAG(dc,"time")[0].dateTime)).getTime()
                                        if(thistmp > timestamp) timestamp = thistmp
                                        if(daNext <= daLast) {
                                            DefNext()
                                        }
                                        console.log("found a last one: "+daLast)
                                    }
                                }
                                else CleanFB(dc)
                            }

                            function VolProcess(dv,dc,current,currvol){//1.2
                                function ASSign(){
                                    daNext = current
                                    console.log("daNext: vol "+currvol+" chap "+daNext)
                                    daNLink = getTID(dc)
                                    console.log("daNLink: "+daNLink)
                                }

                                function FoundLast(){
                                    daLast = current
                                    lastl = getTID(dc) //1.2.7
                                    let thistmp = (new Date(getTAG(dc,"time")[0].dateTime)).getTime()
                                    if(thistmp > timestamp) timestamp = thistmp
                                    if(daNext <= daLast) DefNext()
                                    console.log("found a last one: "+daLast)
                                }

                                if(HasBeenRead(dc) == true){
                                    console.log("sus checking vol "+GetNumero(dv.parentElement.innerText)+" ch "+current)
                                    if(currvol > daLastV){
                                        daLastV = currvol
                                        FoundLast()
                                    }
                                    else if(currvol == daLastV){
                                        if(daLast < current) FoundLast()
                                    }
                                    //currvol < daLastV are irrelevant
                                }
                                else{//unread chapters
                                    let cid = getTID(dc)
                                    if((!HideThis(id_series,getGID(dc)) || OnlyThis(id_series,getGID(dc))==2) && OnlyThis(id_series,getGID(dc))!=1){//to consider
                                        if(daLastV == currvol && daNext >= current && daNext > daLast) ASSign()
                                        else if(daLastV < currvol && nextvol >= daLastV){
                                            if(nextvol > currvol) {
                                                nextvol = currvol
                                                ASSign()
                                            }
                                            else if(nextvol == currvol) ASSign()
                                        }
                                    }
                                    else if((HideThis(id_series,getGID(dc)) || OnlyThis(id_series,getGID(dc))==1)){// && daNext > current && daNext > daLast){//not consider if it's blacklisted
                                        if(daNext >= current && daNext > daLast){//1.2
                                            FBPush(cid)
                                            if(daIndex >= 0 && cid == seriesdex[daIndex].nextl){//ignores a next chapter if it's blacklisted
                                                console.log("reseting daNext")
                                                DefNext()
                                            }
                                        }
                                        if(current < daLast) {
                                            console.log(`${cid} can be ignored (sus)`)
                                            CleanFB(dc)
                                            dc.style.removeProperty("color")
                                        }
                                    }
                                }
                            }

                            function Splitter(){//1.2.7
                                let markit = true
                                if(daIndex >= 0) for(let dv of getCN("rounded flex flex-col gap-2")){
                                    for(let dc of getCN2(dv,chgrid)){
                                        let current = GetChapter(dc,dv)
                                        let currvol = getVol(dv.parentElement.innerText)
                                        if(seriesdex[daIndex].split == getDec(current,1)){
                                            markit = false
                                            DeMark()
                                        }
                                        if(markit && HasBeenRead(dc) == false) SPPush([seriesdex[daIndex].id,getTID(dc),current])
                                        else if(!markit) DeMark()
                                    }
                                }
                            }

                            if(daIndex >= 0) for(let dv of getCN("rounded flex flex-col gap-2")){
                                for(let dc of getCN2(dv,chgrid)){
                                    let current = GetChapter(dc,dv)
                                    let currvol = getVol(dv.parentElement.innerText) //1.2.5
                                    if(sus) VolProcess(dv,dc,current,currvol)
                                    else DefaultProcess(dv,dc,current,currvol) //1.2
                                }
                            }
                            return true
                        }
                        return false
                    }
                    function UpdateStorage(obj,item){//1.1.3.3
                        let temp = SafeLoad(item) //1.2
                        let index = FS(temp,obj.id)
                        if(index >= 0){//1.2
                            console.log("it's part of "+item)
                            console.log(obj)
                            if(obj.nextl && !document.body.innerHTML.includes(obj.nextl)){//1.2.7
                                console.log(`next chapter (${obj.nextc}) unavailable`)
                                obj.nextc = MAXNUM
                                obj.nextl = null
                            }
                            if(obj.name == "MangaDex") obj.name = temp[index].name
                            if(obj.last >= temp[index].last){
                                console.log("new last is equal or greater than last registered")
                                console.log("old: "+temp[index].last)
                                console.log("new: "+obj.last)
                                if(obj.lastv == temp[index].lastv) {
                                    temp[index] = obj
                                    console.log("same volume, new chapter")
                                }
                                if(obj.lastv && temp[index].lastv && obj.lastv >= temp[index].lastv) {
                                    temp[index] = obj
                                    console.log("new volume")
                                }
                                if(!obj.lastv && temp[index].lastv){
                                    temp[index] = obj
                                    console.log("was stored as volume but it shouldn't")
                                }
                                if(!temp[index].lastv){
                                    temp[index] = obj
                                    if(obj.lastv) console.log("now consider with volume sorting")
                                    else console.log("no volume sorting")
                                }
                            }
                            else{
                                console.log("new last is lower than last registered, checking for volume sorting")
                                if(temp[index].lastv && obj.lastv && temp[index].lastv <= obj.lastv) {
                                    temp[index] = obj
                                    console.log("new volume")
                                }
                                if(!temp[index].nextv && obj.nextv) {
                                    temp[index] = obj
                                    console.log("new chapter")
                                }
                                if(temp[index].nextv && obj.nextv && temp[index].nextv < obj.nextv) {
                                    temp[index] = obj
                                    console.log("new unread chapter on new volume")
                                }
                                if(obj.nextl && temp[index].last < obj.nextc){
                                    temp[index].nextc = obj.nextc
                                    temp[index].nextl = obj.nextl
                                    console.log("new unread chapter but earlier last read")
                                }
                                if(!obj.nextl){
                                    temp[index].nextc = obj.nextc
                                    temp[index].nextl = obj.nextl
                                    console.log("no next unread chapter")
                                }
                                if(obj.mu && !temp[index].mu){
                                    temp[index].mu = obj.mu
                                    console.log("added mangaupdates link")
                                }
                                if(!temp[index].time && obj.time){
                                    temp[index].time = obj.time
                                    console.log("added update time")
                                }
                            }
                            RevisaNext(temp[index])
                        }
                        else{//if(index == -1)
                            temp.push(obj)
                            console.log("added to "+item+"!")
                        }
                        SafeSave(item,temp)
                        console.log("stored changes in "+item+"!")
                        console.log(temp[index])
                        console.log("index: "+index)
                        // return temp[index] //1.2
                    }
                    var removedsd = false

                    function Registrar(){ //1.1.3.3
                        let manga
                        let marked = false
                        if(sus) manga = {id:id_series, mu:mu, name:document.title.replace(" - MangaDex",""), last:daLast, lastl:lastl, lastv: daLastV, nextv:nextvol, nextc:daNext, nextl:daNLink, time:timestamp} //1.2.7
                        else manga = {id:id_series, mu:mu, name:document.title.replace(" - MangaDex",""), last:daLast, lastl:lastl, nextc:daNext, nextl:daNLink, time:timestamp} //1.2.7
                        //1.2.7
                        if(daIndex >= 0 && seriesdex[daIndex].split) manga.split = seriesdex[daIndex].split
                        if(daIndex >= 0 && seriesdex[daIndex].aval) manga.aval = seriesdex[daIndex].aval

                        let campana = (getTAG(getCN("sm:ml-2")[0],"svg")[0].firstChild.getAttribute("d") == "M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h9m6.63-4A17.888 17.888 0 0 1 18 8m-4.27 13a2 2 0 0 1-3.46 0M17 18l2 2 4-4") //1.2.6
                        let blink = getFstatus(fstatus)
                        UpdateStorage(manga,blink)
                        if(daIndex >= 0) {
                            // LoadSD()
                            CompareSD(blink,seriesdex[daIndex]) //1.2
                        }
                        if(campana) {
                            UpdateStorage(manga,"seriesdex")
                        }
                        else marked = true
                        if(marked) RemoveFromSD(manga.id)

                        //Delete duplicates //1.2
                        console.log("Checking for duplicates")
                        for(let c of ["Completed","Plan to Read","On Hold","Dropped","Reading"]){
                            if(c != fstatus){
                                let namevar = getFstatus(c)
                                if(namevar){
                                    console.log("Checking "+namevar)
                                    let temp = SafeLoad(namevar) //1.2
                                    let index = FS(temp,id_series)
                                    if(index >= 0){
                                        console.log("Duplicated in "+namevar)
                                        console.log(temp[index])
                                        temp.splice(index,1)
                                        SafeSave(namevar,temp)
                                        console.log("Deleted from "+namevar)
                                    }
                                }
                            }
                        }
                        console.log("reference:")
                        console.log(manga)

                        console.log("the one registered in "+fstatus+":")
                        let final = SafeLoad(blink)
                        let k = FS(final,id_series)
                        console.log(final[k])
                        return true
                    }
                    function LoadWBS(){
                        let ww = getCN("flex gap-x-2")[0]
                        let newbtn = cloneDOM("div",ww)
                        newbtn.id="FilterG"
                        newbtn.innerHTML = '<button data-v-cae07f5c="" data-v-4e000227="" class="rounded relative md-btn flex items-center" style="min-height: 48px; min-width: 220px;" onclick="NMDFilter(event)"><!----> <span data-v-cae07f5c="" class="flex items-center justify-center font-medium select-none" style="pointer-events: none;"><!---->🔧 WHITE/BLACKLIST GROUPS HERE 🔧</span></button>'
                        if(!document.getElementById("FilterG")) {//1.3.2
                            let xx = document.getElementsByClassName("nav-bar-search")[0]
                            xx.parentElement.insertBefore(newbtn,xx)
                        }
                        createModal()
                    }
                    if(Apoo() && daIndex >= 0){
                        LoadWBS()
                        if(seriesdex[daIndex].name != document.title.replace(" - MangaDex","") && document.title != "MangaDex") seriesdex[daIndex].name = document.title.replace(" - MangaDex","")
                        console.log("previous last: "+seriesdex[daIndex].last)
                        console.log("updating values")
                        if(Registrar() && !removedsd) console.log("new last: "+seriesdex[daIndex].last)
                    }
                    else if(daIndex >= 0){//fixes bug that adds everything
                        if(!toConsider.includes(fstatus)) seriesdex.splice(daIndex,1)//1.1.3.2
                        console.debug("fixing old bug")
                        SafeSave("seriesdex",seriesdex)//1.1.3.3
                    }
                    else if(daIndex == -1 && toProcess){//not registered
                        if(fstatus == "Reading") console.log("new series!")//1.1.3.3
                        Registrar()
                        LoadWBS()
                    }
                    if(FS(seriesdex,id_series) >= 0) {
                        LoadWBS()
                        console.log("seriesdex entry:")
                        console.log(seriesdex[FS(seriesdex,id_series)])
                    }
                }
                else if(getCN("text-center").length && getCN("text-center")[0].innerText == "No Chapters"){
                    console.log("no chapters!")
                    let daIndex = FS(seriesdex,getID3(document.URL))
                    for(let x of getTAG(getCN("readmore")[0],"a")){//1.2
                        if(x.href.includes("mangaupdates")) {
                            mu = x.href.split("=")[1]*1
                            console.log("mu: "+mu)
                        }
                    }

                    function LoadWBS(){//1.2
                        let ww = getCN("track")[0].parentElement.parentElement //1.3.2 getCN("text-center")[0].parentElement
                        let newbtn = cloneDOM("div",ww)
                        newbtn.id="FilterG"
                        newbtn.innerHTML = '<button data-v-cae07f5c="" data-v-4e000227="" class="rounded relative md-btn flex items-center" style="min-height: 48px; min-width: 220px;" onclick="NMDFilter(event)"><!----> <span data-v-cae07f5c="" class="flex items-center justify-center font-medium select-none" style="pointer-events: none;"><!---->🔧 WHITE/BLACKLIST GROUPS HERE 🔧</span></button>'
                        if(!document.getElementById("FilterG")) {//1.3.2
                            let xx = document.getElementsByClassName("nav-bar-search")[0]
                            xx.parentElement.insertBefore(newbtn,xx)
                        }
                        createModal()
                    }

                    function Empty(){//1.2
                        console.log("Empty()")
                        let temp = {id: getID3(document.URL),mu:mu,name: document.title.replace(" - MangaDex",""),last: MINNUM,nextc: MAXNUM,nextl: null, time:timestamp}
                        function UpdateEmpty(arrayname,obj){
                            console.log("mu ue "+arrayname+": "+mu)
                            console.log("reference data:")
                            console.log(obj)
                            let dummy = SafeLoad(arrayname)
                            let index = FS(dummy,obj.id)
                            dummy[index].mu = mu
                            obj.mu = mu
                            if(!obj.time && dummy[index].time) obj.time = dummy[index].time
                            if(index >= 0) {
                                console.log(arrayname+" data:")
                                console.log(dummy[index])
                                if(dummy[index].last < 0 && dummy[index].nextl == null) dummy[index] = obj
                                //else it has previous data
                            }
                            else dummy.push(obj)
                            SafeSave(arrayname,dummy)
                            console.log("new data ("+arrayname+"):")
                            console.log(dummy[index])
                        }
                        if(fstatus == "Reading") {
                            UpdateEmpty("reading",temp)
                            UpdateEmpty("seriesdex",temp)
                            if(daIndex >= 0) CompareSD("reading",seriesdex[daIndex])
                        }
                        else if(fstatus == "On Hold") {
                            UpdateEmpty("onhold",temp)
                            if(daIndex >= 0) CompareSD("onhold",seriesdex[daIndex])
                        }
                        else if(fstatus == "Dropped") {
                            UpdateEmpty("dropped",temp)
                            if(daIndex >= 0) CompareSD("dropped",seriesdex[daIndex])
                        }
                    }

                    if(getCN("w-full").length){
                        for(let f of getCN("w-full")){
                            if(fstatus == "Completed" && f.innerText.includes("Final Chapter")){
                                let completed = SafeLoad("completed")
                                let temp = {id: getID3(document.URL),mu:mu,name: document.title.replace(" - MangaDex",""),last: GetNumero(f.innerText), time:timestamp}
                                let index = FS(completed,temp.id)
                                if(index >= 0) completed[index] = temp
                                else completed.push(temp)
                                SafeSave("completed",completed)
                                console.log("new data (completed):")
                                console.log(temp)
                                if(FS(seriesdex,temp.id) >= 0){
                                    seriesdex.splice(FS(seriesdex,temp.id),1)
                                    console.log("removed from seriesdex!")
                                    SafeSave("seriesdex",seriesdex)
                                }
                            }
                        }
                        Empty() //1.2
                    }
                    else if(toConsider.includes(fstatus)){//1.1.3.3
                        Empty() //1.2
                    }
                    LoadWBS() //1.2
                }
                else setTimeout(UpdatingSeriesData,500)
            }
            try{
                UpdatingSeriesData()
            }
            catch(e){
                console.log("catch UpdatingSeriesData")
                if(document.getElementsByClassName("flex flex-col items-center").length && document.getElementsByClassName("flex flex-col items-center")[0].innerText == "404: Title not found") RemoveFromSD(id_series)
                else setTimeout(UpdatingSeriesData,1000)
            }
        }

        if(document.URL.includes("https://mangadex.org/chapter/")){//1.2
            try{
                if(!titlepage) titlepage = getTAG(getCN("menu flex-col")[0],"a")[0].href
                let current = GetNumero(getCN("placeholder-text")[1].innerText)
                let sid = getID3(titlepage)
                let chid = getID3(document.URL)
                let pseries = FS(seriesdex,sid)
                if(forbidden.includes(chid)){
                    console.log("FORBIDDEN!!")
                    window.location.href = titlepage
                }
                if(pseries >= 0 && current){//1.2.2
                    if(current > seriesdex[pseries].last){
                        console.log(`${getCN("ml-4")[1].innerText}'s previous last: ${seriesdex[pseries].last}`)
                        seriesdex[pseries].last = current
                        console.log(`${getCN("ml-4")[1].innerText}'s new last: ${seriesdex[pseries].last}`)
                        seriesdex[pseries] = DefaultNext(seriesdex[pseries])
                        console.log(seriesdex[pseries])
                        SafeSave("seriesdex",seriesdex)
                    }
                }
            }
            catch(e){//1.2.2
                console.log("External link?")
                for(let sd of seriesdex){
                    if(document.URL.includes(sd.nextl)){
                        let pseries = FS(seriesdex,sd.id)
                        sd.last = sd.nextc
                        sd = DefaultNext(sd)
                        console.log(`${document.title.split(" - ")[1]}'s new last: ${seriesdex[pseries].last}`)
                        SafeSave("seriesdex",seriesdex)
                        break
                    }
                }
            }

            // let nextlink = null
            // let menuclass = "menu flex flex-col gap-2 bg-background p-4"//"menu flex flex-col gap-2 bg-background p-4 open pinned"
            // if(getCN(menuclass)[0].children[4].children[2].href) nextlink = getCN(menuclass)[0].children[4].children[2].href
            // if(nextlink && forbidden.includes(getTID(nextlink))){//it's a blacklisted chapter
            //     if(getCN("md--pages")[0].firstChild.childElementCount == document.URL.split("/")[5]*1){//last page
            //         alert("Next chapter is blacklisted. Don't click it if you don't want to read it. Ctrl+M to go to title page.")
            //     }
            // }

        }

        if(document.URL.includes("https://mangadex.org/user/me")){//1.2
            function DisplayTabla(){
                if(getCN("select__tab-active")[0].innerText == "Info"){
                    let com = SafeLoad("completed")
                    let ptr = SafeLoad("planto")
                    let dro = SafeLoad("dropped")
                    let rea = SafeLoad("reading")
                    let onh = SafeLoad("onhold")
                    let daTable = '<tr><th>Name</th><th class="centered">MU Link</th><th class="centered">Status</th><th class="centered">Last Read</th><th class="centered">Next</th><th class="centered">Last Update</th></tr>'
                    function LlenarTabla(array,stat){
                        for(let a of array){
                            let mulink = ''
                            let mubody = '🚫'
                            if(a.mu){
                                mulink = ` href="https://www.mangaupdates.com/series.html?id=${a.mu}"`
                                mubody = '🔗'
                            }
                            let stamp = '⚠️'
                            if(a.time) stamp = (new Date(a.time)).toLocaleDateString()
                            let lastone = '🚫'
                            if(JSON.parse(a.last) != null && a.last > MINNUM) {
                                if(!a.lastv) lastone = a.last
                                else lastone = "v"+a.lastv+"c"+a.last
                            }
                            let nextone = '🚫'
                            let nextlink = ''
                            if(a.nextl){
                                nextone = a.nextc
                                if(a.nextv) nextone = "v"+a.nextv+"c"+a.nextc
                                nextlink = ` href="/chapter/${a.nextl}"`
                                if(a.nextl.includes(".")) nextlink = ` href="${a.nextl}"` //1.2.3
                            }
                            let bell = '🔕'
                            if(FS(seriesdex,a.id) >= 0) bell = '🔔 '
                            daTable+=`<tr><td><a class="levy" href="/title/${a.id}" title="${a.name.replaceAll('"','$').replaceAll("<",'\<').replaceAll(">",'\>')}">${bell+a.name}</a></td><td class="centered"><a${mulink}>${mubody}</a></td><td class="centered">${stat}</td><td class="centered"><div style="display: flex;justify-content: center;"><span>${lastone} </span><button onclick="NewLast3(event)">✍️</button></div></td><td class="centered"><a${nextlink}>${nextone}</a></td><td class="centered">${stamp}</td></tr>`
                        }
                    }
                    LlenarTabla(rea,"Reading")
                    LlenarTabla(onh,"On Hold")
                    LlenarTabla(dro,"Dropped")
                    LlenarTabla(ptr,"Plan to Read")
                    LlenarTabla(com,"Completed")
                    let divTabla = newInner("table","table",daTable)
                    divTabla.id = "divTabla"
                    divTabla.style.display = "grid"
                    if(!document.getElementById("divTabla")){
                        let target = null
                        if(getCN("px-6 page-container").length) target = getCN("px-6 page-container")[0].parentElement.parentElement
                        if(target) target.append(divTabla)
                        else setTimeout(target.append(divTabla),500)
                    }
                    else document.getElementById("divTabla").innerHTML = daTable
                }
            }
            DisplayTabla()
        }

        if(document.URL.includes("https://mangadex.org/group/")){
            blacklist = SafeLoad("blacklist")
            let gid = getID3(document.URL)
            let boton = getCN("rounded md-btn px-4")[0]
            let newboton = cloneDOM("button",boton)
            if(blacklist.findIndex(q => q[0] == 0 && q[1] == gid) < 0) {
                newboton.innerText = "Blacklist this"
                newboton.setAttribute("onclick","BLThis()")
            }
            else {
                newboton.innerText = "Remove from blacklist"
                newboton.setAttribute("onclick","unBLThis()")
            }
            boton.parentElement.append(newboton)
        }
    }
    else setTimeout(main,5000)
}

window.BLThis = function(){//1.2.2
    let gid = getID3(document.URL)
    blacklist = SafeLoad("blacklist")
    if(blacklist.findIndex(q => q[0] == 0 && q[1] == gid) < 0) blacklist.push([0,gid])
    SafeSave("blacklist",blacklist)
    alert(`${document.title.split(" - ")[0]} marked as globally blacklisted`)
    let boton = getCN("rounded md-btn px-4")[1]
    boton.innerText = "Remove from blacklist"
    boton.setAttribute("onclick","unBLThis()")
}

window.unBLThis = function(){//1.2.2
    let gid = getID3(document.URL)
    blacklist = SafeLoad("blacklist")
    let index = blacklist.findIndex(q => q[0] == 0 && q[1] == gid)
    if(index >= 0) blacklist.splice(index,1)
    SafeSave("blacklist",blacklist)
    alert(`${document.title.split(" - ")[0]} removed from globally blacklisted`)
    let boton = getCN("rounded md-btn px-4")[1]
    boton.innerText = "Blacklist this"
    boton.setAttribute("onclick","BLThis()")
}

document.addEventListener('keydown', function(event) {
    if(document.URL.includes("/chapter/") && event.ctrlKey && (event.key === 'm' || event.key === 'M')){
        window.location.href = titlepage
        // localStorage.setItem("reader.hidePagebar",0) //1.2.3
    }
});

//EXPORT FUNCTIONS
function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'seriesdex.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function parseJSONToCSVStr(jsonData) {
    if(jsonData.length == 0) {
        return '';
    }

    let keys = Object.keys(jsonData[0]);

    let columnDelimiter = '\t';
    let lineDelimiter = '\n';

    let csvColumnHeader = keys.join(columnDelimiter);
    let csvStr = csvColumnHeader + lineDelimiter;

    jsonData.forEach(item => {
        keys.forEach((key, index) => {
            if( (index > 0) && (index < keys.length) ) {
                csvStr += columnDelimiter;
            }
            csvStr += item[key];
        });
        csvStr += lineDelimiter;
    });

    return encodeURIComponent(csvStr);;
}

function exportToCsvFile(jsonData) {
    let csvStr = parseJSONToCSVStr(jsonData);
    let dataUri = 'data:text/csv;charset=utf-8,'+ csvStr;

    let exportFileDefaultName = 'MangaDexFollowFeed.csv';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function PrepareData(lala){
    var temp = []
    let reading = SafeLoad("reading")
    let planto = SafeLoad("planto")
    let onhold = SafeLoad("onhold")
    let dropped = SafeLoad("dropped")
    let completed = SafeLoad("completed")

    function Processing(arrayy,naame){
        for(let a of arrayy){
            let last,daTime
            if(lala){
                //if(a.last*1 < 0 || JSON.parse(a.last) == null) last = "unregistered"
                if(a.last*1 < 0 || a.last == null) last = "unregistered"
                else last = a.last
                if(a.time) daTime = new Date(a.time).toLocaleString()
                else daTime = "unregistered"
            }
            else {
                last = a.last
                daTime = a.time
            }
            temp.push({id:a.id,mu:a.mu,name:a.name,state:naame,last:last, time:(new Date(a.time).toLocaleString())})
            if(temp.length == 0) temp = [{id:a.id,mu:a.mu,name:a.name,state:naame,last:last, time:(new Date(a.time).toLocaleString())}]
        }
    }

    if(reading.length+planto.length+onhold.length+dropped.length+completed.length){
        Processing(reading,"Reading")
        Processing(onhold,"On Hold")
        Processing(planto,"Plan to Read")
        Processing(dropped,"Dropped")
        Processing(completed,"Completed")
        return temp
    }
    else{
        alert("There's no data. Please press the FILL button to collect the data")
        return null
    }
}

window.DownloadCSV = function(){
    exportToCsvFile(PrepareData(true))
}

window.DownloadJSON = function(){
    exportToJsonFile(PrepareData(false))
}

// document.onscroll = function(){
//     var w = document.documentElement.clientHeight;
//     var over = document.documentElement.scrollTopMax;
//     if(document.documentElement.scrollTop < over) trigger = true
//     if(w < over && document.documentElement.scrollTop == over) {
//         if(trigger && !filling) setTimeout(main,500)
//         trigger = false
//     }
// }