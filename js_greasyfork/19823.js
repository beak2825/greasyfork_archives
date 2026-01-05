// ==UserScript==
// @name        Tiny-Customize
// @description 为常用网站添加功能定制。例如：3DMGame、贴吧、淘宝、京东、GitHub...
// @homepageURL https://github.com/nonoroazoro/firefox/tree/master/scripts/tiny-customize
// @namespace   https://greasyfork.org/zh-CN/scripts/19823-tiny-customize
// @author      nonoroazoro
// @match       /^https?:\/\/(.+\.)?github\./
// @match       http://bbs.3dmgame.com/*
// @match       http://bbs.kafan.cn/*
// @match       http://css-blocks.com/*
// @match       http://forum.gamer.com.tw/*
// @match       http://subhd.com/*
// @match       http://tieba.baidu.com/*
// @match       http://www.ruanyifeng.com/*
// @match       https://auth.alipay.com/*
// @match       https://forum.gamer.com.tw/*
// @match       https://kbs.sports.qq.com/*
// @match       https://login.taobao.com/*
// @match       https://login.xiami.com/*
// @match       https://passport.jd.com/*
// @match       https://poe.ninja/*
// @match       https://poedb.tw/*
// @match       https://sparticle999.github.io/*
// @match       https://sudos.help/*
// @match       https://wiki.d.163.com/*
// @match       https://www.chiphell.com/*
// @version     1.4.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19823/Tiny-Customize.user.js
// @updateURL https://update.greasyfork.org/scripts/19823/Tiny-Customize.meta.js
// ==/UserScript==

const host = window.location.host;
const href = window.location.href;

/**
 * 获取立即执行的操作。
 */
const getInstantActions = () =>
{
    const actions = [];

    if (host === "forum.gamer.com.tw")
    {
        // 巴哈姆特。

        // 反反广告检测。
        actions.push(() =>
        {
            if (window.AntiAd)
            {
                window.AntiAd.check = _noop;
                window.AntiAd.block = _noop;
                window.AntiAd.verifyLink = () => false;
            }
        });
    }
    else if (host === "www.ruanyifeng.com")
    {
        const elem = document.querySelector("#main-content");
        if (elem)
        {
            const backup = elem.innerHTML;
            setTimeout(() =>
            {
                elem.innerHTML = backup;
                if (elem.previousElementSibling)
                {
                    elem.previousElementSibling.remove();
                }
            }, 1001);
        }
    }
    else if (
        host === "bbs.kafan.cn" ||
        host === "bbs.3dmgame.com" ||
        host === "www.chiphell.com"
    )
    {
        // 卡饭、3DMGame、Chiphell 论坛（Discuz 驱动的论坛）。

        // 屏蔽方向键翻页。
        actions.push(() =>
        {
            if (window.keyPageScroll)
            {
                window.keyPageScroll = _noop;
            }
        });
    }
    else if (host === "poedb.tw")
    {
        // 流亡编年史。

        actions.push(() =>
        {
            const elem = document.querySelector(".itemBoxContent .lc") || document.querySelector(".TextDivinationCard .ItemType");
            if (elem)
            {
                if (href.includes("/tw/") || href.includes("/us/"))
                {
                    elem.style.cursor = "pointer";
                    elem.style.color = "var(--lightning-color)";
                }

                elem.addEventListener("click", e =>
                {
                    if (href.includes("/tw/"))
                    {
                        window.open(
                            `https://pathofexile.tw/trade/search/魔影墓場?q={"query":{"type":"${e.target.textContent}","status":{"option":"online"},"filters":{"trade_filters":{"filters":{"price":{"min":2}}}}}}`,
                            "_blank"
                        );
                    }
                    else if (href.includes("/us/"))
                    {
                        window.open(
                            `https://www.pathofexile.com/trade/search/Necropolis?q={"query":{"type":"${e.target.textContent}","status":{"option":"online"},"filters":{"trade_filters":{"filters":{"price":{"min":2}}}}}}`,
                            "_blank"
                        );
                    }
                }, true);
            }
        });
    }
    else if (host === "subhd.com")
    {
        // Sub HD

        // 禁止弹窗。
        actions.push(() =>
        {
            window.open = _noop;
        });
    }
    else if (host === "login.taobao.com")
    {
        // 淘宝。

        // 默认显示密码登录（而非 QR 码登录）界面。
        actions.push(() =>
        {
            _disableQRLogin(
                ".login-switch, .login-tip, .iconfont.quick, .quick-form",
                ".static-form, .iconfont.static",
                `input[name="TPL_username"]`
            );
        });
    }
    else if (host === "auth.alipay.com")
    {
        // 支付宝。

        // 默认显示密码登录（而非 QR 码登录）界面。
        actions.push(() =>
        {
            _disableQRLogin(
                "#J-qrcode",
                "#J-login",
                "#J-input-user"
            );
        });
    }
    else if (host === "passport.jd.com")
    {
        // 京东。

        // 默认显示密码登录（而非 QR 码登录）界面。
        actions.push(() =>
        {
            _disableQRLogin(
                ".login-tab, .login-box > .mt.tab-h, .qrcode-login, #qrCoagent",
                ".login-box, #entry",
                `input[name="loginname"]`
            );
        });
    }
    else if (host === "login.xiami.com")
    {
        // 虾米。

        // 默认显示密码登录（而非 QR 码登录）界面。
        actions.push(() =>
        {
            _disableQRLogin(
                ".login-switch, .login-qrcode, .qrcode-tips",
                ".login-xm",
                `input[name="account"]`
            );
        });
    }
    else if (/^(.+\.)?github\./.test(host))
    {
        // GitHub。

        // 禁用快捷键: "s"，"w"。
        _disableKeydown("s w");
    }
    else if (host === "css-blocks.com")
    {
        // css-blocks

        // 禁用快捷键: "s"，"w"。
        _disableKeydown("s w 1 2");
    }

    return actions;
};

