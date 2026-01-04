// ==UserScript==
// @name            Kemono跳转-e
// @description     在一些特定网站添加跳转至kemono按钮
// @version         1.0.5
// @author          Ealvn
// @license         MIT
// @match           https://*.pixiv.net/*
// @match           https://*.dlsite.com/*/RG*.html
// @match           https://*.fantia.jp/fanclubs/*
// @match           https://*.fantia.jp/posts/*
// @match           https://*.fanbox.cc/*
// @match           https://*.patreon.com/user?u=*
// @icon            https://kemono.cr/static/favicon.ico
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @namespace https://greasyfork.org/users/1377032
// @downloadURL https://update.greasyfork.org/scripts/533873/Kemono%E8%B7%B3%E8%BD%AC-e.user.js
// @updateURL https://update.greasyfork.org/scripts/533873/Kemono%E8%B7%B3%E8%BD%AC-e.meta.js
// ==/UserScript==



(function () {

    const language = navigator.language || navigator.userLanguage;

    var openInNew = GM_getValue('OpenInNew', false);

    let openInNewId = GM_registerMenuCommand(`[${openInNew ? "✔" : "✖"}]新建标签页打开`, openInNew_callback);

    function openInNew_callback() {
        GM_unregisterMenuCommand(openInNewId);
        openInNew = !openInNew;
        GM_setValue('OpenInNew', openInNew);
        openInNewId = GM_registerMenuCommand(`[${openInNew ? "✔" : "✖"}]新建标签页打开`, openInNew_callback);
    }

    var domain = GM_getValue('Domain', 'kemono.cr');

    let domainId = GM_registerMenuCommand(`当前域名：${domain}`, domain_callback);

    function domain_callback() {
        var result = prompt(language === 'zh-CN' ? '请输入域名, 例如kemono.cr' : 'Please enter the domain name, for example kemono.cr', domain);
        if (!result) return;
        domain = result;
        GM_setValue('Domain', domain);
        GM_unregisterMenuCommand(domainId);
        domainId = GM_registerMenuCommand(`当前域名：${domain}`, domain_callback);
    }



    //创建容器
    const item = document.createElement('item');
    item.id = 'SIR';
    item.innerHTML = `
        <button class="SIR-button">跳转至Kemono</button>
        `;

    document.body.append(item)

    //创建样式
    const style = document.createElement('style');
    style.innerHTML = `
        /* Light mode */
        @media (prefers-color-scheme: light) {
            #SIR * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
            }
            #SIR .SIR-button {
                display: inline-block;
                height: 22px;
                margin-right: 10px;
                opacity: 0.5;
                background: white;
                font-size: 13px;
                padding:0 5px;
                position:fixed;
                bottom:2px;
                right:2px;
                border: solid 2px black;
                z-index: 9999;
            }
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
            #SIR * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
            }
            #SIR .SIR-button {
                display: inline-block;
                height: 22px;
                margin-right: 10px;
                opacity: 0.5;
                font-size: 13px;
                padding:0 5px;
                position:fixed;
                bottom:2px;
                right:2px;
                border: solid 2px white;
                z-index: 9999;
            }
        }
        
        `;

    const button = item.querySelector('.SIR-button')
    button.onclick = async () => {
        var url = await getKemonoUrl(window.location.href, domain);
        if (openInNew) {
            window.open(url);
        } else {
            self.location = url;
        }
    }

    document.head.append(style)

})();

async function getKemonoUrl(url, domain) {

    function getFanbox(creatorId) {
        return new Promise((resolve, reject) => {
            fetch(`https://api.fanbox.cc/creator.get?creatorId=${creatorId}`, {
                method: "get",
                credentials: "include"
            })
                .then(r => {
                    if (r.ok) {
                        return r.json()
                    } else {
                        reject({ status: r.status, statusText: r.statusText })
                    }
                })
                .then(data => resolve(data))
                .catch(e => reject(e))
        })
    }

    const pixiv_user = /https:\/\/www\.pixiv\.net\/users\/(\d+)/i;
    const pixiv_artworks = /https:\/\/www\.pixiv\.net\/artworks\/(\d+)/i;
    const fantia_user = /https:\/\/fantia\.jp\/fanclubs\/(\d+)(\/posts(\S+))?/i;
    const fantia_post = /https:\/\/fantia\.jp\/posts\/(\d+)?/i;
    const fanbox_user1 = /https:\/\/www\.fanbox\.cc\/@([^/]+)(\/posts\/(\d+))?/i;
    const fanbox_user2 = /https:\/\/(.+)\.fanbox\.cc(\/posts\/(\d+))?/i;
    const fanbox_post = /https:\/\/(.+)\.fanbox\.cc\/posts\/(\d+)"/i;
    const dlsite_user = /https:\/\/www.dlsite.com\/.+?\/profile\/=\/maker_id\/(RG\d+).html/i;
    const patreon_user1 = /https:\/\/www.patreon.com\/user\?u=(\d+)/i;
    const patreon_user2 = /https:\/\/www.patreon.com\/(\w+)/i;

    let service;
    let id;
    let post = null;

    if (pixiv_user.test(url)) {
        //pixiv artist
        service = "fanbox"
        id = url.match(pixiv_user)[1]
    } else if (pixiv_artworks.test(url)) {
        //pixiv artworks
        service = "fanbox";
        var a_element = document.querySelector("div.sc-b6a5d604-1>a");
        var artist = a_element.getAttribute("data-gtm-value");
        try{
            var intro = document.querySelector("div.sc-fcc502d1-0").innerHTML;
            console.log(intro);
            if (fanbox_post.test(intro)) {
                post = intro.match(fanbox_post)[2]
            }
        }catch (e) {
            console.log(e);
        }
        if (artist) {
            id = artist
        } else {
            window.alert("try get artist id failed")
            return;
        }
    } else if (fantia_user.test(url)) {
        //fantia
        service = "fantia";
        id = url.match(fantia_user)[1];
    } else if (fantia_post.test(url)) {
        service = "fantia";
        post = url.match(fantia_post)[1];
        var u_element = document.querySelector("div.fanclub-header>a").getAttribute("href");
        id = u_element.toString().split("/").pop();
    
    }else if (dlsite_user.test(url)) {
        service = "dlsite";
        id = url.match(dlsite_user)[1];
    } else if (fanbox_user1.test(url) || fanbox_user2.test(url)) {
        //fanbox
        service = "fanbox";
        let matches = fanbox_user1.test(url) ? url.match(fanbox_user1) : url.match(fanbox_user2);
        id = (await getFanbox(matches[1])).body.user.userId;
        post = matches[3];
    } else if (patreon_user1.test(url)) {
        // patreon
        service = "patreon"
        id = url.match(patreon_user1)[1]
    } else {
        window.alert("unknown")
        return;
    }

    return `https://${domain}/${service}/user/${id}` + (post == null ? '' : `/post/${post}`)

}
