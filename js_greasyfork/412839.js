// ==UserScript==
// @name         Steam好友动态页优化
// @namespace    dcmk
// @version      1.0.2
// @description  特别关注，只看新增愿望单/第一次玩/已购，游戏名竖排，浮窗显示详情
// @author       dcmk
// @match        http*://steamcommunity.com/id/*
// @match        http*://steamcommunity.com/profiles/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/412839/Steam%E5%A5%BD%E5%8F%8B%E5%8A%A8%E6%80%81%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/412839/Steam%E5%A5%BD%E5%8F%8B%E5%8A%A8%E6%80%81%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 特别关注
    let MODE_FOLLOW = false
    let FOLLOW_LIST = []
    // 相同游戏去重
    let MODE_UNIQUE = true
    // 显示 购买
    let FLAG_PURCHASED = true
    // 显示 愿望单
    let FLAG_WISHLIST = true
    // 显示 第一次玩
    let FLAG_PLAYED = false


    let UNIQUE_DICT = {}
    let RE_ARRPID = /(steamcommunity|store\.steampowered)\.com\/app\/(\d+)/

    // 是否保留
    function isKeep(element) {
        if (!MODE_FOLLOW) {
            return true
        }
        let nickname = element.getElementsByClassName("nickname_name")
        if (nickname.length == 0) {
            return false
        }
        for (let i=0; i<FOLLOW_LIST.length; i+=1) {
            if (nickname[0].innerHTML == FOLLOW_LIST[i]){
                return true
            }
        }
        return false
    }

    function genGameInfoHTML(avatar, name, type, games) {
        let html = ''
            +'<div class="blotter_gamepurchase">'
            +'    <div class="blotter_author_block">'
            +'        <div class="blotter_avatar_holder">' +  avatar + '</div>'
            +'        <div>' + name + '</div>'
            +'        <div>' + type + '</div>'
            +'    </div>'
            +'    <div style="padding: 10px;">'
        for (let id in games) {
            html += '<div><a class="show_detail" id="' + id + '" href="https://store.steampowered.com/app/' + id + '" target="_blank">' + games[id] + '</a></div>'
        }
        html += '</div></div>'
        return html
    }

    function genGameDetailNode(position, name, movie, description, hasChinese) {
        let node = document.createElement('div')
        node.id = "game_detail_box"
        node.className = "game_detail_box"
        node.setAttribute('style', 'margin-left:' + position["x"] +'px; margin-top:' + position["y"] +'px;');
        node.innerHTML = ''
            +'<p style="font-size:14px; padding-left: 15px;">' + (hasChinese?'🀄️ ':'') + name + '</p>'
            +'<video src="' + movie + '" autoplay="" loop="" style="width: 300px; padding:0px 10px;"></video>'
            +'<p style="font-size:12px; line-height:18px; margin:5px 10px">' + description + '</p>'
        return node
    }

    // 提取{"appid": 游戏名}
    function getGameAppid(els) {
        let links = els.getElementsByTagName("a")
        let result = {}
        for (let i = 0; i < links.length; i+=1) {
            let g = RE_ARRPID.exec(links[i].href)
            if (g) {
                if (MODE_UNIQUE && UNIQUE_DICT.hasOwnProperty(g[2])) {
                    continue
                }
                result[g[2]] = links[i].innerText
            }
        }
        if (MODE_UNIQUE && result.length != 0) {
            Object.assign(UNIQUE_DICT, result)
        }
        return result
    }

    function getGameDetail(appid, rect) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://store.steampowered.com/api/appdetails?appids=" + appid,
            onload: res => {
                if (res.status == 200) {
                    let text = res.responseText
                    let json = JSON.parse(text)[appid]["data"]
                    if (json.hasOwnProperty("fullgame")) {
                        // 处理demo和dlc
                        getGameDetail(json["fullgame"]["appid"], rect)
                    } else {
                        let name = json["name"]
                        //let movie = "https://media.st.dl.pinyuncloud.com/steam/apps/" + json["movies"][0]["id"] + "/microtrailer.webm"
                        let movie = "https://cdn.akamai.steamstatic.com/steam/apps/" + json["movies"][0]["id"] + "/movie480_vp9.webm"
                        let description = json["short_description"]
                        let hasChinese = (json["supported_languages"].indexOf("中文") != -1)
                        let position = {"x": rect.left+rect.width+30, "y": rect.top-60}
                        // console.log(position, name, movie, description, hasChinese)
                        let node = genGameDetailNode(position, name, movie, description, hasChinese)
                        $J('#game_detail_box').remove()
                        document.body.insertBefore(node, document.getElementsByClassName('responsive_page_frame')[0])
                    }
                }
            }
        })
    }

    function clearPurchasedElement(els) {
        let games = {}
        let details = els.getElementsByClassName("blotter_gamepurchase_details")
        if (details.length == 0) {
            games = getGameAppid(els.firstElementChild.childElements()[2])
        } else {
            games = getGameAppid(details[0])
        }
        if (Object.keys(games).length != 0) {
            let avatar = els.getElementsByTagName("a")[0].outerHTML
            let name = els.getElementsByTagName("a")[1].outerHTML
            let node = document.createElement('div')
            node.className = 'blotter_block'
            node.finished = true
            node.innerHTML = genGameInfoHTML(avatar, name, '购买了', games)
            return node
        }
        return null
    }

    function clearRollupLineElement(els, type) {
        let games = {}
        games = getGameAppid(els.childElements()[1])       
        if (Object.keys(games).length != 0) {
            let avatar = els.getElementsByTagName("a")[0].outerHTML
            let name = els.getElementsByTagName("a")[1].outerHTML
            let node = document.createElement('div')
            node.className = 'blotter_block'
            node.finished = true
            node.innerHTML = genGameInfoHTML(avatar, name, type, games)
            return node
        }
        return null
    }

    function clearElements(eles) {
        // parentNode：blotter_day
        let parentNode = eles[0].parentElement
        while (eles.length>0 && !eles[0].finished) {
            if (FLAG_PURCHASED && eles[0].firstElementChild.className == "blotter_gamepurchase") {
                if (isKeep(eles[0].firstElementChild)) {
                    let node = clearPurchasedElement(eles[0].firstElementChild)
                    if (node) {
                        parentNode.appendChild(node)
                    }
                }
            } else if (eles[0].firstElementChild.className == "blotter_daily_rollup") {
                let lines = eles[0].getElementsByClassName("blotter_daily_rollup_line")
                for (let i=0; i<lines.length; i+=1) {
                    if (!isKeep(lines[i])) {
                        continue
                    }
                    let node = null
                    if (FLAG_WISHLIST && lines[i].innerText.endsWith("愿望单中。")) {
                        node = clearRollupLineElement(lines[i], '愿望单新增')
                    } else if (FLAG_PLAYED && lines[i].getElementsByTagName("span")[0].childNodes[2].textContent == " 第一次玩 ") {
                        node = clearRollupLineElement(lines[i], '第一次玩')
                    }
                    if (node) {
                        parentNode.appendChild(node)
                    }
                }
            }
            eles[0].remove()
        }
    }

    GM_addStyle(''
        +'.game_detail_box {'
        +'    width: 320px;'
        +'    border-style: solid;'
        +'    border-width: 2px;'
        +'    border-color: #21658A;'
        +'    background: #171A21;'
        +'    color: #ebebeb;'
        +'    position: fixed;'
        +'    z-index: 9999;'
        +'}'
        +'.show_detail{'
        +'    font-size: 16px;'
        +'    line-height: 22px;'
        +'}'
        +'.show_detail:hover{'
        +'    color: #66C0F4;'
        +'    font-weight: bold;'
        +'}'
    )

    let menus = $J('#global_action_menu')[0]
    menus.innerHTML = ''
        +'<div id="skp_menu" style="display: inline-block;">'
        +'    <div id="skp_click" style="display: inline-block; vertical-align: middle; cursor:pointer;" class="global_action_link"> ☛ 简化动态 ☚ </div>'
        +'</div>' + menus.innerHTML

    $J('#skp_click')[0].addEventListener('click', function () {
        if (!MODE_FOLLOW || FOLLOW_LIST.length != 0) {
            if (/steamcommunity\.com\/(id|profiles)\/.*?\/home/.test(window.location)) {
                setInterval(() => {
                    let eles = document.getElementsByClassName('blotter_day')
                    for (let i=0; i<eles.length; i+=1) {
                        if (!eles[i].finished) {
                            clearElements(eles[i].getElementsByClassName('blotter_block'))
                            eles[i].finished = true
                        }
                    }
                }, 500)
            }
        } else {
            alert('请修改【Steam好友动态简化】脚本中的 FOLLOW_LIST 变量，填写需要特别关注的好友【昵称】\n或设置 MODE_FOLLOW 为 false')
        }
    })

    $J('#blotter_content').on('mouseover', 'a.show_detail', function(e) {
        getGameDetail(e.target.id, e.target.getBoundingClientRect())
    }).on('mouseout', 'a.show_detail', function(e) {
        $J('#game_detail_box').remove()
    })
})();