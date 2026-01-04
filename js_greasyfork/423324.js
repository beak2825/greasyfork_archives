// ==UserScript==
// @name        Gametrade Solder
// @description	Gametrade售卖脚本
// @namespace   Violentmonkey Scripts
// @match       https://gametrade.jp/*
// @icon        https://cdn.gametrade.jp/assets/favicon-75c5d6811fbafeaa84954d801c068540bbd35f026746d7310fe176632548b04c.ico
// @homepageURL https://greasyfork.org/zh-CN/scripts/423324-gametrade-solder
// @version     2.1.35
// @author      Charles Bao
// @grant       none
// @run-at      document-body
// @downloadURL https://update.greasyfork.org/scripts/423324/Gametrade%20Solder.user.js
// @updateURL https://update.greasyfork.org/scripts/423324/Gametrade%20Solder.meta.js
// ==/UserScript==

const MONEY = "値段は1000円"
const MONEY_SUFFIX = "になります、よろしくお願いします。"
const SELL_SUFFIX = "、専用出品しました、よろしくお願いします。 "
const REVIEW = "非常に気持ちの良い取引ができました。 また機会がございましたら宜しくお願い致します。"

const DICT = {
    "ヒロトラ(ヒロアカ ULTRA IMPACT)": {
        "编号": 16,
        "伪码": true,
        "编码": /[1-9][0-9]{7,8}/g,
        "服务": "http://serverpx.withapi.cn",
        "选号": "http://serverpx.withapi.cn/account/$1",
        "取引": {
            "问候": "ご購入ありがとうございます。",
            "等待": "かしこまりました。ご連絡お待ちしております。",
            "账号": "未使用のバンダイナムコアカウントとの連携が必要です、お客様ご自身で登録、又はこちらでバンダイナムコアカウント登録代行しても構いませんが、いかがでしょうか。\nご自身で登録の場合、バンダイナムコアカウントのメールアドレスとパスワード教えてください。",
            "稍等": "少々お待ちください。",
            "错误": "メールアドレスもしくはパスワードが異なります。ご確認ください。",
            "完成": "お待たせ致しました、引き継ぎ完了しました、ご確認ください。\n【重要】新しいアカウントでログインするにはアプリを削除しもう一度ダウンロードする必要があります。\n何か問題がありましたらご連絡ください。\n確認できましたら、受け取り確認とレビューをお願いいたします。"
        },
        "发布": {
            "参数": "1;1;1;1",
            "描述": '$1\n'
        }
    },
    "ブラサジ(ブラックサージナイト)": {
        "编号": 16,
        "伪码": true,
        "编码": /[1-9][0-9]{7,8}/g,
        "服务": "http://serverph.withapi.cn",
        "选号": "http://serverph.withapi.cn/account/$1",
        "取引": {
            "问候": "ご購入ありがとうございます。",
            "等待": "かしこまりました。ご連絡お待ちしております。",
            "账号": "未使用のビリビリアカウントとの連携が必要です、お客様ご自身で登録、又はこちらでビリビリアカウント登録代行しても構いませんが、いかがでしょうか。\nご自身で登録の場合、このページであたらしビリビリアカウント登録お願いします。passport.bilibili.co.jp/signup\n登録完了後メールアドレスとビリビリアカウントのパスワード教えてください。\nアカウント連携させていただきます。",
            "稍等": "少々お待ちください。",
            "错误": "メールアドレスもしくはパスワードが異なります。ご確認ください。",
            "完成": "連携できました、ご確認ください。\n\n何か問題がありましたらご連絡ください。\n確認できましたら、受け取り確認とレビューをお願いいたします。"
        },
        "发布": {
            "参数": "1;1;1",
            "描述": '$1\n'
        }
    },
    "ニーアリィンカーネーション(リィンカネ)": {
        "编号": 14,
        "伪码": true,
        "编码": /[1-9][0-9]{7,8}/g,
        "服务": "http://serverpx.withapi.cn",
        "选号": "http://serverpx.withapi.cn/account/$1",
        "取引": {
            "问候": "ご購入ありがとうございます。",
            "等待": "かしこまりました。ご連絡お待ちしております。",
            "账号": "お支払いありがとうございます、引き継ぎ用のスクエニ アカウント教えてください。",
            "稍等": "少々お待ちください。",
            "完成": "お待たせしました、引継ぎが完了しました。"
        },
        "发布": {
            "参数": "1;1;1",
            "描述": '★★★ニーアリィンカーネーション★★★\n\n専用出品しました\nnier.gametrade.club?serial=$1\n\n★ ご覧いただき誠にありがとうございます。\n★ 進行状況 - 初期垢1章終了\n★ 引継ぎには未連携のスクエニ アカウントをご用意ください。'
        }
    },
    "ウマ娘": {
        "编号": 15,
        "伪码": true,
        "编码": /[1-9][0-9]{7,8}/g,
        "服务": "http://serverpx.withapi.cn",
        "选号": "http://serverpx.withapi.cn/account/$1",
        "取引": {
            "问候": "ご購入ありがとうございます。",
            "等待": "かしこまりました。ご連絡お待ちしております。",
            "稍等": "少々お待ちください。",
            "完成": "無事確認完了後パスワードの変更お願いします。\n何か問題がありましたらご連絡ください。\n確認できましたら、受け取り確認とレビューをお願いいたします。"
        },
        "发布": {
            "参数": "F;1;1;1;iphone",
            "描述": "★★★ウマ娘プリティーダービー★★★\n\n専用出品しました\numa.gametrade.club?serial=$1\n\n★ ご覧いただき誠にありがとうございます。\n★ ★3引換券未使用\n★ ご入金確認後に、アカウント情報を発送します。"
        }
    },
    "ツイステ(ディズニーツイステッドワンダーランド)": {
        "编号": 13,
        "伪码": false,
        "编码": /13[0-9]{5,6}/g,
        "服务": "http://serverph.withapi.cn",
        "选号": "http://serverph.withapi.cn/account/$1",
        "取引": {
            "问候": "ご購入ありがとうございます。",
            "选号": "ｓｓｒキャラ指定可能です。選択したいのキャラ教えてください。\n Ace（エース/寮服） Ruggie（ラギー/寮服） Trey（トレイ/寮服） Riddle（リドル/寮服） Deuce（デュース/寮服） Jack（ジャック/寮服） Leona（レオナ/寮服） Cater （ケイト/寮服） 以上から選択可能です。",
            "等待": "かしこまりました。ご連絡お待ちしております。",
            "稍等": "少々お待ちください。",
            "完成": "無事確認完了後パスワードの変更お願いします。\n何か問題がありましたらご連絡ください。\n確認できましたら、受け取り確認とレビューをお願いいたします。"
        },
        "发布": {
            "参数": "1;1;1",
            "描述": "$1"
        }
    },
    "テイルズオブクレストリア(テイクレ)": {
        "编号": 14,
        "伪码": false,
        "编码": /14[0-9]{5,6}/g,
        "服务": "http://serverph.withapi.cn",
        "选号": "http://serverph.withapi.cn/account/$1",
        "取引": {
            "问候": "ご購入ありがとうございます。",
            "等待": "かしこまりました。ご連絡お待ちしております。",
            "稍等": "少々お待ちください。",
            "完成": "無事確認完了後パスワードの変更お願いします。\n何か問題がありましたらご連絡ください。\n確認できましたら、受け取り確認とレビューをお願いいたします。"
        },
        "发布": {
            "参数": "1;1;1",
            "描述": "$1"
        }
    },
    "ブルーアーカイブ(ブルアカ)": {
        "编号": 15,
        "伪码": false,
        "编码": /15[0-9]{5}/g,
        "服务": "http://serverph.withapi.cn",
        "选号": "http://serverph.withapi.cn/account/$1",
        "取引": {
            "问候": "ご購入ありがとうございます。",
            "等待": "かしこまりました。ご連絡お待ちしております。",
            "稍等": "少々お待ちください。",
            "完成": "無事確認完了後パスワードの変更お願いします。\n何か問題がありましたらご連絡ください。\n確認できましたら、受け取り確認とレビューをお願いいたします。"
        },
        "发布": {
            "参数": "1;1;1",
            "描述": "$1"
        }
    },
}

