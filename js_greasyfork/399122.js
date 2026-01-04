// ==UserScript==
// @name         Steam Keyword Blocker / Steam关键词屏蔽
// @version      2020.3.12.0
// @description  关键词屏蔽
// @author       CYTMWIA
// @match        http*://store.steampowered.com/*
// @match        http*://steamcommunity.com/*
// @run-at       document-body
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @source       https://raw.githubusercontent.com/CYTMWIA/Steam_KeywordBlocker/master/Steam_KeywordBlocker.user.js
// @namespace https://greasyfork.org/users/14488
// @downloadURL https://update.greasyfork.org/scripts/399122/Steam%20Keyword%20Blocker%20%20Steam%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/399122/Steam%20Keyword%20Blocker%20%20Steam%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //屏蔽关键词 keyword
    let BLACKLIST = []

    function initBlacklist() {
        BLACKLIST = eval(GM_getValue('BLACKLIST', '["PUBG社区管理",/绝地求生.*?限时领取/,"FREE SKINS",/懂.*?懂.*?身体.*?删.*?除/]'))
    }

    function saveBlacklist() {
        let lst = '['
        BLACKLIST.forEach(function (val) {
            if (val instanceof RegExp)
                lst += val.toString()
            else
                lst += '"'+val.toString()+'"'
            lst += ','
        })
        lst += ']'
        GM_setValue('BLACKLIST', lst)
    }

    function delKeywordByIndex(idx) {
        BLACKLIST.splice(idx,1)
        saveBlacklist()
    }

    function addKeyword(kw) {
        BLACKLIST.push(kw)
        saveBlacklist()
    }

    function containWordInList(s,lst=BLACKLIST){
        let text = s.replace(/\n/g, '')
        for (let i=0;i<lst.length;i+=1) {
            if (lst[i] instanceof RegExp) {
                if (lst[i].test(text))
                    return true
            } else {
                if (text.indexOf(lst[i])!=-1) 
                    return true
            }
        }
        return false
    }

    function setIntervalKiller(func,timeout,self_clear=false) {
        let interval_id = setInterval(()=>{
            if (func()&&self_clear) {
                clearInterval(interval_id)
            }
        },timeout)
        return interval_id
    }

    function removeElementsByBlacklist(eles) {
        let count = 0
        for (let idx=eles.length-1;idx>=0;idx-=1) {
            if (containWordInList(eles[idx].innerHTML)) {
                eles[idx].remove()
                count += 1
            }
        }
        return count
    }

    // 启动屏蔽
    initBlacklist()
    if (/store\.steampowered\.com\/?$/.test(window.location)) {
        // exmple: https://store.steampowered.com/
        setIntervalKiller(()=>{
            let apps = document.getElementsByClassName('community_recommendation_app')
            if (apps.length>0){
                let thumbs = document.getElementsByClassName('carousel_thumbs')[3]
                let focus = true
                for (let idx=apps.length-1;idx>=0;idx-=1){
                    if (containWordInList(apps[idx].parentElement.innerHTML)){
                        let rmele = apps[idx].parentElement
                        if (rmele.className==='focus') {
                            focus=false
                        }
                        rmele.remove()
                        thumbs.children[idx].remove()
                    }
                }
                if (!focus&&apps.length>0) {
                    document.getElementsByClassName('arrow right')[3].click()
                }
                return true
            }
        },500,true);
    } else if (/store\.steampowered\.com\/labs\/trendingreviews/.test(window.location)) {
        // exmple: https://store.steampowered.com/labs/trendingreviews/
        setIntervalKiller(()=>{
            let apps = document.getElementById('reviewed_apps').children
            removeElementsByBlacklist(apps)
        },500)
    } else if (/store\.steampowered\.com\/app/.test(window.location)) {
        // exmple: https://store.steampowered.com/app/440
        setIntervalKiller(()=>{
            let reviews = document.getElementsByClassName('review_box')
            if (removeElementsByBlacklist(reviews)>0)
                return true
        },500,true)
    } else if (/steamcommunity\.com/.test(window.location)) {
        // exmple: https://steamcommunity.com/app/440
        // exmple: https://steamcommunity.com/app/440/reviews/
        // exmple: https://steamcommunity.com/
        // exmple: https://steamcommunity.com/?subsection=reviews
        setIntervalKiller(()=>{
            let cards = document.getElementsByClassName('apphub_Card')
            removeElementsByBlacklist(cards)
        },500)
    }

    // 添加设置UI
    GM_addStyle(''
        +'.skp_kwrow {'
        +'  display: grid;'
        +'  grid-template-columns: 1fr 1fr;'
        +'  grid-gap: 1ch;'
        +'  background-color: black;'
        +'}'
        +'.skp_kwtext {'
        +'  grid-column: 1;'
        +'  text-align: center;'
        +'}'
        +'.skp_opkw {' // op: 操作 (增减关键词)
        +'  grid-column: 2;'
        +'  text-align: center;'
        +'  cursor: pointer;'
        +'  font-size: large;'
        +'}'
    )

    let menus = $J('#global_action_menu')[0]
    menus.innerHTML = ''
        +'<div id="skp_menu" style="display: inline-block;">'
        +'    <div id="skp_pulldown" style="display: inline-block;vertical-align: middle;" class="pulldown global_action_link">KeywordBlocker</div>'
        +'    <div id="skp_kwlst" style="visibility: hidden; background-color: #171a21;" class="popup_block_new">'
        +'        <div style="text-align: center;">关键词列表</div>'
        +'        <div id="skp_kws"></div>'
        +'        <div class="skp_kwrow">'
        +'            <input id="skp_newkw" style="grid-column: 1;">'
        +'            <div id="skp_addkw" class="skp_opkw">+</div>'
        +'        </div>'
        +'    </div>'
        +'</div>' + menus.innerHTML
    
    function makeKeywordList() {
        let kws = $J('#skp_kws')[0]
        
        kws.innerHTML = ''
        BLACKLIST.forEach(function (val, idx) {
            kws.innerHTML += '<div class="skp_kwrow"><div class="skp_kwtext">' + val.toString() + '</div><div class="skp_opkw" idx="' + idx + '">-</div></div>'
        })

        let dels = $J('#skp_kws .skp_opkw')
        for (let idx=0;idx<dels.length;idx+=1) {
            dels[idx].addEventListener('click', function(){
                delKeywordByIndex(this.getAttribute('idx'))
                makeKeywordList()
            })
        }
    }

    $J('#skp_pulldown')[0].addEventListener('click', function () {
        let kwl = $J('#skp_kwlst')[0]
        kwl.style.visibility = kwl.style.visibility==='visible'?'hidden':'visible'
        makeKeywordList()
    })

    $J('#skp_addkw')[0].addEventListener('click', function () {
        let input = $J('#skp_newkw')[0]
        if (input.value.length > 0){
            try {
                addKeyword(eval(input.value))
            } catch(e) {
                addKeyword(input.value)
            }
            input.value = ''
        }
        makeKeywordList()
    })
})();