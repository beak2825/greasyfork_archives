// ==UserScript==
// @name      🥇【学习通助手】【free】 全自动刷课脚本|可调节倍速|自答题目🏆
// @namespace    unrival
// @version      5.0 
// @description  上次更新：2024.1.1【可最小化】·支持超星视频、文档、答题、自定义正确率、掉线自动登陆·取消视频文件加载，多开也不占用网速，自定义答题正确率，提高学习效率·每日功能测试，在发现问题前就解决问题，防清进度，无不良记录
// @author       unrival
// @run-at       document-end
// @storageName  unrivalxxt
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @match        *://*.ac.cn/*
// @icon         http://pan-yz.chaoxing.com/favicon.ico
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_info
// @connect      mooc1-1.chaoxing.com
// @connect      mooc1.chaoxing.com
// @connect      mooc1-2.chaoxing.com
// @connect      passport2-api.chaoxing.com
// @connect      14.29.190.187
// @connect      cx.icodef.com
// @license      GPL-3.0-or-later
// @original-script https://scriptcat.org/script-show-page/878/
// @original-author unrival
// @original-license GPL-3.0-or-later


//安全网址请填写在上方空白区域
// @downloadURL https://update.greasyfork.org/scripts/484657/%F0%9F%A5%87%E3%80%90%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B%E3%80%91%E3%80%90free%E3%80%91%20%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%7C%E5%8F%AF%E8%B0%83%E8%8A%82%E5%80%8D%E9%80%9F%7C%E8%87%AA%E7%AD%94%E9%A2%98%E7%9B%AE%F0%9F%8F%86.user.js
// @updateURL https://update.greasyfork.org/scripts/484657/%F0%9F%A5%87%E3%80%90%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%8A%A9%E6%89%8B%E3%80%91%E3%80%90free%E3%80%91%20%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%7C%E5%8F%AF%E8%B0%83%E8%8A%82%E5%80%8D%E9%80%9F%7C%E8%87%AA%E7%AD%94%E9%A2%98%E7%9B%AE%F0%9F%8F%86.meta.js
// ==/UserScript==
(() => {
  //  var token = 'dampmQGPizKmgwAI', //我从未拥有你，却失去你千万次.
   var token = GM_getValue('tikutoken'),
        jumpType = 1, // 0:智能模式，1:遍历模式，2:不跳转，如果智能模式出现无限跳转/不跳转情况，请切换为遍历模式
        disableMonitor = 0, // 0:无操作，1:解除多端学习监控，开启此功能后可以多端学习，不会被强制下线。
        accuracy = 0, //章节测试正确率百分比，在答题正确率在规定之上并且允许自动提交时才会提交答案
        randomDo = 1, //将0改为1，找不到答案的单选、多选、判断就会自动选【B、ABCD、错】，只在规定正确率不为100%时才生效
        backGround = 0, //是否对接超星挂机小助手，需要先安装对应脚本
        //-----------------------------------------------------------------------------------------------------
        autoLogin = 0, //掉线是否自动登录，1为自动登录，需要配置登录信息（仅支持手机号+密码登陆）
        phoneNumber = '', //自动登录的手机号，填写在单引号之间。
        password = ''; //自动登录的密码，填写在单引号之间。
    //-----------------------------------------------------------------------------------------------------
    var host = 'http://14.29.190.187:54223/',
        rate = GM_getValue('unrivalrate', '1'),
        ctUrl = 'https://cx.icodef.com/wyn-nb?v=4',
        getQueryVariable = (variable) => {
            let q = _l.search.substring(1),
                v = q.split("&"),
                r = false;
            for (let i = 0, l = v.length; i < l; i++) {
                let p = v[i].split("=");
                p[0] == variable && (r = p[1]);
            }
            return r;
        },
        getCookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift(),
        isCat = GM_info.scriptHandler == 'ScriptCat',
        _w = unsafeWindow,
        _d = _w.document,
        _l = _w.location,
        _p = _l.protocol,
        _h = _l.host,
        //isEdge = _w.navigator.userAgent.includes("Edg/"),
        isFf = _w.navigator.userAgent.includes("Firefox"),
        isMobile = _w.navigator.userAgent.includes("Android"),
        stop = false,
        handleImgs = (s) => {
            imgEs = s.match(/(<img([^>]*)>)/);
            if (imgEs) {
                for (let j = 0, k = imgEs.length; j < k; j++) {
                    let urls = imgEs[j].match(
                        /http[s]?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+/),
                        url;
                    if (urls) {
                        url = urls[0].replace(/http[s]?:\/\//, '');
                        s = s.replaceAll(imgEs[j], url);
                    }
                }
            }
            return s;
        },
        trim = (s) => {
            return handleImgs(s).replaceAll('javascript:void(0);', '').replaceAll("&nbsp;", '').replaceAll("，", ',').replaceAll(
                "。", '.').replaceAll("：", ':').replaceAll("；",
                    ';').replaceAll("？", '?').replaceAll("（", '(').replaceAll("）", ')').replaceAll("“", '"')
                .replaceAll("”", '"').replaceAll("！", '!').replaceAll("-", ' ').replace(/(<([^>]+)>)/ig, '')
                .replace(/^\s+/ig, '').replace(/\s+$/ig, '');
        },
        cVersion = 999,
        classId = getQueryVariable('clazzid') || getQueryVariable('clazzId') || getQueryVariable('classid') ||
            getQueryVariable('classId'),
        courseId = getQueryVariable('courseid') || getQueryVariable('courseId'),
        UID = getCookie('_uid') || getCookie('UID'),
        FID = getCookie('fid'),
        jq = _w.top.$ || _w.top.jQuery;
    _w.confirm = (msg) => {
        return true;
    }
    setInterval(function () {
        _w.confirm = (msg) => {
            return true;
        }
    }, 2000);
    if (parseFloat(rate) == parseInt(rate)) {
        rate = parseInt(rate);
    } else {
        rate = parseFloat(rate);
    }
    try {
        _w.top.unrivalReviewMode = GM_getValue('unrivalreview', '0') || '0';
        _w.top.unrivalDoWork = GM_getValue('unrivaldowork', '1') || '1';
        _w.top.unrivalAutoSubmit = GM_getValue('unrivalautosubmit', '1') || '1';
        _w.top.unrivalAutoSave = GM_getValue('unrivalautosave', '0') || '0';
    } catch (e) { }
    if (_l.href.indexOf("knowledge/cards") > 0) {
        let allowBackground = false,
            spans = _d.getElementsByTagName('span');
        for (let i = 0, l = spans.length; i < l; i++) {
            if (spans[i].innerHTML.indexOf('章节未开放') != -1) {
                if (_l.href.indexOf("ut=s") != -1) {
                    _l.href = _l.href.replace("ut=s", "ut=t").replace(/&cpi=[0-9]{1,10}/, '');
                } else if (_l.href.indexOf("ut=t") != -1) {
                    spans[i].innerHTML = '此课程为闯关模式，请回到上一章节完成学习任务！'
                    return;
                }
                break;
            }
        }
        _w.top.unrivalPageRd = String(Math.random());
        if (!isFf) {
            try {
                cVersion = parseInt(navigator.userAgent.match(/Chrome\/[0-9]{2,3}./)[0].replace('Chrome/', '')
                    .replace('.', ''));
            } catch (e) { }
        }
        var busyThread = 0,
            getStr = (str, start, end) => {
                let res = str.substring(str.indexOf(start), str.indexOf(end)).replace(start, '');
                return res;
            },
            scripts = _d.getElementsByTagName('script'),
            param = null;
        for (let i = 0, l = scripts.length; i < l; i++) {
            if (scripts[i].innerHTML.indexOf('mArg = "";') != -1 && scripts[i].innerHTML.indexOf(
                '==UserScript==') == -1) {
                param = getStr(scripts[i].innerHTML, 'try{\n    mArg = ', ';\n}catch(e){');
            }
        }
        if (param == null) {
            return;
        }
        try {
            vrefer = _d.getElementsByClassName('ans-attach-online ans-insertvideo-online')[0].src;
        } catch (e) {
            vrefer = _p + '//' + _h + '/ananas/modules/video/index.html?v=2022-1118-1729';
        }
        GM_setValue('vrefer', vrefer);
        GM_setValue('host', _h);
        var base222 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbQAAAG0CAIAAADVVkURAAAACXBIWXMAAA7zAAAO8wEcU5k6AAAAEXRFWHRUaXRsZQBQREYgQ3JlYXRvckFevCgAAAATdEVYdEF1dGhvcgBQREYgVG9vbHMgQUcbz3cwAAAALXpUWHREZXNjcmlwdGlvbgAACJnLKCkpsNLXLy8v1ytISdMtyc/PKdZLzs8FAG6fCPGXryy4AAGabklEQVR42uydaZdkWVm2T0RkZs090C10NzIIKKgoCogIKqKCgKDtBGsJS9TlT/AH+Cv86LBQZBJppYGXGQQZnEURVOYe6LnmysrKjHivOFfGXbtOZEZGnszKyqw6ezVBVGTEGfZ59r3vZ+6NRqOqG93oRje6ceXod1PQjW50oxsdOHajG93oRgeO3ehGN7rRgWM3utGNbnTg2I1udKMbHTh2oxvd6EYHjt3oRje60YFjN7rRjW504NiNbnSjGx04dqMb3ehGB47d6EY3utGBYze60Y1udODYjW50oxsdOHajG93oRjc6cOxGN7rRjQ4cu3H1xtra2rAeq6urfsKbS5cu+Sc/uXjx4k6OX76nAinHH9Ujf+J0y8vL3bPoRgeO3dhHyLguSf3+wsIC/1xZWen1evyz/NpgMOC1XWVlfgvyeiLec3CgkFf+ySt/4s3i4uLhw4e7x9GNXRy9rhJ4N3YykB8QCuQ6c+bMuXPnTp8+DUTeeeed/On48ePyO4DSr/m6reODfeKsbzjRQw899MQTT3CWY8eOPelJTzp69GgOmy93oxs7HwvdFFz34LXxrrhNkNpswBNhc1/5ylc+//nPf/Ob3zx58uQtt9zy/Oc//4d/+Ief97znQeh2eHw06KWlJd8/+uijX/rSl/7t3/7tkUcegTzeddddL3nJS37kR34ElJSrdsjYjQ4cu7FfBvAHlfv0pz/9zne+83//93+xLd58883f933f95a3vOX222+HQorCkrsWiAxD9A209J/+6Z/e9a53ffaznz116hSg+ZSnPAU4BhBf+MIXHjp0qAUt7UY3OnDsxtUaYNM3vvGNz33uc//6r/+KZg2WnT9//vHHH3/Oc57zghe8QP26amtt9PgqyxcuXPiv//ovTvQ///M//umxxx7j8x/8wR+EPAKOwOXOiWo3unFZ9ropuO7V6g3Hbh0fKPzP//zP//iP/wAZxTIUXpjdl7/8ZZRflG4dJiq87c6rE5wTffvb30az5lBAoYzyu9/9LtDMn/xaZ0DvRgeO3dhHzBFYJIxG+AMZdSuDjGfPns0/o1y3OAUIyytnefDBB4Fd0BblHSgUiGGp4nK1e4bUbnSjU6uvN4YoQgEchryAWQS44NuFXt1///0QLvTcJ9dDnDIUhveGy7RwaABPt956K/qsDDG+abTgr33ta/wVbwn42Pr4DG6BAz788MMck/dGUFa1b5rrP3HihHFC8dtsd95K7OYNZ0Fh5+LB4qc97Wnf//3fzymOHDnSyVgHjt04kMNAmfKfvt533314Sz7xiU+Aj0AYrpKXvexlP//zP4+rt2R/rc9LJA3YwWvwxQG5A5oTFr6TIexyKI6pBo1O7ZF5A2wB+tUklLLFvFV1tKbbCcf/fD0wFMBSb7rpJiynr3nNa378x3+8o6UdOHbjAA/JVJYx/yT25Z577vnYxz4GG+JzAgNReHEoQx412/n91oZIMCXgWPqLQUbUajXiXcF9wTGh4Obk8Ce4JDditkxc2y34o/iI+/vee+/927/92+985zueAovqbbfd9sxnPpOwzXbktBsH1WTUTcH1pFmXbEjbHOE1//3f/41hDtrI50AkbuUvfOEL0KKQsmoH3mR+CHdT81Wn9uzAIsE3gmOD1bbAX34O1ELrAr7iFKcLOLY7hUo6R+DIRLAzOTjE/+///k+zJogJSvKhWNnJWAeO3TjAynWYIMueFc6CJzC7hC0cviAm6naMd1VhK9zuGYEPKBXksaF1AiVgmfnOuarWN8VxsDliPOU9sBiKCjJK6ExebK1Wi7PsHPBEyGM1yVPk+EAkn/Anz9vJWAeO3Tio4CjSqRJWkzjBauJH5gsg5gMPPAA5AnFKBbwdeAEiqOoonlI5T+0bmCPOjaowgLYjX1owORpom+v0yDfXQ2tju+vXfKlXCoMDOCgEO28wX++Ir+kc72SsA8duHMBnOfGriEGsZwCLZD78FejUZtfxCQseFAAcwZcAipyoHTOCu+G4CDiGUaIIg2gbKv7bBUcYHPjLvaiwexzUebzJd9xxB3cnwLW2DOik/ta3vkUoZVndR1jEeYVHvhOwDhy7cbBpYzCIVQ2mkMPHK38SPiwvBmyZnrzzk3JYUbjh8uZEOqx3qIomXucZz3gGIKVuK5xxa36oCrwTtV0/NchI+I5Tx+RwLj43/gn05446h0wHjt24uiNlvoxH4Z9hK43Yl3YJLTAp8QJuBYIAHwEO1UP8M4AjOdGeES7WetlzLuAD7DCeJtUfuAB8PqBwYmUShrldcPRXINRLX/rS5z73uTfVA13+xS9+MTFJT33qUz1vu7AhuSG/5WoBR2aGG3Hb4JW7gDM+/elP53Tt9pKyGGWeY4weeegcvDNo7rfRhfLs3cg6b1C81DrM8tjFGgrEoBDb+I//+I/wOM4uCqNCQpFwcRglPs09t4uPRHobJq1XR4oqc/SuWzM7J4eDAI6vetWrUK5RfjksaEXhnx/90R/1vBy8XWK1FyyUOyElCFp+Tc29XRylrvbEUcboUQZd6UrSxOke040OHG9QcKyKJBZZm0sotCshew0YbYFfwBbcyqOBIwAWl8EKhDbCkvjnzsGRYahjNakK7ocoqoY6qte31nmlhFDgn/qpn4I54m3nyIZqQuv0yxuL05rIM/+kacMcY9DU489hyZBhgxEctSG0OL781PdldTU3EjcPc8a7ZdKB4w09QhJZMKxGeJwOWdaGELMhRrRTuwDEZz/72fAsglEAEYGGM4IvpZ7bbtmH5AJVuGWqInDSs5D1LP7uhAi7c1R1bOP3fM/3QB6le7ng0hPVQnPnUDwFIhnBx3B5nxFX/qxnPQvmuBMTSq7Tucr+B0vldbEeXTHKDhw7WLxcEDtKFjW4SHyGx4EvkBTWP1xvtzRrmONz60H6oAojEMxJWf9gjY0NgpItTsr3OQjgm5AaiZhqteC4Q1uBc2WPGl6j4YaFxS7RDl+4fhRqtHUCQhvJQvjHeRbMoTPWQrMu7YwyRLYlbBrkblvhDZ8SDx3q7d11Pp8OHG/EkTDssB64A+l9JKuRg8H6ZCliREN5fP3rX6+eWK72duSRX6F+UvHw3//93yFH1SSnhTXJ6VztDWrT4tYgvCbJlJ4fwXFX+l4JfAGO6b4IQnzrOHCQ0dgmZziHJVQId5bJRe3MDtGm4+wmYelTn/rUP/zDP8DlORGW09e+9rU8dOwGpfemGx043igj6y0mLZgCVOWTn/zk+973Pqofagr8+te/DoXEhQJKTqNVi8XJSaF1P/uzP0vgN24ZzsiJIKevfvWrOUtDm2vHvNQNy7o78izTq+OTaY2801uCx4nym+Ce1qf46le/StZQ8nk8Do+Dkr04ZDQK71AA9BexP/HE3/Oe9wCRUEi4PJsWuwhVzQHHnZ+lGx04HrwBggR6XMAsDIgV6hVZGRrs+YR/sop+8id/Eq63W4o8KtvP/dzPcfwf+qEfIv2Dc2GFpPsK2pxZyTtkXnI6EYRhVxldtMCN9W5bmwiCd5KvpAnqyErJtdYlJ8z+BrNQdWNwVGEHHKGNbC3xmLfwuet58wg8X/gpzR7YpTgF2rqFgenAQzYnjXc4Y4ePHTjeeBNdw1AoTzUJkyaHhFcXOZ+DjJDHj3/849TI+omf+Akdnaa1tE4fruocZMgjbNSqtCxCeEoJPTtZkxyTdQ4btTugXl3vBVuBlrWqrSs8v2qY/KJi79CPwbWhU0MbASnep/s254VZA1hMVIJ7WkQL6ZCR26IT/PM///O//Mu/OCE8ep4LT5YpCvvuVkoHjt2oBCnWg1HHIou1/okpoV8KflJWpmu1NTIG/kATA1/iwditYRA4FkxOYb6g92LJWz8pa8ruqwGyM9v4qXkEyUY38hFmbRSUXqB20QJGmLth4HmDNuJ8S8i3oTzMG8cXH7t1sY9WaDcFezziV2HZ4McgTASHSXVlIwHIIwZ7y8NkdVVT+TNzQnAOy9rTQ727IMXRuDxc7SmXLcrwOchobTR7W+/Dx4HhD4MvUy2ap3wRc4UVArdVVOl2DjHtDJZc+7d6MCcaYS2fDnn83u/9XpT3dlWRutGB4/WAiSWbc9mgjb7oRS/C6l8VkSh8jv5FJWrIo7Qr67N14YYyPEV1vjzsDoepHSxyjJseVp7LK4hAzbT9vOa5cnRq1P/GdHEvqNXQ4RhMW9e24OdQRfipMQkeTSrK55BTZAC3eHzi3ejA8YYbJUZoYYRqYVjEFMgiTG6Jjmy4DCpYaguGbLaweZXFHD0aivCG67B1MXAuLHHgmgu4F1a+0eaxDOzDh4K9Dz2Xi4ypQUMEmAWpjxW1utKltq3517BIzJbda1O+yGmhtSxxPJyrQ8YOHDtwvMwiIQtQBgooEOwmoER3JkkO8oh+HW9AuziVRrDkbHbZ4qZUlq1wITj6ifeiIh9w3IcUEj81mZQxXDhjwNkP/MAPEMTTiHNqMf8STwuwE4ef/rF6ycn2wfOG/s4EdpXGO3C8ocGxbOJcTax1aFW/8Au/QKRbdWVdWBYtkTdpbdoOWcrlnZJluwhSHtMCYtjOWOQpbwEswr+AmJKU7beHQryh4BjaDgsG5Yl2gs0ZLZSdrMXx+RX0mdgd9ACMDNUkuIep4CzQRsCRE3XWxg4cb3RwbJBHC09gcyTq0I5XKfyVCoxl7YkWSyg1ctQKWZbtGNCMxS9Eolbj3qW6F9Y6s5L5BLhMEcb9+VDMGgzh1USAowyst7ZuOfPtyB0xjJ/97GexIKcFrkeDNlLVwlD81rmP3bh6owvl2RpchBILQ4QuKehZMElimxElU1KP0gLIK0ocKSuo0qWREW2L4BvU6p0Ua5nT67LDIG3gD/vA6173OuYB/REPNW/gRL/4i78I6MuVWpd0zFlAMcEdR5afp16Gb2ZbHson6MajVRdC57axWg+OAKaTjZ5+D4lC3/LiIwApkQltJPCApl1YG93qEmTOKZgxwLHagUF2w9B0rzkNGhvm1G5Rd+C4a2qjsuW6SgtQl3pJ60op3O7xQRas8rAYjgMEsK6I7UDnIpTEkmIpcbbf5icrUyWRDQAXk0ky6NSQYs0F1c7izL9VD/RfdV5OBLNDhc8x5wGX0p2lKRarBRuSCY75ExPONacrzpxbSNC5Khry8AabJpwRCNZ2nMI8Pl/mZ7M6TNsym4SNevBkQOaWDaTtgsw7cNxVu8OVCdFRshrLMoX5WoCLC/JlL3sZ70FDoj2QafTTl7/85c973vME4mpfRlCXWif3DqZYMds8k0P1EDhKpX5bBzeJ6MMf/jCtt3ErMwmw6Ve+8pXU5iBIvkzs25IZyceNuLRyOMjFMfUXJQEcawDaLqZSt6VYe+exDCQXKIVFyAfFT22okE27OB1bCIQRRxzk0WjHHerUZdG2ZII2Lrgza3bgeLVG6hIizVZXLSuPtVZbgn3Ayite8QrYhFoezIhP0p05mt1+2/wDTF6b1QmZHwhR2JOT1lqhpjTDvffeSyUb48kBXN6AjJA7pmj+6xSbApGE7+A+xo/cYIUcFitHjuzkizgzjl8+l1gP6EVhyEE1cb5JUeG8L3jBC9j5Eja/E503m1ODQadOMDKmSWcfyk8Hjgd4uM/LBS7Ww9pTso/IYgtOVG776lzH69E4e+Ms+3CKpm1e5TXvkPAy+ailtJNOI0PmBFAjcht8EcIaJTI3Q5AGW4czchwgMtxQHIf/QttjRSlDfLa0inoEgZhNjjITGByph1RN6llUk6aJqAWQ0+rKqmutM0QzkE+jhbgMLLOmVwUTYyPqRgeOu7PylSqyVr5SD/6J8otCZGSfdaTbGRyrwqFRTRWyLpExvtT9aXYo2VlVdMWJQUAAMkl5W8dnbpl5gEZwkWiTdVMaCueJc2pUfmNuCeLBjumzC3oCKCBjYCuAq8Y9g9zlGqJTc9lwXtOc4o/yFIS1Ypm13esON4+yhDs2WQsnc0b8YIgo/Nqs7YYJshsdOO7CcJ2z+X/iE5/4yEc+gqyzTghPoQgYzfBe+MIXWjyitdpb8gXzMbJgGqK8n/2MQY0S0N0wystuAe4cEMcO7mM5kYDFtsTiN1tRdNgywrxsbWaXatgojzWUU8YHFbWGY1kdMlrCjNprfj9bBT8BeaGNaNbSz6SWc/HQRsij5LQsD9zOrOEbMBHLw0c/+lFqU3J3xE5ixcYbTv6V/LH1KTpw7Mamwodkkxh7bz2M42UNYGhHI0MFg0WWcLDtBzBRfIw3Lp0GfqH0M+7PUAzDXzQsiCDlos0Fe5vbDUvSPMcKhy1q58WaSdg8+xOlgKrtdL8xgMYLg3jijTHCMYZF/kRsI0eW05Vejnlg3SOLg1wt4Eh1sgR+OxVcvD1mSwbNI25djwex4bw4fL7whS9QUv5DH/qQllktntSRw/PD7VgttFvOHTju5oCwINBsy8TxKujWsEIpo4I34Pjrv/7rMd43EmCq+Up1LdSjwRCzGq3AyBvWG7KesD7dwWqI7aJ8GgbNxtWWZb1nm1Mb2DTtGdjwNuffPNBz3/zmNxNhzpxzWPwYOExwXqUHVjVHJdpSqecNsTXQRjtTg2VAsFk96KEcPFGKSWkve2PNUDI4oPsEeydFOYGncqvgTyAv2VBsqKUrZh5kzB5QGhC1VvNzCgu9/e1vp8Y4CjVSIRYTxfkzP/MzxFeyi3QNvDpw3P0BMiJ/uqpjOZLZsQD+3//7fwg6reWRPL+TyNsdqsOqclAbyqNq0Tfhl9WLrOv3nCd+ZR5dOO+ns3H2Q/wHGjQZREAknmWuEG8ymqlu8flvPHcHcPCkmFi2ujT/4hEz4ejpNjhr0eXKCHMNfNj+4HFUJ7NEcRzlfIHquZR55xZabBJV4Qc3DdS6Z9jBP/3pT+Ohshiapl5vlgsQr1unn3bg2I1Zw80ZSCrbvxhCzF6N8QjNBYiMIilJSThuu5PyQ+KTP//5z//1X/81hk4OCCJgyH/jG99I5gwXM93SerujJCwByjRj2WH85i5OPjvBTfXYDNnn3IEavF64MfxIlITWkVKNk22Ht0y+4Be/+EUwy52ymsRmA7uE+hPe2M72V7aySF10lGiEEGs4WzXkt5QKZgznT+IoutyYDhx3eWgm0z2NqZvNOWovb/BIoj0BjijX2JJUeQKOOxFHzZp/93d/h6ETlKzq+D5CQ7AfIfTgYwJHdm5U9dU+Nh6zjJu7tkVqVWnl0dH3NyyaPXsqsnXZ8YZpxM8DDgIoxr6osOONgaHzyXbJo/njunpwGRPbaI3buHQ4rGUmMGuWiYzb2i9Ln7jEEIoKbeSMqcHutsf9IiSckZj2aP3dct7eGuymYEuJRKpImSBNGOKmXSnWJWQRdeaee+7BvpPa9/FO7PDUeAzIUxYZtS5hd4cmAJFlZ5J2Qs8aLolhHCnxqzRsiNdw/vVHhYWpSzZY5Jz4FZTEWAxO0cUMVRrLCQyLfxKBAJrwSQu12hoivKFRF5nUeGPcaXj1aGAiCrWFjVs3MnOv0rWCPxByigcGwwtKTOMLeKsxOMJSLZ/R6dQdc7wKu0cNDZA1Vg77M+Y/lCaNj8aHI4gEhZDchjWQvbqhkbXunQKj4ciuN1mJIb6sB6LnWMmo82Uj7O2eQki1kwE3wum4I24TR4F+nhj+ry3jKFuAlZS8sdq3vP18QRIKbWS34/FhGWSeoXVYA7EdEzOk2aQFfpkawANCp0ZO4vwRjrGZ4nbH2tju4HG7JS8QrYWLx09IKHvYvbfJE8RKS0s1rAQ+Sp1R19ZC0oHjdThckOjO4CNs7gMf+AAewOAjb9i3UW2QftQ0KIl9WnZusMMJzlqyCUk+hEgSPQcKoy6BZa2P7xUC9PAOApVYaSweboGgGe4U9pRMj33F4hNMXgY2zrkxJJHRn3OnzCEhh9qUb69HHut28ctjIh4gI69BKz0k+pTwp7UuM6HqIAl1SyNlW1NjfO4xOIDCv/RLv8QOCujrnNlJm40OHLsxS+jFCHQuSh6gRwMoLB5hy7AJokwIwUX7ZrtOp8CdGB/Z/LHfA446QNXO0KQsuA95JMViJ64DVhRXzqHe+9734vYhVgmkgD397u/+Ljom4Fge9hrm5AYNq6LkTGK5N3xYmx0nd6GRkRnGTIw1ORTVLts24N7udWpGRLfg0WCy8HQSPa4KrYLYTOhqLmC74FveF8eHLaK8U4/DqEaeF3Cpzx2If0k9ON2leoDIm8VXdaMDxx2p1UmbhamBffBEOnmCJrF88YZF9ZnPfAauB0dgGVR1V2JQxg2/XbUenKevetWroHWQkcTWsKjgrRBVknOEztmMYDNcBgIInOSayanATCboYNBcqgf8t8zyng3uZQie32SKOLjdY7B5CUB80vA4T+O1Fs/SFqEfmbBEIwQ4AmueKBzmdvqqZsxzMpGMt/d0CXyxI2NZ7XGzXtuNwpG+4UPMETypv//7v2e/IU5IWHQHYgZ4WEgFPI7biWKxXbXay+YIhArBGbF0o0aoL9vFzCDzn/7pn/6VX/kVWCpYb+He+Y0P3ejAcXvMUVWFhcf+zPqBst19991/8id/ouda3EQKwQI813g88YTyqkazk+BbsA/9COUI1YkQP9cwR9MSD3HgrymVul2NiTVmNUMrL3Bw1xLhxCb/mDZucsiWQeBJo+bL7Bx0BeDyzD8BGanjy13MRsaqKFdRxp9DkeBiWNa4WgAIewIKI26N7a7zzE9YoZGSJeWMw2cGeCW/WwtgWW2XqSPoiuvMTuZF8oy4bDwkZeB3CzOINhwAFzcdkobPJ0WGrMAGeiKcv/zLv8zpFJXGg+uK3XbguMvMsYwCYR9GuUb+KEXF+ocwShv9KyY8wsK/tx6Ai4FprQtSIOvs/0TGsRgAR8/lgoQ7cHZyLVh47XRea3bBONDRUmeQM0J/WORwSSiwzoRkNG5pDVTjw3H/p3/6p4SYcHAumKkAdtH18CDNvtQystKTwhBhze95z3tQ/NmKABfMF/z1TW96E/xxu+AisdWfmzf2RSi/M/tmxdMygtXgBJ4IF4m9Jdl73gVTyh72Yz/2Y2m60NoS4mWjspDmz/Rabl3VRKTGSoBIsBUxOdOewM7guO21303BliPr2aQ9+CM782tf+1r4S5mkoYIDsqCcQp0sJBN7WQvwMnORcBOWlhmKCePgRKAYMGRdgxbHhwIfqUcZD6SaCSWxcnWCZrSrbjjiLLLNANcD0WMGgNez9cBEixEAUNuyJGJCAn3DBeAmIj3Z8g3ALjsE6IOhjfCAcs3P2V1nRhWfklfOfl4NXEvWDdZG9jB2x5IC82pRW7zGuc528uAzYlZBRjYMkJFHE1hn0tjMqDRhl9cNC7jtVpvyDhy7ccXaC7NAvAAUrIEIIsYdJFJCFzciCxgsIHjbBAk39nb4pbaOLR+dlDNWRVwIn3MiyCMxj4mw2+7AA8NhuZ3SU8ErejGLXK/ClqQjzbNc9vC7J+qhcoptAdoI2QHdtqxXmKkWWZg3sBXdHBtr+sZwVRyqxf3GoMkbjAncI/ii29crT12GeRAk7WeTpsKzYBtoAJ9GGJijvSIaHV22u1nCxHH6/c3f/A0nSrsbHxkSiELDhs3rtQ3a79TqG2iUmmBMe3yCFOItsc4+6wo6uVKPqvYeIMSAGook6Nl6x9YhjjqGcg0BgZsIxOZ6s9LAX7R7QtNbBIhwX/wKRoNPnLXtfQUcuS+WIjclos0GNVcj3wFndc7mQ3CtqisYWkR9ThSIM1rqzTETFVDVMacCekqNzWlTM+OTGWMmwVwm1thDc+zK7M95jC1V0VWN6QIcoXUlRVXPhTai5HovOymtxDExaBJGplKSU3A0Y7D0UGOnjsepGztVGf/oj/6om4XZdCbOgehQfHisHggi6i0kTrNdiA/iy9dQcKxi0K7xViCJn0N2cE2wpPV+JOcPbkKtBAjgjBCWzRCNQ0Hr8K7igSlXLB/CdFDneZ0nQ7y8VIAbpOBSOaBBJEwCFboIgcL4uCUv83SxynEQUjbZfphP/b8cDbhBebQe7fS1bXZ85pD7Ilb/bW97G65e7INowfBurooNjGks0xO3tAmWXyBtCac/ugLgKJr7OVsL6sUb3vAGkEtXTI5fbd9xDKbjnv7gBz+IcbNEcI6GywtTIyfC2sMm1BXg6cBxT8Exgceu3tTggX2wboEDyJdww9cATWgX9jLABeRql46ma1K6xFlQJ4EJ8i5Y4Sb/6rhEK+QUkMfNTjEDLIwctlp1dDGWsYEpUCrIrwXBtrxOzmI+D5fhLDE/zAMzoE+JzDk9EjNAoUxiEQqNRIF+cvtcEkcjEhMgIKBKE8f84FjV6ZjvfOc7/+qv/gpqz34GyrDZ8HQAXKC2LFU7u/RZgniseUMaNeFQ2EaRgbLQGfsil0rWDTde2qbblSPBKwUy+qQyOZydg/P0Se3nRIbux0UzbbLoMmQ6cNwC7Kab/JYSX035+NTdypWTJC2idlgPUAZWmsJnqLZMihVoFSxxwZC9CChraQb0iH0uKhYh3+Sf6NEohlJUL9VgPbVjMygEpi1zxXSPcGSID04kYMI9QJTkdNgEwDXskrPLW5SNQL1abpnlii4JJkKdSCsixA925rXNJZSThW0jVngx0fUc5GfqYaVbbQ7zIyNzgqmOEke4m3wK3KOeei6SZ1QV1cJnV/xWKnTuc1gwi0B6FAh+znxKDDk4uTeAIxe83UK2RoBJvSW8eN4oZItjyq3Rs3i1PCOKXWLh4Uk5b4ZSTot3NvW0DCtvJ1mGkRnv8UYuV3HD2RzT7DzW8VSBzheyzQp2pf4YcEwBG4yPFKM3uE/rmKuaN2iXRAWj9WAJQqbTgU87ZsqlzIMRUjAy3iCPLGmuSliEomJBI7BDlSpUTphLhavNDo79Dt7E5UGmYunjV0AwPAvyqy48z2bjtFjbjZP+1m/9VooJGvZsJfAtqWhj4KaHw0IY+aFcqR3zMsCbnzN70UmTeNdAgS37U1eTmB7mDdc55FG+lrhXNgMjeHaiqSh7aAzEh4GMZsEbDC9DZ0cEgjmLKeElN8yb5Fx616m+UTLlUiTW6qHktK5Pfn2MG5FjW+XFZx9JKu04brNm7IlB+WFjZfInNDI0GmQUiIn7UjUTbog1CgsX66estRfr5OzK9V6biwFogI6hTia+L6iHZxlmAXVNeTFlWsVz9jpEaWVdcQtW289JIZLwLGtlb7d9FYeCKXMcFGETwG2zo/O6xWYGeYSNNuoYthhcDLMH2noErgrFn9s32WbO7OM836pOgsJiS/UHPVplNzEsEvipIbwt7recTB4EsPj+97+fxyGj9MrdX7ELY8xl1wwyWp6ytIp6YeW+HhZZ2jEi5MZmtjOUd8zx+oHISIbRNm7L2nRSuatcz2VYj14IeYfWJfQ1bE/o1CaN+TXiTqB1oI8JEupiepx5nUf+ckbOwnqDQ3Eiwzi8C2DXNBLOwrJJYM2WaTOaTeGkaNCgjx2c0w0KN4gmztmVBxtbRWZVUpbwyaptnJ0twuPvEvFbOHyhscAiexhARtAllmLi0oFFdGoQs0GRZjSNyXm5MB4EXp3o6dWk4Bv7gW2pd4IvHAfwJaSRyAfMKWoqKS7HA8LPQ7w3tDEtMNNOdjrH0SJPpdVI7UdpnI5+n9831YHjdWVzjM1Oh4YV81EhESD+idqVHRihQWsGQcAOFlLZaFC5V9HjFdh6rB5QxWrSFUsNC+SyoBkZrxxEy2DSM7a84DKDGybCYsD2j4Ur8s2q4J/wCxYklM2TyjIsqral3sq1gRTMQDVJPeYVEIGT8grhmgeMxKz0pSkhNfnp7aJYsg3s0JzC/kRqE5sBRJ774paZrkb/6C0vL/WMmS4rgPDQU0bMnjbAIvZWzCnzzP+0fCYdEBCHM/JkkU8jRpPLhJH0Na95DYGNMF9tnZElg3uqOupAeUbCsSwr4R48RJ4ZwAKA6RyEVby1Ju2kiH0HjgfY5ogEmFmMWQ2DDtsyHhViZRAdy96IRBq54GuY/7HoodWyV5eeR9mfgohg4SiAbXFAMKV08iCaduNC/SEMJcrLlsG65b4tVUSOwUdiHrnycEMbKqDc4cpkQaIpp0PxbPlOYxMOCGRw5aVplakAc2G+pv3NCHXMnTZ6WJexTa05VFJ0LKy93dYxlwW9vn6gRCMmRztaD+i8dY/ihJkdp51TM+eAIzufna8VG66T/Y8yEyi8NhRqrVbbJIOEAp51gr3zyPDzAPQ44pQByXVVBJypTyAShCtxBGzimKel81GAuHFmA5lhe0B6EW+edVn7owPHG2uwkQKLqEIAFts+JALpYfMHLsv8NmkjggJG2B8dZwgSzxsECIi0DFSJX9gcMT4ijhQFELxCl+ApgBcsgC2a9Sn7mE2FGhpN5BWMZu2xLM1CEaB5xS2D8wfOwhWmVM8MRJMdS3tZHlbTEq99NbOFmZknOW8aH8tou52UbpONVnWM0U64DAexqK0JTtWVBSZiztsyjcevMTnsHDwFGFnZR5fBTBKMDdy01km5ZYAM/x7Walw91aTeWjWpgo72YF163eXlVPM1HhlQiI0S2eYgijcUMq0m4pC0bttt9cA+AANg8yYpFkJgPlK7TMcOHA/qALaQG3CEPRnpMYUjCRKxWCeLGfn7bj2QM6CHlEG8IgAQgGJTeUPwJI98gaAKYqqx1sn1DKlhsJwATSyGQK2wO6eOmab1XiEYzSaP+5LzeoUiFw4Z3DLEzbAsgWBVrdnmQuMo+Q5ggcppn0Vdt/JiOC+Lqiy9sSU45r2wu/MujCiD0nkeBNB2aDJaMND4Z32f+JVYSFK+bEszKLsd4Igg8Sbftz+lYaeYHa1s1AIZuVlUmS/UA/nkZtMl0RxqwFcTiveSgHlrxYOGyDYZ6DAAlBjlMPFJZRY5R+P7yCroidCSt86K4OAEpQKURk3eyOB4/cc5xobCOtdnQrAb+Qx2awvHceUoQ8kRjA1OkQWAIIYIE//UD2vsngtMhy/rgdUCBMMpUtWKI7OKeMMryIUds6p9nYkZjhTynWnO2LCRsx6gjaxMPeBWVEtZHQ5uJq+kcnapR6+cV1YU0Y7yxDQ+5lAkt8CUZ2uyDUpYNiDb8AubOUxSzjoVbQ2UgUDhlyBFhNkD+i3Eu1meibNdTUJSSktcWWEoNl+/HB/0NJfMAXMcvsxOSaYNxl9jgIya5HFgoPi1X/s1dF6Y12zmPmMv5IckUP/FX/wFEBl50BDMg6BiGwWJeTTaDQVE3TVIJmUp/uzP/gxkxFjE9Yiq/raaJML7aErfuneBeLNAkAR+iJSy5ZtvY4PZSHKpvHfgeFAxMVVeXBKIC0Lzl3/5l8i0VULjy4ur0Vo15gILN9UkXtoFiaAATEgh71mlwJDAmtXFfs6f+A6bNtu+Tm2XogwIgsavsPUk3bgRhb6lLdx1iByb1h1Mtxg1zAViu2X7lzKkgytkQrA5woYCHJwF+yZ6Fu6aPcjVLYPJXYHMIU/qj//4j6nxowEEsOCq2JbMht4Qc0OjYui0qIQQpqNjnt445cEbdW0hswgSuywG2QTD8jnXhu8btxvzlr1huyDCFfJkAUeUGwQmiCwysleRDIP3D2+SyIskqLjwK66KXpU4cFB0Yj2PgHFJJmvpD5QERAb0ZZt+btsMJhmsdx6SFX5D+WquZ7XaB5l4bFRRcrBYb9lFjdqB6/GeV4SMV2TC8Eary/Bb3XyyDN24HMSIXF2T4J2ipgyhVb3+9a/nt5wR45G0SHFkW2Zvh/5wIlAsXCaOiy2tVBYkZ3lAXrB5mQ6hH5NrtoUDfwXRZvtJPaO7At9EjWJhA+jyYqaCi2RtYI1q1yqvhSOiKko5WLiQGrd4/y2aW9UZR1j08GvhiJih6ZebjUcW3AWssrT7DEqbwOkGbWQ22EUoM4HmUVZy45qh2FhdMAjmdFoDtjsPFiFWrYlUcC6bgmG3wQyS1qyKMTOD0eZd73oXFFuR4wmmErjBA24qmnS08yDD5+vhN5ElLbPgLGydI/N9dsdUKY6sduB4sIcVs41O4GGTfcVujNW5NLfZigANBSAA0eydYmkZxI41iZx9pR7od4gswmSID8KEA4S8MXM/sCRqoxQlESZEysJf+GHSQRDhQ7DARxY84IXmwvfF3DI/Z7aFLgkY1DGDUlmRISohXPVL9eALhr/NmJ+4X/ia9bp5z2+tDQ4G4V+ChHLlLRZ5ixEt2NlAy+NiNB2YMwcEYNaA1+CS2gz6U6O7KlI/qzpmwPqYCdLiec22XSbasURJJkcdn6NpU7ZiEN8EFtmW0go1oNxin+DCTCqPJoFRmN0Lhd3YHS3RKiVs/Oy4GIvYF5EHkdHWu+xtPEF+wj4HdvM5wik48k0sP/yWDZV96KF6aIphDiHpVACCGv/hH/4h2z+KTpJTO4fMdXFvtUPAXs9E0mghQuaQbx4/GynqD9JmGDBxDPxJI4txgma/AXAwBVYpkgdZsz2IeIG/2/KO0sDSuo/ijGFbA6VcTO5Z1a1UUBKxtYOPuL+rojbXXHaQOtmWS8Uzw2pEuDmgSMdVsSSAci4VJsjx1cVmT1E1aTnPwmZOmBDbwzMnrCtWVzXxX1/V0cjk5YwQdpaoETwaE7gwjbnMwGb3FUTTI1TVcfjsbUwU2xtPCqTAIcsDmj+6KHUcNM4mvCZWRSPMbUutH2wnvRuBV4CMDdsAJu6UN8Rj/uqv/ip+mBhJxU2uDbCmYA/aNGDqLqKfjSeI85AfIgmAIzzAsPwUlwIfmWHAkduBKkIdwEcNQRwExOSVO+K8yEaaQ3TM8cAPvRPgIBoQtJGtXgbnqx3W4UroKTBH9//s88bumlXGKoJUIhxyKBYGIpjeT8Afcsl3ZGqczjQYA7Zf8YpXsCzB05TOF0DhPhwHeYUOJJtt/hhpwRQ4hjxyd8b0xJkDYwXKOa8xazNoUaBc9OHKmQouW62W1RWvbgvvcAtwLFktcwtPzLyZzON7rWabHSfdop1MHitbBUFU7BmgKvfI06S6F1l3W+a2l3PlYcFrjqavQ5kxrNpkARQIgmAMe6yKlljbHezTeF04DniHfq2QIKvs4ryRMxoPwCu7LLJkCqM1R3x8KPjAIuYdk+6TDuhz1wR0Sz2ATn7LSfFS6uNWGLgARJ21Y14/El76qTpwPPADjEDjAEHYJK19YDc4EhhYIbAkWx2UjzwpxlHNkC2QKN1WMYS5aOWPwC7SCQdkV5fWKYWQO6T54XoQzZuaN+pESDMyh9yzSo02rzaqCbQhiLjkOD7KO/yUzR/81dXrmsF3AZsAzZH4zQhpbI5lLQzzzcuUW9ncHpgdY2/1SrgLGB+kOJUr1RPRCk3c3hJqvWa2CqbiQx/6EBuSkU+wJA7C5BjKN08GS4qw8VvASO0hxcB5ZR9iI4ST5jm2rvitVw35xOoCrqF2cHCeIzQQ5K2KGAPbSJBcCF5b5FEFgp+D1ICp9ZAa+a9lAqI/4ftMKRxT+cRQjkT5XqYMRqOmcLTUo+vA8cDr1AAiMbQov2YNa2dkYbDDk3dFggEyV006wyhYrrpgQczPLCG9Ezqd4Q6sOu1W6HrY5omDYW2Ad27sHpB/soGjlbP/sziNq1Bz59rgdwAryyCltudxBSrf4qBeFNYGyzWVsrgkBBpEQJq9wc3UcydEPbT0lce5VCZH7wFfKMGRCwMZVfAznyxOs9RZz5s5ZMowLH7FOmfmeVhMi2HkPAsUSXYsHuicoO+FWd6NjccEU91WSojh08a9KhVzJs5vqBZ4s+y1kFzgz0we99T4eXxkPHds34qW3nleYYLsuEg4iMZlWIXI0AiptKGRZYg+7+HRmJjBX/6KtTFoy52616JSaDuqWvXdPpB+i+v1xhACVheckedaTeJ+eaLsw79SD0wwacTBYku+c5ZoNSnPE4KA4gykvvWtbwX1tF26FM2xRY4NIU67Ev6JPoLJhm050SeJsbDFgt6PAPqcNahdHlwDxnKWZYJ7pVd8hzWDjRXy5ZddGIZruPwS3jHtczC0LeY26YwTkjJCW1ohy0Iv1SQYJeedHvlast84qZPjM+Ln3J3hBHy+2S6iD9owLJ8Cv/I4podG3Z6d+OzkOA/GxvNPeJzddfwrR+CYgDXAQZAN+JKOEVt2E9ts6OJLXSXNNWVXhpQy45/oH2zMAFlMn+z9qNJUeEQwvE1bZqq4qOlHAPIcDePlRIQBvPGNbwRVwX29ixyZLQGLJEqYNoR28ZsdOO6jwXNFbqBm5sAYokV0GHooKhU7pHwt9RyjzyIlDWNc2lpZQQ9VBZWclWAulwHegCN4VOYquMnb+QgTEg5WlBc/T0FAQyummwvPw4s9PtwQIgwJyjoX40BefOIG9JY9cLYs4pBit954ijBGCwvBqWaml8ULr3ammjl7UZWhNgBQYlnKuzY9ZoYtL0FR7geABQ+ddZ4MGT6x1ML81YYSK+7jTvy5WwWOfn1ZusL3xjjLlEKHETketDSWV24KRQRTo23TTUzwNpM8rjcyuoITFSHkLiCemOMtEOltwt9BRjQw2EaSbTpwPNjMEUKXqEZ1AVYFyiZKUDpSJdQjOktJeexjlRQaNVCQyLqK1vUxO+W/61FiUJKCLTWG5wfSqrAqjk+th8FG1dxthdN90PtiZQL3bPVldq3pQKjb+B9Ld02UzRngGO+QBV2qOpOnLAjYwKAZDjGvsEFOt3TIyLhZhwayNCpFsp3w7GaAbAO+4fi4rVjtvOFBsObZS1BXoXtzWhtL1GZ7sy5c/sozBY8wODau6moY5hoF6tGm2ftVDpxhbhACy/0ySwnVyu6uTMZumDzRUkPi1thuuR1s8e5Afg3rhL7sqm2DsM7muI8Gq4vtDo0gvUMZkAh4nH63aqqzIHoxC1KvH8vAsMcSBcQdDmgzE1zVmp+quucBp8OeFat5NcnN4D1bOgUf2erRXFTKrN3C0AQ5v8yVZbdVDJFjYnpwFCDBFqEwigVLKx/yJ1PBYidKsb/NQEp1DMOcGSDsEJgggBUAJfbHGRUPGw6WBrJvhqelM4r3EBwNjlXRZpqZN9xq9nnTmLCqwxJwu/GeMCxuyo6DbCc8Qfe2zUio81A6yvgmk4DnjaeMfs1UM7EcCk3CruJB/7Kpxq6DY6SFx122F+fueECYcRDyPKNIOF/gOfJAmVWTamDQXH/KPiY2njdYCRAqlCGWg5q4IRasJo2bN0iF8OsWHEEr262wGRpIbIUFVkUq5pdgxD9ZP2zF2AH5FV+DjmGiLksiu1T4xPxopNDqO7oy76sHHybLSsnjDSDL0TgF9kGzbsBQtHtEOYtz2u622QoJmVWt42JAQOz3LNqQXzVTiDPWdIvuzKm2S5ZZdQR28HMcRxwQqgXzTYRzmeo3gwmWdrfpNqrToJba/dptYxAoSyVZYWz2o3fPyEShJ3LZ7EN8bl1OO//MxvdGKQ0PBbDefffdYJBV6WCR0na1h1Kj33IzaKFNl8YfHpN19mR/nIiZ0a/N/hE0z5VbHRIJxz3I0uAWuGwu3qKTGj1SiI/5QTIRUfaAalIRCupgj+/qhhnXLTjyII2OTuQX2zsYwTpJuYfwAr6AAxo4IKGV7RFx0XzDl9FTpgWdBWYylnKjBs02Kwongbds4sFJ7e/O1zR+s1AbORjliWZIYQygfg0mBVKjOYJlMmXNfMY88iEnZRmXHHnGvHE0EJ/YF1It8fWrmmG7ZK44CHRDbEom2WZH8y4aPbBmL60wxDhPGgWBOHWsh7NxNjNv+KpVuaahan4ToRfGQdAAMMuwZ3B5PEHAZTMmO0+pt3Y6tb4plFzt6SIaEgWcGbw5HfYA7yPYk8xr8JQfsoWza0ql+aEbqrMhMYQ8us0LxJbdiz/nBqkQft2CIw8bfIzVXE0WUTCeo7Sg6YvEQIkSisT4JytTYNjGgpNYaGFUbcssw/JQZUUDNZoU5U5fBHNdc5FpLFN2lN/SNheDY9IV4LlwUsgR1RAkAnFec0dw4dxFWXhmBunGXgnRUOvkXJZNZbPJb7fsuCKZ0imsb3fDfoEbrn+rpTFKdu8GYzzzbJtsqKWEKNWJwqF0+M5GrrJUezYwg7oMkLLHpLGum3W22V0Eyc6hxRBkTPCAu1Ts17afNLXGT9jncNARuYH4geyaj+wQaQRSrt83mJ5sy54qnxwTcVWYbxD+eN2Co+wj6rCPOWwuLdaqSZwjEmPIsbEUiD76L5oLnxstXK4TS4TasKXMIRML9IMn4DbhHaKhLmxXVEhHAxBnMKNG2cQoUCjpxFQSbglHsICV9BlkNMZImNuyQRWQlAinahIGxFlYTmX88HSvsWn1HKMnZ8fOxfehnCA4m5Pl1DZTG6MzsnQtoFA6agSj2Y3DSmuvYNFw0aRaz5aWgbJTeQyUpRVPFHZuyzIW8wTzt9vvq0m8V0yrIX3Oj5dUXkn6ALPf80+TrxE8W4PY78gkKCfNe9Rvk4ZCehENijJOowPHazNC2kvr74ZyPBtEhB7j0QzCcLXYUNCyJXyHvRT1MxIWMuhSDAHUjJ2/GgGXS9UFnGiV0r5WlhRUyKpJh8wQJUvymWBjUUgOaM5c6nWX6kyO6dG4MNvLYF9DKfYu4kn33rMZzEYEC8qiUrlaPI7F2Vw8m5UOKlWtFPclNQiVXDMF8E2tQw7F9Tix7iuBkhzBsDtT9CRHLlHL+ke5m+21iE+50fygrFU+G4k8e0JWgzuNm/VE5dE2u7Zy/2sBnaWRQXkwJMCCaboKk/aT2KNq0jA93kVL3tk0hj2vLCrKJ+mWbu8txc8jcPCw0Rn3GIWsVFM8bHVlRO0+DyZf2IfIGMlrrIFGNMmWJVQTvWU4AgLB1gcfQQJ8JFok+SdLlwAdEgAswqgcsJhxTSptSdrTlsfRDHCpJlHHmsNaqBvCDQcE1CBZXA/ABMZZSK2h1s1I1+WvGAHwzKICG/vmwVOxPHhatmDdcNIgxdw4BnvssEwXP0eRxCc73aVvM5xlZlDnSdwEHyGPzidXZceS9A4NWDc8vK5GAU5ekx3FdbsHoSS5Kq2WeQSJxy4daNs64E6UodJCrRhL5COTaku5To3aVvlEPIyvUIqI9+YR2zGibF7orZnYbiVdZ149qewtMXsECst/NralfR5Mvu8uriQmDRWyYZOeHTDB44RPlSsQseCRIz2pT2cZMTd/QnNIuuIRYp3hyAgT5hiS81L4K7qYJcuSsacIshtz2BbqBkfDQG4HTjyJMXRSts+KOFURvTHDUQuggO/4lMF38oIANb7MJeFAANoaUjjbm8FWwY0zMzhz0LxANI7MbGCHKutpVxO/cOOYLlfqF7AU8XpHW0flx1tKzzzthuUm1+hGz8VbQ7Psms1fQVie6d70U04ZHttRJCkl/aemO0NsiYy7ok6FeVm5NslLvGIIsj5ujNF5AxQiG/wVGQNDrctrrcakkOZxcL/IJI8gERH2KI7aNNshU/61EQ+bwtIpNbCfo4L2KXKX3DspfaVZJwErmwklomMrFaRHEWGx2WvUOEd5fsJ6CGEjHRWIRCz4MlokmGJT9mktAClEE1cXriYB5DZOaHGz+ILe/va3077VgF6ibekGw7UhvgRnJNN59vJz0eJIJf2Ly+ZOYbLcAgeBh5ZNchrEZ0MfApEcBvGxnKz1wCbBATVBpqr2hmY7wRELF7Mk+rOGWZAYuUBM+CNOVY7m9aReYZKR3MbAx4v1yKNnqr2GPYtAZg4N7pP5wuiBGPNzJGtBzNkhTa316M2gRzJoGywrAftEMJEjQmg8VVHX0jgzhJPQbrZbm56rGDHYbHIj2sTd+/maC8HEdhYIe6SJjOVOtiG9bRheGy00ShTe57bLfQeOajHxC6tlx/9bFblcsxkESxqVgbWkz9ogWFROVEXUQ5tJlaxHZGEY162xb9qLaqk7EhONFwtuIqxEuhgBvt37xS8MGiLWIj4iDjRQ1ZljIpF6t2fHzWQ2kH6yd4jsMabHalfl5jxP9w/Dg8BlJip7e3q8lJOmWtfoBxC3vstDk786FI/AMIAQCo1lZRBfzL6u0rJ6UMBxD5I0uE62Kzy8kF/rlaCE0qKAufUiUxVtno7eu6JRNUzDBu0iNmrE9mIloRCTiD6TshEIbwB3dko0AFdQeGjWV8DLMsM2idO7bTlkzpj8ri0vOFb42B/zcDuHzI7UGR6VblMbACQ9tpqEJW6pW/F9CBQrHOlxgSFD0Bbi/pEetGZLqvio4s6WIzRIUODADRZ1AxHEpgYzCgRwItRhY6S3NcCL5BEjeTaE48ZZllwk+iwB2JHFGTt2qBw3/ox6NL5fKmWztbzyrzl1gyVNR1CXAKc534WUChf66O3rME0289yFYL7ZWIG2QEkNhau9xthEiYuiTLLedk4HmbKyYTVxnZfQc1WRcUOs1IxIIlPCJOC5hrUS1FU6jhIUUdaj09idZ60hkkfGoTCAkA1hrJKOR7YlcmZQubbcmUpvPsfkIGfrYWyGzUhS8G1LfagDxw3AkT2QUDv0GgCI2QQj2PSycQUIZqAkTxpYYbe3BLQfwvWw7vE5WytqY+lEK9GwKuomlMyFD63jTUnH1Ae00xYnQiVvYQ7jJ1wJ/I6bTUMlbg0Ipkwk3I1LZRls6YCKslP6W1I+spTCoORmG35SsBONFLU3r55lwzRtf1K2P/X77AHclAy0mkpB8VIFR9aSIcdVERluiKh25D2QQ3gT1mfDGIR13O7wKS5Mv1BpR9vS4Gh0VBwa8zQL2vA4ZW9VbCbgIGkLJvnxCW8wN2NFQZzYrUMe4z72E2GrDAjNLoiahUqE+ZtV42OSlrIAs/fP7l5brkpzEGASXBicA8sVSw+Qtd5KxxzbmFTgjMypPTHQMa3AyHPFTYGVZE6tyl71kEcEBXBMLROObFUedldpSDWpT1VNZQQnNEfcgd+xYKj9iR/WBjVGt7AfciKEtV3xZ64Q3EeGjAk3pI5Xdm/AEZ6LUGrqmgG+cZJoRHdJN6Leot7OpiSxS5Yxodo6GmExGzIjtScU/HIqsqRNtwgaNkxRiQYFH917yogoi5PvDdfQUZsZk52xyJElxGZbKgJ3yh3Z78H4sBJb518XDeeVjjLILFqwvd6QSRQaoA18NHU6cWyZ5FQsbQTZGK6EDYHoK7IhcF3adaOqi3cg3hzTsIfZV57tmftFpMmzgn2zo3BwAh4oFchlcDRt/XsTeHD9gCPPkuAPJpSK7ZZIwnwGopHbx5w2igXMAAu1CWrwsBMiPSw2C39yNPrJVHVsIPtYHlK5hpU/je72veREbqo01SINC5ZnwC2H5QgUiSLL0OCb7apX/Jy0Qov6WKE+KRCIF0RA8miZ8TltWw0PYCM3fPb1NAhmNSmrE5d9+abRnDpqe1JHpNtGC+oTs9gPdxQNIDtTwFftW1NDmaTBgrd42h44rG0hkOqH7mHABFee6S0rNoVPpbVhrhO+SeFF4IYb5whY/Xim1qqorgzxmWE2KR1TiQNFvMEy+xQl2xK1Rkc2JMAmlPYCUzhjwVC8s4NyTNgiygqrgzADxc9ITyzX1BWHiuZBb5k+aBFojLYQWxO0OSCxCtgoAHQWchfn2GYw9ewzEHITJFgMiNSZeljPptEqc7NFLnVCIUXhhYKxiUlV+JDtkU6EyBZlaAW1GMJEJU3OPjaL3PAFfkU/jXe84x1YeeAORk3yTYSGU2CKKo2V21KrIVlkRoO8QC1LSP+gcokwsTFAmWHB9ieZXZNmHwnWJFsjwR8+KR5rrAcNBd89SQxNtd3STmJ6zN5cPwuYTcvmXDx963gSZl/avktPdCNsU5wCIEBGhA3A4uHqJkZ+EDyeeAjdnB7t0v+ruDIbHAc7j3Y9G34gQsgM3yT6Qid7iGr2odSLEgS5TggEQIaEo67ZBUSNAZ2GNYKapRlqnmL13jtPmTXL4862wXpBKXQedtJJ4sYFx4b0p7xNWbUlmDijsIrSwKNld4WR8byheyljh3ZMLXib9rIGwEdkxY5a+sfjouWJ8luQCzJLew381AbcarjBRI13mABJ7Cmtd0K7wbAfsGwsYlhNws4tHYZzgHDF0rK+zwfTyGRC9JIGngrkqKVmsDUKUgQjJB3Gn5agAMVOs509GBhJKKkN0YNGccGwJ8g7SBT9oJHuGbH0Nr1OXN7oGUgaLo5qEn/GrYG8bHhx5m4Y9bKl/iHkgVyKDYDIka1NBxWw8p4VlUB2WLASW3YGdxsGTEFGNDNoIzwUgS+9cIRzId5Ecfgot6SNUdIlucFin29M2B4nYN2B47zrCkHE0MaWC4SZwaLVgwdszEGpiM04js/Jcltwe5acKSiKBYiJWRNeAHpiJGYxIEPoI4aeGCDJvsfXuAzUW5UCfZRqHOzJqEg0TkDQuR7pZwszgj4ZDkJ+Cy4LlWtZBq+aApBg9JGDgow8Fw1zRiknpJG5BWjyybReqeUrnSRK6DRecs8i4zgdOxYKAcDB9YCJEPyUdGpAVSOmR64EMhKhhR2GDbW0C2M1QqJa9JmJ6z/MgPdo6OQLWKQHyXEHRWwQeHCZT7D5AG131MMwftmihJEtma2X6+E6ieUwWM3vIH6Gjts1wVzbsM7NgrdDnPkJSj1H4GJsSYYlAU2fa5im3h04zjt43gAWWx94BCgAHGjHVFXg81IHqeaLk+CJIuXGJeBIYXGa81DVzmsiZhAgYJGnCARzrkQUIg184Wv10Dcd5zVyw3t4xG/+5m+ydacyRbuEWW8K9Rw9CGFlUQkN2gFAGTNeLbWyz+Nm4y6zxU0i9uPdTp2eaAZlpKQ/9wE1XOTq6Xt2+1Zb+J56pOJhA68bpuoYGY3oxJjD7qvkyKRiYUgvnfnFuJzebDbOLeDFeyg5aAhEJh8cSEK8cWkiWgATcbjoN57XcpmIt055Xo2cc5L1w3BY2nuwYVsMdMMAr+mRzYNFgSECeYZDcAouCX83PBTEnCdOuQPHjZkUew7TytJiKuFubNrsNhBAZrlhup5dUsUNigMiFrjJDGwklIcd0r1dxy7kEQnGcIMaaMJA2idZhkSyGbeAgIUDHWRE85JsWo6sRZ27qDkcB/L4jXrYsFCPBGwFmUa4Z1RbuIZjs5Rh49qMYinTuk0KbNiOG1WHZZfB2WvCHJMfqfVZn4x6ZbVR4kdV9KrkFaFCS8UjkYp5gTYYKNaehvTOEzKZbzbyaJlngOxNb3oT/8RoiPlIc1Oi4rgYc//Lgm9itKbzKD3aGVkFqG6IN7ZRlp5Oy1iQt8z5E775FSZapo61zPrifqHhUBDAcZ4cxA4cNxVKfILMKepAkqUiCom5nw2OZYUYQ+TQLwJt1pd3A1cgdLx4ikZAWTXpt+l+aBPh3//938faaG3R9OJo3fLcX4GPbNQoO5jGsSqYLARiAsTmWR+I9h1OnUmHiXZMU0CAz7KAZSXgcsPTyJvOjuFHh+uxZzbHsutkVYQxJFu5pJBlq5mq7pZOtWCM1NKx8pg8YnAHwS5ZcJmWvhmf2uzRO2nyCatRcF6Ymk6V3IWqtAYlH0dCeqtJfT/dlYg0V0gKPAo1bsAyaCG90rY0E/msuSrYIjlFZqkZbFBuPC3MUDc0OEY4YpHJ0kqP+RhcZoOFcqkLz7YwmJZ5HuznVItBglmoIqwoWfYbyk6eFqxwN07NAyYc/XWvex2iw7NPV5lqq8IQMzaDFA/npthd7VMMJqqkYA9Ff5c1700Uy67g4631cFcrYU57ooGTDR7kI7AGuOGQJayYv1GGy+wBODaMYqlHF2DKP7VTW/QQHw4mPNRqlB7wETlRUTX2lv2PB1r2Cm+o53OKTdmVQRMh2z/Qxj6KCwj+iKmayXTSbDpYbuR5UvqFpLRYlpA3jFoo1NiyVLAUcpWnhAFtJodyEdFWxo0YMA/+ShfCQamVux+r8ky/b5QpriZF9BIWl8emOqYWllzOvAI6BCVgmWZDI5YbH6I2Ps00G14Jz5hfIXP8CnMyYo31kzc+by/AHdVriIEpJfbmLCvvwuM4GLl++7d/G8+MnUhLVagFMqb8tdhtGKn5Kig4HFx5jcQnTK+a1KeQzpSx91La6speXQbfeb8upxA9j5bmXz4vf+vOZEVCLWU4XjE0B3e8GH7CGtP8p7Y+HdSlM8Eat/mwrDS82ZDJaig0gAx+Zw9Y9+N4XUtcKMvkhJGBQXiNwSZ7Amu6kZTxfaSIipYkaJf1YkuULy0z5XPxLvRu8eBM/C+T/3Rk8XOTTdFe4Y8o1FJIn0sCAJK97s+1V7D7wmeRbRYIggFQamlNwG+MVCn202hP5pXnE2sCGAAU6S1D/fc5bayug0rgrvksWlUDsSmlAVx4Go8sCQOLRICQHsIgSCpAhlgVWqlVn1OR32aVz68HP8G2ze7K4ilNaSU0wxRAH95g6LRdXzUzqaBhs0vfFX7bSNTfsvbEZiROcbTBJv5Tw+IsYYlVyNzEalIGoqyS3Vi9luRgks2YzLTntWxl5zopQ/n82nI9wi8yOTmLjtRofJkfq/A26iqGsnk6HakocVZM4EELNzM2J0NHTbzDAcgUIRvMCcwdDsWfAiINQCztNpk0fs5BbClRXdnvF80DRkZ4A29mPMRGrUMxyMz0R+th1jlCKH5FtfIy7EYJ+BLdgaXvy/XAhI2dXcNi0mEl72AiIm3LYoxFwCKCZ/WdbAbpVqZVQRnIw72OO7UeeHAsI/7dnxEgqIdOEpOoXDbJZ0ABARcQBaAB1YOcWRzWSBLSo0Knj1sDNnLDNxE1FKJyGwxsZfVyKKSQNQbUIj3sw0RQ2qRwfkSbs+TJtsBRssOtkRZGsR9Wr3XbgO/f+I3f0Oie8lalYaEsxsdPqKXGGgP9mVhWERYAQKRcG43iLqiTZePZatIOW/BqxGwmzyToWU2SMaqiY3VSdMpl6ZPlwjCVEJhiQRAeMW4KfFmp/bPh/Gh1IYOF8H58uwgPl82EQN45o96DKBZi+nSAnlcCIDJFH/nIR6zaUD4CzsJ0EfUFOFqubUaLWm85tnU/BOOwBSGrYhwaDK0xEa2yzrwk14pKDCQQiGdOSL5y+8/sudFa2gcwFRad4YT6ls+F3xLHxk0ZoWWGe4J+GtaGDhz3l40yyg6rFwhAklgqSCGIhpoAQpl2pgC58nmi2sX4DkyK76tDRRFTmUL+5I/RMasrS9GlQxsnJfXqve99rwuDeFpigN7ylreksv+WZoQG6JfEbcvWplvuHyx7ZgbstgAt/2RLkD9iRU3abKP0epao2e6wTn7IzGBYwOoKtlo0sySMCeVhsZUG+KTcWoy6jEopz8gXdGdXRXC4LrXUW025WRUCG4dya6ScQo3Bcb7AFZL0Rgwgz7dxlsbmAeIQ3g/0GOhnijEaBuACdqRBRfSDsuxboiZAfAQAZZaJgocm9Mc9G+UD9x0hZXrwtL3MMIOU7RCsNkCQNpk2nIIDMhXGThL7ZZZ3ejmk34amJ1ESXw1HUDdyMmNDtOucbTlSnNTVlE2aaWHzgA4TJ8T3MUnJFdhcqyu7dXfguB/Jo7LLqiBP693vfjcyxEanRozzhEVlpSm1oYblTos1Sso8T7ckjJ40sTisKIpcIUkuJ5Yrf7UdqwnarW2vOzQ7eL9cD/QB+a4m0cgQNIQeEGfz0FAwHc3nG1Y+XyNKVC8/A2BlR4FhwYbU2ctS3k7LNDg6/4Y6VkXsS4mDwlOUcXHQdo/a4KRvZVwBA1MG6Maj5wZFFj7ht1hCWMMzPAAAGYEB5MxpDMmOC/pwKKZI9FHTj1JfFjkWnZkQLsASZ7FEK2yoL7hKmKikJ89+uI32WLyirTP/ZsJUkx7rTD6qj7uaIifqNW7WUm9+bcYKChSmMkUMsljn2RcBRxQydx0IKZFD1hbJzR6IQjs3HDjG2gUwEVzGGkaxcmkh3zxCEMr+wg3RKbvIb+b7Lj0DjcC0Ur9jXYk+lupRwtiuCa9FoPXeXCubbOC7NJ+pEDFj4AKkRoo0bVnzE3DQaFBIsQlq3BQ7EFokJnxWaUKdQqx0f5W7QqLbYthNP5Z8J8kbjRWeML1y2tN4zzLGKLOASH7C4+CaeZ1dcZoFDx1m5cv3U5M1/WpKj0djW41HAlIGYwUZUWD1XZTl7NiYUYGhjU7dllWRMl3a+7QUMXR5a7vgsoFjnkIaiJcG3MahdMeVXRtTl68qihOX0Uu+8iETyK2B+2725i9xJchM9KFG3Nt1Mw58i8VUrONRIaMY/qzeqH3K9r5GU5eMLz64MMHNlNZG5a7hZJTYoUmLM+qmMIKSlcA/7XnSQnTUblJMdyc7h1cLQMOhbOTgYSWP5OGikNoGq0EY808LiLng04AQ6Oe3LNG0wG1wH3N7Gqo6JBSCz2tjASemiqPZF6XRsdoGMlmH8djYOwVTI/jYsAz4vHRTbDY/mIlRhNkk8ltTA5grLCoB/Q37wSZZAKlDZQFhS2SUVandY2q0/5oRtbPV/LDO2Iu1nqcjK8OnyWu8dhqFykzNkjxO41epDmsxiLkpFSd5w5qy2Zb58mblXqhHaRjZso95B47XhhmVqgHrx7opdgf0eUf5TTBa2qgqVQGLzU4Rfbw/GaVZkOOAgxYDV0l3MeP4g7FCXWcITQI2m5S+thztvFRybpArhB7qUyr71iL6kEc4bzXpN9vwU3OFWrISvmOEALsOyAKdVNdrRN5Vk87O4WIe0EotCbvLThAyK3NsRF/rZyijJtOy1YZcNnspqaVVfLZcsSCj9x6vnReMpdhcfvlazH/TRmGuhDlkKuBWVVEynZ8br0rREJsRpeDYljaTMDu/jKUSA5ExjF4V/hNMorwvQbB0/ZcJLVXRiTNwGbgvo8HL+8oTcVlZ1FIlKS6jsmFWNRVE2anV194hY0QYA/0O8xlyQ3SOVm2clYT7I1IxypRu61IKg6RVUUMwIRobIlTWng2mWQZ/8Ad/cM8997BU+ARPru1cECm1y9IqV4bIpVBzQsnaVYqeoalZGI1wDWaGZWwhONcMrBACCPPCc8Xyi0EtViQujMAR5hYmFRz0lkWlUKFy9uSq+sFVP83QYEA57VHFnVqXP2ErFljlkpxbV6NpG3hItIo4mXrY9ERjH0SD1pMThwYn4rLZn2R/ZRFGYyG5BSww6IzY8mzlrMLBAcEdTNX6gqNQRyOONSClm6CuiVpnV1Yr5w1593iEgoxC+WzN2it363JT4fgcgURVfo55lIuBRXJkrpAbzKE2jIGdlqL0QG90xDX+NK2TdF1yg0wglk0K6DJLllvmQfAJgm0jT4NnvYz93ErwBrU56hDQqYLjlQUMRcLYx+LkEfIJ9C0lprU8lrZ835eeljljrV3zKSPKSTkXoiNptV4G6By7W6Nvvf+M26GU8t11/Hk0lj2KGNGaXBW2OdFBNCGbArsb642NZDpChbvjt9ydKnnidUyChi7ZIzAELTdSLsL0PJCHaq6K5dEnImzxVybQkNW4aLhamG9pX/OpWYQYpdhmkCFNHApc5k6Tj19CW3oBgap4NjTtKUVQWv7qFmtvsrJKfEN5TFkNZib6QUI7ObvFvrwGUakqOsRtyzWHaKGLsN36cx4lx2/hAyk3ibAErQFJlXEv8ZuQU5zdd999N7uIwZtMDiZUptcw7/3fRPCGBsf0JmT94HuxURzr1rYVlttRpk1dSsR4bCuNzJA5+xGnYH1WC+ciZCyYUkbSlsjYyPyJsl92/NjFEQOWFVtBQOheIni5BqgcngQgEvJbemwSoMM2g8+dyYR1lnE2zCG/Cp1MlotH4EHA+KygVfYz4XRmJZUhINoQDEaJep4YfruQlwE0wQXOzu3A1nPZAis3i71PYAqgl7sUv7Lpo7luVZ04D9SyDWAiRI118Tc4Xfm4vR6uTcexc6hQMVcgCKE2eGMSAFT+as4ohViB2Gtx6fDGEk1aBndSuyGqdxlO4MacdC/1KgTGVuYYpjk7dwSTVRsrPX7XXzT4gQdHdWrXnhmmZFBh/jNONbWjGxZudDe4hiY2fs72aNxJaUCZvz6KVbZkke7AjWhBzdjJBksxhaSvRMpVZndXzpKgwmpHslnGRDvb71jLJid9pB62ew9RKpcoNIq9R4qX+4JnWbxWy2mJ8iKadK8M1OdrnAXWFldv9FZeMfxzGebbafACXiEs5vNlltL7iVfrGGrvi4WEN8ATJmBDlKarrnIKljoO7jK1zh4+Ln5+WKbbl+lJmc88PmseM6WYL803ZZOmT7RdCqpJOQb34NLAN+fjc0pjRa2K8N7tgmMYtz9EbtmobGemyowebd6klgRjIdlmUL+Y5PTPieV3TibRgeM1dS3V5ifNWDzjhOmUVn/NjjaftPkGq4JdESEmJAU9JeRxyz05aBvWEwW5NGxH6RAZOSNOVZtzmecvtWlUYJtRnaWd2SFkB3UM8ggHoXQbnEu1sapzYANkYSulK4O/8lsgUiU6RlJ/lbPEqMoR+BMPguXEogoJNYa5TJ5JOTjPbtkeFT3hkuNAyTnUdIC61k++Y3XxYL2ZwmCcVVrLKCVxAWHQb+6lavoAKbhHYI7f2ueyNHfkTelGj8ME0q0R1hpinBoGGndHo8NMO/FOE5iycGQLNSvXwNX+Sz3YJ3RGozJjJEUyLees38bTcVPcphOlgy5lvUslvQPHfTQkFIlCKFuta/JXvpOoz5ImI4LSAFQGNe6XBQ/ZtH1SWe1uy0jdEIFwwFLuGz/nm5i0qWQFKINKiBpYjAUQzct2wA0NfbdGmXHBdXKDrHySW4g74TKsAWwPANiBKnCDcjpADYwVQCqTljoI3II6V4Msx6EEojGrKJtJg0PXZgXaOFSy5iL0xk2I1puhHsAbLgw9FyboMxU3o1kjAMZLeaesan4F++OZWuet3KtynfyWJ07mHD5uzQJV3XMN5RHnMveVPvTT8lB2Xszz4k7VYPQ16buIebS0brcLli4jGSOl7XA2h2Ih3HvvvRSpQovSvW5PBbYHTUbRuhLgUcY27v8mMB1zvNwNMnxHUZYWJdjNxwkcIBPEihO/4s9RDFmixDOjbwITZfzzjH0+XyuTVaUkjXIM/hWdi0yDd77znSSleIWcC7MXFANwzC1E496tyVGaS0eQDfBw1PI5hIvFAEZDnM3fCEA34J4PATU82jhz9FoAPawi0MT6GmWii4ZCBn/iXPpzzcKEYVEr0HMJsj4dTZA8Mksf4T3nE2CXI1jjSwug6zMKHb8Fbb0qlGspPDQTex9wX7pQy8KLemDYJCiBzCfYCi0shhpuumFSU0qTsTcVRMidJrcHhuu98LWy3qg/Kfutt3iOqYTUoOctjqZIQAuYMfxRSL6fo18zDzwgNjwzamL89YxJh5eRZHK262LqwHGPhhYlwcUCASmQo/mvrJol34EpmEVn4oo9/7AW8XnAcX4zStaeol/6msvGSTAgfKOsQ7P3uTz4FN4b6zY3MrV311tVekg5F2eHGf3e7/0e7ggUXnCKxQDGgUQptzcdHs/1Q8fANdml9TGp+kdqNvBUxsO7J+kx4MgcyuABo+IBYny4KGhsSJY+coFZHBM2B+ByBLYQjI+cArrKQQAs0wrTvFv9jsvAJEIdMBAfhzsXyV/BSk4BRMboUe43GoiZBK4ckshFcgrDGNioTDNPUdsQtHjSygDMsuwFKio3lYo1auVaHmLjmw7bmpPo6UuMTp2mC+1IaC4bq4ILQU89n0MhMftwL0YmaBf2r43UW+/amPbYYTpw3PZAFhVlsz4SyltG0rWOkCpzQkt1I0X9GkouCMjX7BqcNF7+CTSYhFCGoW34vBsNoXLG6dokjcwQkKjsG6UbBGi2f1NiKqtdLWrb8K74TwARLCB2x5XMqpYpRGOaPju6qsVgQBDnEMppsEs11TK7dFjD4IA21WdOqulQMSjL+WTaUZ/BLDpkyMIsRq0eEI24TGznmMAcRkYcIKIewpbKN41mL15qsjlhqfBfsMC62UZZ68qrNmrhXcafNqY0tLHMyfN9ZHuzxuJz+v3KC9hJJGyO5qP3ao30tBxf8nyyoKZROGFJcwpqmZk+pw9H2C2Pv8fFnvcCHLXCKNAJ7i0jXfZyz0H6MZ8hBEiDMca8YQ1bsmkzO07cO3EdbledYUGaXFjV1bCFG84rKjUsYnvg9QOkTHNMwYIthZWLv60ejUD62euQezRzzrOkKtKG/Mj4Z+wMmgt7V44NXfBeGHubEexqDPNb5W6vx4wcwe0izv4fySBiFRCxhAWDvUGmgkrBQjAsYXdhKMiYRkwbquSlBKbIU1jUHps4rzo4ioOWIPVWUw0psW97fM9wH9RDW2txeboj0N3Ar+lMvjJQtvTkbvekrF7UUs5Cjop5qcZgIp2lTXAv11gCfTdzIjV2/lJkS+GevQjLeLqqCJNq3Gn5HVXy0t43fWGlzbd0Dkz3PZ9tmEvLvcadblcmD1wUCzeIPwq6zXZiBVL2S8wRcHasGS3KKs+Jy+UDKq1JmUD1Oe3alje+Vm6fqw6O3L81XaxFzD8BI+PIEiVQsoCrPZh0NkxSr+CPeqshDkiJVVEThDi9mzXSDbd7Xngiaiynw/6NZYdjgpWWpLc+c8OBc7XnIQ0857SuprBjQva23NVK5DJm0HocDSgpzRQllvn9Rk3cDVVOyYWnK2EuVYhm3JrgWzYmau0zOUCw6GaMdQWrMZLP2jQMVgtvulbs4qpsVAguj5wUNU6K9R8rPK+Ybrge1ibswcKRO/H1t9QG9mAdUvSFuBlCC7lh5sj0I1yQaE9p/1JaiPbAgWO1goTF+cYAkTxCvomPFTCV8/KcZhe4n0c+gEU81EYs440BlK29XJY1rK6swr8HStaG7uk5f7vz5zXdj6FsyLXZPGzGKFtH25VQXl3vo5wlJNxkdhv1JGp9hxk402csaxekc4nnsnsPviAccUTmw1rMqgC+f74erL69Lxl51U9GcABZ6xTLxF9pLT8CCJgIcKHsH7Bl6Myu3fBEo7fByIbKmoMLhuXxtMAynh8qMPEu7Kv2tm4hNPwEvy0Im5ZMCQwu/dp7+fhTVnbDZnsN80hZCns2cm3rUU5X02qE029GfzasQd1iAhu3U/aTul5hsczmtNtl49lNZ0ntXIMseaKRJOoTrC9gEXMTleoJsIPGplUGEMF3sITqD7ze1GogBs6IUcPgMl4JuyUCmcA0u/e6PpPdebUZUxZtYutKD2N0NJ4Zlw2mExEJLvCosAbgXMYaAPNtbXutipazRsM5A3pgt6yEurvzUAbMb4ksZXj8tnTPsonuZubaxqHmrLxfttAr/TbTED8Daqf/dA2NXHs8kuWVkG+TeQwM2F2mUlrVnV4YKwsKWKQoFFFl9rkDHMqu8fZlAkNYdI34k+sBHC1fqjcwZej5J4yyXAClJnV17QhFbFqDHaRLr20ICUuktjP7mAVsULHhfVT9Iv6jBYI3yuQlMLjUZ6dbR13VeSghoCx4PuP6S3QrA7Nm4F2pHASOZ6vYjcsopaI0VDWgNt0ypvtBzzhjIyWxUZLy+htl8FnM/fEIp3bfdOfVXVl3uQBrQRH2S84YerQxqqpTMncjB7gGbHGGr8b4dv2AY1VHrhFmQbiA2WBm7JGNwHsDekzkrFo5Oto199mMv/hUGHiQAEcIP9/kghUaPsQagoGm7F0554hjoUw+a3wSsN77eNotzzj9hdKn3AKOt4Sq2R9u1md8J/r19Vp6a/ZUpxJ4qSKkEN+uj1SKgTO+7W1vQzPDvGhwW1npI0ZJC+zrxyubku/ForjaJyCI14QkowiJEiBLj1hiXMaxdJS7fWslMf0PGpWN5x+l99biNMC3698YPW5Bj/aNYLPvRjd219bpG9HNKnlYGM2DEIvjDxAK+SeeCTKmIFL27N1jzfqqM0c4I45p+ziDNXAubhi4tEHHZmSqxQZYaqbtrPIp9W5VAszAOGH0xnCFwDphN3jYr1dTfTe6cfVGeiposjBnl2xudbIURpF5GI7OgEURdQdiqObPjus6eOAIsnCTNDjmPq0BQ8oE4aZxxZT2nZ3rNTvPcBAcwXTCEunsjkGE+Bs+weDIJkZqsKlpHXnsRje2u8TSfcHMRfKggEjLzaUCHguNCB4KYrLWqBJEnKPkaY+RcS/A0T0B2gUmJuC2pHjxkLQDx+kokB2CY2rN8mCg9yQM8Py4ZrgkYds8qk7Ku9GN7Q6xL6VFAQQ4E9okXRtNgwEfWGJY4WBRJEc8ox4AqKEjZjFdbw4Zc+PK4sMBo10JmNgtBpdaBsa+muSLY5p9zJoxKWZhjchO3LvRjRbrVLc4sAACEu8MShIHwoekwWBbJGSHRYcLl9WXSi7Rx/d43e1Fhsx0futmObktdoa4R3YeQZ2rKqt8p9VMWKqlXzpx70Y3WlCQtIplsRPGSEoIPhkMbqjY2PSJJtbgZltKSw62VisPADgm4ixBzrnb1Hyfp5DBhoNtJ7EI8r7WQWplEHiuM9VnCUGwS0zCubvRjW7MP8rlb59eI/AbVVDLwP5GK+M9Xnp7AY67aLPIFGPEpYcv0QBVXdMBTg4Vx89j9/HMo2HniQBoXQ+unKUtM+dm7xDd2GdLlkUwDmkb9aq1amgIWK8a9tc/rpcrklP1eeqj8Se1X7X+Ux7nqP5OLSL9Xv3X8QH86ICHNii3JnFkAVp/pKozWIjfJqKDJUb8CWZ6mxHFSHWgG8scmErgmmN18xMB8JGPfOTDH/4wRRyILQcQKeJAQREiKPH6C5H6tlJC2YJA1zYKp8PH/Th6BchN3vbHGDec7KLri3ttHS77vXVkHAqHvPOTYQ2g6we48rAHeHomFTMhFtY/BRl5Ay+hECQEheQ/tDdL/1EAjTI/pgWX1aAPKEQepDYJqQtP4tFHP/rRe+65h6ei/YL9ihxM+qhRmZEgANzKVvYuw8uvbcJs6pHkn3tW17Ybs0a9Zke9mhCOcXA4wb5+NVpngzyiQW8d/vxCJTccXYbX3voX1olkr7cHCRZ7tOiqSbwdYdisOFowgYwUiaD4ADlj6HD8lT9BGBFvqrLbkDZtY/eyxNSNC47phfZwPTDiBvgg9ph1yV0ng51SOvi8rF+Lr9lUv/Qq2S2I3MwcMU9VxG7sI7VxHRbXUU5iuA6LE3AM/A0uo2nx19H6Z8FHD1gf6MDTR2MzeCXaF/4BT6Qnl00oAUTbfmC/Ag1Jgmbp0ZRGPLWAxYFWmA4MOJYVD3kkqMmpExE6xiNE0QYlSdikUxIBUy9/+cvRtW1DXu1JYYvNho3qyyTW1sk83djFcWkMZf1YGC8j42USOAHBK8Rx43+Kj2vrRx6Pg+6505BF+ZUP1YP2whi17IZkfzQEW73bFRrEvA7GwgF6SIkjBewaHZat+K8X7Hw9Pv7xj1M5As5PKCnft8HTHhfLLIehCSbYe7V66zoueY033Vp3vEz1SkpYFRbJxhaWD0dTENlbP+JwctgDPT8IKkJLEvT73ve+z3zmM9BD4dKeaMm4FSsxO5rrURVVVFKwrgPHq4uP6sVkF9EN2VbFwJ/kUdzJEyWPG5sICS0QSewgu2712K5aTZoNmgjWUi6VBG3SA3Acdci4H8CxFwybBxl7Uz8eNcljvjK8LqaIUG1c0hj0QUb3eKuZ6Z/RWARcIs/Eb2PRInqk0be2U6uv/rVOenKyQb361a9mv/r85z8P3GANwQRZ1WZjLcFyTF55rtT/qCaFmK7hDnbvvfdiEsW7x+VhDMWvh75vE8QOoa7ljjt2sIw5Y6+BjPW2tVYIi0E8uqSHkx/3dddciZL9XrV2HU0RKw5Y1PkZ57W6s2HFbPbwD6z8r3rVq3BVG8qTotF7X6T2hgPHlJI2jY+IKp4BVkU2NECHV8wiFousJpUZq7qbcNDHxuSzo3k27J8VvSAh62XH9w2HReuqSUQrUUd//ud/zvZrsw6uFkxH2YcCd/B0rcFxjHr9uFkmQHhxOMZHP1hZu3B4LBKU9aev7AJ/WRmRl7WkU3p8hFG12JsE8ox064yGY2fPNV4yDU/xdAeIMuVhs0E+GLJK4jP4WHan4EN2d8xWbPNocsAi30lPXRfRgdaNDhg45nnbyp2HgT+aCEd2LSASPZoKmtYNBgr5wotf/GKen0A5WwIwSjY6gubRlkWwt3TplEmg9mgGELEAwG2RLb1J/IlGEYRBAO4dc7y2ox/tudCmQbXRoLpYrdXxisP+gH/x36X6S7DJ3tqYG64Nq0Ed/Ng7BL6OJop5TUL7Y9d2f+2aKtYp6F1NapXGH2hnRzO+ZutSLATAEWUZBKSfEtYh4dLGwqw7/kQzUSCS4LnrzEx0YMAxDShS6IwNkKB8HglxVTw5mCPUjOeHwxqkI4KHqpGvfe1reWzzOKlLkIolpbqyf0PwcUbJMsO79A4pfxhDgUUUEw+CYPkJcgZQduC4H/CxqWn7KOscl8VqTBEHo0vV2qhauVj1UCSrI4uLOCOWAZkxeqJV90Y1pPYm5JE3tfGxf81XTcPaHsuSLa4aH244kGFihxFXrIo2cYUz0i8E8kFAMTYu1tp1aT0/eKE8ZmSHpvE5Dw/+aDtsuBh+D0yN4CawiN+jVCLmyc1kp3WPra5s1Vb2opohTOXn/cmA4eLF04bN5yTwsPHy4cE1x1xPAzPioFSze+uRPIMaGQ9Vq2tnT59/9LHq7PnR+eXeYInK/Yu337pw6y2HFy4r00WHoBzoWibmTieljCYjbcfnQUYXAuL6mte8hvWFBd+aOtARRNqS3SYU6ni5ngpWHRhwjNur3Axt8p02uMANexo8X9uKrQ4iJbMj9WMl1J+TGhMWK/M40+WFNmO4vtFAA1XEHEOBJo5MfzU+wYcOiFOgqQPHaz7W1l0vzWCd1dFyvzdcqnqrZ05+98tfefyrX7v0yKPDs+eOHb358C03n3jmU2/7/mcvPvWu3uLhS0hW1etfCa/Sx2uIj+7oGnYSjG3MjTGJFryZp/4ey4FvIrQ4XjRZiqehHdcwQq4Dx6o0/5Xw1DD6qnHLDcXEspnMbMMzv0IZR3cgxB8rIYhGvjZstGwpOQ848lcFLk0vQUAyvu+++27UEPKuOAg7MC2wsQZ02LQPaOM6hBEJoQel/v9RfzQ81OsP1i4+9u3vfPuf//2RL/1n9cjJ6sz540dvqk4cu+n+p69eXL1jcWnhzjuxL15CMPoLvQIJo15fW506ehKWHKzeBG8j4YTaUEQWWzzaFV8o44Vn620NE1CsVddrIsMBg/z4ZAJSZa9n/TBiU5pTx2hYNkfd8MgkPxHmCrmjmIWucNJsUNghj8Zsz9PMN92ZU7yHwdGI3YHSIp38FYbLJoylZi8bVXdjM+ZYmx37o8vxieOUwsX+YLEarpw889g3vvXdr3z14rceOHF+ZWn50tKF6sxjTzy8vLx0/PjNd95x4tYnDY4OhqNev4zmqeODhtdUr06nOfyTwCKZLbgrjXtDno0UZodG07KB+4wojjKcu0y1TiRjPJbV9dXB8UCG8lxxAzW4xGGSgnExDkZHng1qWCopZvH2t78dJzIqNgJEgj0B5G9961st0V5C8zwkt9F5WZW/usH6fx4E5lg7pKvCneIjGycWXDp36uSjDzx4+rsPHTq/fFN/6djS4Piho6vnTp9+4hRWyIunT5/AFzyy4NmUxF7TIHBEDgUIKCRPjEAOHJWA4wMPPIDR0EhhsgARSDwtaDZbVqtK8Ea0NBX2Rnn/g1L/8CqCY1m8Ng1hSlaV+g67WKpoS762oeGvbL87WwKItiGkHNqo0wZIJcEe6aF1IvyxqmN9UCvKuLDo7Jo+q6LoZHlViRC6NrBIuN3qWFUcn3xQK409A5lH8IramzAYR6dcGtblZnqnbzrXrxb6Y8EYR7nwKXF9h3qLvThxa5vaWm9c+nA4FqB+MkzWA2J61vIaVrH4F5nKw2pxMD7lsPL3/qWmIJx2bZ3K9SeHrM5Qr5NYgrW68GIdQri8VF2o33KJFGSnTjS3gsd4pU6UPrbWXy8iNjYD9kdTDG69XM6oju8eDW8anuUJLVcLJ6v+BVqojyuVrR6tLp0YXByM1o4//kDvW187evrkiSUMbQuPnD87vHD+1ttuudBbfeTxB+66cPL2/sqwd3F1gO14OBir1usnW6gne21PQDBLD/GzOg4KCrFi8ETawwGL1BYDJa3ah9Ai3qAkWQnYwXE344NG5mebv6ed0RtqPDvRr0tgnWHC0nIqDQr+6DCIHrZbCtmOwFGjr9fHg4kLrOwXflB2CYwyyZmXb6ZRZKN/RTaAKNrhqvuRFQ7rmBJLsI5BbTQch52AAit8MiCGb4h9bU2PFXEqJ6qjK8O11eHqaMBSXxpUC3CDteHaQm9QOBjGtWB9OyhAp2HymkAiJx/1G9hUXRlB01v/X3/ys9H4J+MzLOnr6E3+G4xFdmEdl+uzjyaqcH1f1aBp+Os3rvCKbD/06aVJ4YnREtr02D29cKxaWzi/SuDO4uroe5aOnFpcqs5c5JIWB/2Lq6vLKxcvLFRHDh85cvxEdfgIEY3D8YQMromsK59W8zNnH6siXas++MEPogNRRAedGqk23MLt3FfdNch5miNdK4ZbbdTjZEPoEHnSpSufNK5/t+KKFto9jwZBa9xAOmodLEstThhs1exCCQRjMO+GLkZZ9q4TBemdat/ZjwbE0QRW+mPudWnMwMZouVYNlqhSXWeH9BZYMNWYga1VS8vVodHiEvi4MBosDdbVxfWE4WGJZgMPvEHFmgks8qYXfFz/23qmXVX/aVDWapgA5GiM16kMtrQwqZvYG4mxYwivyeHCes7femVZgXW5PnWvjs7pBT2HBSD2Gti9BLByxiPjijp9aP9gyMYxrJ64UD3yyPBr9/VPnjmyNro0XOXBHz12aGVp8eLCYGWpd/TY0cF4TfZrRjvG5f6Uwr5n+ILgJUyN/Kt3vOMdn/zkJwmttetplq1asOBIIA7Sfs3jE0tPQEmtNuSMUc6SAme7BcFRXyhTEZPaDvlZS3AM/PEGwxwhzdZ9AF8wZ2hcO1jeBnzTpDxbG4IWWsgNPmVcKNxLaWn2PQDK7fM1HSx4/bjxfboTjC4jY614jrVgIGBpjIA1WK5Uq8vVxdW1i+OCAmtPPjfs3XS0d/PC4uHxb4c1Pav9DVDjuHb7tSO2f5m4VQ16ZoHDYUEZJzr5cF0DX621zrX1f40W6ljquprNqCzPvTj+Yl1Ydsx5kbre2ERADACML6UTLUxbA/hybR2w8OKCl7c2VU6iH55aJ7ysjVlynThC+7RL1elT4/+++bWVb33z4f/735WHHj08Vvm5gDVm4/zikdGRw7c8+da7nvP9x29/cjX2+PXG9KU/qqLD99Zd3qMNKfXVIV9afpBM9Gj8ipiJ3OBVP8GUsBY+YZESXkYgMF7BalfrnG53bKuCnxefHApuijtiqWIcsFCQtTBKQ9+eMkfnMfiI8QIOj2kD9s7n+HYJnaeKYojVQSGPhLniUOaCibZhyyVFFIsMN8Kb+HwSKUm4D0Zua+6ya4GhiBqxEfsxT6AmVKs9UGO9XcqSJjz2skdW1u5/4tzDp86cPHf2/DL4uMojHRw98eQnHfve26qnHK9uxdE+/vmYVvaG626HXu8KrBlOla7plefW6lldRkk55WCdxvrrywryWn1wowbX+eQ4Re8ihtO6LwHQPr7+UW/dBFlo3BMyaxeX/mC9l8uVnpFJ4cbhOAUQU2W1dAkRtcjE+DTVI6dG9z8weuihR7/65ZVHH1w5dXKxD0k8tnZoYXho6dDxE/3q+ImnPPmO5z3naS98wWGamMM1x2BNhmGvV05Lldjwqy4SshBoI2sTfwtkBQujhVfUmjUQKb1ACa7qF73oRVjSKaJjdM41lNvS051VVm3STNQPqblLTWsWIChpGjEHITAOgmKUiOi0c811ocXNeFa7XMHh3/3ud1MzXRQnmQ8yBWN//vOff+BKFZEoCsCBdzJH4JK+XW6tkUJEEPljc6aQBBBJKg5+bZK73/CGN+C64fb33V2NeR8whL8CLMCg1juM7J2rqm9eqL5837kvffvc/U9cPLm8cuEiyuWhI4ce6y+cvuW7h++66cSzn3zrD99VPecEMoJ5qn+oP+F8gk2/UaorIBUssmLNZVgcNbXOYRGDPVinW/xmEBRbHY6p7oWxW2Z4oW7icrTq3VINjvQmv+9fPqmXcLj+bNCoshMmWsPnaj0hOoQOLQ3Wr3hlrTp1eu2xRy48/OjosUeA4KM337x6aHBm+ezFFcIbDz/paU+9/al3nR/cduRJt5546p3VU26vBovD8UrsLw4WLp+ut9eKdSPsN92W/FAzOv8kegzCyMJkIzfMFioTqnUNbY4NoAjxahBJ38OIKdVKCyk8TuAP1IQsOMKVfud3fgciXIbuXQObY6kpEw9IFczPfe5z8Ed3J3YtYAXOxdQDkQcIGbl4tGMEKKkFilppV/Vz9G7Ulk984hMadHgMKOP8EIjcj+DYG9YYpIpbK8JwyJPV8D++efYfv37uP+8/fKZ3bHXhxMXRcDA6cmLpcTSzpcdPPnDy3KNPDEcrtx19VvX0Y4uHUXmHNueDlF2GvCuqIdYOnwID7Ug16BVfm5JYddyFqqZdazU3rYnfpUF1aohXenRxuQcyPjq6cLa3Mliobh8c6vcOnegNeleCcnBysNrf+Bzr/QUDysOaU9YVaUGIM+eXnzi98vipIelxl84dWhycuON2dsPh8tmVs6eOD0ZHn3bnHc99bnXXnccPP2VMbJcgjMML5y6QPLB46Mh6FbPLlk3W9nDU26M4x9JRy1aNjknNKiqwGN0NVrKjI5+UGkBEUYaAyLLC6bVlMOkUz9XGq1nCZePygBqoGLCDWi0CQlbAnFe+8pWAY+PLO4yWWWixTaXvIuhAIjpXKTLK5NFJMXxI1w1/OSjemGqSWF1mieqNSboL64gNgF2LjUF7B7sW4IhnEL65L22Ow1rl7PXjtkWbPbf63a/dt/z1B6sHT90yeNKRxaPL5EyuVoDCHcuHz19aeezS+bPVpSduOXT8zpsP3XaoOrKQVivDUMJSie5dRsZhQdfsGTDoFx9N1PDB5LNFewkM++sQS7DOoHq8qh7tV6d7w/PnB08M1x5aXTlbLR8aDJcPjY4fWrxlNDjeu3yOtUlNnPERVwvX9pWYOIGqcdfUxfp8449PPrp27sLJRx49+cgTyyfPHF69dEt/cPToYGX54tJCf3Xh6ODYoVuedMutz/6+6o474ZnV0pExKcXaDuHqDxaWDnGeleXVw4sLV9LGPSKPwqI7Oq8wEqgJpi00HtQat3yYCnD5kpe8BM5I4I5UEZ0UmTfy7Bp2BwRDWEHYELlanS1cFaABH9wQHPknCxD11KIKquEchLDN0hvTsMbunVqdyjRsUwRVmZeiacM0TG7PNzOQ0eMkMJADsgPYwMydMCzVe44xIs0eqyuL9JQJ19lIp2dq9j6ZKMW8MUjCA3K/vEH+NAzzXujkNnmNZzBdh6orQz75PF7vvbPysB+PVgdLh9Fbzw5XjuLH6FVnH3zg4UcfoWXcCbwyBPdhbORqBwvnhmu3rh0mom/x6In7Lpx+/Bv33/ZDdxwaPb1aXquOjWdubeLlHZR9AuqCXSur9HauU4PGADUyfGhtbF2sfR/+e3S533NtFpw4T9b666A2qE4PqkeIyR+O7ls++zgQdea2lYX+qd7C2WF1hKsY9M4u9JZ71fH+BGd7w3oFrE6QeqGOSRo/afDv0rpxcnw9g7F7aTjGMCK3l5fB3bWLF1e+8dXlSyvD88tLF1YWh2uHBoMl9kFqlB1dPH3uDBa75aVDF4jaGi7deuw2SNrI+o31XjGo+Ss3fOjQwhXG1nE9x3Fz12GrqjxG7SFj4lccC4ZDRIwVLcXeHlhu4SjL6JhAIQKJyOFRfFY9QMnkMoQNtE5riWCHKm0ISY3lZjgRN3ihHlweNbTItrCmnwHqrC/SbVH8qW3BykociPOgyYuLd7l5arIhuWu/5uxZcmGHq6y9N9nKRexF3AnB90ISn7BHYa0zO332jpdLx3j3QD24KzCFOnEY+3TMW4G9KspGuO8FIqPml4lNW559G/6MK9VqDs6TwJKNSRjKbBVI9BSM3HxeTXrARm6iNVysBxdmEXkDhkz+v+oumdE6KC2MTPgCKnpnLl44ghPh+OFh79DFZUL6VmqgWqhWzvcW18bO6LXh6qW11Yt1syQCt8cMdDRhjuNo7X6dUrJq3h1+kIW6GPB6UxZyjfvmedYhi/xx3b3S710pecO6wPaoL2ie6VXfHVbfXl391urKg8OVU73xgfjKcv/wpdHqEn5lCuUsjGMuE2apglzUfVgbM9VBD8PiytgVz1/HFRiXxmdcW1hbpbhO9fip6vGTq0+c4jH0H/76Uo/w88GxngaDtd7quOyEiNtfWBosEtF409IRTJ08uGqlf4Wv6wpf1Eahni2YIEMlTMkxopZ10VgIgkXJCVwayCFFIrAtGrdrTrRoC7JYR2dXbIUxVmYh63hoCHZKgnN2K/OzcEBD9C3eoITx/mw9DFPnakE67oI1RQxJWeGC4+D8BGHAUzJ/+CdfNhkX5Cmhf1dGG7U608E6JwEZUOPiUDMt3UEDA6wetiuYcRyzUJg45gv7HS5vslP4CbDIpkF9JK3FykQpBGq+yUhJ+GFCsqcLIO9KqEHYLorJS1/6UsJrMetw1zxFPDnscvi13SHKXFQEAujn8Yv1GCUx9zBvexd2y5TUlkb+h7nO6JbDSws33XS8d2xtuIzUrvQh/QvcaW2BOz662F+7uDQaHqkO33R08diRhO/UBLHMdalVaWhp7UIZq7BjcKk9zeMz9k0xrq4MpLlUX8nl8MPhJFARztirHlqrvn1p7RsXL3x77dLj1XAZJ/Di+GCjccHZBZzUx/rYP8fnAvvMFK3KgrXQrnHY4li/vTS2kI5q6ormPjpcrQ7YBB49tXrfAxe+ed/5+x8anjzdW754tHq8v7hExOLgMHlAS2Dx2HiCZnBoCSkbZ+0s9I4uHj12+ObxBRP2dPiK010BiZOG1tUOmrKagICaifKI8KivgBHwqTJT1m27ZAARVNu5IGzoYdNVy3YNOArsC3MMv9M6z3IGoNGauRHegIY4msE1rPaSIS1yNu0KueENAEqhA1YZN96gpUDhz/7sz3IivsAUMS0wFdozcMsh0bt1swstHp4wZFw+OPjmN78ZDi9J5hLhkjApd4/ZtgzVaqx1H/jABz72sY8BIppIeAPa4jjOLpcG4dWkbUVM0RvWrdvF3WO62ARoiFmHm6W9F0+Rx8MkEBsB8GWX80kzJ3DqT33qU4Qd8H2eMQ+bEApy/pmoPXI0YR2rTBLEtEd89RhLFm86/qwf+L6TZ79x/omHTy6fJFDlSP9Ib3SROMfHT/TOVSsXjvV7Tzl2+/PuvOWZd44dwGuRlmF/QonWLWzjgJi1QR3gU8eEC4cA6SoPeFCn8QmDq+ve6MnTGg4vI+NCdRpb++roWxcvfnv10oM0LakGF/tLGC9gasRjLq6t3jys7sAkunDopklmXm/S16UXa2UNmqtjWFzVA354/Lq6uLYyfOyJtUceu/Ct+8987ZsXv/Ng9ejjC8srS2vsAcvD3mCFDXhhcY1gx7FwQYZ7C4fZHI6sHLp46cTo0JOeUi0sWsK2QRsHo4btdbhDayOQAYLQa4hXpAvJRw/D20BNe95MO3DLMsyl7SgsoaxAejV8L56lbKQFDgLuj9cDUyD6MhwCogdF8JV1ISNu4FdqA/IFfqVtrTRMyZNYfVgkoWWAIxsAhAx2kizhskb1NWCOmWiLFQINWDSYGiYl5L+6sirthjYL7SZsI2AHMuFPmFDCg4iVIepQ655f9hmUJZi0A4aCuVmVWu1ujQRGRBYh/NB4ZFfXE+9BxnLL8iegPKD/nve8B47J5HBVUmyQEZrJ9+cpvrtTcKyjk2tL2XBBUxnP50knTjz36YNzK8MVurWfOX92dW24Qtrcan/1/hMrvaOHlp5y4sSzn3Lb859ZPQ1D2zoQDqsNSlvXqYFjzQkLX8/j0z5grc7l7o+V7bEK3h+fn9TjGiKvhI067uY8nLGqvrF64WvLFx4ZVef6h1fHUdkLg7XBpYVLOPtOXFq+czR81uDYMxar2+o76I1p7LB2wdfNoicBQ8Rj1ubFtaVxChD5KyvQsEsnTz301f8ZPvzI+e/cv0oVibMXjlL9n8Am3OIXL42qtdXeRSaK340f8Tj4qbc2OENB0LOLh0a3rx5/2jP0axGq3i+ygwbrcDlJ4Gnk4FTVRi6aLQaY+P73vx+xgWchHsCEMoOAQZqSa1Ba1ctQQXXYUhWNsb402e9KdEd5IsQbHAQTuVRe768HOGjzO7RDFjiLJS2ty1xbqY9r3HthUUOMNqS9/NBia24VidNsFHO4ZuCYWtlZ2PpDNPFWk+qYs3ON81dsDfDqatL5QN+TIYT2wPVEie3kc1zk2HH5Gj8Bp/gacoN7jq+VNspd3BsbhXY04nDScseOFTWlJBEOqlcA9IqR30FokPgyB/FqmxxrtZiM6tGCLmumhwymZ952dKG6667bzj/4xOn7H185c7GHZXHUW7xt5aYn33bz05587M7bF+68tbpp/P1h73LZmcYTHdXZK1amGcPiyuq4NxXANRaG2mky3ieGYzPHotmGo3XL5ag2hPZGy73eqar6brX6neHyfWvLZ0neGYzBbWFtHN/TO3aaah+394bP7C0+Z2HwNFoUjBF2pWd3l/Vm0/3A0lKt6/fXeuP6jCzFxx+/9J37MW2c+vJXR6eeGJ58YrB8frG3Sg1vVuKFtdUVqVW/bvqCjK2tjlYAegKbeivjZucLg+MnYI1sHGObZX89SXGgy2c0KvTo3sTmMOw3mtJsZwAx0EYUDs1WvAIu0AU0RwJxLL1cXZl1p7AlCCb9i6KoJhx6dtW+7ZqbQlxYv9S2+OIXv4itiZXLP6E4tgaBxCDtWRrpz5VEb9NzJYyCIzDCfkB+Gm9Kp0Lpb2Bo4o8LSw9Mow7/XoOjim05y1ph4zib094XdEACYFKoqByHm+SfmB1RzEtjYoCJjQjrJGGG8HNsGZwLd5CdIa1UzAbLrCVGYZdhpvAINfKT2BKRAMv2RBD50Lbazpgzc+j/s/fez5JdZ733zrvTyZODNAqWZFkWvk5c6sV1KQymDC5MKl5T/CXv38MvgKEMFC7A2ETjCzbmGmxkK81o8pyZkzvu/H6e9XQvrekzSTNzjkbX2la1e/rs3r3DWt/1hO/zfcxmnZGDx8daEg0CXr72ypP8MY/9VOwtnYifP76wlzfXN8v+OOHBNuGzC0VnddlbXvC6EaI3JHcL/11e9pRc7d8GjlPEpPhwe2+4sZsPRkHVLC2tkMlAF9brtLw4iBCPlY59wZT0PXM/KXnJDCd9vcnWvWo78gsf4IJd7ce5F4NvS9laGD0dJc/V8dOR3xZWThEHeROKuJDBoNAW7clkI8yIwtCk8MY5RFysxebaerixtTTKQzC03YlISJOtIbJXThi5VdM1FTmYtU1Y1UEJPkrtDDsXVU4OK+kE3eW21/Fzn5hl0jFhgikyOuJDzZQ4ebtV3DxM6NGaVzawiI/CQLpH9Yhy6dwQ0/5En8bBHiNlR51cLACIh8j98YoXCCBqTmkOiN0MhJaQKGKwACk5hImvyqckGwjNUVKhoSc76XSmuM6WJrJVAMGdoXapeB/A0YYG9OfnOj3ac7p3bbXlZ3ELADgWHCIInmGxkpCizFl7PLpliPwiZhcV9X/+53+ubjifgJUAIjcUE5JIBIfSpj+EIR5v2NFz9Hj0zDXprGoouprZhVF9BLASe1ZjMepo80/OjUvWTw4Cwee3ogliwy0xnGR8yElTiJBr4OXLZCr8+HiK3H+7ECSijCZE4CyNFAibVEJ4zX7v8N1AWz3ra9pUg9GNy1evvnl+79ZOU5QsUStHj5146szSmRPe0iIPEqggxEfyx+0oUJmcMvi4XeZDv4K1U5MhxsbNxQbE+KxSfzVITzXtk0XcljxyCc9bignDaMa5vL00hSuk1mUw9rZ3i1tb5cZWuDchttju9OIWGamu72UVQF5P8qpV1Gh8dRpQJS+aXI7OQ0XVAFuZU80DGvlGvV7XXyL+GBR+ye3pNdG7yPiuF13fUYLjITatY8EpwUNi+fdMe2Et07LGmgVHHWY6y3RKuoEdGwS0JuRjREZNfPND+HAkVAkF8MbN2brqD3cMjyqAcqXq/+EsKyOHZDTxRGwdLtzOfZvnVGRUiLRX5DJYvMdXKh49ohl1x1z23dau/cuO5ii+/OUvE7YD75QWQ+wZD8I9vtUNw3r/p3/6J1wPS3HC3tTQLyY9YwhI5eaSO+ZuwmbQkISVybA64RrmsE1j3Bas+yMdLl/f2noKgmoDus2stfMMT45nCQgSPCbjhJekBDQSbb/0S7/k4v5Bb0kc2jCYSE7gPEdTYmnH7oOn2p7uMPKLQCCLVIpoMSS2Ks7KQZAH9nPV92kkL3JcbLTxbnjxzerb34p+8P2ns8lq2gV1h34yeea5pc/9L+8Tn/SShSyIJ0b8QtLHJj8OnGTmQAyUxXH7WF4FxQR7LwrHKUzsXtqOkv93yGvUJWkb+RS/RJWhKvKNvA4RxGnGZH5qjhWlaIGMs3L10p43nuR7u6O93QLfIstZCOK4HfdSoNBHnK2WhA3XyJODRJdMFmHoBBiJxWBSDQfVMC+qqIgWg/bedr9YXciefXF85Fg7jLp53c3HTVdwqvFvl9gwvKZoXzj2IcxGOgtB1cAnRa9AedFgBJYUeGHHnvaB8Zz20HNT8m6fu6QLN5DHr+i80Pmizd/ZTdGZaaUuke6jR1ZkZAd8OFKOIKOlH1mosvjIoZgReli8Oq4IO5EpDxriJgKLJC3ARxYGpoaGyKwxaCWy5rgu+2HHTtLHFcd/P1Vz9BFqAhfg4EZr0JBQKx+62KqwpY6DKnq6S6K+KpFQs2M8MM13c8fdOlO375o18XQH5bFb7tjdqpfmINtNZLtKbhp1JWxMtRZDmcImfgX+Jv9Ee1nBUdNHh2E8vqdYkhfNZGvqd4tqfLcSRsUrcC5hupiCQupGBs3O5s7u5m6dAXBeVWRSTMQzuXojfPONI/jpybl4oVcKLYdiZrxVYE7AMZ6Ji50IMy+pOoGQdhgFnSDuhkk7Tnp7UdqE0s7FBATqqT5Z7BW5ZHskD5MgOOsVZSsrPaQWr75DDiabjIrRpM4zvM1Zt6taUkQi+BgFGiYwAYESR7k2+faqIWHVblLJcZcS9Fzq9Lxjy+3jJ8LFnnRaDZpD6LQKWFDfwkT453/+Z/CRwcOAYUFlMNuYvjuGH9qs0QSmyn+ppaKfMInUjdPsivLPGMCMXoVO1y6bE+dnB5s7tdUZKorBe4Y95gJTm1n5lNmYpHwCVvITvKqG0JMj5fW+nYfm6fUxYy0qSVDXpf3tdG26g1UFxNFPtDeQ29dCTULtHkkEBHoNT8IFO0txYLdcFLpEs0TzYpYhxIcayNhfp+malndjRdjiGa2lgeSk9qOKuTEgXK74EyjMkXi3tSmdM39U5do4b7HmHzAVEkmNwFcdDXaGpJnbdRxOhPxYeEX/1sat13/sr3bXVpKgdTQN/UgjcxidolmGEegvglVx8JQ3XvKLYQyzMG4lTS9EADxoe81qKxJHPJxKnOX+jNCe4n3XkiKB1L058Db7xc7YG0362z8RyKgbQ13yKXchSx4GaknV2pCc6KehN5E9b3JqbqoglQx7AmO8QsNSSmnQQ0vbq2FzmqzU8TrujbwgDavo4G19zhMYAix4xU9ihBBl4j0j3+2VdMeV+72mm21RLGkTpWfzim3B7+KHEd/nn4x5Riyu2Je+9CWsV51iNh/AG0DNShTqq85EDTdpMy8G/xmzEfICZ5kIYD1XxF8Vml3PzLZk+OkFR5tT1odki+3ssuZKzCqi8RVyWJiZyhKw5rotWVfHWdNnPFpLEXAjEeyGdcnaiCdOkJvnp+13ecY8RY0KW9iyaff9IRuXUOYOUyX3KAdeqU4MbjCRn7DEde9+PRsOx2y/G/fHMRJLA4hNPW2kF7j1cI1JPGeB18IJjzAfW+2knfpJqykBtRSmIGpfTbmzeWNw5c3VZ5f93sSH1lMNhehT1MYvrzRYx0NeTmjF0Cxin0VhK0x7UQrf2xersof4jRe1YG2VQasW2W3f8JFwIkbNzZ3y8np56VZxbbvc7DeDSbm6KWgopIVELRFZbkHISIV7A6NuIaQjzb+P4ZuRfwlqvOK8CYwkekhiCtgt211/eaXqLmRerD/aCfzg4I0GNoADg5HRzvBmWGrS1tpi91abvu/xbYxSZwceMfQPOnCRFNUOXJRjKKfCyt3D3MbPBdEI67sKjNxhfD6CYEAqjG6VHGcSAe5rZuMrKvAKVZs9wUe1EN2Y6VxHhCfHYoiehCnqWoj2TrkUfEtoYtn54he/CL5AbuAp8jxY9Kz4+xyTXt0Q28ZAQzbsRgQQuxLuoQp78Cz5LVVw4tnzOHmW+gg1WGmfpZuJtvUJc6RcO14tUuvqaoPl7j62WfYTtNlGMaGaik3l5GGbWfmfP0uDJMrETqPjx9byY2uT9fVmkkudYlm0YgCuGmV75eal0VWqbbYnqGxnV8kL034gQlq7NNr93AdRr6Ufgx9JT9RAbDfy1SIk62ftLtUqddrz2ktNZzlIF8IYYzIodwbDazf6b75TXLjmX9tONobh7jjI6vJ4RkoHLGH98aKkREwsjCQNJGkeQpMx63AQR0GSBtIAArif4FnwqzwV/hxKionYcZRTQchX2p1GzkTKJcmfT5XID9hoUOOLgaEZCV2V51Ixd4yPP/iMs5MFQPzGN74B2wwZU95jNzC5rMqZFTcALiEYYVK4cj56EKbkr/zKr4CD4CluuLp3TCWcNqaSdZxVciGYFpXO1x3ef83+qQJHcMFl/+j9uqOn6QIlEEm6hrUUl5nVjBwOSIcNyBsNHjOksARZrHAE1Nq32nD6W2Ai+W5qcpR2oDllPudxstzxRFnciIk8bTZc+LbZrA77fpdk7rlapRBb42izNPpDagLoF59EcVxXXkxo26KeUHu3ly/PSmREGjwcS7Y5GHlL0fKR7mY3LIdF2VST0TiOMxgxIUZZtjXeeLNON8rU32suY/ul5FCoezEK442xhEiSR0bNoilJFPN7YQmfu252F0CutIl6Qbzqt1bjeDmg7KWJdi7fGF69Mbpwubmx1R1k4bjqlCLws7Nlsg0BvnJYCQXdl8pDHj4WreRtYmEKobcDSkbSEatc6IgpJSlqiTx7Eo9MRHmCipk4jTq9Mu54mkQ6BN1aBx81VKdQFc62x+K227wihgUSAXA/MDWI4+NEW4PUbajgzQphNS6voUnOTU0EYBFnDiMXr5w5iCVBOkUZdQx4zSm7aYP9VD/LfNx/nj+l4HhHi2m/hsd+WR1uPcp0GHpalgTYsWSx7uEa4CbzDEA0cI0CbY1jeo70CH/FifjP//xPlkrNnXmG3M8z47taos9D1aWP540hCVDyTw4F5vInFam8r1M8B5oqNeTSLDRK8CS2kbhNgkyrW1TOWvmMtamMDqz95Dc3kMtOB0Mvu+W3s/QoSZIow5qPmwndqFpNupTEvSpsdilCSfBx06GhoomyjT9VUyM1Tl1LgyUHfaiqC56TlHqz/NAZwQdpYz9vN9WuX22XZden8DsPqxub4fZue3snLspOLMglekON3ynN4lSb2diURhWjEm5iVkndtACldKkRAUnfUKwWusIfkvQ5QmQAdRSHrTzs1N2V9LgfkSqPJaYKQSipbBubg91UYkddaTaVILhbUuXh2Dk6I5g+6D6ojD/jU60TS5nUV13vVdxBLVk1bN3KiBWz2VDYHLtDz1/rO1zIs8RMl5FzcGWOHzC32mVpzUVh3Xvk3jJVVORGL5mNv2IhklbDDCS/xsLFX8EvrD/QU/kHbnGLOtesgSqVpkwg/RCs1D9xEHCWsnYMT3UKOBr0SQ7IK3CpzCw1A/fHHHXNt6QzN3tjddjc0q4nLicT2OarlsmnrjSIUkbCvTFtUkXSoRC1yJ038+3NyV4/3NvJoq3wOD36kvFe7hcthKnquO4cCdtHcLCbKJlgCw07AjERT56WhhSi1AbKMEdMpNDwB2lcUBPrwu0mY9OY+h6/iOKsjMd5SHnLoA4mYXEzb+dx4C3HXeC7yCi0y2W16xbtZtbPXs2R6R2ujLKaaAiFUoE9G13hOMNWbKI6lydJk8WojltV2vWPBG0S4pEsA5KVz5rI9w8hW60SqOCRGow2S6k4otflulwPEziZ8Tf4LQ1MgYwqCe7Najq8mYYu77EMCJoz/pWVrXPWVZyyGKehdpuwth+6U16/pQjLn3RSuPSPD93qect5zoqeC+S5wdo5EpNqkNxNx2GO8KWwBaqq9omStzVn7brMOoDw1rUmlNJvvoVBSuAZD4KibxDZrtsuLFpXeo6jb9d5ezJ2rD9pnnUVTjHR1awVOCMaWIM+dCsYePlu07/V37k1Gu4W2SVKk8MyD4sy6I7D0350pBeUnXF/lIbLUAAgKEYdj/9COtdQDlOLaI7YolKK7ZsO2nwUmu4FlVCr8cNiClW4RZVRfGxFQRoF3bjupmUnqhapKIREeeTYGVNazQGLSTOhtEW0Lsjt9KnFFr/PK3M4PdgtVVH60loWLmNByBOqowwC8bf54XIB4lHMD5uaGOk9TT1jnpX+uLV9tB17/FdjNYbtlkqrefs5NI93ebPMXCtha4NCRIGw3SzB24WV94SM1l/WEmYtCLZYZvdhdmAfEDeEZcmYJ1VNdN76QHP0uAdxh93JaH2mOefpiWpu/IHpDvi4NiLKkMPxrIkxYy3aUWL5q26dk5Zy6xhVBiVZINAZj1sHig1v20fLCqwJbss8twumG1F9EjtcayzYgwQe+ZbGI333tDzbVLIU297elfH25eHulTLboUTIG94UlS+WfFC169c93GBwJw7LBUmumJaBpV/U8KoxRqsmraJpqttQJT1hSs50zWbZnkrikKwbUvUIFbImecP9a5CZTCMCjn6bTAsGqhwkbONh56S+wrqQDHOddzNpUSDUxTosCxFwrErKGfPBMCxA8BxGq7jW9OMDK0tvsSIDDTVcaEGG8EiRY4MxGS/3qh4eNpRKuQTszjD0DqHvgdsU3rrYNgSpn2hd1sPFZNx1GuyDZMZc0GZV+kPMBbiWeEjwh0BGvCUNMeE/WZWs91E5/ENwPMCNp84ySIQRSQjij7gVtr2BDkoLbTa/bH1kbElGEhkh7/bKGdtr3AZZtE5cxTgYbbYdjRI27RL6BCZkwBLpQiqCsSLdJbRr3xhoed+brFc7l/e2z49238kn6349ZOZ2DCcGHowwtMn1hig0YAYiVSE9p0LTtpTjRJLbEQXdtDRJqpmxVcnP2ZZdfF5rinwqBOmrgVcBjHLfEvHooxAkTLALmaAiD0GhTBTzkVS9IP3daos0uDELA7xzpjFpZ2JhiH2U0HPKiA/xBCG5jkc8ptZeNQFSY0wnaqlRtKDGMSLR3jqxWq11KTCfiHyuxDBL0/swPuCsjM14WC9Es3mMWGX1uv3sOf+HqwZRaGNwop7HkQE+QkkaGcRDwoCgUAc/GoeaYCJ2gCuRa43ZD8Hx/8KNsmvcE3xkmK7K7cIqxEIEJRkomp9xH79in4ZOlERJXNJtVG25kPyJHDppO0LdSnIkQInLr82vSSVZ9RGb737Sbk7sacOXIgRTTASQehdp57z+xmjnyu7W28VkPfH7LZLUwbAqx63ukkkNY4o0pTQ7wE4L8GsbyVzIfYHmHQs/UjxSODpxGai2l6v0A5pJTkZ+LtTPVfCG92G4Q0ogFH5hPKn8kdhQeQrOxbIf8hOS1xGP2CinYTJGy9Nnx1MTfBSIhZKepAuCklihEmAkVVPEudTMeTtlGpVFyAmXwSQLxmSS4rLbTU4cKZYoxJZkfDi1o0WI7RDoqTZ2xPrKaMSmY1ji6Ci5ApzSlKPqhz6EW+05ba0IJtI4E242xGGGsRbgKkObH1I6ml3CNbz42CUBPwTHJ2VjEQYZwUeGFzYgsEiyG2dZRduxJXmDhciIZFyq0rgGdxgWmsvm61ZEz2qE8E9GMPTJv/qrv+IgHAFk1IUXehCOCbkd3jCsu2ZTzR6++6ThYzyVAisCMZgmXrbjDdbLwa3NG29mw/VseDP0R2G7aonIIyZbaDjVldH8gbVjek4ZCbFCum1NpcRATBEMF9m0ekW6w04lagUHG99AoQlITTFIOOd+oL1O+cPQp6A6SOpqNKYZ4Gg7yBDpXmyFHYjdGiZL/JlwEBM46qhBOkMa8zsmK8ZZQvauGumg4MepaTlNiFOikT6ESL+KR0UyqkVbDU7C0eNVr5tJvl76JwRGE/NwHpWSLkBGlm3GEplGRiY6j7qE44hg6BH7RsSMMfwQyKtmqUbJOZrqXNjM4Zyejeu8q8fz0+BQ/5SCo320yvTGg0ABCCgknsjKDM1VdToZlAhGAJpaWYVRqQQugi8IW6hUrTdLQGuWjZ3pqPv1r3+dr6tpSd5cK3DARFZjfosIzqtm055cT6DlGE3RCUDre9lmsX157+Zbo+0rxeRWHGS9DhUxCE8QsfOkW3O6UFLYIqwYEqCVWJoKSk3dkmoYT3tRNYExuQSdINcUxpgLKmMhTnP9Qi4Xoo031YBstBW10Vjj2HwAGYgYYlkPssm2nxW7VdhCTiyF203BXyTEgzAwXP22eQ2l15cQG8PANF4k2mlgUnrDTDUlfR0JUTLyy3FaCfE8yOVLYZsKD3/l6LDVKYxgLwrqsTjWkk4/6PuPz0HohrHHgAQQecMn2l2P1VobJzC0GGOMKOy+9zqE3IywBb65YlmrnnsPYYEPwfH/xgvexxzqmQ2803AhaMhwJEmNg3zZbKCegiMLLAFsjTnODRdNJjKs2V+DmCrzqQNRewfzdZb6X/3VX2VY8+YJHWqYVaQf8kE5vD7ae2e4+dakf6karydRloRFnJgloRZdbF9ogUkZ0ZsUv5YsN11bSjg60jcB75UaPCnLIw4ofOwmFq1dvoTspRiMRhin9qa8QRGxaIyKxyyQIX21DHpGwUJVNAiCd/wOCsNxONqbDKrd3M+hQ4o8D7K2lNM0ASV/RkOh2xdBCjAxFjUeaQsTScEMYRHATcxTkbCQDt66OOU16kHNCDp4YILC+OHk11GjWFzpJAtDIVCKFLrRKoK2Hhz0jGHUsb6iOqFFrm5/FTvS8EuoV0FdBRIbg+oh7APNqGiQR3m4ml1Ul3muTHa/iOSTSEH7EBwfyzbHqXQb1PBG+f1YebjeoCRODVakcsEwNimUVgEh7dDgCojiJjOaFUZVvknjNRo4Z+NbmAOs9hwTz+gJ5PFM439llQ36u7du7N26UI4uR95WK83SCFmGSVnQcEVsFz9qo+0ASWYEedsMo5ZgEmhUiSJFYAR1pTjPF/pcXeVkgUEXooCxNlWwliP0G+lsIzq4tel9MBX2bsQJ92kKhhx0GdRomC0FvYXVhQkkwKweeZM6FDKkwKyhS/IUC1MJs6M2I2UwHozFJCLLUIhsWSq1g60OpG7pqBUl6EYGAtxCqCxNQshUkQfSqTBIvdYCpqjqpvva3qFqpjrqB7kRBydV+K//+q+W28vtVs6j6xFrvcpDt1R1axD1J/bnvjUy7lIvnsDy5/cHHO2c17t5j6bPtjp9/1/domn73i1PdlenQ2PGz0GSTRyzuYTVRbNRIYO1OHcE1a/nElTP0UYzYT+w8oOD1mb0HG161Z4AcPmrvaUHHmP1MtMhGgb3u70EqM3D9JLksacdV8IEYdvKaOzsfN/r38g3MBjfaopraTSAjwyemKpC0bgRWXERy+43UjZSLVUmLWA6VrPIlKacEJyp/bKZmYKmiTUVeTzvMDTpjdCIxbrtTTBjxIgMZqR6dfAZXf2wlSBaNtgrf5Au+MkrrWxtcOPt/uBGk0xWonEn5F5OaKFVxCZbvlC2NZMDq9v4xHQtNHIRccI4Fto4KECYmNpBKbsORgtlL2ytbkRtvxe1lzbDZLK82Hvx+PJaZzJtomgcfAksh7a08kAHqmbzLMnRlVjGodZIDlk+W3z90IP/3tjqlu0+upczpy7xiMaNa9nY96669r2Vth8VHF2JXW/GMFALfM7kdu1wN82vC5S9KfvjF65K8H3vmrtw3QOpD3+z3Q5IuVDXSE4GZ0fP0NZZK6dX138GtBIjDuf8A9td2XdpetIypZnOfNMEBglb3EZqQnavjfZu9gcbeSZMHX2wGrknlSwQJ9+VTlqmYkn6vJh+rL5500xbA5jnKU9/2nxq+ojFPDO9T93KIrf8ydunIB0STkyEGt4UieEFhWm3t3K81YwnCEmKdi265klMIqYWQ7McGz+9nnYw4NbDBpeWi2UxYhUQ+AwEyAU0DaZX/TojLQ8h0qd7zWAnJvoYtPsDqZrxpvJoVsJHy2sOOuzDkqxiyeRkVLuECLX24VAFRmIytC2FauOmkj8osX531j+KcbNf2cxFQ1fW4EDcapfG7K4ncyGJudqSuf3n6sznJoCtsbPtbu+B9y5SP/b+1A+BifaGaFKbZDQtNIkHIYenfTW1e5zeQwVKWJbkf8jPHCJTbDY4pJLZdjDlrsWmUMU3TjHpl5E36meDwfjWm8PR1nC0XsPXSeoE2TFwhBgithOldY3hg08Tt6VpYuqZ/3gQktHw35VlVgz2vRmrUUaOQujtHXjuPVv8pDZwBg0oZXxg7sbdztrJtleOyp0k4yKQ14HtJ+6xuNeTetIYEo+R7axNQY7IO5I9ElqP9BnTbtlTez4e5VHhQVEP/WISTcp2q3XsxAJ3Ba3JEGSd6VkSVZVogKkrP8iNEUJIh+pV7R+nKxN3hsUJiMRlIWCN6gqpagbSB9G9fcRz1sI21zZU3NCmI7arzGP5rfuAo4v3+2FIh7Ul1rv7WHvK/ZaV3Vajck4h8b7dCu+WdHt/H7MFehZ8am8IkIOMWoFjFZW1YJacD20SAFBsTFef/MDXbAuSgSuuo71TS0mkUPoy3hxuX+pv3Rr3367E/BokUZ5ISkMAT6pV6CJdSzBPG0oZ80+gMAgLscDE1566CI0/kzdrgrl7FVj6t2+rYjxDamzmW4540+db+Yg+ij2KIgSCPVTbxFGSLnaWT7fLhShf8Ku9KBhHQRFTf01cc1htCXhTGMPopZmMEL9rKmRw0qVlYCW4aXao9edCGmNPKMERumSJvkXSXuv02ksrRBiR9VEoVEa6BExna8vBbdTq/eIv/iKsQ7RUVB6RZZVgN340hSvYjMSsoSVC0rZt7D9A25zP9xCWnVuaYU1IlzBvFWAfmiH/oAkZG3b0Zv19+ITZTipNBSDARN1HO0lpWlazYBbO5+6L2onax3muhP49OdfvLz7OUSL0xLgJhB0xISHrML5vmY3ENyhJtIjBjTA4C7723zickT0TSzBqrbPaxXdjjwI7tOvbKXbe2bv5492ta15+nfxIGiO0XgNHgW/MXsroyH80ocKUsQdBPiF2U5vuG7JOoJ8KbdEQC2u1397tUSp3rL5Nu8F1pfd3ZZrGpkMRZhc5nUD0GTkiHaZhH0aLaZTGSScpF+OynzSj2MtbxBdj0cxlFRBYhGzpm/9CfFMEJioDmuRvAFlZpyUNkyCf5ueB5Ltj8JCoXpt2YN2OycIEMy0iVbk8jMGGbUgPGdZROp3Cc2QGAYIAogoIMLT4kzbX/GAhoxWjcrsZ39tTvOPmtoN2w3fYZzht5DxVavex8OQe6Mxs6y+IBcAilZjIHAGRnGh7tnFOPDYIpfiMvFGxWFsbb4vn3XYT7p+sm3xvt9oSDp6ErJl1D3Ux0Ngwr0rzJqmtMSNokpB4tUuRFh4cZp7amUDTyhSr5m3Uu4gz0qjv6uDWG+PdN+rRrTjtqyCs0WbwBPSk37WwDI3ZCBEmaKZaY6GYd4GGFDUkp+Zw4PvWU55GFM2f9enXt9/D+Tf6/l0TUig92KlRbfx6kzxuMlrVED9EGtw36eUgqji7AkmYpBULtQU9XaxFX6KoFAuiSlEiPwFi1mJ7SvCuLotpSyL6aXU4Tlp5LVLf0Ykj0fE1ryVCkMVM89e8SlapOvjnhb3DDPr85z8PJZZhwx3TFiv4JVo5Y6tU38eY0sNNFlcgcj/b/MGPYxMbNlcMCQTtNcJZzDXmHarj3D3t1HTg4KiPgVPBAvrjP/5j1jT0EFXYUq1FsIDJf3K2YfOTmmC5U5ifS0arG659TbUPAV9/EAOYE9D4i41svu8xFyvMowIBbsMszlClj/GJuBXuSnOYp60wpc5sPSWsmNneaE+Wsbe3vnfz4mDzbS+71kuGfksaUQFJ0kM1MOLcvig6qMk+zbSAREFlDMFakzCm87Pir1+pcISvyQzTmMp80Wt0Pvh3jE7czQmQ9RKOEKcFHJqVEbOxxhpsxpU/8eqxl7bFg8f0yzAJKf2ToiO5AsYsfnAqORlxTnGSxTNG4BsxXVS5CiGEwySa0JQVbmNH+ELwNp99Ojh7wuu1yYGL2IQhJTEdpZeDrAbNIYCI2lO4IKRcXJ0I2/tof0jqA7FpVZhenRXBfYhNo4qqXshtwVyjN+yf/dmfwYICUojJEt36zd/8TUJYj2iCRA/4wHRNYylDRpuAmvaYVtU5b6ZdrJ2qeCVg/Lu/+7tf+MIXYPN5t/N42G1sNg6iHQ4oyGM3IFW7GtzNcqxnIn12zZlr/nf4boKegHIsvNtz7jZca10J3c321ZqLHB/G0HzXLTRtBY0yjTfZyfbWJztXisF6EuwttMusZVQ2JMwWCFcQhqAXqXFvVGJJF5usNHtJRwFDBbI/4U/lduRuiKaOEhL8WbY6sBbiPZ7afFgKhXByWX5YoWhWChVIEj84+X5RFhkmnx9nxEVhL5YJooxlsN01WWipjDGsI6FRctCRpGZE6VvKwIME15w38jikfNxH7ps1S+Rwz5ysj63Ci5wIsssjFJCvw1lG66BDjp6q22q4yQrrqUdiGuNENprvPSbCyuFsOvGZ8npFqq6vEoIP4Z67MRlqNADHb33rW9qxmWY4FGIQnIWnDLY8Cj7ep7W0VXZTn5ofJk4MRHqzIk175fqqbGf4/RiStCH1nDYp1hjGBgZhuRgQFmwlkgIv4Td+4zewhPmnS1zSlYEvktzAUKVkiqORzcAWU1053A18VX4X21MjmDq2HiPouEkxyzhTaLYPyQZB7M5zSo7e7aq3OugPaVhPuXmzuJlBM3MSyHMNyr0bu+tvj3eutmAMQgT0R/RH0s5xgQ9dG8Wv0MAayWIxxhr6rkqEsTJGqJFmhC2oC5Wo50hBNV8PtE1fow1DLDiaEISZ3vvtRIux/u1WZOKhAS6BTiKOURwJsmPVRgAVEmVCtPSlLnEgTbaDDPsxHfaQcMRbFjNQaN50gQ2k8UIQG1mdShA90Ais1CuOwEdp1uD3s3zpzNPR2krVbo+NBPqUA1WZO6dRVu8wurMqAupoURPJGha2iMWbMQfn1hK7KusscBdvPY6l1rlcFLt+KyK7BOf7ni2sTOYpU5KfA/6UpmZnve0Rwie0ZMDzJRzHJ9jFmFB4VO8VvDRxr1etNhngSJRPkVHlWXFwQQzg5SHKh96D5Ti3wqsxrIClqr9u9M1KInIvAFBOl0pkvUd2MeQ9uE5Pn7/+679mGVFWF7AL0mM/aiDSzg1+jtuNF/+d73wHXOZqOY6Nv3BkVoZls1HvDAHCKhUfqMFokXFOu0ntWQaBy+t0BUTdZueH3FfLJGhNNFCsICPiXWXe3tX+rbfGu1frfDtIxr5UgeBNJ+JKUzbXIKRoONsCXJD/hNftCctb2vWZZIzJ3taBqYgJTJByymyfKo556jEYfo+56gdMprl/jb2klnMg5ugbdW985MyrxkijMZ2ZJmIdYl7mY9pqURtd3dpD3jYbZ2VWmWR7i+JriQ+AlZTFRMI3kgY2QkMXsJzgTsOBhwUfh+24HUepMkNrrY2ZWo7etFXEoXgpc4NqrheVm9i8m1du23a6u1n2iCqe8IakqE5kZhl+mwXKBwnoM86Z4xg6IBEHZFbi/AF2VhXcPQg7QE76oz/6I1jAhAWZ9cx3Cs++8pWvqHP5Xo0Vqy6o18X5a1yOa8GKUp1Wt3rtMYOjW2akd1zVMdm0RZkKaNtbYDPUulJpSwo3nGQXNAxALEfVX1JDkkJRsI9P1IOwZinH4Q5+9atfRdCBnC/MLyXEqmoDO6tMDr9FCBZDFUeeMM0j5u/3L+Pe7RWm1hJ0k242reSinjvKLUS6D+wwREOnvBp/GvEzFjng4mXbo+23tm++kfUvtcK+HxgBwRBPJxEpRnK+tZQA1ppGA0oosZPsR2VUJMRFVWuvEfa1kMGbpnJSz7X08vOUAjkLkAXKcKxm+ZY7iGk7M3OWqasjjVgKrsdSzm1UckidN0ZGnBRLJmoS1UQqE2lD02WBnBSj/mgyrkZ1jECF30l8RM9gUaSQKeSBSqZJhixnlibAPuwgWJB+V+oWRZNXWllLTxkj9aOutP538MITcwEZO8bmllg3H2g7a7rLzz36KFj6pFpbKsnj2npzTs/dEkckHv7xH/+Rmct77BXSDL/9279NNokMkmsPckBQmCn8zW9+E4NOIQxI5VvYNO8VHN3CMz1Dfhpc5jTUc+UTMAH/UvkzB2I5zt1W7dLHSXzuc5/jDaeiz4l7qkFW3oNK/JM3WHBcNplr+8zUz+UeKajzRjM81lHVWiW3LEdXNn7o29/+NsxBW5wzMZtdVAFN7gjmOrwH1QfTkufHCDquPK2erbr/WsagJrNe/n4fYS69Ptea8jBNR5HO4VFI2Qjg2G923hltny+GF4NmCwp1IiZFW3RtZCe8VlEfE9aONy12ESASZKyl44oJ5ylgtFo9S9vyvGamanWbsosay8oWr/aZh3MtMeYsl9pU1BB61OOEYtWB2q1ALFYYOqRWhJQDfCdxI7HHI1ndKSr8rWY8zEbDfj6eBEkRtYNO5bfKIDVUdaxZyQkw5pJeKuKTCdXisXf8pBRQY0zhfBMuULPRn/bVqaWvThMfsPVoh64bUrdV1XOjWutn7A6MQw1kK8FOCxDdA1pnHGxCt0KjVUxqPDwghrnz4OdJmSz+39e+9jXMF33K+LbAIvGxOVRSVxLnF+tHZ71W++BBYhg9tLFiwwKYq/SGVX6hmsBEG/HZ79Y65TGA4/7yQaIJ3Mff+73fIxmtsQM2lT7UmIKeMQjFyWHHsYZYTQdrQvJPVioiDsQu+auan8A8OyvBXQFFhQ55w/G5Zn3A0e3hKsuM50/cFMSdeN7sz015vNBj2aSqHKWuBE9X+xFqZJZX7U3ImYjCYJKo7azkJF2ZtXbbLS0/jISjX08fpsCMTqnCy3Y3b7wx6V8M/c20VYj1FOOUouSQStICAMXuq0Nfc91TnGyMzWgqAqWHXygNFBr0YcsZxpkMtW9I1hzAWI6B38xiDI0uuG55zJ1LYm5PXkcJo6IUTqLUDkqTQlEcqwMTveChUHeUS08uRg0hSMRzepth2+vQjSHlKaA9WRYbdJLx8smwKeOiigMjThZRk5imPKZqFGeTokrSst3pDOlLkwHgkWRzSslEya0wMhhemTXIA6Gx2zmcXJ9dU5WkofaEAo2K6PCGDzV5rRrMzEfGKuMQFguMFo0DztmS7MCe3zQbgMV4ZtDSqhOvi2log/X3NS+wWkBDkNEzogGAAMlisqyITu1/svujzAptDxEBs9NHk1S8B5T4UXCZk2GGcu2ow6CHYMmCjx8c3TlsAxkAH7+KFgOdBogdgBE8D0U07jLvOWPqnzg51iKNYthArzY+5XZgSCPOzt0kZgFkAIsckxiEm7qytTSa/rYO6Rx2u5kQyvVsvO+xsyvYOD5yKQSVGQQsevyoRjx1PDHNtCGi5uBIEPG09L2SQDUUoNqOCpeHZD8KmgXTREJjSD3QdybbexsXgvxGGg7baZXQfTRs1V4L7CjDXaHySDiu0Spp4XL7takPEdzzTV5Gip0lLhl5swJQrkket/aFEWPMVhbqE2nezWhr9eedQtvvfuzbChloOvKD5JwjX/MGPqXQjbQr1Ag4yDipmlFRDatikkfXyLCnS2knDbnnvQ4ilJN6pxncGCEqhCCiwB0NEum0WtKcl6obP8OOKZK8zhYn23E98MKc4GQucr0ljzYWLfNGzcfw4DtXqzQJg03dEeCPf2pbTcY/b1S4RA0L/grS8Tlv+IoW9YNxOG0QWSg3YDK6eT+9pRiM9G1HlVlbJPEJ32VSY/SALO7idI8hqt2MvZluOSfAzpye7f/lhkeZI5wVs0BZLvxVO9U8hHFnVw6rV8SvY2xxfE3wMu+YZVivj+FZPAg42uvUWY35DZaBR3ovNDMD2GG1sQOTH8hwJ78lIugl8d0vfelL7MAj4Z5iFWNmgqc2Vmg7pnJkkBQLmR/SoaANVN2Mh0VMbofqbD8cufTe45XzxzJlSJFHwpHXoDJzT/0XtYj1n7yqla3kTa6FNzwtxiu7MQRJzevFzjUvPKiN1dUYcTMuT+1lE2+0l4+3OuEgjScipiNCsdBl2vhkdXPLgxQotJYwmNZG14a6OOvvLhQeTHjMRlIlUTf1tPE8E5arkXaDApMGBgVRglCd43cvs7lH0m+/W51LA9hKxXQLaIpZPR41+Qio6kp/mMC0ukUaPKZOgc5ZaJltot3oBe0W+ZWoRVy610qbFQkwVvTW3i2riain5X6VN8zncViLmFCT+ONwvFv1l4rd2BubXmKhEjaxNOliCK6WSRi32l3vYDNpgB0LMMsws0kLyXjDh4qVKjbK3VaX2faW4Y2mAfh8wWyMUnZg1GGjuP4fG+CIU6xZY/2cxR5LkCNb7st96xSAUe0tA1IzkTXSx6YnNpcdYlJgTmFLcV26M/OaQiCCb4+Ys7KOKZjDLHvME//eCO3dLhJhAxlKeObu6LoEZnFmgLeNqc0tO26zWsxPljVSKH2zgWiQeDgOB9H0tFZHKZ5igVJqyhcvXLjAwwOV1K2wihUMF70v3GhVkOU4bj+gx+LmcAI8WhJHxBM0osxAHJjtbplWGwRQSXANO0BP5Qy5USybh6QE3sy6V02zrnifBEGGyGXQIdC0ORCuiti/fruUhtKlaVhQq+Orctyis+ir1E0zrQKUZs7SVevWpmj34zeMBnsmMJ32ep1WO3n22XOGAjTT6JnyG2uv8e6dsJ7/3DjkdZMTUaM59WBntHVr1N9FcTKqS2oQwnYnWllLlteCTg/NxiZIJQpJCUzhi36j121xcWD2anOk2CuH7Ww84G+0kAFZOCTppCpI4qgdwgwaVqMm21suhwXaPCa/z90YjrOdzc3tvd0y9dPF3srJTxzo42INhgn3J3/yJ8TQdaFljDHINXRju2Nq3EnbECqRTlOU7LBpNiYLliP+MsPPOmE6mHlYKobA1zVAyU8wvO2vPIjlyFyDHwLCUibLF1VUX4f3fqOKXyFdw6F45dyYO+z8mc98BsL2w7nVNnCvZ6uxBfXh3ED2I/JA72M52hiEyxzc/3ua53LbUNwx22W/CKqSVr7jQZQKbnUZuH26wgBMPAnifUxFzQKp1DZ7sl5hV3OveTZKRH+MHquWkPOL2srDRiFtqyzPURWyS65lQWo81GIoYRp0TDEeAccDdavfVZlE8LXwOkpDqXa88m1v73+vv/G3S8FmXFIPuBTEaAK2h1SOJFtlOwvqI+LHCj2Q5lUi4y153ECUv0gF866sYJn1RpP4xvXB9Rvbr7+1MxyOt7f2aE1GqJHbv7Tk9Tr4B5O11eSVj586fbIzGl8LgkG7CySNTXG16eLXaHtVHRIkncedXjoe7/I+ScVUx5rlHo4aaqU7TXVs82b59hubly9uXb8Kte0mz5/IZ4IWbgcjHafh2NNPPXfq5Onnj18XabQwz1glEehtjZpW5a94zTHodpE39lvDqNzL6r2RtztC92x549zE3yja7/SO+0XrSn/veuuGt/DMZ/JqsBveeHv0f97e/CENKnfzhbD+yIneq69UH7+beulj2YgD/s3f/A0ZSCY2AMeyqv6ZSyvWtMbchxqOtKuLrtyMW2/WPtPujy2CRUl8UIcrx+dXaMWuIs22Dey9+cIc4Xd+53dY5rE6+RUMlE+ZjTfu2mZbdGESqc+klXXai+mhGdpzEOSGF93n8ohU4ieOXm9jCgouXJ4Wz7DUcFuxNJWcxeDIzKZrILeeCDRIavmrj4tirUENToDHqRq3qj9mu255TmG4DcdY58KivK7w+BRcgg7iQyv/khGujg5GGAbe7jah/ChUbo8mpJspdWZqKxoio1p5vh1n0pcQ6TIEbna2h+ff2XrttcvnL1xfvym3aDzJ5JoaWUTRpgWzLl++eObsMupnL7104uzZbpS0sglULQy12lXrmZ6ZdmSty6mTIU1Vq9CwsDu95a2N0bXLV9/48cYPf3Dx2pW9yUhQQJpNo07mCdvRNOq5fvXaxtGjx+tPxCdO0vKxR0gyq3IpBZe+Wk0IxVHioghTUEjdpnlWsZxVWZ4urdEJu0jDqkcs1puMR/29TWrML4y33hy8fn73J/1yM5tU9Sg8s5y82Fs76IelGU7rmSoyur6qG0pyR5H7oVZkq76Bd3shAyMZS4KgPxYf3hgziATpC2bjjYss986WgKc0+SJMBIIz4DFKTpgtuJ3Qqg/Uphx4zxc1JOUdMCX5AN3q92tzfXn1rLV5i0U9WxigOTut77aUzMd+x21vdc6B8ChJdnXt9zPA3dFgjX9bB6bOi3e7+sbhNEd/VxinyfI+cftNmUihp/LdpnHKDAWbmbBOUM/UcRtTUiPMwBjM89LtvfEbb9/4/n+cf+21qzfWPcnf+ka3W7QdqenDPJx4Q+/mOnIb21cuX7u1cfYLv/zps091izILJdNcGh8/eBci/VpFg+paHQ7TEVbojTAuvWG/eeuNqz/4/vnXX7t14a1tfPc47OELgtUl3nOVGQWyYncH/37Q6VwOiu7PfOLllxcXWp1YmI+i0AvkF42yFJF1JGwO37Ebt/KWKPccXYK4I+XW3mhMTmeyt7t12VvvvDbZ+a+t19cnNCzNe1VyNj36ySNPf6x34qAjIerYuvQvb1anO0e2tZ7K3CmpMhZeFJ4vgXhbb2fpIjhtpHdBSQYzY5IUAvQSnDMsjAefPuymrGelFlqXdv/9sbbO/p6uj9GI+akARzeNY/P9lszlSpzNaU9YtHLl3R9905ANR8YyJfrJr2utjjVg7UnafLoyH22I1nYv4k+stCQQVd3eXeoPMB8jICTyNCE5BjIZo53xcLcVR1PPMBR5bFMIMj1zxclAO2jNxHWwI0npxu3uJPPevrDx3X9//bUf39zdAy+jqljj8GFc00BVYnRaL1g1aSve3ik2trap5Ttx4lhn4fml1cXKm/jTWjxHSE2eGasgVG5t5RhUyOOQIiF7nuU/fuPav/3rT/7je+e3N7xi0k7ihShsm7Y0kuxJoawHhseDJhnU79Hed/9zMw9aQbfz9FOr7U7ayCkV0lCxpo1NLV1kEYQU6xFjEqCuvO6kKiokH7MqGk+a7Xy4ObzYXy9ezwY3y52CIuBo4Wh79VOn/senT3x00WvVByx3AlTh9uKrYkLaAj4N8Xuz0gMXZTRvqWo9KgEDYIGJBKOQhrS+jj2+WpGEI8kUq9KoSsZoDw9bWHLfmI/lt7m7WfmuOxoZFtznaIIfguN7Bkc3iOm6FZb/ObV6HJfW8o0P4sTANdZbEkSwKQl9EhtifGTOptRWzaqzIKsGuMZ02BhJGJ4/azZlMByOW63SDwFVMTD48r3xaAfLDko0rrOwoaWczrRONU2lAyMO4c/6AjTerI5FlByj0aR55/LOv//Hmz/44c2dXRiIK9KlL1umiVbdjJtqLN1YjRiPLyyaFa4ajLt+Y/L3//xa0o0++z+fa3U6CbTEabnJDHhN/yq6qNrSQ8xGKrurMtjaHP7H9y++9qP1a1elI3USLvl+h6AFzL+izBHiIeUSYGBKWKAyeZjq0npR//Cin7TC+IVnnl1tc0o0UhByI3q2QpY0rW1qafhKlCCsk3IrDyejIB8l/nbs3xwX1+qbG3ujLZElik53Tjy1eOL53pmXj7+yGC57o9Jv+95B4iPISLoSz1rlXZQwC7oBXrrqKyNC0VAZtaoQrspYWH9kODWGyIi1roylTKudAYSdNZtNk7qT7kEK76zglrUB51ow3SPVZgknT3iPhycOHN0yqf33br+wvsv7dxPrj/G+2wA8xiPONQuyFo8zqhQT7aZ8XeVbgI/KcdEkO2elrT8AR9b2Q7ufoW9avmAe1uOif3My3PJJ5DbVrKRPu75UpnkAeg5RM5OeUTa3iUGadqWd3vrG8LXXLv349fXtHXZdaryl3UG96Heka3WQ+6IolgtOwZ2uo50+bJl2r7taVvQRvdrqBitHF59/8XjimyE39amnyCi12yqVK/NH6OZR0BoNivNvXf3hf63fvMk+SRQvItZRSyAliNKorDMik9C7Re2CM5AMUsy1lk1++XqWvnbl6LHVI2uL7bU0DIpIYpi52I9cHqNDOmiHwuQUbudQWuFE4SAK9uJw28+3s8mgzI4un46ClXMrL3zs1Mefap9a8XoenWDDu+a+HhdcsnD+wi/8AkiHh3Hx4kXgBrDDfQH1FH1ASf7Jq9baJmZTuOSVPwGR/BXvRMsTbH8enRSa0XYtODUY9b3apFoSdt/F23WoLfdufyMtt53J/p56H4LjQ0Ye3WZersCt+9jmpHH2RwAf1S2dCWrqWsq6rYMS90fd6sbZ9GS0noFNy7lUqQmUhBqG8Uhixz35g7YfpTSmEcEIrx4N99bz8U5EFSDlcYn2mQoMx1t4K6YlQKgdA9Wllt5b8jcpZ8aOu3R58yevX924NUE3g0apRdXKinJcDYMwi1oT+iWQI+Z+0JEWDmGD9+ZRx4fY4uJksvHj16+d+8+3jp48urQ4a/g1RUb1rGttOTgrNBRDdWd798evnb96uRwO8IKpSOsUdMwGf6MmakG2zJCPANYLfhOCIw2uQ2wrygMjGLc3rg/fOX/juTNHVrtLaYtmMKG5tNpo/Xom/iKiv40kwodBzJdQ0g1LyQjVadSsBN7ZtdXjiy8+vfLK6dYLi96y9Jul+1h84CqijC6MR225gWftmdpnwA7IU1NLnWgdhIp6NuMxl6LxHFUE11awe9qSRNvA2kb8H6R8y22Coph7R//PRWc7eXWmfGg5vrfN6vfMDcE5HJlTXZ/rSvEYh+9c8sQap7dVDTu/qPppioB2iFidcL0EZXQeTpsHcYyZ1VR81MMi26aRVirGpCl0EXVGaWZQCU4ZwwHms3SRmg1rK3fWRNuboyuXbl27sjmixqRJa+qzm1BKJEcIwlftThV3ASgkH7zxkH5+RbvdKrN0OMjSdtTrHRsMSG3f2t0rvcW5R1MrSlrNGJBRQqFNOBxMrly+MRmeLjIzD6U4nMmcVd7ecDJE4jZITO8aqSukLavpgFAEKDUVQUFR9cb6YPNmvzi5CJyQ004j0qNVTgqmloVALltKgPx+XAg4BnE7D3uDbC2rUAGvW/GpMH3p5HNr3vMYyE3ZFgCHe4RJlRy4saPVI9bntU045urt3B5z7sgUnXMzNVzxF8/p92nTIDY0rzxBN6/iSpnd18nzHDab/ZW5796x/6j3ZG9PHDjeLWyxH0rcqu2DsBnnfsWOJNeG3b/0ubmgOQkfi+ZKIrO01YMGR/mVelAP8Kk3AEecrU4K3wZta9NMMBDZblFzAC9ggQfmlJDYMfLXIrcjFSX1ZFSsX93Y2pyQ4pH0tvSCRkAka4dbhPKfOrf0zAtn24skqTfefnt9/XpVjPv4dpQRElJYWWUVSa5eu/XWm5dfPXv8tpSoaon7MycLMiL0mrhbZt6lS1cuX+aXWrFoYUh3QSj/Zd1v97yjx6Nnnz+5dmSlyJs3fnztnbd3KGGJpL9gUk7qTtJDkK2/Oehv9vknSraQNSWDY3qzyjogcYSpjttwAS58GGXeYhamde8YAoVltjv2jzRpkvsQKWuvM20K1pheZMldl8/HFSO20n822m6puy4F2s3JuHEkVTXdj0H2PPenK+eErOwOD3Jpc4bqPb7l7vmB6Cj7wZARfmI3u3rPtYi6R+zSm5WjHlKAQvujEqGrRn49Cjz4NJW2TTVubTOtWRH6jHTT8gwizpLI04wMBsFkWIKPkz7pDS+hazRlJFUW+eFSd/Sxj3/kZ3/upec/ejTtBuu3bv778hv/+YMbVy6iGXYDm67TxuIjSZWPh96gP3JA25vrJyOLhwAB3CC6YJF6HvX7oHTRaQVJSj6Fspj+wqL3wou9Fz564tOf/Shi0pQSri734uDihTcHk8E4Ek1JzjBDZiIbhgXp50IihaF0QTB5GImt1qbzjQklQG6CgVnH4qljOU7qpTxc8AI48+3doj3x0yQqPafi0T/wKT03NhQc53Rn72GCfSDc1Q/K9oEBxyczdvuALrzbt96+19T24610vCM4mtBpXmT9qugHdS5NYSQfEph8S2X6OlfSIkUEYNH4bqa9V8VMMh25JIPcUL3cTdoJ4FpT3TLJqgnGzPLK6ivPH/25T5/75KfOrRxJ41Zz8uQCRmmvvfy/67cvnkc9wSdCBjRDMVzspd12KqJlmo1R/G20+YwBcCa2ZIrIqwSiRdYUpLCraptMC9HAqtnr9rxnnm9/5meffeVnnnrhJYn55hN/oQs4drzq7Qtv7U6GRTcl0DnGb24n2H5S623EIE0DGDJLIuojQpXNtNS8iatOKEVAGEuiKS4F4aSxq6jaGS/0y6QXanjSWDuHIXbr6nvbJIZWHLiDxw3vfIhiH1qOT9Z2x6zcfbPkcw1dD48BS8u9bK/K+yH1hH5i2l2FptBachRadt2IWiOJ6coEGxvpACMsycY4vUE36Txz+uzFszcvXdttQsgxddxpnTm78LOfPPLSR44tturh7g1vUPaWl549eyTx2wUecPHG9eu7qCXgxx49Ebz88rlnz500uel6HmbESyfuWPmKCH5Ji9WjR1c++rKX/Tdd2GDde62299xz3c/+7Euf+MS54yfbTdnPM4oRW6dPLSaffR7TL2xeP//W9SjM026RLAdPn1s789TawnJKnIAHU1nWl2maaPokyi3oTiJR3sCeJOfUqo1KJIoaIa51sjfxlkvCB6HwiLzCKIO3DvhB2TCOy6exTYq8O+l0uOSNQyrY/xAcP9wexKeee6/FMzrKrWKbhtXd1h+H6fiYspQ8mwwxtLDiQm2LZTqrSAtCEz3HeQtrEfTWxq2mREY7aPmeUnrK5pmzTw1/plhaOE9mx4uD5dWFs+dOvfjsyrGltB1KlQnqMOTmkd0+upp+6pPnkK+/eqXVHwzjJHjm2dMvf+y5M6dXPP+61wQOOJrGLJJZ8aWXoXyOc10mafzcR57CuU6Xt4ha9vu7C4vpx1994ZOffPnEia4XDKpSZRyhOrZPnlr81GeeAV1XVoO9rSEGI2W7zz93/Owzq53FuPIzlobGXFCj9nLjTWXUmgodR8Pdr7MI7Z+cJjllDtmpyQcIu+Ue+j/JEoFY7kTmy7rROsTRZYPU9tWVELbBO1th7ZZmfQiRH4Lj+7bNKdbZz5V+5Iq5q/tsg0FKwphrcH6Qk8ycBqzpnF6PY4QkSFbXQia0jaaMkShJ60A68hmdb23cJ6zAWnRuPWkA7R9FzfPVjx07vrw33ks7/vKxhdXVpRMtn4wJeR3q9chfl0YPrJNEzz6zkiQv9vfO9mHiiPTcyeUVoaOY3LR61sG07Zd41rXJUIv9KM1qamEsnDy1hsDP0vENURgZSYW7tP09fiRNvKxAaowSbiHoYREjiHHqZK/z/zz3kedXN27Sd5uEL7HI9urJThmN88mgEQWNYFqYqGayZ+jmQZNXCFOSq8UWnsBmZxnhEsoqGlJq2QyTYOSF6KN16ZwQivyt5LcOemhZ6WjLhXC5OHbIueurpTTaUfdh2PGnCBzvxnp5f1dI2z9oZDY1G5X7rZVYRuhwDOdRV3WovJB7ofVaxsOh3DrfQHRO2TNdqKg1Fhw0grYa/jNYaUghtaGsNKZIxgDJlBqI4IQ0VanXlhc6vadG2RYZjoWVVpR6vUKKnOtBRT8uU16NynbDfyDm88+u+uFxUjH0pkH6z6gNQrcsp3HGxpvhY+M172riia0t3aXzKO4srXRfWirraqVEUKxBOkJK3ICuOOhW5dAXvTVwDh74qJVGx0+ka0eOZM+dRE2ybrLAR3WiGk361HSLAp6cXWWSMYZt7lWmQVjVp7sM/Jy8TKs8aWjdRUds4LDq+8VWlJ1Ihl4ybMSzTruesm4PFhy5CXC/kYRg2GjeWXslqTao+h9s0HRYaqB8M8x4tS1G3JX7w+1Dy/F9A2uLjAjkXTKb6ugBhQqIbJTQ4RVq+SAbKpaf//znP/3pT88poBx8iBSMqyTx4uo8+8EsIGBKYQxCmlb3tW9cUBOLlAwyxe2YaYPBMEyLtO3Tccan+R+kxgm6Dyv8uRbZbD8UvqBgq3yhwJumniNBI8K4hBNChI60lLswaNvY6QkYfSACEblRNgtb7UIyKJiLdHYBWqW3NBSoFsLdGKBkkdqpNL7xmjE2JDXSYbxMgM4YiJxWVtB4CyOz3c1GaGJ40h5HIgpyUb6R7+2jG2581lYDPqJvCzpKqHUSVntx2Y6yMMjogJhK3wSpGT9grVuR6UbPkcZVqOYoX0eFk9kARN5rQSEFMNQUwBV/9dVXPaOR4zm1KB/61O8POLrhjP0RkP3bXDNcJam63XgBF5Uh0X1sFzRLX5irx/Rub2d435O0tStWd1M1I5RbC4qp3pxWv6hiqKou80/VK7u3xQoaMpoRCad9AodVgXuts1afWlWauRzGNwrM/C6yKLDEDyFV7UmPlVuo/ee7o0F+xVt9J4/a/fJIFB+vm6Hv7QZlL8ierREAjza89JrX2e5snCybTlGvFLyKQA/sn37UjCY7u4s+zagiP2u3gqWqGNR1H6zM0JIIAi2vwcf1DRfYD00/mTorRxOxBM1DaKe+1PvRg0Wc9lI0MXxp2CJFfNJ11TOZZXq+0MwmEUdd0uUUbev9zxssQd/0tiGnYzTAGzP6eKQm9czR0Or2cOzrLKECqMJ49LKe16qqY5PtY5Mmby1sldWbYTHs+ifH46Pbg1aT9C7sXh5PXhpnZzJ/XLf7tElbaoqP7P3ohdH/OX31h8Hq/5ocf0r4jeU1r3zamJ8P1Ln0oUPYiN2CjPQwUCkwnT46CLUwRsUWtVGM6oZ98YtfRFbH9aYfrvKKeaGrlyqNaxMCrQh0nXQ9uE5PzRppvsiKsKg6nz0Bq/rs9st2S2XcRtv6lXtLSc7loLx9fYceVxnxewZHd0w8SItR+7Rsw1nbVWY6e82Dt7k57dhtwVRvOpvb8tQ9B73Xc2p3KuRjlXJcrRFVVMQF9mYdbzW+w/G1+QaVCZyS3uh73FkVYWY8/fd///e3vvUt8BFhetUWtZvtNOuZJkSYkK+99hrFYZSFIWChcaKD94BSqdCT+ue4rtohwgnC/M4rb7f2Nxs/86NUPuRmZGE9aU25j1MGYm3q+kT6WxpmSVJDRzfKt7WYUZXQJMXMDEKT1RBXNTDEyP3IETTOI/J0qZwi3FQaTWk0nnacqWe5pH3Bh7uAUmD8Zcmwa0Lcz+gt06B8RpPretiV5PxIKmqShX6+tD1avrYR7I6qtyYv747WJlmC0kWTLpRxZxE/ux6N/HLcPN3zURKXsmqJk4bDLOke9GoGJuJTM0K0UkDBRcM1DDbLdkC2RytZGcC0HGC5Vamnhw5kayNDtRu0TaBWZ9vg5lx43VY06fxyQVMtDDvp5pLsbnm17aPgzRid+uF9BSy82/sOuX2k3d0eMfAaPdz65lrvD9g826Ww2AqnOelDe9/dRUbjKeVss+XMCpoqNKKfu6+qlIP6gzYeYsypyiywqPioT1R344dUrhEZd3TJCAved5Bp9IdX9OURUGFA28XArmx6wnM4yycMaNesPtjZRnWzuIk0REixE6OmjdyrH068ZLeKt2qksWH2FIsBVZtFyy87iJMZJxzYy4UrbRquSnYbeXDMMZPKqETHQXYxmRVlihvyD3vwP0Mun9Glg31NY+rp55qTmWlJmhCnZ7rNGIkg09LBhD/DxrvjLar3/zswrbAaqSWfNMGg8Ps1mrkVyo5RElD0vV21/EGzemN05NL28UvXmuvX+7ea/zGE2xlUcJUQGhoFvVtJOIg7t3qrR4qjx7POcwqO5KTC7UnQbR98oJhF1PpbOnLUu3KXfzYdujQuRn8b8Vr8kkeyksxSjdYU7RlQA+IEkMBgRmhfJteTcwsNtVmIorYGjuwZag9R7ZVk1QnctJLtc6AT2e3M/CAmmtvHRYHVLR/ybhdOPTzLcT9B/94ergKf3iDbQUHx7o6OgL0qlUG03btMyURfO7HpyODZAHyqjqMCOfrK56Ahr9qigG+phphmjTmO7Xxt1z2eIn4KGEecWxXx7u096bmpRczx1TbkzEWn6/bFTa9L1b/RKmfAMdq0hPxQeI6xdImSni+BD0W6kZaQXjRpknEdZ2VNXd1E1GaKOslbSbk0Tq7WJsgopTCVEa2A4APFh0x0g38kjECj3cC1YUuWIhneKAL6M7vO1KFMFWyad81G3wEx+b/IqFpMRXp8FaFQB9mAsRqAddOew8HAYPUdUdLwJyvRE/LHpFWaIK98qgMnqR8mSO3SGKHV2yqXfrjRffv64tZ2urXTarqxv5i3e2UXX75aCb2VvldeqSa7ZavV757arJLl6imS7BVlOtwU+mSsHujTwl8mJ487okPUBq/cHglWQVl9YZ0U7GCxaa6i5gETQWAiUIsPRPScOYIXha2ALiS+jgqm2VGtPw2SsicOE6F27SjFCagupI5tRjtzijfkIe1cs/1mXVty7mwfpPfLHD66OhfvW8zRve9uA9W74aNteODNNDvtI9QFh7tpqwI0xuFGK0A0AIuWGkTrGARAJHYfQ8HK3oB62qbS3dRytAXwrtCZGp6eIxZiF+erV6/yV3rREMdhjN5bGEJUr43Xw55YnWqE7h9wdmVTdSltgMnoP4Sq6tniZIoAmzw0Zl1UxSaZgqqiP6q7RX089I6Bgak3klrqCm+oMSmYXLMywJ9J5ASiSVEbfXCRqwBoYyG+8CplJ8LbNpAlJShSSHJ7mV2gRqE/sxnt7ZEvlsYhro3WmQFEaTfYzLjijZIt5z3oO5iRswgPVdiinSGPppIVgfOkRzVJlgztyryKL+61vnc9urjepGUnXQhXVn+cHqujRTg/3TT3l+OQKsUdltI82t6JR9fHx9vbHzuSnkioKizo8nDQzws0YQSSliGErY6hluGrx2qj9uq6qUg+0KMJ63vzOu47r/nRb3zjG3/7t3+r3V8BO6RLgUhOScPxrhEDJgKj//Iv/6LyppySwqImjrQtM/4+ThjWAIatSq5ZIStrNOi1aO8a5rK2JLkHMnJiGnh1fda52vP3DRznGAM23XEP49GahzaaAMwBdiw4fM6tx1IDLzTAYaOzCig4rQSn/+7v/o5AtZqBrGlqAOpP23Cva6vaX5zr7uKeuXXbvZlOCf/EDtVu2vddhTRQ7Zkmk/TdVvlbrkt7Vbuq8fpPIjiqJc6G3Jl3WD0SRNOW7EcwDLwR/fpCaXAFTKK0sLo5Ot4fnonrk71wb9G/LvEJsQqj2oRxKB8UCbHaiOJK2BGZikgOZppUN9gufqzCX0FjuJCGkqPNrvf3X70Dsvmlnp5nAo0GwtUiFFQ2muSNImt9h6jl7QFIYxrrl5HkSaSGOpAwAs2pm5aP7SmHwHLvbg3bP7kZ/Xgr2JpUz3RHp482Z469nvWaQRNmoxXqFBfSfDHIjwfZzVvJrdHq3kZ9Ph2fL+sTq10varUP3tBnbKDnCP+B3Ii2RtDln1HEsNeQkab7VLRRe8RbcphmQh7Cv2aggnfExHnlpxmx/O7bZkOE1JpEVgUDJCVxRKdiZqiGiWyIjK9zYsxT1RhHdpfEETKmGoJXNNTJroFUrB/mnWfkiLh8tVLvGkE3UkM2hGUhSN9Yc8TmGx5FxOBh3Gq9JNW2dPMk9930/mK9f+c73/nmN7/JY9DRgHQdkKENWt2SAP5KmwuWMvbXmLS77OitcYHMkmbtMus5UrX6XqM51uG16KlwzPrGc+WG6tfvsYJZf5w0DifPOGC4cGlYtaq+x6suoaylvGrrcYYIl+kasAeNj6VgWwY4Nv4gIP1CmiIoYB4O6uMXri68eeEprzx6anXrqbXRKcnVwhYH1iMprRO1Q60sFBtFksJ1bPRw/UaKSSJDHAy0ZavJ2vgmbih9CUzz1tC/I0Qayrd60KKka94L11waF8xs3Wk6J3QpP5Iy8qf46NtDeYb748BuFRBBxolO/bKFTE8lCahIEt8Qd4r4ynby1nqyUfSCtF5dvvnC6eyZI975fk3+Y7TXKYXxPjzSGp0J/aW6Ro3n7Unn0qb/oyA/3YqeXlhOmuCeuP8YNiJ9sHMY26rnqHqgLLo4TBqb00g6wxWTgp0xM4k5qkTeHfMSD56QUc6Znara+lUbH80ZQLwHvrFvMFlsLsWWPOrp8V0sUCwGXj9qNk7Ynp7uzC8Sr8dcZZozQbgckJQu9hib2oX0jpYjBwRMlUmi5qo3613K8VXx90H0KB8/OHI92Fba+pYFgSWLB8NZ3u1UdJWw7gC7sTr96Z/+6Xe/+10WJT7hjqALD0RiWKlpqaYW71l82IdnYPuxucky257QGoC2hcsdE0H2qdv9NTiicUN+kTOhxyEPhutSr/negQ81Dwms0LCcZw/Wc1u0E5s6F7p4WKBUrFSz19KVDtoSqcTLBRDBx8KTPlNZHU6KsL2bLb5x5di3//3keHD8+XOdn3lpUJ4KJr3wKOkHnFyyIFUZaZmvZ1IiJGTCiGWHwKMpZlHmuOS2xWs2MUhR7xHvuQ7u4dnNnOt3dcBMRlw0LzxLPjezcWb5ztmMvnsoURK6Da6qMG+KFkkY5Mvihh4yEWhtskjJoEyvbXevbdPKZm2lMzzdvf6R5Vurvaeu3qyKmwuj7PjAX9nLiqBdnWkXp70sCPLrTXwtS17Lxs9VWJRBh6ZfB5yQYeAxoT73uc8R78MoUwsAv8RCD+ig0IBDzZQBcXTiYK/YnMY9KGh329TcYzozXLWmiyHKRFBOj+Y/3UQzPwcU6CxgT/6p670y4dRkUTIc84IQATurgLnnlE4A+n/xF3/x9a9/nbiZRglwwnjliu52nnQ2BpH1gMwy5iwnzF3ipnGevMdYUcX+92S3vTdwtDwmm0Ji46lwcv/wD/+AicSHnAQX84UvfIE7e7dIh3oElmPI7eDasAQJ8CnBkIukm/NPfvITAhNckq1QVrIrj4eD29o7TeO4NpdFyf2DTBPZurPWGGguW8cBB1c/RVdg/kQ0EJjDidDL4fgaA72ji+2mjzhJDqiduG2m5Y6uzVzR6yHUeAWmiTOdsIIQ9a3GS2q/XY3r4V5xZL2/uDX62HD8kfGFN3eK6yOveeW55TO9ZDykqQOyj02VSStqkVOUPDAVMKExEgF3WiCUxtLzjXRFYGiNRgISt9y0QZNLo9TFn3rHRuqCskR8jsHi2tHh9oDsb+Mnk3EZJ+3+nuTKWmmcMLvDqt2Kux1Y3widjbwOCtySq6WXVllkRLkjyexVwe125dRb59dCkfj3Kup2ujHpddHzLbwA4Qoa+C3sTFqbW50mWFxdLs51s1ePjm7kxYmFtd3ltXo7vonyT3Ikrpev71x4PhkeaW+0/NNlcvx8lr023Hupc4LrW/UPEBYVAXXIMaLUemKAEblzCTc6inQ62HHo9m5+OF+SBf6Xf/mXOQFayHFY7BUWfnwdBUqt4LbdFJiqBMS8WYME62nNyTu6cryWMqk7c8LMevwtDCD9kEOBkoQyP/vZzyqt3W5qqeDFf/WrXyVbpSEsPtHcgNaeLZmNuQzrE3uLaMNBUXnczJQ+DE1ZfO1rX8Po0w4q3B34VrxyB+/GZ7Zmo020aypZk3HcLxYZrpP10DZ6tpWk3FAuFQjGeNQ0y35n2fKtrHy8es0Ym+rM6mrGXWNVUQItn2sYW6kGnD+/wj68oc0LY8LNljwgscDeK+sOWPvUiiRbKNeRfThlDMi5mhYxKe0KkJsRfPQnaBzCqaaN1bBu72VpFryS3bwZXLiaJysvnV0PApo+w/XbEWkzqawpAj+pjYQPWRmK9gjlyZ+kyYKQv5GQlebQ+OJR6CceWV8qke/ofgKVPSALNR0/onX25ct771zYxOIpC38yzuMkTJOm1a3W1lpnTi+dOLHcWTiSB7DNJUxai3HKshPwsOvyXStyPsY5VUKTKhngPfSlOLqi82IdjcPVJliJvSPtfKE3GS5kXjcv0uTqsV7VHM3CJMzytZ169WZ5bL26eTY+v7QQLVfn6Dlb1L2dYrSLkGV80F71vCKsqzDvzXqruir0j/GnyRYSIGJeAFga72JjagOR+/seMyuxbal0hPqjTAwd8GozMguY4Po5BySro2kWV3lA98fM0tbzmnoCCrCWbKbenWL8ScuH+EVFA3VkteONgoZmhDC/eMUKZkY/yi2K7v2Q9NDqdXLGYDzJfgKoetmapfr5n/950rv3pUbqATkOIMWp44FaXGcNmYvCahSDHYjTcXyQDlzmVfkK7G97X2jNqUIeh9X6Kj7hnwqIestYiLAQNULBDizL/EkjxLzhr7Z9mi5iSjV4EAi7m8atJVu4JAMbQj60Ai/43gYplmpvBeiWZlR+4YdFEiAcu5u2tvGEiUtu9J+tLoZB++i11r+dOLYoEg1ZP6XiJKiKSRGEmluuCDzSgjWMyV5LSkaOn5hwB2ZiBE0wjKSCsFE3+I6ZXf6aDTFIexfeXv/7v//JO+dHgz4LWCebEMfkyFm7k68daZ4+t/jyK08/++ypY2cprEmoJ8wpqabyJpweWB3tWnvdOPcyqGcQSbeZANZ3v/YH9Css8lZGqVAULGICZ34yTJrhymRvnBy7dGKhXot32t18c/fUxb2ntsvjW0E0jneOL6dHxntLOWJGcb1TovDYWmsftKTjnHayjW7vpzfcNxH6Xn8Xi4HCViJLzE2ODKgBLkpydMP6OraZmF/60pcAtR/84AfEQ7WpnLZL0iQk/+SvIBRhRLyxuePoG6ae5sE1I885qFenlpZ7dUwczeKChuCvldZXLFYjSd+zA0FPuuAB649YpBs94I3TV+4acRD1eZWlSMwY7LdNbO+Wu7AuMBfPbQVMORpXyydYbSxBL7zwAnBmYyX2kogA/tqv/RprF/eFZ8AO3FBun6KMBnEtOOpmwVEr822SS+OA6pXY5kTaPWOut4G7LD+45bif6mSzZhpv1SDI3Lg/+IQ1rjBFRzRQXaF0r5ZyEcmtdKO9syd2Th27Bjh54UKVn+iPvfXNoxevTbpLqysLJeMxacWIMlR5CQNIhMIl2lj5SRmIPKxkU0Lp/iwStVJACComQUgvLPOJSFj49b68slfnmRTteMGbb1/+9+++PR536uZoWdDnJijFpq7CZHTp2uCdK7dubOxcvrb9C1+g21QvBY8LoelIiY5UwUxLbIJmHoJjOTWT8wmzJtzzwk0sZboh1mLkjnvR+GhELUCLH7zVX35zy1tp34QW341Ga9FosVoKs7IpWBnE4ei0/JWqWhzlWdGkfh3vDBcW280BK7g/eK+VO9IwHn6UmKGo0kcYei5AayBrrksXM4tcEOhDOog0DlBIbBFg0tpZDClQkrmJK4Z7i5us4O72IOSVec3XsbGw9fgiWAyoAabEDb1ZiYQVAPRub25jzSMlRWrFGvCivGYCgG6V3eMHR5ezrQ6ymnj8tiKjVvvdO8Dh9qVSu4+b9eUvfxmoInDAJ9w+MJ7cHEdW38F+RQpy222Sdzwwrlnj0NqfV/FL45K2K5vmQPaXarqW2pzcvDL4H2O5/v6mlNZ+VGvU9bUPgcoD4dunoV5AonChwgRrxkERtoJ4wZ88d2T44plr2+uv7WUvt6IgK7ubW8GVVn7qTCB8XoxAsrNhHbdESFsWZxzquKbMLpTcSR2ahHYVGoUfUjUQCiPTA1YyuhYZ3+XhzBzSSGqv5XmFHJl4lShBgsCmJWwcdSAlMr82NvPw/F5ebpx7sfWR557vri7hkuNO10JNr2Ppcl3fnp2x4IiAWSTSEgFtZUYNtUAiMJGQZefXjrR2TrWDYQjeJReHLf/WkY/7L4xQFwrzjf54tHU02kuoNl9Ebbek7LJXNzGCE2nld3IfUqh34Pkzby7faL0N9SJd6sXjHTy2UNq67d6MjO1+YjGLmch0w6bBGedP4KPm1nVTfAA68ck4Ak6bkoLn5CaxK3HkQRWStFid7A+MknvQUsg5R55ZD3RwQPXENTird8ZWZOhN0+61bm3igViObhUd9wIg+/jHP/6jH/0IE5K7wzUjMwM35W55d4vx9j2Xwbc0W6/WO6sHoY279blXppLm47T6RQOLdqDY/Izlotvkj3tnLe9JB4E3q9LRb7mLsDsKH6Jw3b1Y95+2MMCtVD0UtxrQakcoedMrJZLMcJCnrSbtNpPTndFHT926duGtS+vUAK5xrqNhPszS3WFzpAxpHV8FY9g6IX4PAUfhehPGK/hP/F+NNKpeuKRfsL6NMSd2na11uWOCqCMBxKZ8+pljH3t17bU3Nre2r2R1jGgE9p05StQESVEW2zukdsoL5y+fPHH2xFGKXEwaWwx/oz9RlXfmwRUpD61AmpLoCJlrIaZD61kMy07XK8/0Bs8dLfqD8Y3J2jtN59ogCYrnWm2s3WZ7HNzoL4d1upxcPxbcbFXhYLS0USb9mN6GVdzutNpdQ1A/WK6jDj/NEe+nwR2oO+8yddxzmOtRo7PGipPr3AePQDrvTjq7+ylrtokY3yKjCxRgJynAASaYje61W2sRqwivHz/ye9/7nlIjtRbOWrIANOYq+ABkA6OA6SOW50b3NoIsc0rTGvzkr//6r2P9YkJjOQNqID1Gn232eDew0CyEpvY5IGDHdzVGYG09fSRzlU8ucmlAUBHW4petZXYXN7euyB1eNs/jLs6Km8pK9WYiIi4R8r0OMrdJpibEbc2iyltoX9bDIYGHaFdzRoQD+c249POGPgKIeHWk1GX8kWPj9XOjqt7YzuI8WshBv2RlnNN/Wpr0ZTT3qxFoiQ2vBjFtnOU89A04+jHZlwhmSzTh/+Bf4VALGVzY43dFRnm+GamzNJ8Up84s/s+f/0h7LVjfHO1R3ly3hkN/sFeNhmNR/CnT4Tipb3qXr96A+F8WEvNEcJYrqbziztEDTViXVFFHcFZzEF0aIsRBtRCUq14etoP81OLoxdP5duHv7HYv+QubdbKy3S7GSRn38nKFgvMw3Vtpvb5SvdGuq41B61Lcuo5yJQq+Swv0EpP23wf9vMKQSa4zX5UcdZm33D139X10z/GOPAq3NsxWeVvGiO6m8053tikRF0PnaNiucoIeUJPgx8wG04Pd8A6t9tr+ucwR4JP8/u//PigElYe0DNYVc0p1vDTHy+QFWIjaEeXksAfoVrsGjlrRBCN+67d+i19VQh/eLjECcNri993cTFv4qfxBrRayGKEGmtsQQ9Neyk6wpSy277MLK7bm1E0iKazPdbN06wUtntrIhUsNc4OkD3h/92Ooqptwo3A3GO5UofIJqwI8A56fkisPoQehqYBmZIknSqxQQKSiyX0nhfbY1CeWgufOxttDP52IplgRSHm1aD8KcdGEyWlUEGOmMTMqEflGI1F8y0bKCRmupsGK6YUTSB2Np8ioahRzio3TN6PhZOEYdly5uJS+8slzJ55ZHVfNzc1BXiS31ifnz29de2dv82Yx6gOjMBmI65fA5TjPkDsLIiVTOlI9zT7PWhBR+i2IEK6IBdGWtutXvQrJ76RYaVcn14pjw6wToPQd3RgHl/KKrE3mLXj+yVYSrHU2evGVTnYpLI/uZN7NwN9MhIZZ9jr+As80POg8mpbxff/731fdHeqvGC2kFkENZk3bbJrb9R5rHfEcBcfqBujEnCthVgtG87Seo64APOmktraIq0/uSorNyZopwc4V4pqzlHU6cx+wNPG+cT1BUpVP1aJDciEcloOATmAoHq3meR6lTtc/NP/ukLc7kh8f43jS49i7r+l7BV8wEaVSBjevJNkJNvMGx0HH+le+8hXSfDo4Hp2net8tK8XciYmSr3/n2pt/5Q0vLsdtL18JqtONd6SogtE46++W1WA1LJ5NmtPV6r+EUU2j0oRepe1+lA68eLeJ+2FMS7+csmyZLZFkX/zQqHC2dq1F42bn5wo67fth9mqS7pX1Na/ebbW6AR2uSlz3bFRvw+AYDRb+7dsb//S3b2+tT2gFW5ajT7/c/Z3f/o1XX3mWlofxImUyeP5bSadVSoBA10KpbjSccqnn6cfTgLgo+c6KRIX3gXETtnwvhTbU72dMq80NSqhH/1D8f0U9DqrtY8H159Mb59JRGna3ghf/Y/eZQfdTRbnczYavHG/93Csnnn6KXoVefMBPjNX0D/7gD/7yL/8S54yzxlclfaxMbzw2AnxgJeiglQXKVLPCNnatVdy5d0WvazF8gMRx3UaMri2Fra1xgGS2vQ8VMh+U7aCft8Ki2yidh8ETgkBLYp2iKNZ/MJFMHEl2lU7hgfEnVjYCK6TsD0HpVhZwQQ7+bxCHkwQlWPpEkchtWuPJhingI7s85kQoVImrHuHJcXcQxnWclEk7C1vyXxAjx1OHaGELs1EsxkBaXldGjzaobq/OvP9aG+54gbHVKvjMpGEYgYaSFbYXok4SQqenqwEWh7QxgLkfLdRBN2vSyTjbpls2kefCG8RoptEdwWTEPdWbJPJppDI6dcfoeUvPRBUGEnlwUTcXPjyWJJHNdph2eqtrfjdbpJPWG2S1iaD2gsWjdKzOh4NhsJnHhd8BrINgcGI1XDsZtxa9OplKCB3oRkEEJRJQiZX5y8pKaR13lWGjEAk+EqQDMUkAAJ3YSnyufpXWXCuj8G51Ylap4QM6ry0TzlWT8Uyh2tzcd9PcH4LjA4Hj47KUbYBSK7o0YoI39Id/+IcgIMgIGgKghBptKpy1HUcAi4APdbW3tZUHCY6ZqDd6e35ctBJvhDBNlUdBbIwOCC6en46jDkrXe2HVD6prwcI23neY1nFaRq2JGIz8F02kvgY5x8DUn0jsT25l7XtzgbD7b/F6HcBTm4iPX2UyVcM2qW5q/ibjamc7x0+i64vIUsAdIqF9JIiWo6CHBFCVN5TKmCB4Aokn1HJFFT6RxljSO7Fqj3viSptSRMKk5on7Apelb8xL+a9dR+SnqrALxJ5ovjdqlkYe+uer9fjoIFu+OfGvjBZ2O729arzY8Y+eXTn1TNw9gqZbXB/8uMVyhFnNWFK3VIeQFj7zyIi1sabiYqsqM2lMglpEt3iDUwJKKvfFqnPvH/P7syW27O+DMq/vOLXnWCKPZaZ/2EPmYW/cbPDZBg8YiahpUEWP/cjg1lCmLQawaOiKgB6CO1N4W3EoKode0grbi02cZsUgCEdRp4O1AV4EyTgJ0Y7bayr+uxEltRC8ReurDElMU1MTZoQf6T9QG2GxRjBGVBd9X73aaK59xX0GN0V6JHnEWpQ+0KwaaKKhO3Pp2vbFq9uXLg3++4c3trd2Id9ILWDVipPlvFgYDNvFsMfZtJHcoWsZtHV0GklJS5cwmECltFsQ8aG6XaSm1BsBIT+YivyI5qQv5B8Y4uhXiiqlwCohTM87Gdzcpqd30d3N17aHvY1xdKOIbgYLuwhB9oLjZ5Kz56Ljp7x2MDH6u7HnHazNZfOEmIQaytemHfpGUZIQDauv1heCjBiV+NofNxvJCj5kteavzZ06OuyXyz685ukHafRoUshFzw/d6vc5/KHhahZzWyQOCcu20XDVifVVixQZ95oEPITaaqg35GRiWIjpiah3uk7eGZeDIKbbVF9KS+AntgsijCF8PimOHgW0bTZNBJEuEzsxUPVZk6wUhYnASEY0RtNWEz7v0ZJN+sUEL7djfFS5e6RoLl/b++d/+cnFS4PLV/fWr+fEIDsR8tvkv5cm6+cu/ld3dLHMh00KDwh0DMBsIM7LoahTrYsPTsqIJHZAGt07MdHkpuTujFCGXkxg2jyEUlIoshj/P3vv9SRZdp337mPSZ9n2Pd0zA84QRgAueCmKUiguLwUQoIEI2heZB+lRfxQjJL1IEYqQKFCCKAYVFxAEUKKFCIgCQcGM65l21eXSZ55z7m/vL3P17szqmumermrDOtFTk5WV5px99v72Mt/6VuYf++tI16bX7kw23plcujne3Blu7A9qh2wXzVbZrl97efNTr2+/crm+nnrSY+Wt2fSkwVFCZILCJV0SbbHKhHBI355EBGhI8BpPHEI1DGI6uFmd9SqxhjynxRmXCIzPxVE9pIfPKsSvtk0+A8dTvU/iMOkGYC2KT7DE7rbbBiziBMEzYLc3itJJT83CbdP9JJt5eKh1PuKa3xuNbtTySd23WMFyrJcEItMiDSQVcKedDgItTbqMofmVV9bGDPPkbZ+l9k0L86BvK8Lm7JFKNXLfTRWrsFVMW6S+CdvSlfqNH733h3/wxt6+6w8dWhONeqP0rVI79eaVw++99t2bze9XkzGtq9Oq3SFblE7ysp8UtN6aNumbhcZRUTRpfkhT1eJcXp9X2nrSZO43Ly89yT0Kj4ixgpIp5d+18EySjn76oOzcq7YO3NrBOJnMprVm0mnn169tfPzVi5+8tn6F0KfrqxViXlYnjI0O64+aCHh8UFWkDK2sq/Gc46GWmakOl3fCQT5X1ONVU8uUdZZ25Q/fiOqpgOP7phY+/Mo6A8cPEc5bUCyliI5ViHfDHh73FZLAHE8SD4LMhVgILASqVt1pddyulcF99era2/XG5Vp9zed1fV8t7z37JV8WibK5qVcggwbpGx/4ghbflSupQrWhT+qQy/BPes2y0IygDF6rr92O5uL7wj2ecuoQjT1fzVjq47wFlh32D/qHe6jvkD1qN+pFu77uMW/SSspzxduv7L4D23JYzWrUviA9Tn3gqJ7suzHdAwetatScjSmtakAkZxcoGvl6WPxzZPSJslwMMI9uQCa1OXnWRBWPhDtAOa2uQoqkhqgi7zQ7rKeji930yvnsJ1+/+vL59euJ63jF32ao+fE5npM+mCTwnPGL//t//+/Yhhh6SuhhUcqttrknOJPOqUKNWJFkb0BVMjZL6T5VykpBxwjCgYOVf/hGVM8CVlrfhSeox3EGjo9rkUVULBEwCf1QFvpnf/ZnqsNnz4fTz05OhhFTEao8wlOwtIgKuaDZeTrZ6paaDkgROOs0wQXPDJ9Wo5lvLJOBnb4XAqrepNth54w8SzA4jxhWVa3yVYG11Jfj+ZRuSAH6zEZRzR3qdE5OrT5Qqppxo41XtZalGzOkdXh9o9YkJpEXa5B/e1TI8iFUheZFWR8VdH9Bpww69hSIb+TUjNLslYRs4SOGWb2c+SbTk7zwtbzAdTnBFB72fZ8p4gjSTdMDf3i93tTb9B4w6/5f5msKJjl4OW2nvbbrN9y97bz4sbWrr59v/eSFdSC8MZMMTy0IWoxdNvXB0JM8mBh4xzB14MMSWySQTXiRnwClLEReYCFIC+Ao6s2c1AuMBWm3RoJgQC06EdbhD/99KxxM1Ocl8vgw4DuJ889fJLQ6slrZmPqxIC4vA8J4PQad7D4CN5bmk5anwOuYBW9/0pfCPvvN3/xNaS6RlWajBhkxBHBzwEc2c0lm6I1KyJwoo2JeQYHNNw2hQa96i1bblen4pcHu/6GBAOCHnjc4lAErNGb1Ut71cW2BjDieROhCZNDL7JDXSDwdJnTPUo/AeQNW6wS5FMCKQ+P3x8rRrarjBSGBuHI66R02G8VP/tTHa81rf/4/777x1u6dOzv94e0WpdCtbo9SkfF3kBUEwCcDuJZZowIaZ7VW3ccDGlRfFM3WDB2JojFBxpzzbc+GCz3N+8ZRsCYUsPfgSBKYJH7Y0vLO5iifHqzn/a3aqDbebyfZJzvbn762HZLdIcCYhFXiwwjFYpM52ZgjP5FigewlVRcIYUwnaLNgJbRZngQoeZ6fsgRdKB7jMXOYyUYiOybhmq4zRiVirIQm1ZNOYoAwYMh6s3mrFZJ0/GJbMq74irHpSD3dD9IY64TA8SSO5wwcjflpOGgWXOwaqEjRQs7yf+VW3AoH84NJJpkmpgihQBH0LXPyvhXQZr1buxtpBf3Df/gPpUrCifGZ0n0CFi2absqgp0SeyIfUVvv7zKU0Ntz2q67/+gDBa0pdHEE8roIGIOMsKUITFxCr6XVp/YVX6ghYeUmzoBAWXuExglekoRjGq+KkRxZ7xb8+ECajuZfXGC9b7dwztbMpShaXX2p3Nq9evHL9zbf3v/Ptv/zed98Z7e2mNfTu15qXf3D5b9Sunt/2rEfeVtZGk2FRT4YZqmLluJ5OarQ/KBNkv2k8nRbbbpRGxzz+mCg57sWCJBQbYNvf4no+aBSD7vSwORoU01mncfF1dN0acH/6Lu34+EHupj7dj8V4GutSPodE9jjwNjD3MAZBRrZziD6CyzfCIZUsnucSATiQkbI5k9E2uh9/5TXYjHDL8WywQHmSOSlNP2EimzdvhD4ptjnPSP9Uc9tEDKySLS4nM4nS5yvx/aKB42pyzVDMFBjdQglZHDERsEFDZhI2HVMEnjZTij+5IPVBCPyLX/wiWiAShY8/9pjyo7h8WwCtCY2ccjw1k+iILdxT2wCH9EVIm9OSqk2gDG73y7ebn75DyK2YrSWumw7a2Z1GbVzLsKQoq/Clgz4XHWo+q3k/l0T8QP9/9HhC25jKU2f0DZ0YBA0K419j0wOCJUmP0vWJ+c2K/nTcz1pZp51R/P3RT1y4+NLFohzcfPdG797+FKk08sMfG17+Wxc/+fFzbcAy9XE/TBbOYFx5Dd4ZAkFei6zmqelAYEJvmIP7w1u6qITUh1TxvUN3h0DR1O2ANT2bIBY4HvaLfG3tXLd5btNRSlNDJZeMemcQLMjcg2PriGrFJ32sario1oCSOJlmQBtIxwSmIJWfQCS46YI2LbW8TGNQ0sQH3KL2GVMAAW0a1VnUEszlSX0+60UoidXJ29U1EItSTrdpocZNAXQy2vLlbJ2OVsAZOH6gw9rgxiXVQh9Ajd0VKFRTQLUqxyVRBQsPrIqeFzPJeCBtISsteN/+4ib4YQTG1Xhw7NHbTnvKwe93XdKb9Hf36wPCcrRTKVv03Zt2NvKECoz+ILnVyYt21m+iO0FpIMSeKjSG8ekYEHAWGsj4tqtBItErKQZWZxkwT1Z2+xgodA+WzYTQGMmdia/e9v/NaNpVTPPZpBoXEHxQkGvQ4q+NZnFnlBSDJLs9aB+kV26sfeRcPSlo/9XKIHp7YdQp2hhy8b3i7Szz7Vg98XFWDCzWFm5LFdpqBzUfLioL1TRV5RbLeDRr16rJdDIYTmdZeyu/8hF36SXXIdKKBz0beh2ebqGYBGMw67j6ady1uDO9VO7lsaoxAAflMUSxD8LBrFbnGQ51iNaGbS6ONMRAQyGjjEHzYCbhgGsB1LI6lDwURAKXePcYknLA1X5OCrUWao9VsR+jd80ZOD7h5FQsImvZN+40myrRGWARI/E73/kOkwZY5JbzpEhhKjawDVl9sXkNhQe8hRlgQkzvG+WNgcCs11VKhP0qQu/S1noKm+2N0eTOzvTOXjopW2RAJtMiKzc22udrs8OquFdRTZjeTr2iQ80rvBJ+dIehBiYkq0tRrL2bXco8LH3L1MS3hglg4crjW3uvbjCeZ5dWNfoXwoxJ2lQm9u4Vt3d743J2695793an/+s7b9+51Zv5OClpn4OJ51buVfk+gkAzNLm93RpYR3VPYPf/SBWxUSFLETR2C9/9a0FCqqTA6E+jngRiY2BAuvJ+8dmk6k5G/d6oPsk3m5c+Vl379PD8q5XXNZ+GYO04cbTVCgLkhTsdPcdVuZ1VOUVphWHNYeupbZGCQgr+WsTJpjopFyAPGxAwtbbGsWejDV5t31kmWBU0eOGNQCTfwnspVQQxAWWMSoCS58FKESqtlPtFQsbnEhzNWdBswGXGccZBoCwPGxAvg+yerEU5IPyMlXviYKW1FecT7DWalxZGedjil42pd5lySazjtOocxQGak9ArPfLYfXdwb3d4OKKc2i/3wXhIBrpTb7QatHHpZRQEFgOsyAYUGwS7qjrO61xkNdVYB5BMAjPJ45T/1f/B46NuhDvGrXYP8uz8aE9RrkMwvFaOqnu3y9u3hu+803vz3Vt7w4MbN+8c9Mu7d6YH97BNQ3l15q503Va92/GCaIE2n6AIPvNlOjVCjOSQU2/FKt8U0t9lOleFCQkjF9g3QIm3/HzrxGBo+n44pRca8kG0UW10WKIA1Ni83L38enLuIyN3oXSzNdp8u2HuoZTyoBCeTNSE4cRvWVxxpI5aLuqfFe/K8dSK57ZFGy1LCSwSVcTYxA5gRajTtFsRWzQKJN8rLRXlLSUIhGUqiMSWxKL85Cc/CfsCkyLuxHcGjk8zG8POxq1VcBpkBBCxCilHldCDcnn4CAq1xDUGVuBsmWvdflWqdrz4dT0GzQ/C0F59warEXmwImM37xLsjPezYmNULT72m6qSk3X0394KI3Wq0mU+700G73F0r7q0VexvprE20vUwOuo0kQN4C6ELtnZfASRR9DI1ZQ3l1CNtV+fBhbvWR5J4spTYGRmG1e2/0v/78vW9/a/ftt8Z39w+H5WDn4LDW7CblNvQbyl7qjf7WVvYTL6+9un5t3a2xzL1fTKDSl8fg8PtusUWSlzA2vaNfBn1ySEmQ8AP/1GeOgtXr+10nwbkugzYFTubcwuJGrB86GiGTIV4nO3H+wrS+Ofbk0LxerbvQwruZy250Xug3pRnpuVNzj4RKwj4LI8aTMx5wU5SIAxr2K2YmPDPM9m9+85skvoksAZEyEq01sXLfBnMKo0t0VY45b8EEQbVbNCDCoL/0S79EvJ5EkIJLzy9f8vkGRyGa+pNxa+ElEGDmNmP8S9kNuLR6PjPQxHE1nrahpBBKvW7ZUdkDgUgLxCgEfvxmGOd/9Ku+0bpeLB3qCmTuz6mN22sbl7fqo7vDYR9YaZZJo03bwdqgaM0GHXfYKQ66+ufbplIj167akhqSZmLAyND22dtcXqXRV0XTG8E/TnTtQ/cQddIjRaEJoLHOMNR37/W+/1fv/dkfvXtvp0HNNFg4Qu02QWixM+pTG03T+o3r17Y/8dKFK2uXk6JRDQ5AtsqzFcne1EfjqW8LUwXVRt/NwRuzxFSLZOTTNqGvdqHu1567HtokVir+4zX8w2b2nKQ6oiHjw6zZPtdtuO5aaA/mWmKGTkM7LQp66gQ1Of1Dl+6fAjham1Ob9nGdfuxcq3hGm7q1VbCt1xwaxSsxG/GFSdr873BgWxBokmoUn8ZPTX6zIdyDXVy0nYj1wSfrvS70LORjCUS6F+44cXCME74GN+pCG+9489Tqw6nReg0QQ+UAvWuVV8FOxCOOXQOr0l/yo3WPlRjhGexENd6Fh0h3Q1oFAZHCO2uDdTybZ4lTaaCsD9HM5nLUpkZV1ato+yHFOD+Id0aNx/W11sFm4yDvj7IpfnGLts2z0TpKjj/c2T+45Uge59t3qDwmG+xrRm56h9lLmXFiNd9lofJ9q30A0DNhKDpEioIq5plPWKONU2wHzmNoBJhYnLGcO93+l8Kl91XZp6PDbmcLAdrJOOuNvn8wHQ6K4RofP8nONS7SU6Zwty9uVJevbL3+0etXr1+98oneqIH4Y9M1GFtcaJJoedWrur7nA1eDiz2V/K3vmZ05YoglzCQ3rKVjKshLGI1ujdY0cCDHs0FRId2Wcp2zUTY+yKfD7OvVaP3lv3n1pc/MXv6pvPnxvGyuhfxLMU8aS92C1g0A8bYrt0/BnBCvW0XQRqMRY9FIZuZ6W5jP4uO2Ydtk05/WwkGpAvTyG+EAEKU9qowlcAneiUYe1ynGKtQGzVJIw0knkMVb1ObzGGeLP2HEqPtT/CGGDEYxtl4mS5rnD+N4nFz544nfaoGC9fxbipLosk1m/fiiEVwAen5/5Stf+epXv4qp6BbSD2Jgxek5Q0P7k2LSzCSCJjjR8Lmki/d6OHjmUa/LzM+4jN/0w+XRqwEZc0hzjrAR346Jao0ZToPq2PE3uQtfDd5zYKTUXbODKTBqtc/9WDl8b//O7nDSw1yswQKnDWChlbeAVxeYjqHhKdjvfOMB78WSuvFMl3loP2Bj8FwXLuGc8xLmNMZdqUqacOsB2RFmdlabbm7TPJKbiGW6W2/QBoABSdtr9UuXN1/78Wuf+Buvv3TtUqv13fmaCZ6dCwx1XxmSauuaS5ZZgi718jskmOo1rzqJlkbNm8NVG+p3VYyDcBnfl8wmJL1hA5WN5vr6xvbG5rm81fVpGJ14xNR0Rz08aZ8aZBQblzlDUI/Ux5KnYrX5jxrpU2cCJiHz32R+QEmlLkE6UBLfGcRU8aJSNLa4jBzC1FV605prmrlzzFYtI1TrXYi25Iwf6XNYAMFaLJiZbDbyc+xWx3aiwXysTGO8nOM9a1AGzUQ2PdtgV005YZNMNgkm81OYyCSj9gBMhBQm9hbPq3XX8bf2mBio8Yfirr48xqRVl0iCobQk4yfeByaqdN6F3acRw657OyhJ+3WUtH16opUrr5Btuq1PdEvUE+8M7u5RIZMXs9T3QYAsmKVB1ca7zn6tlmVIeXiqo0fG0iOjT27Mp3sYAf/CwP6RoQGEzY3H+Z5fzqEly6kFpkdMrbNevvr6Zn9wdfvc7mBUdeDvdNpb22uXr5y7+tK5SwDCdoce1vT+8/c0dOPxM8fLBLHd0RbQg98cmyPKVO4lwIPoBCSkSVYO69NJfZaQfuLk4ACR/faQMB268YDaw9r6xdfPX3p14+J119kI7bcVS3hqrhxTF4RC3gm2NlEj6ljQoYA8K6p22wvNVTGD7VEPdVxhUQC7ujWl14DzKrlq8In9CD7SoR7xCzwz1poUVRSjVFuk2BpV9eH7noyayQgNWRpW5W2AuySoESeL4iyTeXVxPcjz6lYvQUDcBDUOo4iNdQxPSv1w2ay4YdbwS+AYJ3+tXRcuMxOL7VEULVJsACJP8ph5xiSzAKWgbYnEE2/jx9uPS+0GdarKFIGJhEQJjxIEIGXEyTDdeRnaE5rlp6DKM/ZoRRjuMPUPMfaIn9XKoL3lmltu+8dbw/dG04Pi4D2aCdSSckZK20sd+jJkry2xoPEE17gMdHCfxg6NUfMqGIlRelop7SrYiZ5x7UI/mZhjUKG2S3vVpE7Pzo9+7BKdZHbuHgwHs0abPayzfW793Pn1zjopmdlk+m5vOFrP15U7qXyDrXwx2oG/qLhooF969mKoaUSQllxOVuXZrDXp1yd7sLVqSFFWEN07zebGZloe9voHvcOJmzTqafvCpde2L37EbVzwdURlInBcVI7PFm0UTy8PCwzhGP32b/82YvLgFJs38wfnhrA4dVw8AI9YI1bb+qjzx5wVxRBVdy6gBONYJpL5oQ5HNTls6iAmhqQocRxKhIprSTtAzgoj433DRNbFQV2q+Xycd4CVrDcLkxOwhjNLTOEl89NoQ0sqoiexjk4cHC25Jg/XevJxSK7mfo3Xg13DV2+q+FZAG+PL/ePFvN0wTgV8UnnAKuSegYPcPwxGfuVP/ASS7P7FURUVVi8loD+QdGvUDlvWvuYTmEi+CCMXWGS6q6ksj3nAmagx2emk9ib5OFD2EOrKw+0OX4ryRKj9y9qXupc/VUyGvVE1PdzB9azqefCOPcgBM6E6RpzwkPL15TM+BOnUKdUryo7n41AJ+9S3ILi6CkEWMhC0jH1kMKh0z5CE2D7X6q7VX375PCiahn5dOUHOrAc5nI0SKSG6yVbTtXl7tUUdWxVIOKGe0SlZ5BboxeNaYH3nk3ZFTeDd5uBW1u/l1GMXjWTjEuU0bpxiHw2HvWKts7W+DX3no/n6JZfSBsHnpgWOIX6gz4v6bp/Kgcn23/7bf6MIWpYaqMQDgJJnSArjdmBFAijMc6mCPiq1MGbtxA6p+a0ulI1x4GCxuGgvygQGy+6GA4iUx83S4wVMY5XuPIy8sWQMgq3f+MY3yJhjlvKxrOXPfvaz2Ar0prfc6SrZI3bUFKBbMiSf42y1rodr5jZjOoERBDV8ruD6de40P5WyeN/rBByZFgwlEMMc4i08w5gyxBiJWIVsQWjekGPhMZjIDQYQRRCzQbedTcFQsXlWzUYjCR9zSpbkkVPAjWcO0QDkW9/6FjYj/gh7Ly6JAj0cXD72I5evsu7TWWwhQZtnrh1MrJCxDVScmVePoLi6W1t/bf38uNyfjoffn017xQxtG1zXwG3EBMwCM9AHGn01tVfX9mZaLVSdZIHrOElCDXaY2TK9PE4SJglYGRy3ua8d4kRezNG3QwxPEguGOVzzjbGrWYhuEt8aTOk1iPlXz+vol80CgXRhLICMPoJRBp++um9DVvfXSZH6OGOj7Lent9vjd2uT/Zo3Zds0WNxHzXeQFb0R2abO2sVXLrz8cbdx3dWJyzZ9IjwNiW6JdNzvvn2q9D12VtpssMUytxXXIyaIpcbsUm8iql0JzsDLYfsnevgYCdI4Pm5hKOsaaHlwFeSwfLSyxuFgPos7zHzG+FABuAmbHlM0oTXC8v/a1772+7//+6wOLEdWLmgrqjnXEqdccL3FJbLzjAsuLAThom6xzyU4WqcUhubLX/7yf/2v/5UR4WYw4uwbX/rSl0iPqGXrMYE/xTsYTXhVGHpwEZgxDCtbKJR93A35ywwxP5lYS59jRARjdyvSYRvvKlodj18WLtCGxtxlbwcZv/71r7MrgpJGHlJMUyisGykFipPOVs9NWo9HfEVrbgN5ywi3tiw8AkJvJi29ma+9tnVpdjCrD3ZuFMVheGEVsAc8pHw51Ol50PDUGU7fg6T3sLMquV/o5hYze84YL5O5aK4Ij26xzZStIGDhw4U8Hb5lWgSFi1BZyLnWPVu78rbj2EupJYk86FCjM/M0R9iOKXpl81WnUsRQ+e2JJumgTjwS6B3VyoOWu9uqH3RZ6MXkgIbX/fKQfoKNtWbnwsXtVz7trr3m8m0Pi1Dks/o8FZO40IB1pft2cho5GXNomDOmuCOvC3sNYMJtIi1JRPLzn//8z/zMz7B2Hi/6H5t7Ct/rTzHAaUlKqxQ05K9YIVqJag9rbNaHNfuM6RwudMghwU3ESfRJQBatg5/92Z81UrodVnvDnwBKS2Dmi8NocycXmzoNcNSpc5GU9JFr/sM//EONFFFnAA7jnH1DscJjLlIkVcIiTAhwEHjlvYwRaKh+lVbWsmoAxrycuPbA9hxNgkcy0W2DVSpJNuO/+lf/CpSUtRjPRcWwwXS59rEQ5ImnwjwBPPMdp0NLaSw+0G7m2ydA3UPkCyYPCeyt7MJHW2N3OKDM+YfeY0WeB5ct9XK3pS+sLoMiD3BaUzQxjBQT0ys7LnLbwRf3mmaJLNYyURI7eNzpvNl0VTYDJnpepcDSizIim5anAQFCfWJF8rwuXaCsFjItRdBz9ddAwoWIaDYsJqGKx19UEln6FLygzFbLvFWaDGv1XrcxPJfXGsNpNnSHOOr55oUOJcLXrjeufMxtv1SO24nnKjVkIJZzAJz/PxULybLXJ0/bx0wjzsjuLkBk/gBDli/mV7VGwDUBWVgUjwqOxoKMW2vFq0bmmJaDdm5FAy1ELl66MgQcYucYU/1hU1qWIyCAISybQCC7VHofu9VcIDsBFhU/wUfGgbXD2icwhQHEUpJ80UmuncdNeHEZPFAbIPxEJaFU+q5rtobOXAOvZFC4qcpI6Eku7C/C8Wu/9mvWH+eYQ4Il4vofH095WBAkjlPEw7pqvlnBqTVCiEmavN4mAY4Pv7IZ/qf/9J+4uqXYpWWx1fAII5cYNoB+ah0y80HqE9aJGxa+3z10vYORo4EVXU/X2jAAoa8ESynbaL70icudy3d++BfDARWZPYYkVAkmofdK4Rva+3GoXMjm0L8wdPyb1PJEcFIp5VLN7StgNXPzXtJhTS7at1ZuXrbtnehKEOk/za/JNAkK5KGaRXtYMvPutt/dfAwzoDvnMinCi8u5fMX87gfEndQn5aCflMNkNi4nRb2qw+0uh7W8y37Yc+W01c3Pv3J97TWSMJenrl2r31fBqeb5GPOlwd5CvPGQjD+NiiY8ISwpJhVhazZaqagotq4Zrj4cPA/hlygktgLTKY48CkZNXuzIie0elCmIwfFIuFmdqPK9TC/SHVUbFh+ctqhsGEMEB6Q+yWWCrZw/P1fJQKAKa4oILD44AAIaSmyfRALgSPSMDAQLiseS31dS15gwH97yeBxwFJSIKwO6s4lJBIxrYx8jZowlGAc4LFuvmAWXwTAxWECkERt1S05BLPMYSzCeInballJXYYAMexf1z+XGcI/Zz8VOiNmOIi1JIIC7SMCUqUynBNm5KskS5/wkg47ezpvAYmn6zqI3dtyffuvgjR/e+fEfe+VTH8/XrmHbTYfjvSapkHWETrcvF5+8ffvdnds3ppNDurIQf5yvnyDL4zk1mHGePgjk1/OF4K1IPcmi6rAUB0g1NsH28tUoMu7mbRXmEb30vgiuEs9paLcaBGYrRS08xzutHmi4OX9GULv4Un3O0E2avsRwgqpZUYxpsODzTr73djNLuu1udu7S9tqFq0Vze+TWKaTMHxKoDZ+bzt1sX1LuklOxHEnWfe5znwNBcLPwsUhVA5EsHGaRqQTI72FCLpElllTy3IIgHSNjnJA5zWporRrsPgp1wH2C73w7uIbGmvVwjytQwQcw9Pd+7/f++I//mMWFySlpNSBSlCYgUnlXkjnQ2vH3FTaNsf5DsuUeB4lMr4EDZMSXJAVBNEGB1V/4hV/AElTBCSMij1IhA6WMCZ1Y80lez2xY1bk6/WPVqY+rVkV3UNzQnudXoE0BAW4MVrOLqrh4C0EA7hlDwU/qcJgW3Ej8JttmT2MnCPUeBKwSh6LE+ts3J9/4g3f+8tu9716q3fxbl/7fn2m89mME3b0Z6I2+Vj27/qnz9a2pax7svtuf7s3KcbNe0iA1L+HDJCKkYk/N3DgPHavmhpuQI5FJeL/XigqazWQJ/x8ElBU+BvVc/3p5r7kMUJ+axmCswn5Z+M8thbNlpUx4GjBrzjTX5y86X7H8S78dEE0dT9IeTbe5BK69T2Sz3dq4uL12/WV3cdvVcb8ZkLyTzE3ElWaKqSZBhJanMQ+ZKphRbKVwd0hXQngg+kT6UZK3cT9Lhd6Mu7YEjnGOeMmGsiyiOTeKKp7C1WEk0hyR8wH0+V7QAHOBFJOodTE4ckrkpgAWspoyIORcSlOG1zAmvAa0hQeKdfL3/t7fwyxdiq2ZTsLpgaPF4DknAsO/+7u/Sx5NJ8SeABqSMuZEBeScnGj0kpX9whe+wFZAhI69AlikFR+sbCv/fIqdxY9k8Fg8UWXd/GTXEiDGMo5cGpcM6YEdgkS8C0VdvBLL/1PhwFRkc2NMLEWurnKnweYpfAeUGgF3d0BkDY3ywWG+v7vR28t292/0J80vts792FUMqOF0MqT5QLN5uXZp7Up9s/be9r1b3+/1bgOEVZMlOMZ1gX9D48FCko8JYrSZ16FIQg7BtCd8TnuRPi7n4cj71kumTgPlA82qElLMWuEimxe+Q4MrH6ANLHLT6RyuEnW8qhYBTx21spVMfOSnKnuTRlZ1DqvsEEdzrxwhZNt5+bI7f8HlDV+QXeZV6uJg4mIG3Cfu2OcbTJ4CQsqMYGdl5TNtyD1iRRJ9Aizwz/C9RGJjNZGHFENwifIiv/thpSNLeHE8he4JGh/yk1jvmERcCL8CAlyj1acZuAvXMB6lSG3MEC0cBbsYB5YkRiXxOp6EVIR1YqoI7ihh7BMHR7NaOV22MsxjhRFlB6nsiVSJCYSYE8rB7fzH//gfAxbkcwEUBoV7L+ns9812nUJKXTV/mis84MZwgeAduzfzkl/Z9zhbcFBRcLP7GA2mKU3jmKlkEhU3YAZwpVwyVoCCx/ZdSvwZAeKEUd/f5NQzcEaZG1xYb185t/6XmE21i+/s3PnGt/qdi3X3/2xdhRePTDi4UqKDvVG7uHEpX6cKee/Oj6a9m7CmaRM9gzPdIpaS1n2koQhw6Htd35/TiYxBX06tXxfrNVh68oSr5Ru9gMV5Rse/2TvZk3ko0xOG7kNStghcJkqBLyKaRTk/Uljf+1O3f1CO6TadV5vj0figP6SvV/PcR7abL19w7SYnTewVYetxtZRrKeXL389KL0qDglvNHCVse7L3K272yzzB8STfCKAAkZggQCQBOIXeCF7jjjDTljKQFttZasqqzUO0OYsPmtLEKYCjHnTCgVO8pE1lWGY/JY9G5FGpbR3y3mLgw3ZhZAg+KK8bV4J/SNB/5DsdW+z9cCgOYtWXpjksCIiHhv0Q84owgbpecF/FQxSX9RTKRd43+yzTlTOB6YrlD5UfqgEGPAVVbFBsTZz8z//8z/+Df/APjAaky+diad8Bepo4kLrTqFJQnkusSXFM8PsJg347BOWg8sxGjdy9fL7x6su1Rufmrf36OG3N7uTf/FNIv9XGT9e31okr7pXugu8snbTS9drFrLXW3tq9+Ve9nbdmo2pcTRLfAoZWB863YfH2XUjDhDsXm41ukZS5/9gpew301SJYFCAF7mRVLeqxPSPSvNnAQ3rg9fcNuSoUNhae3+O9k5kf5OmwGB9Q/UJr7Um2naSb9ekMRZ8aAY7OJy65l7ZdY4xobu5arJu6gqLuvps/jwVU7gGIDNhZWir7JI94PQso1ekFmKArIXk/sIBZSnAGLGCCHZNyXMKm2P4wM1M7yil4bAbHpoq21Dt76VcumcACEUkMFOwtrEjxjSzdJJQEPcSTi6OrWnHuQ/PDH9NydIt6IO4QZhRQInQX8RAQFByIBOAivnQ7HNYDyJSR9MqnqAcnlRGsdEKiTEECPfRpY0ciUCCWLLdHerpcIzs2icKlLZGrxlS0UplYzYzBEV89rpk/nZ1g7OUhgMaOD9tMkwtr7uMfbb32sfzNP31vmP74oL/2lz8sX76cf/oV9/I6F7I/ri7gbWZV219XN2/ljVa9Tk5x79YPZqOdsjgYDSeBeVP568urKsvM2awiBzRVf8Jybk4mi65d5axhIb0ymGmJsWdKuesiR1ZyxssksjQX4U2J2PpAZFHOC67GE/FdWj1iw/UcmZGtcw1CBO1rRfrq3nSttnm+fXXbbSS+Wbe47Nwj783PnLnOZjxW7sh2MZU7Df/GRONj009VKywcq5+z+NqS47UkZmOfA8rgijIJmck8Kcx9KoGsuCw6NmOXzCOW2C/+4i9iZrIGWXdYJyxPTlsXInDkjawshoXMtVLnsYz0h7S3HhkcpZ4kHMQvZjf7TjjUrEd18lwV4y7gk2pOnMNVHkM/41YtTzEbo9WLZQ4mqr6F+4HZyEUZyUuXzI3BiiSSQNWUrkVs1XmJW/DHTX1P90YJa/uWOGB8Cj03PLl2SqKFW9Z1dLNqu1dfaX/yJ85//2Dw5p3uzVtpctfdeNfdfNf1Lw/W1uhK6OUXSLS4ghNr4GK7iy+3N9q1YtjbK/uHo9kUh5dEuy9u8SI4EYFU1qMAcW4JPhjJ9ZcfLMc0gpl5/+sAib73QviQIExbuAgc02rOFppjWBFuioFjKL3n8Wa5Uc8b3c2t9vnLbvOq20JR4rU2UmNo4TZ8K0FMyiwgs/eS58Sjh9QIVrG/faq5wSU1lpikHas3rlqCSyFFe555q5ItNngGiglJtAezxprKnTRKWh4pzpIvUUTi9JG/lZubEN1ZaFZWB+GR1SdBa7CSz+E1oCfGCiF+sS9NxdJSqacHjnZhcpw5Lc6PqBxhRGBCVcP4kqbOtuQ88nahickm2uMn62Ma0WlV7i2OsxiocTnA4r/+1/+afBGuMVuT2AOqrLKoh26nna2J1y9JSMXVkEuVkfHcPYWeG5xlrQGVB3CYZF1skrfa28XPf35z5+D2+KvfTtLL3dqFnZuDN/e6e2trM7e9WZPGre/b6lDD5l9+meK62if/r27v9mznh7u3vnf73o+q4W6rKDoubQ1v1erkB+q+kUFa+LLoit5XBZpigTgeAl4+0ZLONQVmoawwTZb2xdVtUiShis6CKHeXU98/i7oestiYDHxIAQWpGg8pd/TqOySHuvm5RqN5+5Xf6G5sNs9frja3E1TI8ibE9dDZwcxDAji595KzMhQx1pdDtNmRYVu1rz4NntmqIKNbqXA1/adVZzye/8bPZXkiZoEzBKbIj8GCIWrJaiWmKaKFaQ4sNT12EclmqVf7YwfljjztuNBb1wvwKcSPEQYmcvIqyiYTIEU1wAd3jUwAZtmquX3abvXSpYIOjDIbERE3rg2DkWiIWtc/9QSLnWR8j+N7EPe/JuD9/4WDAIdJ5sjBMe0fOSPEwp+FC/ygK22hT5h4Ee0mzO61LBlvrH3m068THf2Wm9559617OwfDg6uz0XbeTINjG2J9S9SWBmUn2xcaxdZ6rbe3uX/vjYPdm3f39i5l+XRUDbMJrriXCav70cbyIRDopXBDC6yaMe+qZFosHheVs+KWecvD+eIBOe8b2iOIsYonTtnHoH/z/3JWTYiAjik9wsbtpHUqAjda3e1OdzO9eq2J9tn6ZtJoebWNeehTnRITl1Tur8dhticoQy4R3w6xH5iDPJa8KSEjniRhSFwPfCFcLoaJ0V/M+3FRR6BTo0ZaAEr0RpYkiw6bF6xUQaHcBa6O0wZzxPp84obFh93W1E0iBhoBiiyyp9V2ZwkQrQJ0abPSalRjXzYl7Hb5MkZHN/qVVEIJEsvUf37AkTLB3PdXxZ8lmpYj8F1tZPlnPpnXcg+W//NP7nTqo/XWOJtNa3JuXBCYcPN6kVTJYsaN9i/1i/l6d/PCxc2dS7ff/dG9ndvp3g+9QwtAVhQOVVAmKUmpeYmdmpc88+0LiPIlC7ir8tq8O6CtN/2cTqZHnn9j2veVar7UjPtSTWYVBdfcnNGUBobtrLHV6JxvrF1qrV/obFxsdjeaGy/7hFFe87XSnhDpYwRV4JiXiUvdX5cjzgWDJkAh2z+BI9kKwIpcbLKOQCT2DcYNhWfiBpnhFqePT/+wOgv92gwHD0whLV7gijmsSuQ+HcvRWkGa9mQcO1hKyz6VGOLSYzMhl0iwVudP5p3Hyp6boqek0pR6xnpXiQs2/DHtE56pRZI7xBybCYRqMI/eL1Unr03rrrzYTRuf9uB47cKrrWzwqR9vreUVBcaFRCHmRmdw0NTQ1Cd1a6HnQeod9QvrF9tXz13tuTf/fDBE03d3PMTEG/qC2ckI6dxOE/UxfGG6GfhyFjw88bzHtYOlm7IUlyijw98d0s8eEAuPiWVGIfjMtaZpO1s/32idb22+1N2+1lq/VG+fq7XWXK3l22ql6omVBfFa9Y2x0kD70iRKIb2Ah8JBVkunWjU2eDFJ+BMTm00Nm4A6HHCToB6hdvR+4GNQtqD8hmksrobUTnp12/SwmaBgpUjTVkChZOkJRageJ1ttm1JsKsau/rPQpDFuzmsegU5YdX5GNhQIEhBQHwWz53mSX6X6A9EMa5EH7LHYj/gmx3d0eHaO1I08G6bM54mHULyX1UYIUlAt+JlPuI9cwlRorjddJxskylTMf+LopnFygsQArVUS1HK8hk3Xdc9l3cq1N9YGvbX9vVF/dzjYGw92R/17xejgcDR0xcjNhqiMEb30tmQQBBrU9uKpH7PblpBRd7A3yQtquwkU+tYv67XmRqu5VTXPgYn52sXmxpX6+qWstYEy5dS3B3TN6W4oCQoKlt6L9kazYeBpC5A9A261VA6kVgWrROMMLMq51msgJhOOhKJLvTb4SGkG3iv5A95ltGqLzp+Ocx3nnWOdR8tknELg/nF4jtb/YdV2NQUhGQKW2n4qNrnuqFg4Uj3inDH6rOIqTs7gUJBcwu+QOjxZPJ5hCwUNMRgpGCc1z40BE/mQmJX6zB9FaOjcuK8Ki6SsG9bdoAQPa63NS55JiHhZHuKxaUCP0i1+LMiFc8EzwolpM+ZIu8411y7cxqg56TXH/XK4NxnszsYHh/duVhAOR4ezUW84I3EyQWQcDfCkEdeJVnGlV7TLpgZiReN6VmvUG11Isc3OdnPtQqN7IW+eA5pdY83VNyh3qZKg/62TzBpOn+BtRqaol6EMS+sZM+lPfv6b/YgZSLUFc5g8BqtAORnVmVgwnWeIKUGiJB0MZ4PJD0rCSgYl1TxLTIyl6NkpgOMqyMRl4zFkP3nr9fEINEtG2emM16MehFoAO3ZL9SkUMZOSPgkpu0gyR3FG4i9oMhK0JhxDIJU6aKxFMmVqPuMWqr1zPeoVdd6Tk2v/cMeOb9036/g6wirARQ6S7FEcPfXA1/ZsRmoAveb3MAg8thZp3UTtEQIs0myQngnBGAt4mVRzn9RLnyVBIQd/1v82ckXfFcPyYAf7cTI4mI7Bx8Fs3B8PB5PpOJ3cKRf9sGI+iiwUuU4KVWvTmmx+vN7otFtrrc5mrbnuGhuujvvc9rZwVlM5dqg0DglW8g9pOneh/Wmm4m2XoctDYrvDXPZCM7/2ouKjXGm5n8z/b4aDGc70lsC4cdREFbJeeEokkKshnQ0+sgpIastVOrWKmlW00bHkzsd516cPjkcKXcSVcEsI8rTAgg2QGQBdEbAjmELsWRR0cnOUuGAkcrM5VdPUVK00mydThwfsliSmVfYncilTLe51+fyA44H3gif1+1qt+dBlg8KNJt646qQOTxnBZRBjihqsq23MgXFe3KIOMnNrrgy+uegugdbt+tlcuyYYe7PEt2SYZt57n3m3ejpy1djhiSMiMxySt2kP5sVCOqyVkpkkUgLWwTP3Nq40vY7fukNbrPINZIPyWggiZr6sO5xg4WHQ19nA0lwL3aoT69lg8ztZmKN/TcDRuDjqH4fzhJUAPpKB+ZM/+RMKfzEhJY5lcSRrkartilVAIhs9BKRkiEWK8XZyyttHoo17kNa+NFviVz7xworH5zku+dqrbXM/DFIsDYq1ZLTPjHdFvYBnlIbjrlMKzU80h6EukqdTeaYGVNJqbIkAn7IubkEi4+1XwmF9PueJ1PBdMmeO6VyRPJN+WwWRG8nGunnJLph4/IJzDS7UiUh6yre0v+otFfl59CtDrwQv/62K6SJUNvsWr5bKEN4WiweI3KTeLq0VrkH6BmZXQgbF6evK+mZJIogmrOmR024hJ+4TPl4TfN4Gu9P2ytxTJx8593mdJYkcj4EBH4Fj9T1chE4fuDv3H5TPMqJpqsfzX6Eh7dCxoqh7PyV5W4niERNSV2cFkorgo5wklokaacVWoQmjwfblZZwAbyTgjj2hkL1C82YPxfpVhlB2blJy/DDBgdUszQfEpdMGx9OMmMS/Wmdq29Z8zVhIveme8aSoCWTfMBUpiCbCQgxF4qAWp+A1zAb+xCw5JuN2ZLL7uTQfXENyYum8LwrR0lnoH1Xz8tfIL1RWCpLPC+TmBXrp3KUWAzGs3GwOUiGiV6kjzDIAJYEsvYhaigl+v+VA1mk9LHN0P44ZPUh8jY/YRL6nbLHwjlW0uCDn5FHGJfrfg7C4snqeyc1skTyMm5cCRnE/OOvr+xgBfeKP6qdKVJHEi1CS9YIBARRafZeqmFk7fCnmBTUqBKlU0qYEiJkmcqpM2ieuhDk52DqdI39eTjQON8SBYW4YNxWww1pkJ6S+BakIfGrpZVoLHstBW1txt8hzrfr+x0eCn7ujmqOkb46A27u47yBjI0LGecLliHcmbsUOk3cd2rvGmDOXBI8BL11Cq1n9g9zr+T9/j7wSeDrPCyVeyryUqNkDsNoIWK82EPdxsFzBxAflGstnFhzdQh9aTVSUUFaRBdAmhs1ji13zLljT4CPxdPItVMgQVaTIjXpZSSWa8SiUFGhK/H/JYXcL0esYB5eSJE9Rh/BFBseYkBjfGNmPEx/FGnI7oWghKwkywkVgi+NexppFiqRYoTcJaOaE6qXs7toWveo1Jy9OkrMK3WDSIA7OfK2lbrVgJHVJDCG+xNpJWza6LQ9gYbGAIL3MuglU9y1JZ5xJ7MBk8hALt3BRXc798Z9NZagmPhqQB1DOqxAaeFA6Zw7EjaOM0YeURz+LFo0F7gUuqvdnswcc8ZDQeaEMgTks0/Kxs7QKoAO1ZFqIIxGIpwOSAvRAJKaGpKwlcUYCE58ar9y8/ri1lhV9L/WgX4oSPI/247MLjjE50aw/BY95zFwhXMKNpJch4Mh9JZgIVlp7IKld6F16Um0kyb5BWoTz5YLugyVJVxNTLwYsZtU8iljdv92p6l3mcLFAsblqbLY8CnM/+gFkTJfNS6k0roghLnuxXp1x8LAAQGJ64jEYlyH+OH/G97dOfeHh/Ux0siot9rxvYgtXBleXDiq/8zu/A0lbnRLAqV8MB0GhD6VxHQWUMCHxtYFIEpgAMb6XVCPF+EF4kaoHfHCBoEBZq4b3SglCMn18DkaomssvZQue06WUP4Mz42H0IFH82dZAQ+4igRLsRB7wDFgpN1mt2rhVxIDVZ0PPw91hk4THQ5yFfVLF0UbYPIlU1zNyCNuCG5ylAeaSgJiR/TQLr0sTua5peax5tYSdpa+pMS/VNLSrIyKRen3tIfba0vOVfUQS2YJz5K6kDZk9+JZ0IT5+fDR76R3Jszf/zT9l+2fvp94f2FI4iAkP9ECyYXd/vOka97ESW0DgtRYOIBL8JUIF6qHsgBPGrySsgUjr0Cn2OG/EafuDcEgKGgClpzwEOM5QUuRPUYHwxQTHVQohoUMlXnigppTQEeAisGVJ51II6B4k0/BiF+ox0WEn1wYDVlpqRFt4xqIhsv+NvvBiHpWaRaX3Wd1zvcLQotX3WQ3oFMjgs9i9DZnj47GmTIoYB9Mjonsxb6ZMZu2HfFIaRxwTCzom9Qc/cZ7kyfx5FnOLd67AGD4hfwg1bU5+tBqZ9NksHYxlu7DIwEc8awWR5GUDSTIF3GM1kIrnedwgQep5ovcCcybuoIYNHCZSqzgVaIhd8u///b/HtuWs+BXzFkjFcgS73UIu7Lk2OJ5FRIidXO7ZYTiAQjLR2PzcA/ZP0tBWpmJEblFzFGdkayWwiKlIOT1+NGYjoUaCLHoLW6JawbgVFeIjo+PPs5c9U0BwzvKzYjqxGJPp/AUeOUIx2cJxTh9MxKTuaP3X6YNxvSTCOXm4aaDyJKa2XT6k2+Jqyicy9argbMcNseeYK5Qv07lTXx31CXPTtXo209PLYZCQA7HwuhCKuWrMUJHSLFP8eMajkMsqr/nVerOwKABECVMpPKVGLmqLgrWhr2ZhUkuGjYIMrZg9eOJkdWh0JeM0ZiM9XZH/Zxoc43Ls1cCwJbPixtDiMTDKbJ6gIQlofgKOGPBiHVqCReSDuDQdBKRGkOKnT4aDOAglLmq+YzfJUPJ4y/9FcLST/AEHN3nQl32QAs0f665xnIu+cjSPIFGXK554NMj18lEnj4vAfIFznng6P6XkIZmV97l1ZXJ03OBZ8awVDWRHx9fBIhN44bFi1qley4UaMNNRfjzjMbYfY0PSHvBiIvV6HOsJgNeclfg99paDcGDKcIYmDGFckVUjV8vfImknTep+FsHRooexWKaVxNuvxrsWhBGNBhBJQ7M7ESEmsKhd1FLPunOm5sKvKLsRHMF3VqE0sMgz7HXc1OSvV2Xt2fEcH9acnqwLezzMXJLIom3AuWG/Z1bPN5qTF0s+BmEBTcn8zLfJZlPumltRmI4VsOK+0lr+R4Lgs5ADOHFwXO0xZuNl+6QV1WIqKqpCqAVAhM7NT7UzlJ0fB2X4lRvDe/kT04WUixpDU2MPPors6hakyLgr29nyOzuefXBkxjKlKXVlJhPdYwng7hA9h26hoPnT5cewAMnVEK1Sc1ROGAuX08PUBSVXuXFuRSpwyVJ+GNf4aTpdJ925xTxZwdNqRaQxoTAVMQ/xoP88HHjQ7JnEO1TdLFkdkypQ52g+Te2h2U6BRW4VRDCAku3LWtzKdH/eE2fP8PG8U2ee9c0S6FHGQ83QZTZafPBpgQjfTpCRTDrZUZLpLE+WHjlP0BzQXNIPFybGkcenLob9TIBjPJpWvGkC6C6klcFETEVCitT84UfzE2tRcWINYoyJijNiz3MzYMOSGsNOxGZky2LeiNyveLA6wCjYfIZhZ+D43IHjquyCgYvF3J/Wucnxx3xhtWLVsoqxcPH6sUtIbS/J769aiyaI5RblasYT0p+ehbqaEwdHEw2Ob60FYuFSIQ9BVBFMFJFbzVEFbabaovAKxqDa+BKLwVpEPAJMlPosN4YXxL0QRMuSe2JV+kvdcs+OM3B8NhMycZfn2BWNMeWpn6SsHHIyLDT1xcXxV447riCM3f8lrORdIuq5oIuhhI/8S4OLp+hfnzg4WhWKPYOQHAjIT7YdQoryo3GiSUwzLgQsRB2wg2dUeM/nEPHFaKcVGZEX/Gh6XbmF6IiqqY7cZs+OM3B8jsBxyWBcxZcn2GDvSYG4FqB5+gqbmptoPnWs5YO/CALgkhM3UIENMVZ4JjxQBYdbZHKe1jWeeELG6PiqVwH4MA9JuSAmhqnITxxqsNJMazYit2jdq3EUHR9TEaMdLjemIo/xqVWlxOvtJuk++XZP0ynja9rFkl+0u3J2nB3PsittNmNcm2AeWNz6/Olu/5aPlo9fC4f9dan/jCWpzX1WFv4//If/AGcZWAAWyRkQJWOZCyUNWJ+W/XgaMUdVN2MYquEZTvTXv/51dJDYOtg0rO+CWyiRmMwiz2OoIxwCIFLzR7sCEi8kxWJpxUc9/1Xhudjgt5utB8fr5Z0dZ5bj2fFITqSi/8TNMA//+T//57/1W7+FhcSvrD64JSxt6Hewl4iYwcYDIsnLm07C6QcTTtyS4sqJJmA8w8vBTqT4j+Fgr1DkFfsuVsw3DiMjwtYBadGsRXIvPKOSUpOPfuz6zXigLXhsbcstsnOGjGfHUw/txZv6c31YXpQ4GKFGkg2UuhFe07rjAXVryvB87WtfI+tNipXQGfQgycScfrz1xMERpiiVf1/+8pe/8pWv4EHzWMNhSGQwpPQLD9hACCwyLsAiZjZjxOiYfxGzoh7D7F1ih8U6FwaRFgqwve7sODueFjI+q+03Hu0wDgmrD2Ky2JHjcFisQCsOywkvE54QthH+IhJE/CQNe/ptTU8cHLna//Jf/su//Jf/ErPR7rQCrkbP1gMwERAEClUQjQcNRGItKpprpmWsevsYMybG0yXe5arGrZq3na3Ss+OpHE+3C9OJXhHGI74gmQNoQOoT66KOifxKFBKUhPvsQuUbptLpu3EnDo5Yi9/4xjeIMCrfL5eZ7cKojgogAoIkoElDA4jXw4HJaWluy3zF0dm4GPGRbo8exPdDh9oqYNvz5OVwPEbh6tlxdjxZNHkxLsSySfKgWVnEFpGu4DGpCAxJ/VWr0jQvwA20ZlBCI9+AmXLKOYATB0eCC8C//FMxut2CrCATEhwkrEDNH+DIEEgsU7FIcaB445KpaN2xHyP7vCTDaUAJiNPRHLol1QjcALJA6IsA1me8yLPjNA8tjQ9O8XuYffAMoqoyBJZtBxwxRHiGJAQa/uCjmZAsf9NPwMWW/OBTAPST/gKyMZC0saK1OYBHXDmjAEURaxn5dVIuYBB+NJkpedBWjq62FauVmEsplA+5LXMb2L6Qpft3/+7f/dEf/ZGQFx+fOwdMA9xnK/bsOLUDAyJZOV6A64ojhnLISE+jDgM4YB4Sc0NlBkMSK5J1JzSUrAz6u0rDqgXjCwWO4AtyipQGwvcGEzEM8Zch6Eg3mGJMvNftcLjADwdMVRBtjO4lvSN1SY31ex71Jlngw7IufC/3hjvEveGecW/wrxGnQyD+DBzPjlM2rzQzV+NILwA4as2yfhW8YtWTdGWJUeomRQWWIVip3vEb4QAoJLShArkXChzBQfrkAvnEDsjTA4740ewGPInxyGVL3VPVfmriE+vKuQ+taKSt2CqZTMBdhHPOB0sW052AI+x0nicSLLq4xOJfmFWnEV7Vr7eM/PEBHXHN5BNpa1l8SLq08bgHCcy2sS0Cx5Xxme1BXEYVU1BX2RvxV8Sdm9QgVJVU8dxYoshZ8NpFbFZTP1nqjX7SIBgXveBXEdiB2nLz3f3zF7Zfvnb9+ktXtilz8A3ASy9IzKkiuh7664QW3UXQNM8mSb6QFkZZs8rdLHETNx05ujTSuLGYuGLmJuNqOppNfAVLv3Z7LuxZ5qmXB85CH92sVm8nWS3J60mt7lua57XUN/NNG/4W0MPC93eES1KEFmyJW3R/9G3NpZw5Tb1qcpFUUkotl8SGUzVf4wLSuaCqNb7kMVw90ICsC+CIBBECupKj5vnPfe5z4CPr9GGikM8xOHJVujbcZww0kAiPFXMS01opFwuyPNkZaQsv3m1sIelXgQJ2Iq/hTnBu0AvycHBinN4LkKpmHB4WNrUYkFnTx02URYG8gYswRYUQcRWtANQKIWIJv1AOMI27j+ocDBlVKBXbTRakNhtKb7FbKYPCAtBWX69vXFLqj2sHdNq83WQOrDe6W1GEfeLH0v5EEe1//I//Ee+q3xtzinA2fvWXv/TzX/i5vLXmISStBYiZt3ZM510iPdbkC8HfpJpmICMAWgzddDg7PCgmg/GwNxz0hv3D0aA/mY64uklyNwxcmlRBJbgKH1DltXorqTXzZqvZ6jQ6a631bruzVmvS9Ly9aLLm/5dWdb60St3KlFrSHE6P6uh7xGG3HojATsSPpE5GlcQcPENSm5X4VOqsT0PPEYiBsgTfXVNcCRbbt7WFPvG5uLTDxPWqDLHMKOtNqDoczHvxjThD4JvsEEbu8w6ONrBLPSEM2sxa/IB7cqxBt1QipvG0LzXQtPYVwkrbcgwQDUnNyjNJK3tlPGHi5wWgBsoWp1uKuixZlGa4qbTULk1gao0KTsF+5BvJAdJI69/8m38DC3it2yYJ+YMffvfipc2/+VOf6Wx06RdXa9ZDy7HMOt/6vjlVFXrszkIXiVlVjstpfzrqj/r3RoP9g91bxbg/HBwMevvjUW82ET+EJhV7LgZH9dSlKWSau7yR5o280Wx0uq1Ot7O23mi221sfqTVb9VbX1TpkATL6DiU0Rcg5j/IBLExd1Jf3/tPHRPytue7iNjExroTDyrEtUnlq4mGnCo6ahfKUtTbU7MW8s9jreYJms7EjtZBiy8gWgHYtbEZWyN/5O38HyhUBR6Ymmxh3CI7+ixdw1IBw7VAI2J+llUk0gy36g4w8ljXvEl2fUSKaHvnXzj3IlNLzfBfxCpnnvOvSpQsCR8aZkRe8Lvm/uFTqEcRb2LewJuIS3aXZwsErwRe+QjjL5XAf1djEqKwxZ9B6P4UGKSOuSPYj58MV8cZT8N3sZBgoLpaGmlSRcQK9/oCn79y9+e1vf+v7b/zg2quv5K267yFWzd3rJA2rRi0YQaP0wPfFHfUng4Nhb7e3e+tg9/awtzMbHc5mvWI8nE4GRTnJkqqecaeSzWI0hyaBLBibeIic4RAX6WycVf1stJuNa41+o+mZdhf2Wp21jc3zaxvbtfa6y9subyZ42RXufBYa5CruoX7oj9anR9YgI6C9MF0c8U5pLRJPv//1iYOjGSa2LS9FfJZmzJPFZbM+mP1EGLUqBASGzgpU4fWzDvmprBG1n5j32I8vBiYqsGgMKpBR7YkJdHCl2Mjq5X18cINorFSUiM8ydDB4IWCxf6jHiLXutLYhLjQ5oWAUe5xvlD7xT/7kTxB950sNrWwxSGiOeBNvUbdPnoHPAJmBuoBYc3/J+iOEz1kBMToHolfcO4I5xElieZilghNeHHpCfYtv1D7BFVGMwRWdwiK0buwSLQXfVU1bzsa1pptO3GH/oD/sARjlitvqkTEJDR3Lyo1uVb3+3u7dw73bhwc7w/07mI3F5LCel2k5dLNx6kYVPSKTopZmYGwz9GhMonVW+dZlKf3gQbqcUGXFv7ScpdU4n6X5nZ5PLvfXt7qb57obW+21c43uZoazn7WSnO4jdQKbGJJpVrvft+1IEDw2wmBtoGwGKiVr2hPm7rxobnWcQoldsFWf94mTCiVjgeXCzqwUGGxzeOYsudi1V3QDcwPfX3kJJoRiwC+S2WgLHveNsiXkPxgZCFXQBhgN8NE6Nx15kJ7iLYTGSKwxMowho/qP/tE/Ak0EQzGwCijhr/3bf/tvEYvGsuMFDOn3vvfdL33pSz/7sz/LCMecPr2dr/jqV7/6n//zfwbv1IwU4ObrqCEjNm+ba7yzSo+at2B5SbKTKNVnP/tZToCtbrUCykw2Xo8z+9u//WUyIQr/E1oBIkkSqsHGqeVwGQp2Jk6AvWp9zQ1GPiNy8fKl9XNbxaKtrTqO+6yMd7CnPtkyG7PpjW59b3d3587t93r7OxiPrsBCn7WzEp86IUnCK5MipErKpAwKjLNFk6zgFi8a5gZsAj3ThG2N70l8d1z2n1lS3B1Pa7PBvcPdG63u+trW+fVzl+rd7e76hayz7WrdLK1VBXZozWNs+UAvtXLhWlerKPngU0v+h1voEC4FQ1608sEjr8eIODFunoT/KDF31tvv//7vkwpkweCjYYn88i//MivHOhm5RedC0ME8rBcSFuUakxOkFzsGGhcLRgANrE+8UdimwNzDPoQBxN6ECqoYIpsN9iBIxHsx01ZnMLcAcGTwoWiohDbE1+6IsYD9KPNNXrbehQXHiwHTW7du83ksWOxBEFP95rk7ltsxSWNgFMjmLURFeD3vQrmA57Efudertr9NNoQPaLv8zW/+AV+qs+W7pBZqzSlP1Giwa+G62Jm4EBhvqTus16ZXrr/8mf/7py5fulYuGuIu+m0z8mM365fDw97ezuHB/vDmnxPqONzfnY0GNFWqJWU9TRr1ZDgbJN4JL4hTBk9c3W1pxRuse5/BKee2XrhvRc7GE7JzJF0wOqvgtidJJ5lUblJM+tNJUox2RsM7h4e3au3Ncxevb56/3ty46rJ1/9keW++3xo0NvLi772p73Bj+FAaxsPWS6O/pUz7zU9gbY872MaApSZ4nxfNUSJGf2B0IAv3u7/4uawDI0xr4WDhsjRmhhIVq6PBiqE4I/UVOEoGUy6cmQaYZOIXnC5pgQ7FbAA0PA0eMGt7IYMqyZuiI8cHapawIgwvk4lsYXhtSZbpwwAFfkJG3SAwVhAWU+UbexetjKquCoWB3IMH5cMdwOL579x5eOYClVlO6rdLx5OTlFnAa+/uHmlyk2fr9oVpuSBFqaeKZ14Y3zclLLwt850tBYd7FZYLdcRvSE9quzIbluhDp4nZwCwaH9xiW1z76iZ/57OeuXn85uW9pwdHBQgMZD2YDH1vcee+tnbv41D+cjAblZFrL4eYAhjPvpo/Sei3DNCSqVAVWjV+CHhsTOD7VvO13ogcB0FJCjgLH0OK88tlmKcIUYx5VfBjQW4zGByS+d8usVcxGPN2st1xTJB14RI2kmsNjGmFitTAQyyMSNA+EL2L70RiRqyGyFwccH8ZSPHK6PEGz2XANFKD6BWRk2bOeWVoQqYBLMjC42EINBaTUuSGOlj7Fsv9VrSrbSI9sVXZ8bIvR4NoZAUCBUnegEJThVyBGMxLXkrAd5FPCCxadlGWn7QqAw4kW8dMaz6uzOwjIr2LvWxxNbB77nJiQiMmpG+Ei/oB+FaoGGK1C5aj/BMAOExXQlGiTRgYEUQdzTliGnkSjeStXzOuBYG46NIkl8rDxjax7Jadt/UX74ThpZFy6sww4MiucKrejt3tYpdn6xsb5y5frOaFALLsSexD2YuZGrjo8uPfWjR9999ZbfzUZHjTwsif3gCQYcSmARnolI8MCglQ4xKzutJo7ruUcl9IJeOSdZ4zJrKhKktxF6IgMe83Pdpdkge5ZkqDxkMfrxpUH2cCjJCedpLyFT9+78+bgsLdze+fC1Y9euPy6I1DKV8xKXpT4RI3PX8vsXfKpI+Ox/OC48VSqeF98ZWyLhfFT+ChNcpUoydiJGbnPyHEM731pg3XH8r90aUagIdGhphSTcBheMA6gm8XFDbZs9NQyF/PKLdiIFruQ6Hq8kehzeJlajVfRYbvg0pnr7WCfumKMx1NzptxCqSUmu+mugXr4pLjPNCABQ7US+eBeb0A4BcTHFl5SD9H3qis0CaU//uM/1YcLpBiE04moxB6Vamr18/L2K4UroWDDxS595qTwsJiUION0enfv1o923vvh3u03ZuPbeTX0+RPvOxvQJHKTS28wBnvQY2IWyDqp8DGv9cFE7Msi8UFGvjPNQ66HENOUpNCUxLW/5+k0ARQLQJE/l2mIWSbec8ZP92A5Gx2MiipsSTUY4dvnxlnnnINJ7lk+/pXeKgxfmkT4WD5X2sIvLDgaVQorQPF1mQnyYoh/WwW3e7Bc4dlxh1cl5pdyER+kgNKU8rhAoAqrGSV2NXc0IBNRnyAguYgjhTL5BGEN5ptbKLnplaSqlUyIm7jre/k6wNSMsph7v0R1tGsUPIUP7xtX0YWsN5+zmh9T7S0eOpUF/f47bu47+ggY7rxEX5RMdw8yNJNAtP6FX/iFGzfeYzTEKyJbTbCFjzo158AYmkJGH9MIWlHzNEXhGmmR8j+86XL/4PYPb/zoL3Zv/bAY7CSzPpTDanZUwrDyRqQn6GBC+p85RqKnbwdcypLDosRFBRezWmO92epSHOOtyGI6GvTGo8PMTXMPuIz1BAuyon7mvvcdYpUe72bVdMDH9KduMpwOe73JoHfpysv55jmXbAeo5auzZO5fP4CPD57qo1F/zsDxSeKjiB3kGXbDwRpg6hPAwmTQGlDh2jPYPDdGwKXTs6IR86yPh0iDLbXuwWyMTTzei/H1N8PBLmKaUXGAHFYNWEPA0YxNUwUGm4BUaRXH2xLfyGiTJDE1UzsfvGBZqaunKp5ALGwsQ1aByNhtt7dLA5Sfb731Dtls/HHCjoSveQtJeX5yhnFlpJ0JEwPhpTt3dsBQ3HAwFAIQz8BYOB3PILbTo03Rg7vPhhTEeQqfQQEZp7s7N/7yzns/2L/1o2nvjrcZkzE5awjDSdaNbnyYDIl3r6tQrOeBMjG3OtgBZKazRq3Rbq1tr69fbK1t5bUW8UdY4oP+/qC3Mxntl7ODYnzo8TV102rBIUpklvOLT3tTyIFhOSv74z64Oq6KcVINzo0uNi59ymH0+hBkiGqG6sZCFMjn7XhhwdEEfjAryE2zEljeVLBiHbAGCPGoctEcvWf2QmJYMbNxqfHbMb3DzDbB+CJJTWARiIwXJy8g9orZyMhYLsXAUQFZ7C+ARvTGOEAOmDKwMsyXLEeZ6qCqVQQuQD/Bcuctqy30FFLEjA33bjkdpM5rsfGor8PMVG/eeNvgJ7j8xhtvYBXCNIplSmzQQEN4Qv/0n/5TQJ+NE6uNEYBQaTnxU7izS06Av1l5pkLBzPvEIOPI9e/s77z59ve/099/d3J4JysGtWyWkZzx0cLScwyrhUcd6IvhRxmQEcLizCkj4ymRof0cfkJ7fWvr0tb56xvbL2XtLZc2gys+m44OBoe3e/s3D3bfOiyq2QQOUFLOh6v0oUx9tK8f9BDJTMkdIclROZn1did33WDce+9q5yWqD12r7U3Vcn7j/fuS1C371Okz3oDoBbccmXxYiH/37/5dVgirRU4WIXzIfZqRS21jn50DG21JgCM2J5eqho8hx5rFBCaiVkk2NjbxZDZ+KhwAllIccZ5Ev4Id2Jv8NLdUch6gEoAiH3kpWClwxLOO4wOhH0bOLZDCyKq3u2Q5hrd4HxlkFMUqDjtawpfTwDykmoNsjEHkcDgiMw7wKQiwyutmAIHUVqtDXFLkJNULuaehgmPXpXBdQCGuZeiGu7s3f3Drxv85uPVWMd5LJr00mRGI9BIPjmq+xoREcjX3pT1lx1MNg/ObBJkH71+HNtCqiOZ1rSut7UubL/3Y9sWPuM5Fl3ZdEnIpWVIrBhtb9xp7b1V5szetRsQ+Z8M6lMvA9vFQl/ianMBmTMti6tMzGQkYqmtmxXTS2xuNh3dqWzfOXbjYqvGHJABiGeKSD8m/PNv25AsLjtqHtSRAQxZk/IyMpmekP/qRhxCHhU0mBJMNlMGkwiFVCBUzJ66He99cHm+HckiOXmajDZEsazYPLCYhqSrwzD7l88E4zEasMAUcbTGrZB6XVrldU6YwMxDEAdGsv4WhLSevpIcMYbNSlTWKUyL8hYUFBsbpI/dg7R3fC0BzFWx47713Cw1A6s3kX5Nbl2fNBhmrx8d1u+LxWGRWpWynoBu4apzOU08+h4JhOEvdsBrd27v95s13fnD35hvFqAfPsO7zHc7nSUImGdPNi+u4cl5KWFWGQkn4WXkhn3mtoPzr2tYrzYvXu5dedxvoBrQnU7YNnwvifmfpOiKLzXp7PckPZgXGI7nzLBkHGw/DMwsJmXmyJZB+ELnwWZcsgDGm57g4fOtH3yci8BLzsxPqrT1tvVzkr49w8M7A8el4o6aLJTNHcjvYIBZkjOVbnsFiGBAN2wdH+Dvf+Q5BMSAe//fnfu7n5H4K34Vix4Oj5CnhNqpeEOgR8RAgANcAOMxqucZmOcbRQ95CREJ8HSPMiydPtJEIncDRao2Ed8pWy/teAgWViy0pUAmtlK0O5ryzhIxPDYRe5EaHlM1rwMppUK4DOIKGs5lV3VTAIm41Zy6Npfii7IFxM+3EzLI+BVPRNuz7QkSZC2kUstCTQf/g3t137965ebh7t1P3iJ97WTGfwYaDw0s8UIWwkDDR24aJ5/SEJHc5d64T5ZrnSFTfuNzauFJbv+IaG8N+7bBPUifJvaKFa9VT1CbSTtIuR53evfrhfm88K8qp/ONUg+e3Kv+12OmBmDwLX5/JSGQQb717gy1869z5Tq0RpHzIqOfPW5r6WQXHOBsbI5d+ylKwXVfcvaUA3JJbqtdr3svDsmUZw2K5OGKChRILkpvkjVYJy+Ol2nDTE3xS48C38F3kT/7Fv/gX4JqqhsFHYO6f/bN/xleLjhfTp2PbzVY748AQQfakJEYKo3Ih9XrsPir5SMXwmPigWC9K3Zp/CsQAzaCM2nq4wH/iNfjj6g1pgxnDNC9Wp3IZpNaLnMeiUsbcRn2jMj/SjuObw0V5e67b9QxtLoGfEkW2aJ0umcecBrU6BFWxHMO7yMWlnDkDSJIdu9KmlvnsUf1opSiCbK4sS55oLKy8v9DuJ2dn4ZdZCMj5xLHzpJz5q0OuelYM7uze+PadN7413n+nXUPHrMAsZBBnnCwgmdfBLFC8luwVFP95gjhEbszHPKlqeNH8kkpXItxFH5n03EaEGavm2kZa23ZlpzU76L33p5M734Y6BcFt65WfSKtPzbLtKru2dbHo7d8e7L9dDbxb7inhQcgxuO0uLMSwCWVhm/EmvrI17mLzB/2bt9/N3nvlYz9Vv/B6WTR4YVrLzVD0RPFElm0Y7WcYNJ85cDS7IOaEi8Ji/pptvOZ/xfaOlnSMU7Y5K3+dLIRAZHqwhIimiZHHKtUyZt3y4TJkcMpUaOFWCsAtf2pL/YndmDynhANH+H/8j/+hYB9fDToAlNhxpEEkIr/UTDFWONefOCveTqkc0UY89DhtwieAGgCcMNGaUhjI6mWMDz61lBHiqwan1NniyAidzEZDIlPfwYJjPPWNtsmJ0S1S0cVwMPaGp+B7NxzW2zOOvepDoDpiAnOzBgPlbThJXwLHtTNcYK6I4h9EufIkzcXYnSyWjKl0YV/BJXSzYe/g3sH+7mg8wEvN8uQ+cs7xsxTaYsb52sBUdOtExqi434nXJXuAgw26UQKGoehHgAQM+en93d07t3p5D/uusXVvvdvLuhu1OgiKruNaq92ZDPe9t54J+sqAbWWyEK6YI93iQeKdD1hH2eH+HmWfF1uXat01nzyvFpf+XCWtn1G3OhYlNdeMXDMmDHkVfmWN4WNigxwZPtcaMOPOsi4yFrTGDsIBXlD4AXCIpwJEKralOkJ+AgEUdRGSY0mDBZhLsbyrKvMeFkX6kBY010vIjOXtFkUp2GJS0IhLG+3SzFp0kawv78KeoiAay2vJxOOKqFpDftkMT31sLJPDA2xVqvEwVC2zr6gckT7w6GHgyJO46lIAs3ChtO/5XvEi47yZzoF3mQpDgMv5hfA5KuKOaUxLYUdQ3tiOwkedPDeXcQMcLdS4lNhxTw0p5/ZqtUDJgIxTb0Dv79y56R3qUf+w5o3CKqRB3FH+aZCkWKQ9QplMIlM4lEmHaKDP0wS3Pc263fVms43pWUF3LIfjSe+wd2/k9iA+Zus30w3w8aLL6/Uu7Uw2D7pbu/duhLSOqrOB3VK2MA9KS7M5mYG6HFLoE+p4kvferrcvXuic5+SJPdc9mzLcl+QMHD9EoNpCQloJLBIChZhR6lKGIaAwE1xF5GSINMV8iJggEmvim7PJi8FEKM2ABfbU/wkHyIjbaGEyYYdMMxbzK4sDHGEFEmUTH9CyFvE3Pqk6Jz6K9QwosA2Ivi78UvYghr84MxOLPliiGdY33qXSKYCaiIfYaGSo0TsgY6uqZ8vD2P4kqUQAGiagdYDTx3IahPkYiqVaHcu68DzWHF+B8cvb9Sf2G97F87JSTfAxjkIy4PjImMa4w3wpzzAC7E88afWIpjRuxiNjRdIZiHz77TkVXKcDLPLtbIF8qZwGiz+c5l6/Ampp5HGnVlcXwGU46+/t3Xlr5+abg727yHqneZGWIUlscom+atp/Zsgi+24HnnQja9HDVhqoNh5Rw6/Bm/cA6YKqdDvP6v6VaZlmRUKfhQSfAK+6Oji80xnsdSumR4ssC6Zjs7Ue9HVDticAosc+Nw9rhqvyjnbAuzR43Gkd5z3LUR0/uHd7f+Pd7QvXsvW278fg6jI3DRxD/cwZleexsngW/tfm/5WvfIUVzkRnkfM8xgWLh2VDDywrlY3l+GOCtHV0w4RhtcNoQceFWhHoKax8TFG3qCTR+hQ08GJ+4pGxtEiJ8I28ETShKBtcFllPCzXO8D5Btxp6CpRMYAIcB7yUAEFwEEiKYcJK92zEdOYKEYL7GjcXdbzkT2wqJKkpCHEPljbH4ChsZYi4BXqj+aS8HbQ6RtqLr2bE2L34arR8GHZCEzyDmBi+fEwaj4UaeZ5NiHvKXabBGSfPVfMMbeoAPsPfeA+Q8c4zbCR8MhdLQ1+9kFdpWyWvRQnQEibGGuYnjIwPez49wucu9nt7N+6+96ODnRvF9LCVurpXs5l5zPO6jB7nSh929Lffg5SnH86jmYsgVCl8JJvs9Wi9jsScS0+T+GmRz4o099K54xIchKfoyxMnOeTJSX80PpwVw4bjtqZZ3nJZO12ALrTKyoNymcmS1AgHqreH3Xma3Ac/82SGnToaHOzvvHt4993NGtys9RBmzd0HFwo/A8cjF5UcRqay0rVoXiGUADCBZUoIsBJYrkxuuNyscFkER4YvLVgpn5Gl/rWvfY1PAxylFmNSWmaoxmE1YYG8QjCUvCfGJlDFgv/7f//vK69q/uyTXWmyHEmVIGVIwppFzk4ALFLxBioJEcw3jEXO40w9yC5zW6pcStzL7sMWo3EwyGuRQTN74wvhE6zKxUUV0AAWcBMHdpcuX8IWfAUP2EuUcgG/PvrR19V8IhaLW7JJ2YF4MVYn90idzfkc3iu18CWA0zMYv2xXYD2jNBzesQ8kOYOXwCDQ5S4mV7qjSo9O1wqIQPH+47I8vH1w5829229NB3vNdNZAawe+TOkZOdU845w8kOpJM7nOSbIwK337hDJUxpTeEXZ5yJUU3qKDdVOhokOCnpEHHCfgYwo4plWtnk2K0WTam5akqKe5p+C0nOfj+FDiA6HtVDHNhVpjCDfKfvTG4GykwYVE1N+9dfvGDxqttdZ5cgP11f3gzK1+ZIqD/FNoGRh3oBjgSNQMhNJ6U05ZAThsupgsEnt2hlZmM2J+YoyQ/MWPxppQHkDMPrM0jVltsc5Yb4242344sGhYwwTsWI2SDHjiMUcZhpRw/JN/8k+wtkAovoiVj2uP/WU5q5j+vbTUpWWJV4uJbYAlVAVHsEAJpMq6jC1uC6cKvPC+wRQu1gpUFGp4LRzH+KfKlfFeDG2uQtl8vhcKiHWzsZyYiUHoMZ/P2GI1k4ASLVy1nkrR6NpjjqROng9n28CkZQ8rivuLmV8BR6LVBKlj4aVTSstU6dwRXnjW1VJmojKk8yo2vZ239+++NTq8lbthu4ZZ6KVzgvmW3GcYJaWVOkvcUlM+4FgZEMhL74Rsdhb+HzQkUg+JadLJs45/3ufkp/zz7bUA08QN6FBI28JyFkaGQEeXuHGA0dLPC0/iCVmXyieBqhjm5vgYzsg72xOv7oMH09/ZvfkGxfet9S2aK4RuYOnRCaozcPwgh2gfahuNFunv/d7vkX9giVqfbwnDyEnkebP44rm+JNAAMvKBwMSXv/xlUhNa51pslmTAPGE984GyhtRWQdXBPLB+rVpsgDUC1zzPuiVRYMSXY8r4HvUQXYbPx+wCJjgB9SbT6VnPUiF43HnCd5gLBeNsHsAiyl2csFmXKs7DJiV4amEBxsEgXvL0hqQS6QCUARfbAIA8QniYcktiPEubHOPDx3IJyhSLd+V1XyL0NEzkYiUlqVgkf+VdoCQPBN+yec2JFlXLvovr5fVqbBkQcLIwReeF4dxHDYttJ08jZ11WC2+ymhfVGb+nDGXU5ejg5ujgdjk+bGXTelaVU9qrztKajzom86CiALcUKvk8ibcPZTmWSUglB7QsPCj6lyHg6M268C8rZw2y34EJCWMDNBx6dbPM51fo3cp/VSUQriVZO8G/TsJ2wqdVs1KBRwR0wzaaxGoSi7x1HZrBZJZVJNOyYko6/FZ/77Yb7rv2pu8dG9JHz0vi+pkDR1mF8Fd+67d+C3xUbtoAUUw9dXfC7cIrVMJ61W6yXnQ8JtmCuD/d3SRJrWQrS4vlqr4x2FAYHawrsUwACBXz8kpcWixNuCx8tSmtgjtArVbX5z//eT7BLSqRn+BQGHyIG7i0hSw90OvjbANXgf45OC7IlvgCj4E2egFjzQmMQFttEhorxSUFT7ren/7pn/7N3/zN3/md3+GqGRNif3j6X/jCF5TNP+b8VcajYKhUZwLgpnE3auurZSK7MYVLI6ArsiuNnXEr6RH4ch+5Li55PAYH56xMsk14GERCuE1WnKPROI3kzBwB09h4DBfuC0zqtQgZC1LT9+7dfjMpep0GcmPTYkK31WlQ0K7E1AkItMiABbHaCWK0IU3tGY0+We2z0OoPncLTnlbU9lVZjc7UBRSeerPV2AZsvaJtUtG1lURyA2+7HGWkqNMMcs+g39s4H+qhy7zd2r6bdiBxEJ3IcuQlPYQGziO5lHG4T6UH/CB0IbQbTsbZ/IKn5NmHg93d22/du3hte/Oyv3Z/E9Ni0UxB9ugZOH7g8HWakgFA9Z4oPiZPHEC0JpzgFz4d7GUCcMeArIxKTB6AjFAjobegpH+/KoMPIWNA1JLUB+tKrQLkaVpJBv4d9hcMaiKVBD2tjRQfS+xfBgsmGJbUE/esH+nQardLA9zBCPJIaitmeX9+sg0Q1IvJhksyw0ttGsEUNgDQmUAHn0a0EZccDJJte4z6oXnoMQCZqWt6kY93vUsMfBmPJoSxu7tPGIZbwSbIN+J8WDcI7WGr3saJ4+O8GcwcH7nu+/1fyxnY5UpSGLfH6GxPe4jugFi1kNCdBWZhKEFRLtrnhRe1McF99TV9vudLmc587wNA1/dIrfuKlTRHGHJa5ePJDDGeztZF5Bc9vDIjZkjpjEoaWftGMZwWxVGN3AvhFgHHUcBo5rVuvX1u5mjAMKRnjde5SNB5nLG/Zd6iLAIwepe99J2sw06YBg1xvrkq0OidEhQY9wYHd7dnQ5c15qMwjyyUSXWWrX7Eg0VI3kPIaMUV5iljuRCeB9SIxB3TV1qLh8WM3admUlKxNpMETgn6VORVEDRjOS1JIVgwi68jKwKMEsziQ0BYYo7KeGCQ0tqJ9UYwC4TF8HyK4BhrMXAwegQQqBc0o1sOKaYTyAi64SnLFot3C43wktgPg8Nb2DzYD3iGjYQxsaYLx+9zonbHtPOZd9wqQ7SYe/iom+jSbqQKIs6T28H+Woa6DaXLGA1sfzYMBSJ4Utd+GpyeZcnCSpRACWpU6vRMqyzSyNPeDvLaB/dojoW6Leo8WWhZ5Zk6SdCsdSFmd7+5gfd/Z16bx6uFl3i+4RM9FRGXKQ/5bChVrjkuXW9a1LK15vqlTKUuWJyzHrBVTUf47jn63kh/ZyRtZiAm7nBaa8FlI3C1deEj9T6KLahATvy7ivGM7tizQeEzQXxU4U8IPA1X4qM3vpOM9/SDbI8ntE/Qzrh789rw0HXXHtB1rJxLkjNwfDS3WuLSohlqgYkhLOU+FjZunWyf48GC97IqYPnhpAsZFXLiw+F80APvi1/8IilXYFE+nTx6o/IYVVgtPvgJKOBdAjqEsYJ5sst641eMKf4kbYunlQC1qsrQV6DP7oLpjTupcmkTKCNCCtZzwia1EGPTEkIZVxTrWJevuGfsOB9/CyxEGHedjHlXS9n2R4OdlQZMEqwlGMqOxT3i+sQ04K+Y/6LTx3vJKe9k1UNLjLEhx9PJwd2dt5NxPwg8eDKOBmlOF1eD6dAmKzBnSintlKG0L1RupSHW6H3vzHfIqrmsVpQ1uDtjBD3am531lxprV72ODkqMeBGTw9Fwj85ZjcS1KB4dFxnRxynRJKrF9rDC8flpwVl72ce7B0MoPtTqILN04BvADnbobliUQeMRJXHfQLbQWQR9On+lxCVrWfDsx8O93dv93kGnc2kx+JF4+Rk4PpIFhI3G/s9Pk5BRnxDynth6wCJ2HGv1fWFIUjSYeyCFxGAwJFnb6CxgMP7Gb/wGuQ4X2CpmjMiUsNStUaxZbCSmeW9oAz8AcLHI9CtGCn2aYIqsKvKf8qEQIUDAuLEfWM8/BRx5XkK/8J84TwZntWmPANRsSX0aI0CE13qfqQ/aqpza0iGPWzwBo+DoGVOmMNx8PJCKGy0ojsknY9hiOS44STwf8hVV9U44SG1ZlWRcUHSyluM8+yD+SymwK0Of1fCCInjIhLnv9vs7HafinyAzXHj2dUiDYKWhnehtNSnhBlp1IGPnoc+HmgZ6p7oIAcB8OJg1G82iakxpgdFlMV258NIrbZR4vHwFXnRvNNwZDe7S4TopfflKkbs+mbnRfu/wVrd/ca17zmXderdW3/jxznSMdhm5obIY9AY7ezvv7u+2d+68DRFoOgt30ENiWQUWyRR3HrPX3xvwMfVtcIhZDvv7ezuNc6/mjTgVU7jqDBwfERzZ+fGaCRJB5QHORB4GGf/23/7bYBD32SjQxx/YTbAjyaiEVk11rSWoghiev/7rvw5EuohtZ5qsS5WLIn9ICAf4+5Vf+RUpv0IGkqYLH47LBlkEz/oUWnoebzzqijgfwqyc5NILsLthU2M2yoJbah1uBqY7ivNobqz6VVk65WGeKQNOhFd1mbIxgS3GPMg6uCXS/ocMJhisc9rw5CUxyQRRfy6cAfIz+BCEjAmJMAHsXadnOd4POzplI4LLv8AINh3kEPfvYDymobRFc4+7Ehp109MqUfFLMCGVt17Uuc+8IlgVZHiqQGDzhTMwEAqAqJ3W1upZd/PCqxeuvb5x8Wre2QgXjCF4a2/3HfotlrN+QmafnI0PFpZUEx4c3K7fe6fb2ep0a3Tocummo0QnYXVMkS/bGq/XG412t0UNzGC/9PteOc3SEBuAH45EbuY7MHg5M7A6q7xnnVW0dqUl7+a1cd4py2rRNiEELM/A8dEO7BpwEGuRkl4WmFT1eQbQ5LGCYsZxO8asACPImeBQG8EFkAXCUP2CLSj6iFlPMTSYVaKIGG+0tCn4SKKWZQYriOyt8jM8IPXBk8fEQE989S2KZHAeScUQbVSdjCxB6WgQXSX1LAbPMTIZCsyJyiPzyho0ardYLRlcPRgTAg7UNYGPUpTAaP3VX/3VV165ro6sqtF+7H7E5lBb7FKXz9WRQSItQ/+DSEbXl/rA3me/BDpjuD8NWHTLYcewG3nkCZXKBdmYYf9gd+cmlptdndf4hmJDlR9eMtZjqg5ZaZTV8eoVtUY3PKyCPljQyvUqFLU8gUR1PqtvNToXNy+92tlCo2zNpXg2s2H/3ns337h5+0383U5Oa0NOY0rZde7DhZN+b2d6843Uta6eL+uuXWRXkL2AlgPGZfXcNbudc5fanfqQJEs12R31SLioujAoPFY+PBr++c6GVZHhjGEjJz4venU8aIcgaV3zB/TPz/QcH/FgBeIZAWQ416APWg8SxZGXZ06f8p4PW+S4vYSZWA/YnkCq8hJYnSxRkZ8lsmBrPjYYY3kbJYIsBQxwE6/8pV/6JVx1nGvgVdRLVc6A4MeH4U7ap+ZMsLjJQWE2Wl2QW2jhqELZBLTjwJ8hRZz1lqNqocm4olk0w2MQFlOabBVMVWqc9CEw0hn/ixd/lV818nELrUfFR3u9jFy7WZw5qTasY3aI6XS2sKkRNBowJoCjMc9jKfWnsZnNEdPPZ0JAYyqR9n3JSuk7tNwnt4MtRYiuPqS85ML5S57aTfqmHuQeMR0SL8Ndy7p5baPeOF/ffMltsx/UPd0bn3ey19u/d/fujb2d2/XZqF5Lm0hEMknKwvsDWTka9w7v3kqqbjKj7m+9bPA52IJQeWaddtpa47NbZKq3z10Y9nYOdiGHZdK+DYq5ACFQ+sCd1crqDw59Cb837pNKogRlmZyJ3T5qQsbqfNn/l7KTcZjsmK4pWskAFmajlL7MryTqZOVr8rVFP5a4A5E4dUoBkSXxIK0HAYSWNEYQ1gcrEK9frEkXCsAJ8/3ar/3a+4KjJXD5Fr4OwAX6pRfLr6a9+qh2jbXEwVgGmDSA+i4O3El2BdJKKjGKa4dWP8etNAWMw6/2svg1SqPZpTHgDAgNsvleDTWvh47OEH3mM5/mTNyCiKoGBh8GpOJpwGPuCNMGzwCOJ+AYvFd1ps0JQGPds4HJdjaFkccIdLqI0vAwXaLFgA49+RkBb5gtwJbXFpvS9wE4m3kZWAC64Xq7o5u3Gr1752cHKWlrmIAAXt6cefI14cZZzUcJB3VMyKRZZGtldqG2fn3j/Kvd7avT7VfBwyxY9n66eoyq08k1dTS1xsciLZN6NlA5SqejctC73f/jd3/0vb03v9se39lsTJpuPCpHUzzfNHe1Rn1WbgyHONHd6XC681cHlTvI0/Nbm1RLk9M5/9pnXP7a1K1n7Y9M2t31i9t3b/TS4V+ttcbELkvqGPOsSznPFEMTucn6eEpZztTVe7WEXPxkcvu72fqFbvMVuJtYtwV9XLNJdgaOj2ERfMgDGwFLHugxmWVwgYCUqfiYU2b0Drx4zA0sHRda02FnkYSx0JtZOqxnWI0gLADKUlSOmy/iG0GEh+XQY/00PoRwAbRkNQIU2vKBWLhHdkb9IIfKP7DOSEABQ/9/e2f6W0mWlvkTEXfz9Z5OO7MqM6urC+hlYIBBSCOBCgnR3bSgQUwjti+t+VP4P/jIB9QghBAIWjSNxAACxIcWM60RA90NTWctuXr33SPmd85z4/XxtfPaDmdVOjPjKOVyXduxnIjznHd53uflkjisqWdzweRhCLcpifQRPTWDCVAeO5q8kJJdfDgKQwIWcR1R3PrquVwJk0CyjvvlQWBES/iWrY04AUhNpJi3QttetTPOBGerz1iZs7XDGtqeOUj8+p3Vv2ygSvvGxs2tu/eW12/3u+veVkuDuMTEqyuFBoYI3ma+VVcjMM+LkRvtDY7g8B98//vf2X704aC3nyWSyB975g1ijq3FwwHBQVJnHcC21x/29ntEDreTYnS4D+512iuN9nvr2UZjfZVIpN/FuwvUlPW9kK3PL/mLL5JnFb7A+xqOvCXRcFMOeJBYq6k8LwIciTER9rJMtAt1vqADqKdTWO5VJg+hsa9+9at4giQQ+AWyBySFiJERo4zj90pBALJwYvBVWe36Ec47Z1SN3dkvd4h7Ch+5MGwozgUcS4qGah8I7STiVRBZIYUqKg9hVhJQqhc0W5ujgYzvvvuuLPGPIj8745sz7ewxzIby1JphgWYsgjvj2j+vKwEccavZbHg60CqtAp1nxFPGmWAezEGpcPy437S2PXkh1TAyhBBzHcTNduRLyhy3T2IQ5IBsTeSxvdC9uXV7+Y27rrXSSaVWNvZGJj/0NmbuC6zHQ2+eDSduOBge7kAvh21INd+jR98G9pr4zFlwXyiqJtjY8FzIAX+KOEXWIkk+6g8h9lA802gVR7RTgPw9yCfv/WfevX1r7S0ujA2mOVrmdR03mj6fzrUloYdNkk8Do9MElLo1+A0KS8Jn86QargyTqxMyL2JI1jsWr+ZVIMkjnf3YbxWVkmUDYJHdFq0Sgjc/IrxIflyuaIwpquczWTMtP/5wvlFmZSr443/wB3/wjW98Q9LcDOwssBtExluvZpJwcK4ZtGXxK5uvEnIumy0BiOdGxMh57uAYQ5uwg5nHszaKpeHmDNXJ8OU5gqOaVXDL4CNZMsSLA0OLmKwHIMLQmJPUlccqn5c6/umncy6r6SLm6HG/nWTa0/T4yXo6YzIcE5qgOwI1LK2FpdWl1Ruu1fUw1NtzlKsXfZTHUDbLoWoXPvU87PXHUGjg3hzScHXn4ODpweH2aHBYTIbtfNTOigXSIglhBzLMmJ3Z0TBPGgtoUvC/fnV4zZHuImygxrh/gOVIHU2Oavjy/v6WVEJ8BU2n3eoc4I/nQVo3SUtpjDPonLwXoQxxFGWorzvR8ZUFR+VbTftaoCCRsVidzIp/sbnAR8lb8Am2D2kNMAv4U0BQgXyZPGpQpUzOTGJhzvXIuCMgSDiMeBwunolH4GLj0YNu2Dtxk5yLD66Na8ZmVAcxtf2TnjZEd5LU0kM0MZvnm4uYOSBnJ84gp95sImXMlaq2a37uTQtkJCqbx35DO16LabJ5gYySBBVjv4KRrr0z1mM+J+Z4kdkrqw+OmUklcgQ523SqHJF6Q4+GLEmjnbY6vu1Mf5IOd4/2dnb3Ho+He5NJL5/0YfXgT4+H3kwb9A+Gg0OEGlFpJBNNpXa3aNIhoUElzDj3xYZFQr9Dzj2mz2ujC6WH/6XN5cbq6mKrg58+PnrAwRo+14Lx2ANwQ+uFoE+WNbOWVz/z3CFM21R1geqmkE9N3iRXUbnqOHIvTDnNRwWreJLU4PhCwFFr0oi+eqeVjT1t9ZgGon0irUazF6SYqyUR91CexrSib+aYjXiaVHlTzkg8TiAosOZSMbVmZBMve8tgAakGyeHYSiYwCtc9EAyzON38UQyjE3EBUsHRLFnRkTTQrBXMR1GmoocL9mH1w3l48MD3IxS5kidA2JENjy1EzVorWHxxeaV2ROOfX3q6TK2sBMc0yI/N7BUqo240WxTDYN5hFrqsVaSIerTQ3XY7u7uP73/4/veI67iiF/6NfbfWCZoTHoxoWoBRiWJc4SW+J+1k1XmDMchTQLFJEIzE4muMJoQ+PPWQ/iC3br/5iTtvYlA8fvQgOUTb0YWEdO6LdibeQ+JHqd/XvNftAjgGt5qynFCXXWSG7WVFOe46ceeQvYQsoWpDX/udp9cYHdNXFRzViNVFdRQ8VPl6Mx2a9MuACGtJBgWPkG+gVfKJHcQo1qLvKBUTJ09mem+dvh7wAkENkBHnF/hQFFKVKqrPA9oEYRU8a1m4mEskkUg6YaBxC9wUkVMUOnAz5eQaj+e5e9Y2D8wMppmAXjEHQaS6lXGRceWie97qD3oE+O/Yy6FtbKe8wum1iZceM7Qu61bzhzxKS/dVE4Evyo597iR7zJVJCu9cRxxpf14/a0hJYDk2fbGerwREf+ygf/h0b+f9ve33e4ePx/2dSX971Hs86e8Uoz3qbtzkKJkgjT4ovAoEbaoHrYQ666k6BAT0IvNc8aLRTVvdxZXVrdtvElKngxL6Onv7hzSBbdHt0GPjpOk7VBM/Ckku5NBQUsuaoeU1+J0JH8NcF2dtnHmolRqGrttT7YnCTa41hryq4ChxKgGQTDPwiExIHIWM/TtCcvie/BVuF+8NEStQhk/MgTJdLGmV48MqyWDgy+KfE5Xn1yBmk4QhlQx2xPAkaCbgKHOmWotXaS/CkqFmnBPhs3MvfKJoI+DLSUVheb5N6w3KDR9ZA6GuOXdRIyBdoelRGjh+FExDMYfETACLj4764TUYCxxJ6BO+UDy6QkUTSR4ixQR2eUzEnZUWlzjbpc3GY3gsK9yfYUdhPFK7Ny4a5JWbrU6jhUZ3E6I1NmvWhseT+4CjQ3YMCg8GYyAtQln0Z/B2Z+K5Pi2/LYJtO3vo9ECJpMXrKE8nGKIcKm0vLi92F5Z4D2+u32i3GttPnrx3//uPPvyg3dzjNP6Xh0nWWi5lljwBy2eIMn9J3gRVy4bcJWdu6yEhMxoHy3EagEqueTbm1QRH2SksQkwn1VNLx5BPWBjgIxhhBRUKe6nx02/8xm9gbqiBF1AF0ECXi9lwUpxlSRDXfxyG/pzjSL2CxRZHM2MEwY8mP0C0EfqOpBIFsnLzyVZTNs56riwKKeuDkCV3QfyU1DkH53pARtF3uGutQDt+3CPMtNMlDCwiFJ9gfDEVIuEb+UmAONMu3EJmTDuGlVr92OxpK+JQ/NQYprEAeKxPHEv5xqa07UPzjWsdhMcBp5Wy9ydPthUCCf1aPYmKx6eWW5eKMDKHoCopO8TrMD+ZKOx0io4Qx2SW5ki3nf2WKl9bnPDWw3SlRohJpx2pvAU5LQTypYRu5H1w/dw3QRiNUaUjgoF0Y5/CFFztwgvdYuvxcjZ8b+kMqUZii5PxZLjWXhh7GTT44q0gZItv3u10V24Hg7Gztup6hw/fv//ogw8O93ZDAAR7k1YNXqOHh+FbNox9Jbef0MFUF9mLJbcb49BZO3n2+4k575Wc+v3mYrvwBiSx0axyiVQNjtUHTjFvP6vaeoqKmUyaRX2orbpGwURebkxFCDqWx8ToEIpZOkU6uC5wcZS9McuIXwZe2XjP7BPL4PdZVKCzAMi0D4AJ8AvPF4K6iQNVCyO4sikgFpMwV/qy8vtmGJSxM6vvFfbC5YQpSfEPmwR/Qrkk7a7wzZmxmWYvZ3rEisHNUAU0mMz5BEMDaPNSjZFqLX0uogJpzATAizQURnRgFCXqncC2IZoRb8i5FnEcYeSOmBz4XpClwFZ2Sr4hvYZ5HhptXx4c3XG8+1iAY3ZG82d876b9ZBKf1Ajl1VPSTLDICJEjetYmpoe8dzNprS6tpa02L15n+MF+z7+Ak6I1ytoZjaVXbm5QZ7O51Wk33cEhXQN3Hj88OtgZDHs8SWR1SirRtClrEjz6IK1bhMZfU8X1dE6ptNfW5W+ace2pCzVo19l6fGXBUflKtnTeY61G3mbWCcueBEVs4gmh+AZow66ZMUAs62LxflYXCCs9C0McopNYfzN63bFNR+0aMjlcg1LJVlwM545a7y984QtWl12N+hc382O5ztg+M2wbd6qNre4R0MfUogMErCb2Ev6QZY8NyFfoL6dVfM68WYVl2ZNmEjXAK/MTh+fiq5IRGqOtYN0UgC4eijXaEE+fjVDzHIwgXzDDhUn4dn7sQqeLZTikMAKpgEoboIfP9/YOxC1Vb8Xqgf8gBxXu8RhNjmfJO6vHtMG0KPtFF0EbLAnAFfxx63oa+NhwbVpFaH+KPPTy2hur6xv82vBJc7KzP9gfjrAN2otLyxtbb77x5q3b6WLH7W/vPfzgww/ubz99OKBwRo6/XDH1dCjS49R84tsRytRt+A/hIeVupvvqye0g9ILvpghiTHmOyTXPebyyCRleNawejEEZiUoNEypSe3u9kf0wtEgk6mVVulqN1mRGKWD+VzJo2IBqdqo9H7xTYeLpWJ7F2rFWgGnDWemN8w1mIwVtahxq+e4KXkZs4xhccrWmoHMajwyMjI8C7gOOFCBiYnOzgDjbCY4kGSSFbk8HDWIOk/nC6sAzc4XqCTM/d2G5GuubZttS7L/PR2dLgovWKg9ApYT8hAJf7o609TCMi6SY9KT4X/4qFIzmYZvM5I7wWGOlyEulqkP3g6mxPH0cxRmQASD6f55PaPjovwlY1LCuflMzzKtw55KD5MBNEsq0vi7SxaXV9Ttvbd759O23f3jz7qdWNz9x8/YP3PvkZ+/c+YF0cQ2lnqMnjx+9d3/7wfuDw31I5NRTN7Lj/mW+OUKDavq2z1CHi8K/DjHEyTRmUfheECWsp2WjRH1NfIodbMQ3mkZIXgLweWUtRwZJFYKGaL4CZKIoYjWQD0FQhwVDtMhkxhURm3HZ4sSuRBb4ZYD162GwKqw7Cv47bQPwZ88ER/sqMrmQsRkGDBs0fsSzsebaVwm2xtAjg2uGgDmj1mX7gStp5BjFVucjOhRQos6uM8g4Y4HakTkmoGy0JCOBqtNWbMbOWI6x8Iel/pX41myDdBjFmqs5lfUWlOS5QOjB7MW4A3wANa1i2xXmIPXpvhFsorF5qEepF6NCAi2AY8CvgNnH4DgDGUnZXMHPTtC4VcPVwreQTkW3hjpTlLIU+cRLj6EeBmtteOQVcdMW3O9Hjz/sLHbvLC+km2+vbzW6m4Od/eFC13My/CmePnh6/739x9/fe/Jw0t8nasltIQs+muihTF2ZZoC3MPNex9xnnwOd1qe+gwI51KDxVFethEjPMOcu0mk6rtnxSfYyEVXU5YMvKi3DqlDrPhX5ilHI+kcqhu8JzBGQMjPEVB21qrE1jKJheW1shL/5m7+hISIIYouc36QKG6jFsz4T2rS0QE8WKkErjq/ljbVIeSIRPQLhrmREx+hwWbd6RqM3TmKcBqPT4IitR7II95+5Eu4bCphBfdo6O23nKlstrI+d924YdrrTc2WerN0+D44JJ3+Cyc+yZBdB1hMj/VyfWkdQrIM98t/+7TvlKYgO+/bZ6hIxZys6PVc8aELShBdAaq4nVKxv8r+8YwRkrua/pQrGlTHHEwI8aaHwZChDmYLj1HL09+NlvzxfMfVUGt8dhh9B9m41Gz2UFr3UWXZEyuZpv9FKGp3k1p0fcys32kvNrdVxAlRhym0/ePzhQ2zG0f7jcW+/nXhBRhiLECW9FZr5fJAvDEwzRY0hfofoiQdHXmavyBuuzZuQrmxqc2pgcgKtWAUCRadqSBrX1OD4QgbPkppich34hjiGAh3ebAzJP//zPycaRYJYwtGxLrSsAyP3qkYQk5NcCpE4BAqxPQ2A2AsJGuIXqw/9DCDGKMAqpekNkIEhxivF4uTsICMQKbsjbiRQgYIXMzfnA+IMHrmyPw++IRED1U3KTNY9qm20TBtze59l+nGDmI1khA1bDamx1o3ycjriqXk2ETnZjLSf/L3f+z22IvxZphdYBHaRPlIN6LmzwTGJq5BNYk/i8YnDRCCS/ZI7smaw50YeFQPhmFwAasdsq5iiXC1gjdARj74CVTN0zArxO/4bPIlpAOQkCTyZllZLP1wp6iJVW1RvcvLbiA5BMsRFSEP/BKr/6CozbiTwE6m4hoQDLTcdT4rDo6cffpD007c2Ru2l9ZvJwhIJ4/6jp49JT91/f7Cz6zs0eMoaRw7VjP70abndMqVpu7XQXlj0Ir1BeozmiL6b65SVFfqmpQbrJcqL2lOUXYVLez+oEyVFLVn2QobwS924ADWsD1F2tWZIMrLqsJXgYbBoWf8W8tO6Mi0flqhE9oHFr33ta9BxWKiSOFPzKVkT+NTqWx+3jY9BBPvlS1/6EsYj4AgHCI8PJQigWar9VmYnhL1irW6cmJ5jzMY/4sq5UwKjcZWOfEl8YWzbM4vkZuhK4s9zBPDRgoZxZHY+v3KmozTePUXoRDxDtyz/GZsc0MYDZdqf5VbL4xZdVO3IecRcDwk0cad4Usw8MGeFOnPcc/O+VTAKLHI0/pZ3gF0WC5Sj8QLYpF0yWx2gI7TbUgzk1AznJ2EyT63ioPRLw780KR3Uad6kQOWh56ukuQ+6UmeUSDfzYrS98+ggedwbpW80llbXFunH/uEHjx7cf7//+Andpptjmql6V33iecH4x3jCWSF2pAKjxC8BOGI1vpdXLjqap5IHyzaZ6yQTqSRi6QOOxcvQsvrVBkctEgbI9Wu/9mu8zTBUZE6yVHjS4OPv/u7v8pWOXbzfpLbXwpAZpQI4aceSoGSVsrr4BssFZOQICjZhO3BwHCuWotp+zig7qMTbi5cEP5oTKcrJhfGexQWLVtLzHAML8/MeIjBJDp2LUXW5iYy5UumHa7auLHFkMHa61TtBjFEldjDAxelRioYZANfM4jvTnlVMVmilXBAdcXFg1QdGIMaDwAYkRnGuBa3rYRB35hYAWa6ZU3AvbJlWJj9/9uxo2rSYJW4Bq1Mob6WoiticibNQwoIzjHjjyJMPQ/NmqF+4lL6dXxKatCJbt3arvfHJJ4927qTN/ujI55mbxXAA9GSdZBk5xFbme1uTF8zSp0m2M8kGMGMmeTvLFwZ5o0dJYEbdy7DIRkN84iGs7JYr8H8hadMhsJ+nu0UywCQsnowOhst7481keYVnvffBe4OdJ3QuHLdd3imGAKujYdYkmKdsScPFg8Nx2jpqLg5Wb3bfvNO72V3Keok7Sne2ex/+2+TgCeqRPd+s4WCycDh2vWT448jzDsZHqRugpIvP3c/bRXtzYfnuZHVz1EFebci1pZKq5EeNwr3QnsavIziakYLhg0tLRy3gSY2xLDQGHACaeG1YBGAoLz0rR9ltzEwsF35KGA7RXBYqCz7OwPI7JJpxsjAlAFZTr1JYnXNJ+dHMJUUwxU1xZa1h+uI6mseytVwGd8c9shPIqbefggVsAODafBCxwkRhnPq0yLOWPYiRJZCdf0maEK5Bvrm6Jyq5yT8OyBNRXOKCiuscUAx2ugbJNlfaSqaletVeat6kzuuiwmrTFbcXQHPC1XKKhc5iEQlJxM97ynjx+NjsLJCtWukuLLv+oQ4OetJrIM1n47OFrEajyyTUvrSbvv0WzVh50yYe1aBneHBsIWHmnW8OM83LZQDsYH/wNN8+2j7yma7dQ3RuW76XQe7UpCvYyomggYR1K+/7NjVt2iMsLW82G0vqY3N0sDvo7U7G1CYOQeagzthKFHn0Mhl54OpkgbjeIvxE+Q1eOXx0c6WL4rpbkK9yzFFvKm8z4AU4iu+mAJYJ/DEISPE7mCTEAbEcsXGk0Y2bCURqNVqKRrEnjESSMBTq0S8Be9AUA01QR78Zl3bIinnu5uEVcgDTqg+takKNBBzx95VIsYghDjVx2zP5m6cz1xqAEZadnE0AjvtlVtl7iPSFeO48bY64WSvXwAY2mSgS4uRzkzfHy57jxp6pba6SeZt8iy9XLkYyboChecxMOOEKFMeFcokzXmLZsToJtYEogi+urqxuLq/fTB88xHDDrwUY04CP0xnzOOnzLp7nzadBB85/HU3S0SQZFf4fx2qEC/OdXHymOPE8R+d7SacNCqm9ls6wIPCxdzQ64l2deLoWsNZMcbqDRs80mD7lNnKKYWNhwPQ31peW760u32tnG26ETOTB3vajw0PkMnfoWuhLpFHXpY6mWEiKQQijFplY7SFW2WgurazAqVpMXWsSg2PdffBFudUM2QW8o8SJIFrzKpNrBgexkmwtyYggKBn3mDfTSetHXrCIzaw0GJS/9Vu/RUaFkJaREw0H5UpL6EHVu4ZB88N2H3M235UNVLk7fFXmRGRGVVuKe0G6SeHUOWUt7iTxBQTEVGfbwOoEyNhIAEqI7iBmiHWk85197TRcA4FFjpAelxt7S5wLZq+aw088ncGXKaemN9YV1j2jS8S5I+4oa1EFUz+LO1lOkbfQrcl4TBKLFhbW0d53XnVZZ3EFnbBbNCcAUOhONQVR32glzIwHksDo9nipZlsa/WbSb9GaIB2nIXXdSpViy0Ny3jf7K0T/CUnwjB8E4TN/cVnRbPkX3tuTocalEGsnn9K/fVps1Eo6q4vrn1xeeWexfccla2500NvdP9x5OO4/dflukg5C98NmQWsE30W770MgoYM2dCPPnmq0my165K23W0sWbpT2RJHW4PiCLCMLGMl7wtZTwhR0I5glnrOLuNASHI3XqonKqBECKxbHECkHGpyy2smxcMAYFwjiYNqAMmpEw4lAFnzMF+tBz7fUWMOYyaRi1ENVq1pLHZhjGzDt9HMtPk2jKPG4sRjsRAwBR8xPwrJMV0Cl9CLArdJ4wh0cDQFpQaQuDItespvnHkQWqADXuARX7HCg9ypulq09xpU8fL0w096q3kEtay5D1DQvUzE+MzGJlmHS8giyutlvd48GR/lk4DusBtmItExrgTzeIlRJtStxpnnQbBEHB/tHiU9SswcEtqFnO3ontgiVhb61NEplhDDzXuqN0mmL9kkSuP1JUJCLjF9r2zBpfmJj653NN39kdf3tRusmnV/caL+3t90/fJyPnzYS1AZGvkf1pJO4TpETotlteHkeL7k7Qdgip3N1t9NeXejQaL7j71Q8d7VUSF1dPvhiwDHWg9E3rHOIIBLchpGDI6lKspieYhIAeSleL5YvCxXbhzgjCRxYjVDbDBkNHYjckfaBmkeY0lg+GJiAxYw81zXBSkEGgE5olamQRaa75vYBR4IG3OlMYd+zYoU21J4MTJTGhITTrSjoXGdfX/lD1WLLnjGLjEhI3P3iWT6vO0njt2Inw4UrRiTkp6vOio0W01vlpERX2QZECONSF9qReKjfGWKjrwxDhmaqSZMali3XXW4e7Y8nh9MApW/eyi0AiHwXlG+SdIqLig+Ot/v53tAdDREDn5AqGSDtDezSRNWL6LpR+H1gCmQEjPN20ghiPUHH56SWR7l5lE2TwoZ04+6P3Ln7qY2tTzU6mxS5gO4j1MWfPkAbLSHrkgzp7Op3AZ/eQ5YCiuTISdC8oGMD/5rt5lJ3aZPNzqUL3ljNk9QwMb3W0jyvcszR6MRKiWidgHEIkYGPJDGpk0PdSx07MQy19pSgkLOs9Cu+M8wb3ngYyPyV2mcrAa2zsFZBGX4fm/FP//RPwUe5k/wa5hgRN04nBp9ZNHELwBdlNhpviYUNOILspjmm+2KujIZ5wWMauqlXwUwf8IBK+bPc1RmSucDRdiy2KpmQEtOd75vblcTSxafPaImUChEJe44UTVFzSVkqJi0nJbQKoRVJp4UwjlVfpyakj/9NL6AIHZ6TQJz2lX7d5eVb48XVbG/HDfecD+Sl3sOdRuZKPXDfzSowHN3Ydy5MGpOsO2mRdOL3ScLQgRrLEaux7QGXxAxhSp8eGYfwow8OpqVBHVTHpu6RV0SbAmVD1oDYFDd/8L+vrG01Fmkb13bjvjvafvrg208f/kc+2E1yMuY+Fe+ZPs539fKhRqxWj91kyYHytsuWWgs3FpduNvCpwdYi5OZDnVJedtqqwfHjHqY1HcfLFB5SVhozEF8P8gq4gFPJ5g8+SohQr4veD0wAMhLYgGAi34AXBh8m8qjQPskHDkVAE2TUT3EqoTFjOcaiMjPE6Rc1PwbQ3MuDMMTcVEJGSSdMP25cZebngnhM7jFMlHCRalHm61bEPxJbWxRLS26QW5bmmCz6c5++gZc1mIyrhq7ePlDH4bX5x3/8x9///d+nSnV3l+xTykulFDkvWJkKt/0gTeIWKkWJDcFydMlCawGez4rLug7UK7wsoycZBsJ4oduaqvYSNASMRmk+csvvNFfGC31wp5ckg8zrlKVBmjYknIuk0N8yE4EpmQ2PhTzQiHTTTj6ZxHT1MiNJzPV3lxbZ8js3PuUkZ4vG+Gh/f+f7O4/+3/7O91r5IWLjAfYzb6kmBEn7ied2h/y6Tx+RK+8kabfRXmt31x1p7oDUx+8Rl+TSukLmhWVj3alqYoujqxwNhxczBFyAw6hVF2v68xXzh8wAXqFJWAs3TcvHjBQVFHM0ESEFCqxz3FU+tMIby1y/QLMxXt5cKgavAo5KHGkSAEfmR6JtZzLbZ6baKrtj13hGyEuZ0PnwKik5SWQCjkw+arU8IkJpIjzCH1APBtPNjbVz3Mnm5rGesTuplyHcNKX3+Edx89g54CtlNsARFySY4VxhTqzmz/7sz3ivcDL8RdLeALKnV6lISNI1ml6TJg9Ja3+GouREh86r0KQ333jnCLGw/t54tNNudLzsIUmNLNxdp52lE/+KHe6PR4eN8RFSjknz7Vtvba7c3EXMEc1Gj06wFMfeo/Zg5C3M0nj37VzIm5xSmQu5mGkg1bckVJqdyGEWIpdt38ArBan39p989/5//O+nD79bTJ5CBYaySJBx4m/cQ94o6XmzcOKjoknanhQd+tIsrt3euPXW0vot1+yqzlpmI19nupLU4HgtRuwWsXpVKofLrNVi4CjjQm2q4j7LcbIyTnpyHGJtwCjWBIgj65K1LTfcPaMS+QXCojxNljcOtVjcgTozlaflygkmcEfiZn4MQdJ421Bk0Hjy8ZBc0GVVL2do5zNPYeanc5DRApeaJbY9YtZBYb6wpBzMB+ASz5qCqCjeSMuVlgKJ6bSnYFQr4hVteBx568Zby3uHO7uPentU5h01wlvIFcHTLnB9sfZojjU6Gvd23Vov6bD3LJLIaS5sefdW8czCug+kU+lcF50oH0bBzhNT4Oz3iuNstUsHuW9h+EHv6P7e4+/s73zbjR+3YAV5szGdNv/yMc0hgplw3b0GObK4rj0uWs2ljfXNt5Zv3m12Vmdrrsu6yOucr34dwdEQ0AyNCyqV2sKIFWgsLY7BSOkFXhXICL2cz8EX+H3YXxZwPL0UX+Ak6DLEHITxbr6/NgCSxdwOAVOVmnzUEYAZyR9FijthxLPFb4FHBEBOe9bzZ3WGh2D4eNnajDheLG89bB6K1jlJ6iqcQu6OvJ9/tRAECr9W5jqsTnoKR4WwQso6S7eWbuwtbn/YP9oZHaHsXXjitPdOGvS2mpBgmeQ0jdl+cn+ps+6W8Z5XA36G40q3ojDfvSg54zEEHePxSfs/mX7ow4GwfSaqBWj0Huxsv/fk0bcP9//jaO8/R70HWT7MPPxBGm8G0mI+bSWbwAYndrFeuC4dDF1jZXn9zubdH1jbvOMa3dI3N5nf5PqXEb6m4KilaAaRwaU7WZhcpgJyg8UZAyqWRGUZE6GDbY6dSCiTtY3NSPIHuLyG1VGxcqIpG8qUVnEkSSQyUepn8DFcfAw6FqxQ2LeY+mJTlxzTTNmzS13YmYkX8wNmEken8+8zYQRL8oqttbV1E2e/xF9K7Ce8AJRjUQbuawR4hXzubqpjmBxXQZ/4b3n0tc7KndXNx4f7D4/6B9C005DJIQ08nipN5L2Dpw/ufzsZpBvre25jVPIrU3tRp3AZXbLhoxoxnoyE+tELBIBAcpyIqKvoyuDB9/b3Hu7tf388eJCPt7NxD6ZQTvtpl01KIno+DYlyTiZzcZC38mypu3pr/dYnljbedJ0lIkxpYlXVueII1x8oXkdwnME4Exc4s8OBQmkxQWSmd0qMkqRrEAEi4QPPEZTBcoTrBwXaCHHXChx1FzjOYDoWovopCiVJWEFXguSojM1lewBc0X5UebsS1pYrDzqM/pplOZo4cWxyXgouowS6M6v5gqEPTQvXxrMmTcdEUbutHrAq5iGGyydk527dvd3tLOFR6ypH40mrmU2xScxuIUVREnTIYKy+uTnZH9OEfHg02n1C4XIx3bmxIulnBTYd7jz+fnGYHz3dWTi8j1FJf8DC95aZZp88WDZmOlhJhjbtDXvhfJG0ks1DUNZR9QT9qVVeOdndGfR3R4O9zPU6vvLGU00LlRoqUZ0K7BpidefF4micZp2VG1ufvHHr7ayzOnJeOE2Ct4GZlIcYgqvB8dqN0w19ZmQQTzt6p1fLTF7FRRo24CPBJsWtfGktZI5rw2o8M5ECghMaw/xRokPcdRa8CE+uFC2/olBQBYiU5RjjsulOmuV48WOepvfHzzSu/5sPjqazq9nj+TJ7VATBCRsMRvoR3wCUGI9waT/74z/8Q+982nmiTej+7GFO6d08mVqCaRx8o8l0K+221t/YvH0vP3qyOwaXdpAG8xsDcERGBXDMiT0e9sYPyaYhXQQ4kt4gWZXn00goSfORL3menLBMAzg2y161aWk8BmlIr1IWpj5wwlEky0dis8Eqd8NRYxykIelynTQ50Tj4xtzAJJ1MDwZDyLerRh+XdoidpZXbG1v3yMMUze7YW6v+9xrW4qbIzwh61uB4HXzq2NCYkycx+YA4ROXKtOyzuqaxCNUB1ZUyMy+Qr3NuzFGZaPKq1FZiQpKZ4UNCjSK6y9WVNO/Hdkn2OBRzFDj6erR8Oo0igcfqGPaHc6Y6Bnc2LSKt7AQiKmA1s6VJn8JCLs/Cx5n0NzPDdLGR4ERDeCh3X29FEcZF4O5Hv/0Tb917GwXsMsw4LXiZIqN8TJXRhR8Mcq91CJ2mu7516/adbHC07ds9j13oo+WNu9w37cPLTif9Ub9oJU9AxhDNxIpuhEwxTMpJMewHcNSshQyyJ0mmO4/1KPOp7GJo/AKANr3j5L9JPMj5wzWUm2ntB2ImF9XOJm3OlXozkNciD7zLPEQ4U0+o5CHk9IBdXFm7uXHnk2sbtxvtpaGXIEqFiN7pLorpTlAkklu7zibkaweOl7WA4sRlvHLO5FGaCGDMJ7+eckzGVgF9yBpxkSSOwAvmB/YSGrEEHPEcwRHJFH38Vq3caqXUJdavGZYA9WV3HWvDqwZb6I9g2cHu5ETcOIK1kG/E1ppvOcZC5cFIHOBZYzniWYeOuLuK6ymRzVkg2B/0jtaQzvHNnWeOLEWJvFTtCdarp2vzHVIUa92bWxtHu3n/CEuzPz7E2vRURBpI45ZkbYKDkGy6jeDj5tMsTKj4G5LaXkjisGYAIumZL7SPY51JaBk4bUeTh50hD1WNIQUdLu9ovJsBi9li5psgNL3SD760GzivEJ4XqqGeIi9cy6zV7K7d2Nq8ebvVXfE2ctgMOOKUgp/k175b9esdc3yWszzHnHGRikGMLFa9ayhptJ5LneUFPPiSvq7/VeCMVIw01ky+0PQKz4UeO2ac2jIatjvO8ifP3reaYW4lM5xh3NFMWWY4XiqcK9xVebLqjGq4aT2v50w116YGFVijFHf+zu/8Do4wB+H4bAaf+9znvvKVrxB7VVOgOceJS5u4r9C6a8Tugq2N4qd2lyB77NMnHH+02+siveDnwR859xIPzdB/AOsp4jB4oreft7aX9eanSy6/nS4vtj9xJ3PfGub/d7D7fuFpPGxm3SZVy5iNybZr5/tu3bfoolrGN+FKVcEdKmiSYP+Nvf2IH+zB0XvDk8nG7CooFA7Mpmmh5ITLO842w581PQnSH83HCzMRjCa+FBALHzA+zItGa6HTXSo++T8aiAnQ+YMwa5G0A3p6tre/rqb/V8ZC02vvV7/W4FjZ5Jzp52cO3fU0Es+NMOjuAB3p8cjgrQC1Mpkt3mrTYtg6pzHWmVuXwo5e5X98bCcqva5c6pyONKeHEB9rkVAgbTMoi4KN2mo9olMNBAPQDZQ8zQmff4V6K/hKFIKSmNDXcN+VvBpuHGGhmYDmeQd10z+HFJm16ZW+ur457r3x4XAfbTKy3qNxn0yyy+F701khVZVKUsQ56JAWT8u4nu//oqpNJYBGs69BEp88P2Upo0Xm/XxfPZ0HmaDgGtMfwXd5yGiY1Rx7q7TRatPZ+Ob67due/pU15hVOJ+6lsB9rcDxnSB/fZKkMCk+ziONq5ZfFcI47wVrlz2WR0WbD94oPxpQBojQsZI5d3JaPr4dCHb7SmSYGR3HsLzXbdl+EAvF2oXZyjHDNqEbuUR8NRJ5bGONOEciNMY5njVYT4Eh3cmm/E46gHh+ugnTCZ27wWViZWG7G1123HBpSG7cwFelndbDT3n2aD/qQe4qWD0wWrmQ0piHLERpd8Ve5il5CfR7Yl+XBMCzU2jqZAcf8OA56FmQlecupD4IPdPryG5+0SXxqKCdzHdodThCT69xYv/k2QdLVra12qz3zYrxEFkMNjpcYphQdNz61yH1cpftcynU/fnycyT9UuIU4VSXvVW6vSozVq1oW5bnuuTvZaMzAkQpC8RxDebVvYgE+Kpt0WUvZmFhseZhgNLYCHxVMOLNn7AVDMViIgCOXBLkVBQo1nIHnCD4q3W8vyXyzNFeUzrdtCUiXttzi+kKWvJkmjz5YGAzH+7SGcQPSv5jpg+GoPe1ebcjm08ceDX3UMJWMY+Ea/psAU023e8ZJn41d+agRxCiDMJBvwJp7P50S8FazNywGSB2RG1/YWtt45/adT2/eett5ZEzdifbi6Rm3mzwDjGtwfLmGegm5Us3MlSRhs7xe3h0yLhTRiG2xi2c89LcgAphIipbULfXaTBF2E5lchGrUYOciFmgMjuxMcvbLYN/0cRg4XnzOlUjhFIA10VVSzFzhaNTjIKurno5qTSgvuD3MbCpcLcYjLCica3XZ5ntSPWBlbCfqMuYYvFk6rT72co4+gNhMskW3APuxuUUnVVzpD7sH2x/0+wdUXaM81kknwdoMnrSkcUtn2XfXgqodCprzUgWyWVzuFUUPd1oDQ5YHRHZeFJIiwWSS9QmgumxhcePmrR+6/cZ/3dh8xy3djN+H82cyqcHxZR7qEiXUOE0SNqx8uaKN7hTf8zRn81wbKkY0Wwl4rLQF/6u/+ivSKQAlmVw81l/91V/FhrpgsU3c80+NkkuBCacAo1mOM9TFC5rJGHTU0RNwhKGtdtggI42AoCuqkcalbOeYTgQachCyOuZPRFSk9ILbpwg0weLzbaipVs68GgR5DOyz7lsLy+2F5fddc+fRexPKThrYl/vq0YqbG0TDxy6krqcBx+AyB4lcBfogT7TcnFYVp+DKB5RUShRsQa96hvWYYnRD+UG5582tNz516+6PbNz8tGuvu+L42OUtpy9dLL4GxwvvnKX2vWJq0nyWCxZLNMbBu5d9PKtS6FyMYH6IuP3lX/4luKMmWRBZ+BGsIFADG+oiQb3Y1mOeDRyj7coXyZhGxsU3OT1H0AriDs+Lsk512QUcsW3FeL/g/bqTAj+230h8xH5HiuXS/rmgGZ6U/VYTZa9da+RNQn/lzbSdrLY3vYJOa5kC7O2HRwf740OfQfb8H0TDklD6IqK1jz8WAc04NyZzKw+E8yRvu3lp4mTGxUYl11vcIdCI3UoDaqp9XEZHsMXO6q0bW+/cuP2Z1RufdO1VddxOjicnvdTWVYPjyzeUdeX9wFci0YmtId1D2BvdMKrpF7zwEVcTz/izp4FvjicYt1JhZr4XhtcKDPPGh/AK4ZbLBdbUXRyjFXYMgtsuVuERMlZgX0qVjnQqzj4+rwqrka2UfSf65PwrPDMXNxNMVO9fsXxUCBDTjM7bZiZBZtkXAQolA9qFjs9u3ES9bOnW5tsrN9Zv3//uv75//3vDo/0QY/Rdr4LwhVrSjALO5pkrsdYNiiLo4hRZaR+eQMii5KJbckYoOZocepp4DlK3XNJJGwuI7iSNztpNCsDv3Lz9zsL6PTQmSB8F/x1AscJzN59OX4PjSz/EbuEtxyCi/wFZznYYOGIsMAwiKybjdy4umj1j0Sirq2QxK58VFfeBukqeJ2bPnIng57p7cSZqjlvtAqGHDAx3IZtOHzJXId08ZcXPx+sZMqnEhiULVLY+m4IjgCuVSU27AGhOxFC3YBewHEZ8F7JqZ9pzX8Ssjn8kr1xJPL6HIaQWZsClku82LYbCEotTLDJsUP4WilBvJ/r0VAfc9732TJomUclGC1/77jutGzfv3f/OQu/wgA1oONzPqHOhztr3S6BPq8/YJJ5O6a/L0729dC6566Up8EVbiw9Qeq3M8CiTTBNNCaGf3uYobaAjuUhnwcIttbo3ltdvL65s3X3nh9LOEk0TXQOh0qYqeJKTU/SyO1I1OF5oUPxAHA18pLhCagh4dlgcaK5MS1AbDa3Vy74Q1jx+RtCfYxKzUx96NZZyZ8kCnf+AS+Ke4c6MZqVZvrH466VsMetxyjckOijTRndDzVX4BFFI0jIYa+688qTTlqAAxRBNdTJeYWE0UhtxAC6udK7AQ7IjxzdeeTcyIQzb2ORQW+Raj8AKwxWrnelEZPHCOGowdbTpTO17Kvgeg9lStthY/sHFzs5TqJrf23n8/qi3nZM85pzNhhefnWBO+o4uaSD8+I5bXl68L+bPsXkYNGjTVhb44Hjgo2nTniANmdMDh96qjcV26+Zi982VtXurN+51ljdSesL4BBHbQBaEJPPI6LzQixPdaA2OL+1gkZNVQPCZgjP9L2/zX//1X//0T/80/bMIw89kEi47zKvV2sbWwH+HjgfzjlUEBENOhilyKdrKzPFjYa7TzVRPf3JZcDdlQzK2lGkr4IhDTQAOcjXFiDKmLjU/wnE1jHSRKo8eAVEOee6xX1/tFgRVRsyssEO4qC2HK4uptBPAasLbgP/IL2BIEtnkaRKNkXEdo7m+V2c+IaPF7XJrtkLHGDnL/FWHIORKmq5tLm+2VjbWbt492nvQ23vYP3g06u+Ox0dJ3k+ZFVxiKp9VMk3WOZvW/Inao54G/ppT34Bi4jPboXi6bGvRWFxtoj/W3Vpevre++s7y2r2su+lay74hzPSa8iJo7aShXPwCYJe/LAu/BscLgQtlYVhDMutUBwKEgV/kZC0Az1qtgF9GoDHDAWSkRRfNY8lm4HNhiJHqfffddyGgVGgIFQtz2SenQaSyzRWvba6NOANNWbEfsez4EdlqkFHNF4VlF7cchS9qUyWH2n4h5vFo3hSdqHYLcbakMoc/FjSxyADbA6q3OBzaVpkNND54lJTTxJzZOPJbFNbK9RhmkogY7hnYuWdlU8DtiT/8EJGz5uLK+m1EKg62H+w+fr938ORo95Gb9IoxXKU+u+7Iy5H5jtVFo9QQKVIltaU4NpFt6bzcGeWjzbbXQ/Ix3xt3O+0VVOEBx1bnDZfxtoeGB6lxFX1heBYYqOn54Ji/RAu/BsfzzQpeEfZ8+HH41JYHwJRTOOw5JkZkf1Hc9kd/9Ed/93d/Ry4VxMEhhXeCfYrFIQG0asadmUilrNbA+uGY8VUNXGLVS47G+seVhgjN1apNo4KG8y3H0/odGvy59SAURPp2JaMRlqOkJ5/LMAVJzcClyhyfharMMKqO3/jGN/74j/+YJyhmEg9XBjV7nkU54mROycLJQxNXL4XoIogMWIThx1Sn6l2YJh24jM7TIYm/LNCQYHn9zcnwgFz2ZHiEnHi/d9Dr748GR6OhaPOT8ixpiVU+291qeMVyOlPQ2IzqHua80/UM086NdzrtpcbChsvWXN51ecdNjuvBwz9vyRZ2nZcT+M5rt/olHnJIMYVIT4NWZKtZNmK0YcpBmjO+qwyQajFHV0qO//u//zs249/+7d/ijglxOCP8GPiDdDFUl64KMUFXEhsNGQEXJVUBfQ57ZtjrUqewZt98A2uH9R+Rt5NzwfFMfSO+4doUWKSORa1NfEHxZKJuunFTrcrXzzzgGWg21FC3QmLNRbkpTQIhY2x/LEeeaVBeoKPsgEfJOwOXCM65eiueamU+9aSxD7OTk5x4AdtQXpgmpd6ZC9ZjVniP3uNj1lzJFkZuMlxYvTsaHw56B/3Bfn9wMBgeDgZ9VBrTnpUPTquvQ+FR2l1eQsjWN33sBFu9s4iOBK+La97wVTrON3r1/0C+lq6n8EXbaVkW6XzxtVfAsIrqZL7Z+BKYkDU4njPY7VmBUOF+/ud/nrcZkOIlBlA+//nPYyLxFsXaWVdMzwG+RDYBRwAxXjBYYbjwwBl+2WVPYeBoLjmhTDrkYdSAL/yU+jZwH/SfaXRzcUSIJQ6NMC+sl9q+GDnnzs+Mg6kP1fqRsONweFAUx7FITsTBhbwW7KsAjkRLmA10eoBaLpIILwJF5Nkqg6OLKuekyxvmJ1efMi6b09HkGmal1I8MTKf93ZIk8qZzq7Dz1hkhQVzpZBomnP5jtr1KTssaZCHqNklaWXcpK4bt7rBZDBYcdehDBM54IJ3d5KTlGDYVjttqekXxrOkbD7aaJMSd9ht0ggLqgdW+KDENzWbAwGQsMd1wymzaWbB4pdZ+DY7nD15onOgvfvGLZBsIrsvXA1DUw9pcqmpUHjNOOSwRTHS0wF9X6m/jOfK5eCeh1dSlwWumOwr2EQztr3/961T4YddwzfSB+uVf/mXqgsHHCu0QDA6EiYIAO69INgrRXgp8DWgUcwzaH0nZxypRZ11ZpqqwrpyQYSsiJoipzg7E5oc38Au/8AvYjwQxLrsJ2XPUlSvPDrJztL09ggBj1VhRtsgW+OUvf5mXakbn3E9do7yFJJT/uVIAMUVOkajheILETtDHyUPSZiE07fINAEMRteeBZy02o0DbaRZZB45Z27PBx/zD8u4urFjM8biXiy88Cj220oZJ5uTjsE011PbaTcMMoUfWeNxrNiydnk7TRcXJWul5/nVeg+MrMpQtvR3GT/7kTz4LfSr7YsJWTAxy4hQmY9PJjjDkxbjDlol5eZcCLwGNHGpsUmDxD//wD7GY8CW5ZjInICZsGyV8qhm/cZfwmWid8fsufsHxNQDZVCsDMU+ebCPpGHB2dOfOG1heyuBr/1B/3TkJsViXk4NwSeA1SWS4qyEmeN/XIWeJ5G8547PBMX3WZaNhIV4XFiGn4zrv3fsExwFzsfp5noA7p+DU8OS/9rWv/cqv/IqeqaFqmLqktBTLeGNS7m1JgC8Bzxn6OSfAqOENPE37woVWfHbyUMF5LwXUZn+32dAx2ydOff7GlM6fw+s20hr7XuxgSbBKWR44zrRkAh/zcugXwAWcevCxQsDRnWwk68oOAeQHwGL9FIgk0QRoHoX+c9fuBU1T5esBROV83njjFtauENOd6lswf5Ow35T5ycyzSRDN4CfYpvwCoQbwUcyEy1qOriSiCoh5XoRB8DAA8WACQ4YHPYvDw96//Mu/oIwLNLuy6NCVgsH1qC3HepxYVywnQoF4W9gUMoJMzQHTCXNV7eErW3bHyVBv0QyUgldYUP6gvl7DIkh1ccAJxWwnswGCs1X81E/9FB9ikcWRygt2pIjjDHbXegpeWCGfXLZ112kUVpiVK8cSROQC4gHtZRR+lX3Kf7Hf2Qixf42BUCFFXo8aHF/xwSrCfEObmmgjIXy8eK0uVebiUEOLU3yzQlhzpgsV8S9kY7DFsB+JsnEi7C+oiNUCjh+PZc0FU6xJKTQRAJxouE0oWWCUiXCq+s6LM7dj1R+m924YmHIKaK6tqQ/11lViu5ZjkdlLmenf//3fP3jwyOxWqE3shd/85jfJ6WECu6jxxvzYbj1qcHyNhnAQWIT4jXvrSj1tpTXARCVPVXNWjWTuosgjyELnWDTEsFJxpTkghtjP/uzPwtM2NuJ1M6vVENwy9boRGX2xsTbfso5/ZAl0zQZuNdwsvrJzMA+QtIHjCiBu38htF0QSVcR4hO349On/CuVPIzIz+s1/+Id/UHNwbXjKZWVZHemqwbEepR2BBQe3A+OC9WndUFknBK1ARjMb5zd+Oten1t+y/nFIceU+85nPYIhhOpEx4CzQ7s4VpHlRluPpb4x2bpG+GTP53AmRG84MU90o4iHGO346sIiJGsuXVdiHYi0PjklIBHk0SAKkZYhsjkaTsAWOIISzRRFO5Yya+QCOzXpR1OBYj+mKwqfDiCDaqKylGUSyYlhXJpha4fgmdWMoCRYAkYAjSepGGFg3SvteT7faTEgLlc44yK7MxsyXzLESIKuE4St7AzYpvq0cW1X1VHuOp+1WnQU+PGX4ZNuAwnBqEUInBwdHUMT/6Z/+CSzmd6y+ux7XZNQ2/AseWBNE6yEGK1ms1c5CZZUCjlg05Kn1idTMruiiErVkxbL+SaGyJjEYMR6tvOR6TpGZh7ifBoK62lEYBkPz9w+TPLNfE5OUvYcgo2ZDcuWXktGN8dc2IT0vVyajESjBuQ5U9rFvPT2aSIaJHRGLMqTLC5Xo1CuiBsfX107UghHMsYRglcNAJuZoon4upGgwJUhSE5CyhVqZZG6mVtAUaM4sZqxIk8i+nsgooy9OIgsQtYXESnHz8d104QwcfbVcoKnbJCugYcx2gW+c1HrWmOk5YYx05aCZZGIX5Ka5hPALEjfzNVEwW3EdQMY8z+sFUoPj6w6Otj6l2gIyYjaK5mYrikAVni/8FeuM/Hr6XFZzYtBmiWCBpohQNiqbpS4KGloswroSVjYntecRuOCBgo/SteTaVTAzGAwBR3ZHmP8vUVPfGhzr8fxhMY6Rsdjg0+BQ41vJLOITISBhQfIwGBosqlgY9dp6vh/1EA5iZ1F7B9sRc9taLxiAXqjd3VlHNpwV/NluNPP4rpIQAyJxAuD0UIlkBw+4CafHC4vA7KnmFtTjoxt1QubjhkhTqWFtkyFlVUCpMdRTAy9yphSBiFBi3vSleti/MkN2InOFbYWRhUIEVjYRAAwxSt0hPJpBfRWxXhcVPhp9UogpQn5l5BLNiGsjyPtjYYjKzsVyZO2RlMpwd7wMMIrqqGMNjq81PsadCQg+apEQrWfN8A2eF9xgAo4qj7ue9MOP02Z0QZeIVC9F0OR82T8UwvulX/olLGuxwYVrFSQpjdYjFMOWB6okQkF+xoTXNHhSSNZc9vpNyw5KKcYjGRhMxeC5S1LIH9bKq+sFUoPja7rIXURX5BvyCUAh65A1qSQDSxFaCeVxpKqVn7HF+Xr61Jor6PHwQKFSY2eHWfIyl8AixqMYmnGfr0uHlgKeMv/U80GsQRiJOndMRQ4OBYfyIaWqrs4DxTD80TAwHre3d8NJvUgl+yKvQTVhkXrU4PiqrXatNNYDUAgrmwWpwhiqzUBGfGpwE+dOiQjxQuJWCq+VW81dIwaBQy1kRJsHa/vhw8d42YRrcVQ1RTEFssJAcgL8/epXv8phFc2k/BkFil//9V8HHy0ifFn4VRTFlWU58L0RLcY4xQTGUeCAwCLxZbhEvABBMrmOPNbg+HoPgSPuIVCInQIVObhsDcARVV3gUstJNsvVV/5LvZdw+7BBycA4rwvXCGpj3spGj5JQnbgyIAvbiQmDX3xYUTPZHmgDOLwUQQf5HJ//IVAIRRFEs0BkNbPU7gU7lyfOvfDEuX45Cj/3cz+Hx/3aZttqcKxHmO7SL9M3WI64z7/5m7/5Mz/zM9B6WN4oUWNEaEUZ8fCC2YC4h7oaKCuVURbtTpslxDUz7pR+YrUh29bCoyacYS39dHY1cb4sOMIBdKWiF4fa30ey2ysBAzHgFxEJIEzaNuEsl4s5hnI9iDXDR4+e/Ou/fptDcpCy/Dn/53/+P9/85j//xE/4+G+7veD1YC8vN6zgstUF3r371le+8j+xTzVjXDwPfWlpxXSC61GDYz2c8BH7ET6jCwHH50VmnFE5NGkGQxwJfLkry72o5IbBiQAsgIzDqnGd3UvMQq9wCo5GtG5GzpJrB9HwTBWOcCcZixUsR12wBS41LVisGKdAsJJj1UZMFNftcC5KquVxi4h+lfmpRw2Or+xgSViDPTcVFqwY+4/TPrYynwWFzyV8KXDhKwhC2gRmEhev7nrgPsveruRcVa5nIQsHARw1RVZeSQUKJ4L+ooLrK5rASo6RGVONuRUjcvzvfve73BSyZpWRK+4y6Mo6SAFx/MRdWVpTr4gaHOtxwqywlKs6sVwFGWc+VNW22gkIrZ5jpaCS72QYoNogUEgeFrTCVaSUGDUwKaFdJcmrOSGfG18z2osoyXIifGoUMN0VUvnGxwbK4d5jnxLfkKGty8ZyBPSrNSWfCVzE+xOPwx50XP9Tjxoc63FsJ55ZknEVqI1dS45PnoHYP2kfSfJAnKb2ZqYPamVDUueiaf2f/MmfIHlNWpkzAjF0YgDR4LGreFl+d+XjAyIcjYqScKlTJxp2IKBM5NGaWwWkrrijAI5oT+A+QxKKlSLhPAKOQHBs3V/9AcXtxmpYrMGxHvOMo5nq4MpYGYe3WOTA4l/8xV8giQZa8SHlaygYQh8hbWriCJUZgoItjCB8T4rEKYXUh3ijnJE8L00N8YgNaypTkTAb1aCVlA5I6CJyuPTMZXxVuwuZ7RJzZPPgXpT8kcOu9tOcRa1gKoQdjNk605U7Lpeyng3XU/6jBsd6vIBhTaUtn3BFO8KcOJXf0MiJ1qNAFcubD5FHw9TC26XTrMkaXgW2hFCUPEvGHKyUnchZ+BDyILkmk6etXAGJ1UYcU0VEasMS0DBRY2gOK0ypdgvqsqAGElAFOAt5GF2tK3Mymr0Ks2SSFjP46E5GGPUs6h4y12rUwhMveKjvklDSAk8VGtHpIDHeqS4YhxdTiLUdWj9nLHXsOyDSBAdjA6paWAAcJGUh+FBVj4hET8OQcVTZMlUoFuzDVQ/S39NLDdfvNRCVsNa9VG7gp2nHNgSCycyoPZbODv5yg5UjmzMBx/i+Zoz911lYpAbHepztlp4OxlewIMwCjZdcoOwNhZsAhy1I1d7EJ61ssfKHwCIyOdJqtQvgFnCocd515NA+ZVDNbBQUEhAQ5YXZ4j5C/tcbrWqjGiuoX2qYHDrfU4+ITBz+taRn1a9czrUmszJ4nc6kz5DDbdQrogbHenzkQ14bCIU1JIFr0WKAAOJ3M2hYednzh0QYTcY8lhHDBBOcXSXhI2DlOFiO3AvIKIQVTxuDDltYysEXb0AYD12hLpuJUjsz5UwUyoShTQpLOox1a+nXy3Cpp+BVGjEMKUHMaqfXAiBCTJDPScjCsEH7wLIxV4dg+DQglBzqOLgGlmF8ye6T5muF46u6xniIoprbT8UDN3O4AjjGKSkOTpkzbWDJuZOz5oA410wg04UJPOML16MGx3q8fPgYNwNgYVOszdom5crnkJn/WxixEtoVQ13QvwWOogdaKyvAUZE76xNd+XYk6SaoFUBx7ZyQ0xln+yq1dxaUwE78whe+wOQQqJVnDThSzYJR6UIJU/2C1eBYj5fVlZ7BR/xBuDvoymA88iHO6XoYz+uMIAhuNSljq1QRFGLo4bwLTc5tDThn6Ah8JZsMFVF9+xDmkUFKHFMJGXcFtqCpQKrZFkplwHovDE6nanddRp1NrsGxHi83OM4MBGBY4ZbIPv07V8kDYDOahx57nTB4RKV0VTW6ZwbgKIGJfn9YFhESGfQQCYpVCzhqSGvdlMD5no6PoGHcNUERg7q277UadULmlXWuj59x2Y7KlYnR50gcAUSIYwK+8emwT6mt5kPzQ4WblRtggVMcE8AVExuN2OC/e/KN+qkatFXbUXSWWCBDORkFUkWEfC4QX48aHOtxLfAx7plnsOjK1qbPZeDqEsfEOMWmE3xIRwMgw3k3+otpK1z6BS01IDgRaEsFCwlrDgleod7AJ5wdL1i/U62vtxig+l70T2t5aImauvb5NRzZb//2b9ez8Er61xoGLjGTTkv9uax2MbTlhCorjU/67rvvfvnLXwa5iHiaZ22tpi57K0AhifdOhxbVrYMDgpu+XTUn+uxn/8sv/uKXPve5z9+9e49fwPFtNJrV5irG4jmExHq8XouoJuXX4+qDtvTUKcKAITkD4QZdawhDpkE7I7V7qSObaq8LnQy+9a1v0S+BwhuOSZ4EBQ3lT1ypc1OHBetRg2M9rsUQuxA/HbYj2Kc6GWCREKF8UgXsKvdQnGEvSqaMej5INjjvJMT1U52ldn7rUYNjPa7LwF6TKJn6T/FV3GmDReWyr646rga2OpRaV8dtpitLotWjHjU41uMjHGYe6vtY/0LjKlQYS6yfFraxjJNOXa1Iph71OHPUb1I9rjqsE4P+90wErEyFkZib5Ums06mN2JWuy/vqUVuO9bhGyKh8i4k22ocmZeiupnMeqyiaWWpKsXU2uR41ONbjug8poQXVxbOz0qYDdvFhh4o9a314Ziva+inUowbHetSjHvX4CEe909ajHvWoRw2O9ahHPepRg2M96lGPetTgWI961KMeNTjWox71qEcNjvWoRz3qUYNjPepRj3rU4FiPetSjHjU41qMe9ahHDY71qEc96lGDYz3qUY96vHLj/wMzbxNrMWxruQAAAABJRU5ErkJggg==`

        _d.getElementsByTagName("html")[0].innerHTML =`
 <!DOCTYPE html>
 <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>学习通小助手</title>
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
        <link href="https://z.chaoxing.com/yanshi/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="row" style="margin: 10px;">
            <div class="col-md-6 col-md-offset-3">
                <div class="header clearfix">
                    <h3 class="text-muted" style="margin-top: 20px;margin-bottom: 0;float: left;"><a href="https://scriptcat.org/script-show-page/336" target="view_window">学习通小助手top1.0&ensp;</a></h3><div id="onlineNum"></div>
                </div>
                <hr style="margin-top: 10px;margin-bottom: 20px;">
                <div class="panel panel-info" id="normalQuery">
                    <div class="panel-heading">任务配置</div>
                    <div class="panel-body">
                        <div>
                        
                            



                            <div style="padding: 0;font-size: 20px;float: left;">视频倍速：</div>

                            <div>
                                <input type="number" id="unrivalRate" style="width: 80px;">
                                &ensp;
                                <a id='updateRateButton' class="btn btn-default">保存</a>
                                &nbsp;|&nbsp;
                                <a id='reviewModeButton' class="btn btn-default">复习模式</a>
                                &nbsp;|&nbsp;
                                <a id='videoTimeButton' class="btn btn-default">查看学习进度</a>
                                &nbsp;|&nbsp;
                                <a id='fuckMeModeButton' class="btn btn-default" href="https://scriptcat.org/script-show-page/379" target="view_window">后台挂机</a>
                                &nbsp;
                                <a id='backGround' class="btn btn-default" target="view_window">激活挂机</a>
                            </div>

                            <br>
                            <div style="padding: 0;font-size: 20px;float: left;">章节测试：</div>
                            
                            <a id='autoDoWorkButton' class="btn btn-default">自动答题</a>&nbsp;|&nbsp;
                            <a id='autoSubmitButton' class="btn btn-default">自动提交</a>&nbsp;|&nbsp;
                            <a id='autoSaveButton' class="btn btn-default">自动保存</a>

                            <div  style=" margin-top: 10px;">
                                 <div style="padding: 0;font-size: 20px;float: left;">题库Token：</div>
                                <input type="text" id="token" style="width: 150px;" value="`+GM_getValue("tikutoken")+`">
                                 <a id='updateToken' class="btn btn-default" >保存</a>
                                 
                                 <br/>

                                <div class="panel-body">
                                    <img src="`+base222 + `" alt="love" width="120" height="120">
                                    <p>✨没有人能一直爱一个人，但真正相爱的人会在每一天重新爱上对方。
                                    <p>如果你觉得这个对你有帮助，欢迎您的打赏。我会非常感激你的慷慨和鼓励(*^▽^*)<p/> 
                                    <P>❗注意哦倍速不要改太高，不然会被学习通检测，进度会被清除。
                                    相遇就是缘,加油！<p/>
                                    <p>🔔‘人之初，性本恶；学而知之，方为善也’<p/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-info" id='videoTime' style="display: none;height: 300px;">
                    <div class="panel-heading">学习进度</div>
                    <div class="panel-body" style="height: 100%;">
                        <iframe id="videoTimeContent" src="" frameborder="0" scrolling="auto"
                            style="width: 100%;height: 85%;"></iframe>
                    </div>
                </div>
                <div class="panel panel-info">
                    <div class="panel-heading">任务列表</div>
                    <div class="panel-body" id='joblist'>
                    </div>
                </div>
                <div class="panel panel-info">
                    <div class="panel-heading">运行日志</div>
                    <div class="panel-body">
                        <div id="result" style="overflow:auto;line-height: 30px;">
                            <div id="log">
                                <span style="color: red">[00:00:00]如果此提示不消失，说明页面出现了错误，请联系作者</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel panel-info" id='workPanel' style="display: none;height: 1000px;">
                    <div class="panel-heading">章节测试</div>
                    <div class="panel-body" id='workWindow' style="height: 100%;">
                        <iframe id="frame_content" name="frame_content" src="" frameborder="0" scrolling="auto"
                            style="width: 100%;height: 95%;"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
`;
        var logs = {
            "logArry": [],
            "addLog": function (str, color = "black") {
                if (this.logArry.length >= 50) {
                    this.logArry.splice(0, 1);
                }
                var nowTime = new Date();
                var nowHour = (Array(2).join(0) + nowTime.getHours()).slice(-2);
                var nowMin = (Array(2).join(0) + nowTime.getMinutes()).slice(-2);
                var nowSec = (Array(2).join(0) + nowTime.getSeconds()).slice(-2);
                this.logArry.push("<span style='color: " + color + "'>[" + nowHour + ":" + nowMin + ":" +
                    nowSec + "] " + str + "</span>");
                let logStr = "";
                for (let logI = 0, logLen = this.logArry.length; logI < logLen; logI++) {
                    logStr += this.logArry[logI] + "<br>";
                }
                _d.getElementById('log').innerHTML = logStr;
                var logElement = _d.getElementById('log');
                logElement.scrollTop = logElement.scrollHeight;
            }
        },
            htmlHook = setInterval(function () {
                if (_d.getElementById('unrivalRate') && _d.getElementById('updateRateButton') && _d
                    .getElementById('reviewModeButton') && _d.getElementById('autoDoWorkButton') && _d
                        .getElementById('autoSubmitButton') && _d.getElementById('autoSaveButton')) {
                    if (!backGround) {
                        _d.getElementById('fuckMeModeButton').style.display = "none";
                    }
                    allowBackground = Math.round(new Date() / 1000) - parseInt(GM_getValue(
                        'unrivalBackgroundVideoEnable',
                        '6')) < 15;
                    if (allowBackground) {
                        _d.getElementById('fuckMeModeButton').setAttribute('href', 'unrivalxxtbackground/');
                    }
                    clearInterval(htmlHook);
                    if (cVersion < 86) {
                        logs.addLog(
                            '\u60a8\u7684\u6d4f\u89c8\u5668\u5185\u6838\u8fc7\u8001\uff0c\u8bf7\u66f4\u65b0\u7248\u672c\u6216\u4f7f\u7528\u4e3b\u6d41\u6d4f\u89c8\u5668\uff0c\u63a8\u8350\u003c\u0061\u0020\u0068\u0072\u0065\u0066\u003d\u0022\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0077\u0077\u0077\u002e\u006d\u0069\u0063\u0072\u006f\u0073\u006f\u0066\u0074\u002e\u0063\u006f\u006d\u002f\u007a\u0068\u002d\u0063\u006e\u002f\u0065\u0064\u0067\u0065\u0022\u0020\u0074\u0061\u0072\u0067\u0065\u0074\u003d\u0022\u0076\u0069\u0065\u0077\u005f\u0077\u0069\u006e\u0064\u006f\u0077\u0022\u003e\u0065\u0064\u0067\u0065\u6d4f\u89c8\u5668\u003c\u002f\u0061\u003e',
                            'red');
                        stop = true;
                        return;
                    }
                    if (isMobile) {
                        logs.addLog('手机浏览器不保证能正常运行此脚本', 'orange');
                    }
                    _d.addEventListener('visibilitychange', function () {
                        let isH = _d.hidden;
                        if (!isH) {
                            logs.addLog('挂机功能不稳定，不建议长时间最小化窗口', 'orange');
                        }
                    });
                    _d.getElementById('unrivalRate').value = rate;
                     _d.getElementById('updateToken').onclick = function () {
                         var token = _d.getElementById('token').value;
                           logs.addLog('题库token已更新为' +token, 'green');
                         GM_setValue('tikutoken', token);
                    }
                    _d.getElementById('updateRateButton').onclick = function () {
                        let urate = _d.getElementById('unrivalRate').value;
                        if (parseFloat(urate) == parseInt(urate)) {
                            urate = parseInt(urate);
                        } else {
                            urate = parseFloat(urate);
                        }
                        GM_setValue('unrivalrate', urate);
                        rate = urate;
                        if (urate > 0) {
                            logs.addLog('视频倍速已更新为' + urate + '倍，将在3秒内生效', 'green');
                        } else {
                            logs.addLog('奇怪的倍速，将会自动跳过视频任务', 'orange');
                        }
                    }
                    _d.getElementById('backGround').onclick = function () {
                        logs.addLog('挂机激活成功，您现在可以最小化页面了', 'green');
                        _w.top.backNow = 1;
                    }
                    _d.getElementById('reviewModeButton').onclick = function () {
                        let reviewButton = _d.getElementById('reviewModeButton');
                        if (reviewButton.getAttribute('class') == 'btn btn-default') {
                            _d.getElementById('reviewModeButton').setAttribute('class', 'btn btn-success');
                            logs.addLog('复习模式已开启，遇到已完成的视频任务不会跳过', 'green');
                            GM_setValue('unrivalreview', '1');
                            _w.top.unrivalReviewMode = '1';
                        } else {
                            _d.getElementById('reviewModeButton').setAttribute('class', 'btn btn-default');
                            logs.addLog('复习模式已关闭，遇到已完成的视频任务会自动跳过', 'green');
                            GM_setValue('unrivalreview', '0');
                            _w.top.unrivalReviewMode = '0';
                        }
                    }
                    _d.getElementById('autoDoWorkButton').onclick = function () {
                        let autoDoWorkButton = _d.getElementById('autoDoWorkButton');
                        if (autoDoWorkButton.getAttribute('class') == 'btn btn-default') {
                            _d.getElementById('autoDoWorkButton').setAttribute('class', 'btn btn-success');
                            logs.addLog('自动做章节测试已开启，将会自动做章节测试', 'green');
                            GM_setValue('unrivaldowork', '1');
                            _w.top.unrivalDoWork = '1';
                        } else {
                            _d.getElementById('autoDoWorkButton').setAttribute('class', 'btn btn-default');
                            logs.addLog('自动做章节测试已关闭，将不会自动做章节测试', 'green');
                            GM_setValue('unrivaldowork', '0');
                            _w.top.unrivalDoWork = '0';
                        }
                    }
                    _d.getElementById('autoSubmitButton').onclick = function () {
                        let autoSubmitButton = _d.getElementById('autoSubmitButton');
                        if (autoSubmitButton.getAttribute('class') == 'btn btn-default') {
                            _d.getElementById('autoSubmitButton').setAttribute('class', 'btn btn-success');
                            logs.addLog('符合提交标准的章节测试将会自动提交', 'green');
                            GM_setValue('unrivalautosubmit', '1');
                            _w.top.unrivalAutoSubmit = '1';
                        } else {
                            _d.getElementById('autoSubmitButton').setAttribute('class', 'btn btn-default');
                            logs.addLog('章节测试将不会自动提交', 'green');
                            GM_setValue('unrivalautosubmit', '0');
                            _w.top.unrivalAutoSubmit = '0';
                        }
                    }
                    _d.getElementById('autoSaveButton').onclick = function () {
                        let autoSaveButton = _d.getElementById('autoSaveButton');
                        if (autoSaveButton.getAttribute('class') == 'btn btn-default') {
                            _d.getElementById('autoSaveButton').setAttribute('class', 'btn btn-success');
                            logs.addLog('不符合提交标准的章节测试将会自动保存', 'green');
                            GM_setValue('unrivalautosave', '1');
                            _w.top.unrivalAutoSave = '1';
                        } else {
                            _d.getElementById('autoSaveButton').setAttribute('class', 'btn btn-default');
                            logs.addLog('不符合提交标准的章节测试将不会自动保存，等待用户自己操作', 'green');
                            GM_setValue('unrivalautosave', '0');
                            _w.top.unrivalAutoSave = '0';
                        }
                    }
                    _d.getElementById('videoTimeButton').onclick = function () {
                        _d.getElementById('videoTime').style.display = 'block';
                        _d.getElementById('videoTimeContent').src = _p +
                            '//stat2-ans.chaoxing.com/task/s/index?courseid=' + courseId + '&clazzid=' +
                            classId;
                    }
                }
            }, 100),
            loopjob = () => {
                if (_w.top.unrivalScriptList.length > 1) {
                    logs.addLog('您同时开启了多个刷课脚本，会挂科，会挂科，会挂科，会挂科，会挂科，会挂科，会挂科，会挂科', 'red');
                }
                if (cVersion < 8.6 * 10) {
                    logs.addLog(
                        '\u60a8\u7684\u6d4f\u89c8\u5668\u5185\u6838\u8fc7\u8001\uff0c\u8bf7\u66f4\u65b0\u7248\u672c\u6216\u4f7f\u7528\u4e3b\u6d41\u6d4f\u89c8\u5668\uff0c\u63a8\u8350\u003c\u0061\u0020\u0068\u0072\u0065\u0066\u003d\u0022\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0077\u0077\u0077\u002e\u006d\u0069\u0063\u0072\u006f\u0073\u006f\u0066\u0074\u002e\u0063\u006f\u006d\u002f\u007a\u0068\u002d\u0063\u006e\u002f\u0065\u0064\u0067\u0065\u0022\u0020\u0074\u0061\u0072\u0067\u0065\u0074\u003d\u0022\u0076\u0069\u0065\u0077\u005f\u0077\u0069\u006e\u0064\u006f\u0077\u0022\u003e\u0065\u0064\u0067\u0065\u6d4f\u89c8\u5668\u003c\u002f\u0061\u003e',
                        'red');
                    stop = true;
                    return;
                }
                if (stop) {
                    return;
                }
                let missionli = missionList;
                if (missionli == []) {
                    setTimeout(loopjob, 500);
                    return;
                }
                for (let itemName in missionli) {
                    if (missionli[itemName]['running']) {
                        setTimeout(loopjob, 500);
                        return;
                    }
                }
                for (let itemName in missionli) {
                    if (!missionli[itemName]['done']) {
                        switch (missionli[itemName]['type']) {
                            case 'video':
                                doVideo(missionli[itemName]);
                                break;
                            case 'document':
                                doDocument(missionli[itemName]);
                                break;
                            case 'work':
                                doWork(missionli[itemName]);
                                break;
                        }
                        setTimeout(loopjob, 500);
                        return;
                    }
                }
                if (busyThread <= 0) {
                    if (jumpType != 2) {
                        _w.top.jump = true;
                        logs.addLog('所有任务处理完毕，5秒后自动下一章', 'green');
                    } else {
                        logs.addLog('所有任务处理完毕，用户设置为不跳转，脚本已结束运行，如需自动跳转，请编辑脚本代码参数', 'green');
                    }
                    clearInterval(loopjob);
                } else {
                    setTimeout(loopjob, 500);
                }
            },
            readyCheck = () => {
                setTimeout(function () {
                    try {
                        if (!isCat) {
                            logs.addLog(
                                '推荐使用<a href="https://docs.scriptcat.org/use/#%E5%AE%89%E8%A3%85%E6%89%A9%E5%B1%95" target="view_window">脚本猫</a>运行此脚本，使用其他脚本管理器不保证能正常运行',
                                'orange');
                        }
                        if (_w.top.unrivalReviewMode == '1') {
                            logs.addLog('复习模式已开启，遇到已完成的视频任务不会跳过', 'green');
                            _d.getElementById('reviewModeButton').setAttribute('class', ['btn btn-default',
                                'btn btn-success'
                            ][_w.top.unrivalReviewMode]);
                        }
                        if (_w.top.unrivalDoWork == '1') {
                            logs.addLog('自动做章节测试已开启，将会自动做章节测试', 'green');
                            _d.getElementById('autoDoWorkButton').setAttribute('class', ['btn btn-default',
                                'btn btn-success'
                            ][_w.top.unrivalDoWork]);
                        }
                        _d.getElementById('autoSubmitButton').setAttribute('class', ['btn btn-default',
                            'btn btn-success'
                        ][_w.top.unrivalAutoSubmit]);
                        _d.getElementById('autoSaveButton').setAttribute('class', ['btn btn-default',
                            'btn btn-success'
                        ][_w.top.unrivalAutoSave]);
                    } catch (e) {
                        console.log(e);
                        readyCheck();
                        return;
                    }
                }, 500);
            }
        readyCheck();
        try {
            var pageData = JSON.parse(param);
        } catch (e) {
            if (jumpType != 2) {
                _w.top.jump = true;
                logs.addLog('此页无任务，5秒后自动下一章', 'green');
            } else {
                logs.addLog('此页无任务，用户设置为不跳转，脚本已结束运行，如需自动跳转，请编辑脚本代码参数', 'green');
            }
            return;
        }
        var data = pageData['defaults'],
            jobList = [],
            classId = data['clazzId'],
            chapterId = data['knowledgeid'],
            reportUrl = data['reportUrl'],
            ktoken = data['ktoken'];
        UID = UID || data['userid'];
        FID = FID || data['fid'];
        for (let i = 0, l = pageData['attachments'].length; i < l; i++) {
            let item = pageData['attachments'][i];
            if (item['job'] != true || item['isPassed'] == true) {
                if (_w.top.unrivalReviewMode == '1' && item['type'] == 'video') {
                    jobList.push(item);
                }
                continue;
            } else {
                jobList.push(item);
            }
        }
        var video_getReady = (item) => {
            let statusUrl = _p + '//' + _h + '/ananas/status/' + item['property']['objectid'] + '?k=' +
                FID + '&flag=normal&_dc=' + String(Math.round(new Date())),
                doubleSpeed = item['property']['doublespeed'];
            busyThread += 1;
            GM_xmlhttpRequest({
                method: "get",
                headers: {
                    'Host': _h,
                    'Referer': vrefer,
                    'Sec-Fetch-Site': 'same-origin'
                },
                url: statusUrl,
                onload: function (res) {
                    try {
                        busyThread -= 1;
                        let videoInfo = JSON.parse(res.responseText),
                            duration = videoInfo['duration'],
                            dtoken = videoInfo['dtoken'];
                        if (duration == undefined) {
                            _d.getElementById('joblist').innerHTML += `
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    ` + '[无效视频]' + item['property']['name'] + `
                                </div>
                            </div>`
                            return;
                        }
                        missionList['m' + item['jobid']] = {
                            'module': item['property']['module'],
                            'type': 'video',
                            'dtoken': dtoken,
                            'duration': duration,
                            'objectId': item['property']['objectid'],
                            'rt': item['property']['rt'] || '0.9',
                            'otherInfo': item['otherInfo'],
                            'doublespeed': doubleSpeed,
                            'jobid': item['jobid'],
                            'name': item['property']['name'],
                            'done': false,
                            'running': false
                        };
                        _d.getElementById('joblist').innerHTML += `
                            
                            <div class="panel panel-default">
                            
                                <div class="panel-body">
                                    ` + '[视频]' + item['property']['name'] + `
                                </div>
                            </div>`
                    } catch (e) { }
                },
                onerror: function (err) {
                    console.log(err);
                    if (err.error.indexOf('@connect list') >= 0) {
                        logs.addLog('请添加安全网址，将 【 //@connect      ' + _h +
                            ' 】方括号里的内容(不包括方括号)添加到脚本代码内指定位置，否则脚本无法正常运行，如图所示：', 'red');
                        logs.addLog(
                            '<img src="https://pan-yz.chaoxing.com/thumbnail/0,0,0/609a8b79cbd6a91d10c207cf2b5f368d">'
                        );
                        stop = true;
                    } else {
                        logs.addLog('获取任务详情失败', 'red');
                        logs.addLog('错误原因：' + err.error, 'red');
                    }
                }
            });
        },
            doVideo = (item) => {
                if (rate <= 0) {
                    missionList['m' + item['jobid']]['running'] = true;
                    logs.addLog('奇怪的倍速，视频已自动跳过', 'orange');
                    setTimeout(function () {
                        missionList['m' + item['jobid']]['running'] = false;
                        missionList['m' + item['jobid']]['done'] = true;
                    }, 5000);
                    return;
                }
                if (allowBackground && backGround) {
                    if (_w.top.document.getElementsByClassName('catalog_points_sa').length > 0 || _w.top.document
                        .getElementsByClassName('lock').length > 0) {
                        logs.addLog('您已安装超星挂机小助手，但此课程可能为闯关模式，不支持后台挂机，将为您在线完成', 'blue');
                    } else {
                        item['userid'] = UID;
                        item['classId'] = classId;
                        item['review'] = [false, true][_w.top.unrivalReviewMode];
                        item['reportUrl'] = reportUrl;
                        item['rt'] = missionList['m' + item['jobid']]['rt'];
                        GM_setValue('unrivalBackgroundVideo', item);
                        _d.cookie = "videojs_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        logs.addLog(
                            '您已安装超星挂机小助手，已添加至后台任务，<a href="unrivalxxtbackground/" target="view_window">点我查看后台</a>',
                            'green');
                        missionList['m' + item['jobid']]['running'] = true;
                        setTimeout(function () {
                            missionList['m' + item['jobid']]['running'] = false;
                            missionList['m' + item['jobid']]['done'] = true;
                        }, 5000);
                        return;
                    }
                }
                let videojs_id = String(parseInt(Math.random() * 9999999));
                _d.cookie = 'videojs_id=' + videojs_id + ';path=/'
                logs.addLog('开始刷视频：' + item['name'] + '，倍速：' + String(rate) + '倍');
                logs.addLog('视频观看信息每60秒上报一次，请耐心等待', 'green');
                logs.addLog('如遇脚本使用异常情况，请检查脚本版本是否为最新版，<a href="https://scriptcat.org/script-show-page/878" target="view_window">点我(脚本猫)</a>或<a href="https://greasyfork.org/zh-CN/scripts/462748" target="view_window">点我(greasyfork)</a>检查', 'orange');
                if (disableMonitor) {
                    logs.addLog('解除多端学习监控有清除进度风险，请谨慎使用', 'orange');
                }
                let dtype = 'Video';
                if (item['module'].includes('audio')) {
                    dtype = 'Audio';
                    rt = '';
                }
                let playTime = 0,
                    playsTime = 0,
                    isdrag = '3',
                    times = 0,
                    encUrl = '',
                    first = true,
                    loop = setInterval(function () {
                        if (rate <= 0) {
                            clearInterval(loop);
                            logs.addLog('奇怪的倍速，视频已自动跳过', 'orange');
                            setTimeout(function () {
                                missionList['m' + item['jobid']]['running'] = false;
                                missionList['m' + item['jobid']]['done'] = true;
                            }, 5000);
                            return;
                        } else if (item['doublespeed'] == 0 && rate > 1 && _w.top.unrivalReviewMode == '0') {
                            //rate = 1;
                            //logs.addLog('该视频不允许倍速播放，已恢复至一倍速，高倍速会被清空进度挂科，勿存侥幸', 'red');
                        }
                        rt = missionList['m' + item['jobid']]['rt'];
                        playsTime += rate;
                        playTime = Math.ceil(playsTime);
                        if (times == 0 || times % 30 == 0 || playTime >= item['duration']) {
                            if (first) {
                                playTime = 0;
                            }
                            if (playTime >= item['duration']) {
                                clearInterval(loop);
                                playTime = item['duration'];
                                isdrag = '4';
                            } else if (playTime > 0) {
                                isdrag = '0';
                            }
                            encUrl = host + 'chaoXing/v3/getEnc.php?classid=' + classId +
                                '&playtime=' + playTime + '&duration=' + item['duration'] + '&objectid=' + item[
                                'objectId'] + '&jobid=' + item['jobid'] + '&uid=' + UID;
                            busyThread += 1;
                            var _bold_playTime = playTime;
                            function ecOnload(res) {
                                let enc = '';
                                if (res && res.status == 200) {
                                    enc = res.responseText;
                                    if (enc.includes('--#')) {
                                        let warnInfo = enc.match(new RegExp('--#(.*?)--#', "ig"))[0]
                                            .replace(/--#/ig, '');
                                        logs.addLog(warnInfo, 'red');
                                        enc = enc.replace(/--#(.*?)--#/ig, '');
                                    }
                                    if (enc.indexOf('.stop') >= 0) {
                                        clearInterval(loop);
                                        stop = true;
                                        return;
                                    }
                                } else {
                                    strEc = `[${classId}][${UID}][${item['jobid']}][${item['objectId']}][${playTime * 1000}][d_yHJ!$pdA~5][${item['duration'] * 1000}][0_${item['duration']}]`,
                                        enc = jq.md5(strEc);
                                }
                                if (enc.length != 32) {
                                    clearInterval(loop);
                                    stop = true;
                                    return;
                                }
                                let reportsUrl = reportUrl + '/' + item['dtoken'] +
                                    '?clazzId=' + classId + '&playingTime=' + playTime +
                                    '&duration=' + item['duration'] + '&clipTime=0_' + item[
                                    'duration'] + '&objectId=' + item['objectId'] +
                                    '&otherInfo=' + item['otherInfo'] + '&jobid=' + item[
                                    'jobid'] + '&userid=' + UID + '&isdrag=' + isdrag +
                                    '&view=pc&enc=' + enc + '&rt=' + rt + '&dtype=' + dtype +
                                    '&_t=' + String(Math.round(new Date()));
                                GM_xmlhttpRequest({
                                    method: "get",
                                    headers: {
                                        'Host': _h,
                                        'Referer': vrefer,
                                        'Sec-Fetch-Site': 'same-origin',
                                        'Content-Type': 'application/json'
                                    },
                                    url: reportsUrl,
                                    onload: function (res) {
                                        try {
                                            let today = new Date(),
                                                todayStr = today.getFullYear() +
                                                    'd' + today.getMonth() + 'd' + today
                                                        .getDate(),
                                                timelong = GM_getValue(
                                                    'unrivaltimelong', {});
                                            if (timelong[UID] == undefined ||
                                                timelong[UID]['today'] != todayStr
                                            ) {
                                                timelong[UID] = {
                                                    'time': 0,
                                                    'today': todayStr
                                                };
                                            } else {
                                                timelong[UID]['time']++;
                                            }
                                            GM_setValue('unrivaltimelong',
                                                timelong);
                                            busyThread -= 1;
                                            if (timelong[UID]['time'] / 60 > 22 &&
                                                item['doublespeed'] == 0 && _w.top
                                                    .unrivalReviewMode == '0') {
                                                clearInterval(loop);
                                                logs.addLog(
                                                    '今日学习时间过长，继续学习会导致清空进度，请明天再来',
                                                    'red');
                                                setTimeout(function () {
                                                    missionList['m' + item[
                                                        'jobid']][
                                                        'running'
                                                    ] = false;
                                                    missionList['m' + item[
                                                        'jobid']][
                                                        'done'
                                                    ] = true;
                                                }, 5000);
                                                return;
                                            }
                                            let ispass = JSON.parse(res
                                                .responseText);
                                            first = false;
                                            if (ispass['isPassed'] && _w.top
                                                .unrivalReviewMode == '0') {
                                                logs.addLog('视频任务已完成', 'green');
                                                missionList['m' + item['jobid']]['running'] = false;
                                                missionList['m' + item['jobid']]['done'] = true;
                                                clearInterval(loop);
                                                return;
                                            } else if (isdrag == '4') {
                                                if (_w.top.unrivalReviewMode ==
                                                    '1') {
                                                    logs.addLog('视频已观看完毕', 'green');
                                                } else {
                                                    logs.addLog('视频已观看完毕，但视频任务未完成',
                                                        'red');
                                                }
                                                missionList['m' + item['jobid']][
                                                    'running'
                                                ] = false;
                                                missionList['m' + item['jobid']][
                                                    'done'
                                                ] = true;
                                                try {
                                                    clearInterval(loop);
                                                } catch (e) {

                                                }
                                            } else {
                                                logs.addLog(item['name'] + '已观看' +
                                                    _bold_playTime + '秒，剩余大约' +
                                                    String(item['duration'] -
                                                        _bold_playTime) + '秒');
                                            }
                                        } catch (e) {
                                            console.log(e);
                                            if (res.responseText.indexOf('验证码') >=
                                                0) {
                                                logs.addLog('已被超星风控，请<a href="' +
                                                    reportsUrl +
                                                    '" target="_blank">点我处理</a>，60秒后自动刷新页面',
                                                    'red');
                                                missionList['m' + item['jobid']][
                                                    'running'
                                                ] = false;
                                                clearInterval(loop);
                                                stop = true;
                                                setTimeout(function () {
                                                    _l.reload();
                                                }, 60000);
                                                return;
                                            }
                                            logs.addLog('超星返回错误信息，十秒后重试', 'red');
                                            times = -10;
                                            return;
                                        }
                                    },
                                    onerror: function (err) {
                                        console.log(err);
                                        if (err.error.indexOf('@connect list') >=
                                            0) {
                                            logs.addLog(
                                                '请添加安全网址，将 【 //@connect      ' +
                                                _h +
                                                ' 】方括号里的内容(不包括方括号)添加到脚本代码内指定位置，否则脚本无法正常运行，如图所示：',
                                                'red');
                                            logs.addLog(
                                                '<img src="https://pan-yz.chaoxing.com/thumbnail/0,0,0/609a8b79cbd6a91d10c207cf2b5f368d">'
                                            );
                                            stop = true;
                                        } else {
                                            logs.addLog('观看视频失败', 'red');
                                            logs.addLog('错误原因：' + err.error, 'red');
                                        }
                                        missionList['m' + item['jobid']][
                                            'running'
                                        ] = false;
                                        clearInterval(loop);
                                    }
                                });
                            };
                            GM_xmlhttpRequest({
                                method: "get",
                                url: encUrl,
                                timeout: 2000,
                                onload: ecOnload,
                                onerror: function (err) {
                                    console.log(err);
                                    ecOnload(false);
                                },
                                ontimeout: function (err) {
                                    console.log(err);
                                    ecOnload(false);
                                }
                            });
                        }
                        times += 1;
                    }, 1000);
                missionList['m' + item['jobid']]['running'] = true;
            },
            doDocument = (item) => {
                missionList['m' + item['jobid']]['running'] = true;
                logs.addLog('开始刷文档：' + item['name']);
                setTimeout(function () {
                    busyThread += 1;
                    GM_xmlhttpRequest({
                        method: "get",
                        url: _p + '//' + _h + '/ananas/job/document?jobid=' + item['jobid'] +
                            '&knowledgeid=' + chapterId + '&courseid=' + courseId + '&clazzid=' +
                            classId + '&jtoken=' + item['jtoken'],
                        onload: function (res) {
                            try {
                                busyThread -= 1;
                                let ispass = JSON.parse(res.responseText);
                                if (ispass['status']) {
                                    logs.addLog('文档任务已完成', 'green');
                                } else {
                                    logs.addLog('文档已阅读完成，但任务点未完成', 'red');
                                }

                            } catch (err) {
                                console.log(err);
                                console.log(res.responseText);
                                logs.addLog('解析文档内容失败', 'red');
                            }
                            missionList['m' + item['jobid']]['running'] = false;
                            missionList['m' + item['jobid']]['done'] = true;
                        },
                        onerror: function (err) {
                            console.log(err);
                            if (err.error.indexOf('@connect list') >= 0) {
                                logs.addLog('请添加安全网址，将 【 //@connect      ' + _h +
                                    ' 】方括号里的内容(不包括方括号)添加到脚本代码内指定位置，否则脚本无法正常运行，如图所示：', 'red');
                                logs.addLog(
                                    '<img src="https://pan-yz.chaoxing.com/thumbnail/0,0,0/609a8b79cbd6a91d10c207cf2b5f368d">'
                                );
                                stop = true;
                            } else {
                                logs.addLog('阅读文档失败', 'red');
                                logs.addLog('错误原因：' + err.error, 'red');
                            }
                            missionList['m' + item['jobid']]['running'] = false;
                            missionList['m' + item['jobid']]['done'] = true;
                        }
                    });
                }, parseInt(Math.random() * 2000 + 9000, 10))
            },
            doWork = (item) => {
                missionList['m' + item['jobid']]['running'] = true;
                logs.addLog('开始刷章节测试：' + item['name']);
                logs.addLog('您设置的答题正确率为：' + String(accuracy) + '%，只有在高于此正确率时才会提交测试', 'blue');
                _d.getElementById('workPanel').style.display = 'block';
                _d.getElementById('frame_content').src = _p + '//' + _h + '/work/phone/work?workId=' + item['jobid']
                    .replace('work-', '') + '&courseId=' + courseId + '&clazzId=' + classId + '&knowledgeId=' +
                    chapterId + '&jobId=' + item['jobid'] + '&enc=' + item['enc'];
                _w.top.unrivalWorkInfo = '';
                _w.top.unrivalDoneWorkId = '';
                setInterval(function () {
                    if (_w.top.unrivalWorkInfo != '') {
                        logs.addLog(_w.top.unrivalWorkInfo);
                        _w.top.unrivalWorkInfo = '';
                    }
                }, 100);
                let checkcross = setInterval(function () {
                    if (_w.top.unrivalWorkDone == false) {
                        clearInterval(checkcross);
                        return;
                    }
                    let ifW = _d.getElementById('frame_content').contentWindow;
                    try {
                        ifW.location.href;
                    } catch (e) {
                        console.log(e);
                        if (e.message.indexOf('cross-origin') != -1) {
                            clearInterval(checkcross);
                            _w.top.unrivalWorkDone = true;
                            return;
                        }
                    }
                }, 2000);
                let workDoneInterval = setInterval(function () {
                    if (_w.top.unrivalWorkDone) {
                        _w.top.unrivalWorkDone = false;
                        clearInterval(workDoneInterval);
                        _w.top.unrivalDoneWorkId = '';
                        _d.getElementById('workPanel').style.display = 'none';
                        _d.getElementById('frame_content').src = '';
                        setTimeout(function () {
                            missionList['m' + item['jobid']]['running'] = false;
                            missionList['m' + item['jobid']]['done'] = true;
                        }, 5000);
                    }
                }, 500);
            },
            missionList = [];
        if (jobList.length <= 0) {
            if (jumpType != 2) {
                _w.top.jump = true;
                logs.addLog('此页无任务，5秒后自动下一章', 'green');
            } else {
                logs.addLog('此页无任务，用户设置为不跳转，脚本已结束运行，如需自动跳转，请编辑脚本代码参数', 'green');
            }
            return;
        }
        for (let i = 0, l = jobList.length; i < l; i++) {
            let item = jobList[i];
            if (item['type'] == 'video') {
                video_getReady(item);
            } else if (item['type'] == 'document') {
                missionList['m' + item['jobid']] = {
                    'type': 'document',
                    'jtoken': item['jtoken'],
                    'jobid': item['jobid'],
                    'name': item['property']['name'],
                    'done': false,
                    'running': false
                };
                _d.getElementById('joblist').innerHTML += `
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    ` + '[文档]' + item['property']['name'] + `
                                </div>
                            </div>`
            } else if (item['type'] == 'workid' && _w.top.unrivalDoWork == '1') {
                missionList['m' + item['jobid']] = {
                    'type': 'work',
                    'workid': item['property']['workid'],
                    'jobid': item['jobid'],
                    'name': item['property']['title'],
                    'enc': item['enc'],
                    'done': false,
                    'running': false
                };
                _d.getElementById('joblist').innerHTML += `
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    ` + '[章节测试]' + item['property']['title'] + `
                                </div>
                            </div>`
            } else {
                try {
                    let jobName = item['property']['name'];
                    if (jobName == undefined) {
                        jobName = item['property']['title'];
                    }
                    _d.getElementById('joblist').innerHTML += `
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    ` + '已跳过：' + jobName + `
                                </div>
                            </div>`
                } catch (e) { }
            }
        }
        loopjob();
    } else if (_l.href.includes("mycourse/studentstudy")) {
        var audiofile =
            'data:audio/ogg;base64,T2dnUwACAAAAAAAAAABwRPFFAAAAAGFtEqwBHgF2b3JiaXMAAAAAAUAfAAAAAAAAUHgAAAAAAACZAU9nZ1MAAAAAAAAAAAAAcETxRQEAAAA7J4IBDP8F////////////tQN2b3JiaXMvAAAAWGlwaC5PcmcgbGliVm9yYmlzIEkgMjAxNDAxMjIgKFR1cnBha8OkcsOkamlpbikGAAAAJQAAAEVOQ09ERVI9U291bmQgU3R1ZGlvLCBsaWJWb3JiaXMgMS4zLjEbAAAAQUxCVU0gQVJUSVNUPUFkdmVudHVyZSBMYW5kFAAAAEFMQlVNPUFkdmVudHVyZSBMYW5kIQAAAEVOQ09ESU5HIEFQUExJQ0FUSU9OPVNvdW5kIFN0dWRpbxUAAABBUlRJU1Q9QWR2ZW50dXJlIExhbmQjAAAAVElUTEU9RW1wdHkgTG9vcCBGb3IgSlMgUGVyZm9ybWFuY2UBBXZvcmJpcxJCQ1YBAAABAAxSFCElGVNKYwiVUlIpBR1jUFtHHWPUOUYhZBBTiEkZpXtPKpVYSsgRUlgpRR1TTFNJlVKWKUUdYxRTSCFT1jFloXMUS4ZJCSVsTa50FkvomWOWMUYdY85aSp1j1jFFHWNSUkmhcxg6ZiVkFDpGxehifDA6laJCKL7H3lLpLYWKW4q91xpT6y2EGEtpwQhhc+211dxKasUYY4wxxsXiUyiC0JBVAAABAABABAFCQ1YBAAoAAMJQDEVRgNCQVQBABgCAABRFcRTHcRxHkiTLAkJDVgEAQAAAAgAAKI7hKJIjSZJkWZZlWZameZaouaov+64u667t6roOhIasBADIAAAYhiGH3knMkFOQSSYpVcw5CKH1DjnlFGTSUsaYYoxRzpBTDDEFMYbQKYUQ1E45pQwiCENInWTOIEs96OBi5zgQGrIiAIgCAACMQYwhxpBzDEoGIXKOScggRM45KZ2UTEoorbSWSQktldYi55yUTkompbQWUsuklNZCKwUAAAQ4AAAEWAiFhqwIAKIAABCDkFJIKcSUYk4xh5RSjinHkFLMOcWYcowx6CBUzDHIHIRIKcUYc0455iBkDCrmHIQMMgEAAAEOAAABFkKhISsCgDgBAIMkaZqlaaJoaZooeqaoqqIoqqrleabpmaaqeqKpqqaquq6pqq5seZ5peqaoqp4pqqqpqq5rqqrriqpqy6ar2rbpqrbsyrJuu7Ks256qyrapurJuqq5tu7Js664s27rkearqmabreqbpuqrr2rLqurLtmabriqor26bryrLryratyrKua6bpuqKr2q6purLtyq5tu7Ks+6br6rbqyrquyrLu27au+7KtC7vourauyq6uq7Ks67It67Zs20LJ81TVM03X9UzTdVXXtW3VdW1bM03XNV1XlkXVdWXVlXVddWVb90zTdU1XlWXTVWVZlWXddmVXl0XXtW1Vln1ddWVfl23d92VZ133TdXVblWXbV2VZ92Vd94VZt33dU1VbN11X103X1X1b131htm3fF11X11XZ1oVVlnXf1n1lmHWdMLqurqu27OuqLOu+ruvGMOu6MKy6bfyurQvDq+vGseu+rty+j2rbvvDqtjG8um4cu7Abv+37xrGpqm2brqvrpivrumzrvm/runGMrqvrqiz7uurKvm/ruvDrvi8Mo+vquirLurDasq/Lui4Mu64bw2rbwu7aunDMsi4Mt+8rx68LQ9W2heHVdaOr28ZvC8PSN3a+AACAAQcAgAATykChISsCgDgBAAYhCBVjECrGIIQQUgohpFQxBiFjDkrGHJQQSkkhlNIqxiBkjknIHJMQSmiplNBKKKWlUEpLoZTWUmotptRaDKG0FEpprZTSWmopttRSbBVjEDLnpGSOSSiltFZKaSlzTErGoKQOQiqlpNJKSa1lzknJoKPSOUippNJSSam1UEproZTWSkqxpdJKba3FGkppLaTSWkmptdRSba21WiPGIGSMQcmck1JKSamU0lrmnJQOOiqZg5JKKamVklKsmJPSQSglg4xKSaW1kkoroZTWSkqxhVJaa63VmFJLNZSSWkmpxVBKa621GlMrNYVQUgultBZKaa21VmtqLbZQQmuhpBZLKjG1FmNtrcUYSmmtpBJbKanFFluNrbVYU0s1lpJibK3V2EotOdZaa0ot1tJSjK21mFtMucVYaw0ltBZKaa2U0lpKrcXWWq2hlNZKKrGVklpsrdXYWow1lNJiKSm1kEpsrbVYW2w1ppZibLHVWFKLMcZYc0u11ZRai621WEsrNcYYa2415VIAAMCAAwBAgAlloNCQlQBAFAAAYAxjjEFoFHLMOSmNUs45JyVzDkIIKWXOQQghpc45CKW01DkHoZSUQikppRRbKCWl1losAACgwAEAIMAGTYnFAQoNWQkARAEAIMYoxRiExiClGIPQGKMUYxAqpRhzDkKlFGPOQcgYc85BKRljzkEnJYQQQimlhBBCKKWUAgAAChwAAAJs0JRYHKDQkBUBQBQAAGAMYgwxhiB0UjopEYRMSielkRJaCylllkqKJcbMWomtxNhICa2F1jJrJcbSYkatxFhiKgAA7MABAOzAQig0ZCUAkAcAQBijFGPOOWcQYsw5CCE0CDHmHIQQKsaccw5CCBVjzjkHIYTOOecghBBC55xzEEIIoYMQQgillNJBCCGEUkrpIIQQQimldBBCCKGUUgoAACpwAAAIsFFkc4KRoEJDVgIAeQAAgDFKOSclpUYpxiCkFFujFGMQUmqtYgxCSq3FWDEGIaXWYuwgpNRajLV2EFJqLcZaQ0qtxVhrziGl1mKsNdfUWoy15tx7ai3GWnPOuQAA3AUHALADG0U2JxgJKjRkJQCQBwBAIKQUY4w5h5RijDHnnENKMcaYc84pxhhzzjnnFGOMOeecc4wx55xzzjnGmHPOOeecc84556CDkDnnnHPQQeicc845CCF0zjnnHIQQCgAAKnAAAAiwUWRzgpGgQkNWAgDhAACAMZRSSimllFJKqKOUUkoppZRSAiGllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimVUkoppZRSSimllFJKKaUAIN8KBwD/BxtnWEk6KxwNLjRkJQAQDgAAGMMYhIw5JyWlhjEIpXROSkklNYxBKKVzElJKKYPQWmqlpNJSShmElGILIZWUWgqltFZrKam1lFIoKcUaS0qppdYy5ySkklpLrbaYOQelpNZaaq3FEEJKsbXWUmuxdVJSSa211lptLaSUWmstxtZibCWlllprqcXWWkyptRZbSy3G1mJLrcXYYosxxhoLAOBucACASLBxhpWks8LR4EJDVgIAIQEABDJKOeecgxBCCCFSijHnoIMQQgghREox5pyDEEIIIYSMMecghBBCCKGUkDHmHIQQQgghhFI65yCEUEoJpZRSSucchBBCCKWUUkoJIYQQQiillFJKKSGEEEoppZRSSiklhBBCKKWUUkoppYQQQiillFJKKaWUEEIopZRSSimllBJC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',
            audioPlayer = new Audio(audiofile);
        _w.top.backNow = 0;
        audioPlayer.loop = true;
        _w.audioPlayer = audioPlayer;
        setInterval(function () {
            try {
                _w.jQuery.fn.viewer.Constructor.prototype.show = () => { };
            } catch (e) {
            }
        }, 1000);
        try {
            _w.unrivalScriptList.push('Fuck me please');
        } catch (e) {
            _w.unrivalScriptList = ['Fuck me please'];
        }
        function checkOffline() {
            let dleft = _d.getElementsByClassName('left');
            if (dleft.length == 1) {
                let img = dleft[0].getElementsByTagName('img');
                if (img.length == 1) {
                    if (img[0].src.indexOf('loading.gif') != -1) {
                        return true;
                    }
                }
            }
            return false;
        }
        setInterval(function () {
            if (checkOffline()) {
                setTimeout(function () {
                    if (checkOffline()) {
                        _l.reload();
                    }
                }, 10000)
            }
        }, 3000);
        _d.addEventListener('visibilitychange', function () {
            var c = 0;
            if (_w.top.backNow == 0) {
                _d.title = '⚠️请先激活挂机';
                return
            } else {
                _d.title = '学生学习页面';
            }
            if (_d.hidden) {
                audioPlayer.play();
                var timer = setInterval(function () {
                    if (c) {
                        _d.title = '挂机中';
                        c = 0;
                    } else {
                        _d.title = '挂机中';
                        c = 1;
                    }
                    if (!_d.hidden) {
                        clearInterval(timer);
                        _d.title = '学生学习页面';
                    }
                }, 1300);
            } else {
                audioPlayer.pause();
            }
        });
        _w.unrivalgetTeacherAjax = _w.getTeacherAjax;
        _w.getTeacherAjax = (courseid, classid, cid) => {
            if (cid == getQueryVariable('chapterId')) {
                return;
            }
            _w.top.unrivalPageRd = '';
            _w.unrivalgetTeacherAjax(courseid, classid, cid);
        }
        if (disableMonitor == 1) {
            _w.appendChild = _w.Element.prototype.appendChild;
            _w.Element.prototype.appendChild = function () {
                try {
                    if (arguments[0].src.indexOf('detect.chaoxing.com') > 0) {
                        return;
                    }
                } catch (e) { }
                _w.appendChild.apply(this, arguments);
            };
        }

        _w.jump = false;
        setInterval(function () {
            if (getQueryVariable('mooc2') == '1') {
                let tabs = _d.getElementsByClassName('posCatalog_select');
                for (let i = 0, l = tabs.length; i < l; i++) {
                    let tabId = tabs[i].getAttribute('id');
                    if (tabId.indexOf('cur') >= 0 && tabs[i].getAttribute('class') == 'posCatalog_select') {
                        tabs[i].setAttribute('onclick', "getTeacherAjax('" + courseId + "','" + classId +
                            "','" + tabId.replace('cur', '') + "');");
                    }
                }
            } else {
                let h4s = _d.getElementsByTagName('h4'),
                    h5s = _d.getElementsByTagName('h5');
                for (let i = 0, l = h4s.length; i < l; i++) {
                    if (h4s[i].getAttribute('id').indexOf('cur') >= 0) {
                        h4s[i].setAttribute('onclick', "getTeacherAjax('" + courseId + "','" + classId +
                            "','" + h4s[i].getAttribute('id').replace('cur', '') + "');");
                    }
                }
                for (let i = 0, l = h5s.length; i < l; i++) {
                    if (h5s[i].getAttribute('id').indexOf('cur') >= 0) {
                        h5s[i].setAttribute('onclick', "getTeacherAjax('" + courseId + "','" + classId +
                            "','" + h5s[i].getAttribute('id').replace('cur', '') + "');");
                    }
                }
            }
        }, 1000);
        setInterval(function () {
            let but = null;
            if (_w.jump) {
                _w.jump = false;
                _w.top.unrivalDoneWorkId = '';
                _w.jjump = (rd) => {
                    if (rd != _w.top.unrivalPageRd) {
                        return;
                    }
                    try {
                        setTimeout(function () {
                            if (jumpType == 1) {
                                if (getQueryVariable('mooc2') == '1') {
                                    but = _d.getElementsByClassName(
                                        'jb_btn jb_btn_92 fs14 prev_next next');
                                } else {
                                    but = _d.getElementsByClassName('orientationright');
                                }
                                try {
                                    setTimeout(function () {
                                        if (rd != _w.top.unrivalPageRd) {
                                            return;
                                        }
                                        but[0].click();
                                    }, 2000);
                                } catch (e) { }
                                return;
                            }
                            if (getQueryVariable('mooc2') == '1') {
                                let ul = _d.getElementsByClassName('prev_ul')[0],
                                    lis = ul.getElementsByTagName('li');
                                for (let i = 0, l = lis.length; i < l; i++) {
                                    if (lis[i].getAttribute('class') == 'active') {
                                        if (i + 1 >= l) {
                                            break;
                                        } else {
                                            try {
                                                lis[i + 1].click();
                                            } catch (e) { }
                                            return;
                                        }
                                    }
                                }
                                let tabs = _d.getElementsByClassName('posCatalog_select');
                                for (let i = 0, l = tabs.length; i < l; i++) {
                                    if (tabs[i].getAttribute('class') ==
                                        'posCatalog_select posCatalog_active') {
                                        while (i + 1 < tabs.length) {
                                            let nextTab = tabs[i + 1];
                                            if ((nextTab.innerHTML.includes(
                                                'icon_Completed prevTips') && _w.top
                                                    .unrivalReviewMode == '0') || nextTab
                                                        .innerHTML.includes(
                                                            'catalog_points_er prevTips')) {
                                                i++;
                                                continue;
                                            }
                                            if (nextTab.id.indexOf('cur') < 0) {
                                                i++;
                                                continue;
                                            }
                                            let clickF = setInterval(function () {
                                                if (rd != _w.top.unrivalPageRd) {
                                                    clearInterval(clickF);
                                                    return;
                                                }
                                                nextTab.click();
                                            }, 2000);
                                            break;
                                        }
                                        break;
                                    }
                                }
                            } else {
                                let div = _d.getElementsByClassName('tabtags')[0],
                                    spans = div.getElementsByTagName('span');
                                for (let i = 0, l = spans.length; i < l; i++) {
                                    if (spans[i].getAttribute('class').indexOf('currents') >=
                                        0) {
                                        if (i + 1 == l) {
                                            break;
                                        } else {
                                            try {
                                                spans[i + 1].click();
                                            } catch (e) { }
                                            return;
                                        }
                                    }
                                }
                                let tabs = _d.getElementsByTagName('span'),
                                    newTabs = [];
                                for (let i = 0, l = tabs.length; i < l; i++) {
                                    if (tabs[i].getAttribute('style') != null && tabs[i]
                                        .getAttribute('style').indexOf(
                                            'cursor:pointer;height:18px;') >= 0) {
                                        newTabs.push(tabs[i]);
                                    }
                                }
                                tabs = newTabs;
                                for (let i = 0, l = tabs.length; i < l; i++) {
                                    if (tabs[i].parentNode.getAttribute('class') ==
                                        'currents') {
                                        while (i + 1 < tabs.length) {
                                            let nextTab = tabs[i + 1].parentNode;
                                            if ((nextTab.innerHTML.includes(
                                                'roundpoint  blue') && _w.top
                                                    .unrivalReviewMode == '0') || nextTab
                                                        .innerHTML.includes('roundpointStudent  lock')
                                            ) {
                                                i++;
                                                continue;
                                            }
                                            if (nextTab.id.indexOf('cur') < 0) {
                                                i++;
                                                continue;
                                            }
                                            let clickF = setInterval(function () {
                                                if (rd != _w.top.unrivalPageRd) {
                                                    clearInterval(clickF);
                                                    return;
                                                }
                                                nextTab.click();
                                            }, 2000);
                                            break;
                                        }
                                        break;
                                    }
                                }
                            }
                        }, 2000);
                    } catch (e) { }
                }
                _w.onReadComplete1();
                setTimeout('jjump("' + _w.top.unrivalPageRd + '")', 2856);
            }
        }, 200);
    } else if (_l.href.indexOf("work/phone/doHomeWork") > 0) {
        var wIdE = _d.getElementById('workLibraryId') || _d.getElementById('oldWorkId'),
            wid = wIdE.value;
        _w.top.unrivalWorkDone = false;
        _w.aalert = _w.alert;
        _w.alert = (msg) => {
            if (msg == '保存成功') {
                _w.top.unrivalDoneWorkId = getQueryVariable('workId');
                return;
            }
            aalert(msg);
        }
        if (_w.top.unrivalDoneWorkId == getQueryVariable('workId')) {
            _w.top.unrivalWorkDone = true;
            return;
        }
        _w.confirm = (msg) => {
            return true;
        }
        var questionList = [],
            questionsElement = _d.getElementsByClassName('Py-mian1'),
            questionNum = questionsElement.length,
            totalQuestionNum = questionNum;
        for (let i = 0; i < questionNum; i++) {
            let questionElement = questionsElement[i],
                idElements = questionElement.getElementsByTagName('input'),
                questionId = '0',
                question = questionElement.getElementsByClassName('Py-m1-title fs16')[0].innerHTML;
            question = handleImgs(question).replace(/(<([^>]+)>)/ig, '').replace(/[0-9]{1,3}.\[(.*?)\]/ig, '').replaceAll('\n',
                '').replace(/^\s+/ig, '').replace(/\s+$/ig, '');
            for (let z = 0, k = idElements.length; z < k; z++) {
                try {
                    if (idElements[z].getAttribute('name').indexOf('answer') >= 0) {
                        questionId = idElements[z].getAttribute('name').replace('type', '');
                        break;
                    }
                } catch (e) {
                    console.log(e);
                    continue;
                }
            }
            if (questionId == '0' || question == '') {
                continue;
            }
            typeE = questionElement.getElementsByTagName('input');
            if (typeE == null || typeE == []) {
                continue;
            }
            let typeN = 'fuckme';
            for (let g = 0, h = typeE.length; g < h; g++) {
                if (typeE[g].id == 'answertype' + questionId.replace('answer', '').replace('check', '')) {
                    typeN = typeE[g].value;
                    break;
                }
            }
            if (['0', '1', '3'].indexOf(typeN) < 0) {
                continue;
            }
            type = {
                '0': '单选题',
                '1': '多选题',
                '3': '判断题'
            }[typeN];
            let optionList = {
                length: 0
            };
            if (['单选题', '多选题'].indexOf(type) >= 0) {
                let answersElements = questionElement.getElementsByClassName('answerList')[0].getElementsByTagName(
                    'li');
                for (let x = 0, j = answersElements.length; x < j; x++) {
                    let optionE = answersElements[x],
                        optionTextE = trim(optionE.innerHTML.replace(/(^\s*)|(\s*$)/g, "")),
                        optionText = optionTextE.slice(1).replace(/(^\s*)|(\s*$)/g, ""),
                        optionValue = optionTextE.slice(0, 1),
                        optionId = optionE.getAttribute('id-param');
                    if (optionText == '') {
                        break;
                    }
                    optionList[optionText] = {
                        'id': optionId,
                        'value': optionValue
                    }
                    optionList.length++;
                }
                if (answersElements.length != optionList.length) {
                    continue;
                }
            }
            questionList.push({
                'question': question,
                'type': type,
                'questionid': questionId,
                'options': optionList
            });
        }
        var qu = null,
            nowTime = -4000,
            busyThread = questionList.length,
            ctOnload = function (res, quu) {
                busyThread -= 1;
                var ctResult = {
                    'code': -1,
                    'finalUrl': '',
                    'data': '未找到答案'
                };
                if (res) {
                    try {
                        var responseText = res.responseText,
                            ctResult = JSON.parse(responseText);
                    } catch (e) {
                        console.log(e);
                        if (res.finalUrl.includes('getAnswer.php')) {
                            _w.top.unrivalWorkInfo = '查题错误，服务器连接失败';
                            return;
                        }
                    }
                }
                try {
                    let choiceEs = _d.getElementsByTagName('li');
                    if (ctResult['code'] == -1 ) {
                        try {
                            if (ctResult['msg'] !== undefined) {
                                _w.top.unrivalWorkInfo = ctResult['msg'] ;
                            }
                        } catch (e) { }
                        busyThread += 1;
                        GM_xmlhttpRequest({
                            method: "GET",
                            headers: {
                                'Authorization': token,
                            },
                            timeout: 6000,
                            url: host + 'chaoXing/v3/getAnswer.php?tm=' + encodeURIComponent(quu['question']
                                .replace(/(^\s*)|(\s*$)/g, '')) + '&type=' + {
                                    '单选题': '0',
                                    '多选题': '1',
                                    '判断题': '3'
                                }[quu['type']] + '&wid=' + wid + '&courseid=' + courseId,
                            onload: function (res) {
                                ctOnload(res, quu);
                            },
                            onerror: function (err) {
                                _w.top.unrivalWorkInfo = '查题错误，服务器连接失败';
                                console.log(err);
                                busyThread -= 1;
                            },
                            ontimeout: function (err) {
                                _w.top.unrivalWorkInfo = '查题错误，服务器连接失败';
                                console.log(err);
                                busyThread -= 1;
                            }
                        });
                        return;
                    }
                    try {
                        var result = ctResult['data'];
                    } catch (e) {
                        _w.top.unrivalWorkInfo = '答案解析失败';
                        return;
                    }
                    _w.top.unrivalWorkInfo = '题目：' + quu['question'] + '：' + result;
                    switch (quu['type']) {
                        case '判断题':
                            (function () {
                                let answer = 'abaabaaba';
                                if ('正确是对√Tri'.indexOf(result) >= 0) {
                                    answer = 'true';
                                } else if ('错误否错×Fwr'.indexOf(result) >= 0) {
                                    answer = 'false';
                                }
                                for (let u = 0, k = choiceEs.length; u < k; u++) {
                                    if (choiceEs[u].getAttribute('val-param') ==
                                        answer && choiceEs[u].getAttribute(
                                            'id-param') == quu['questionid'].replace(
                                                'answer', '')) {
                                        choiceEs[u].click();
                                        questionNum -= 1;
                                        return;
                                    }
                                }
                                if (randomDo == 1 && accuracy < 100) {
                                    _w.top.unrivalWorkInfo = quu['question'] +
                                        '：未找到正确答案，自动选【错】';
                                    for (let u = 0, k = choiceEs.length; u <
                                        k; u++) {
                                        if (choiceEs[u].getElementsByTagName('em')
                                            .length < 1) {
                                            continue;
                                        }
                                        if (choiceEs[u].getAttribute('val-param') ==
                                            'false' && choiceEs[u].getAttribute(
                                                'id-param') == quu['questionid']
                                                    .replace('answer', '')) {
                                            choiceEs[u].click();
                                            return;
                                        }
                                    }
                                }
                            })();
                            break;
                        case '单选题':
                            (function () {
                                let answerData = result;
                                for (let option in quu['options']) {
                                    if (trim(option).replace(/\s/ig, '') == trim(answerData).replace(/\s/ig, '') || trim(
                                        option).replace(/\s/ig, '').includes(trim(answerData).replace(/\s/ig, '')) ||
                                        trim(answerData).replace(/\s/ig, '').includes(trim(option).replace(/\s/ig, ''))) {
                                        for (let y = 0, j = choiceEs.length; y <
                                            j; y++) {
                                            if (choiceEs[y].getElementsByTagName(
                                                'em').length < 1) {
                                                continue;
                                            }
                                            if (choiceEs[y].getElementsByTagName(
                                                'em')[0].getAttribute(
                                                    'id-param') == quu['options'][
                                                    option
                                                    ]['value'] && choiceEs[y]
                                                        .getAttribute('id-param') == quu[
                                                            'questionid'].replace('answer',
                                                                '')) {
                                                if (!choiceEs[y].getAttribute(
                                                    'class').includes('cur')) {
                                                    choiceEs[y].click();
                                                }
                                                questionNum -= 1;
                                                return;
                                            }
                                        }
                                    }
                                }
                                if (randomDo == 1 && accuracy < 100) {
                                    _w.top.unrivalWorkInfo = quu['question'] +
                                        '：未找到正确答案，自动选【B】';
                                    for (let y = 0, j = choiceEs.length; y <
                                        j; y++) {
                                        if (choiceEs[y].getElementsByTagName('em')
                                            .length < 1) {
                                            continue;
                                        }
                                        if (choiceEs[y].getElementsByTagName('em')[
                                            0].getAttribute('id-param') ==
                                            'B' && choiceEs[y].getAttribute(
                                                'id-param') == quu['questionid']
                                                    .replace('answer', '')) {
                                            if (!choiceEs[y].getAttribute('class')
                                                .includes('cur')) {
                                                choiceEs[y].click();
                                            }
                                            return;
                                        }
                                    }
                                }
                            })();
                            break;
                        case '多选题':
                            (function () {
                                let answerData = trim(result).replace(/\s/ig, ''),
                                    hasAnswer = false;
                                for (let option in quu['options']) {
                                    if (answerData.includes(trim(option).replace(/\s/ig, ''))) {
                                        for (let y = 0, j = choiceEs.length; y <
                                            j; y++) {
                                            if (choiceEs[y].getElementsByTagName(
                                                'em').length < 1) {
                                                continue;
                                            }
                                            if (choiceEs[y].getElementsByTagName(
                                                'em')[0].getAttribute(
                                                    'id-param') == quu['options'][
                                                    option
                                                    ]['value'] && choiceEs[y]
                                                        .getAttribute('id-param') == quu[
                                                            'questionid'].replace('answer',
                                                                '')) {
                                                if (!choiceEs[y].getAttribute(
                                                    'class').includes('cur')) {
                                                    choiceEs[y].click();
                                                }
                                                hasAnswer = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (hasAnswer) {
                                    questionNum -= 1;
                                } else if (randomDo == 1 && accuracy < 100) {
                                    _w.top.unrivalWorkInfo = quu['question'] +
                                        '：未找到正确答案，自动全选';
                                    for (let y = 0, j = choiceEs.length; y <
                                        j; y++) {
                                        if (choiceEs[y].getElementsByTagName('em')
                                            .length < 1) {
                                            continue;
                                        }
                                        if (choiceEs[y].getAttribute('id-param') ==
                                            quu['questionid'].replace('answer', '')
                                        ) {
                                            if (!choiceEs[y].getAttribute('class')
                                                .includes('cur')) {
                                                choiceEs[y].click();
                                            }
                                        }
                                    }
                                }
                            })();
                            break;
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        for (let i = 0, l = questionList.length; i < l; i++) {
            nowTime += parseInt(Math.random() * 2000 + 2500, 10);
            setTimeout(function () {
                qu = questionList[i];
                let param = 'question=' + encodeURIComponent(
                    qu['question']);
                if (ctUrl.includes('icodef')) {
                    param += '&type=' + {
                        '单选题': '0',
                        '多选题': '1',
                        '判断题': '3'
                    }[qu['type']] + '&id=' + wid;
                }
                GM_xmlhttpRequest({
                    method: "POST",
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded',
                        'Authorization': token,
                    },
                    url: ctUrl,
                    timeout: 2000,
                    data: param,
                    onload: function (res) {
                        ctOnload(res, qu);
                    },
                    onerror: function () {
                        ctOnload(false, qu);
                    },
                    ontimeout: function () {
                        ctOnload(false, qu);
                    }
                });
            }, nowTime);
        }
        var workInterval = setInterval(function () {
            if (busyThread != 0) {
                return;
            }
            clearInterval(workInterval);
            if (Math.floor((totalQuestionNum - questionNum) / totalQuestionNum) * 100 >= accuracy && _w.top
                .unrivalAutoSubmit == '1') {
                _w.top.unrivalDoneWorkId = getQueryVariable('workId');
                _w.top.unrivalWorkInfo = '正确率符合标准，已提交答案';
                setTimeout(function () {
                    submitCheckTimes();
                    escapeBlank()
                    submitAction()
                    //	setTimeout(function() {
                    //          document.querySelector(".cx_alert-blue").click()
                    //	}, parseInt(1000));
                }, parseInt(Math.random() * 2000 + 3000, 10));

            } else if (_w.top.unrivalAutoSave == 1) {
                _w.top.unrivalWorkInfo = '正确率不符合标准或未设置自动提交，已自动保存答案';
                if (Math.floor((totalQuestionNum - questionNum) / totalQuestionNum) >= 0) {
                    setTimeout(function () {
                        _w.top.unrivalDoneWorkId = getQueryVariable('workId');
                        _w.noSubmit();
                    }, 2000);
                }
            } else {
                _w.top.unrivalWorkInfo = '用户设置为不自动保存答案，请手动提交或保存作业';
            }
        }, 1000);
    } else if (_l.href.includes('work/phone/selectWorkQuestionYiPiYue')) {
        _w.top.unrivalWorkDone = true;
        _w.top.unrivalDoneWorkId = getQueryVariable('workId');
    } else if (_l.href.includes('stat2-ans.chaoxing.com/task/s/index')) {
        if (_w.top == _w) {
            return;
        }
        _d.getElementsByClassName('page-container studentStatistic')[0].setAttribute('class', 'studentStatistic');
        _d.getElementsByClassName('page-item item-task-list minHeight390')[0].remove();
        _d.getElementsByClassName('subNav clearfix')[0].remove();
        setInterval(function () {
            _l.reload();
        }, 90000);
    } else if (_l.href.includes('passport2.') && _l.href.includes('login?refer=http') && autoLogin == 1) {
        if (!(/^1[3456789]\d{9}$/.test(phoneNumber))) {
            alert('自动登录的手机号填写错误，无法登陆')
            return;
        }
        if (password == '') {
            alert('未填写登录密码，无法登陆')
            return;
        }
        GM_xmlhttpRequest({
            method: "get",
            url: 'https://passport2-api.chaoxing.com/v11/loginregister?cx_xxt_passport=json&uname=' +
                phoneNumber + '&code=' + encodeURIComponent(password),
            onload: function (res) {
                try {
                    let ispass = JSON.parse(res.responseText);
                    if (ispass['status']) {
                        _l.href = decodeURIComponent(getQueryVariable('refer'));
                    } else {
                        alert(ispass['mes']);
                    }
                } catch (err) {
                    console.log(res.responseText);
                    alert('登陆失败');
                }
            },
            onerror: function (err) {
                alert('登陆错误');
            }
        });
    } else if (_l.href.includes('unrivalxxtbackground')) {
        _d.getElementsByTagName("html")[0].innerHTML = `
    <!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>学习通挂机小助手</title>
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
        <link href="https://z.chaoxing.com/yanshi/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="row" style="margin: 10px;">
            <div class="col-md-6 col-md-offset-3">
                <div class="header clearfix">
                    <h3 class="text-muted" style="margin-top: 20px;margin-bottom: 0;float: left;">学习通挂机小助手&ensp;</h3>
                </div>
                <hr style="margin-top: 10px;margin-bottom: 20px;">
                <div class="panel panel-info">
                    <div class="panel-heading">任务列表</div>
                    <div class="panel-body" id='joblist'>
                    </div>
                </div>
                <div class="panel panel-info">
                    <div class="panel-heading">运行日志</div>
                    <div class="panel-body">
                        <div id="result" style="overflow:auto;line-height: 30px;">
                            <div id="log">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
    `;
        var logs = {
            "logArry": [],
            "addLog": function (str, color = "black") {
                if (this.logArry.length >= 50) {
                    this.logArry.splice(0, 1);
                }
                var nowTime = new Date(),
                    nowHour = (Array(2).join(0) + nowTime.getHours()).slice(-2),
                    nowMin = (Array(2).join(0) + nowTime.getMinutes()).slice(-2),
                    nowSec = (Array(2).join(0) + nowTime.getSeconds()).slice(-2),
                    logElement = _d.getElementById('log'),
                    logStr = "";
                this.logArry.push("<span style='color: " + color + "'>[" + nowHour + ":" + nowMin + ":" +
                    nowSec + "] " + str + "</span>");
                for (let logI = 0, logLen = this.logArry.length; logI < logLen; logI++) {
                    logStr += this.logArry[logI] + "<br>";
                }
                _d.getElementById('log').innerHTML = logStr;
                logElement.scrollTop = logElement.scrollHeight;
            }
        };
        logs.addLog('此页面不必保持在最前端，后台会自动进行任务', 'green');
        setInterval(function () {
            logs.addLog('此页面不必保持在最前端，后台会自动进行任务', 'green');
            logs.addLog('如想禁用后台刷视频功能，请关闭脚本并重启浏览器', 'blue');
        }, 120000)
        GM_addValueChangeListener('unrivalxxtbackgroundinfo', function (name, old_value, new_value, remote) {
            if (old_value != new_value) {
                logs.addLog(new_value);
            }
        });
        setInterval(function () {
            if (Math.round(new Date() / 1000) - parseInt(GM_getValue('unrivalBackgroundVideoEnable', '6')) >
                15) {
                logs.addLog('超星挂机小助手可能运行异常，如页面无反应，请尝试重启脚本或重启浏览器(脚本0.9.0版本有此问题)');
            }
        }, 10000);
        var loopShow = () => {
            let jobList = GM_getValue('unrivalBackgroundList', '1');
            if (jobList == '1') {
                _d.getElementById('joblist').innerHTML = '请将“超星挂机小助手”升级到最新版并重启浏览器';
            } else {
                try {
                    let jobHtml = '';
                    for (let i = 0, l = jobList.length; i < l; i++) {
                        let status = '';
                        if (jobList[i]['done']) {
                            status = '已完成';
                        } else if (parseInt(jobList[i]['playTime']) > 0) {
                            status = '进行中';
                        } else {
                            status = '等待中';
                        }
                        if (jobList[i]['review']) {
                            status += '：复习模式';
                        }
                        jobHtml += `
                            <div class="panel panel-default">
                                <div class="panel-body">
                                    ` + '[' + status + ']' + jobList[i]['name'] + `
                                </div>
                            </div>`
                    }
                    _d.getElementById('joblist').innerHTML = jobHtml;
                } catch (e) {
                    _d.getElementById('joblist').innerHTML = '请将“超星挂机小助手”升级到最新版并重启浏览器！';
                }
            }
        }
        loopShow();
        setInterval(loopShow, 10000);
    }
})();