const ACCOUNT = {
    "yakumosoya": "21981d497cab01c8c4a8ea017ba1f7f7bc57c77e",
    "lpn1": "412d1ed125fd84f5b8d18b8c985e654bb2537451",
    "lpn2": "60c5985cca591aa745b74b1b85dfb47168bb2ff8",
    "lp2": "e0e78a171fc872e8270bbb5146cd1ad14e8568d3",
    "lp3": "7f9cd0a3912ff2951d8cc748e25b731e0cc5935d",
    "gt1": "9478af59fb8c35f7c974a178ad43fd363a03b64a"
}

let cookieInv = null
var currentUser = ""
var token = getCookie("remember_token")

let result = location.href.split("#")
if (result.length == 2 && ACCOUNT[result[1]]) {
    setCookie("remember_token", ACCOUNT[result[1]])
    location.href = result[0]
}

const style = document.createElement("style")
style.innerHTML = `.pc-header, .sp-header{
    position: fixed;
    width: 100%;
    z-index: 10;
    left: 0;
    top: 0;
}

.bread-crumbs-field{
    margin-top: 100px;
}
.header-search-field, .bnr-introduction {
    padding-top: 80px;
}

.exhibit-exhibit-button, .guide, .social-share,.line-notify-btn{
    display: none!important;
}
.notification_panel {
    display: block; 
    text-align: center; 
    padding: 10px; 
    background: #f8f8f8;
}
.notification_panel:hover {
    background: #eee;
}

.notification_list li > a, todolist li > a, .post-comment {
    display: flex!important;
}

.todo {
    cursor: pointer;
}

header .header-inner .right-field ul li .notifications .dropdown-menu{
    max-width: 400px;
}
header .header-inner .right-field ul li .todo .dropdown-menu{
    max-width: 450px;
}
`
document.head.appendChild(style)
ready(function () {

    let isMobile = document.querySelector(".sp-header") != null

    try {
        document.querySelectorAll(".todolist a").forEach(function (item) {
            item.setAttribute("target", "_blank")
        })
        document.querySelectorAll(".notification_list a").forEach(function (item) {
            if (item.href.indexOf("/message") != -1) item.setAttribute("target", "_blank")
        })
    } catch (e) {
        console.log(e)
    }


    try {

        let users = []
        for (let key in ACCOUNT) {
            if (ACCOUNT[key] == token) {
                currentUser = key
            }
            users.push(key)
        }

        let accounts = users.map(function (user) {
            let usertxt = user
            if (currentUser == user) {
                usertxt = "<strong style='color: red'>" + user + "</strong>"
            }
            return "<a style='color: white' href='javascript:reloadCookie(\"" + user + "\");'>" + usertxt + "</a>"
        }).join("<span style='padding-right: 5px; margin-right: 5px; border-right: 1px solid grey'></span>")

        if (isMobile) {
            let accountHeader = document.createElement("div")
            let ul = document.createElement("ul")
            ul.style.cssText = "background-color:#182a3d; text-align: center; overflow-x: auto; padding: 0 10px;"
            ul.innerHTML = accounts
            accountHeader.appendChild(ul)
            document.querySelector(".sp-header").appendChild(accountHeader)
            document.querySelector(".header-inner").style.height = "35px"
        } else {
            document.querySelector(".center-field").style.textAlign = "left"
            document.querySelector(".center-field").innerHTML += accounts
        }

        window.checkCookie = function () {
            console.log("check start", currentUser)
            cookieInv = setInterval(function () {
                if (token != getCookie("remember_token")) {
                    console.log("cookie changed", currentUser)
                    setCookie("remember_token", token)
                }
            }, 100)
        }
        window.reloadCookie = function (user) {
            cookieInv && clearInterval(cookieInv)
            setCookie("remember_token", ACCOUNT[user])
            setTimeout(() => { location.reload() })

        }
        window.onfocus = function () {
            console.log("window focus")
            window.checkCookie()
        }
        window.onblur = function () {
            console.log("window blur")
            if (cookieInv) {
                clearInterval(cookieInv)
                cookieInv = null
            }
        }

        window.checkCookie()

    } catch (e) {
        console.log(e)
    }


    // 取引画面
    if (location.href.indexOf("https://gametrade.jp/messages/") != -1) {
        let price = document.querySelector(".exhibit-description tr td").innerText.replace(/[¥,]/g, "")
        let text = document.querySelector(".exhibit-description h2 span").innerText
        let game = text.slice(1, text.length - 1)
        if (!DICT[game]) return
        let serial_prefix = DICT[game]["编号"]

        if (document.getElementById("review_description")) {
            document.getElementById("review_description").value = REVIEW
        }

        let target = document.querySelector(".post-message .message")
        if (target != null) {
            let arr = []
            for (let key in DICT[game]["取引"]) {
                arr.push("<button style='cursor: pointer' onclick='reply(this)'>" + key + "</button>")
            }
            target.innerHTML = "<div style='margin-bottom: 2px; color: blue;'>" + arr.join("<div style='display: inline-block; width: 10px;'></div>") + "</div>" + target.innerHTML
            window.reply = function (t) { document.getElementById("message_context").value = DICT[game]["取引"][t.innerText] }
        }

        let matches = document.querySelector(".exhibit-contents a").innerText.match(/【(.+?)】/)
        if (matches != null) {
            let serial = matches[1]
            if (DICT[game]["伪码"]) {
                let fake_serial = matches[1]
                serial = serial_prefix + "" + fake_serial.slice(0, fake_serial.length - 3)
                document.querySelector(".exhibit-description tbody").innerHTML += "<tr><th>伪码ID</th><td>" + fake_serial + "</td></tr>"
            }
            let a = document.querySelector(".exhibit-contents a")
            let href = DICT[game]["服务"] + "/account/" + serial + "?from=" + currentUser + "&price=" + price + "&remark=" + a.href.replace("https://", "")
            document.querySelector(".exhibit-description tbody").innerHTML += "<tr><th>编号ID</th><td><a style='color: blue' target='_blank' href='" + href + "'>" + serial + "</a></td></tr>"
            document.querySelector(".exhibit-description h2").innerHTML = "<a target='_blank' href='" + a.href + "'>" + document.querySelector(".exhibit-description h2").innerHTML + "</a>"
            a.removeAttribute("href")
        }

    }

    // 发布画面
    if (location.href.indexOf("https://gametrade.jp/exhibits/new#") != -1) {

        let hash = location.href.split("#")
        if (hash.length != 2) return

        let arr = hash[1].split(";")
        let game = decodeURI(arr[0])
        let name = decodeURI(arr[1])
        let serial = arr[2].trim()
        let price = arr[3].trim()

        document.getElementById("game_title").value = game
        document.getElementById("exhibit_title").value = name + "様専用【" + serial + "】"
        document.getElementById("exhibit_description").value = DICT[game]["发布"]["描述"].replace(/\$1/g, serial)
        document.getElementById("exhibit_price").value = price

        let publishInv = setInterval(function () {
            if (document.getElementById("exhibit_exhibit_category_id").value == "") return
            DICT[game]["发布"]["参数"].split(";").forEach(function (value, i) {
                let selector = document.getElementById("exhibit_exhibit_sub_form_values_attributes_" + i + "_value")
                if (selector.value == "") selector.value = value
            })
            let agreement = document.getElementById("agreement")
            if (!agreement.checked) agreement.click()
        }, 300)

    }

    // 留言面板
    if (document.querySelector(".exhibit-edit-button") != null) {

        const style = document.createElement("style")
        style.innerHTML = `
        .ui-widget-overlay,.ui-dialog {
            display: none!important;
        }`
        document.head.appendChild(style)

        let solder = document.querySelector(".user a span").innerText
        let game = document.querySelector(".game").innerText
        if (!DICT[game]) return

        window.reply = function (target) {
            let comment = target.parentElement.parentElement.parentElement
            let name = comment.firstChild.firstChild.firstChild.innerText
            let matches = comment.lastChild.firstChild.innerText.match(DICT[game]["编码"])
            let text = name + "、"
            if (matches != null) {
                if (matches.length == 1) {
                    text += matches[0] + MONEY
                } else {
                    let arr = []
                    for (let i in matches) {
                        arr.push(matches[i] + MONEY)
                    }
                    text += arr.join("、")
                }
                text += MONEY_SUFFIX
            }
            document.getElementById("comment_context").value = text
        }

        window.sell = function (target) {
            let comment = target.parentElement.parentElement.parentElement
            let name = comment.firstChild.firstChild.firstChild.innerText
            let matches1 = comment.lastChild.firstChild.innerText.match(DICT[game]["编码"])
            let text = ""
            if (matches1 != null) {
                serial = matches1[0]
                text = name + "、" + serial + SELL_SUFFIX
            } else {
                text = name + SELL_SUFFIX
            }
            document.getElementById("comment_context").value = text
        }

        window.publish = (target, _serial) => {
            let comment = target.parentElement.parentElement.parentElement
            let matches1 = comment.lastChild.firstChild.innerText.match(DICT[game]["编码"])
            let matches2 = comment.lastChild.firstChild.innerText.match(/([0-9]+)円/g)
            let serial = ""; let money = ""; let name = ""
            if (matches1 != null) {
                for (let i in matches1) {
                    if (matches1[i] == _serial) {
                        serial = matches1[i]
                        if (matches2 != null) {
                            money = matches2[i].replace("円", "")
                        }
                        break
                    }
                }
            }

            let matches3 = comment.lastChild.firstChild.innerText.match(/^(.+?)様、/)
            if (matches3 != null) {
                name = matches3[1]
            }

            window.open("https://gametrade.jp/exhibits/new#" + game + ";" + name + ";" + serial + ";" + money)
        }

        document.querySelectorAll(".comment .context").forEach(function (item) {

            let serials = []
            let matches = null

            if (item.innerHTML.indexOf("gametrade.jp") == -1) {
                matches = item.innerHTML.match(DICT[game]["编码"])
                if (matches != null) {
                    matches.forEach(function (txt) {
                        serials.push(txt)
                        let serial = txt
                        if (DICT[game]["伪码"]) {
                            serial = DICT[game]["编号"] + txt.slice(0, txt.length - 3)
                        }
                        let href = DICT[game]["选号"].replace("$1", serial)
                        item.innerHTML = item.innerHTML.replace(txt, "<a style='color: red;cursor:pointer' target='_blank' href='" + href + "'>" + txt + "</a>")
                    })
                }
            } else {
                let linkMatches = item.innerHTML.match(/gametrade\.jp.+[0-9]{8}/g)
                if (linkMatches != null) {
                    item.innerHTML = item.innerHTML.replace(linkMatches[0], "<a style='color: blue;cursor:pointer' target='_blank' href='https://" + linkMatches[0] + "'>" + linkMatches[0] + "</a>")
                }
            }

            let comment = item.parentElement.parentElement
            let name = comment.firstChild.firstChild.innerText
            comment.firstChild.removeAttribute("href")
            if (name != solder) {
                comment.firstChild.firstChild.innerHTML = "<span>" + comment.firstChild.firstChild.innerText + "様</span>"
            } else {
                comment.firstChild.firstChild.innerHTML = "<span style='font-weight: 600'>" + comment.firstChild.firstChild.innerText + "</span>"
            }
            if (name != solder && matches != null) {
                comment.firstChild.firstChild.innerHTML += "<span style='margin-left: 10px; color:blue; cursor:pointer' onclick='reply(this)'>报价</span>"
            }
            if (name == solder && matches != null) {
                serials.forEach(function (serial) {
                    comment.firstChild.firstChild.innerHTML += "<span style='margin-left: 10px; color:crimson; cursor:pointer' onclick='publish(this, " + serial + ")'>发布(" + serial + ")</span>"
                })
            }
            if (name != solder) {
                comment.firstChild.firstChild.innerHTML += "<span style='margin-left: 10px; color:green; cursor:pointer' onclick='sell(this)'>出品</span>"
            }

        })

        document.querySelector("#comment_context").onblur = function () {
            let value = document.querySelector("#comment_context").value
            value = value.replace("https://", "")
            value = value.replace("?status=thanks", "")
            document.querySelector("#comment_context").value = value
        }

        let scrollToTop = document.createElement("div")
        scrollToTop.innerHTML = "UP"
        scrollToTop.style.cssText = "position: fixed;width: 45px;height: 45px;z-index: 999; border-radius: 50%;background-color: white; bottom: 20px; right: 20px; line-height: 45px; text-align: center; color: black; border: 1px solid black; box-shadow: rgb(0 0 0 / 50%) 0px 0px 5px; cursor: pointer;";
        scrollToTop.onclick = function () { window.scrollTo(0, 0) }
        document.body.appendChild(scrollToTop)

        setTimeout(function () {
            window.scrollTo(0, document.querySelector(".post-button").offsetTop - 600)
        }, 1000)


        setInterval(function () {
            document.querySelectorAll(".ui-dialog").forEach((item) => item.remove())
            document.querySelectorAll(".ui-widget-overlay").forEach((item) => item.remove())
        }, 10e3)

    }
})

function ready(fn) {
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function () {
            document.removeEventListener('DOMContentLoaded', arguments.callee);
            fn();
        });
    } else if (document.attachEvent) {
        document.attachEvent('onreadystatechange', function () {
            if (document.readystate == 'complete') {
                document.dispatchEvent('onreadystatechange', arguments.callee);
                fn();
            }
        })
    }
}

function setCookie(name, value) {
    let hour = 24 * 30;
    let exp = new Date();
    exp.setTime(exp.getTime() + hour * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
}

function getCookie(name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}