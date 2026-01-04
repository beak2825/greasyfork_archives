// ==UserScript==
// @name         Tesio Calulator
// @namespace    http://tampermonkey.net/
// @version      v0.1c.ecoroalba
// @description  計算Tesio活性理論的數值,據說來自https://www.youtube.com/@dormello,改至Excel表格版
// @author       AWA_Adayar
// @match        https://db.netkeiba.com/horse/ped/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netkeiba.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500515/Tesio%20Calulator.user.js
// @updateURL https://update.greasyfork.org/scripts/500515/Tesio%20Calulator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let table = document.querySelector(".blood_table")
    let fullblood = table.querySelectorAll("td")


    let fatalnodes = [0,32,48,56,31,47,55,59]


    class BloodNode{
        constructor(index,depth){
            this.index = index
            this.sire = null
            this.mare = null
            this.depth = depth
            this.yob = 0
            this.mana = null
        }

        getyob(yob){
            this.yob = yob
        }

        calcmana(){
            if (this.sire && this.mare && this.sire.yob!=0 && this.mare.yob!=0){
                this.sire.mana = (this.yob - this.sire.yob - 1)%8
                this.mare.mana = (this.yob - this.mare.yob - 1)%8
            }

        }
    }

    let addsire = function(node,index){
        let depth = node.depth + 1
        node.sire = new BloodNode(index,depth)
        return node.sire
    }

    let addmare = function(node,index){
        let depth = node.depth + 1
        node.mare = new BloodNode(index,depth)
        return node.mare
    }

    let bloodindex = [...Array(62).keys()]
    let BloodTree = new BloodNode(-1,0)
    let blooddepthnodes = [null,null,null,null,null]
    let curnode = BloodTree
    let bloodStack = [BloodTree]

    while (bloodindex.length > 0){
        if ( curnode.depth < 5 && !curnode.sire ){
            blooddepthnodes[curnode.depth] = curnode
            curnode = addsire(curnode,bloodindex.shift())
            bloodStack.push(curnode)
        } else if ( curnode.depth >= 5 ) {
            curnode = blooddepthnodes[curnode.depth-1]
            curnode = addmare(curnode,bloodindex.shift())
            bloodStack.push(curnode)
            curnode = blooddepthnodes[curnode.depth-2]
        } else if ( curnode.sire && !curnode.mare ) {
            curnode = addmare(curnode,bloodindex.shift())
            bloodStack.push(curnode)
        } else if ( curnode.sire && curnode.mare ) {
            curnode = blooddepthnodes[curnode.depth-1]
            continue
        }
    }


    let getnkbyob = (x) => {
        let vaildtext = [...x.childNodes].filter(
            y=>y.nodeType==3&&y.textContent.trim()!="")
        if (vaildtext && vaildtext.length > 0) return Number(vaildtext[0].textContent.split(" ")[0])
        return 0
    }



    let selfyob = null
    selfyob = Number(location.pathname.split("/")[3].slice(0,4))
    if (isNaN(selfyob)){
        let mareline = document.querySelector("div.mare_line_box")
        let selfplace = mareline.querySelector("a b").parentElement
        let selfyobraw = [...mareline.childNodes][[...mareline.childNodes].indexOf(selfplace)+1]
        selfyob = Number(selfyobraw.textContent.split("\n")[4])
    }
    bloodStack[0].getyob(selfyob)

    fullblood.forEach((el,index)=>{
        bloodStack[index+1].getyob(getnkbyob(el))
    })
    bloodStack.forEach(el=>{el.calcmana()})



    let manapower = 0
    let manadepth = 0
    let advancenode = null
    let fixeddepth = 0


    let calcmanaresult = () => {
        manapower = Math.floor([bloodStack[32].mana,bloodStack[48].mana,bloodStack[56].mana,bloodStack[60].mana].reduce((acc,cur) => acc+cur))
        manadepth = Math.floor(bloodStack[1].mana - Math.max(bloodStack[33].mana,bloodStack[49].mana,bloodStack[57].mana))
        if (fixeddepth!=0) manadepth = fixeddepth
        advancenode = BloodTree
        if (manadepth==0) advancenode = advancenode.sire

        while (advancenode.depth < Math.abs(manadepth)){
            if (advancenode.depth==4&&Math.abs(manadepth)>=5) break
            // if (advancenode.depth-=1) {
            //     advancenode = manadepth < 0 ?  advancenode.mare : advancenode.sire
            //     continue
            // }
            advancenode = advancenode.sire.mana < advancenode.mare.mana ? advancenode.mare : advancenode.sire
        }

    }


    calcmanaresult()


    let ManaStyle = document.createElement("style")
    ManaStyle.type = "text/css"
    ManaStyle.innerHTML = ".mana{position: relative;left: 60%;width: 0;height: 0;top: -25%;} \
                        .mana p span{font-size: 30px;opacity:0.3} \
                        .mana p span.fatal{font-size: 30px;opacity:1;} \
                        .wgtplus{display: inline-flex;position: absolute;top: 5px;left: 20px;}\
                        .yobplus{display: none;position: absolute;top: 20px;left: 20px;}\
                        .wgtplus label{width:50px} .yobplus label{width:50px} \
                        .adv{border: 2px solid blue !important;} .adv span{opacity:1 !important;}\
                        .advplus{border: 2px solid red !important;} .advplus span{opacity:1 !important;}"
    document.querySelector("head").appendChild(ManaStyle)


    let manadoms = []
    fullblood.forEach((el,index) => {
        let ManaDom = document.createElement("div")
        ManaDom.insertAdjacentHTML("beforeend","<p><span></span></p>")

        ManaDom.className = "mana"
        ManaDom.insertAdjacentHTML("beforeend",'<div class="wgtplus"> <input type="checkbox"> \
                                                <label style="font-size: 12px">加權重</label></div> \
                                                <div class="yobplus"> <input type="checkbox"> \
                                                <label style="font-size: 12px">活性為8</label></div>')



        let wgtplus = ManaDom.querySelector(".wgtplus input")
        wgtplus.addEventListener("change",()=>{
            if (wgtplus.checked) bloodStack[index+1].mana += 0.1
            else bloodStack[index+1].mana = Math.floor(bloodStack[index+1].mana)
            calcmanaresult()
            freshmana()
        })

        let yobplus = ManaDom.querySelector(".yobplus input")
        yobplus.addEventListener("change",()=>{
            bloodStack[index+1].mana = yobplus.checked ? 8 : 0
            calcmanaresult()
            freshmana()
        })

        manadoms.push(ManaDom)
        if (fatalnodes.indexOf(index) >= 0) ManaDom.querySelector("span").className = "fatal"
        if (bloodStack[index+1].mana!=null) el.insertAdjacentElement("afterbegin",ManaDom)
    });




    let downpage = document.querySelector(".blood_cross")
    downpage.insertAdjacentHTML("afterbegin",'<div class="fixdepth" style="position: absolute;">\
                        遺傳深度修正: <input><label style="top: 30px;position: absolute;left: 0%;">\
                        體力值: <b></b></label></div>')
    let fixdepth = downpage.querySelector(".fixdepth input")
    let manapowerdisp = downpage.querySelector(".fixdepth b")
    fixdepth.placeholder = manadepth
    fixdepth.oninput = function(e){
        fixeddepth = Number(fixdepth.value)
        if (isNaN(fixeddepth)) fixeddepth = 0
        calcmanaresult()
        freshmana()
    }

    let freshmana = () => {
        if(fixeddepth==0) fixdepth.placeholder = manadepth
        manapowerdisp.textContent = `${manapower}/32=${manapower/32*100}%`
        manadoms.forEach((el,index) => {
            if (Math.floor(bloodStack[index+1].mana)==0||Math.floor(bloodStack[index+1].mana)==8)
                el.querySelector(".yobplus").style.display = "inline-flex"
            else el.querySelector(".yobplus").style.display = "none"
            el.querySelector("span").textContent = Math.floor(bloodStack[index+1].mana)
            if (index == advancenode.index){
                if (Math.abs(manadepth)>=5) fullblood[index].classList.add("advplus")
                else fullblood[index].classList.add("adv")
            } else {
                fullblood[index].classList.remove("adv")
                fullblood[index].classList.remove("advplus")
            }
        })
    }
    freshmana()

})();