/**
 * 获取延迟执行的操作。
 */
const getLazyActions = () =>
{
    const actions = [];

    if (host === "forum.gamer.com.tw")
    {
        // 巴哈姆特。

        // 自动开启图片。
        actions.push(() =>
        {
            if (window.forumShowAllMedia)
            {
                window.forumShowAllMedia();
            }
        });
    }
    else if (host === "tieba.baidu.com")
    {
        // 贴吧。

        // 删除广告贴。
        actions.push(() =>
        {
            let spans;
            const elements = document.querySelectorAll("#j_p_postlist > div");
            elements.forEach((e) =>
            {
                spans = e.querySelectorAll(".core_reply_tail span");
                for (const s of spans)
                {
                    if (s.innerText.trim() === "商业推广")
                    {
                        e.remove();
                        break;
                    }
                }
            });
        });
    }
    else if (host === "kbs.sports.qq.com")
    {
        // 删除比赛剧透。
        const elements = document.querySelectorAll(".video-item .title");
        elements.forEach((e) =>
        {
            e.textContent = e.textContent.slice(0, e.textContent.indexOf(" "));
        });
    }
    else if (host === "sparticle999.github.io")
    {
        // 自动重复点击 Gain。
        const elements = document.querySelectorAll(".gainButton > .btn");
        elements.forEach((e) =>
        {
            const handler = e.onclick;
            e.onclick = () =>
            {
                for (let i = 0; i < 10000; i++)
                {
                    handler();
                }
            };
        });
    }
    else if (host === "wiki.d.163.com")
    {
        // 底部总览框置顶。
        const parent = document.getElementById("bodyContent");
        const elements = document.querySelectorAll("#bodyContent > .Allbox");
        parent.prepend(...elements);
    }
    else if (host === "sudos.help")
    {
        // 转换交易地址为 PoE TW。
        document.addEventListener("click", (e) =>
        {
            if (e.target.tagName === "A" && e.target.href && e.target.href.includes("www.pathofexile.com/trade/search"))
            {
                e.target.href = decodeURIComponent(e.target.href)
                    .replace("www.pathofexile.com", "pathofexile.tw")
                    .replace("Filled Coffin", "滿靈柩")
                    .replace("Necropolis", "魔影墓場");
            }
        }, true);
    }
    else if (host === "poe.ninja")
    {
        // 转换 Wiki 地址为 PoEDB。
        document.addEventListener("click", (e) =>
        {
            if (
                e.target.tagName === "A"
                && e.target.className
                && e.target.className.includes("wikiLink")
                && e.target.href
                && e.target.href.includes("poewiki.net/wiki")
            )
            {
                e.target.href = e.target.href.replace("poewiki.net/wiki", "poedb.tw/tw").replaceAll("%20", "_").replaceAll(" ", "_");
            }
        }, true);
    }

    return actions;
};

/**
 * 立即执行指定的操作。
 */
const exec = (p_actions) =>
{
    p_actions.forEach(p_action => p_action());
};

exec(getInstantActions());
exec(getLazyActions());

function _noop() { }

/**
 * 禁止键盘快捷键（单键）。
 */
function _disableKeydown(p_keys)
{
    if (typeof p_keys === "string")
    {
        const keys = p_keys.split(/\W+/);
        document.addEventListener("keydown", (e) =>
        {
            if (keys.indexOf(e.key.toLowerCase()) !== -1)
            {
                e.stopPropagation();
            }
        }, true);
    }
}

/**
 * 默认显示密码登录（而非 QR 码登录）界面
 */
function _disableQRLogin(p_hide, p_show, p_focus)
{
    // 删除扫码登录。
    let elements = document.querySelectorAll(p_hide);
    elements.forEach(e => e.remove());

    // 始终显示密码登录。
    elements = document.querySelectorAll(p_show);
    elements.forEach(e => e.setAttribute("style", "display: block !important; visibility: visible !important;"));

    // 自动聚焦用户名输入框。
    if (p_focus)
    {
        const elem = document.querySelector(p_focus);
        if (elem)
        {
            setTimeout(() => elem.select(), 300);
        }
    }
}
