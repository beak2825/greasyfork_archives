// ==UserScript==
// @name 【超星学习通小助手】【视频、答题助手】【完全免费】视频-章节测试|自动挂机|防清进度|不占资源
// @namespace    unrival
// @version      1.0
// @description  💯超星学习通满分助手，挂机解放时间，无需任何操作自动完成所有任务点【💻可最小化💻】🆒支持超星视频、文档、答题、自定义正确率、掉线自动登录🤘取消视频文件加载，多开也不占用网速，放心追剧🍊自定义答题正确率，提高学习效率🍆每日功能测试，在发现问题前就解决问题，防清进度，无不良记录
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
//如果脚本提示添加安全网址，请将脚本提示内容填写到下方区域，一行一个，如果不会，请加群询问



//安全网址请填写在上方空白区域
// @downloadURL https://update.greasyfork.org/scripts/512141/%E3%80%90%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%91%E3%80%90%E8%A7%86%E9%A2%91%E3%80%81%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%E3%80%91%E3%80%90%E5%AE%8C%E5%85%A8%E5%85%8D%E8%B4%B9%E3%80%91%E8%A7%86%E9%A2%91-%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%7C%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%7C%E9%98%B2%E6%B8%85%E8%BF%9B%E5%BA%A6%7C%E4%B8%8D%E5%8D%A0%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/512141/%E3%80%90%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%91%E3%80%90%E8%A7%86%E9%A2%91%E3%80%81%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%E3%80%91%E3%80%90%E5%AE%8C%E5%85%A8%E5%85%8D%E8%B4%B9%E3%80%91%E8%A7%86%E9%A2%91-%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%7C%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%7C%E9%98%B2%E6%B8%85%E8%BF%9B%E5%BA%A6%7C%E4%B8%8D%E5%8D%A0%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==
(() => {
    var token = GM_getValue('tikutoken'),
        jumpType = 1, // 0:智能模式，1:遍历模式，2:不跳转，如果智能模式出现无限跳转/不跳转情况，请切换为遍历模式
        disableMonitor = 0, // 0:无操作，1:解除多端学习监控，开启此功能后可以多端学习，不会被强制下线。
        accuracy = 60, //章节测试正确率百分比，在答题正确率在规定之上并且允许自动提交时才会提交答案
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
        var tikutoken=GM_getValue("tikutoken")
        if(tikutoken==null){
            tikutoken=""
        }
        var base222 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZgAAAGWCAYAAABFMZUlAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAP+lSURBVHhe7N0HgGZZVSD+211d1bknMwkYEIaMBDGQDBiQvyyLAUwYRgURE4YVTItEF8QFXRHDuq7i4gKSkwERkCCwKMEhS5qcp3NX/P7nd953ql9/VNV0V3f1dPd8p/r2fe+Gc88999xzbnr3W7ewsDAI19avX98Gg0H6YxjDGMYwhjGsFtiSdevWtbE1GcMYxjCGMawJjA3MGMYwhjGMYU1gbGDGMIYxjGEMawJjAzOGMYxhDGNYExgbmDGMYQxjGMOawNjAjGEMYxjDGNYExgZmDGMYwxjGsCYwNjBjGMMYxjCGNYGxgRnDGMYwhjGsCYwNzBjGMIYxjGFNYGxgxjCGMYxhDGsC6+sesnwZ30M2hpMcyDNwFxI3PT2dYZ5nZmbyeW5urs3Pzy+m9b5WADd38803t9nZ2WFoa3v27EkffQB9fZrGMIZTAdaF8A/KsLicbAxjOJmBoqakyTLFPjExke979+5tu3btavv372+nnXZaOnGU+qZNm9ZE9vft29e2bNmS5StH+ddee23SeO6557bNmze3jRs3Lpbdp3k82BvDyQxknDyPDcwYTimgzM0UKG4+Qf/Xf/3X9rd/+7ftk5/8ZCr9O93pTu0bvuEb2iMe8Yi2ffv2VOZrodDNTtDBqH3xi19sr33ta9tHP/rRpOucc85p97///dt3fdd3tbPPPnuxQxaM++IYTmYYG5gxnJJAsGsWAK655pr227/92+0Vr3hFu+mmm3ImMTU11R70oAe1X/u1X0sjMzk5uSYGhrFDzw033ND+/M//vP3e7/1eu/HGG5M+fe1e97pXe85zntO+7du+LWkA1QfHfXEMJzOUgRnPw8dwSgHB3rBhQ/oU/Gc/+9n2vve9L42LmQPjwr/00kvbu971rnbdddelwl8LQAN31VVXtTe84Q1ZlrJ1PO5Tn/pU+8d//MekrcLGMIZTCcYGZgynFJihADMSBuYLX/hC7nsAsxoKXrhN9s985jO5ZFaznWMNDAbcjNy///u/53sZPs4SGiODJiBuDGM4lWBsYMZwSgGFXqexKG5LUhS3WQqjI44vnThKvhT8sQY0KO+yyy7L96IBCEeDJTyn28owjmEMpxKMDcwY1gwozQMHDuRswUb72972tvamN72p/f3f/33uSwDKXzrK91iM4M0SKHG4KPA73/nOudFeRqbSeLZkRcFbUlsLUA7j8aUvfSlnSmhgdPjKVO+73OUuedAArdIfraGpOsKjbAZUmOdPfOIT7a1vfWt72ctelsuDDB+61srAjmEMYwMzhjUDip6B+Yu/+Iv2pCc9qT3+8Y9vP/ADP9B+5Vd+pf3mb/5mu/zyyzMd5UrhluI/WiUL4ILXEWQOLcKAMkrpOuFFya4FMCbKgL/qxLiUsUPfmWeemceVK7wMzWpA/pohVX0dHkAHo47vP/ZjP9Z+8id/sv3Ij/xI+63f+q1culsrAzuGMYwNzBjWDCg8x3PNWmyq+9hw9+7dOZJ2ZNfRYd+G1Ki+XCnJ1QIcgIKlPG3sLwXilUXBrwXU6TRGZinDgc4yfgAfQNF/pCC/MkbzX3/99e0tb3lLHiio/Sh7U29+85uzDXbu3JlhYxjDsYaxgRnDmgGFR6HZ5LYMQ9lTpp4tkb397W9vV199dY7m+0ZhVBGvBgoH42EJCpQi51P4Zi9OcJViXwtQV0YUjNbLexm3qvdqjQso/PhZYOakDT7/+c9nuLqqN+PH2BsAmGWOYQxrAWMDM4Y1A8qSMqs1fgqur0Qtkdlop/BLOYKjVbKFj79jx4521lln5XuVUc/2hijftVKwlLsbBBjTvhEtYPguvPDCnGGJO5p6g6pf4SmDCkaXHRn7MjZ9gzSGMRxLGBuYMawZUHjbtm3La1lGlR+FZ4PdyLq/ydxXiquBmo3wlcXA+Goe3lKk4pRPyRrJr+UehE12MwX1L8NXvGBgXBlT5VdcxR8pVN7Cpzwztdvd7nbtbne7W9u6dWuGA8t2DO9973vfbKMxjGEtYGxgxrBmQLlRoBQ8ZV+jZoqVb3nKSSbKTjxHQZYROhagLIq0ZgloqLIo1jPOOCNPma0FlLEsA1rlcvUO1F+9pS/DuFqQt/Bw8LqKxpU0X/VVX7VY19NPPz1vMfjWb/3WsYEZw5rB2MDcRoCyMWpfSoF5F74WQMG7+8ulj7VMY9mIErQ09elPfzpnMuIoQ1D+aqGUrBkLw/J1X/d17fa3v/1inDAzF6P6u971rouG4FgDnl5xxRW5RKaM/kwF2H+54x3vuMj/Y9kGyqt6qetXf/VXtxe+8IXtr/7qr9r/+l//K48qP+tZz2r3u9/9ciBwrKHqw5W8laEVZmZX8sDXVsLHy3WnFowNzCkM1bFBKZvq1OK4/uh5LYCBueiii3LkTIGAmskom3FhcISho+hZLcirXnyKlRL/mq/5mvbUpz61PeQhD0ljx7A85jGPaT/4gz/Y7nGPe2SZawGUpQ3+Uqb9mYzTY2YOlvDwpugGR1v/8vtOO7hc87GPfWweFX/Uox6VvGBcqtxjCWXg1LmPX7tz6qzsMizV/twYTh0YG5hTDHTmfoem2DhhOnSNokup6tDV6dcCKHgGxlJUlV2jVMrnyiuvzFF+KaIyPkcD6gRXKSt7EIyJ0btLL32X87u/+7vtu7/7u1PxrtUSmbo4SFD1qTZAF/73aQSllNcCyAA6lM/welZ+uWMN2pjrG8+qOzcqk+gp+sZw6sDYwJziUB0a6MA6vc5dYRSa57VSbJSHk1L2Yig2gI4yNmYvvo+xXFYK52gUnrxVN7539TVbsExmH+IBD3hAPosvRb8WAL9TcspXdzyusvDAsmHxAUhftB9rKNzKZ8zJgee1MmolV+qpnJK7KldchYGSzeLPGE4NGBuYUxh02uroFLlvHj784Q+3D33oQ+1zn/tcbrKXcpH2WEMpNTMYyzF9EA4oFEq2FC0lU3GrgVJY8HJV/1JcfGn49ZV/5TnWgOduUuZX+X0+X3DBBYsnu/r8WAso/HyzCvtQxZe1KLNfH8/2oVwX5GZrH9r6+FMcfnA1k1mr+o/h1oGxgTnFQGceVRyuKnnve9/b/uiP/iivB/nVX/3V9ju/8zvtla98ZRqZtYIq3yky+yB8ig0YRaPTzGZ0dnM0I+qllljg6+PtK7++f6yh9l7g74/OlY8Ws6j6xUuwVnT0QRlVXkHx41hCv65+6O3P/uzP2jOf+cz267/+6+3Zz352e/nLX553tFXbVPusBS1juPVgbGBOMdCxq3OXQvW1/Gte85r80SvXhbzzne/M95e85CXt//2//5fKb62AwqBEv/EbvzGXp2xqA6NoI/gHP/jBeZKrlJ5R7KgCPBJQnvqXoipcpbwofL73mrmUcTvWYFmO8fQdEKhy0WTmYmZXR4SL7mq7Yw3w9x0a1mrmBpShrmTvf//v/93+4A/+IOXuX/7lX9ob3/jG9n/+z//Jmxx8I1SDgqJtDKcOjA3MKQYUB1dK1rNlmve///25TGFULYxvZOmyw7XaWC2FwWjc/e53b7/xG7+RR2N/6Zd+qf38z/98++///b+3Sy65JDfhKXlpyygeDVS59QzKwKhrxfcV21qA2ZqTW+pXZeI9cMuzo8NFT4WvFS0FhZ9fZa8WyJjBSdFexrHCGTDLYgYzlsTcGiCO7Pktno9//OOL8qh91nKgM4ZbB8YG5hQDSoOrzm4pSue2kU6Z1BIVkIYSWKvbhAs/xcHIULZu8bVE4meMHZVleEZPcRXtqwF17CvR5d77bq2A0rQ0+P3f//05ezOTM4N74AMf2J7ylKekgVF+Gb9SsqWw1wr6dS+3GpBPu6LbYQm0azv08x1wePe7350/i1Bh8pBPcskJr/LXut5jOP4wNjCnGFQHL9CZjaDPP//8VPbiGBmjSYrBV+6lJNYClF8nqDhK1sY68Ey5UEz90eta0XK8QVtYCvvxH//xPBZtSfJP//RP20tf+tL2fd/3fckXSrbajMOv1Sr84w3o5sgVv5YatZ862Mz3G0BkrWSy8gDLgyUXYzg1YdyypyDo3Dqtjm9kaTP5QQ96UO55MC4UAcPyTd/0TXkX1Vp28FIofcXCmNTSCCecYi2odCc71Ij+vPPOaw972MPa4x73uPad3/mdOZuhXMWV4i1enCzGZRTIVdWH7ycAnBjr3zWnblVfv4Pjx9YMMgoMdMZwasG66ASDUjAnq3CP4SCUcubXs07teLJfMfzIRz6Syv2e97xnbrzXPgAFsVaGphQP+SoZK9r6ZfZpX0ujd7xAPapOgMFXrz4Pqp5949Ln04kMVTf1qgEC2fLsKLwTi//0T/+Ugxz1ES6tJdGv//qvb894xjNyCbE/uAAnQ93HsDKQjZTjsYE59aCv2CguI2lt66tyI0txvmB3uslsphTEsVbqRUNBCd3o8yicKnKojqP19K5N8NtzgTTcqBE6kaGMIvmq2Ycw3/04Ofb85z8/T5FVPdVLvOXan/mZn8mlQ0fXQZ9PJ0Pdx7AyVHue/MPEMRwCFFR1/PIpMwrADbqOxnJu2BVGOYiXdq2AsJWSQR9YTolIt5a0HG+oelaHKz6UX/F8vFmOLyciFK01AyFL4D/+4z/yCLJTi+pZB0uqfmTP8XTXB51KbT2GL4exgbkVQecqReO5lO/RgFFizUR0fM4sha9zc1Uux8got0aXFVebz0cDpYD4havq6N31MH50zJFVa/VOHVFStT8DpK/n8lcLyoS/6umZE87VqSZl9stdLRS/6xngc78tQD+uH75acGLQ/W5+SfRTn/pUziLqKh51qvpWPVcL6ISHD49nJxItxX7gAx/IsH4aYOZs7+/e9773oqyKP1qAo/BUG47irTT9tGNYWxgvkd2KQLlVJytl1u9wx7o9lutUyqb0RuMtdTgFJbxk5Eih6lV1qbIYE5dPGun6VUlhX/u1X5s3/borDJRyqmd5+avli70AxrbPa0D51pUxfT5UOast73iD+rmZAU///u//Pn8KQV1cyf/4xz++PfShD12UNfUsWVstT4tPoGTZybGnPe1p7a1vfesw5lD+aVvfQz360Y9OGsQdbbuCfpt5rvd6NpCqsIKjKW8MKwNeJ38ZmGjgdGO49aD4z9cmoezy/VhCv53rud6VycUIdBAziEPiK81qQD3gBfCUvL3pTW8aXHTRRQY3gxDEdOeff/7gyU9+8iAMTqaRt/zKx60WwmBmfvXbs2fPYP/+/YOYtSzirTKqXE78yQLofstb3jJ40IMeRJMuuo0bNw6++7u/e/Dxj398kZdV76rzagCuvoPzr//6rwfnnXfeYptW+05NTQ22bNky+IVf+IXBddddl/mLx/IeLRSew61LlX246cdwZFB8HS+R3YoQ/P8yF50xR4L8Yw39coARLzCCN1txCMDylPhQPItpQ1gy3ZFClVN1gcez7yLcjWZ5rP/thKWcV73qVfn1N5C+yi5c5a8GzFIsxbmqxI9uvfjFL26ve93rDtmIDiWVNNY7uk4WcGPDP/zDP7SPfvSjWQe85bQpnrrgtOpXMzWu2udIQT6ucDpAol1d/1L7LtpPGXx7f04uOiJfZR9N+ctBH3ff9eFYlzmGpWFsYG5l0PF00H4HqI57rKHwlvGgfCxVWVJxT5n7ov7mb/4mjzSLrz0Jymi1AI8yq3717Hdg4EYLoMjRQ0m5r0p4GVquoPCsBuD+H//jf7Rf/uVfbk9/+tPz4sXf/M3fzCtrxBVtVV7/+WQAX8y7+sfAwVFg7Ue2tB9+ejeYEAaOtn6Vt+SDcXnHO96R5TNqoNIo0zdXlsiUW65gqbAjAeXUYKDwlHHrh43h+MLYwJwAoHPUevRoxziWUJ29Ohul84Y3vCGvbfFzum5Y/m//7b/lyJ6ism6t06JntTBaZik3P0QGyoDxOSNfG8R+6VLefn5Q76sBm972JtziW5vewtwq7aNAuNEi3PPR1PvWAKe3vvCFLxzCtwL10p4cQ66O6nc0/ISjeMWgvOlNb0p+9qFo8ZHvt3zLt+RHpxU+OoCA62ig8vdxqyOZ4xe9BVXuGNYOxgbmVgRLCUadNmZL4YG1FHydrd/5/vZv/zYVuhmFZTLKV5grTbzXMtpqQTlVrzJWRtduUKbo6hQbkI6isoyFDmlHFQMcqwUf/1HAhQNO+B0ycMt0LQ8a6fP7tJ8M4MRYHQ3WburJ4a/rgjj8VmdQfKj3I4XijfzK/ed//ufFGZJySsY8+6D3kY985GI46PO2aKi41QKcVX8/V40up+oqfBSOtrwxrAxjA7PGoOPocH3httdBoVmi+bmf+7n2i7/4i+15z3te3m4snTx9wa+8FbdakJ9SMZrVAS0LUbi1ZAY3n2F5y1vekktVfYVU4P1I6FAXePnwKdvJJteFlMEDcHpncC231DKLvPIdLdibKIMJJ1CmMAa2luvwBxTNK0HhAWjn4OyHw1syUPFHA/BVGfB5145uzK6LS8XXTAXv7nWve+X3J2VwQPF9tYA3VRdG2h5QhVU9leFanO/5nu/J716KZtDnrXSHw+vC7RnUc/lw6F/k100BP/ETP5E3d//hH/7h4uyq0hcdY1g7GBuYNQYCXx2ZIqC8/QaLvYC//uu/ziUqvxP/P//n/8zlKUqiv1ZenaqU3y11wlsC+TnKB95ywqoc5dubcdRUZ61lI66P43Cg8hQP+BTeHe94x3a3u91tsVzpKo0RpyU6NAircOmOBizLwVWKpeqg7JpFAmkOt35A/uIhqHbjtDf+wVl1xGPPq4W+ASz/Yx/7WH5PxChXfBlTNzi7GqgMTJ9WcCR17YN8VTc43QxR7xUP3KL98Ic/PO8dwxtpxJUD/eeVQJriJTktmRDu2YzFLQKWfPUps/HXv/717UUvelF77Wtfm4YQwFF0jmHtYMzh4wQ6FsVKqP10sVM9lBolwDnJZIP91a9+dU7tGQBpdRwdUofyzK9OdaRQnZCDm8J1EWZBXzlQVDqmUT9Qbjl4DpeW0fScfRY/xPWVX/mVi3egVZx0+HHppZcmnyqvcsQfDVCy6tzHU2XjP8PWh4pbCdAGiqd4WCCuviOqZbcaKKwWih5lFS6n8hgYBlm8cvu0mzmoe/24mThQPK06rAaq/b/iK74iv7OpelYZPqj8hV/4hXaHO9whw5RVBv5IQd5y1Z/0k4oT5jdmDNzMvs3m8Ah/zFAtkTJAlR7tq6VlDIcHYwNznIBA63gEmiKw/wIo2NqLMIJ+85vfvHgSB5QSEM/nqlMfKciLjgLK7xGPeES78MILvwynjknBW1dHK+VQSgOegv7zUlDl9Wnn1NvI1jJZ1ZFfRk6ZlAHlUMqkT/tqwL5PHS4ARRNQDleKR3i/zstB5S9cXA0IjJYNJMwEtakPHxludTlagB8P0WuW6Td/KHfvNUPyrCz1NpCouhUvucK1WoBPua4h+u7v/u48hmxD36zJb/0IY3jwFuBn3wgfKSiv5ASgXb9RZ3t3jrmbyZGZuqm56mkQYVmYbFX/OhpaxnDLMDYwawyEe7QDuy6jRtIEXQflgM1tsxhLRDpNhQOd5mg6aNEBh2eKxskeCgBOHbcfL8x3FZb0Ki+/0h0u9Mvl6tmo2rcRnvt1gl8Y+oQXDwvPaqEUTfmgcNaX/P24w4F+3fo0+sbH79Bfcskl7Ud/9EfbD/3QD+XljpZpzFxXC4Ufnf12YLgo2orn451BhJ8HcMFkhQF54eAqz5FCtROcePfYxz42vy/6i7/4i1wCdlODI+GMDWUvPTqPlMcF/boXv2vwwYC95z3vyd+fMTARr2/xpZHWTM4yHlpqhWC1dR/D4cHYwBwHqM4MdAa/g3GnO93pyzo3gWdQzBosT5nWjyreowHlFR3K5dDhbiijzgqvcjxbqrLcgC7vlb9g9H0U+vFVvnqql5t0bT5TghVfQAlQBpVnqbJXA/0lFXTUMyVkZFt1rzK5w4HCBSg2hxScxHNww9IbpWcZi4ExMzxcvKNQ+fhlEPHPCbHaY8Jb8epiKdIylRlGn3/yAmH98CMB+Ksc+AyILIXZb/nP//k/t/vc5z6LhlsatJl1SbcaUFbfVf3Bv/3bv+XA7LLLLst3ZSmn2sXyoAGNwZ28Bf3nMRx7GBuYNYbRjqCj+T12925RDLXMUUCR+wbEF+Z+btbITB7QV2KrheqccMGr/Ic85CGp6Bm/6nCedVDl+77Cena/HocDo2nhVmaVb9P5G77hG5IfVTdlOsZMOTkIUOFweUbDaoFB8xV5KeACeB0Xt4TS53c/zXIgr/ToK2fJyiABvj79ZhgMjosoq4wjBfiKj1UPxtjPMONX0QAoVT805wNH7Vy8B4Wnn/5IoepGVrSZtiv83mtwdDRGZRTgh6vqz5n129A3g9F+wsSjT1qDCsvAZnK1JFu8KHrHsDYw8V//63/9rRKw1QraGJYHgoyvhL06hc6n81M2jEl1Ph2BAiX01oqld625tPL1lcFq2qqfRxmFjwIwercUVsdcgTjK4x73uEf79m//9qS7r5iA51I0S0GVUen7vnIpfA5uo10ny/6//+//a0960pNy+axmHKUI+riOFCh+HwNavsLbPsBZv/CJLtDn0XIgTfGgaLQE5mSg9gX92R/fNyGOaePtkUKflqJN2YynJSBygo/2P771W781Lw81g1FWpe/nrffVQh8POpTPr/d+fDlpVguFs9qP0XYDhZmhPiMeVLuoN6NCnh71qEflc9EAR+Ebw7EHfF1eM4zhmAABLuMAarRnhO7ncymGiqOIKFTpPVP49W2MNFx1nNVC4ek7ywYMmVFwKVd06IDiGQDv1XlXC/0yAXyW5vw+/bOf/ez2e7/3e3mLgOtbKMWipdKDo6Gh2mJUsXhm5PFcWPH7cMuqPJXPoGGpj/vqHS+r7NVA0cYvR3H6SebnPOc5uf/h+punPvWpOTu1dLZUHu5ooI8TlJwL88yv+IqrtKuBysuvNvSLmQ5ROORgcMaJw2d9Da/xwGEDslYyDTyPYW1hbGDWGPqdik/wdTZK28avmYFNUKNOAl+dRBqzitqHKQW4FqAjmqVYN7/44otTsdcpG0tnDgGUUkR/v06rBXjUU53U3b6UZUPlGYmjoa+8jrY8UApF2X0fbjTw8bofXs/LQaXhSrHZBzCLqbA+WM5SP3U71qAOlhv9DLEj4JbMtG3RdypA8Zh86Bt//Md/nD8DTo7wtOLL2Xf5sR/7sTxJB6oPlTyVP4a1gbGBWWMg8CX0pVQ8A6NOv9NhOcPpGkq84uSxR0Mh9fPpEKvtFPIXftB/twlsRvWrv/qri8dNfQVtNvEd3/EdhxiYYwWUea3VqyNHIdZ71bPKPFplAKfZGqg2AcUHG/EMq/Ir/JZAmqKrjJPBQBloRhRUGWYT2vVo67IUwKmdCjyrc/HzVAF8xN8/+ZM/yePf+C0MkJ8anBjEPeEJT8ilwn48PmkX/lq0wxgOwtjArDEQ9OrchLyEuhxF7vfJ7TdQBKVwax1duHQ6BoVBMXo/GujT4bmck0iWqyxV+Vjt93//9/MYcymqgn75R0OL0WQpYFC4+jRxxwrMFC2T1LcwZcyU4Yt7162YNfbpuKX6VZpSWBSfsL7SK/BuwKDctYAqrwY1YDlaTkZQBzy2ke8qGKfGqr24GjSoLz6bkfths+o3/P7MmH8q8OVEhrGBOU5AwCmh6vgEHOgM3/Zt35ZfO7sM0EkXeyH/6T/9p1xCs2TUh8q/WqgOVZ21OlvRI9zMirHpd8iCfrrKvxqQtwxX8aZP21JQZa8WGG1GpkaxQFnKRwcj43m58peCflp5zUTNhByWqLgqi1/fQB1tXZaCko0ynMVT76ttpxMNGHC3Szg15sNKoI59XquvfuSAgxsGxOFHtS0nXQ0uxrB2MDYwawwl1Do4oS6BLl+YqfwP//APt9/6rd9qz3rWs/L6/F/7tV9LI+NbkFIc4GgUk7x9GkZBuHi0elZuGQDvFV9pudVCP/8onqWUYb/c1UIZ+NF6VZ2B50pTzytB0SN/0ejSR6ebCiqc4rMUWd/9HGuAHz1FU59X/eeTGcxYHEe271I8Vm+Az+pp7+mSSy5Z/N1/hgSM8oarthnD2sDYwKwxlADzCXtfEQGjeO9G1o7IPuxhD8sP1Wy6My7S1/JLH4TVCJV/JDCKq6BoLEDbcrAcjiMF5VEQpQQK4O+7YwF4ZRZTSgb0nyksM8p+uX1+LAXia4O58jAg6jTKS3UsAyPd0YAyGT9Hcx0ocH9dzZrKKCqvRun9eh4pkC/lFZ4qe1QG+cIr3VpAXb9ThyjwsT8IcKTfHqIrkPQftFa7aI9qp4KjbYcxrAxjA7PGUMJ9S8/lU0yUUY3KdJBS9OIpjOpQpcAqf3X6lUDacqPvfSXZf1ZmPY/mWS3IW/QXHA7OoykTH80Wrc+XIkQDn2ExOvatTF9h3RJUfoD3yvAtD0UHT+2pibM85uaEo53BKA9OHxi+/OUvz1u4HfN2RYvbAopHyucOh68rQbUTWQRVZ37xsXiwloCHDKolSOVavlVu1dHg4eu+7uvyexfH//EILMUDtB8NT8ZweDA2MCcoEH6dp0bCRqc6ik5eG8n2DGqTszp5KYMxfDngpatTjGxBn1+UF+OCn8KPRPmUIgMMjJmoWSjjUvjhcxTb3oDZ6tECOsuw+NDQ90OWVx3bdSsBIC/gSOvTBzjImzqqG0OsTnB6xlPPBZ7778cS0IIGZaKp6oTP4hzg8C2QS1SFlcEfw60HY210goIOowNVZ+4riAozEq9jt0CatercpwLgj1FuzQ5BKWFxnHfxh8tLabSHfHzOfVxPfvKT8wi6K0rMmr7+678+f/jKbQFHo/SKXlfP/9//+3/zOpqaWfjA0++f+GVLyh+g52jkQl70Wpryc9N+VtuHnB/84AdzJkGJK4PfB/mONaDD/ooPJw0UyshoLz/F/F3f9V35zZYZovpWO4/7xK0H60IQBwQkX9ZAKMZwy6AD9DtBtUN1Xu9GrDq1EzSOaeporhzhG11y0sJT7TmGQ4EidomoAxSudC/AL/xzeu+5z31urt8DvMT7lfoFJUfxaSs4ygB4pvA5p8Ys5zA0DBx81a5HCsqjOP/8z/88DZZy7R3BBzdwxNwBkTJ60igLTUcKTsX5cPT5z39+e81rXpM8IX8+XKTQ3RDNoDJoaz1bUB/0+NkDdXznO9+Zdffhqo9LHZQxS6ylM3VGV/WNMRw/KP6P7yI7AaHaoRQDxehuK9d/+FEyN/X65Us/AevCSEcxpdOoq1EitxXAH8rSx3muFvFeQHlZunKbgD2UAnxdqV+UEu/zv57twzAq2shMkwIWt1rjApQnr9uD/ZRCzV6AOGV+7/d+b37RD8hQzchWU6Y9D/e3vexlL8ulN/j6R7HrxoCqW/F0tfW7JcA7sxeHYLSVmaHbMNxf5zdv0IGGogVPaiYzhuML2mBs1k9Q0Dlq1OUHyl7ykpe0D3zgA9nhnRiiKC2H2Nh1eSPQ+cewPFD+Nn+d5Oob4lJIRub4a9SL98X/lYBCo+RLoVJoBfCWwuO0j3jPqwXKUn57Oe6zg7MMFtyuRjGjYASKJtB/PhJwHQsDw7ioC7x8ZTLSjmSXkUMXGtZKDouHfEtiNvSdujR7YcS1qTj08GtW1W+TMRxfGBuYESCcox2EsPZdX0lIz+l4Ljh0FTvlz9c5OevkjlXWMdh+/iqLAhBX+LlScjaf/S6L+D5YNvNFs4/O4NfB0CIv33IKUMbRdPp+nauDVzmAX2WIU27lOZEAPRRO3ahbQGnjnXgzADxHP3c4ABdXir6euQJlWLqp2cTRALyMy3/5L/8lj+R6drDg+7//+9tP/uRP5kk15ahP1WultujXVbpqOwbXTInsOVBS8lTx/PoQt/AfTt0qf4Hnwlfh9U7OgGeg/dRJ/ZTb31OrssVXG8jHVd8C5FSfYhw/97nP5Q0OTuTptwZr9pvUvUC+km3Qp73wA+GjffS2DuM9mB6UsBQfCFUJKsEhyOJrFEdIpWFMPvGJT2RH9FydQt5ylBpFYITp1wW96xzwFV644PVc+ZX74Q9/ONfUjSJ1nhJ2dHmG1x1idXFmldnHU241UJ1deepWNHJ4oR7SwC+N56rLastcC0CXH/t6wQtekGv4lIg6VNu6Ql+cE2DVJ8Tj+YkC+Fp8tkRlmdQABv1G9U5SmaGVDI7K01JQ8fxKoxy/qoof9q2KV+IrjT1AHwXjFyg55op/S0GVpz36fC682oMxq1N4ld7zcnWAq/BVewI8sukvzoBM/2RU/HY/g6JeZFh6aZRlWdMNGpaeLTVakkOLOLJQdHjv01bvle62DHiQshKNMTYwQyDUOiQowSmemH2IKwVP2btO/+1vf3uO8ox8rEsDgkpoAd56l1fHd0SW8LoWxokiyxmEG064KQbPRobKlteVGL7y981DQdGFTmltTP/6r/96nqJRDziVXR31aEAZ6ABw4oWZGd8GtmtlqhMrj8Gx1KS+JxJQPJTMX/7lX+ZJKHxFa9XJ1Twu97SnALKDDN2JAtqCIyOlFLmiU13IkLg+3SvVoWRdPrIEN8VsZmzfj2yTX/Fk1DN8P/iDP5gHJvCryi5cYKUyQV9OlcmXR33g8d6HpcIK+uV67vNHm+urfgTOYM2MxezFrEwafVW5RS8ekGuzWYMOP4pnr8dN48LRjQ99I1L0V136cbdF0Ab4Od7k70EJGaEEhASjOJ2KEiI8fqNFx3vpS1/a/vEf/zF/8bG/BFa+fHyOUAo3/TZ6stFs1gOvo6w1WusLbjZQPBtREXpXZNh/EQ430EF0fApdhzDiMotRB3nFS1sdYDXQ54m6OGhAERvdvvnNb86RIMNpBK0e0peBPJFAHcogag9019Ki++Bc9Gk9v3gL1OFEqgfa0FOKrMLIACgjoN1BtdtKdYCncPK9G0DZ37PvJ1wZHHkFluFcg+/kXRkcoLx6Xq5MaYrH/TKFeWcQzDLe97735SBAGJmutEuB8OprZViE6ZsMpYtbLSf7ELWWwMgA46Lsyisfpz/Z+9TX/bKs2wPEO0hg4ISW4r/nyueZG8Ow/YNpg2BMujEMkg8heOmHAOUzHoVxGNx8882DV7ziFYNQQoNg3qILZTqITqbHLLoQsvRjhDwIgc90FS5t5b3ooosGoawH0aEG0bEGIfBZbpXv3XNM7Qe//Mu/PAglnvnhGcUbI6zBH/zBHwyic2TeUDaZF/2FczVQtESnHLzsZS8b3OUud8kylY2G6HCDn/u5nxvEyPCQslZb3loBfhRPrr/++kEY7MEb3vCGwRvf+MZBKLLkNfqr/aveJxIU/aBo7LsC6Up2R+NGYTSNfH/3d383uO9977soxyVj3JYtWwY/9VM/lTKpnH57y3tLIP2onHDCwiAMnvOc5wzuec97pmydf/75g5idp9ythFv+aivP+tJrX/vawSMf+chBDLwW5bXqEEZ4sW6euepLnLJjMJK+dOIuuOCCwZOf/ORBzIRSH/TlqRwaio7bMuAFGM9gRiCEfHGUFkzK0VAITI7ofDFt5mJDUFjwL3nmWdoQxMwnrHhZcTWyr3cgvZGUb1vsDfi2wCknYBRaOKQz8rZvU5uSIdiZBr4CyxrCLbvV9zGgT0/5RwLKwBf4zV7M2rzXcgpndmZ/yc8L4FnxYzXlrSVoMw4/zRwdSbb0YYRcdKMZ7SdiHdAD1KFo5bz3QZz25zyD5epRdaz6mtX5iPNtb3tbtmuB9tbuRvGWEy3HVh8o3IUDLFceqDyVH1i28n2PlQGzS3jgM4tRrtmS02LLQfFEXyWnZi2WxfQJZRQvRnklTlnFByCNMoFwsmFmZQaETsfOybp+Tf6lr3qXf1uH5PnYwBwKhIowEZhS3pT6H/7hH7b/83/+TxqCEr6+QJWQUlSWtHz8xSCYThNshgS+UR7rtBS3ZTOCa/mGgSgjB+TRMeBFm7SOiAorqDTCrS3b+NcZhRWd6F5NG8vPOSVnSczmr/qjEU4duPZcbPy6YaBv3E4UwP/iBbqKNmExOk5fGNrVi6uwEwnQVe2KttF29Vz17MctV4+SI+1IvnxnZTBln01+IK905NX+oRNrpeyVVf1hqXJHoR9ez8omW4yCflBtAC+nbMeSDQaWAng4ef/3//7feWUOOYUDTfyqp3Rkl5FQh+qn9hHVHxT9JcelC/j4YnnbYLCWt6sc8ZXntg7Jv7GBORRKUCgcgmIN11q0EZ1RFcEsYQME0ikTx0T9cp5jo058OdFlXd8PdlG6dRpF3rpQsQQSeGbInAiS1mmgag/rxOJ1boaLQZLWiAq9aIDPM0NmBKrT+BitLlbUSdVntW2MTnRYjzbj8k4pALTBr9wHPehBiz+SVu5EA3wqqOe+QQdFe8nD8YSiqU8nfntHE75r76K54qp9R3nufaU6yN/P80d/9Ef5O/elkKtcvgHUE5/4xJy9KK+P13Ph4fdx9qGv6JUtn6tvDOLs+Qjvp/Fs0OJjSjNOdJQr4+OZ4nfi7U//9E/zdF2Fc8pAL4Nipq2vusrHr7Xqq/rpN3/zN2e9HMJRT+nN4GrwUbiqLIM5hsl+VB0WUR/5xtC13djAjEAJI9+pMNdj/NVf/VUaF2GEp5R1XVFhNOfraQLryKavmyl3nYFjfHx1THhdZWF5xmY9pxP0OwIDQ0gdkazlMu1CmUgnL+NjGYDxo/QBmovuMjLS6SzCKs3RtLHybXz+y7/8S86SCm/5DJ6O9oAHPGDxQskTTabQwxUv+P3wclWner81QLklH561qxNd7hozgjajRD9lOEpnvY+GLwWFnzM7NntRTvGgFKZ4ss3AGLl7H+UjKFwrQZUJKGvGxQyGQq/ylG9QJa3+U7OmftvUrMugy80GZVyES1eHZ+CxxOYyTFfKuObGyTD9g9NfOfXzEWv98B9ayDxe9+lStsMCjI8BIbrEK6vPi9sy4NHYwIwAHhBoSt5dR0Zz7q2qUSMgYIyL37DX2SwZEE5hDAFBK0f4CXdNx+2zMDIUsDP5hFca5cHLeDEyZh6WueCQH13idJgqh9Fz1xUhLxwl3MJ1CjMK5coP/2qEX72rU1nC82NPTtf0oeijmNDtx54q/ESBoqV89ao2rToC8f209Xy8QHnFb3RpM21r7+uFL3xhe+UrX5m3OFjKMgiy33Y0Br3kxqDBHsgb3vCGDFM2fGQQPXwfchr1k7/VKlI44a96GsD5fX19AfTrTq71nZ/4iZ/Io/hoAPw+Hp8K6KtOWspfdRIn7YMf/OD2cz/3c2lgGBR9SL+Cn5OmcOtjTkQyHLUvakDHleEC+h0joyyGCU5l1gD0tg54jxmLJyDG0J1+CMEZXHXVVYMf//EfXzyxFcwiVelixDiI0dQgpvOHnCIJQcu8/MJVfHXqhMNvDv7f+Z3fGcRM5ZAynFxx8iwMwyBGdHlyq3DLx1dmKJZBdKhBdJakKTpL+vBwcEZHGTz96U9fLLNoOVJQphNWyoXnz/7szwbR6bM85URnWjyVww9lkPThxYkE6lFtUrys95XcrQFFW8nXxz72scFjHvOYbFNyor3Jyf3ud7/Bq171qkU5WQ3ghfZ93/vet3hCMpRutm+/XWM2Prj00kuTtuLfakBeTt0+/OEPp6wrk6v6Kd9pNc/qrf7qp8wql69PhZIf/Mqv/Eqmr37EoRmfwrjkya8woJmeXzjUGy1w9x3apJXupptuGvz1X//1IGY1iR/f8YavHCfdXv7ylycuTv7bOhQPxjOYHoQw5egkhCRP0DjNYvPaCCcYliOpELBcqw3Fnb87Ia4A/8Tzi5dweg5hTwe/d2vKRkdGUWYD9mWEGxXJY/Zh6cPGphFV4ZUfyG+WYx3YR2TywI9OaeSByyzH+rK1YrQWXUcKyueUY3nEjbborjopF25lGInajDWLWW15awXFv6KreG2Jpc+faidwvOuAJrwG6AhFl/L42te+NmcZofyS38CzPQCjct9BrYZWeeC1HGz2Yimu8Jd8k0XfvdhjBKNyfiRQefUzG/JhIBdlq3AqPxR/ytBTn/rU7AdkTZy04oB09gVj0LN4OAAedOOd1YWnPe1peWeZviaeD/QPz1Ue8AyUUeXpSw7e6EP2PpUDlCO/pW7laQN8kn4MQ304fB5DACEjWJYddGjKmeCU8NljsI/yi7/4i7n0BAg6QeOkI9TlQAmpeMCXR5gptY/7rAdLp+zq0Dq56b6pf+WFXz5pPTNQlg4YEEsWVSY88hN0S2UMQXWq1UC/PsBhhR/4gR/IZQSdtOLRTuE5Rv26170uFfeJBujEH8rNV90GETHISudHuygr7Vw8vjUAfX1gYOy5WKLxXG0hHVliHMgFtxqADz+UwdBW+SW3ZMu+mj0Q7+LlOZryyI2ybO7DQ24A/IWbQmfUvvEbvzFpAOIqnjMws/dSP79QfUvbWbZ6ylOekgPCflt6Vn6l4wqf5+rToOqLlkc/+tHZX53mLEA3WbFc6dQaOvtl3dZhbGCWAKMUswKCRVgItGeCRcCs51bHo1TFcQS0fHkqb+UHhLGMiHBK2qhQBybY4oH0DBwlCMQJk0fZ1QEcIPjpn/7pnDFU+YBfNMojbrXQrw/64HW4QccdLQ9IR1H7BuFEA7RxvmVy7NyVMe4l83MInv/X//pfuUmsLurM3RpQsoOvDJ6NcEoRXdqDDJW81Az3aABOZQJ+ySEazJSdiHTwpPhxNLypevEdCinZrDp4NxvTL+z3GIhJi65+WvU3gPLFPx6VkQL2pOyR+nEyaasf4B/n3aALDnj7/BZX9IGKR4cTZ+QeFM+kM2tnYMxmqh+MIdpp6I8hoIS2PnwkQISnBNNxY8cbde6+UJYDlACQvtIAeLlKq6xSDKbWZjEE3kiywMjUqNKoFciHpuoEBe5K6v8GiDKl4dtwN9M5FlDl8232W36wXFZQdUUbhehjN0aywuWrzuf5eIMy8YXv4z2HOPj4bCRshsAourQUzaXMpC83Cv26Vbyw/jPwru7cUnj6UGVznilRTj70Cy88dUzWkikQtpxbDuCj6H1AWfj7Ax3yWYq6ZsLSrBbQApcTkU5rWXoGwsQxLlYKzJLVDRQvQNVFfzI7N1gQXzSh3UEahwIsWVW/K74qBwhXH+/CK00ZKu99Q8s5Fcro1TJY0aXf+kFAB3cK/xjGBuYQIExGIJQ6pdM3EgTRzMVNyN5rFlICS/hKwC2x2aPw1S9FCw/c0pUTRsA962CON1dnggvUsoUOBOCvMkr4vRth1vFLeMxmXNJntHXJJZekgiiojjLqbgnQqSxpa/TnGKfy8EJ40aZuwBIfhV1r+odb1lqCegDtbNRZ7UCpoE24I97VTlWnwwF1hA8efvFhFIoXy4Eyq1x0aX+Kq4+v4hkYp8govNXyVj7KnkK2V2EJVJuSS/uMZhIU6yg/joQ3fYBHmYyab1ssvZkRk1unMR/zmMe0n/qpn0rjA/BAWX1lD4Q7sq3NihZxeGEJu2b1lb7yFx/FkQHLa45n12BjtF7ei2Z8IvcGbfAJ48iQma92KgM1huD5eJP/UHDM1qYjwQUlnJbHfvmXfzk7s7BS7pz3UhqO8DouafTuKKklLrMao0PCWUaFA4XLqM2FeqbZoIQXGM1ZniijBqrMEn5LAne/+91T+HVM+zL/+T//5xx5wk3oq4MtBSu1fdWzXx588KLDcmLtt4grJavelAh6pK16i+MfbyjeK58yYfwckjD6p5QYdArbchDFWnXp07oUn4q34uAufpUrXoDCVXFLgXC0aG8Kz2/h/93f/d0hm+9AOjNUCplRgHs5nGC5OHxBv+VaitOHsmTJbd+PfexjU5bgB4WjX88jBXlKRvQrRsVmvgGcsh71qEelgdBf8LaWrPpleXYAxwWW9j/g4oC+8KQnPSn7grAaAMHBVTp93SEDS6U+LIUHv83K8aNma9IXzXx0MSb2j6pPVLzDCPX9zG0d8IRwLR7NG8NgEAZiEEJCAvNIIj8YlZfvxUgyjyGGshimPngUmYvR0OCnf/qnBzGjyOO7Idh57DIUVl6sKA1+hyAu5uk/P+1pT1s8XslX/jnnnDP4v//3/y4ef+63V72XExYdMo9XolNY0Sh/5eOOBJRTZfHBvn378v1zn/vcIGZOeby6+OX4Jl89QnnkpYN1AaeyC8fxBjwoPoVRHHzHd3xHtg+60co5MhsKPWksnq/EN2HFF+k5beBdG/Arvp92KVx92LNnT6ZxBNcFi6HsDpFJLgzj4Gd/9mfzklFlSr+SWw7EFV/Qr2yyrM1C4S7iJleFq9KvBtS/eAQHH6/CgGYZJcO7d+9eLKfPtyrXUf8f+IEfWJS14k0M5gbvete7FvFWHngLXwyIBs9//vPzuH31VTx2FNmRY/INpK1y+/LgqH6VWX2WLL3gBS/I+Ns6FA+O/zDyBIYQnhzthCDmezCps8IBRrbCQ5AyjbTig4c5Og3BzWUxp6eMNIE08lgqMzqyERkCmTgrbz1zteHJiQNw9+mBU1zFwwekEQfECedXGJr7UGWKL7ccFA+KdnjRCtwWYARtZgcfEF95fDRqbRpP5FdO+ccb8ACN6HNdiI8GLf9YSjFid8XPz/zMz+SMS5qqz0qgnuqj/eUhH+pWMlH1HOXhSgBP7anAY/8FHriN5uXn1Ec9zALEybdaKHmA3wjdLMASmZkdmuGuET04nHosB0Wn/MXj0WdQZeMjPngG8nPeq6/1abFkXGWoj2fx+CUPXpq9OJKtT1a9gZULfRU/q98B+YVVOXjjvd+v4C7axtDB2MD0gKARmL7yK4EhPI5VEqoKL9DxhJfwEla4Kq/NY0tI4iqMoJawll8CKq9n4TECyw7mGW3VEfogrfAS+OqY3jk4+3XqQz/dSqB8eEqRei+aLCc5AKFjF82WxNRDeuvclU8Y8HxrAHrRoM0cUnjuc5+b15T87u/+bv464/d8z/fkxjD6RmVhOZC22s7Sie9VXvKSl+S3GY7QantlUljS3FLd+2XiG9zFt5IhYQY9DnZo7wpfDcin/asO/fKFVVtzo/GrATiVB496lRwZtPBB9SkgzHvVj9/nB8CnCsMPz5W+nusdSG+vVBnia/nRgRrh/fzoA8UfccpFV/FEWAFjOIYOxgamBwQIEJAS9AJhNRoiTCX8JWDiCbbRpGdh8HEUlnVtCkHevjACacFSHbs6HpCv0pbQe+f6gs6vzlvx6K1wnYvzXPErQeHmqpNVOGd93uk6+0xFF/xAesam+Fn5+bcGKBuN6o4nPqCz12CDu+6JK96h8XDoLFxmsH7O4dnPfnZ73vOel74fZrN/0pcpOItPS0HFoQE9ZldmNGgvvkpjf01c0bgSzpVAvn7eUpwlP305Kv4Bz6sFOOEpBQ+K7/2yS0bVseL69a28fej3VVDp+/gNhhzYEVbtIhyfzcrlqcGccLj69UW3NP1ZDlzScmPo4Nbp5ccAqsEJjIYFnrkShIrvC8ZKUMLRF04gzFQalJCO4pTH0V2d3t1FNYugIHyr0j8qLBxOygIu4N1R2YIqAx44vJcD0nOjIA+n0yhHer4wMzCn0mxoWsp705velIcQhBfelUB51bHqnWMAbWz6lkcHFWYWw3erswMKNQItWm4NKN6gAV9LuXHaD73Ac98Y3BJQMpwDHjbkLbM4iWbm5si7L+SdBKvyb6n+6CreGpw4qediRgrR0gyDbjPZBjyjTibhLPqXgipXXUf7S0H/Wdpq6z5eYdzRAryFR7nKw/MKU6ZnvrgKKxqLLnmqrYo2/Uh7VNqiX57iAbn0ASdeyqPN9TMHDpxoq3L7PAHCOYcBKh5ezjO5qvKWA/nKjULh7MdX+56McNKeIquRw1K0awzKu4S1GudwGp4hqZ9BBvIIJ8S+N7HXUALVx4cewuUECiXrgkmjS4rANyqOf4ovgZSX4HjmE1gX/tUXyVWmWY8jyJS0tKDyL+XEVX0rvXCjOnshbsp92ctelorwn/7pn/KjUoaRoqqOuhQU/nouUBZnRMjQMCz4biaHZktOTgVRjn26QR/P8QB09vkDih5hfdoqTYX14/qgPYXj7xvf+MbkqfascI5sOB1Fdvp5lsJXIA3ASwMWAxTH2BlxH/qRCTJVM5vi7XIgTb/eBhVlBNFLwS7Fm/JH6R19PxLo5+WrY4X1HUDTaN2KRjz3QS/DXjwF0jt56YQdEFc4yumL+ihDQ1Ydw7bM6xsXpwjrhGRB4cAry2n6kFs2Sg8BOH3PptyV+hIo3GgZLadorOd+2MkESW8o4tzx504mQHc0dj7zQ9jSr/D+6RHvfCdTKs9ycPXVVw+e9KQn5amQYNDiyZQY3Qx+/dd/PfPXaRpQZTh1EsKW7rrrrsuf4P3kJz85uOyyyxZPBKFN/FLPTr24NC8EM8vjQmAHIfSDGAVnuqrjLdWh6lvpPKuXiy+dmql68b3//M//fF5OuRqAu5xTP5/+9KcHb3/72wdvectbsk6XX375Il+0SdF/S3VYC0AjXnN9urmiaTQczStByQL+PeMZz8gThGSHCyWV7egkHV5UuVXOSlDpKq22x1+nn/jKLb4uRfeo6+P67Gc/myeonHi85JJL8ie73/nOdy62Tz/fiQZ4WP1Av3re856X/aT6K36H0R088YlPzJNwVW+u3+5wqK+LLGNQN4iZfZ4S9S5dnxfeOSDs4x//+CAGj9lXq0zPF1988eB1r3tdplkJ4CzcoE/baJnaueJOJih6T9olshCAHMFEg6SlNGLg1yjDiAxE4yyOAPrLIEuBdEYuThHV9ecFRi2+U3Gip0B6oDyjFyMxNBlV2nOxAWuEpNzgddImDRo4+eUNJZF3nzkMUPXhpDULckUFgONwoOqo7gB+o1VfPZuhVdlmHCHAOVvzTcFqAE3waw941duSjhG7EaHRt3qLqzYq+o43FG/RA/Cg34bl45t6SasNVoLKp42Ngi25VLualZILS6T4ILzkYCUeFM7iVdFomREPtRu88BQueSrdUlA4zVh8pxUGJg8hvPzlL2+/93u/l7NnS3u3RNuJAH0anaLTx7xXm5FpH/mqj/dyoNLgozazLKaf2n+z+mAJUhr8Ug6ekgfv5FxeV9O46aP6V7WD04j905QrQdGkrHoHJXuFE438Oi13ssFJa2AwXYej8P0AVowQc8rqq14NrME0CsGgJOq5GnIpkI9xcEmeJSMNzZWS8RGkX7akjKUlcHzCWkJFYHV+goJGygCdngF84tAhXL73v//9aWBKYEvwSjkxesLKUK1UByC+cBR4Vpa6lNBy3rlbwrkcFF3qaZmscOIJv+rumS89Ojwfb1Bm0VC8qffiSSkebWGwcEt0qh+5opj8KJaPW300aPmFsWFo3YlleQtuZZGbftuMgjg4+Rwa0KQsPIYHwAUqzUq0ipPeHpzffDHg8K4t9Jl3vOMd+eGpd/jE8b2fSICuqjc+4LXlw+o7RTO9EDPpNKgMjjAyyO/3MzwFxR++dPhdvOBLJ5zRcry5BlTSl8yghbEq+pYD8RzcXD8M+I0Zv+yJfjqH7qJXTkY4qb/kdzrH8VLHTH05b+/EPgNhMBrRKNVwhAPU+1JQ4dIa7XNloDiGxZFT6+AMUOEkZASlDJj3EtjCWYJUcUCYzV+/wqdzWxcnqPAAa7nuY6qTQgS96FmuDkC6gqIHOEJbNwtIw8er+nqakThSUIdSmFVW1dtz1bs6a8061fN4A5rQUPzBR7S7zgdfzFBdxV7GstIX/5aCfh0ZGSNhm8Rmb9bjbcSbEYsrKB4tB8U7gNbiXckXmrlKI074LeGs2er//J//M/OWHNSz/UKHCUr+CudKeG8NUF+OYtfH3cpgkFbtABgRtzSYUdu47xvl4pt6eq46llx4Jhve5fMuLXxmffbaHCSQRrhyzVzsN9YNEFXGclB14CotmuGm0+yV+vlnesF9fgaaZPJkguTjyWpgjEwcCdUILL4RGQGo3ylhCIwadWwNRxg4sFw9S5AIrQ5H6TgTX4IgnpGx9MHAuFoDzhIS8dXxPXOlIAq/tAUUm81CV9NYHuvHESYKykeMdbwZKO+WhLefturOkOgs+GaZzLOlBUd0HUIwCqxOeKSAnqJdHQuEoaXPD7TUcz/t8YCisWjS1gYklozcouybFR2a0ccbBxPQuBK/CxfcfDMXRoZCoNgcg64ZrfL6/LglqLLLFc88lxwUHuVX/HJgJKyPUGIGM6DSkzf3gjGMfbglnMcT+u1XNOEp2q1e+Ki3wqXRd9XXseP+IZZKo6+CqqM8VUbx1jtnlmfm4moZH2kWDeKkxTsHL8xahQs7HKiy0UKvON7up6PpA+/qZDnOYNNA82QC9TppDQzlbObCB9XQDINRqPuxKFInRChoo9ISHvWs5/ILCKzOa1mKsTLi0/jCCKiOKVw+CqjWf5XNlQIVz/V5651gcgTo1a9+dc5ejMAqnTTwuKDS5ZUurSyouEq7EkjDVUdAF2VnGu90l2PFvl1hXJy4OZoZBbrwRjn9OgP0gqq39qk0fPyWxnMf+jiWAunLVR0LZz9e3CgUboMQP9dLjowSGV++mZ7jwWaqNZNZDor+SlPl47fnqr/44lGlXQ5vP03hAxXej/Nc5Vf4UlC8MPJ26kofqfxoJRd+76QuiOy3yUp4C+Du0woOJ9+RQtHMKRP/7VHqT+qlr0pTPPHbRAagtR+qriUvnkH1b67qXbSLM6i0XKWvWrIyWADScgaaP/qjP5qnTMFyfalksXDz6xlOBtGgGb1Fp/op30ysfibgZIHk8clqYCgHa8mY3xe6EnKN48ivWYiRG4XBlRBp0H564F28MAaGYaJsanahsaUhdIyCTkoBORDAgFVerugBfSVk7dY6+F/+5V/mUgWFNqqkTLcJrCOTcKO11oqlVc5K0C9b2npXhhE2o2U5hAI1ulvtzAUU3v5zlQe0gzqrp5kl46zt1MPIvtpDOv4oL0YBbxkpoO1rlKoM+2dAGvjg8AwKX7WNeIOTv/iLv0i6hFXZlpLwyeWL+L8Sv6UHVaZ3rsrp+wWVp2haDsSPuoLRsP77Uk752lkfMLNHK9k1SCIPj3/84/N4rhl/8a6g/9wHOKtefPnqvco91lB4OXykzD07REHGOO/assCMg6EhH9qTjxfSSFvQr7fnGkxafncIgi6RhyuZgM9Kg6Vsg1m6AU38koMySHAXbRXXD3cTs98mshpT9AFpLbO6eeJkAnU6aQ2MxrFm7kO2aizOc8VTOjb7KHRTTcJgb4YAEKBSviVo1fCexRNaOCggo1tQPCI0BAJuSo4RozB10KJBmhIi012jH8Jqmm3/SH7lgBImnd79WE94whPS0JQCBtUB6n01IG/hJMR9XFW3YwmMgZGlJSg/6uX7Gwcy8NSozNJFGXu04MMtGTzpbbaafbgJ163V5AB/jFThqXrxq178khHluKLdtS4MTbWTOM9Gu07DkZfCtRQos9qw0hWuKg/guWdh5Y4nKE9bGAipk+UWAwz7b5Z3DDgYVenUp/rG4dA5mr7yHE7eowVlKFu/MQirASGayBFZ4egBv/NTv/Okr0qPH+Kr73P6qrTuJKufdGagpKl+WjjMKtxpZwYob5XpWZriQT3TJ9JUeF92GCVl1jd4JTsGAfRBfzXjZAB1PGkNjAaxV+K0BeXvXYNoMD4njDNiNuMwGvGucxEOwkIYGJwSsOKBZ8LnI0RxPkisE2rSy0cgCK71X5uMDIhZk7QEnQJjgJzQsTlov8WPXBHe2tuBu5QPgTdrKYEFyimFi7Y+jUcK8o06UDyD+1iDZUodVN3xAr90cu2Bv+ppRImWKv+W6DBYgNMRW4MM7cqIuVTUNe9mZXja77zqV/Utn5Gy74KmSsPht8GI/Smj/Vuip3ArE3guV+/S1DO6+vHHC8iaMsmv0TYDr36WeCjofhp1LrlYjs4K7+fhFx9viW9HC8VT5eg79j/0a4MNs4CqA9CP9F/908eZTp7aa7McRQ70VTJk8GPQYWZrMEi+zJRBv55kxAz353/+59MHwqvOtRQsHRqqn4sX3pcVIFw/qAGtWbkwAx03Dvj5ATJ5MkHWLRifH8VwJxOgNwzL4I//+I8H0QD5UVsI1+KHkaG8Fj+CEhYNmi5GzPnB5Ac/+MHFK+fL9XkQArH4YaYr6X/lV35lEIor8YUgpA9/dNYslw9/CHrGo4cfRjD9ELRMXzR5l75P82Me85hBCH9eW46WMGCLdKGjfGGrBTj6Dr7CfawB3ui8g+/6ru9K/qhjOXy4z33uM3jzm998yEeyt0SHdK7af+hDH5o48LFw4/1Tn/rU/NA1Ouoh7bqU++d//ufBIx7xiEXZKNrgjFH+4M///M9TxlYCbQQXusiTugDlkp9qK2lG6TneUOX2eU3WilfC+7T1n5eCfh44Sm6FcccaCnc9c6M8veqqq/IjUu2nLatv6mPVzyq8+qe+umPHjvzomN6o9OSgdIdn8lV92AfQMXM+5INX5cfsZ5EWrmglF5VGHu941k+rbmHM8iPlF7/4xfnhLhmMgVnmPZlAfcBJO4Nh6e2TOF1h8zoaIJc6TG9DIBbX6UNYsl7ReDnKMRoxejHLsJxlWYAvTfBjce1U/hCqHH0YOZj1WL82uoAjhHMxPdzSFXgXDkcI/yJuadBTaYSJg9+Gexi+POIqDg3qUW1SYd7LrQZG8/VxrgUYNVrCMmNR36ozH5htOHGFn/iDHrAcPfJZQjB7sWEN8BrgEZ6beVjexGs4q7zCWW1FVuqDvEqH5545beEwhJnyclDtiG7OUqlZGzzKF1Z1hb/KqXoeL0ADRx756ANkvOSs+AOqTv2wUZDGMq9RvqUdM1P8COW9+InAWkLRXOXgLTlyio9ckRMzFDRJI159iw/lyAx9Un2ZK5AHyAPMuh/ykIe0X/u1X8s9K/iq7UE9w6dM+3nkzIqFpTtl1TI6nH36gWe6xkyc/Dn2bBUFvtIdJwuoy0lrYDRsgXX8+lqaQrPkAdSnFADoP9v4M5UmAI7oMj7V2aQhAJ4rj6mqEzaWE0xfbfCXMZKODwik9JzyOc+lWOoZ6IiWKPxk7E//9E/nRh486Ki2GMUFyl8tFC4O7oKjxTsK6ml50pKE5Su8LF5VnYTpUPYF+nxcjhY4DQ4cGYW7+CMvfmoTy25cyQicFIk0AG54GAJLZJbYQNEEKCp7MJY/VurY0sNPeainY/PuIyNblIL1c/Ho6susfMvVcS2g6layxQnDh2qPciWfRd9ydFpucrLKYRvLSrW3hl/6Sr++xwKKjqrLKFQYBU6m6ANtTLlr/35dK633at+qP0C7uHomO5bgfOvysz/7s7n30sdVPBOmLGHKtudo/9GhHsu6lsiVV8uSlb9cySh8yhVfNIo/mSDrczJv8msEDaIhrCmz9jZ5rb8yHBSQOpUgSOedUiMEBM96vtNijgUbdUlXirB8IF/NmGoPRxwlYlQiLXqkIwziSujgBOIKD8NipH3JJZfkiTFHh+GpNOVKwOq58AD4R8NWA8cCx3IAp5klhetUTnXA8o3uDBDcnqDDFQ9XokWb2deqgUS1b41AzWh9VW+0CQ+cxcM+GIw4bFF7c9VegCz4JsTmt8HHcqAOHAX7zGc+M9ftXSXCyNiHQwtlC9DYp8Fz8R7Uc/Gg/H6a0TosBfLJw5lRmXHrD0AfILPkE65Rhw/Fqyq3/wzU176nU5AMjHqSXUaW0fFssETBrwaK9n6ZxQtQcUVXn19VL/V0jQw6rDygCQ/40pQjL5w8ha/AOxliDAw0nBSzF0JWyZr8BSU/eCMfPrhF27FjMmZQZIaHV2bzBrX6PDqrfPlB0SKur7OUcTIBuk9qA1MdoZx3G5eMgBmHjmUUQahACQGfcMAhjoHxLUhNXcUVvvKlrTJNvy2dEBKdSH55CUOlgYNPORFSZ/UJlJkWw/J93/d97Qd/8AdTcOXv14EPKmzUKaPAszCgblX+4UIf71oAnuh0NlFr1lf85XQcgJ91oEL4cnVQP4bKkVGjZXXm5Km6kwF8JQPClVmjVFA8Y9zMOhw+kEZYv2wKypft2m85kJYB/eM//uNcboNbHdBUS2W+jygj5R2UHEoPyscr+RgGhqDKrnj0rQSl4PiW/hhiN1zYwEYnObUki47iG0BLH7fn/rvyi0f6lZ97YFwYe3HVznB61p/I+5ECXP32rGc8NSC07KUeaKilOH0Y/f06eFZHMsDI0AlmIJbEGRx14bQL2eBLj3bxBqo+lDWLdQzZINBvBskPd/V1wOeUjR8+3v0f/+N/pIFhWPrxgPy6t86psJILcRwa6rkPyjzZIOtzshqYgj7NnjlK34yEkBBMS1qUSTVSNTbhBRrbSJUw3lJDluCahTA0BNdI15op4+GdsqzRL0XHp2T8JK8jyN/+7d+eadCpk6AFTXBznkG/bktB0Vr1qPrfUr7jDTqsjkfJ6Vw6NGUE+NqGMtJmpVBXagf8MQpkZGpkXvzjU6DWyS1PecePiuPjl2ey8aEPfeiQa9elrTxlYLT1ciCtetkTovhAtQec6lN7QlV2tREnTdWVUbGXYVml7qHCL0oUD4E8K4E6wYfflJzlGbcTmFU5cSmePJZBuKWll75sUeTy4/uLX/ziNPA1I5BOnGdKmIyv1sAAdVBmtZWRv29E8Bl/qu0NJvC40vfBO6ePmYXon/qplQ6OgtcPheEJX791asv9cQyLepgNm2UzBmjhlFe0Anwgk4yKmyGcKrX/029vIA+e17docIrDN3GV7lSArEsI2eIphpMdqh7R2Omic+ZV98961rMGMa3NkyNRaVKxeCIkOu7gKU95yiBGRnka5XAgOtJiGfLESDOvDr/55pvz2nanmEK4Btdcc036YeDyNFIo0sWTJPziPR8ueAt/Pd8SyC8t/0SDqmcogjwtdu973ztP5eB7dKhsBy6U3eBxj3tcnjiTZ6W6iMPrUDaDu9zlLoecDiq8d7rTnQaveMUr8lRTn8+F1zunvVxVHwp8kZaSD3i+//u/P39uYCWA/1WvelWWKU/lDyWSzzHLHcTMZpGG0bYiO97Jasw0BqHQ8qRjzGoHYZQGoYQGL33pS7POcKwkFyU30r3kJS/Jk1RoIutkH5/CaA7CcGWZxYeVcEpXdHOhRPOKf/0Gbjj5nDrzw6AOPvaxjw0xHBlUedUfPOtTMRAexAw320o5W7duHYRxGLz+9a9fPL3Wz1/vwHPRX/KIn/qk+lQ/LSdcvHTSy6ediqZqS3F8bfdP//RPg5jlZNvhdxi9bP9yZAKvyLp2/f3f//3FU6x9nKcKVF1WHq6fZBANmc7oLAQ9RwpGxb4r+eVf/uUc1dZZ8hCOTGf2YoRieSYEIOOWgmDY4oilyuDk4dsUNso0C7IfVK6WJCyDGUnBwaEPHlA46r3qsRLAEYKZo9DyowOkfyJB1dO6tVmc0TjatU3V27sRthulzWbUZyWQx95GtVm1GzzKsnxiKcXoX5zwAu0oTeUxglReHweQxhKVslYCsw77EeiWp/LD6b3atdrJM+dZWnzwbMZhZG7k61kdQsnl7MovkDqtBeRdDtALp3wOG5hRqS9ZB+poH6C/d8WthFNc4eC7Jws9VVbFA3U0U7MBXj+udqQAH0du4OfU3VJfKP/FGR++29cz08P7quNyULgA/NpdnyRHaNZX9V2zL8vZZkXqVfKrnaotCw860GTf7TnPeU4uG1oG1g/NrqSTXjrlVVubSTkh1sdXOE81OKUMTIEGrs5DSCgit9q+8IUvzKPA9j580Ghd9elPf3ouXRGAlRoZrr4wwEtYlFX5RoWPcBLUEiRhSwmV93L99+Wg8sFPaMupA/wnCqgDWtFpicGyAx/0+cZ3qs8ljDroLdVBvDalxPBUOwDlaReGxfKNTWe4+7yUthSicMtf1bZ9kI8Sq7TLgXhLsA4MwK2u8AmHw9IMWrVNlUMR8/EASEdRWWqz/wKPMEpTGjxRFzhH6ewD441mBwwshwH0wMUgFJ8YoH69VsIpHbrR75RYjLzToKJLvj5NynIzgJNWBlarAbRyyix+UdZ4rC/hnboU4Bsg//JJXw5tnHC0cWSn+ro4YZUeVB7hZWSUyVfnipPfvuKLXvSi9hu/8Ru5z4Uug0hQA9nCK6/2sQT3Yz/2Y2lgQNGsrqcinFK10lgcAQLVofga19FVRwxdhe3YoB9dck2GkcwtQQkkBwgEQSvFAaQp6KcnoP0RlrgS6n46Dq38Pq5RkAZOHc9JOSNSCohyWSnf8YY+LZ5ttvq9lPrmBfTr6iizjfJqt5XAKNMeSR311Ab84iEDY+RbcdXRtVmlpUDs0/Tbv9oFjjokshJQKAya9oC36lVta3Rc+Cus6Cl65XXqiPNcBtZzKTPKy3vhXwqkcxeXyzvJBZCe8kWnMp1erBt/QdGwHOCDsu15uEbeXkjR3+erdFYIfuRHfiS/Q6nwIwX5OHVFG9DWZhj6UPFGHDkyyKiVgT7Uex+f/OgUhyfCy2gA9eGAdKDya4cqG2/9LtSv/Mqv5BFtPBePT/qg9iY78sEtzl7Rj//4j2fbGNwKF9/n4UrtcLLCKWc2CU81FCEiFNWQjAFndEVoCQLhJEyEoBp6KSgclU45Swl1uUrPoaEEGqBPGnGgnwd+4ZV2KYCPQTHidwzyt37rt9pLX/rSPBHliHbh5xcvqoxbA9QFj43qfFDq8EXVs+I5p4R8J2C0WvQX3X36+YyD47+jm9/wysfo6vg12pWneCGtZ2nlL4NXdBQuBpwCWgnUgeLqt2XhElYj6wrnF3iWhoFyks3SmHyUISgcoGTXe8X3cfLhcTDA7KXkVDj6OIMsp6Lq2HSfnj5dwDuHfnx0j5xRetUHbm3K985Qu5nbCB3AvVro06IMbWRD3KEa5RtUcOTIoEUfVr8+FI0cwA95+QXVPqDPR3n66Yoe8uBkntNzZi2WNMkqQKd+qY0YIM+cGTKePO1pT2u/8Au/kEvF+oH08PI5UG19KsEpVSOCoZH6wlFhXAlcxVccQRDm/XBgKZz9MG45kE55lYav7CMpnyKxDm4G5jSPUyt8vyVh7Z2irtEuIa7OVx3leIIy+zwy66DkPIvrOx3YDMa+Q+Ud9fsKoI6Jgz4/pdPxrdFbDtKB5ROHF+LhKMCryi+u4oX30y0F0lgeq3yg8mhnyk/ZS4H6AqNdeyNlOEDVg2/02591SFdlwV31U2e3JtQyW4F8FCl+mUFScFXHPm3CCl/hpCwZFnKl3Brxo6vosXfh2L2lZoO34uVqAA3KLhzKMHuxrP3kJz85T3ZZdbAM9zM/8zN5yq/6U9ED+u/8flz/vR8O1A0N6lo8AIy//R59zuk87QWkrbLIljzVny0H4/cv/uIv5ulRy6VolZYh0ibel6L/VIHVS8IYbjWwJu8LdMtAlAlh5dso9z3GW97yllSshJbTWXSU4y3AyuOqbJ3RfoRvJIxKvVcH0yGBo542SynLorfyFi51orgZF0s+6q+O4su3VGGj34yucJTPwQGXkbB3OJRRysEzHtZS03JAoZgt9esBN/DMMJg5ADirHpyZE6VkhqAtKw6UL42j7+payg6tFL30VZb0Phg1e5Gu6lDKy3tdPVJ1LzpA4ZbHM8cAOjatPVwMKUx8pZHXTNKx3lKgoG8gVgNVRtEJfNzs95Hsodo3/dVf/dU0NoybNj+a8vo8wC/vVT7cli7d2m2J0A0S9YNj4ovPnvnSAzMrh4t+6Zd+KQ891PcztzW47dX4FAAzFEqJAtAZdGjCbURk9G+5rE5kgVKexxuqTDRylKIOabmDUqrw/khRHstkNlD7y1P1LH8pNyNbyrf2YUrJA/EUQRmqwo9H3os2SpHyLvzSlfIwM6lvW5YDePCZYvEMPx8OfDeK5RfOUjLSqAtDWNfI1+yKwxN1YaAYhsIL4BCvHpx3MuGEl2vl+yBOGjML33lQdPIC4WjgF1QYR8YoVB8OkjXGBD51gUOdfetC0bv6Xxwa+/hWA0VznxcGFJbInPp0Cku5BinSSc+tBqqMPnjHe3X2w4X2TTh3GNbADZSsgKLZsjuDwhD+0A/9UMpn/zuqo+XNyQZjA3MSgs5G4ejwFEEpjNpvsCFrucwspxQfZ2nt1oDqVDotWi35GI1S7ujSSaWhiEEp+76xKKj0QP0dQ68PZEvx8aVjeMwe5Ke8OSBOGPyUFF7K573yekZHGenloG888Foe+bWRdwpHGxVe5RaNwqX3sSdDo0xpig/eGQXKW9oqQ95KIz189nAsL8JXZYhTZ+kZKR/9wiO85EZarq80xZv5mQnbZzCL6+PyLL3ZqGWxOn4uDoiTZjVQtPABHhRf1L3C0C9N8aXKXg1UfYo3+OJ02itf+crc37ShX78Hoxyulj7JTtFrlvXEJz4xl9EYGfJd9eBLX8uitxUYG5iTEChoX4fX5nR1uFIAwJHX6hwMi/hSSscb0KTjFp18+zBmMjqedyBOJ7aMo7PquNWpGRNpvUtX6aWzTAaHOGmqDFd92Hyu/PABtEjHUex9w0thcBS1GZKN5JWA0rM8ifdFF2UrXH6HSYoe5VbZgE9525ineMQBZQMGUjtT5BQa+queVZZyPKufcsVpZ7hrac5Foo6IG/0roxSiZ+nh6NMFLMO6Q8uSZbVPKXigTPsf9kYoUnH4VnSVHB4plKz0aUEvp17VhsCz9Fw//WpA/sJhydPvF/3mb/5m7j85lo0HVR6oMvFPHCPrWxib/77SF1Y48YQvj3a8LcHYwJyEYMpNYdjsNAIHFJwOXsqC8aG4fvu3fzs3fm0kl6I4XqBToaXfGfmA8nO3k+UpNEvDubrDBi7l7F3+vusrMO8+lKuLSoEydGL7PE6sUbw1q6i8fbrwyXUgeFrKlk+pW/qxMb4SmDWaYcBTOIWh32jWco62AVUuRYUWZZURsZQmrtIxTI973OPSCBcUfu3Ir9kKhwc22h2iqPry4af8zF4oaPlKSfPrGag3uqRxSrGWB9FZIB4edJmFWqpSPjzKLNfHeyRQ9Sk8gI+mevfMgaqDPKuFoh1OddVvfMbgmLs+BfCSK5AOH8iv29AN5vRHciRdnyZpycDR0HiywnG5i0zjwV0C0n8GGrYaGZyMDVECivYS1FHo1+to60qwfQNgndwokwD3hboE2h4ExUEhWEpabXlHA8pEG8VLQXkGjCNFhlcUutmIjVHGU+fFIx1cfjzlykgA8dJZzuAYmdqX+amf+qn2qEc9Kjv8qGItgJcCZqTqFxClNyOy9POUpzwlFf9ovj4o0z6J/RqKn2HQLm7e/Ymf+ImcPahff0RboF3wgBEzk8If5Zuhai/l+3ZL+erKlREomvBHGB8e9cELPhlhWNwAXJv7/brUM794DNBryc2ejnoJh58vnVmduhkIVN4yTJ7R2S/nSED+wlHvoHCDfv0rbfHlaAAOxsEHpX7RUhnCQA3Oqm72tAweHD3+uZ/7ucWfJ0AP/vGLRj7ajhWdSwHcxYv+M+g/Fwhba1DGumCGO3IWA9YCqnLlK68vjBrVSFNYxa9VQ6wVoJ1St2Zv5Edh6ZQUDiVDESXDh65f19WA/Hjkx56s+fp62zIL4RYHbyk2SsYJGLODE4Wn2t3SFF45AqoujION3Nq3WA76nUVdKUE4GCt4LNngOWVdMgZW4rVN9rqiRfmMhA1x+VeiRfnk1zIKHDaBGXL5a29oKSia4Jffsozy5Wd05GV0axlU+qKFvxRIgxfosOlP/vACT0v+loLCj1a0KINc+ZDQt1V4So7IE9oYF0eGGbTlcJ4soN7qpx6e1dGxf1dLAeHCKt5gxaBDn/LhpMEMOZGm2qZ4eTxB+VWm9tReVS9QdHGepZXOc6U5llDlHFcD0weVU+4iIeH6DMAwHeRkgJo9UE5ufLXZahSpHr5qdhbepl8pqqrrSoprJSh+8o16Tel9cGkpjNLGW67SuGvN8WXLKDUSu7UBXeVAXwZ0jJXavvIUeJe3/zyaBpScLwXVQatTVtrqrMtBvxw4Sq5XMgQF1UZFLyef8D5ez9IUXcvhrTz9vKDSL5evr5yk8c5AWSYizwyWGZYBgH0Xt2GYEVG2q5XhEwXwqvit7vz6St+ApWRCOCNtOfTRj350fo1vpluGWxq8kB7/jnc/67chqLqUK3n0XOBZGHesoXAft+v6NSL8Cq5O6J2jJPthng+ng55IgFbfodjo8+2AZSvLV778NaupizarfgTyWAghnhmtm6IrR5mErfhsZuh+KN8pWDY50QCdHKj25vc7Sx+kxbuSlQpT18JV+CoNX1ilXwrgLKh08h2uAlU+V+UVjuXKLDpH04+u1YsjJ8IKfz9+FPr1B5V2pXwVp2xl4YV9LPsrFKpvOuzjOHZrX8igyQBAHvSdzFB1xzP81d5mjQxsGVa8MBNkXH3cafmUcVH3arviAxzgePOl6K9nruqGFjqBU7+KL9rXCrL8KPS4zGCqQphQz5Z0CLNlEhU3IrJuXJ36ZJnBADMHd5w5/17Go+ptb+HP/uzPcibhHfAPV3mNgrwlLNoMH5VnJuP3P5x8sdQinoIw4tQ5SthOBCg+AM+jsrecLEpbDki3XNp++FJl9KHw9fECSpdcrgT9vFXOSmX1YdRoVP4+9PGvpBQq3XKwXL6igU9m+JbKyJT6kzXlUrTS9elYDufJAuqivuqj31b9fKRrL8bSJZ7Yd3LNC18a6cvwF57qkyu10VqB8jlAH/gw1ulGy3d0qrYrfdGHtaITLXAfVwMDf/kUoI8CXXFi7RkDHCk1QnrkIx+54prxiQYEVH3U5VnPelbH2KEjtOrl52X7y2QFq60jvCXIlEE9O/bqQkIGTwewAV2XD8pzohlt8oB/HBqX6gR9kL5AnpKnwoEP5Sqt+JVwAjwEy+VfCSgWZZdyAVWflfKK0yZVBw4u0Mc1CivhBMULUHVZCYpWoHxygy6ujKtnPNJP4ZMO3bdkfE90UIfiP8AL9ROmzgws30pAyaaw6kfSS9vv17fUPmsBjIq2cCOEZU0fiNIF9iEddrFMTw+oC5qrjW+pv60WiqfHZYmsL8DAsy+1bab5mMtU1E+LUoyMjaOWlHK/0U5k0FCcbwfcV9T/rkLdzWAcITWaqDqVYN5S518KqvHg0NEJe+GhABwscBLJEsfZZ3Ub1dUJNMNQbeb/txagR0dF9/r1lGmnUPFR+ER0gOWg6r9O3nWdYZXXu3zrIgxkmniWHl7xywHeVGer9kyccK3EqmDm+vUdf0G2AyYX9J97MBvKuuiuctYFnvW9sK7gwB3/z0c7F7+Wq4c0ZKLjZYcHlNFaLh86iqfqDSYmum+W4ANwTk4eXKqDW5rDFaNMNuRRBxFymHnXEqruVSfvZVS8c4xLn0fC8FQeYZWvQFz18+MJynUpqYGu1Qz6yFI9o2Og6buwGhAUzeXWApJXw+fjBtWYvoz1pblTL6CUpFmNO5VKsE8GIExmXKbQPrJiSCh6YU4CWZ6yR6LugF8KbTWg4XQAePozEuFwbtu+Pf1OWUSnaKb+Maqd931E5Is//8cYtBm37w/Hnw/yFpZx89Eci64fHm5uFS4oausmp9pCKFbvs4F3Nvy2fkNbP7kxy5kbccJmB6EAIs9M1BXN7i7wbTR/LuRHmPd9QRwnfDbC58PwiJuJMhad957ztcq8zhY8XRcdcX6IT3j5o+5A4gnls2GyLYTCnY1n4fLOqVu8LwTN6jvPDzcXbmJqY1sIpa2FZtRL/QLXXHTJ5Ak8EYbOGJ4FTybbhlB0TR5h4Ub9dVH+uqhnZGuzETgXgYPAJW8IRIYv5dAwLX346j23EGUHPvnRC8dsJNp3YCbfOxqG7RZ50Ch9ueJv4hiWkaKfLt4WX1YH5L5c/321QO/Uchc8+pT+K6z6UR8/3SSNeApbGvGls/p9cjkomvvucGCptN7VwScJDhg5nABqsGC5zIymDi0UvWtlWPpw3JbIVLamZVFmWtpf+7Vfy/0X4cLQ4Yjos5/97PaEJzxh1T9adLxBndDusIL7iuyBGDkQNEc5H/OYx+T3DNWoJcj1fCyhL3r5Q62pPjjLJgKi7FBEM20iO/+u0G57p2PGEApmQ8TLUziSsvgvSI28GRSA5vh/6KQNkR8mzpdFyLjKV/EFvSyelSF9lg93/HkH0lXcQojqYCJGjqP4FqFLXXztJ1sYEtwPi4F+vncu8sWf3uB9EAWiK4b+kTfSdoT1QDnDMRq8kV5+/2LeFAXKHECn+hu+JiTe7nGYZRG6usf/kUaR6z1kmk5ukoxh3GI+SQSuAor3BYWzk9MuvqBGpIIGEb8QDGT4B6xcQYTBMTGxvm2enGibNqxrGyMgzemASQos60MJD9voSCDrPySo33eElR470aHoB54XZTX53eNjD4QzYGUc1LWf1qzLkhi9aRUFLnpJeml9zGt/1mEFUHnF9fl4rAB+eI/7Jj8/ysw7jhwFNH1TLmUs3OmM5z73ufl1dX2lfqJDGRj1cOrE5pr1au/CfdOgftLxCYrnGjUdS+iL57oUIp2alo/nUIbzoaFno4MfCO10za4D7TOXX9+uvPaGtm8/FehCRfTIR8kNFebwHa0duerahcGsPpltCahR3ZIQWrsEfdTXMZaG6GRRFuoOBQRYio18QVvSjd6MGiqeoZ+/4N9F55KUukxk2oV4t+ymhl0add8co9nuNf5SeUa7ZlzQEjMuaTp6il+e4j0KCrPuJd+zbpLlc3iLViJfhnFA3fvKpvOT94leOV2AsHzO/No64rqAgGGMqESxWMDwvYP5MIRmSVJn7QrvMCOv5BtlXV2i9kM30P4L3QZ5Yoi2sxy3ceNUO2vHtnbOaRvbOTsm26bgx7p5BiYyTUx1hB0BHOTHoVDhpcdOdOjXY7ROfSMC+BzeVlw9lz71zpnBuL355S9/eb7TMYXDx7YG7gbw3ukhadYKFukKpX5cN/kB5th38bsKf/Inf7K4Sa3SNqSe8Yxn5HohBXwyQdWTK0gmh9PY6m1KzZemOu2xhCg9/wedgekUHJVpqcNSk2Wj6/asax/+1JXtk/9xRbt533TbszDVZia2hDnqZGFA6eRyRpe9U8RBa/4L5Ucpikb+IR1bAplE4EUXVIi61055zs9RiPFvyK+kPXBKTxZGQb51QdOmeF5aleBpZ5iS7xDlP/8NFXb4wfU0FGlIhn4amPA35HvnZDMT2RximCpfGvFR3+jmmT73ISIN47TY7qoRynR+/WybXxfhAiJOdPfcJauHLtuQVwpVu+AffFT/wQz6UHhIG9JIkafvL9vr4H7nwfbKt/wfdHgDZ/cvDUw3sIiSF/P4kxa+4EvU04ykwhbI89xsFDcb5c6nkTGbS5mOdBMTfsJ7sm3bvKmdfdrmdtHtdrRzT5tok1nJcCkzsB0+LPI3oOoIsj7hSo+dDFB16dcJVF3KOPBDRy+mq4+HhdfsRBydIp1veNyh5ibx4pE9bT945lMFS3/Sy1tGqs/LYwXKgPe4LpHVqLSUrVt/a5Pf8pJ9CifIfHGOEWtFz7EGdenTqn7e8dVzX/BLIMCxrx+10SmkUE+8DlJ5TOTav/Hj3pDdT37xQPvXT1zebtwTtG7c1vYONrTd89TkULER2HBRuTA00XmN/gNN0h7/qE0GTJqZ+Vy9V1L8H34amBDcmiok6Dj5f0R3imq90dgwrPs39IfGq5c1q7Au/psI5bYhAij+QxLkM6E2wqv3oEa+5HPHmXovIxK6MN8no10Ym4k0IOJ0vOiIkWdzKEtV0XaZbzE+2jqUbAfqp1yPUdb6aPeY+MyH34el2r7COl+4Nuje02X9OpexQxoYu4mkG13hIr6b3eV/Qxq754SumBw4HMTtvRJkzsUy12n/CFDGhmir6r8LMVuZC2XWFmKWHgYmrE0kI/OdwjODmdgw2fEy4rZMDtpFZ5/W7nzhaW3HlLYLtL36Hy6gq/x6BklLAJ1xMkApdqAe3jlQ+sFhJ7dsW3K3WW9g6nYIP3PhuyTv0vXxcGYxr33ta1O3uk3EjMWtA06ReQbK0pbSa4fVtMUtwSLuaJzjbmCsF9a+i+O9yvXstAZnRmODvOg60UH9gHrUcwmNMPXm94Wo/3zsINVFzwWEMqclBqGWbRrbAL/8htbe9+EvtS9eu7+t33JmGJ3Jti+mNjb+g9BULuqRo1QzmVAS80GvWc18PAtzWCCoV0IqFOvxKT38fGBECBm1F3gDH+qMfjMfmZjtFENybBjPh4BSWxrWtY2T8g9fh6DIQfyXBovvryMofAE6Nfnr2iSNRCnoiE4FGpm1xwTFHEXIZt9lYVZYhycNDKyRLuOzDMR4UHjUWV0cqpiYbgvrOuMrbZemA7QwYAeXJGUtPN0zVjGLGZxpDiqUpD2sSXdirDN8Zl8bIjs6uzp2BoYjb4kzXP+Z6yrb4U2YJ7vRzrnkNjQw0V9zBjPENR+DCgdH1rO8BlSWYuP/9ZYopVM/IXMzbcNgpp13xtZ21wvPamdvC2MeERsUmYUdGSS9I1Bhx7YvrR30eV/tU2AfxbVPfofHh9su3CzdKN1jH/vY9tSnPjUPFGkHYXSr9nF6ld40WPfM+WiUMTLzgad0cJW9VjxbrFsUuuYGBiOqDM+gmOL8NqYgCAPQILxvkE50QHvVq09zhRXUu/rV87FtYB0N3kPL1ZUZmDot9cnLZtvb3/+ZtnMmRnwbT2s7p7sOv3lDzA7CT8FIhUPRoHs+BwXah5sPBVQGRj1mYhSfajfEJ3KmnzOeKDXEDIPyiYHKsEHXqWq6Dvp+PS8F4oKC4dsIRFELdpy7x/hPOYtvbWpTtQ1FTRlyjIc26QwNunIWkHk7Pqyf2JL18B4P4RdG5Rm5o1dIR7cnCndy/WzkPTi7havDWc8ZOvQL+oOU+M9sIzHCI7SjozOQ5Mc18l1dGBc1JFNdmqB9+Kydirf6Fn9RPpOWLh0YLHRHcDNP8NMsrzMwnTGLzB2NETYIvpGP+C/DE0ekM0/Jx5CTdbP72llbJ9tdb392O/+0iaYZSEdX2uFD0V99hkyi0XJqhZ0MgP8cmvFVPVwtxZj81//6X/MjTzdyMBSj4GLWZz7zmXmDM8OB3/LXkrLBOdziSo/qs9oO7yqdMOWvFd+UhbbjamAUWs8YobLK7O/BYIiwo6l4Va6eR2GpuH7dK3w0XT9NH/rxnuu96qDOfVzc4RjPwlPgvU+D5z7u9DJPz0UYBWVh6UDoADOYj35uZ3vbv3y67ZmP2eLE9jY9P9G2b9rY1s3sC6UYCnbDRBgaWiAEJIxBjaIJ5cxsCPBsdJD4y9F9lqKsrq4UnTItgw1idJtGJTJXXbp9HTjrOf9lms4LP/Ivzx8j9+VlY26O/MRD/Mdb9IPSyanoXEFT5o7AzsBEfISpr9NaZioZNsxnZja/Ljpq+KZHwnKG0pGbyrergTyKkyZwRHnrY/Qec/PERRYSp2cJh+n5w38yp88AF7863gKczlyRLMpIAzM0IJ4jPJcOI3k3A+vFJ14879pjntEKubH0Gf9l06UhDRfJAiIdJUi24Awck6GsJkMutAt8qBpsmGrzwQDpWsxourZTGbPWrp4bwsDM79/Vtk0N2t3ucE67/Tmbmi8xuqW8IwOyXnwx0rfP4P4/AxUHaSjf5ZbJ0HyiQF8fot/VUn/zN3/T3vrWt+YBofqRu6JZOukZDDMZm/VuHQcVXkamcAP9tQYF/TLLpSwO0x5rKPzHxcAcbyjGFlO98zlhBfXer3c9l6ErkPZ48qeEAH3q4lk9CFMBehhnoxX0llKmTDqFFC4edcmIzZNjDMzHPn9Te9v7P9mu2xv4J09v8+s3S5AbsDEeDjzW3De0daEFJix1MDS0EMUTfwvzgzY7H6PHMDRzoayGE5PuP/8Un4/xl5EFQoKkSrOCiqlcB5N1tQIbBt3yC8CXPhxs30jfRx+at/tQkNKM2PgP/4aqMkb/Xf2iqhmWfjjHk1vYJUteByE6T69YSUI8FmWEy1lR8MYIXoquvGE85MP8wr8cRgM7GhMSz0Hl0OHt8E0EL0iAshHUGZqDaWBAd6jpTJ+tMXxnDGzME6E0PCFPvMWywqF7w1A27J/Nr5toc4rOgUL0F8VGuFnVIOIso62P2VCb2dMm5/a3u93p3HbRudtCxlZnYLQ1ReoTgL/6q79qb3zjG9PI+LDYV+qXXHLJ4ulTabPOQz95dIKApSuGwgzFHrTfbHKa1glUdOrLQPuCknEGxLUvDMz3fu/35sqPtJUOjNbz1qp38f0gZacQFMMpm1LQlLPRgmvV7ftoXMJajSddPZey9i4co26NhlI+Oqrs2tirenku41K0D70APOg3r3oQOI5QRuefCMWwfnboGAof9w3agTAce6dn2r4Ds23vgZm2P/zpmBnMhGHxgV1McULYN7XJzVvaVLj1MZJdZ+q9YbINgl4fClI3Rv0L0RaLLpSOuHTeA8+o841OPodhS5fPMYPI94gPNxfPczGrSOe9nsMtTEwNXcyG1/v4cfgez+YTM0F/+vnsg8B4j3pPx7sFiWlhnoUlPyzFLLS5GS6MfPjz+RwuwtfNBz/wZCHkxbHrhVDoETaIWeH8wIeXU7nHVf7cuqkwyvzuWXiGLbqNQbePPMtFPbIOG4dOXXyk2aWbi/h+/bmZxBP19RwmZyaXR8UFHZm+8vHhG7rgtTQL4eajrEGUNQgfDYkbjjDus4EzpGdoqMxkw4UBtjU2GZZjakPMeMJQTdijMdM10BnETC4MEYlcbU8i4wZU73//+/PnjH2tri+7AcS9YcI+85nPLPYN7tbquysBw0Af0UXveMc78rd3GJcaPKKXDusGEB39nukCvxPkJutaXu7rhxMRtPcpByVYZVgIodMYPjRyV5jfq3/Vq16VNwYQ2EorX40egAavRhd3PAFNfaNXxrCErYSvAP1d111K2DocYroRbgimZaEIsMjlmCm/Ru3AqNQIdHZ2pk3PTLcDB/wg1oF8F270m6PeMBah78MZ4Ub+dEEnl/iGz6Mu4qIKhzh5D/rSDfOH854byuFCl7e5DaHsJzjPw/cRN98Pj7SzofBmw5DOBL6ZoD/99WE4M2w+47r4cpEPPxS4MBmGI4zoQiCN5+49nsOIrPc8dPkcYcLnB6HA28Z0aWDifSaMy0z4s4MuvIvjb0o3z8CkkekUO0WfxmQi4sItrO98Lo1R4WbEIh03E/mm4/1AGIQDQceom47waQYo0qXzHoZjOuo5E/GM0qzZSRiYWUZsaKykSRxhRA+EMZ2x3BayMB+z2UH0M88L3h1f9r2L2Us4ezrrFjoZw85o1vSPFMi70T+DQjnrq9Vf9Q+nUX24rc9Lq7941o9OJECP/qoO9Vv/RWs9S1N1Y5AsAToJ5kZrV08BaUb1xIkGx+26/uMJ6qGxNKJGcv2Mb24YlQ984APtYx/7WP6gkmmpNU+jATMBTh7Km8BqOM+F83jzp18+AeKsPTOMRm9Gazqc3+lgCNV1kd78PzpWKMkOcuFHSLvh5ul2xTW7YlZCCcasg2KM+KkchYYLZbwh/PWhdHMPIUaf3eUl4ddz+PlV9iAMdI1ih6NVo9mYS6RBiHlHvhvNZpjn8odlcBN9P/AcfO/yyiPMaTDfmAw8OwKcYdEph36u9VVYxHfh+BD+RLgoc92iY8QiLhyD2+Xr3rtwRi0GGjHS7059kQ1LhvYr+N1z/Be86cK6dIw/ioPnITNRytDZm+j2J+TxHAm/7N1rheVLWH44u7iSw85p3W7PJsIzT4dPO9M5aLBK6d3SV7qKW3SGC/6GaTxFeesn1CPoivID/bDIYRm8SEsm7Nfk0eXwyWD6QwUp3LcyE+HOPmN7O2P7ZtVJVEcK6u1qKbMVfdoBIfLOiXN/4cMf/vC8g6/2d6vPln8igH5Mz9hrUZdLL7006e33Yc67Hzez7PcjP/Ij7fGPf3weUfazG3BUXy9D069vwa1Zb2WfkgYGaCgNZPbip18ZFyc1LI2Zjho9OK3hjh7K2plxR/oc52Nw+oJ7a/CHAFXZaGb8GBdn3N3M/JrXvKb93d/9XRpMwqpTWdeNDOFgSPUWz6lO4tkb1d3ajbtm2jXXHQglECPidX7LfmMo8HVhVEKhMwoht3k9yeLaejh44pnrThmFAZ6P2YxRaqeaIh2Dge4OR848hs+USoYF/jyplvGhliM8FU75gSkVf/gZR8kP4zI+3kVmOcPy+q6jt6NlkZ58DjpiypZ7I4v0eOe6PRj9dUO+m+WVC6MRTqFde8ST/+I9/5WMDOuT8YG3SzPkX/Axl4cohWyL7h1/OyXd+RXHSKZfccN4fqYpfPi+iKMzzBk3zBORi89ZXobBG+3o5Fe2p4EDXJEm2jifg3R82RDVdrqu23eJsGCIJbCOb0Fv1DkyZDn1bY0bY8pwzSddkS7KsRd1zpk72unbNnVZAso/EtAPfCNiY9ySNz5TsPqAj7P9GJiLXmtw1rVD1zYnCtBN6OV8t+KbFXXpGwpXuvgm0K+Huv7loQ99aP4yqT5e+UEZq4LRet6a9Vb2KWlgiul8Hym97nWvyzPllsMqTl29G0W4DM7Zcw3N8JgRuAetz5dbgzdVrtkUmhnD3//9309aGUuOkbTp6bdmjOCMHikChoWC1/k7ykOFDLoZzM17Bu26m2bCuPgqeGt0RPsok6FBQjGE8qDeXGTYqaPowDEq7y6oHLoYvjIrnRoMnHgdGlbevJ8qXKo2Gkhc5O98o+F4DoXd7dVU2EFHa0mjXD685XItLvx1c+tDYR106xdCkHvvnIMAG6JC/bCN66ciXNyGFk9tMp7TRR0mI+1k5Jka5uvi4ynijdZ9OKm2i7OcdJZi4t1MKmY8ZktpiOM5Z3NhhCdDgW8IZT7BT9c9T4RhNqrP52Fc+hEm3/qFmXgfje9mAvImnvSlqfDIF+lsrFPo8nXKPd6DdneBCRfPrYt80k8oy8LYEBfcG6IuU2HMHSneGDNaz1PRBJMRLi6NmTbClehTOcMJ8E2UC0tdvBnMCGMU7RNlbwhZPOv0He20bVORI5JImzkOH2pVgZHRr/VVM3gDSb/WavmIIjZILGVdcGv03+Wg+jXw8aO+bWYmzEW5fi3Tb/3/2I/9WPuar/maPMSgjpVvbi7aPd77Bqmg/wxG348nJG1BbPRrzX1iNcLRAiuvPkYITmn4aQAGBWiYUagZi8b2xawra1ytcN/73jdHDWY1y/FnrfiGXvQANDs54wSJkzPeOYJmev2iF70oT9FsiKFmKrkEBqZ7jjF6mw3l6Ybbz1813T7y6evbnpmNbc/sVJuetxk93WYX9rTZuZnoyL53CfyZs1MFRqOJTl0NcSPYslDWPf6lGRMfwIhnYMShx3tGDf8bJgs4+NRBqR1r+4e2UfF4fSj8dUEb25nFDKErs8ut3A5LPvrff8FL+IPSDNQxzRo8GbV7UjWmLeK7f/Ff0JKXa3Y4QJic+H9YeJQLD5wcPLk3FVGdAYl69Ant4QEhcd3sxx++BnSLWAeVhyzSBCc7mgIyT76YOfDjv9DygrznMp1+LSASogsuSZOk/IuoSDwIo9LNUiNd0CDfVMgUudoYyryTKUTEv5ia+PbH9TKhOXKwMR80LIShksaMz/1sZn1mNQ6SrF+YbpML+9rdb39Ou+icrWHAoi7KifKPFKrvuhnYMtlHP/rRPFnFwOir+gtZqP7KKKnHamFRrvBu+FwwGpY8ChBWz0uB+Oq/nHcrKL6DcRejPo3+Mirq1MctD13FF96f0YyWuxIdawnFg1PSwKgcwHjLYa9+9avbC1/4whztW26qeFB1rjCNaoRglHS3u90tr9r3k8N+GdLMxjKahi1Blr/4dywBbgZG51APHcVvpDMwlggKyij6TX4X2tUHeIEh4zufYnEKqKW7/JrZ9tkv7Wp7Zze0vTNmHpNhXKbb9NzuPH6cp6YiIeWxEEbJ7GXGcapQUo7tGrHOxyiX0s0PFQO/o8tmT8GaLNExVbRscLLMe+TpfiogOkXSGHkkHgJ1U/sM/hJP5MmVnPjLesYMRt7pA9MiE28furbQnnCFFwkSR7gu3n+dkk7hjwSeF1uPwYmkXTr/hnjSEGVAl6/nB3L/Dd87fgi3NJezFGUETeISQfKhoz1CI7xLn7SGl/8nH6JMOAO3bPmVfi5PxWvSg3eYEwrKs8zRVgsL7psTHpmSELWTKTNmLgjVHB2KXhczGDMSSn/D5IY8hkym8Fx/sBeTkDRmQYmfsZmPdp8JqZphoCJ4MtpoY8wH85h7GKbZddNR9EzbONjf7nb+me3is3eE0bWKMMR5AkPKTgii/qcf6oN4wtW3KqX8+fUsn+fbMqRs4cupuERWFh5oaMtdhMNsxpTaM6j6Yob0xZQKk96G+kc+8pFcRrOfYwprWlujh7XiXdFU9fBuWcDhBL7wMoZ+TMgvgbrUTt/vaBnSkx4coVwijoLZs38uf9tj05bNbeMmhxtCKUwN2rbNE23Hlqm2fcumcBvDmG5qWzZPRdxEKrepSR9gdkqPkstReuBnYijDnAVQmFlouNRFwdcoGP25lIK+yNEpSXlKKXsT1/GUMbG8km7YWd3Y60t9Sg7qYYaDbgjD2INphr4yFwFLwgmhi1mWgzjjv6in8NTTHaXhhn8R3zkI5OqeO1dx3X6O5vMjaL4PUY+82sWzZaSIzPvYwk8sMgUuap8CdpHm+lDSueeRvICXXNjHivANUUbkN8PIq25ioOBwwZCkoB3xKtoZFsFkoGuLLizt47A9cz+JEUcnAxHPcOXvwnDB+3rOK4R8BxXyNx3tMmPwEIl9YDvhqHYyuMXM2IlDF2LOtLO3b25nb9uUA5KuricH6Gvo5TsU5HCQZWpL1k6uCa+b3+mFo5kxnUqAZ6fsJj+oZTIGwdTTb7OUINhUqxGJNDpHgXfhnBmQ6ThDQ7DgNLOxzitP5ZN2LSA7bdDDmHBmL34nvH6H38af35v5zu/8znbaaaelMqfEKJV02aRdu+YGbPj7pmfa7n0HcjZieWP95LowIuva5jAkmzdOti2bNrZNmyyP+J5hXZvc0G3uTkW6VHKWPhgYdKWic/rOR3oUaGi9KM+ppiAll9b86Xg1k0jNHnkpTWkPnrzq2oKrX1SkaOM18FlOCGqt7wzrA/rtNgrwHOqnl+C53nn5HI7B4y/GxUOFpZ9hXXgHzMHBdJ0cdM/dcfAurKtLZ2AYl3rvwg7Wu3PkKfIFz5mbrgw+vkecNol8G8LgW8LK5azw14eBif+SJwd5zdcWnax22LjhU6YLvJ6VrQDtEH/AV/8MS54K04b1HH4a+4ifDeMym+2bGQhVtFWXdzpmR3Ph2vx0O2vb5nbujq2dqe7Qn/DQbxf6gmH5gz/4g7y12Dcs9nbtgdIvTnzhsX45ho53p6SBUQ+GQOf1rNEZGbc1u6nZSN8apyUoTtpKD1IZ6iEB8nuWjqGx/yG/s+jFr1IQxxIKH9rhR4OZGCFmKK03O5Lp1Iy9IgKu00vLdRA4emTFODWNys2797Trb7o5lMJcKoENYUA2TAzapI3cDdbfKfgo16a19fnw83SZGQAFH4peCXkCy3p7GJgc8ca7eQlllqNcSojSiXLTS6Bwu3bpiOsr1472zpe2U4oo7/gQOSJd98NpHW9GocPb+fUMuuceFfFa0bx8z79huPdhgi60exJpZpBJ8j8+lRl+R2Dm897N7shHZ1jM1Kp+RR9XRqYzKmHUQ0FNRDt0l1l2fJ7MdtnQNsUAYOMU163TMzBGzJQaM8Sgl0Eo/vi/MygBWaZ3FHrtYiNxuK6v+GDUpaaJxyWo/HwWpvnNJKXv8MwFjrlso0Tc1kV+MpA3bS/MBi4GZiZ/G+b807YmX9BwokO1f+kC+ySWqS25O2BjNUSYn3u3iuBHBe3Xjg1MBynbp+oMhlCUweiUU9e5CQAF7Tx5/fa/D5msqRIY+Tol0BmWMlLCCI6jwvI6tdXn21rwrugGDKDybWgybgylr3rvc5/75Cym0uU+RZ+WVCAddL8Hs9CuvPq6dk0YS1eqT232M7xhFJxMoS7WGSXrUO6WmglF4VuXuQxjJmwKR0T4ITxZb2eTmICO55TQbLg0LmEIxFOoOSoOD53dElG0DVw00hA6PqoHRdcZeQ4fKMJaNqLsSkmPQrVFxR2apl9W5/I5XLd30z1neLjK2y3hCagwrsPlXZAZS/d80JG+nBDEc5dnqMCz3qqvXr08DEy4bklMvswRs5X1nVHZONW2btkcMhyGJZ4ZF+kL/+ycK3wYAUbG3DTKiagsbVhGIl18z4fhX/eMtGD5kPdDY6UtA2e2bzR2F9YlZOvnIpMPUtOARq3DPCYucjEbg5PAEvIy1849PQzM6WFguqKGZZ74gG+WAi2TO2hjJQPgB8Br/dKJLz+R3u+3t2XAt1OSC9XAhKJmJt5V2OY934a9D5h+4zd+o73gBS/IK7ApbMtMpdRA4eDXqS4GKTtrQNcRO0E71pBKYoi7RkXeGUl7QWit9V5p1bFbQloKusbuJiBGqfhhVB3d3Ygz8Noc9lX2XIw2FwYuTpmN+LkwRNaVWyi0dW3jpom2KZTdJsszlrGCDXMz0212uvvSf2bmQOBylCCMXShG/SyVZiif3FdhXLioDyORo+VQjK5dmZ3p+Fz8zi/DA5fDAd33LxRyxwtuEdeIq7auNir/lkCyLu1SebvwRRjEM5cQijnqAsEhZfWThzyVrKgfPs/n6P6gswSoznOe52bCrvsiPmQgDPZcPOOJZZr0yeMsmZwNvs+2/Qem2/TsTMQF/mjkIo0U53O4LiwEIAcQfYd00tG5ztzYf7HcxkX9IllehRMIy58LOZoJeqaDFs+z4aL4KD8UchqizpgydOjI0hbpOPEB7dpKm5I3/Y7T/8mZZ+0pXd0jRva4MXRwynJCI5fCAQShFA8j4zQY5SzMjOAXf/EX8yqZn//5n8+7foxILEEUHnmAfOJSIUfHKoW2FlACy1cev+pEqDlCDhi/St/NWqpLDx8pwfCt3Z952pntzNOjfpNbmhs9JiY2tk0bt4QfSj/ic6nHko6llzAmbiGecLoo3i3fbJjqjkbbXM5ZTIxOBwvToQyd7gqehAKLJLmswwCli2ZY3LTnjHZztjXcM1hUvAedsIShQurq3M0ql3O5zDQc1Ze7JVhMM/QPvlbegziSlQnBzwzvXJe2S1f5IrSHo6NfnbKuw/qSoXJlPCaiEPnKRY40KPbddu7a1W666ea2c+fu/HZi774DMfM+EHEzoewD35B36JS3jlcfpDuAIGSIgoZlhUHh120E3WAgjDg54OJ5fe6z8cNFGKOahwXCmdXMhSvDxzdbjqBhmjA48bxY9EkAyY+Q1ToUVB9ikzNhdX+YL+stv7vORR4nVcfQwSm7B1N+uVLUFQc810hYvD0Ov/72bd/2bfllPKC4GReKXJjfYTDzMQMqJV+4jzX08dZzvx79Zwo/vHClODg5/dcZQKNQR4737Jtrl11xQ6itybZr94GYPUSamG0suCIl+GGZpbuUMuYwMQp1weV8vITOiPwUq9mU7xy6ken6/Np7Ig0KA9ZthkdMaJW89j9pDC/oFeeqeCN1xqVb9ur4rx453g283eynq2PmgTEqYOktDWBA4gzXGZTuuYNMnU4ernvvoHiGNWWMGEtLPIxfxveMVCYcQoZ5H6ZhZGCOx2FY5KeQ49ldb92+S2dIu1lCB93v6XSgvt1goJuhJc3Bu5y5ZVHoiPBoU+FSWr7STjNmNz3lTqlT5h3GoC2flYvADgpfV42gK9tUcx2cbXAS1bvn7gCAtGiLUDQG6kGMIPLy0ghzw46PU4lfoI24qNNESFrMhG932rbmh8cY0EQF7wkM6lgy4Jl+YGDcH8a4WEHgvumbvilvN3ajc82u5bmtQ/Ju7hT90HI1wJjUkpM9GadDrLf6AMps5sILL8wPulxFgWdGopRjCeGtD1RBqp986yAUvGWOeKITLF599gs3tA9f+vm8KXfnvul22hm3awuToQS2hJHdYYTWKf0YC7fp/WGAQhfmqbAFsw2zpw2h6BicUGoUWyq6uTY9Y/Qaii8yxGPks8QQeShYijdwUjphsXLdPgJTEQMdmNK0Xl8GQdQib9NwAs+02kFl3Yea9XRKu/P7z3186eVfcMk0K8BKnLIP0X5JdAfVzv1oQXlxaNSxjCI1PLUwn7O3MpJdJvQwAt2Hid77fj5G+3UmoeK6cK7jURePrFTk/tQxyklStXcaMH7GxvNSkCXkpryMfV4BZSft6tMRtpjGD5EZKMA9F5V36ag6ToW8bVrnXgQDlpCBidkgZ7ptHOxr97rDOe2BF53TzLnxpcN44oJ6mg3qC57xwKcLPvC0ye/ZUrV9UNfU0BHSF89uy1D8GhuYEcAYUEsZXPAoBcdMhgGShtBVuuqItz6gfXkDE3o9jEFrHwnj8sF/+0ReU79r/0w774I7tBv27mzrN65v555/Xk75zdhc9zE3Y38gUITLPZv1MUJzHDaUPOViqcc+gGWRA671nwmjFG4mN5zDaIdvBG1Ub5YUSPIKLIs43b7FQdnD14N87/ZxQCeXpWyHtTNKHr73/Wq/5fyDaf1HvYYXf9l8kaSjJh66ZAlp7zKma+uCehLkLrNuk56eLwMTA5Dw8z0SdVVFR9QzDEwHHc7ODYOyhpFO0mHgYlmJK+hmScRlMgm75MNM8X8of2mGoeUlFDIgPNJhDx5x+NFFdEuyeenlMFOXhnGJ+KifdLPRtG60Vs+NYVw2r4t+EnLCisys87PR+/NL/nuHgbn/Hc5sfhIMK/pknIigrmQxB1vR/z2bndAHBqNlTPp6ofKVfritQspRyGfXn8aQQGD6kAwKASI8lK4RSkEJ04kG1AOF3i2LVPOyDt1TVKft3n1D+8hH39c+9al/C0W3q+3Ze3X77Gc/1m686bq2Z8+umL3tizT72v49021uNrIuTISi3BBKY7JtnNwQbl3bFKzYsmld27Z5fdu2ZSI/0ty2aX3bEkaK2zy1vm3Kb2tam9rgiHN0xlCq7sZyU/MGx55DIdORnSOQHX1mAW4AyPV+hmlYl9xsLkUYdfKb8Z0i7XzvHR5KPXDCFUqOq1lZOe2aLhLxgfIPfeiAIaSr0x+GAUtCBUOTEA6N8pfR6HD1UY7KjveDhlU94NaO3bHjPM0VBRggRHT4TmjFDIFDUyhzLkYEQxrVp1uWE1b8Q1P6XWU6h974n7HFh4lJLlp7qttrs/yZaBJVUKTN8NSyaLpIG34EBz6Gx6EEhzOiL3nXJuEnVZEmiolwBZ4coP20Cb/aiZExAKMPbPh7B/hX7T2GDkjdGIZQwlGGpq+QCuqdsM1FRypFdWJApzAOKpQhXVmtGIlF7zaJ2LP3hvYfn//3duknPtA+9u/vbZ/69AfaTTdf0fbv35W/5TE/O9tmD8y02Wm/8xFY0sDEX/AHJ/IHy/JXQ6bb5MR8GJowKps3tK1bJsPQbIh332u0NDCb3BIQSsum/9SGdcPN/xjdU2KU1zpKtZsh5oeU0YGNkHODedExCEOFuSiypakYm+GoOtwiC8JpzkUX2UoBpEvj1vmga/th2PC9XPy36DoDory+lhRX1MTD0OX3Msu4kpuDYfB0ADVcjBYjAKdnBsYei6/p7aWVS+MzdAzQwkKkj3CuwwWHZ7T3/c7lTC74wxYxxBuivXzEyU/7HvH2f4DTfItGO28QYLg7pw61vzYXI/zZmRig5Eg/5GhogmFB48kA2gWUgTHQrL7OZ1jqnS7gQIWN4WBvHUNACcbBTt8JGOXnmVJxeqTeCdiXK5tbGzrltjhC5VLFRK9eN9dm5/e16dmdYUyua1dd++n2z+99S/uXD/5927X76nbtNZe3Pbt2hmGZDkMzF8YllHb0mQHNFtrLj0Y1H83NHWgLs3tjpLon4vaGEM3lrGQqZi2bw7hs2zIVhmZTzGg25lUz27duaqft2NpO37GtnXba9rbjtG1t27bumhqKrGN70EjR9fjebbq71yrSHeK6DwsZnkpb7ZAzgBFXcYU7nb/MW752T6/3sBys3G2S5fx4IBpdmZQwozqRiqqWVTq/2xjuDGngjvR0cDrPkdesJJcUw+Cui/q3db5actBieOFkGJX8/iUszqLfd5ouaEFPx4/+c8lwxyNQYQf5GMafEY8/IJ09l+4K/xhERL02xqwzbxiIOjBpjA1s2tESYp4czMz+OzlAPbVLPfedtsIbUO1HNzjtN4YOVu4ptzFgPHSqUlw1k6EESqhqFMN5P/GhaOwUiGtfzCz27b0pOsf+tn3LRLvu2i+2y7/0qbbnpmti5nJzWz/YH7OWA2FQwtDM7A2Ds68txCg0lz58Z5HOqC1G0rPzbebAdBgc903Nt0kzlk0TbXMYmc0xo9ls6Wx7GJjTtrYzztrWTj9ja9sRhmb79i1hjHxTY3YznNnEKHjSEk34uUkdBie3biI+R9WhxCYmPZtFdukOPUHWzWJyyaxmNIthoTxj9F1Lcd1azUHo2nKoPIbv3TO/nzYLOixIxRx+Ku/oafYyfP/DWQJ0vcuGyamo0+QwPAxM+EMVHo5i00XjWT1T5iJseMAhl87CmORhixlHg+ebn7wmt3n6LwYFZSA6g1FGpmYwwgJ3uuC5mQ9DNMw7F/jgKhyeuzyROdnQUZpLmtFnJhlPS2tpRLnuVgJX2VhOchNB1ir+y+wnOKinepMDz4fUfwid3HS+cLrDstkYOjhmm/yY7yK4f/zHf2xveMMb2qc+9am81uRBD3pQe+xjH5tfz2ssCrrSa4woP62/xqnyK66gGlR8xR0NrScKqJfjjnji0jyXarp2QrgfHHLTgHvP7P+oNz7126qEH+CjZ2kSDvaBgOgUwzFxTOTb69/0+vb8//78mMFc1TZu2RiD4VAEm05rGzae0U47/Xbt4rveo93v/l/Tzr3d7dvMrHJCuU9tblu2bMtR9LpQlAcO7Aslsa6dtj3ChqPbPIwUpVjCmQnanD7zu/xG3OVCg0aibuS3b99Mm56eCVzTbcZHlpRjKDtm3Yg9ahmuG/VWc6vjnA8wgx8OGASzMrLjQzznv85PiOA8ihuP3X4OGKb1NETc9+u55A6tknec/3KQWh4j+q4k7zEwsZS4ztIkHoRxyYFJRMQ/aQduRwi8oboXKVLmbBht+zuwQZQYIQyAA0iHrr7PnqZBY1js0sgbrj8gQl+HqatbZEzUaJSmlrryCHo6GDso3mSaeHcrMn9uY7SzZbNAORFtODUfeILnltXm3c2fp8j2t6+884XtHudsazSAMpaCqkvJOfCu3Kpr1aU+IajwRdk/iUFdylfHgr5OFFfp8KJ0aD99H5bDKZ8fLXzrW9+aP7rod2fud7/75U8zOxXX/6D8SKHKOmbfwZgW+t375z73uXkJnN/G/sQnPpG3/yrsq7/6q/MceVW2b0CUK7w+aPLcFyLMw2BCVAYKHA29JwKop/q4gsJv1vzpn/5pe8tb3pIX6r373e/ORncUUj0XT3bFMz5U3YtXxS/wZXzB8+js9ffpT3+qvee972579u4J3kZaOIO/+/btbdNhOGZnDrRNNjDD+OyLNNPT+2O2sTHS727Ts36mNgR7YkPmOTDNOMy2mRj1zsQoev+BmbY/jEZ+ZBfqJ6+NCaWDzlRaRsdOiIVvuJy/4a5tzTLiL4jpNHkYmnwWljOIocuqee5gcS8lw8UM4yo7L/wuzUGlVdDnWf+5fA7t+Z7/fzkIr7T+Miy84GrSo955aWTwxG0JaSCH7zlT4DOu4ce/iIsyqzSIuoehLz7qWfwc+qqdLAPp+29Ik6UpjpzEeycrnYO/M3wHXeZWbuDM/IxiD5If4TSLZPkjdeTLrDNmU+uiEuKSPj9bHZLgh8xud/r2dvbWjWmIlmiKL4OsW+Di13MNLilHz8Lr84Kk+RSAqi/XtV/XZt71FU5Y1b94cksgTeGEw3HrX//1X29///d/n59kmBR8/OMfz0Gvq6h843M4eJeDpPFYGRhfr/7t3/5t/jSxO70KF8PjOxKXMrqnp6DPvDIiJeAqX0yrW4P7wl8Ktso4WUE9ODey+r0aF2mWEOGhWQ0hcC2425zxwodejA1e4JH8xRfwZXwJfAlDJU2xffozYWDe1xkYy0/UoHgXHNpw37N7V9u7Z2fbufOmduVVl8dg4bLwL2vXXHN5m5nbH3hmo+yYUYXzA2V+eCqPJVuqCS03P5iImc9CGCtzkRhImNqki1d7OWFc8hsKacPnkJmb4jHLyFkSl20+7GC9evX9kotD6twD4QfTf7lWq7jiYaWvcKBN6OulShB2EH/kK6UuhtKN8Kxb8p6SDD6Hb2LA6HTGR3ywJ/7rjIv3yG+mxw9Xs0NpMn/4wfJhnohL61IOLVzwZkiLwxKL7+H69U2jk+FdnzwEeq/Jh2zE7rn7sbKgn+zEn5lTVDDbN+P8TfjfPXfuImNgXNcfaL+8KRLg68rpaMtywifr+kX1GYNRYeCWZOBkAnXLNhnWaRQqXN2T90Njc0t1Lz4W0Ncu7aSvffNXZflJEmkf9rCH5Xd/S9FwuKC8Y2ZgEPb2t7+9vec970kmGWHUlFVlfAFflzJyxcgSJmk+85nPtEsvvTR/GMwtpaZolKk0pUyBfOVOZlAvxvVDH/pQ/sb+aKcRbzRhNuiX+4wuzGjkkc6MpqbGo7z5MqDsQqHp7p/+zCfbe/7lPW33nt1pYPx4WCqZKHowcMZ/fxizve3mm29ou3fd1G7eeUP7/Oc+lQbGEeedO6+LNLtj1BidPfC1iY25EZ1HakMpBqYoEDJnz2JkGe/+Oj/oQ0+mNeDtRu9D6sO4RL5IQBEvQrxTu91vz6OzG3xwJU8FFd53i+EQjUA/vvx67oO8pZz7Lv5LrPk+TNfFRRWTO+qhXmjs0qsFP40GgzIM6651ib4RWfCjC9NukTbCYMKXnO0Ji5BgSYZzXemdok0DHX5Hc/dcKTrgd07pMJC3rj8On4dUVNhiKYlXzi5uPqYkjEz8i9Jb/vx0LuUpkwpYN98m1y20887Y3s7J34OJoINNdggUneQZbu98HzbSD/TLu971rvaBD3wgf7ZCnJuM+X05OFmh6lyuD6Pv0gL1Ho1bCvpp6FurJR/84AeT1wyVWSDfzfPf+q3fuvhB+WpBecfMwCCSAGh8SrEMAucniJ/whCfkDMY7KMKVSWFaFvrjP/7j9opXvCINleU2dy35SrY2zeRNoocK5mQHdVAnsxNroWYoxRfCI646jmc/F2DZ0azGXo3ftGFg/MZNLRGUW4R6Ti8UQRgTM5j3vu+9aWB0dMs2jgvPz09H2+1rc7PTUabJxkxkmYusc23/vt1tVxiX3Tuvbzt3XReznOtjEHBNu47Bm2tt05YtMRjYoog8teRjzKmJqXhnUnSAVCuISF+95kJR+h2RNDAUrXg8yX4TuYIIjrKy7u+EUq7/hyUcrWv50o+GLz4vln8QKm4pqA5csFxK4fDUTCDDwjNL8ycFY8JPQxM0Qt0ZCGHJtnxOQ5Jxw/fFcDyquMrHCAz5Fs4fbi/+oSdV/kEYUrf4FBjjCb5O1vzlflo4cZ0Mdn0WVJvEvzQo0rgqhsXxQ2h+0XJq/Ybc3MeEdQ68rV+I8Pl27hk72jlbN3YGpopfASg7A9ePfexjOQDzGyx8fYWh0Q/M9N1ubrCFrpMd1Ln6frZf1InvnX6Yi4G7MOm40oXcLUE/DXyf/exn2zvf+c5FvVNl3/nOd87flzKDORy8y4G8x8zAII5VrH0DjFAJ63g//uM/nvd7EQKgnBIGFVJRP+Lzxje+MZeFKFL+hz/84byaxUa39P084GjoPREA/fhmtmavqkZkfei/EyazHIaXUWLM8Vu4/S0bnp4Lkjt45F+OhENw4+/Tn/l0e8/7uhkMLWFpzOzFctRgwXUvM+GH0XEaS1yw3RHkBT8eNXcgiJppe3ff3K644gvtyquubDt372kbIv+GwLU/ptszMcDwpXmnbCnHTkF2Hw12ew6uirFElDMYm9LeI3Xe3ht+9/1Ld3JsKpTV1JQPPDfkqatOoR4qB+X6Ha5cpUHLKFT8UtDnvWRLpUysvTLyb1iW3YchhfGP7Nr47gyC8GBLhnWqvDMm3XPn5/cs/AjoHHzSR348DT9qnDj9dQaOQhq6SIuUJGcIRd/Behc1SvKWlC2+dxBpEo9+y7En3Ua+NorRRDofzhoEMDCLd9CZwfiw1hKZGcyWMDCK7tE0CsoxeHrve9+bF9D+yZ/8SXvb296Wg6v6sT2GhZ7w/tCHPrTd4Q53WNQPJzN0PO50nWeDb/W0imELwkDcisdll12W/d1sg5xW+uWgH+dZP3Gyz8GiG264IXU3cJEvXe2+xRNqD8ZIGnFOjnk2ovb7CI9//OPzt+LdNMro1Ei7LDTmEJy//uu/zl9rFEaJYhgh80NaLqCUD2B4MfNo6D0RQF3wygwPuESPMKUhGPJHXT1XGMBHnazuSzPjI3TwaQNCV7DIo2UMTOiInME4Irx969a2fdu2mMHMZQe2ie+bhvrwrpbPmIDp6ZjpzMTIJ9Dv3nlT233zDe2qy4L+q6/IGdCmaC/Kxj5Kt6FtxjLfZhmVyM+nYLuNbnR1SjSVcvid6xRboEjllfsx8ZwXPg7js2o9Oeh3tIo/CAfTFfTT9vEUCIdT3m656VAX/yXWfM9UXXgud6WLvF2CfB2+0NDxLm74Hlzlp7oPxiAd9eWncfGQeIZ5OoTpy2dBEpY+nRmdGDrQXl19ZBsaDtyXNJMfNCwdDuk73/vinlj4jIgBwICBcYos0vjeZTKsSi2R2YOxRMbA5CZ/GJjc5M+yvhzIHVl24OV3f/d307AwIsJLCQJ9gZIU/vVf//U5CC0dcTIDedOv6ULK//Wvf3178Ytf3J7//Oe3N73pTcmPf/7nf27/8A//kFsJdIeZRg2sVoK+jPMtLbqg074uY+MEmV/H/eEf/uHUu/3B6mpAGcfsmHIRr+FrhIFAxK/U8JSidcAnP/nJiz/kQ4HKK58jzoTNVdnwG/GXElkNvUWnMvhwlTK3tKccBk7ZpdiL0aspbyWougBlEqg3v/nN6ZzowEdl8wvQgCaARvXw7pmQWFL0kwP/6T/9p7Zl85ZcpqHkzQ/85oj1iVe/9lXt+b/7/HbN9dfGCDP4EcqBstkcI6LNmzan0t+rQwdNwPcbG2P2SfD37t/Xtu84Penat/9AO/d250Xa/ZHHaKuFsN8lRj7ntft/1UPb7c69U1s3ua2dee7t24HQW7ODibYQSsmpo1x1yaU5tK1v+6ejrIhbv2EyT6atz6FvN3ChMBdiVkWmTjvjjGjEmMkxMsN2q3ap9uLquQ9Z5lFAdOHhUwdZ9tDP9/jTmt6zem4piKgvo2NIY0HlL+jHjeYtyLKHDpDQiTDUjg4zEovx8Wb5c5gsZw91sWeXN+JCNjqKC+Doyi38aYyi3cgrx4BMrmPQ1rUDEwttNvK7KWIyQjYOwsDAGgOK+Qnb/wfaxra/3eei89u9bndG0BllJdrOeJMrsus0EwVqZm7QqT9qfzIuHVq0K5CewTGKf+lLX9p+9Ed/dJHW4wVo0W/RoC8nv4c06h99Xx3URbw2LV8+7sYbb8yVHNsM6k4n0gHClVFQ+fDDQNLPjDzlKU/JZ3FHCmjD/9rWoK/r6Dd8q8EJKv8xm8EUwIGRiLQkhuiV8GK8CtpzsSwmbSl3eAiOGUwJGB94XgnvLUHRhRHVYGhGTyluDX8smL0cFD74lWX257dojCSsg6LDchgDo0NJhy8FJbDqgl6CaDPUntXDHvqwXDaLTOlSOVAs8e/jH7+0vfu972679+7JATYDQr8M5tETs5UJ9Z9vu6NsPyIGRY5WJzY0v1g5Mz0T9GxKHTERSmTd/IE2PxMGad+uGJ0utN27b8obAa648rJ2/U3XtXPOP6dNbtrYNmyMgUbQYZZi1pQQSsrv+YfGCnzhoi4ZHIRl53MZWvia3RUk1vYdBDCi79J17VLtuCLcQvRykGXk30GotvN/PXdLVMNUGaFIsiNNFwwW84Zfz6ArIyqa6Q+NG4Uvj4ucYXTd+1UVHc4L42EYFgbALKNb5gpDEazOK1/IQODLsHRdmpQZdGT6Ll65i+kCpZL8ZPJ8zFIISmRtYW+0ZJQcFKz3v1Nks8M9mE0xy4GzG2CRZ3JuteJZz3pWnmqyHCS85F08KNmv/oIWuuGHfuiHcn9XPzje0G+n4gsYbZ/inUES58So5W2fI9ga8EuZf/Znf5Z7TO9///tzNYNe7Mu0/OqID571+VrhsQ87WubhgDx0Cz3HL51S7mhA/mNqYEooMLOvwFfCK4+0foqYYNnUU0lLat/8zd/cfuInfiKfq+EK4FwtvWZN/fz9Zx+L1gdGRXs//lhCnzfFN52pfhaAsXGSQ+PjC8GsdEBeQkYw8LGc3wZ3CsQJvOx0yohRLMVF4X3ikx9PA7Nn397o6EFD4guF4KjxjOPHE21q0sWeHW2TefGk9vST05tj4hEj5dBO6wbW4eM5R8BhNsIAuGPMtzT79+/O02d79u7KgcYZZ5/Rtp22Q09LmoOjgTmMiLWuoK87HYUWBseVKQYq3bq+Osd/YdjC2EW+9RNTuUTWh0wT0OcnqLbjhkFHDImz+7eIqyAVcLn869J0S2TB7XD5OHSg8nd5qOLFnAfDR9KOwpeFR+UYd2o9Y0LhBxXh41hHg2buPqiM5zAseGw20xkY8RWG//owXlOaXbgyy8/nIb15THlYDklaP4j4KBq7B2lguiWyc0/vDIw5q/ZJ2ZQ+yjKCdsDHKoY4+IsO8iKMXqg4HwX6GPC7v/u727d8y7cc903+vnwVTaNQcWZaBor2TRgVBsUR4Ve+8pX5bMlLvQ0OGU4DRf0Y9Mvp188795Vf+ZXZ1808lqLhlqDKKV4XFP6jAfnXZAZTrmAlvOIIjiPM1hN98f+ABzwgjYuTZ5QlJqt8NeQo/iOFajSGhkEhAJ7RURYc4yn7SguOpsyloPDxlVsGwjOBMSqz5OWnnPEFD9BKAHU6ID3hQKdnxtFHrd/w9V/ftg2/l3EKqBtZG9MutE9+6hPtve9/b9sbBoYmoAKs5VAZNtyDoDBqk7lcOBWzDvjty/hBq61Blz0CWVxRYqYj58R63yqFYTJLCYUigT2bsDrttFAsp4VxueqqKzKtq2JyZrLOscgc42e59mrqhFjyX3vkzCZUVKTfedPNWf/NW8NQDXk3CvIu305d3GpdKdRDwsIdDKOoh2XzaFmKN5674KH89ukYJgWZnB//6epdOPnrXKXtTNIwbTl9JBCEJMRbvAeCnJ1GZNJZBiXCYiLahUmj0DRKHW2VLmc20e5dOq4zNIlbWDwmHeH7ij/GGhkWvSdoMPCQNnAb36x3THm+nVcGJoLhkIRPls1grGI4jq9c7Q+UW8/C/dCfPuG7OoeHHvnIR+ZvsgC4jieUPgLoZBz4wMb5VVddlctdlvzMTBjQ1772tbl/Uhv16s244kHxYjk9Ry9UOuXYb8UH+sEgs5/2cKFfFhh9PhpIXEHwMbsqhgAcKRCeqiTlYTmocBmBl5KvdKWI0bwaepWhMWyiOero2xLGxYkJgms0BLcwMwdQ5RwNf5aCmubXs7oB9SNIeIAW7+i2hGhK7cNLRzet1xJQOIonruaxB/Md/993JP/EWVqyHOI6ewbmtW94TXvhi3+nXXXt1W1+MJNLVmYvUxs25b1R0vgq28mtOvmnfLOGrdu3x0xiNmcyrvX3072My9RG7eKL6qA3b8+NTrdhqm3edkY77w5f0S64w93aF6+4qd3tXg9oX/XVD2/Tg6lwW6PsUGKh8fKLf3IQs5OqexDRNoTWogOn9+9rl33pizHjae2ir7gnbbPIO3JRIMx73xXkStEqIahIpd8HZaGg6PDWKVZgVB98tHTUgyRnkLnyeZG+COuewyWKg8T267AUdOUHryKdm8y86tLCKX3v2JlGI5gpLvMpKN6774u6PkiGqm8V3o6P6Omeu/BQeMMj6LMbBt3vwUSaDVGPvComYkjbYDLyrIu+NNjX7nvRBe3uZ+9IOnPGutDJPNnV721oP/vZz065BlWOvmGPwYzlEY94RPuGb/iG/Jlz1ymh1YBLn/Z8vKDapONNNxtDJxosf5mZOAXLwLipg76pQSyQtpb+ao9FffGiD9UeXOkFg0hGFR/09fve976pq4pfqwG45T8aHH0oOTmmx5SrgY+U2H46jKIYKTaMh7NPXzG6H34kUDjcmfZHf/RHKQi+pDeiIAxmUX4aueoC+uUfS6hGKOe9yq2yCBShxBejNx3LDM8SmhkOvluvZSCdpjGqy+WxmH3Y4O/W0ANnKBJ/dMonP/XJ9t5/eU9+yW/5gmLPnyKOP5cwKtrey4ED+7uRcCim/MrfXwr5wvAwhF+xjDpsiOn5xKY0QPAzTjPT+9PQKPr6a69pu8MQHti7v+3bs6dtDGs3ObWprZvaHprPcpdrgsKoRD0dQ9bu6pxKLeJmgo6bbryx7bz5ppCNbWHkzsg66dTFp+JhPeNlPZcbBh0xdPmzaofgA4cskWWag88LOZPrFHMWvlh+PKQeEQZPtEwyr0uQz8O6d6VU2fFfRHXPjAenH3QzhmimboaSvOn4c/A3W4YuwnPpMfxuthLPkWfxKplwh9Rn+NzR1tEHkobhn1+uNIPJ8gNPzGXTt3eTnz85przOMeVt7azNYQgiiIGp5TYyzECcf/756VtV4IzsnXQyaPq+7/u+PAjkCC1DU4NP+bMOLOgJAJa5HK12MMmMzClPy2PVt9VVHwLCPJceKF9dpPVeDthTZUwYWd+p4IkVnkrftdPqoMqu5yPV4UtB5g8FdsxOkZXPVYUxdKXGr/QqJJ3nosMzMHpmcChbcYVvtfQ6CvyMZzwjN9WUQVApNXgdKnA/j30QUIwuHh1LUDb+gE6hdu/KKyesnPcSSGD2YgbmewGC5sgh45jTZUkiPZidjZmF64opsvh79etf3V7wov/WrrzmqrYQHT+/TwkDM4hZDMW9ZcvmqC++7x/ejrwpZw7daZ/NoaS6DUGXVA7axja7EB09lMXC3L42uSEGGjFq98W/a/83xkxn244zAt+mtm37Oe3m3TPtzl9x93b3+z+k3fWB39TmI3zPvum2b/902xazHWk9a2vX2AdD2pWXf7F97nOfCZ073+5z3/u3rTvObusmN6aypPPyo8Dwu5uGO77qwgxXsorj5Sh8acCv1PVfBtH2qUbrbQhD3orNWUAG5Vumhmt+EPwJY1uQS4sF8Yy27khyR2DnoflgnpKD4UslGoaTCcq8oy/UVyp5bUeWu/0VshvOc8aV4qh+FvjSoHV4O+jixVXZJXf8gomgPQ9jRDP52FK5ZjCTeYND5Iu8OYNpB9rkwt527zuc1+5y5va87DK/s4p4/YrM8+FnVNzm8bKXvSz3JVy86FMHo3Z9pEb9lQ8ILzqPF6B1bjj488yhR1908pWBFCZe+Kh+K9oLxI2GqatBpEtvbeZbDrQva0OfPmRk0YAXq+UBuor3S8Fq+Vr1PGYG5mQBjehD0O/93u9NYWBYqt748PCHPzy/GDYF1egaUHzxiJIl7Ka7Nt0ZP7OL2mSUVmMD+ZfiqTANADeo9ECD98s7cugUQ6ct+2Xr6Ln41V73hte25/3Ob7cvXXFZVDqEmqKO8KI1DVQ8z/iiP/ypfO/ulaOju1+b7DbjJ6c2hr8hjN2uVGJTMUqenbNPFEYj+KOTTEUainTL1u1R1Ia2f2a2TW07u93tq76hfe3DviXST7Qrr7yx3fmu9wkDc27oO3zXKefa3OyB9q53/EO7/EufbTdef1W7530f0O77oIe2XXsPtLuYaYaC04ZbNm6JNpltG6eibWbn87r6qFzQvSFvDNDuE272xRsKNB87xcDwTEjnEk4QClmF1Y+l2hAKOH+iOPLJ1v0+S8di9cmrduLdrADNZo7yzi5MJ98o666cznXtD1/gcI45FXrX3vidyldcHsyAIKPSaGYqtPGDCvsdOZPRfi2UjTCzk0josEYZGLMXz4kuK98BmXDjc/SM5BFXtJU8JB/T7+Q2/qXLkEzD+OQXTJHCe1AVMqHMGHbk7GXjwr52tzuc0+5y3mnBz5AxFRjyo6DjS7cpXndi2Ys0W/ZcyrAPo/lHYamwYwHKxSt9ly5Qjja3KvIzP/Mzi+WWQUY3V4aGzALPwuHz7PDCxRdfnDMVMzXGxeDx1jolt1pQHzy4zRkY4LTaE5/4xLymuhpYg2PK4x73uPb7v//72dC1BwOKYXzXK/ii1rqqkYr1YdN7y2uWrhwxLoMD+s8lYPAU1NpspVlsnFW1B7zhhgqxD2VgXv26V6eBufzKK9r6ULp0nF8dlEKZDEzxxDs+oKlv/Crd1m1b25bNm9q1MStkfOFwhJlhqY4nzBKYG5rNkMyo2tTWtu2ci9q97/91bWrTaaH8d7Q73vne7ayzb98OzMK9KQ3V/Oz+9q53/mP71Cc+3Pyo2UO/8ZvaXKQ9/8KL2paYHTH2EzFzufHGm4P/d2q7du6NujgGHaNE6zah7OaCF+q3fqLbf0iaoj554aapWSpZSjE6sLj4lyo3FIj9iSl4hvykQv0ImFd8WxcGxu0HyZd4ZxxyaTKMrd/dhydvRBg2d7IjIJW4ZgpflNmXKHi6nxjuaHD6ryu6S1eQey3hyyWPzf2JSGuGon04H892zxRcR1/fuCQB6RjWzrho44O0aueurXMNLEAcWcg0goNWtycPqU3ehDkLwhx3Z6Dn21Tg39ym213vcHa7+PZnxCwnDIx2SDzDwgKynABhnaHrZgDqMAr9fGAUTx8XqPdjBf3y8GxuOJOwj2TpShgQJm29F236Dr3AMR6MiBNhdIdbCegSp2drsCf/yWhgjvkpspMBNJavYB0ZNCXHDIJstGRK7gQbpUpoqlGrkZ0MecELXpCzHHchWaLi+zDKjMgZdns50jE+NcqhcEvYAD8VWOAVz+/HgaNrD3lH8xtjtnbpxy9t73r3u/I7GIpQMgcB1E/Z1aH7naJPUyki6bZv2x4d5Nz8NsZHmls2bw3FEqM6V/bHLMTJMuvt1E73eyw+yJzNGUZ0meQRXhm1Us5nnLmjbd0y1WZn9rQd26NztQPtmqu/2PbvvTmM+FlhgEJJXXyPtuO0Hakw/byzKuzbu7tT7EOlGJofsUG3+unUER5BE3n0OZ5xIhQ/hWspyTIb8vChbneejWf0us2Axh+sD/5FoVCmvoVaXODQVKm8I6Oa5azIzDDe1R/gXTdTgSBcIB1OYMKFbMDhD60KrLQIy7zxKkTQ0B82X7iuHjljCT9/3Czyd/sccg1pC7q6t24/LZiWda+2Rys//gWgBj8PKrYKB5lniANeS5KAl1fi8MOwr1uINgojfNZpW8NtTtrzVyIy9UHoy5l+p1/0od8fOl52bqn3gr7crgXArx9U2fqGvRenyIqnQBo6wGCUEWFQ7Jk6Zn3JJZfkZcAOGDlo5Hs4+y193VPuZAL03uYMDAEwarApbhquEa1pWuPUwNZ7NTBelBKtZ861LC7ltJlnhC8MTo6ydGLEUUtC5ny7r3Gd/pJevGWjMlxlWOT1Thg9K5M7OtCWh7an5vVdBgPzz+95dx5TXu+ajwh3okeZ6ODQhR5+Oe9VX750Oo1wG5k1U1M/hhtIK360vo48U2Z7gyc333RTO7B/X/DzQDs9lNCZZ25r//7RD7VdN1/TpvfdHMpotk1uWGh3u+udw+hsaztOPzMM0ExbmAs363ffD7Qbr78+wmbzupugNsphzKO+nvGTsg8Dga2UsSWdaNXAbQ+uWz6SOvkQtBo5otcyD2Wc9iD5F7kDR/edS8dT+BgZBcIJt9+5sXwmTUZHwjR+1CvCMoLX8bZ7lCY6JcOS4eGzIGkkek49YGJMFsMtick7xCPe8xCvMrUDYviLLtox93zSSKiDPP6Soo5mdMiaIXDFQ75H/vjLmwIyTlkHaVe+QYO9Id/BnH36tnbOaVuSxqQTih6gs6PxUBDW1XE0RxfX90eh8i2V92igcCq332cZBvrEF/j2SDgHFSx3WX53xxcdw6AwLo4Y0zd1U0lB4a7nvn+yAHpvc0tkjAJlRwlS/s6i176KtU+GBlCcBKcUaOVjXJ7+9KenAhVfPMPDEjbpgDhKCm5LbgTJ4QEb8QTOlNhUOL83iRkTpd0XqmqXIwP5w5VG7EMowSihvfLVr2zPe8Hz2pXXXN02TIVKjGS5hBQaAe1VLnpACko4PENf1cuMj++yTnxST0aboZEWlEHqyxg3PWOmsKFNTG5s66c2tcmY+Zx1u/Pafe7/wHbf+z2gvfrVr20zwXNn/S+84IIwMBPtAfd/QNu4eUfbO72+3XDTrmiD6Zj9XNP8bPO2bae3u9/zXkHPlm4Ph0oLSxCtETUOF3WL1kkXRAV/5nIpSqx679+3P2YsERej9amox4agyTzBMp/mZDrws+9zFHnH726pKMxnm4+6M3ZuRCh+Smk2lSf25AweAM9arN7zNNfwLyVBm0VUt7TFWaYMugNXzr7wU7JwrsRnMIvHWJ5+hzpAHFo7XNoyl7jg7EobgU5pJm2LS2RdOr6Zj9pkfnikC/oHOePqlvzMYCbbbC6R3f2i89rd73hmbvLn3CTLP1hu5h/CaHjF9cMLlgobhdX1peVBmVzJd+kJ5RhIuozWcWV9w2CFkaFb9H9p9BtQdStcFVZ16te9/JMB0J+0hyK4TRmYajiNqb6lNEF1pvJLMXquxrfG+rM/+7O5/1I4QD8NYyGv9zI2gFB5J4xGOU6EGMlYlquDA/LygecjB3UJFwooqMqQRaCsIu5Vr3lVe+7zn9suv+rKUPARHsNJI/c62lrygC/FG6A+JTiMIuXPyOwL5exIs32WG264PuvmhFmlzz2XoMXRZ8tk8uYFl3PKi1lN8GX91GTbevpp7bw7hAG+y8XtvTED3L9vOviytZ0eM5YLL7iwPfjBD23nnHv7tmf/Qvv8Fy7LJbnLL78yZhyT7V73ul/ObCYmtzTXmnFhMkM5T4YiDD9rEG1i5hIuN7YXYhYVtM3loYT5MHpO24Wx27g52BcDg63bA4/9lSE7Uw1T/J0POjUa8Q4IRH19C7IwN9umDxyImdVsm9o4lXfCqafbkfPHwiK9ZSdtoU2Sw9lc0SHDc9DXLQniEiJw0cDYZwk/k0eSbg8mqAm8lp0OMTDyyCut/zJfh6faloFhgCpNyXMHB5VblwLIo775FPFD48LIJALGfGhgvM/PtA2DmbY53MUXndMuvn0ZmA5JX776ZRVtFS2ui680HVT+qk/1V8579clS6McK4K7BpGflKYtDA9+gFHjnpO0bI1D+aJ/r6trBWtVhLaHqcJtbIisBKOPhXYMnM0IACIX3gkojnk/p2+B3UKAvFJ5LWOD2DF+BMMYMfqexjHL8posRv1kMJ70y+NzRtYe8h+anEPx94pOfaO96z7vaTTtvjrcQ3hziHhT05eShX1988F2Oo9HuTrvssm60VjM9S4F875bCPKs/yI3LULYb4g9GyslPN1P0N91wXbvqyi+1/Xt3tZtvuiH3P/bt2dt23Ry0zi+02194QZvZf6DdcO3Vbc+um9oF557Tvvqr7t/ucPsL2tbNm1Kpos91NkAV6NlcBqKc182FUo42txk+mG1z03va/j27go65Nr1vT9Cqffa3vXt257dEuUcVRCYvwnVeNyvolqeG7LPPFLOinHcEnXNzM0H3zbkUtGlT9zMKeB+EdPskiShRhhsqFP+iLLMX/3dxnsSHCz/JifwMi+YoJ1+3RNYNkHL5LBy8Hf4OV/eerAnAo5DdDJN+ONsKZJ2r/F0eroOOt37/pW4PEAdPV2Yo08DT7XV1s8TJ4PvZ9mB2bFbNDBsF5XR9qONHlSus6hKpMm2XrgPPVhT0yTzpmOkPDpa6OnX5jiXAWfqkdIQy+cLoEUbBc/mVr3wOvfRD/73iPfML78kESfdtzcBUI1eD9QWCX6OEfljfN/o2zbWJ5zsUm9OAgPWhhBsQkr7QCK93R6YtlflpgzryTNj6AqfzEFZhpcArTUEJYoHZhOv2pQWp3NJv7aP//tH2D//4trZz1854DzxJOxq7zgLghhM9RZPOq3zllBHGg0996tPtuutuaDffvLPbwI+yo6bpd8eNHclGixkc/gbf42/Duo1tfi5GfYF7/9597eyzGaw7tc9/7j/CmIQxjlnQdBiThZhdzMTzpqmN7cwzzmhXX3lF27hhop1/3jnt3ve8e7v7xXeN8NPyahkn1bqPRLsZVHbsMCyM144dW3LDeWr9fNu3+8Z27VVfaPOz+9onP/7htn3rVOTZ26Y2rG9Xx8zuzDPPaFs2xWxmakPbF7RtjLKdevITBBSp2Yllu0n8CmNi5pKziFCEO0M23vn2t7WNE4P8JdCLL75LGJvd+ZHpGaed1uaCh9rD/gR96acQuuUmHxxORTilTEGSO7ODTonbRkrjFCGTYZAZlO74cSjRoMkMRj5KXXumrAlPWSR3new5DKCeviPK63jCsHRHmuFnGKJ9hk7Z4aVPujx3ODsD0s16uzJ8t5QHOdAT7Yz3G8IITUXQxqjHmTu2tjMc3Ah5KDzVD0pRkzPPwvnVj7xPT3cze/3EAMYSlH1OHzb+4R/+YfuLv/iL9jd/8zd5KzmZtSRdeEuujxVU34S37y/lKg4slU5Y6aF6r3T955MN0HybPEW2GiCoFD0D4xTIAx/4wNyg82W9PYdS5IShOkd1lgoH4ji85gNfKn/t135tKm1h0uqclDkcOotDAq7QcPLNQQKzBSAdXNJJPzPD4FF0ocwrLmYOIbqpzJRok/+f3vWOxduU9fZOmXU0FX01AgOW7cxAyjE2+OG6GHshB8IQdBv3pSDIk5yHdpriw7qFicijfsGfSEfJnnba9twU3b1zV8zw9oTymwxFOJW/kugutF0372pXXXF5u/aaq0JRb2v3usfF7Y63vzBwxEzE8lYouLm5UN5mE4GT4bIM0ynUibZ71w2hgOfa9ddc3q744qfbxz/6ofapS/+tzey9qW2cXN+uu/aKmEFd3zbHjOP2F57fzjj9tJjV+Lh0qq2POl171RX50eeF592uDcKobNu0sc3ErGdrpD+wb3c7ELOu3TddH/Tf0L70+U9H2dNhmFo773ZnB/8OBP03tdMDpzvi0MdAOdVmdmUmQEljWTZJ/MflsleIFmXPeEUrxbP3zhhQ1KZooccjbSiqnHngvQiNoMU7fnCUevkgw9OvNF18/7nLrw07l0bFabzgK1rDS/nP9o04NOYsJutDFqOuYfTODAN/5raYZUYe9SWzOTNRiRAYgxDQGapOHg0WyJgZ/9VXX9Pe85735n1eruh/yUtekvd7uT7JfqrfjXEi0a0c3vVNvxMDOn6M4XhCyk8oi9vcdzCrAUqXYi2F2y39LOQSl5sBKH0be65tIdyOKtfv58snbXUauLxzlpjCyOeV40CnE6+cygP3c5/73MQLJ8VOEfsIy+zHgQEbiJbZtm3bmgrRpoGv8yfDOOm8wAky4+RXvOoV7RnP+a38kt/d6q6CMRLW2ZUJlM+wURLC+vXgPINuWWUylF3HlzKqqWzClbGqupeMxZg5ZgOu/GccwyiEhpycihF10H7DTTemceTmZo3cA3/OIAJP0LN5y1T7xkd8U3v0dzw66n2Xdv2NN0WZ69umrTvalq2ntxt27ms37wyFvme6zUaeFvlt8lPou/fc2N74ule3T3/io/kzA3PTe3M2MDkZfAqluGX7me2BX/OQdrd73LdNbNyWhwnud78HtMsuv6pddfXVqeQe+MCvilnfIAYW3U95u/ngyssvazeGcdoZhn9zDDgYIifftm7Z2E4/46yge2M7MD1o97zXV7apjVuCpjD+EzErVX+zl+iCFC1+xVMYYH0y+IhfEWR2hHPBxiE/401cOLMhS3STESZYe3d4umUbKRgDz4ZBOahIkC7aO3F3MlLtAzzCQ2rSlDBkw3bM8nOi1OXtjIq06hMhIRfdjdtzbarNto3B6ztdcGa74znbu9nYOjPw7tuRLAuWwEV+DoRRMUOxSkD2zUj+7d8+3D77mf/IQx2MjYM5JWfo6erbyS0c+ofr/3/yJ38y4y3LjuH4gfbA97GBOUzAMAJN4XqupSq8I9DFO8qfkTGKMttwRNna8BVXXJE/SZDfewyZb4PcNze/9Eu/lDOiPv8rjfR+TvqZz3xmdqpKIx7oODbbGRl7Ife61z3bgx/8de2ud7lbpjEqlhKdFIWlGKfIfuu5z2xXXH1VKIIYNUbzd0sdBw1COVAGRVyOSiNcnYHN6kEow9ysj3BpKw5QIrWeX3IW1Me/yLPO90E6PkM4nH3E8xx+Bi2UjmU2Px0wtTlmiVHWhphVbYlR8P3uf7/2oK/66nbWmee0nbt2R/jmdPe+7wPaldfe0PbuDxwbNodh2hw0rWsHZp0GWxezlCvb3775de0jH3pfKPHpGPVTcmEU5xbympqzzr2wPfBBD2kX3P4r2q79YVCDBoZkaxiRz33+i+36UHp3ufhu7YwwGtu378ja7Nq9M2cTX/zC59rV0daMtf2hG6+/up1/7jlt05btUad1bc/euXbP+9y/nXveHdrW7aeHwQ9euhXBzDVYzdAAuLr7yCwlhfI0ywu+WsoSh5dunY6HbFtq3Z+WxuEuNBCalXhiGOSJl0W7NMynjDREmScg47rYeu+eu/eubMFd+wTqXPJKnOGkyp96jpeUiZidMTBT8/vbV1xwVrvD7XbkcqKfeEgjFTCXMrIu9yT1FUtfBmj/+q//ltfGXB1yOjvLWEbikBtyWPIPSq7IHgNDRsEv/MIvtKc97Wn57ckYji8s6pGxgTl8KMHm8Ay/PFO+nlOJDxlLydYozNTdr9XpNAxNnRYzfXcjqssrjbh0kCqncOlwTq05vQaESyeuoMqG89xzb9ee9KQntp968k9nx8ploohPWkORUCqvfM2r2jPLwISCdXg3skfHPLiE1TcU/TpaNqtZTVduKBELIKFkiia+vAeNUFf+KKwPZWBvAz6zLpvrZl1okDeP0EY+cQwjDNvdwxTG5tzzzmtnnH5GpHE4YKGdddbtYmazo93/gV/Tro9Zx6aYyZx+5rl5imz3Xifc3AC9of3HZz7ePvaR/9cu/cgH28y+nW1z2Le52f3Bu41t1o3Sm90ocI9217vfN3TZpnb7O9yxvfc972pf9cD7R/x8239gul117bXtzLPPaadF+WYdTs6dH/T42POzMYvdu3dP27nzprZ3903t7DPPDLrcVBCznXWB7453jbzntzve6a4xsQqjGeVuiHabC37OOipu2YkGL/5GrednwvAGPzZOWV4KLkR8t9ehTTvTkLx3Qi6eLVkVz5PtDE3E52PMFDN8aMwiU/zlVKRLm9iG+TyxIJnmYPt2y2mWwuLP1IsxjHgHDLSS8xVKs1y2bsEMZq5NLuxvd7ng7Han88+MPA6Pa+euEG1rYOYnkl//+jfELMUNGd0P7YV6inSZzGpn0NA9l5yiqepaQDbJvkGZn2snX7XyMIbjA9Uu4z2YwwQzCfwpwQadEuyMQY2aqhN2SnNjftDpUIBvbBgSey2+4HUj6kMf+tD8JqYUNjzlA/gZqb/7u79b/CEmrsrqg3B5zXJsbj78YQ/Pkbe0hU88LfOJT3y8vXP4JX83qyEMHe4yDJ6rvlU/nZQTDhejo9ND67mfT3w9j0LGx9/ccGnMen7oqjSGZiiIlC2PqcZfaKnAN5sj5y1bNuWe0lzMSHbt2tmuDeNtidKHnmYyO2JW8d73vLd98UtfSpr37tkTBuUj7X3ve3e7PmYvMwf2BLEH2k3XXdkGLueM2cvczN4oPGiJ8iZj1N0t+020L33psnblFV9q89M72/Ztk+2GyHP1VV9qu3ZeH/TNx/tVMbr+UvvMp/697br5uijrhkj/+Ta9f1fbF8ZlbnZfyEC0VfCBgdsTbYNHrsE5KwzU5i1bkp/2zdyDNmGZMuodKrpzkc9hh/1RBx+iWibLZafkUPcfE3QQQhaxS3j81/FeuzIgXZ7OmHjo2ofLRozwes8w8pBhnevac5gu/vzrXBg4AiCPHOHn5ak5AwsZjlkpI7N+fqadYQ9mx+asI5HsBj+yDlLObda/+93vCWPjjr+ZlCuirhqel4I+zSVrBlo+AXBliyVoUH1gDMcPtMfYwBwmlKKlIHQ2ygu/yhHwSuOZwq184qU3S3G010WaPrx0YEA4fKW4QflVnt+tseQmTSnuAmkKhIu3TPZt3/bIXMIRj5bEmGkH7dJPfqK985/fNbyunxoJZRYJ5HcKTJmW1hjIKUYlnrvTRt0zpeIUVe7LzIRBmg0FlMs4UUSOrqO+4XNJa7j0c6QbkMREPRiXGOVucGuykKDTXghlbFyON3AVbXmNS9BGgfi2Rrj6HTiwLw897Np1cxqez/3H5/LXLx01/vePfaRdeulHczZxcxiBG669ol171WVt987rQjXPhTHY0zYFPsCoWJ5zAk3ddu3cmUtdtztrWxqhm268PgzJjaF759oVl32xXXPV5RG+r132xc8Fb2LszggOZiP96W1rzJY2uok6jOfuMISW/xhGp9zOirbftHkyjFbMasLI3njjteFN52GB5jd1LCmFUZ0MxTwfBtHBgb0374y6m4VtzJnBQmnpZGYyNOoTg5PIl0YqZx5DxZ+8H2roDI+g/BPFYGi7UNAZDtvQiPCHxiVxZZg2Hso949YhyTwJ8Zy3WIvwL/iJX/hy1mnbcqM/qTXbGuKR1sDota99XQx+PhnlkePEllDP6lV1LSgc5IC8utfrUY96VF7t/5CHPCRliJNmDMcX8PywDYwOzkmTyiKA4HGlCCtNgbSpLMLvzwCkLVipzE6wD5YNVkq/lqDccupQdPTD+++dcuzScf3ncpVeHFfvfSecQrUuzRVPQJUB8CfzxPtXf81Xt2+OGdLWba6fiHhFRVzuh4Ry8pv873jXO9vuUMDiJIHL0dOpUPZ+dMxIHi5GpVuyMVJVUGSYZ2BiFhHGpfsd/yjXYDSaKJdOuMjLz1NNCom8eSw3wD7CBqfDhvs2bhS2ga+s7uoSCstsTrt3OCcj/YaJbqOW0el45iJONyVsCnzr2+xMzExuuq7tDmNCoV0fM4ybb7imbZxYaLPTu4LG/e3A3p0Rf2PgNQCg2tR/Q5uenY8ZRMyOImB/npDbF/S0cIMwEDfGLOmaduP1N7Sp4NFcGK/rr7mynbVjW9t1/fVts7L37W2DyLeVsQrjNB/y7qejD5i1xGh8ev/evNZm09S6tnXzhnbZ5z7dtm1e3y798Pvb7N6b2vrZve3M7VNt/cyutnlwoG0Mw7V+/+62++or2uWf/mTg3dC2bd2c1+JPbN3UprZtbzPBM8t269dNti994fPtwL6b2pZNMfjZ0H1XFGOCXHZkxP3SaBpovA2+MSGOp+fRcW0UuLQkyFjpNHg4JoD5IkO552ZZbMCnC+Twnzbrnjx08hvvkd9HlZbEzkwD4yofqbpBTbrAPR2zuH/9139tH/jA/8uwbON4SPyJFK7OB9KYzV5wwfnt3ve+V/var/2a9l3f9Z3tkkt+tD3hCT+Yh18YnBCTSIuWyHCKQOnDvi4wIOobUvHAO31begJU/gJp+rp8FCp/5TtcXkp32HswfaIQojIFo4R5l7afZrQSXN/QgD4OIE+VWc/yA2mXo7fyLAcr1fNEAfWMtslZC+Fx3t9PrfJd1On0GqOND/ZF6vmBX/WA9rSnP6096pHfnrcDUAzySzNnlhEK81Wv+Zv2rN9+Vrv6mqtDT1A4ofQppGBLt7l8sA2xUpjrWOibXD6KP8eG0ScuFU5AGrw6YhrlyG9GABLXcJTrJFgeoQ7FJ1x7VOfwXm1csoIH6O/ajQK1L9OFMTBwOR6dM6qYTd1ww41t27YdYcgmw1D4tmhj6qjkVcwSlGHgMx0GST38/IAw8Y5NK48LSQm6uuXBjn8OHHT5b4oyfIhJhrdv3xYp7QV17UWxuZNqfxiYK6+5JtNYrjyQyz7r2jm3OzdvJ9i0dVsYoOkgbEMu7V144e3DaMfMzHc1Udb2LdvDCIdRCRV90cV3b9vPPb9NbD+jHYgypheizqG2pyJ+YnZd+4+Yle7dc2XMBmcD/+3aueddELgWYpCxI+oZbcdARP0wQhvhpZmGWcH6qLPNeLMKJw0pf3yu9oqqdfkjT3frs/auPhRtFFkYpfXRBnL7OYMuPgYJUfepMOaTbaZdfMfbtbteeHYeRnBcPA1NoukGoI4cv+hFL4oZ58dT1vAcr82qs+2Cbnx127ClZXuYbi93wMVProsj89KCatMOyj95gXypz0r6SxqyTWbJovT4QAb5wiq/dPVefa1AeuH9sAJpl4srUJY0R2RgAOQKR5hnFakC+fWcyibwqoRK+1ZEHDziRqHikqghHfIXUznlVvjh0LocrJT3RIIalaivNWr7DI4pu0zTkplj0U6p2YPQGZ1Ee9zjvqc9+jGPbqcNTzhRCIsGxgwiqv6qEQNDQ/hoL0QxOna0YQzj8bprT2EHDYwR79REp2Q7Pq5rM9O95cA87hzylPsm3YmwfA9gYnLJZZiXogPi1bPaBW55gTBxi/GBN79rCcNC4ZBDM7z84j7wu17mmmuuDSVP0Uy2A2Fg0OzDPzjmKNHA35Wp8x3suJxnSoqRoPSKb5amAIXJmIiTdlsYGWnwGF702CcxC5yePZDLkIE4ZmBh7PYdSH6ecebZbVu0z/VhpM44/azAs9AuuPCCUJx3bJsnN7aNUZWFGNHv2LKjzc/Buamdf8c7t9POO78dmAi80abrt2yLOm1sB/ZMt6u+cEX79MdDKbd9bbB+tm3duqN95f3v384649y2cfNWqj/ifJyLtzErC9rWxawLvdp7vWtuGJgwLNqoDAw3wFbNN3zQBjkrFphhBw3MRLSt3Pl7ORkXoVHoqIHJj1JbKMHElWZG06U8+u16N5V/5jP/ETPHvcHbifxpZHsp9jHdNsyg+MbFdfZ9mSk5Wwr0g5Md1LEP2X5Dhw/9+lfYaHz/vXinr3nW5znyPIprVPdW3uVgsYzoJEc8g+FHvlR21k7dHCrMsdsaQeho9hzsMyAYbhUphSm/MPlKeXiWpsrxLG+B8ErH505l0KhVzxqVAPWn0Bx7diean2X1fte73jU74Y7Ttne8DkWnk8Nj3T6P/8aQ1V1kz3weA3NlW2BgAqCmhubnQsjCldClMokkvrjnvDMw4rp2W9+mD3TfBCVY2oAsDAFgTMiCNncPmHb3QWa24dAYcXCVHHAF0lV7d+BIs7Q6THeqjcw55kxZOs7qx8+S3ugTlLdvdFBjSciPpxns+Ano4q/9HLjIKj6jh9FCqw9ApUWDeiQd8Yy3aTwDL0NlJgTUAf8km5uHV+eM0eLcLGZEvFN4YRwDv1NoF1xwYbTQRLtjjMr1H79xs3AgjNf+A23T5KZ24w03Zf7Tzjq7nX37O8Qs5ry220WhUacNZmbTC+0/PvXZ9ulPfLKdde6ZbX/Myq6+9rr2lV95//bgB39923dgJk/XbXFUesEgLRozaKzfvsklyQVfyNv36gyKpbGgOsKCa4tN0bVL9xe1TiPTRfYNDJydgcGmpQ2MdK7sgQEKRhdWsGv3rhw4vf/9H2yXX3Z57lm62t5sxYWRtW+JFu0DvJecAO1X0IVLc/KfIqv6FfTfD/aPLvxg/z24TUGmhac+GPa7PhQ/5adbDGjpFTx3WMkdg/CIl7df5ihIk+UH0iM6piwjo2K91NX1Pv6rO4CMNBwPhMcI0I9wCfMBIOVnaiu8ClfZIlSlhfdBfBmnipO+z7ylYBTPKCyX70QEdSl+8dWd32/gSiMsnqKCkX5wkK98+ynzRqqRhYHpZjBXtUH0O/Fs0TpKN2YqvqiufDn6D4VhVmOpggYK9T6MC0UVcTM2+iN9tiEDE2VZxopEmU4bSqts+wAUc9Yl3qseHOAL0xlA1a0gv+kIVH45EjjCbCBD+esguUE8vxAzhwM5Y2AA17UNbTpo93v/DM3k1GQ3E4lyXJjpkIDiNw6Xz3LfIIxffmFOccZMad++vckLsyb1NCNx8AFp8s5Nd6fQutH9IDfzGReb+9NhMOwxSLwlZh6OV7sW54EPfFAaP2UyLGapuR8SRnJ63/7EeeONN7WZMF7rgocbY9ZzxvnntWtuis4fdXMa7Zwzzm47wwhdc/U1bdP27b40bDuiD55++tkx0DA7GrSzbndBu925F8as6YyQAYY2ZCnqnntrAfODmH2FgUF3OoYiOXVwsFftE1zx1tXTfky8GqMwMPZaAAOzIEJo8OrLl8iCp7lElklStvylLMQfY2zmSQ4NBig4dJD9zBK09OWlwqWpuKIbzg7KP7lhlA9AmHqS/zIm0lhGZyj0DXrZAEZfrPzZJwO8y88n237j6m1ve1t+x2fy4BSs20Z8s3fRRRcdwuflYDFNEHXYMxjWDIH2AF74whe2t7zlLTmLQRTiVATR9UwwCAjr5/ekf/iHfzint+LLcBRuOOpdR/O1rvIYJMwxSpWOS0FcgVb4pVsKbinviQLFD059AL/CylU9S0BC/FIxGmVa2oJnUZAojHCves3ftGf/t2e1a669OrRt4YqY6Ni5PDacwYBOQVMU0f6h8CjwUE0ZlgYmtP1sGJjiud9JyfJzWNul0dbkwSyBIjGrAX7KuGRP/ipTmDzVVvDyvZu55C9F5qyCHG1IGVOOzhWFRrqJtmf3/uhg+yJN4I7BuJG7n2yenZ5p515wQbv4bhe32194+xwYfehDH0w5u+rqKwLHdBjHmIHHrITB8aNjG2J2ND29P2dFU2Gcsm3iz7LZlk1bwnjsb3t374s6ToRh2ZT1dmuAk3b5Mwj4FdVkNO0V3P3iu4VMn5E/Q3Dj9TemYvC7OH6ewF1ns/vn2oEwkDtv3tkOTE+3mWiXmShz3jJg1Hd3GJ/JqDN+nHPmWW0hDJAPUm+O8OkwKLc7zzU3Z7c9+6bbWeecG/XZ1O58l3u0u158r7AJU2lgohmDzBxdRDtEu5Kb5H71HW2hv4Uf71oc5M0CWftolzQyjE60T7g0MBHf7cFoOwOTpZbIYgQdZULFyGnbXDaFJcsmA2YlnVx08tmVPwolH5UPVBjo4tjdgyshJzOQcXXSnwA9WTceWCp3pRT9aQnXuxUO8uXQgw+xfSphwF/6hQyJhw+vfbPnuPhf/uVfJi5GygDOkuRTnvKU/A0bhgos1yYAjeKPyMAgivPLjb6Q/djHPrZY4ULYfy6ojuWDQUbGEd3RtJyKWu5huN7xjnfkRYpmPt/xHd+RHyQyNKUw+/hHAR54lwKMXCnviQLVsUrxonuUXxUPtGFX50ijo+usjMEw3LKU7yw6A2MG88x29bVX5qkk7KATuutI4mVwsG1qRsC42GuhbygbZcOdS0Wh1BZpyFG/UXJ3Vbn1frRnm3ViRtDSW87AVN3EFf3e4WBgzNAYq04JatNuqU1+x5x9/Ll/30x0NJdeHoiBis35TW3T5u3tHtFRvu7BD2m3v/2FMQDamsbp2muviY51dXvr3745/KsCH4W3EIOaqZhthSIMg4NMo2pldXwJYxN1o6ktP5bR6WrW8gDAQl5zM5G/+nn++X4P5KJ2dhgEaV3cebPLUvfuC7o2t2uuuipot0/i1Nq+MGaDHD0aze/Zv7eFCW9TW8J4BSH7Q3lsjU4+M3ugnbnj9KTFBZrTQddkGLzrrr8hPzzde2CuPeCBX50fdZ511nntzHPOTx7k7+WYypiBRGuiPAcGST3p6fgaFY327gxON17oald+/viaPbF4jlbKpS+zQobHTQPaYfkZjAHCcBCVuTv94tdQS+4YmSqroGQBLNIRYcB7yZHnkp2ISVynAqhb+W4+oCt9J0dvknWu+GGAXu8OQDjC7Sfh/Vy81SWAT9LR0fhPp7uW6k1velPqdvH6rwHYj/zIj7T/8l/+y+Jv2qwE1U6HfUxZnEwI9tGfL8vrh6ZKoVfF+kApIFwlfAD44Ac/OCtbCkElVACYDf3pn/5p+6M/+qP24Q9/OJlmumYj296CSybhkhc9yvXMFy6dq/Rf/epXJ31+VdIX9K6bMN1zEZ51RXXA0FLaxciV6n80oO7VIGitsqr+aOg3mLqAogcPgfSVTpx8/bBsg/yLDh+dHB7xmV+ZZhChnD/56U+2d7jscs9OCUNRdRdkUiY6uOUfvIE3O3n4uTcTSmm0ibv3g8ZAOR0dh3Zyv49ir6NoSvojp3hlcf16clW/Si9teEP/oKJBF75aUnH8GU3otmbMIG7bGn4EfuX9HtAe9tCHt7vc5eJI9/+z9x/wfiZXYfA/km5X79Jqe/fa612v7XWvGGNTbVMNBEINxUDgJfm/nxcTIBjT8gZIAiQhCdW4EWMIvIQArph1xW2bt3l70UqrenWLdKX/+Z75Hem315LWu9auvdjnavQ8v3mmnDlz5pw5U6OMy0ZDESxvK9ySuWp1Wsl33HnboL4GczORhZOcLYVmLbEwHFY5FWEpCUrG3iDDYJPx25Db9P7ptjrS27RuczvzjLPbJRc9oZ195rltxdSKdjCE/sz0TCqmuVCA5lmOpHXohs4oa7i9+6bb7kjjQNBs5tB8mwsTjI1xMIc4o9FGc8kFCvFt9+6daV2Z8zq4MBe0mGu7d+0I2oZQD2Vso6f9O7fdenO77rqr2w3XX9Ouv/YTbdXKqTY+ZihSO6Qke8fLkF7USLig8ZGguV5BWDy97il5qxpZkEH4CG9eTVkQuu7Y99O3+C9+Uybd1T4Y3GrVmiBdqfm/twmc04fuet0C/nig3gu8D/NTfav3+g0n6alXYTv/9DTxzbEwHeqbtOsdVLsUp3j14YA8OGl6Fu4uPbQ6lKIw/0RGmW+CJ5yHw8vXuzBOj/7d3/3dnK5gbZi6cCICq8YTnuSLJ6tGh0UYc1pW4VXaZDjw20kjf/mXf5k4yUtc+cKF5VMdffG4k4HvD3ujJYSZXk4wJbD9lrlCQ6gqz29QTwLEkkK715lYwnHiKJh0DL39t//231KLGlYroBCsInnqU596NH3Ou7iUhbkgR01QUAjEyoLju9/97qy4v/qrv0ptz89yX3nRyrQxgGelfaqh0gaeXDFtCXJhmLXyH6Zj4VPlrfdyFQ5IU485j36PVj4stDX0vIAqGvANN13f3vu+97QD9nqEAArWzfkEQmXpotU2WX3xHyGE2ciTiND9vSR0nDMvSiw+5tBKfuo45oR4CEU4gQw/eJduNYZqdMPlqnJWHukdrtOgP+uboaJ8X2qIzdBW5y0K56Vf8bJoJGflMBY/IGxo3Sj/WJtaPpXXN990042DOPBdlvMlO3fen/MkK5avSCVMMe3Zvbutit/QMecyE41Y/LPPOqs951nPaWduO6tt2bAlhHnwcuQxPxO4BD7IdsDwXdB0cnwyhx/nZimzqPdwh1gxB2ba/aEYHti/r80Gj7M0+ykHWSFtjCUXdNY50GmwaXV27kCkZTWbTstC2z+9p+3ft6ft2bOz3XrrTeFuaTu23xMCaHc768zTApfpoFMo4Ojwmc+hJA6aS7LB0zBpKJWgfODEElHp8Qt+BwffaF/W5IAPoDSokHCdz+G4jAsFuOGogmHZUSQUVF9pmPGjLnLF4kLUYdSX372Oe/0X+F3An8NzeKjCVrzuelyCVJrFa94zz0FcvFdxKg3fPEHhI27x8SOF4nMnpOtQ/8f/+B9zBd2f//mf55FS8nWYrWkGuFVb5i8uBeCKgg9/+MP5uzr6KQMiXOVRwFKvduWUA1MVhr6qnAUUFZlJ0UmPjPRdmk9/+tPzWvma7H8oyHgPZ6MlUBCII4xxvxLwRTDhuGHEIcdqcbw9DUh5CMslEvFdfFYLArNkKBUVKS0FZcE4YkWBpS185UEwv/3tb2+/93u/lzgJz19c+PnuSXtTiiwjJ7SybpiNLCMVKE7hfCoBnscDeA6XAx0K7xKAfgtTUN+Kfn4XzvkcvIf30XxTuRD8A0Fww403tL+/6r1B45mcX4gQKbyE1puWJvDUc61hsr5UuX8bJNXxDV0iL04eiVsIuMRtUDZAWKNzzcGEhMlHfQeVN6jygeEwOV8U/r4D+aId3tyxY2fEkVcIk5xA10GZa+eff0G74ilXhMUxnnTnV+WBvzPRKAnnfd12622pLHK+IRKYnZlujsp3qON48LpwdmRu2rAhb6t0evLB4K+1q9fk0MMTLrq4bdm8pU2OTkbPPXr8oVQOhNXCEkrFHwrKfpq+EGAkepv9/pr54NPdu/e2Tzsg9b57265QLgfNNY1FpyHKbLgsFXf4JT6BXvJQ0MDy67z8K/xYVSG607HC5udnIp9ou/FRd2I+LB6nBnzqmqvb3XfeHt/wWAjd+dlI+2DED2EWfvwjyUgn/vMvaJFDYIgaHvoiZHfUcPwdUzA53DasYCIsBXN0Jz9+VI4ACoYlyWrBO56US9W3vPB/tYFhPhgG/vLzFIdDG+3eUyn06smAanfmFwhqPXvfyB2ClWMFFP+VkC2ovD5XkIYRF1cPGO4qvMybwMW2A/zEr/KTN14nw4zUmDMB2pVw9d0T/p4c8N3BuC996UtzVV7JvALvympkinxHK20KDUzuf/u3f3t28ivN4bjHA98flgWDADKkVa1BpxU58Wg13wwzcPwQxXcKxQTTy172snbppZdmuPqOCJ4c7XnVVVcl0eo7Ykn7hS98YVo/VeDhuBjERUO0ORx9B8PlEQ5Qht4xlMkxadPMtLnww3FOJQwzSeEtr8IDQ9VpyxQIBcv1xnGslw8wBieN4TS5bPga96As8g1KpL/5BBLj+huua+/5+/e06QPT9vhFmN4jI/iC6knzSh/0s7+6Q1ok4gzTCENWFN2iSSYeZcEUs6sTc0DelSOVTEQRX17qVdiCVKKBO1f1CaTrd5Y330vBwEXvlNLQUCbSUYzSeu5zn58Wing53ENOp7KUv42qYV3MO4plIi9iuyM6KtImdO3oXx483VeRjaZysBzL6cYUzvp165M2TwoL/SlPvjxXic2EheJ0g8PwCYf+budUVuV0pA3hd1/wvBMatm/vE7K3sDKCHw7MhjUScUYnQwmFwKdgrJyzdyRe0gpAB4sQrMazV4cygDQhgY/GoyzwM/Tp9ISFyJNSc6qAAzRdrLZ/39528y03thvDqt2105E1s4EfvNGjr3zLQysz/7DqBvNReShnapR4D5xydZ8f6jp/a7+sw89UMKG3Ah8UiXIEryZ/xF8KSB+jHJ2Xe936zgG8o2zCqldDRRSFtmLOVlsiR9DS6lYdTkrEjav2jumdG44ywvG//tf/am9961vzqYP6hje8ITupBLc54A9+8IOZv5WwZB5IPg4CeRZODxeqTNr+3/3d36Ur+SBd7+rQUTc61niGPwfEVU44KqPfaFH4iI9+0uPg60n2mez/2q/92rzeAwyXBz+SgzrdnnjdUB2L51WvelXK79p7JL2HAuEe1jJlSJSQA4bKOJYAAckpqAKqZL0AFcNCoPmsYIBwpSFfeRbhzKH8+q//eu7oxSwKjNA0+U/+5E/mGUN+Sx+IJw2C+Zd/+Zfbf/kv/yXz5OdbpVvvRZgiPgJ+9Vd/dQ6tWUL9UOX/XABdilHkr2z9nouPpklMqfqOPsY4C3fKWa9DuTGCBRKUYv1WBkOONadkn4d3k76+KZO8TY4fXJgPorf29v/1tlymfN/2e9rS8WXRM54LwTPRRpaE8g5p5a/oZGmy+QVLfg/OEd5doABp+7M7XfiMQ2ygt351fD8qUKPOc3VZRLXgQNiR8X7fTMVV5mocBEa8ZD72bLCwhAV9ol/yvf75y8e7PrrxZvs+li9f0ab3z8Tvmfad3/ldicPEhLkHwwWB94KVYFO5i955aMuXUyJL2vs/8L72P9/21vg9kWeV2SeyYe3qbHir16zO4TE47gse1eDsZQkuCwthJPjPRWl9cnvZ4d5wgyBJC65bXmWFLrS7Qsg7VBO/EzhcKoWQwAsjQa/x0XbYSr8o27g5oCjhkVAUY3r6obCjtbUj8bRgYn5mLnFYv25tdLp2Jl2cPN2Fz9JcpLBxw6Zop7tCSU4ErY+0sSj/kUh3JBSZ6w6mlq8Kftva1q7blKdRn7b1jLZx89awdKUT7VZ9RVrAZD4u7cuUQ1BhDmUMf8rFnh/HA42FdTW25GC78MzN7bxt66OGzMmEMhE7yIIe+AhYzj0T9eUD3tOL5vCFNkPeaOPKRtFQHmim/tGQwvHEA/y78jGCEXwc4fXO+ZfckWby8cCp12p72tFzn/vclD2W6MqjwsGn+PGzBely8sCrcDMl8Cu/8iupMKRZOBjC4k+oVz7i9La8LBXov//3/z5lpbjKUTjBs2QsRcEPn1oJRrm84hWvSF4uXIbLVO2w9tihNZlUSkd4kG0t4pwIpJHpBiKPSMEUIqA3lsNZqZUGxPxWSYSkITIFFc+z4ioUgviNSOZfrGAwKY8ZaFrWC0LbdJVIh6tKEk9F/dEf/VEqGZNUlS4QtvIqkH8JXyeu/uIv/mISEBT+pwqGy1nl9k6p/Oqv/mrOCWk0xfQqET2A32UBFo3QkeOvDJ7oIp73S6OH4qRm7xSBeNJ2L3xudIy///n2P2k/8/P/JpfljkyGcAp8uoKJfO2fGTR2NNbbNx5vOOnoMuUI078REurj2CQ9BWNDo1VkSg5H39RtWh/51xvv6ETfEwU8h13yVPFaxBe+6psSyOGbYNvi3QLzBawYK8QmJ5e3A9N9FdkrX/mqwMOBoytCgIdQ1e1vI21qckUo6L4xdd26NUH0I8F7H2/veOffRNpWju1rk2NL2xWXXZr1YDhMnvdHZ4oFsz4a7u49u0Nvh0AMKwjfC3fgQCiaQFAuhsEsECB0nQV2MGhp+bEJ9VujU0XB7AseJlzHwpqymu+wZVvjIdAmQ9mMsfwMcXUFs0CgUvSR5kLguGQs6Bv4zx6YzzrctGljHvQ5Mzud9SouXrCAYNOmzSE4nPwwHkowCdbml0TdjKrTSGvZWNDDYZyr2oqV69sTnnhZe+KTLgtlsyGspKin+OttKhKNDolz3JZmpyQsukHdfjYKZkkobTihJf4zLLb9/u05ZOSkiviSHYOy7AEecpQ/RZG8Fmnv2rU7ZZLl4/hcGLwTJAzQ1jp/CQ9v9VxQ7/w5uPAb9jdH+6//9b9u//yf//McmRGGf31/OFC8LX346ESxnn7+538+FzNpJyUnKDQXptU9UeKIW/yuzOgkvpEbQ2bKTRZYTKXdcdVhzeXxoWBYRDqpoMqCZp7aWOFY8lOaZAm/Kq+84cidCCr8w1YwCiqcdwARhCngX9/qWQUppCFWRObnez0ViGKpHh3Nq8HqtYPC0TOHAaLH7mll23//7/89J/INOQB5IAaoPKoS/VYRlltbfod5wEPR4OFC0aAAThjLkB4GcjkZKPp4csN0hCsomvldfsKWEPfNRVw/+ZP/qr0olHL5oQGBnCt+QnC95W1vaa/92Z9qd4eCGaNgQvBb/dQVTOQdSqQPH+lZyi8aZygVjJjDS9FozRfoFcLRhLrzvpJBI58+7j8X+dk5H4ok8FNHWRdBXj1vTDu8kx8ovzBHn4O6sxhA2lU3lvMatklLJgAOFW95KAznfk1Gz9zY/v6wYCiYpz/9yqjjibbORWGrVqeSmRi3Giysv4E1SEjZ+7Jr145osDe3T996czuwf087/5wz2qb167qQjrzw5b7oKa9Ybp/XZPCqU5wXckgJDnjYnTDjkaYlz+PjU8lfyjEXNDwwMxtupu3eu6fdfNPNec2Anf3qN62XKIslyAejrpZMjJpUSWVqmGss6ueQDaRRP+bPWC+pYEKpzs2GmzkY7cWZXBNdyUWeVmakRTsyFu1pfSiY+4IOG9LaMqF+eDTa9NigtkPBjARdDkd9Lxt1a+qT21Of/sx2+hlnB/6BI0Tw52FtOuok6t7QnJowmV9csyTKnrvnD1uiHAombK0Lz9zazg8Fw+4pBVNDYvDQJnT27rzzrkgfP/Thzb7nKas6nhRAtQ25RlrxwBtBvnj2gN4LDJ/CBY+gcfGRNKqtedZ7fQNOPnenjEsBa/WUdPD0wwVpVl7w0CYM4f3BH/xBrno16kOeGfH5ru/6rtxzouNYuOEtbbrS0R7JSVMEFAygPIx4CKddaWfS9I4HS/4Nl9V7PQu/ykO7AMrsfThOtdvjQaXzsFeRCTPsZFoZlZ/fw26xX/0G9bv8EMCQj4ot7ZvCaBCmXAlb4ImwNHStkKCpxeWMoSK6nj+w3O7KK69s3/Zt39a+7uu+LpUYqLQfDah0MQUBZRzY2Kv3qkxQdAEVx7PohDmE9SyhWmlydn7bd+G2x9wQFb1L4QnkSCnTu/a6a9t73/e+nrc8QphwuYoplEn/zfox32Ac32nFFnLINxp4CDO9X42YIAjsosF1RWL/Qy9L+Eaeesodd9ZHeMd/wiiLrCkJeqLvtwjFH542OZpvSAsmG0MPl1ZLCJS81VE6kZy4nDDimmiXl7v8JwJv8yUm9mejrNP7ZnK+xAS8yXkrwjZHbz/nKEIwrV29KhXKVCjFyRDah0JhrF65Ik9GZlmYz5mzw9xKtei5G7pBX0NGKTAGk/j79pgXmI5yRvk17hBuUWthARxpe6f3tdvvurvdeffdociiExUCNPeTEIKUsXv+paV+k4xRH2gc9TGaFoFeLBsgs86hQ/nkooagCCtlIdLMOZNIg0JTF6wJw2VOBSghY55HfbAgTtt2epR/XVh8B9L60UnAMuafpg/syxVzVsidecZZ7cjgGmsKHK3JdLN3oZUifPiHZRUJB13UDUyjh7wwm6cpW0mm1dY5ZIF84mL4zqqod7/7PcGX/RQGfM0aFYySyc5NMlGinRBFT/Abf3h+5jftCx4dfJfmYsh2osyhtDuN+sVlL33pS0K2XJjD/fiwKykCNGOdwB0ng4Bq00C7kL75afPL5oK/6qte3pwK/cxnPiM71sLAqcuAHrfyhqeDVjdu3BBK6excaXvmmafnqkfprg5+Xp6dIEqmb1wGx9LrOGQHMn4Pu95mH4zrib6dCDJ8CKnP2oL5QoLqiRTDKYN3QtN770VOJ5MKa7iOZeRJedHmnhxBDSiqR4MG8IIPAVzK4L/+1/+aQ3p6H/zhrEfzUJCVFk6Zqt5A0UKD/5ZveXV7/S+8PneK673hdWSKZhbC7Ej7k7Bgfu71P5d38h9ZGoI84hPaBBhB1tPRo++bFgk1wz+EgPFsk9bCUDi+pUAPQapREnpwi/8z31pa23uevZFHFhEn4gVqXXH0ugPqgEMv9PAERaMqu3IZdtJw8tuALobIJOXAxxVTK+O3OmUBhaUblsxZZ53dnnbFU9ua1WtTCRgeM2xmhZV07SkxrHPPPXcH/+zN041d+uVbjv0TPPHdcf6GuDZv2pTf1Km9PujondBMhRs4rVi1MpXAHXfe0W6JnuZ08CDBz2oxDyXMvCHI8FNeVycXrZQ5/oXrw50m1gkWCzPQ1FE56CUv80qEs3SKptI5ikd0OPC6b9LybsOlE5fNj9rw+b//+q/avmg3Bw8fzAM5R0I5rwzFY3X1+MTq6Mn//8ICXBdpL2vzUf8z8WE8lHmu2Au+iIxSkS4Ny210LNrh/IG2cjI6jYH3GZvdaLmxLQ2crCQ7HHStNmfUwf35f/u3f5dKJTsTwSc1xAXgzXqFtzic8j04zGfGA10x4MOBxxA4OFXaSQ/jgANYtWpFCv7Xvva1uQJ2GIQ/OZz4e/E63JWh6sr8kWTL0qhwwjx6IO1Tnz7c4f2wLZgvJCh8NWbgt8YECEcWi14AbW5s0jwL68WEvt8qcrjsD800Dx+GmYTDVBqVeSOT/MOTe6DCwwWTpfCM9xI4oCrPs1z5x//RI3pyLkVkyeTmSmEyBDxau+a6a9q731v3wcSXgQATqF/qdUyAa3QE56yltHOzITBCYQ96koly4iFvDf1gCCyLPI7tR7ABUPmEJxykCacUDJF2z69P7ANxuKIH/ww7SIPr9a232fNAz1IwOUcUPTKT9ybjzcVQIrkQIoTl6uAJcxmsFt/vuO2O9tu/9dvtnWFNfuiDH4xkLZtd2qb3WiyyJJe1W7ILCG55odPu3btyKbOhW/ikYoBnKJ/qTIyORz7xZ3Lc8Mf1n7q+3XnXXaEk+rxXF/ADC9RCCkpqMJRIIfXyEEKdLsoOv/6OJuqh10WnW1eu8pdWKWffpQl3T/gmzSKO42l0AsYnJjPOunVr85QA6RgOdN8MJTQ2HtZgWISbw/pzUrUhJ2VzrluuDoRDIGqJs7IvHFG2g2H96rhE/rMzbXkow/VrVqf1IiweU0YOTvaqXX/9dVnezD9YIlAM18P2cuAD3zovCAPSEo4wpUTcD6T99LT4qUPyQWeDhYV3DF+yvCnp3gnZuHF9nrjg0j7bIn7wB38wR0XIk6Jb4XxyOPH34fjF934byjJMq16GwTdleOg8Hwl0ujwakOUMhnvcWjC9ofVeWlWAZwqBAQxXTIWt3ht/YSu+9E41DaQ7jAMBglkpFhus/s//+T/ZezMvU4IBI8MFXvyqrNLwDXivegP1bihQo3jND78mFStwhhZh4ADKENftzX/y5vazr/vZsGDuiojxJaLmTZXB6zbUScucDDxnZ0P4HZjpk/zzg4l3KESYWk102FhO4hfljT8vhknQmfJShkxzcrDCLYTwXCgr8zRRI5mGeig3XDb1JL5y8/e911XvyRMYXA6byXcZq2tZriIz5LMyeudjYy5ec9GX+1dm2nnnn5/l/PjHP5GTxGeefkZ78pOflOPdm6OXff/2+9qNN94QuR/OCXzDZF1YdYHvfdfuBwKv+eyowAl+FIVDMQ0z5bDEhOGi0VBGe9qnb/10u/e++1JA8iPYg1I5dJb1HHXUhX8ogvguvnT5EZ6ET2QftHUemoNAKRg83HmBHwUQSaXlbmxeujX+nuWP8kkP/pQAXlSnW7ee0caisyWcxSDrN20M2nws6iksugh/YGY+Omvroi7H2pYtp7eXv/xr2pMvvyLPRzMHgx9YL+Zv1I35lCXBa2NR/ihBfJ9r44Hvxeec3c7YsB6T5bAmvQ0fcYDJ7t/8zd/MuSGKokN/CqIMXdH09spPWbrr7ZiyQAtWNfo5Lw4NOq+M5nC4jqew0tDxsKHRN/HsDzEHou0Y3eAvLFe8CWf+J4fOv8cD+UrHU7oA7TuP9/L6Xq6XtbfLUw/JVP31FEKV8XGrYEoIFxTuCjb8rDAqsjfWB/dAhsMLe6ppIF35SpsjLOUBD6vHTM5xFI6lypSNoRgMTNnwY+2Io8z8CDLvQNqEifSseGG5fM/3fE+79EmXptLI3nIoB4dPshwW4u9Nb3lT+zf/9t+kgsnNcnp7wmoUga8GOzHopbqwi4KJNp24516Y6NGCKEU+fcvj3wMoMPwqjaR1CIRDh/oqld5DC+EYeBDOLvwytg6ErbpSNr+5+l3lLTp46qXqger1UTBJYwsVAoGRkfG2asXqnNSfmFieCxOm904nDmedeXYKVsN9VlmtCSuEUDGWPT29r117zdVt+/33hUCeTIUNf5aMuMBYvAl09IQjfzjpJOwPq5DgFuZgxCNs1fM9996bFmDUQl+NF3T2dyieafkMykiBjwRO9rAoY+eXI0k3QhKFLZxAKjzticfwS78DZyTxwBPi8kcXeEoDv8BNHGHiEeVcHfktb5NR3ksuuThXp1GI9++4vx2Mup4NWi1ZEkoxOhKU0Ste8fXtssufEpwU9F7WFUzUdFgrk3n/zXyUeWQsOgKhDEeD7yainpYtzLeztm5pF555ZlNDDlZVZ/CiEClU+1R+4zd+I/d34Hn4o61vQMeBxTg11Q++VS5KwPxr1n04C3dqkls8GxV912aUvxYMVXhh0KPqzzfh5C0NzwqrPuSL7r6dHDovHw/El1ZBvcMhssk8wHAYcao9nFqQx7F8ThUoA/wftwqmKgEMv2ehwvFTYSqlfpc7XpiiwaMBGjXAlPIsBuO8Y35hNDRzMnASFsPX5kth/TZOS8kI77fwlmZrFDVZqEdm2WeeLaanpdyRv1Vkh6PRv/HNf9x++ue6gjFWTsE4/XdZaJtuCVA4FIQGttBsQNTjh5ffJpGlnaaPchA0ES/pGXnIyz0qymCohxLpDcSwW/TqrYqKeJYya8DVeDhp8APCAN/lDfgJUxaMORhlt1rKN0pP79d8xFQIzU0bN0evdVMbHxlt992zPWlBwdiEqZdquMzk/JlnnRnKZqzdcftt7c677oy09FoX2tbTtoblNZGdgFwkEvEJf3M16g0QeK5ZVk8zsyzQ6MFHWXY+cH/bu2dvdh4cy0OpoGkQJXFlxRyI8Lm/JH6jYdJg0Pv2W9lzg2X8pkgNaSq3BRG+UbLAd6vVDPMAc434A61849QHnFkyAC9FguFGo86Wtckox5MufWLieusdt+bTXNxICPnIKtI72M4974L2spd/VZ7rVpeZWfSx9EjnAx2ipYHf8lXL2569u9v0vj1teVgyW9auaU+64MJUMl3BRKcrygwndPNUHkrGAhirK/G5hT46TvBHM8oD/p0Hlh61SPwGFITf1Z4pEGnX9wK/uWP81PnXb1ByoXjTt3qvOBX2+HBieSLu8PPB6ZR1dix9z5Pn9bmAdE992oX/436SHyiM32CYAYYr6WiBw5WwGmYq8f2u8KcKCq/Ko5hWvvKr98qX4uAvHBjGW1jfPf1WDgKDIPFbw9OgxNd4SXoCPhLBthEvBFkI5je+5Y3tp//ta9vd994ZvdUIG45CibdUMLVMGQ5WCyUeQTJ+hngOzXULKpIN6IIFnvz0xg27GZunTFLB5HxBH/vX2AloK5qgBndlkpfwlU6Vrxz/zC38la+/E7adVvBOv7SqrO1fCOUx1raddno7++zz27rVa9qeXXvbrh07k06sFz3b5W6GDIFuaAjtZsIyMcyloTtK59zzzhmsxHL3zHhu7HMUixU6+/btTbzM5e3Tc0+rbK5Nh2AkvHfsvD9w7HVa5aRc4OeDXfipYLNsvf6l5+4aPvJDk373TVgCgV/esxPgDpvey+7lRgP7fsw9CScvVgD+SKUedKeICW2/vdcQ2ezsQlhFK7KDs2nLhpxfWr12dZRjOvEIbov0e8dgZViFL33py9qFFz1BpqFkptr46HjuCdpx3472gQ98IA/pXLthbXYyHF+zd9fOtiashG/8mq9pz3na07HHUfGLl6s+PeENj1KOaMsBv4XBA/VbuYtX/K5vlSbgN/ytnkC8Y/zUwxX4Jn04evrGT7jK98RwLP/FUO33+NDlARjGx/vJ83ukIM1Tn27R+3FvwQxXQkH5VXmGvw+HHy7v8fxOBQynWzgt9iv/k8Hw94oPhtPrT2mFfzL4II48cmw3nvH3x6FgfuZ1P93u2X53Hv3hoMScdA3hZzluz6sLbstfJUvBSM9wm5VVFIabLDU4S5Hts0hhKf+wVMRlsbisq/cg+3wSHPK0gXCsEI0tU4488aEy8CuacPLgCJ/ylw4nD+mkT3wbHRlPoTk2Npk4b91yWrv00svb5NhEu/P2O9tIlNE4vQlyloW79VeH8jFWbzPamtUrQ/DORprRG169IodPdoaVWAtGKA5H60eWOf9iP8yyELx79+/rijTcvdu35xEecwcJc5bIslzQQHHALTcWRi9fORRfubMHH/gTrC7rshGTgmE9GU5UNhbMmJ39YVnNz89mHSSNB8LOHAgLphS1tCiYXkf9JAThKBffWTnwYcG4llnngDKbPzSfyiH5InA3/OkZzJJzc1uCppNBl7moT5P/a1f36zd2bt/Z7rv//ogXlok9OsFzTh+gE5cHH33/d35HKJlXtCWRjw4NOFafHfwuv2H/40F9F/6zgcXpnSyesMPfK24ph8VpfSacWMFUusdLg2UK6tvxcDi1IM1Tny684XtiKnyBA+SL4PW+2K/geN+Gv4Pj+Z0KGE53+Dn8TsCU34ncMCz2H/497H8U4iev9I5GT3im8ohG7jmcv7CdqR/cyAkzy3I576UE+nBUNApRCXrOe482YLSuCAhIgrTn8WAlUvn0NI9ZasMNugQkfAk8v8t1v24REswmb3MfUIAVXDfdfHO75Zabc0ixJsANvVxw4YWJlzj2DHBwdUoxHAx9Jc4B0t+0YWM7bcvWXLZ9zdVXZxoUJ6vP8uMbb76p7dm/ty0dW5qWTx+qmsnjcZSt/qpMHJCHvB1FMxUWFsXWh3e6JViT1WV9cF359zk+iqTSgg+/opWy8itl43e3XvoS/rxDZ4iO5rXwRnY2Ir0QtWnlufHU2Ww7dtzb7rrztrbz/vvS3Xn7p9utUe57776jzUzviY7H/nDTEXam7d+7u+3fs6vt3b2zHQiLimLWISgonAsK58X+BfzLFQz7ncwthuOFKbf4e8HJcPtsYXGaw7D4W/0+UfgvdHjcKpgvZkhBtciBBzEii2VJdI/T9e8VVhANpXrRPT5BTrhbXjqfAtbtjlZ6zeeKL3MMM3kk/GzOP8xmOMtyKRhpEswUzLE8+HV8PPXm+54DPcEuAIeBsCtHQBKKBKL0CD9CmGAlZPvqsf7k39+7AiOIAQHN8uDn/hbpEP737bgvrLd7WmDetpy2tW3asjlbwu4Qhjt3PZBW2Jq1a8KCWZ1DUoZopA0nwnHD+g1t7Zo1uUz5+uuuyw1uhujgaj7F0NRek9ShiE14z1HK6BtpGTpUBkNVHJykneUKge5UZ+/y9ERbdOiKvFt76q7oAODVv/X5K0NM0oYPQOfKAx0L+KPNkcDu4EH1a9itH3CZdRPPnFc6MNMOL4SlE71r97i0qDt7g45E/R+MOHt3PxCW3K5QsoeiDMEDEWYhrKBcth5P1lhXtPZ54dEviZ0vFvhSTT9OgWA6vsuvA3diqOWQTPISjASV4RvCyiR+F/TdYillkJbH4Ftusoy/bkUcUy6c/PspvBRHF5K99yy/3uM2hFM9aU6YcsKWk578UylGXvXeXe95E5TlgHiGtFgYJopPP+vMduHFF7WtW7fkUNjqUBDyZ1ls3LSprd+wPod99OQtsbYJkmKGC6WTS28jXQseKJONGzbkEeaG2Xbctz1xdMS5obI84TjogyZwzIgBiXf5BYiD5sqODnA2gT8ZCpIFQ1FSLEWbekpbWqVQPcvaGaZN5SEMGklfmSkf6ci7FIiNo4YGM5/wMwxq8t6QImsm6yDSy/zUATUcdZmKJhSLHfvhHbQJ3gjF4oqDmel+FI14ET3TyNVzJ2FNYU7kvgSPP/iSgnmcQzW+FPjZCMsthhM3VErDZjqrmhZCoYC8l94CgFAaFEdtUOvzAIMhGosDwnnvR9FELzrwiAQzDUIuFU9ImI5jCN5QaJQMfAlMQq6UyGLHf7ErAVvHhnCLwXcCeksoExP5QD5TK6famvVr29Ztp7XTwhmKct+9uYTxsBhWWIG0ZlUbdwhnxLFAgdLJJbMRX3kIcG5yfKKtX+sk5dNyCM7mREKcQM05pkgjNyEGfXTYo/Q5x+H7ocMH00LJSfu08JSnK3J5UHBo2q2UvsscDaWvvMriCQ9+HCXTh/mW50oqaaMDBVI0K1fKiZP24SORXlgxrDVTLXDlKFu3d64MNxof9ElM0Fum7m4biijPtwtH0SwYVrS3KcpCARlaC+0TuMb3UJSqKnJIdzKoej2e+xI8vuBLCuZxCNVLLWH3YDhZI/Rt2Brok8s53JTDZfE5/xNG+C6s8z6YcED4vHTr6JyASeAeOAVAvPa5mPTJfLpyCoEWrnrcmedAyJUwlV4Xqr0nXmWTLuWSve3offeefO/Nl4KCZwkg36VD2PLXaxfG/MaadWtT+FMc69Y7+HJlKJfxHA6DN0ViibFjUwh61oi9FHCrfDgKdXUIcgpsS3xfM5g7qQMtawmusngqSwlJ74YWpWGeyHJpCsc3cz61YMJvy5ozfAh10JeR17Bmh3qHn/fK1zualdXinV/FF77Pp3H9vbuuzJ1llhP/ngM6A/HVzKGw5mbD+nFLJ5wd/QLUrSXfFgpERrl3yonclAz1EtFPCNLGM8dzvn0JHl/wJQXzOAQNPYcyQpCVAClXiuC4kIKhC27DHiZ37Qdxba/VSpSGDZd9WOZgc+CgsfP907N5PlUKvxAiR7TzVCLBPvHUi839L+HfLZ+urISFH5yyVxzCpgRbPAZCI0UOXZT5Roc3w8DNkA8BmyuYAgjZKrcn14WhNAlCVzdMt+n9B0IQR89+ybI24/DGfftCCM6mVZPKK9JS1hUrl4flMRXWzJYQ8qtC2DvifzItNPNTykMo5vxNPJO2gRsFA6RHiaEZJeEyJ/tx9OwpEOHzFIXAi4VICHdFoQ5605OWcBk26FUNklAPwqZ1gjYpwCNsp0eECuQ8nQGmrM5cM8dh/kVa4rFilAeeflM83vnhgVQiypJl6kve0bRbmP23Y4I8hUM3Tr7SSjwCKNXqHFCA9rjkXin1rByRPksYDg81/wKnYX4ednD7Ejy+4HG7TPmhADNiaGXTOLKBRPnqd72X0AP86rcwGpH3oo+GW37Sr/dKS0PUQDS2SgtIqzeuTt/yB76JqwFp+NXoCUJ5OKDTklfDNFZAcZWnb3b+129xLr/8svYVL3tp9K7XBL4L0ej7MmMCQyMn6N/6tj9pP//6n2/37rg3d/JTEOZkOGkRisKHKInQ8T0EpD9WDhGTK4zGxhM/loTJ6b1790dcQihotbT3ojPWQEj2+ZjIP8rWx+FJ70gv/OqKXHnmYYOBh1OQ4UJoCW9+AF55KkBkYWhJHnChiOzDkM+ePaFMZufbEy6+pD3xkieG4F3a7rvv/qyTzVu2tJWhVPbvm078l4ew9bSnxQowQj2FaNJCnSrNkjbnAMkQ3oaKDI0pk30zyrtr757Eb2L5VBsJv/d94Kr2gQ99sM3OzwXO7uGZaMsnp1LhqGOKwT4gpz3bT0ORqfOyLkaivMqjYuwhMUGu7vHe6NigvGEhGLpaCMtjfyhP9JiMPNSNuTT8lHfsB/1dCyBtdUWRU6ysN3npPEyHAjbPFtWS9aUu1AlAT8oz6RyuK5LAO/CPBPIYmYOBg02WE4G3sko3raVI03LlnNObO9gmlo22f/Wj/1f74e/7F4mXMnca9zYI8Pn//t//u33qU5/KtsSfAmdBVtuwaMNmS5ZftVG/bbjE/9We1DeQR/JipMX5zaGnpzKeDAo3YYdliveyEguEKeCfxwLpqGT763Ny3rMdDqINRUmchnHtcapt9A6avBfnMwyLv3H8hv0fDPxP9O2Rw9F8o1D/5BSMyq+KKqZQtirnZwMqtOJipPI7XoURHH4ThmA4jDgaXKVTTOMJH2H91qA0Cr85ysO1ro7NcLGQi5eEsQ9DfhUnhdYAlPmSJ17SXvMjP9xe+XWvOtpTLSBA/O8ssp973c/ljXVttDMoRUOg1fLh+JTydAYAAP/0SURBVMc3e/FVbgKGt140XPWqs1GEUNq9qwta2WlAevLCKuNwo5BOh6gTN4WE0IAT68U7J3wJiJpLUM7+PXrnIz0P5XUCNHzcdUL47n5gV576fEkomMsufXJaE/eahI/0WSmOEoGD9Pq5Vf2ab0Ndrk3ue2D63RmeFMuCIaCw6CZDGaE74Rafckht+84dOZxm3mVFpH/bnbe3v3vnO9rVn7i2zS/MJf4WGyh/8RNHcPIreniiJReckbg53geelB/FnBZCCClPgtYd/bt3PZB4yqef9Nx5r+hHidTwGP9hC6b4x7BgDcFVXcGn+NXvnvexuR4dhrlQmqlIQpBOBL4rKLkIOxM0NEwoRTii4WRYWv+/n/jJ9prv/wHVjXiZn/Tr+bu/+7vtP/yH/5CbWYsP8AWlBm9+cLH/CP0KR79rRz/cWJOu6OBvgYfDbSkpceUjXSB+vZ8IhC95Iix6VR2C4fjCDpcHbvIsvCus38PA33fgW6UN/MYT6F9h4M35XX4F9W1xuRaHOwb8T/TtkcNR/AL5f3IKJoVeMEQ21qholYNJFLoYxbvvQIUqu8oUTgMcrqhiCO/S81uaxUwVxhMDukRIrxNQDo6/MBnsemZ31YhbIA8gf+/SlIbL037t134t06p84C4uYSG/avBAWar+vvnV39z+3a/+u7Z50+ajQs23nJCNIH/85j9uP/tzPxuCNywYi6XiW7R/yBwtc9Gpjo7nHDuTO/UDSvikf2inXQ/sCZziW6Q/OtqPhAHSKLwK+Dkzi4IxFKcs0lGGyl98z6qLKrNl07m4wFBc4OhOkhzuc1FW/Ga9UM5nnXF2u+Lyp7RpE/TRqyewP/Wp6/KeIErGeW+gaNjPuOo9e4IXneVtJdWu+3e0T998Szv//PNzGfGGEGY5FBi900/ffltbQbCFZbBq/do2PjnRrrnuuvb2P3t7Ckrp1aGJylDCA66+ceiT9RM0kLfKYFlRMBQEhxbwyz0qEde7sLt3P5DpSZ/1YzjRdwoHVPxqE8pVefFL2gcOOcQYfvIpgGv5pVKJp7jSYEUdDgVrGfbhoK9OxlRYTcLM1dBoxO0KJqzzpaOpYH7kB34wlb0jaITFn9LUcXJc///8n38av/FkP8nAsB8l0/HRzii8/j2SH/ijX2+DNa8oLof2riL4v//v/zvbHpAvt7i8J4LiP2GlXfSTn9+VznBaVbeg/NGbq7qpMBUOoLnf8gMVtkBevsPhRLgPpyfcycH3hwrz8OEojoPf/6RAJVXla3gqhV9VCAGeDTmgKlMjLD9MoNcnjWwo8VsaQDqVprjOCnNx2Otf//q8wOxFL3pR3uPtytOv+IqvyJvwfud3fqf97M/+bHve857XXvWqV+Wtm3CQfsEwU7AsrrrqqhwygLMesEYtDDyr8sSXTqUFTw2WK7/hcmMkcXM+IYSA71z6hVMmv6WtjJx8U3gFLfWQvUtPeFCTznrz+BQ/+y7fYm5hCz9PUPjz8134zCOe3GK8gHTFY2VV3OEyqz89W8NFFZfz21UN6tS5bep0mDfE5e9QyhLG0uKv/Ap122235TlbLLNq/NJWfuH5UWY2Jz7pkkvay1/28nbuueemkINr0UyalT6QfpUXLsIbphKm+NQ3rpex35OjLMPfhK90fRdWngSUPKoeQeVVNAdwG4aiizS9++5d2p3nertgjeCnxG9g6QVzZRrHrOFjaefvCF/+8len6G4DrEUjnTdYb8eUC4BHFCniHVMuoM/B9eEoZYLX3r372vbtO9q1117f/vqv/zqtI8PJaALkLb2TQYXh0E+62rt2qfNQMkKaRdNhpxzF5xUOfmVRCgOEKbz6+XBduXLCVNhKUxqe8JPucB1xw1D+ny94XN8HczLQ0IrZOESu04vd98/Zt/CP//iP7d3vfnfejf++970vx3/1blV09TzRRUOQjjSBihXGndi/9Eu/1N761remtWKOhPUi/2HhX3EMdUnHhDCzvhgFYDLvN9xwQ3vb29529DplaQzXUTHjcH1pAPyt6HrqU69oX/6SL88hA2GOhosHRfCJT36ivfNd7+xWlqGxjCfNzqD5OxzmpIiKSSvvYUVgjsP9MOZixAd6kb5VWpV/pSG+eYa6EyWH1KJHTCDJS5zh/Pp8UMezv/dv4OjQ2uC4e8LLXIrjX1wG5v4aY+EsFHMN6gxdcnJ+UKfy9K7h+63OOX4sFmWRzu5du8NyWJ6bLOFLAM9FuQkCK8jQMCiYe2goNAoZL6lzYeGsXB3vTtNh2gLvI+af4p21Jh44Vt5OM2C4UJmKxhZd6OF3mnarQxmSPuGk7SlP5UtlFmUznEVxSaPKXvlVeL8LX2nX6dnyyzBBYxP6eR9OPgflC2dZs2XOz332s9uVT31a+rO0Kk3pwdn8y4033hS/8Wwvs+/9HW26A36zXJIHB+XvuOAhHZaOP0BHbUjHz1BZhe9pD7WPRcBfeeGmHt1X46LAN73pze1d0X50OuRvdKLCF99X+uKTBazqW265pb3//e/PeH7jRfuoyAxKBF7aMag0xOfUo9+VLld1WuEWA/8q64nBt5N9f+Qg33+SCkY5uCK+irjpppuCMd7U/vAP/7D9+Z//efZqWB5/+7d/297xjnfkCa4O6sMArAfKh5AwfiuNagQYCEhbL+Z//I//kYqplEBVeoF4QDzxfSfgnHpczA6GGQXDUXqUYTUg38Uthqnw5aTt6UK1l7/8Ze1Zz3xWDvGACpMKJn5/8pOfPKpgnKZMMObEY+QtD+CpTA5wLCaPRAZWTJ9ozjThNeixFp78h8vNZdgA/r03bb6pW4uW9BJYuRw2HCUInyxrJCPvnHMJwbc0FxD0NDklyh5xoCfvfhlaa+vWrstlxH2eaCGVuXisEOmhTTXa6t1Lzzu/EuyO8zfRPRHCmJBxEGRfVtznhh6I3+ozlbnyJ0kOpwKzBBqwjvTOpVu0lI+yVp36LX/0cM0ycGGXsEXP7noa/LjI7Wg54r+jYflVWYbzKT6qcN6tDqRgpFv5FPgOyg+OqXzDLUgr8JXm0nBduQcPhZLJ+Thx4BU4Os36uc96TrvyiqdlOrUysMoCXx2ra665Nvmy30g53I6O8TqI5NNRJhwculLRNmTbwwHvlIDRBcOjysBPmarMxwNpljMX+uu//huDS9Guz47opz51Q6S1NDuL1ZkDVSZ1KS/hf//3fz/v3v+Lv/iLvLWzZM073/nO9p73vKd97GMfS5lTQ+LmBKte0bvwLHyAtIdx916/KwwovI4PnWaPBsj3n6SCQVyEJiRUko1wb3zjG7OCWSyGoPQcWDR6EWX2C++3uz8IBRX4rGd1QY020vSUvoZHaWGYm2+++SjtPOu9GK1+A8xi4tEQGmYHlS4QB86sF0xs6MD34bT8Lj9hDYP4Tbl84zd9Q/uWb/mWtnHjpsTRd/hm/Gik4BNXhwXz7mELJvzjn7kKPUDg6UTiYOdsREDeqWDGMDbBFeFDeKd/0Kry8ts7KFz5AU80oKTg1C8dU1+RXggm7+L2xqO8gUv4W21l/kFaVkKVQogQUu1/EdjqMzdVnnXmWalU7ME4cKCv5jKhjxcs5S3hqxcvrcJL+qDq2BXELJacY5iaartCoTiC32o0+4EchMnSRZc8oDJw68OFS1LB6ERQTHiNwJGmPEo4KGvlC4f8ZhVZlGd4iEl44ShJ4YpG8Tp4RviIZa5JWStNNMbXxSuc98pbvDwhe6Ao/K7yg8q38vCOdupGh0Qoh6RyA8pFXP9HCSIPCPobXzaSFszTn3JFhso68y2c9idNq8GcZH3nnXclX1BCZdkeD6CavDuAAcoJVQ6g3l1h8eIXv/homwNoAIbDHg+0kze/+c3tL//yL9PKFZxS844eOosUWKWDvugFDKf93u/9Xvvd3/29VDT33HNvdHK253AduXH99Z/KWzyNfnzoQx9qH/7wh9u1116bnRi4Fp+qD/gWP1Tdwk2HVAdGHfKXt2fhc/Ly+Xay748c5PtZKxiF0jjqWZVT7/wVUKGr4IR19exVhLDF3JVWpXOqoXoP8tMz+OM//uNULvItnOEFh3oKK075eX/BC16Qgkr4igM8mbmG1iiDKlt9kwaoMnpyGv9Tn/rUvBiMohlOr4DQq4uUKi1+VsWcffbZOdmM+YzxPzsaLRwx+cte9rL2lV/5le2iiy/qy00HjRhIw6sTbq++5ur2nr9/Twpa52P5kMIvBI1VSBpPhOzljepBh2T0eLdHhICXruGaLOWRTit5oIFvhTdQ96AUvt/eu0LDB71OomlmPAqtlgoTLj2MutHT7/ErP1kkfYP0BBVhRqhfeMGFbWpiMi0Ye2PU1ZYtm0PQb8+JceV1uGTuPYn4hNBRpZn54WfDaweTlnrsKMl/z+7dWY5VoUD27NubgpFScZpyldsQkaXCriVwXA3cCJtKG/7KIR2/xSs62TOTQz1BF/Ss8J12XbGAqidxlYGSyyXOfCNOuU7bYzyW9Tp4T4hXK/GkX/l4Dr+LU06ahZdyU/OsUGlmuumkG7+FDzwdOfOsZzyjPe2pTxt86u2+cJEH/nb8zrZtp6VCuOKKK/KcN3OQVoWdeeYZ0RbXpqJ3Bw+rwRMfKmMf8pNu8S/rtHfovvVbvzU7i1YAyq/yzTLA9wSgnGSZEQ/yo8s4k+99ToZsoLh07qQpvLJUXJYJ6+WGG24KHzxF/uGz4uuOq7ZAYVEUN998S+b5tKc9LWkCv3JAHHnrgFJ8f/Inf5JD9R/96EeTz/A/Wsi/4onT8+qyseqPpaizrRMkHJykoSwFwvkmjriFRz1PBL5/1qvIZCID44lAAbzrEerxazx6/fwg6Z2CISQxicuwLr300hw68F1emPehkHykgBDSh/MHP/jB9q//9b/OHgJ/DshbuZRfWEIPFPNhcNcaw93vwlUcaRgi+63f+q32lre8JXuoKsY3IGw1TLRSgRoEpvln/+yf5WS/eYFKE4hb8aVvQhEd0dc4vrQoFg0OrgQSBtfgACXg0qi+gzrwzaY8DFGH8ffmt74598FI1zJlfwQpIZ0bKVNQdjoIrxyZR7AJgVlDb7l/Ihj0UFg68lL3aADEVRZxi9l9o2C5vqiiC/OqD3FKoBUdPMVFp26F9DHqinc4GqzGOT/bJ/lXLV/Zzj3n3HbFU56aFsaeXbvDYt0eDXZve/rTn5YnKhuKka4hULTk+tLjvgpQOpWnci89srSdFo12et/+tIh2Rl3Mzc60S5/0xFymnBe8Bd65cIKSjHRcU+BEgKkV/egWPVR8YtgTPWoOqHi0ypeK91BXUAcP9TkYZS3apOUwoE2HY717+dXcBoeOnPSlIR5/4L1cP39uSFFlOr0NiMeBSrO+sV/EX5a8Ft8jDZhFTu1wdBAiIM2Vmy4nlo60n/yxH28/9P3/AhuG0u4W7mJQpwStcksbn+B9ZeC0CZ0F7UkY9aUH75plCfutLXLo7Apk9aMT5h3uhb+80NT78aDoQwD/+q//evvN3/ytUAB7o0jqoHe8XvjCF7Sf+7mfy3YtrWHA70Y4Xvvan87hNJ0jPC87ThrcMFjk4FK/Cy+8oP3Kr/xy+5qv+ZrEr/hdm4e/tvvbv/3b7Y/+6A057Cs9KzOf8pTLUta95CUvSfzEEV67qfJIj1whFz/xiauTVsJSxPhdObQJHSNtRAeKE6bigxPRDVS4h6VgEKyISHu6T974IZNOo6R1hcEIKl96Go3Ge+WVV+Zd8VZS9YbSK/lkeX4uAF94yOfjH/94+4mf+IkcRy2iI7hv8BQO8KsyCvf1X//17Rd+4ReS8IVz0UqFY2a9mv/0n/5TjqeqdOWhVKWFJuCJT3xiXslrrJbFYbkkughb9ARw5oD0fZcfvxI0hTdYTD/lokLMjxxPwfhGBLz1f761vf6XX390H0ymH731urUy6eEUZnFCUKBFzlnY6BdpG6bpQxcRPoShO/lZP2hXZRan8NcovEu35j7wCkFSDUdaet96nMXIwhN8hGrvYVdPuk/Ig8ghD2u090V53fuyaeOmdvllT8lNkTYiuhPfkfnSQQWNSzqUM2vQU2cI7tL1TUODB3rv3zvdNkRP0pBQYJB7a+66+460MtWjjpN9MOarLNtF47R4ojftrhjDJ2hjEtswC1qgQy9zr39llZ/n0pF+X42Tq4s/q64pdc/iRwoG/bLe4lduOo1v0vZdmkA6QNxhkLYhsviQ9SQ8dyy/Yx2yTvvebj3lwdElrBgKhmIxN3M4snH1MqVHwYxHnf1fP/pjoWB+IOvpRApGOeCqDEWPwtk7gE/SaYBLlb/CU0qsc7+1RYoGntXREQ/IR/2eCMQRxtNIxS//8i/ns+N4KKyLde37vu/72mte85oUxIVnpS8e+fiTP/mv2kc+8o9pMeu8HThgVCeDxO/+HAZL8MmMn/mZn8kRiaqP4XRZRpZev+td787f2qPrzVl03/3d3xVK7bWJEyga1pPCfMMb3pBTBrfccmvSi3/xlPTQhZIh+yzz/qqv+qqUXdoKXi5eORFIQ5oPaw4GsSXMWkHs//bf/lsWFMJ6Fr1XalihMyTgp7dBy0KOkIU4ELYa2KkEeFbhi6H0eqze8I0rpgSICY9iao3ffglWBoXoO9pU+Kpo/kx3+1u+7uu+rj3/+c9PhviO7/iO9v3f//3pfuiHfijX91cFMV9B5bcY5MPJAy7yrApHe1CNSbii9dE4cMtq1IwX12dUevxd96nr2vuuel8Kefemo5H9Cnrn3uUnquGGFFjBvAQ/HEzeGjoSRljOkSzwUJ/DNCo6Ae/KSyB7p5xLwUhjuNye0pemb5WWd+HtEfEbDWoHfwlWm/rgu2rl6lQ8B0LQFOxyFH+kId2yVJSJMkFb9W6eB46UWc1NOBXBkSl2wJsPWhkdJmHuuuvOVDJ4wEKAI4l/p3lQJ62Q/QemswduqIMFS7npMcJfQy3Ak8qW5ctd+OFH6Uca4Bi9j815eWZO6R8uwhh6knbFqWe9iyNs+fX38I84Pb3OX1UvQF7H8utp1DMvqlMX+R554zA0CD8LN+BCMaunZz/zWe3K6OkDYY8H0lSP4i3OD42Ab8LAybu6ozwqnrpBb/MY/JVF2KKTMJzyS7vSXwz1jSNo1bV38uviiy9q3/iN39i+9mu/Ni2jYZpKu3CV//bt96XlSg7qIBhiro4TPuvxkmRRFhbtkRxye8UrXpHD4NIu/JUFkGWsI51aw24UHusHfxgxMsdbw4EF8hHfSI7VcB/+8EcyTWF8qzYMd+1Dp4us14k238wSv+iii5Leyjic9vHA94c9yQ8BFoHVWJbdARUKIKuSIVBMmpkEcYBevHFQvQrfhPts8nwkIN1yBAchQKMTJrnCJxq73zV8ZzhMpZrLePWrX51KgnIRtxQhogLPEn4ElG8YWq9DbxZTYMgSKsqvvJ5VXhVadClYTIv6LR9OvuJUPGkMp8eFRzg+Ufb+MgRdyFx7/bXtvX//3uwUHDxMsA2u7g3e1cPKdJLh5RcuGkGWP94dT6LsIG/fk2R0V61CKiGZ8QPgVjgWX3D8qpfpXT713VP5Kg3fFtPFMFCF4fLcsmUDngulsGb1mnbG6WfkN3Mwvmt4Gu/4xFhbsXJFe+CBnW37/duzEU1OmRQfCb5ck/W2ceOGbEzmWDZt2pxLlQmKHD4IS2pV1KnDHOFA2JTg4QyVeVpN5W56QpZCKb6jbGoDZrUPzm/peR8Z7T1twkgY7773snce6PHSK6H7H9tgKMywy3TVYYSrtMq/ryLs/sN5gZ5Pb8NVF96llcfIsCw9wyIZie+ZVvwODTIYsuvpUkLPjrZvFVlP88QKZjh/+ADpcFUGDgyH9Z54hfNe3/yWbsUt4Df8PB70euibIymSF77whbm/jXKx7Hl40YD00UadeffER3WUjXohT6SlrjxXBi/CST5+T02tiM7t+dm5NU8rvO/KIm1Pv/HR3/zN3yQvAcrFN7xOhhkiw3PZJsJVXWujFhJYDbdnz+6BHOv1vhjItiqPdqIMz3jGM1KmSetkdAMZJjL4rIfIOL0uy3v/1b/6V7kqopQJBIsQnLQqXd8V1uqmn/7pn86JvAr/UEg+UpBn4SMvTxNoNT6r94x48CIkVK7whIAy8fdbXL8Lz6qsShMjFVReVbbyq3dxpVOMMlz249FBmArH1W8OlP/wN+023uK/8F+kYNI/3Fvf9tb2ul98XV8Suaz3iBxWueQIvJSrlwGey8bMIdnVPpHWjh58L8egZxuC5chCH6aiiIsuylwNWrhuHfQVW5iaRYnB4e67ISVzJv0q5ejdhyXiKS0K8Cg+oUgU3zs8AtUUcobp0iKaPxQCf2N75pXPbAvRq3sgrGvnnjkXbO/e3XnApUZvBc9tt90Z5Djczjjz9BzG4uqIEfgCjWxm/1yeBK2MwbFtPHB1J76ly/v37U9+rhVwlIo5DdcAjERP1WnM2gzcpKX3aFl71lWUHT2KP3xXTjv5DZHNzc9kT1I5gfA1TFi/QwTmM13QJJXtgCf79853aC6e9OHjm7xBWmoRJvMOQFvfO+2P8az49S6uxQ9puQRNHOO/JMJLYWHJkXYQD0X2LKNU8hH2J370X7Yf/p7vzzwcznkiqPIWvvL0Dp+iW0H5DeNecYAnNxxP+lVGYYuei6HSBsNpFgyn6TmcvvdKV7vQmWNtmLP2bni6LHgjQJw8LrnkkhxCJ8h1dtRb4cpREOpXWk76eOMb3xTv90Yu/dicyy57cvvJn/zJtKzwU8WTj7jgT//0T3P4jVWlbRRt5T9cZvG8y19a3/AN39Be97rX5SgMvxPRDRRtHpYFU0S2asr+EUQZjlMZll8hCxnaj1Y1jOQ3Bx4qz0cCKkUlFKHgDSgNvQmTV6wploYeiB4oc5plVT0MZVmMo6c0ffPOVdrD4Ds3XGFVIUXDguG0F0PhX98wSfkVVPrHIN4zeODXX46BsPF3zbXXtHe/591tz949IZRCQEfvvR9qaH4HnlwJkuhpBU3QpU/+V7lL8ITAD3lASEHjQeXwHv+klycUR+/Wb+VwwVVfUNDrpw/vhICIsNKwvwJehmDcU2OjI2HlgMjocDXnZ4ljqMW7K4yTFvHRogONU9zdocg0cOWxh4WyMiHMaeCG1nbtouha9szUPetKD5FwxzMrQyEBm0mN/sB31YqVkf9CDp2tXRMWefilkgka9foIYRDlNKyGjpbf3nXX3bngwJyQtPjLX1y4UmKZTsTzRGO8zIHiq2GAdxK1XPdIGOY5aQLvBA0al3Kr71yv08738uV3vHyFEbZyxnYqU2vAY+Zh4CKM9CmhZz2jWzDCnsiCQbtMdyiuvIrPy6/eKw4oxeo7OB7elW69Dz+PB5VW4YB26IYufkvfN+G4yq++8YOX4SojJmQOJWLUxGpSiqRO/uCMmhiG0gmqdLjKo9LVWSPLuhW0MjtHV1zxlPad3/mdKWd1lAuXildgUYSN5paDV70LA4bDDceXj9EZacvPt5PRDfj+sIfIJIzIrBcasHqt4g4jh6gKyekVfvmXf3muiEBgxJJOEetUw3C68Bp+r99wqPKWP1dxh/3KDYet94LyLxpIo/IBFbb8weL4QPxKo9IE5V/xOd/UBfr7nfHCrysCTbr3XDI/Urmn1D71qetzI+eB2bDiRpbkZsIuIII28uwiI3HHyHrqGpVFANJntQjTFwWEIPIM/iTwJZPj+TlEEngOnKE1s8EHQiAfPnyw7Z+ebgdng7EjbsjRwDloI+9ugkW5SiA6G6wLOudX6aUfjvQPRiST/Xr6yjY/Gwom3o8cOty2btnczgmrggLbsbOvvmOhjUfv3jj4jvt3pDWCTolbPM8977z2lKdckavFnA49OzObHShhDau5EGwkwlqKTFkZVptJ+gWNwrqTRy1TBtlwvcTvA9PRUw0La27W3J8yLWn373RIZVhhUXdzhyiboGvUxaGgUwrnJEOUK+qXUuwQaccn/mgsvqBdQAQdM//MMuc94JJzQvEt04iwwR2phP3oqOq5EjKh7NO/p58bJgdx5FNp5ZLtaNuGeNAuUolwwhJiShyxrbKK8NlpiHC+2SfznGc+p10RNGa9wPvB0BVHVzw9TfMKflcbqnYhXPE8B7dqG96Fr7D1zXPY1bfh52KosMNpc/WODt4L6jtAs/DxNuR/LL72xCownzgxMTmQlSvyt05bhevpi+fZRwX89ty0aUt70pOelEqJfDV0ZzWbzvKxfDt+2kqno4VXk/muLdgjBhfQ29ix8oEqnzlp88yUImVT308GmX/0Uj7rITII1NNud2vD7QqnDSFMiyqcdxrbnIaeJGuB1rYrHlGrwsBng+g/ZUALrqDoUX71uxoVQLvhOH7XMMzUckfQj0avfrC0FaMLKrykQsj/6dvf1v7Nz/1M2/lAWKAjh9v41GQIXFfmdkGeaS89ZnVhZtYEgUyg8te71bkIORA99S6QZISfoezIGmG7IJBx7wW56x9+u3buafMH9KSl1/PAG9Wrng6hLB8gL0IwJ/Ij7uEU9MFDR0I5hOVij8W+sAqiWeTKsWc+85ntvHPOa3fdfVe7/c478hgXXeuZ/Qfafffcmw2LKRL6NBc3EGTm4vTO1hsrj3woGWeL3b9ze5uZmw6+XpXXJKcAiMaaZ5Ipf+C2amWfTM4bHoN+6D0f9N83G3USytFwXyrCtix3zT8QFtPHP/HRtn37vaFQbM6kyIPGY1EeZY1yLVvW91mwpnJIK/5Ya2iCJ9DJO0XShz46P1gK24VQ7+QJp07VFRC36hidgd9pER6t+053dZcCPn7Li0teCJdCMOpXxyGtzQjnKmVWnGFBCuZI1FPOw0R5bLT8sR/+0fYD3/19qWzEgQsc5F/vFp7oYbOYDV3jibK4sryGcuMdeHJwRqvyE24Yhsv62MFjnd+Joddjpxnwu++3uTlXABuus2iA1Y6O6sBiFL/JbCstjTwxEIz+9DZdyu/4gOZZP5HgZ61g6ikchtVQa2yRn2EwQwreCRNmnsouZPgXI2DSk+X3xQCLKx6gT1Ug2vnOFf0L/BbW6g7LX03cofnXfO3XRE/mpbkSSToOX9SAc9VOKAh/b3vbn7R/829/NnelhxxrY9EDN4QzN9uVhngjY8cUSaYTDd3+mj7U1f0JZmO487mKpQ/5UCz1Pj7e51vcY8KisYTSN/MEu3btaXP7zbMQWPLqwrD4xPBU0UZZ+Y8EsktGlrbZudnEg0I5HJYOt3fHnhDUo+3JT76sXXjhRc1hhzcGbcyFuLlyYnSi3fipG3JOxi7xsRBg8lM21tC61WtyocfaeK5bu7ZtiY6RjZrz87Nt7/TuoOHgmuOgqx44fFJoB255onPwMxrxd8nZ/Tt2tnt27golhE7G/Efb8pUrIw3H9Ds+5s72gQ9e1Xbt2dFWr3GOGbuhr+TT61+2FG59XqnyQQ/KTR5w5yiYqjPpGtLk0KyUgToQZpiH1E/Vo2+e0gBHgleK5ygYc1z29ciXE89wqg6EZezmXsxLURxWvh0KelqsnUfJRBko5cmoc8rlR/7FD2e9LQm+6ekfe1r0gZf/6I/+KOWKTqnNw5dffvnR4aDsKQTgaTgXLYZBer6BkjPcYwtfOAoGrdRZ0cUTXeobh/Y6Mujpt0l9dcBAIMfxfh8m7zwk3MloWnX6sBUMqPfjhYdcZc7Rhnp3VdEF0tAz0Si/WGGYpsMNYhg0ejQlBFS6nocenuXh9vVY0WfiEJ0x0fOe/9z2U6/9qfbc5zw/hbpGL229UFfjRttOBfMzP/9zbbdJ9rBg7FdgwUQ2R4UVBQOXYhSNeEkoD8oA9F4zRlsWPdawDmYcaRPflhw+ujSYNaXKe1wLKPoR8/DcvTOEdg6DpbjpuIa/vChDe0oq7y7QQliGkJZHHtcffuZdDI0dmjsYPeKF9vSnPa0997nPC1xm21Xv/0C75757Q3j3e0KczHv1xz/ZZkORQsoE/JJIC22zFoJG69ZvaGtXrW1nheW9KQTa6Vu3tTPO3BbCfyGU8QNRrgMqLdJblWWhBM33UATKCbf5wGXH/ffnXMu4sepQ8EEBOeQ7IWkXuHJdfc3H2tXXXt0OLUynMj54yIS+OiLIexz0qjrRekrB1IIJVkf/Toj0BRklTNDMu+8UVSkQfqUMfSNY8IjvyZNRDvhVXeTCgbAc/U48+OlwsLooHogFHuog0w+/+VQycI76ivRGI84Pfd/3tx/5vh/KoUwKFDNKE8jfbvRf/dVfzest1AtaKac5Ukv8n/3sZ+UGRL1ow+6+w7fKpbzK5HfxUpYnoPJ57OALR8GgbdblQC6jDz80Bl1xd1mDH4Sptu8pnG/ig0rnZDQV1/dHNMkPPDnMSdjIlFOxoCq2GPl4UEzwxQrDzM8V7dCUwmCiWlBxzTXX5AYvR0I4XPO//Jf/kqct25Gul4H+xTCUjeW1T3v605JxCAj1ppFnPQS5P3XDp9p73vfezOewfTA5We0UgmFLKayGFFh9aaUnP/MalR+cCVW9VENNdbyLb/IihAgjYdQyJedId73X2QNzKSwtNcr5gxA65gAixQjpTDFDUYGzITRWTioXjN3auDwD93k3TUY64m7ZtLl9+Ze9pE0uX5GT9gT85NSKtnxFKJf5g+3uu+9te/dPt+hNhUIlLA3TdKE9HuVbs259W7F8ZQjMsbAiFtrOHQ+EQt8f9TAd+UaDi7JMjOvBqSeCbKzt2z/TDub80OG2P5TP7bff2W741I2Z10FWXbTfpWF1jU/YtR/0O4IOQRdKJ+rasui9e/eEot8VyicacnQAAq0sf9EWqL+aU8khynC5MIOyj/ryHfhdQhZU+6r6ynQivO8VDs/4VvXuqRZ6/tGeI5wVfpSZ34fCChYCblbMLQurFi7GG8fGQnlOTYXl0tqBqB+W0PgkvjEHs6Q97znPaVc8+fJBXp0v5QOMhthX92d/9mcdh3DwosTNhRnKMW9oc/dVV/1DDs07z0u8YTlS73CtMnl/7KHj84UAVX70QJuiT3ZQog6KL/iT10VDz/L3XungGe/8Twa+f04WTIF45ee9kJYuB6HFadfvyvuLEYpmaKUhGW9npRhypDwspLjuuutyrJSy8V049ARFd08MoEFSCt/y6m9uv/ALr29nnH5mCOdO/xwiIxpCmfzpn/1p+zf/9mcyzYNH5qISlmQPd+mS3muBz8KRfiyFIU8KRh6zczNpWVT9ElKE7Vz0XC1F1YNWn1aUEYL2jwhXeJof0UMaD0FEMeZ99aFUqgwEZBdkGHvA+F3cZbmkHUZUGwl/Q1V570vIVpbIylAOT7/yyrYs8ty584F2x11351CT5bcUiw1j+/ba6NYVY+Ia+LNw9IY3rtsYCmZFWlWGuPZH2Mg6hPNcW716eTv//HPatq2nZXo+mDuy1Hr/nr2D4YQ9uWSZ0lbuVWvWtLHJlW10wm2XdnCHoA9FR+5MhtCdWjEZym8yOhA3thtuui4U1O42M9uvPyasq07RRp1LV4spAdCHwkJABK3tQcr5sSiTOil613vN44BKV4fBk/JJSyzoArJuIyffsn7DGeKyfNxiCGGlTZmML59o6zasbxs3bMx5Kwp6+YrlYe3tabffc3ee0za1PHgnaKZT8GM/9EPtlV/5tXlIhAvi1L98AGXxIz/yI2nFFO4APg+WH51XWGqGbjZv3tLOPvusnP+1T+XpT396zvlaai5t5cK/jz184cg1NARFQ/RE46J9+fPz7lk09w5Klg/7VbzjQaX1iOdgPIcRL7/F7wUVv/xSeIRfMdIXI2j4hrxMspUycTCneRWTbL5p0GhVdC2aA/VW3+qdIP7mb/mm9iu/8u9y/JQAIohyhRWJOZjkf+3P/nSernCozefwh3yie5/pYq5o1pkmQZSWULzP5cnHx4RCQuStx2qoJpIeeMGnD88UH7AypkIhSNtT2QjkHONPIdZX1XQFQ0mxiHpa0uF8Hw8ltGHVmrZ+7dq2dt26VC4U1nSuCgtzP5SEifTtO3aFFbHQpsPK2RuCjgCzYsZZbWvWrmurTCCHkDIn4u6YFVMro/yBfFhUy0LhHth3IBXN7gceiLT3RPi+fyYwSvyiNlJJHgqLzIo4is5KIMrF8J05sCWjk202FJZhM1aauJYim4vadvq2yG4+FJCNmHe3T17zsfbAA9sj7STpgC6dzpT/bDjQFUP/ZqEBulISoGjlOdy2ji4UCH+4c6Wo1Ie69wR4qBSMunCyMzq5h59yhQuLbTx+rwwL7JInXdouf/JT2tjIWNIAXWeiE3FfdF7uCiWjPIFlG42X7/jmb27PuPyKtjTC2ZiJhsmz8Y3l7cI+R6sMl6fkRtI8f+t4sKBKjihn5w2LAqx2uvzyy3LFk03dyvD5kTFfOAqGkq26B94B2g7LD7+rvXZaH/stHCieqfo4ERxN57NVMECkguGwhSTwHA5XUH7D4b5QAa7D+Hr3PB7Oi8u1GIo2KkXlMOkpE5scDX1Z6l33QBBYevgaWKV7Mqg8q/7ktWHj+vYvfuAH2r/8lz+eO9pT8Ec4w00apx7yn/zJW9q/+fmfTSV2ZFlYPdEA5Znnig0YyabKjBc4lzCiXCiw4d5lYBEIUCB9DF6DF88fqymXK3uPv+wFRzhX605MTOVvAtluZsqQgHYHilJZvktwEKaKyarRa7caafnoeB4Jo9yTK+yEXtZ27NyVE5WjoWzuD6XgvCfDVrvDujAnc38IvNx1b1d19Lo3b92WVtb+UCRWPB457H1/FCp656PRuz4Y5T+yJOprTzswvaft2787N3MqP1oR2OZf4ByEzTTWr1ufw19JyyDNXPTQZ0K5LAnLUM9+KpQZwTwRFox5pIWF+bZm3ap2YGZP+8ePfah9+tabgn4HI/9jPW/lZyHZByRdG17RRdlH46kO+ANDiUn7cOpIGN8okArjG//hOqxvxUdWwLFcWK/r129om8LCMwR66223ZbndVzM+PtnOOu/8duUznxOW8tlhUU61g7MH23h0Hg5HvTuTjQWzEOUJQrWJpUfai579nPbE885rqTaDQPIrfsP3Nv8Z/qUQ8QkctYNSfmghfC9jkj3Bb0qvK51+g+mLX/yi9v/8P/9PLqsdVjDiy1ccsLid1zs4llf/Nvy7/Lj6XWXpdOy0/EKBKhuAK1hc3sUwXL4qu7I9VDxQ8R6WgvligSLg8WAxjR6K2L5XGMu5XZdskyrhzoLQI6ze5XDYYciKGqQ/HIbQL6bWiAjQL/uyF7ef+MmfaJdd9pRkhtEQyBovoRmxU0m85S1vaj/3C/+23RG9epP8R6Jhmlw2vyztzCsEgrQzjUEvMIepjFENwLfCixAgFJ2LlGkEir7bGNkF1fp25uln5XJfe18I4rPOOudoWQjoPG32YF9Oa6UXfBOVSEdZPfV7l4WVYWiKQiEMd+7aFQrEvpKluSk0980cXsg5EQsi1q3b0KYifcrABPThSHTDxs2R56q0duw/ODBtLjEEWSgVSvJIKJPJicmkS9hTofx3tv37DwROGlkgBe1wlk4D+LEozHWpkkORRmjucBQ0pWATZR+WUFb0XRJd+ZWrHf65pN1x163t2us/2e65586wBiiGPqRFuaOFhRNd6dQ5bOolBHBkRkGoqz5xPsAl6A7wlu8lpNWX+MP1VjxVQmQklD5aWd697fTT22mnn5H7iT72iY8nDua1zG9deMmT27Of86KwWta1idGwTqPulywzlBZKIdKZD8UShIx/s20qsnvqpU9sF597VhuVV6SjDHCBg3wdGGt3uvahIwYn5QfVRszzFaCzYvDvHZvILj57nh4WouvKnQPY5w87JG9GAOmxzKvMRQf4FH38BsPvwHvSO+hc8JlpfD6spi8cQAc0edgbLf8pwzBDAUzEFbEW06f8FvsPg7iY2Xj9b/zGb+REppOoTVxWT62Ep3fgnZ+8C6RT+BUIByzhdEaSXbzf/s/+WW6+glOfJO+ML2xaMIHqNddc3d793nfnMNUSbST8JF3Hd8ib5SE/8TKt8FsWgk/YwovSKUEmrHxYMrlaLel2uK0LpffMK69sT770SW1jKJnxEIrmT1ZGj154Q2FWoO24f3s6u+13bN+eQnX3Lhcp7W6OxhduNsJNh+BxH4vTky1XdmXxgdl+oCp6OjXZvJNyH4o01q1ZE3k/sT3x4osi/3VtxfKpUHKrc8+GQwjvj7xYBywX8aI28z1VcQ4/zbfpA9M5HLdi5cqwNuQbPfIQTobMWEwUFGuNpTQbFov7XFw+Nn/wUDswN5PvBLNetiE9Q5KRSR+aCkU4tWIqV7pZCWZezDE0LJUepw9xKrs4vTdOUQWPZP3j0YGSoNQCsv4G9S4N34pPuapTLsPHbwKf1chqyuHDEOwbN23KpyHAHcGvDwTdxVX7yrhsbKpt3nZ24L4uaMWKpbyjkxDv1r8vHGFJjTUbVMfjuXXTxrZ21cqgVXwOV7jAE852uuNd+y6AI510IpRZWOHwKdfLII2eDr/6bbhVm7MPzwZE/Cp8lRugS/FuQYUp/q7wfgvvWThzSfMT0vYLy4L5fEDSIQj3JQtmABgYFJOcCDAV+GzoJU2C5B/+4R+yN2VDk0aMYYtpK73F0Bm1u+FwLJW0CKIB2VT48pe/PBtmWhomf8MS0BvPoa1gdPlPRK+UYLJvoSyY2++4oy1xXH8UI4XU4WO9SSaIP7TQwLuCCYUVkqHKzc935RCPpZQbBTVEQiDyPm3Llvb0K5+WwsMQmuPzWW3me0yUu+OeQKBkpAdnZ4ZJw6ZMWZmzWLGynw235FDkH3iKa5c7q0pYypIwkq4hJgdSrl6xup2x7fR2RvTCpX3zpz8dlsJduSjB3EKo3RCWS0JBHQyarm3b79/Z7rzz7qTdurXr26qwcORpQ+T6DetyrkcZU7BEnpZ2WxjBQnOOWp5KEEI+h6VC+Y2Mj+UQmUUPJsr7SrjRNjZhZd5E1Mv+sI1c57yyrVm7su3e80C77rqr2403fDKUYD+Ow/4k5aM4KVqHGqoPdDLMRhnKTx1gD1aMvNRR8dhi/vJN2lmOcJTL4EOuGDv73PNyKI+1tzfqa3dYi4a7DkS9ObVAGZ1GsHbzGe3LX/7K9sSwZI4shFJrlqOPh/UWnQ8nBof1MhbW2dI231YsO9Iuu/iCdv7pm9wQEZZetI0BboVLR6HzFrwtbnFuW10JwuLfs2dX8k8v37EO2GJgDTuynsObyTsRRz715GdJNGfeEx0pNye+ezo6Kvl+wOfHg6Rf1E+B35wrwb+Yoej8JQVzHMAwRaD6jcmORx/hwIloJy7Gfctb3tJ+6qd+KleIaTyg4kgjBUYIDo1B7wuoF0qDiU+pOFSRcxgeheI8I2epwQ0knsblj+jpRcMOAZ8CP3qb0o+c4u/kQ2Q2+ikRYwZ6hRewD6ZWL8FNOTj5wps7EooKRHPOMGuix3rRhRfkKp8VoSisNrND/kgogpGRiVAGJq2X5LErJTgJkV6GLhj42TvS62BZWz65JuNNh4BnuVh8wHIaC9wMY+kln3XatrZ546bIf1VbGUpMXLvL792+o91y623t2htuaLNR1pWr17S9+2eizFbDhcUxPRt5juZx/wSp9O1Mr7ooelAmVoUZ7sqJ7/neC/dNOBezHVw4iBBtNMoZ6AW+VmAZDrS6zB0laHawjY0vDQtpVZZx//Seds0nP9LuudeJy50PKV8dAFZMrxMT75ZuE+q9E2PTK3xtRrVvBfAvXq53oCwc/vMN7QzvOTsN7730ZS/PDsxNt9ySw48ssHvD2psNOps3i8hJo5Xrtrav+MpXtsufcmXU+7Lgnyhs+M8fCgtrPBR4lG8sFMuyI3NtebDQ0y65sF14xpY2EnmmxImn/OECkn+jTJ7aDPyqTTi5vV8t/PFUBuYuLeF/4IHdkQZe6Wn1dFq75JKL2y/90i/licR4VJ0UHSo/e8he//rX59JonQCAvtqaTbfuQbEyDe+6SVYnSTpw0iY9gXQXt398+sUMRZMvKZghwNhFg2GmKcYFSbQT+B8PMLRvTjD98R//8VwxhuH5pdAb5CNvjgDDvIZfLJ/F4A6/c5SJd4yuAYir3ggEaYiTaRnayn55V4i1fyKXA4eQoiSGLZilLJiofgLKJL9xdFLreAqGv9388qq89eiVR95Jvwhm+MbR7cbLVy5fnkNUjllx8ZSbJS0Fnpg05+JYm95QxSVQpTU7O52T/Xk+V5SzO+nByVXFGwMPE/2zOTH/wO6decvkocBl4/oN7cwQCOcFnbZEnhYUWMFkDiSSbzOBg9Vln77jzlAyN7Y9uTcmyre0D+nsjfT2hZIaG5tsmzdtyeGvB3bvSkVjbxJrUJndgWMyWS836T/Sj8n3zVCdM8UmJsOqobpG1OnyoAwL0fBWKIcIS6FoeuZippZPpNXiNIJ9e7a3D37o73PlG4FmmM4Q4aGcn+qne1Mw6lXL1W3od/lE/YSCkT6AF8CD8EJjoO6Kf4AhMod2UjB464Uv/rK0Bmcjzt4o8z3Bszse2GmB3dENlwthRY6tWNNe+JKvbE9/2rNDua8IPENZjE7Gt+C3SD/URNA+/BZmQ8Ecbk9/0sXt4jO3tWWBR+idxAGOybcq9ziAH4AwOkE5ZBm4WRBjqNmGY7eFUja5SnByMq9cduyPVWk2aVb62Q6GaOKWyp//+delMutzfmhDwfXFKuhjT5kTSowWaINux6R4tMPa4a6NDKcvbfNuX8xwlOZRgV9SMAPAaJgeHTTIbGTR8DRMDY8AqYZZzDTMvCcCDKcH5vY7Jr+wGk7FK4Wip2SZJSZ2TIb1/Pw0EkJ4uHGA4R4UnFKABBoUTB0oWFhZppz5RYN/81vePFAwt3cFE4HgQ/j1tCJcCPdKN2kST/4sJL8lXEtk0SgyTcBKeexLxDcMYs7jCRdf2CaiERIOkWo23oUF1pBjU+wmpySlZa7iYO6dqBVk9jtY2kvZKN/hEGxr1kYvOIT2TFgE99/fL3O6++672uHA5Zwzz2pXXvGUdvF557c1odwmQxiPB50sNqA1c1QlFMpsCKt7d+xsN3769nbjLZ/OuYPJqZUoF8Jrbw6/OUxw3MGAkVcdneEEau8HQgnhEXcAWQxgBRd6dBqgV5R0SVgdc2ERRdoTk46DCSshN2YeibyWt9Ho5UewrC9nkS1fMdUml4+1qYkloVxuaR/7+Mfa9vtdTqbOnZnWhwwN/+TxO5GXIVCKXP0xHlkWfS5N3XVeNscEV3MsQP3hneJjT1ZYcHIORz75sstz/uPs4D/H6Nxw401tx64H8giYfpCpVWJhmU2tas9+wZelglm9ekNYf4fa2MTyFrZclChgyeFQeJHqoZm2MhTM054YFsyZZzSDR8GGgWJvO+q18MBzXPJqOFC/8Yhy+S3O3FxXvNrpjqhLTxa28xCtSiT8dSyEqcUYkmStzEW9/OiP/lj73d/9Xb7p3/PuYYo2lRfep9id4qDjd8YZp2fdO7xXm3Vml86G4VJxLX//Yoaqs8f1JH9niF4QoJGB+l3M4TdHMNe7b8JrbCWwKy2MarXXW9/61jwbyS56y4hNptdlaeIN588dDwoHTK+nw1FWlIZekN4QM966fc49DiYmHY3tSAyTv6Vc5CFfDMxV+pV/OhIr/Qff8i+b0NE4lke/+93vyt6pLxnW7rdweUjlaKRPh0TwHKYJcaF4XSiFX5SHNSSespnMjiYph4gTimGA35JIb3LKseKOszcB7oj++Uwv+jV5EKRd9/fdd2+7b/s97YFdO0IQOnIm6HrYcmVWlVMilLHPQxAOhnPMecwfnG23Rb04EsbqM7Q1J7F544a0XpYFglYsjQVNOCctW+UljUOWIcc7nbBvOiyhUBh27a+J+pWf4aipsDAoOivCzNmY77Hb3vlk89ErVxbDeZYdr1m3Oso6Fe9TOX/h0i31Yd7FnhiWBVpF4QPPSCtpFRSj3QnNYMEc1rSIN3AmyJYuGW0P2C8Uwj/0qt2J7bDP8W6fEjras+NXKu/4YHGDPJaG0nEAZfJfKFNC1rvvxT+9jsJRfIEaBejsNHUOd7yXAjz4hFVGgVodlVjGc93Gre2JT35qWx+KuOoexwUDJc38NhfnKuWwH9uWsAS2rFsjZPqDUliJR/xObzgqR4DOSIeoP/H8RVj0deqCoUirAdeuW9vOPOvstnXraXn2HJpnOeAgLU5S8TS8aeHC+9//wfbBD34gykQh+xRpBy7ZgQosc45IrhpCRLcPyLDs9u33t0/f+un2gfd/oH34I//YPvThD+Wtj9eHRZVXMtx3Xx5jpPNVIwDqHv0rny8GUM7HrYKhHEpgEvilPPiV0K1v3ut3NvIBVPjy81u6Do78f//f/7f9+Z//efvoRz+ax1IwwykJE4AsjkqvN9IT003awmBaCsXYrol5q75e9KIX5WF+jtm+8sorsydknNcKpeEeJvA8UT71TbmThzXWCGoOhuMXIY6Gvfqaq9s73/WOEBzO5eIZTpdyqTkcSqzTRdi0ZgZPOLEqQG8wLAqTzAPaR089XcQlpCmsyYmRtnb9yqiHgyH7+3JZjXYuJNruvdOhVB5oe/a5WW8uFMfStnLFRJswvxB46I1akab9Kw9LB6o29ZlvOTAz3e68667oEFggMBgyigArp1a0zRvWt6nocbJgJkNJjMV3ykVPfT7qeC664Lv37Gs333pHOkua791xf9YTa2fhUCisiOc8tfkQSFZ7WXTgErBD0SNfOBy95wV3kwdyQTdkZ2mpO0fP5H6XcUfs9PO0UtBE2tKvTgKRqX4s2TZUOBqCWT3Zf8MysRTYETV7p/eF1bQr5zQOo6vxpaAtmlEeUcNdqYflklUZdMhVZvFEbzxtIr+EpbwRFL38tqTY5kiClmUET50pq7/uu5fif6DNzTqjKnANPIVbtmy8rQ0FY6nyqlXrkg+WBv7zlFDUT5AswoWF7SXcWPDK5vXr2tYNXcHAUXricd7RMHk1vhnG9JvALx2DB+Njd+g09Kz6Lz8wrDj4SacPUXYLzokPH/jAB3O/VLbTXIRhiKy3ox4PbgPFJy/1Fh5prcZzXyhfSuXGG25sHw8ZQXZc9f73t38MxWO/mw2kQKcSD+A/ltAXA6DT41bBwHUY7y7U+rwABhr+Vo0M1De/vetlZIMLwGQYwJlfb37zm4+uxedfq5QoBUqAXzLlIG7ltxj4c9IhfIznmpinbEzYM7dzuWswHXwW43484K9MlX+ln40go8iz/OOnxsI3/2upMN/5rnfmfEjfj6HhaFQDZchFgyUgujDpTuTekPucTSlytIwUBnmqB/Xhm2Wvo239+tWBQtA/kcmQ2VPev39mMOF/KGiwPC2PjRvWtdUrV4SFMppLmnupCPBekEzbEFDkq3HrTc6HgjMEkgd6Bl2Wh1BnwaycmmwTlGLgZIhO3ntDmNx1z73tgx/+SLvqAx9uH/jIR9odd93T7t+5q82EEN2zZ29O3OsZE4S5ryZ7//2GyekDe9uB2X1BfwI5LNO1q9vu3ZZT7wkcCGD1uDQUDKXShXUemzNOifRVfqwibjIsJHfNkIO9PinqrpTZAr6bm5mfm2n79+2JdEIIh2XHOhmLdHMYEc2DNDlJHYopLcjIP68t5j/g/ayr5JVw8Sy+4VI9BhujuXmjFSsm2znnnh0W50xYiLdmr511I57zxWzMNcy4cu3Gdua5F+Z1BdI9HPm7G2jZiL0wyB2MEoJ4SSjG8chly4a1oWTW5EbL0hWlXFJ5BPRrDbTTjmvfQFnfH5ljGXpGMpmePNXFmjVrU/lbnWb+huzQpnK5d9AraRT5stiPAh5OPvbo72iI3iwe83SGF2+68abslFo9agWctMzhGLbz/sUA6PK4VjAapcryrPkTPRPfzAtQEJRCjplHIwHCEfQanbiYRBxP8T1NyJsr8VvaFUa6rA3jrcDvolk9F8Owv7S6IOkMK38umboYdYj5TpQmqLCe4nIVF/sTyASWH4ZRelLxI4Jcc00omHe/I4Tt3mhAkZZoqT+6pZXDIHrDGamXUSOVHAUjEePfBFrOKwRN4+1onMQtBCWlNTVBwayJ+BE5iq3nGqjmpHK/f+ZgmxwfC+Wyvm3btiWVjMluy3g1foGtPFNfiX+gZOhIfZhXuN/x+/HdbxYABWPeZ2MockrFJWNj8c3iBFbIjbfc3N571VXtXe+9qt1+9z1tj7kUvWU4h5LHN4a63FKZx+ZH3P1hKc2H1XLgwP7gJacE7As8DqUCIfimp/endaVu89qDEMxpQaiPkP7dIkzyplWQiicsNErHN6coW9jAKorP7chBc1rzOYc1GWFWr5gKC2S2bb/j7jBcIl91RDAnPdWvvKLOog6qQ0AZODvMPS8H8ZeqxAfxnTAs3sv6Cly6xdhSwRiW3BCKfsfO+9s92+/L8MuClq5BXhb0XBvKe/Xa9W3jljPbtjPOa1OTKzLvwCiUDKFsxVbnHUzTFcxC27pxXSiZsGAwgKpEc3SJYN4BuuHlUizo07/1748MtI+eh/RKyayNzsGVVz69Pe95z8+5ThaGvPFQBM9wsuYHynrhdAhhVN/EyfYd9PaEu2/2v9maYN+bEQqdymqn/9Qh6f14VTAqj4DJxjTAmyJRmXoO73jHO9IS+eM//uO8X4JF8va3vz1NVgqiVmKVclHpBKU0rbu3Nh6UMvA08f7N3/zNOTaNwYYZ5US0E883rvLz5MTn71nvBSdKDxROwlCccCaM+Ws4es19+MoYvXwirSijcuqRXXPtJ9u73/POtm96dwhRfiF7omF3wYOeGoeem4ajwUUj8jsbaW84LBgKhXBzB0j8CEeGKUc8o3dPAi6fGm/r1q+KOGEFEEER3vDC9PRs7k63+GDF8sm2KYTWFsolGv3K5StSwRDE0tKTNikbSOQ/1oqd5qjgiBhH8ScuhFOktzbqdk3U0ZIo/2TQZWUoDL3/pFoI0r2R7z337WjToSTt6h+fWhHCs6/+kY7lx6vXrk3L0iT37r07QolRMDZz7g0U5gM/hy0uz70rQaFOh1AMFIy5IvNN9v0E+lE3VhmZ86MoTba70jvKFUpl//49Ef9QdHq6spmbm25LFuZCCB/OHf3btm5sT7n0knbRueeEoplsO++9ty1E+qlUAndCXd1YiECmq197WYi9VC4Lh0Loq4vOY7mPKcLkcFrER98lSwjH+ahvlujhEIo7s34tUZ5BW5smI4mwnUKpbGtPuuyKdtElT2pbtp3TVq7aGHj3FXp4hnKRl/DJw/GBUpwIXigFA+/e0QjsEShy7Qd2+t3bgbo8FPjz723UPFMfdXi40NuSDle3gMs6kq8OkwUBrgMw//niF7+4Xf6Up+Qow7p1a9PSyTw7ol35BJ6lhBLiG76OD/lTp8SqPvhXWweG160IzbnCLwLIeny8KhjCk5AnYE1am5R/4xvf2N70pjfl02+T88xTSueOO4yz357KR4W7WpQlAwgWIE2rQIAlkHZV+yYchfTKV76yvepVr+oNNdwwvR6KdpgSVDjpym/Y33tvZF0hnQh8K5wxKwVDcTLx8yKuFD69EXUXASPdfqXukfaJaz7e/u6dfxsKJoRbzh9EWsZZBMugIXBCsBKEBKLGXb1xIs23HM7hF1YKwQngpQGzXORDcE1OdQvGXEp8SUUGd8uL9++bTkGzZtWKtnXzxraRglnFejExqvdKCLZ+22ZYCBQnwWWfx2QoGMMxVg8Z1qQYKDcNe/XK1SGMV0avv++NMSzh9IAlY0vapi2b2+r1G9q+mQPt1jvuyrkgty6G6AnlFDiHsKSwnHG2IurcEuibP/2pSGO0bT1tc1pZDr5Ey73OKYt0UliGYK4l4fbwmN/aFx0eS7/RolvUe7oLpWJSPu9/Odw3ZfLfvWdnWkj74zke9XLa5g1t64a1bXnwuRVxTwrhtC7o4xSC/XvDaoo003KJ3+YsogZSGKsXQ2OG9tQVgZ8dCDwbLuc/0toJ4iabqWvHzVA0XZAfCBqg9dKRyVzGPX84BOX4VDvz7PPbE58UAvjM89ryVRsiLWvCQoCGcjGyVBP9XPIe3qFAg1W2bFwbSiYsmOSjahPC6ZAQxH315n33bW+f/vStUa+z2e7gKWxXDInwwwR1gDf7kJtsyzIqxSZtHYFNmzaHIrg0Fc2XveQl7YUvfMHR+VGKKOVDxNN2e11HXDTFQ1meXq4+99l/UzTydue+s9FK4fxTB/R5XCsYgooSMSH/B3/wBzneackqYWtorDNOr0zv4lBILBXXf7JEgHJX2YXD1JQXq0Av1tip3g3lYj08ZlkMJ6NdMZoww+9dgPa8K83h7yeCCkOhWP9vtZuNnMqe8zzr1+XEMcbXazuWVlcw1153dXvvP7wnrwIeGQ+hNLY0h5D6JWMh2KOXr8FBKdp99npZAPwPW9kVyoJ1IlnKxx0hcvA7XcQzl2B/x+TysmD6HJhymi+gYBz3oqGvDgWzOYTp+ugxsjgIID1EYkr6+6f7/hMT0CHzolyjget4xJ/PQywN1xFQETyE/JG2Ymp5brAk3I5EOladTYaVNBHW1Mx8COWIC2MbLg0fzQQdU+RFmXNYMfIfmxzPFXD33Gtnf1iJYcE88MD97a67bs8x+33796YwlGkNRSpbp0nvKDg+hR8hxAKzSEBAYShcdDwYinNPWEE7dtyfE/mHwgoaCYG/bs3ydnoowzUrl7cjEaaFGw/8zj37rLT2rBCjVPLO/iizXnPPv/OTfUT5LfLuJzB03PL7AE9F7s9APl+6FT+5fHWbC8UYGiXosCIeznCbaivXbGhnnnVB23bmuW180snSLJvgk1RWlL/OSghWacXv5IOoA9ZYWjCbKJi1wTpdwSRtIk52SsLDYo2PfvRj7Q//8A9z1EHnEL6UJqc9HuPlzx40l95m1Ev3k468u4XS20m1FXhp/zolW6IObGp+znOekwtznvGMZ+QufxaORT+1LFla6SIDaVRno9KzaOIVr3hF7mX7koJ5BEDYI2RBEbyIfDxYHOfhgHgUye/8zu/kHRJ5v0ikBzBTpVuNvQCTquBv/dZvzSXHoHAURxoUj70oVnvpyXzlV35lPq15L6VQcLLyFVTaBYUf/8Kvfg+7EwG6gg984AO5Wez3f//386BADdKY77mhEF35W2l4RC7xFswfaNx59+3t5ttubFOrJtqGaPRrBkeVmFBeucrmwVX52/vqNStyl7le+4qVk21FhDEJ7F2vfnQ8Gn5YHMtDgK8MReFJEY2NLm3LV0xEWiuiETpFuc+hEHYEM+F4OHrKJpbtvXBNcS7ltiorUIWzuiC8U8GElWI4IzrKQS9HzKyIXv90TvJbxWbIx3AgWbkyrJd1a1bnUmOCfXkIacppbNwqqb5iKxJrn779zrZrz952KOgZ4iWEMf450kYmKLDokYZQZFWEwRS+NjJ2y858Cwuk+BvU5HofeiFfXSPQN+E5MTqPvE9hps77hsGZmf1pBU1P7008KQXfRpdGuedN7O9us9P7QpkcaRNW1OXKtpE8BscS9k1btqb1csDFa5EeZZxWSdDA6cfJV/Edb6l/R7/U/TuWeXvP4bsIo+mkxWKj5mjUbSiZZWPL22mnn9s2bD4jeGRzO+2M89qZ51zQ1q3bkuEORz1YMy39o9ZQWgZ6JZ2flwXuS4OuE9HZ2LZlQ9u8bnUE6wqmW7md13USKJdf/7Vfyw6T+5CMTFiVpeNUHUYdqFzQEbQu+VEWwolBHvimy42kR7yrv3oH2nb/zWPQqRr4cYZlDa8b6qJwyAfWjS0F9qw5qRt+2TkdjCz0jZ/b2nOf+9zs1FogJK0TgbwLL1BtXVntpXNgrtEV9xvpDOQBroFjQdGil6FD8SgY9i840fdh/0cCWbeB0CnZaFmEUMDhilqMPOcb/2FCPlwQ13CXS4quuuqqTE/eejqLFY1v/Eo5qGw9JBVfOBUuw/guhpN9eywBvobvfuVXfiUVrLmnouP6Devbj/zoj7Yf+eHXpPUVWEfZCUJ1EWVdstCu+tDftz95+5va3gMPRIs72A4uWIKKpn18uUOnWY+rF2lpZa8zQyiELEskaRdf6I/x8akQjiM5B2GZb7SzoLnbMqfjt967dMbazPRgaCd6v3bEG7JxEOa207a1lTZZhrCGiyNSnMi7/f772s5dD2TDPUx4HRkLq2hTu/e+He2GG2+JcPKaiEY90Q7OzrWzzjyjnbXttLb3gZ3tSAjaC847p60NBXna1o15BIpBm+nZQ+0d7/mH9g8f/Me2Y9fedjCK7U6ZJcE/BHFdB2wuZWQpmvTrA9CZcqiGjN8IVxsclYnoDNQDxyVtfHR5CJiVWQ86NpTsjDmauZkUDvbRoCf6puCXR+Q1ETSbDCW9JiyxrRs2tbO3nd62RYfBpWrLw2883NJQVuZE9gUu1914U3vvVe9rt91+WyhGK7yWtT379qXCdLR+V6AdgsOzHeRf4D85MZUK6shAKViRt3Rkoq3ftDXyWdUuedJT2tr1m4M+S0JRr8kL2pxyIL0jhwnuEL7BO3grEs8lz9HqQu/0tjZKwYTltmrpofb0J1/ULjn39DamGUV5axKdsnDki5OUfyM6TE64RlsOfdDO8JT5C6s4CXZCnvXA4p4JS7hbN1nEUwhRphOkmXJDGbLD0a8zZ9kahtfxve+ee/O3urdS9PLLL88tCl1BWihzfChZlDwR755+22fjKgPns+lE6gS77+bVr351bvjsfGjTct8PVu1Y/JLJlZYnNwzD4YffF4f7bKFwP2UWzHBc7zJQMAUqDVthTkUBAKvFxL0jNUBVnDwRu/Co/PjpafxoCODFY6FFkJPh87ngeioBHobGzDW5pEx5gfIZz9eTeuELXhgNMARR+EXp+neyOXrld9x9a7v2U59oc4emw3OhHToyF9+iniiE0aBZKKGQlTlEZBGA/St6c87MGgnpYI5lafiPTdj9PpbhchluuKnc+OYWzPg94dj4JW16xnLvYOzAwT0ihMHExGTbGj3wVaspwcgjhA0LZCSslFyZFsprJspiPsQqLedhAYcsjoQyGVlmP0YPR1CldRNksN/DsMbasGAM0y0NQT0a1gjLYWoqepeh4Bx3Ig9DSLv37MmDHNdvWNumVk6EEJ1IvNuy0JjhzCOxxlhlhgXzuJ0sP96KMgV5sUVf3KBDE7/D+Y7sLDQrtGZm9rZdu3eExeLOnwMhmOYD74Pp0Nc9MJ4N7aNO7IBPZRG/LSef3r8vrZLcCxP5GvpCUCcfn7a17yx3kOjuED4H9u8PWqIThdctF5ajo2AIuImJ8VRwqUBDmM8fPByKY2NYLWva7PxCu+TSp7Zzz39Cu+gJl7Wtp4dy3rClrVy7PizUdVGfrkQOQRUOAr17gb9Meh/uf9qcyqLMdGyibBMRfNvmDW1jWMc4sislws/CiiUhoPuVydddf33QOOgcaZRQtOLQCdp33nFHHg1jmT0hrsNxZnQm8Hi33qR8ikExjwPRChI3PEugs5o3btqYoxwE/hVPuSIXDrB0yBqrx1gzZOLJFAyQrvKX7LT0+Td/8zdz6NA1H8PO6jcWlHDDcrbSqN9Fm5JznWb9vfwrTMX1rO+PBMQ9ZQoG4SDIFWLei0nKFQwX/pGA/PSwP/ShD+WGpqq4sl7kXRVk6IVicTjkD/zAD7Rv+ZZvOarxSzgXnieDR4rrowF6R3/913+dixeKlsrkzvwnXHJJ+/KXvDQZ2mZFaGc5o7EfXnIoerq3tI9f849t/4HdoWQORG+eAN8fgnxfs8TWhG90KkMAhRUT7ybY7QGZCUvE9xIqFgAcWpjNoafxUDbyORS9VafoUkDxK3rH+3Ifh4lv8yruZnG+l/vu9Z7Vgb0we0M4Wo4sEcNd6pNysT+BonFwJKEancY2ukzP1bDTZPa4c/NcKBsTtgT61tOcIRZKaKyfrGwRA2VjA2UuEzbhH4LBkluT9Lv3PtBWGxJcPdWWr7JRkiI9EgppNAT4eDvj9K1tTVhAFJV5JeW1nJfSMaSlXfchIgqHYFQMPUVj/KyeUJazVqDtiXJYDbcQysIwW9A6lHtQOeNaeRd6L8q7v83FNzSjgFxHwJJL/j5sAt43YSNw0MPQ27atW/NwT8L47hA8eILFRQFHwomf4UE7zM1DTujxxx9lvyIUx2nbzmmbt2xrm047vT3vhS9pp599Xtu67cy2LKyVZe6zyUNJg78iv2PCJ9AOXjBnlogkDeItfh+JJ37LKf9QyuPxbtFCKRh5J80CzH2o77e97W3Jz3iVkkkLOp54xFAff5bCHWEl2ABtuEhHxQS8FYeZ+amGEyWZ5VNqlhg8u9xBF7LE9duGr9QZBUQZDsvDk0HJJOGkTZn++3//73Oo0DfpSBMtzAWx6Fg0vU56HM+qJ+H5Vdz6BvgVTuqAqzjA+yMFcU/pHAxk+8TnMeIU1Dt/rgr6SAEhEFm6zFKNBtEQS8VSKCbkjHu6J+V7vud72nd/93enWSmeHlxVOjjWaE7svlBAmdG5Gpl35VAGzxe98IXt+c9/QTCd40YwU4/DCiEQ7r7vjnb9jdfEW/RiTUeE5WKZbG4UDIG8YoX5luURrx8+SRDkpr4QzuYybA40ds8q0MOeP+iUX3Vvee5sCM2DISCCWRf00p2DNRP5Yuglbbk9E9HFPzA9E9+lbzVWKJg9e9MvD9A8OB/KJQThjKXB0zkkpTErG8UyEgpmaVgwziK7597tEWY2LR+4bgrrzR4OTT+aTOJFyZmPIeyywYeCSSEQjZJgmg381m9cGz3QcJvXtg2bVqc746xN7axztrV1a1e0tetXt1WrVkRPf3mkvyYU5Zrmrv5NITS3bDH0tjrnq+ro/VWhqFatdLcKRRj8E9bQslHDbBR9vMdzNPxZepQz5eKEgBySC0vR8mKLAg6HYF4IJabj4JZICjE3fkYJUxjE074SVzdv2bg5lOEZUabRHEaxCms0eB0lcmKfch0bb45SYck4wVodjIRVsiWUyRnnnNeefNlT8giY2flDOWxoY6VJe1YJnChUNKU8uhINnqMcwwLOu5BDwebmxECMPFDvqWDiuW3zxrZp3SorxdN/bs4SZMKN4F3Srrrq/cnTyuTUZmXMTY7yD/5NARn1pt1a4s6Kd5KDHnztTTvlAJkTQAlpvJSWt3LouISDN37lhgW43w8lS6odA2W2h8Y8K4Xim7ZceRt2M2xoKC7pM4gnD/kKqwP+rne9Ky9ys/3CMFvfGNwXTgyH5wCZUng/Usg0T5WCIbAJbkDYK0Cu/BkIcYUBCCMfrt4fCSi8NJmezFLWydOf/vQ818sEPmfVl3O9VIJx0Br/VBFFvGwEAxwKry90QLfcBxK4s2Tc2qhcdqA/73nPa9/1Xd8VNDkv/NA+yqNIypWCYaHd5vbET30yhMj+vDI5N/iF8KmwrJ6QEtEbPjaZ7QPhlL3YEHAUQSASwiksnejtEzydrpRR9LT10OfVvyt/MXO/O98x/fZLrFm9Noen5GGZMf7Ru56fOxStSnZdYbpQzByCHrve+JIl5oLGogdOAQavhRBlwXQ40rZGPTs00pCT3j7BzaKKFp/yb3KU9RKNHE/izVCqO3ftSEuMwj2yJPBYmA7hvj/sirnwd3cNwdZCEYRSCsXhbpqpKbvsx1OpUCgrVln4MBHvK9r6DavTb+OmUETr41v4UzgU2KZQYGvWLg9+3NBOO21jO/2MrWE9bAoLankqeackT4aCzwn5JX21m2HBuYN2idvg2dsXZ1PfzL7ANRTsCvMRgaSe7LnnnBsKcmNQ40juwp8JC3TNurURd0nbtu30EMhPyhVSVjZt2bK1nX/BJe2scy+Msqxvm8ISynPE8E60Z7v2I/tQHFEtYVHlhtmgh44D68ohav24/HDBX32YTFg8QflEtlF/pWA2rl09UDAR1feoBxaM9oh/s86Dt/YGbxBy2iM/9UUYKnMq1vitPHjHUJSVXo8KQPR4ECwX0qL/DWQGemsDhHofMu3flFEZStaUEjgeiKv9CF/v2gbFYGiQDEMrNDAyQ76ZU+YvTsm1wsmQ4ute97ocXjOd8M53vjP3+Vl9azO5RRQUNZrDD25kNjecziMBcU+ZglE4Y4Umo/7yL/+y/c3f/E2uaqJ9HY9ShOnCqueVjPMI8ywtLl3LiCkYpiKrxX0pFE+uSopGIl+uKs5zGA9E9fxcyv9YA1xNfCq7xQqU6wte8IL2jd/4jUkDQwcgmTuKGvweZTZccrjdften29XXfazNzO1L5WKDIKleBxma08jrg7PxaAyeejZdIRs353KyP+IePNRv5tToTdqjcS7TjN6sniclwpKinKRt+e6a1Wvy3bCYdHw/FHmyaExM68FaOq3nruFqvt7zvKglbpG0lDzChYMjZ1Xg6hBgk1MTEUZ48zbR2EN5mtBeEopoIpScoba8JmB0LNxIu+ueu0JRTbfZsMQombl4Hjw8EwJT+br1ZTMpJSq9PPU5BGywVNAj/EJpW9RgGFEYQ3IUFoWxdCQUbwjiJUsX0lqhlAyb5bDipMvKoiwrJtNZqbd+47o8xfiMc9z9sy2sqK3tzLNOa2efe0Y8z8gjbFgm+/buSxqHJA+lPJuKpOawVqxa3bZs3dJWrVkbHYiga9T7ho2b2sro5a5ZS+kFnVavbuede0674MIL2gUXPSHjTE4Fz0R4Z5+xXueinLlhNMrKUjl8JDobef5ZKHXDe/bxBI0Pc+aQUql7snR0BqKtBTWWxm9DZNvC0tu0bnVkEe0sqpTFjKd6m1yWys8eFMuAKf/seIQg5bRMyoUFExHyN+ek6Jd8+Uui/V8e/PsotN8TJJk8SckoizBYNCCtmMARP5dCKVgs/E8GaFICn7zSoSRPAT/1R97ZPmG0hpzjPww6+L/3e7/X3vCGN2RHtPBBV9eGsGyk+d73vjfltUVTFA1rqIb3PhtcTwRZ1tCEp2QVmd6GpbLGCmlGJroeiVODX/Oa17Rv//Zv7yt4NIqAU5FnVYKKKyjTjvMdyKPeh3sFVeEFnwsujyUos3IU/hY7KBOgcPX2CZqkSxSb0M7J+2j0h9t8e9+H39Xe+vY3tL0HtocAmstjUKQTKiCFlN4R4V9peve9lHr3I2j7xLThET2ecdZBiBRCLzefRZxdux5oB/b3WxlHHCUf3ymydWs3RvqGucKCCeHIepnefyDnEMZC8K8Ogec8r9wvEuUh8OSZSmXZ6rZq5bpUEBSh5cqE0MpVK3NexJDTkRCGs3M2OoYFEj1rJZloNiw6f2oqBPmWsDQ2h7Uw1W669ab24Y9+oB1aErwT1tihNhvvB0PRBQ8FS0yMsBaz2Fl+eABl7GeP9TPtNGgE91sdKAdr7+AcywhNBnwZocbCQjBRjuPMpTh1WVyKez7qa2l8l75TBSjhJeogrL8Na9enIbrr/gfant1720TQfPWKVW1ybKptWb+1bdywpW3euq0tDwUeBG77Q2Dcfs/d7c577mm79+9uS8OiXBeWlPk0ClB7GR2bjPL1wzWXBn337j0QCjF4a8RS5OhyBM72VfU223mgn9DMalXe8A/hri+CXvkSHQ1lnRqdbCOR9viSkfb8K5/VnvqkJ+f9PKGJkj8G7BRp93cr7cy93X//9uhlvy973Bay6GU74wvgRTiITxm7itwmRkODJ4LEOXCVT8UH3gsKl2Ne3YM1BjLsg8JUwN4F8uw1yoVf8EDvoMWveC//xYrgQRAJlfLKPTX84j8nfZOrrBh0cMrAU5/6tPaMK69MZQMhZeLMW4lHBv/Av/gX7f/7q/8v25dvVfYqt3ftvLctiybOzE7qD/3QD2XH9WQwTLvFUHmcMguG5nO0PW2pYAQKBjR8gyD2kvRdud1aAJ6fS57iLq4sTD2svBbnVd+EK79yjycYpiOlogejgWlAOdfie2fP9Ouv0chCfN5x123t2us/kUNkCyFInT2V4ULBaBCYo8B7Cffk+oDKV68zV2WF4lhyJOLKJKwEu+m7pRKKIZwLxpwQXLubdVxlcfhQvyhtKnfaj0UP3/ljYxAJ/DWzaJRZXb3B5YZBgiuEld38vdfWe+1jEyb+KYRgbHFC6SnrfPSuow8cfr3uc/XTslBcS0KAjy1vy1eta1tPP6Pddd+9bSassbGp0XbQcF/8sXJccNaOuE9mMnhmNCyT3oBlghpwikBJI5eMJYWQJ5zd9BRfTQDX6i91492AUs5lBG6UmbLOzTuHLOgVgpwzv0F+KxMjcpmFBqEkwu5MtxAydS7qcC4sUct7zWMpIhFDcZx22hnt9DOsYFqe+4kecAzMwkybnt0T+R1sO3aH4tl7bwigXdFRuacdmt8dSn5n27/v3nYwnnP7t7fZ/fe1/bvvjOc9bS46JQf23tNm4v0ANx3v0/E9/Pbuvqvt23NnO7Av/Pfe2WbifT+/nXe3/Xt2tLPO2NbOOeucpIWNoovb3uCRgo41et5556dl7ogmHVX1bWiQwrVgY+vWre3lIVe+6Zu+KXrdfZL7eNB5mMDr71k5/o8HR/H033DpnVQdBm2hW0U4u+PZ0wrSDeRIh8H3+PM+8Mrw5dXT7u6kkOEzQvJFunjXTs46+6x22eWXtadf+fSkC+vTad/wpL7wk5LgRcrJiNLf/t3f5p4iHZ3Kv9PgwTiR11xteXj+85+fe3Z8OxGc7Bvw/ZQpGIj9xV/8Re6mlw6B5AlZJhlTzpAOJgEKMywkvwSnEEJokVbBOv03QOfwtwT5jjs/3a4JBTM3tz9XlfXbI8O2WNbrRt1pYNUw1ZNeTtVXMaMORF6xHEI3eDoVCEWSQ1/RE/dMRRPoUAIagvO5xKV49u7Zl5st+3XNrKH4FriwWlJRRhvWS40mkU8rwODoSgCWDJxCbKQii8JlY1RG97NQUIa8WGc18WyOwgnOjpNftXp9WDCb2pZtp7cNwZdWzN306ZviubRNGy6b7/t2CGyKxSo1MB8dKcuF0YFCNy+SAin8iuf7fFbfAEhYetfgTbjjf+WnZODfFRTl02nt3doJy6HNf/UNqkE/Jy1E2GmLHlJpUVaRTuSViit+I/TM9IH2wJ7defz+VFg26zZsbGOTU/Fcn8vXHWC5J3C+f8f9uTJtz96wfqURNLfxM4f/QtHu2/tA/A4LMJSRkwzwysGD+6P87obZE1bnnvjmDLjA8VANk7pcLYT/yJFwUe8Rd9bp0/v3Rn0vtCdcdFG74OwLoojRUVjMnwNAgg6dvg6kPDsEq3uTCFVHPFmoQ7G8+lu/tb385S9vp5++LWmv03giQFvf8SPe4gzNqq/iafXlvX/vdZjtaOAXjwjXEfT7pPAQnx8JwIOisRfKHiBWZdZ9tCn8pIzKkQsOgte974jOvWkLC2YMqQojnZpjQRPlLvDdN3O5ht46DY4P4p8MMv1TpWAUxngeBVMruqrAiPK93/u9aXL5LZ9C/HPJ80uwGNCyC6lsGMNcHq9ZJ9Gfv90k//WfDAFzIKSZYTONs4Zp+uqkHP6KuuK69dIVj2/SqfrzjsHjEXXZGyRG1hDFtXSY4klB61v2rqL+KQvho4du0+aspbhztZt9IS0Zgto4vjh9/iOEaOTjjnvDYxpHfArhqtFTMJl99NbdRzIfPfbdqWC6cLB7fTyHGuyjOeecC9s5513QVqxe00YnxnLu45bbbmk2QXaLw2kEhuiosK4sWOkUp3z78KHhMkO0XRhRgr7haXQBfue3cJRLKkU0C1qij2E1PU2OohLO8TGaRQ97bGVmHzIMC1C5I418D6VjUcZkWLGjUYe5mdOcWhBjxapVbeXq1aGEuiJevmp1O++C8zO9Ay5Z2zfdVocFl52EoKN9U+6xIdjt/+n7fdB+Puqs79GhwC2a6HgdyOXX8O1zMX0+KhdWhEVlTmY0aKPOlh5e0i48/6J2fjgWKF54EH8OQLmQzmIRdOxnhbWwUPpwey7oyU2L/b58S97twUK3E8kS3lxXQuqip+0dUDRoSCjL3++IcfR34cSvp9XjnxQe4vMjgVIEZdXAK8sReOpsZAdvoPjwFitvw/r1uevfxmxn4xXexX8cwGu+oSPFYoEUeX2ycp7sG0jcTpWCEddxDuZhDIlBmDMPY0wPwrSuggl7Mob4Epwc0O34zkchtIZFDTheU7gbIrv7tnbdp67OoRJXJguv0eV9/H711pRpVgPzru7KsimGzHyid0+AcU5etoFxftZOdb0px+WHYA0hBwnDRobG/C2fNOyk90xBdUFNuOXxJZF0Jh8Y5xEtIbxykUKkMTG2Inr+YcmkoNX7HOAbPGWDo42NB+YOtH37dkfP2rxIpEIghjC35HZZKKhtZ57dNm05LVJf0iYNM0T57Ye5487bE1fKyO2ULg2zSq2GDuGJVhx80AAtuh/FE9YOq0SeEY+wooA1/ix/vPttCbnLyMqy4/w2ucqac35aXxgj7T5xzKENnOQHn/wdimdFxLMviYB3gksYCW00LLkReYQynogyWpbtxIEVK1a3G266JeKtDCUz06Ymlrc1a2yiHAua7QulNx1KycKG6CgGv7SwStpS+32irGFJefZ3VsayqMeJUHAWZsS3oH3YqUEzpzOHNROdltGgy2jwwRMufEK74LwL20iL+jUcG3+LAT2ljVbqFU37qdrovCzL2q1CirsfO0TJ8zsxHFP40rAEvjoFbjJ1TM3u3XuO0jM7WxEOjTuPd4ENxOH/kPBZBHm40C2T4KNB2nBLpRJPpTtKz/ihk0TxbNq4KTd7mlup45jwa9EjFVF0fKpd4znDY7Z31FFaJ4KizYnA91OmYIDVYploNASFMEZqjfaP/diPZQHBMcHUC5cE+xKcYsA8x1EwIU6PLBnMwdjJn0txKQIurBNzJVE35brg7EM5ZVJXQ/NOeJo8JIAJzt7bj3zi2c+8yqABhYn/o4EO0tfzTWsnAvrLIbyI11dsDfw8Q6h770KF4F0ejSfwIeQjSNpXkbQ5CqcJzB+aC+tlT1jSUb7BCihpz0c5Z+YOtulQfu7fX7vO7aGWBEvLhsWxdsvNN4eQ3ZuLD/bunW67dllu7xpnQr6vgus9SXMcbii0kqov0UbhtFiyZxztIPBNxAK6gihFVCv1+iR5VzADZR6/DX0oM4VOiVI84hMC4kXQrCth4EDI5BLiUAQ2gBpjm7UCLMKbd9kXbiEsiN2798IkOoEfaTfe8OlGH23ZdEZbPrUqBDVF6J77mcDpUC7DPhjW39y8oTHDZPzVMSs28Ij8FyIP9K06Woj8rDozj2SIDxUOBb1Dz7Sp8eXtyU+6vF1w5oVBkaADDZghHgxogJ+qM1HKhr8FHcqP1mWJ6JAMy5SHAsHQWxrOPvuP//E/5r38zjO0dJei2bx5U84H2l/VrbljbaJn05XfSfP87NB5WADncgU5RIZPgtcolU6bPi8JB/Vi0+dllz05hxPdoGv4y9E1Vtpq1zWHa8PqS17ykvZt3/Zt+V5t/kRw0vIHJL2isZyyVWTSYeozyUzum9R3c2MecR2g8MN5YRrE+BKcKiCGSXUMOOgh+hkQHf14DQZsc+19H3hne9Pb/rDt3ndPO7iEQHB1cjTmvMir9wTVjbrqDZ4w6wkRrvwNe+ZQSwhiR40EHyeT8qc0FuZDsIQwiIjZ1uAiXvKYRhLpHAnXLZvOGzCUDYEtbArrxEEyvktjpK1atSnihfUTSoYFEuj5lNaLFVm79z3QHti9PYdv9MDt6LeB1AGWc7OR9pKptnnj2e1pVzwnGtrT2pRd1yvGo2yz7S//4u0heD4cca1om2t79u4MS6Af3KkhdjyMU5s/KQGp0ffGHegmoNPE4KQCdOq/+0GI1VbKmi8B2YVDFCSUYR4hE7+PKfd+CvXBUAToIj3g0E+AZuZOrAxbWAgFM7PQRpYujzow9Lm8bdl6TgiNJ0aP9vRQLre2qz95TVhLK7NHe889d7ZP3/qp3Fi6fuPytmff3UHM2VBO20NoWYXXFYtz5JYuMYcUAjryoEddc51Lh0PYdx7pq8os2zZftSzCLzsSFtbkuvb1X/fq9uUv/ur4vbyNLFkeYYt+x4MB40bFDlgvaND5Awt1PunK1juaeD8eFO96CoP2V199ba54/ZO3vjU7V+oCvQ3D6cFb9frUp14RMmxN0NT+L/XV05HGQ8pKnZpTDMUv8D9KngGwzM0D+iZMtv0IZJsASEs5nsqIDuhlbtyCLCcFsFxZz/0enHWZF77LvE4AJ6NBp3XwyKmyYCACeceTWH3AYjGpryFUAxKmhFVniCDD55DnowXw4wqGcaxvnLKpJE+/hyujwnx+ygf3z7RgAqH4shAWzK3tE9d8rB2Y3dMOHXHcS19l1edguqCrBqcMgPKo8lXZzEnk8SzjIeyjjtWzXE04W15LKOm1Jx0gEP/0stBL+nbwWQ5rGbVcgh3TIsn9OGGO5FJZLv76kl7Wj9OQLYcWV8+dwA9BE4KZAJqesVJqR9uzZ3fu0VFe9AgR0pzj5ciTycnVgXcLJXKobdy4Nfh0awp9+LvH5dZbb4vflFy3WKZC+Ti9oMqtt0jgi2N4pc8h6c13PkC3suiAY+jNtfjtu9+eaIB+0mHN9Lj8+zve6XWhHoIug56332gIBzgLa97KiQUHDxsmQ2vtzfljUReBi8Mk9+zZH6ToVuDp285ua1avb5MTK0OQOB9uMuiwpZ1x5hl5X82cEwVC9zstuw9d6uUGHcamgvKWZofwifzpQ3WjDjkAL2BRxdTEijY+OtXGo0Nw8QWXtgvOvSTiOKamD5nCHSxuJ8roe3edbp0ePTxelI9nf0/vEwJaVx7e7f1w9hnhKkV7bPCwDvK111yT9+vfeeddmTaYnLRKEa07rsP49nqj7LoyzG8Pgc8jgV7OnnBQJPP1l/kO8hOm/L3ndoFw2okglQZHBtuYa8OteRdy22/08Y07GRQuJ4LM41TOwZTSGIYSTPwrTIVbHPYLAXrDfTA9ioFSKAZQKo4Sf/e7351mtQ1KNi7pvRu3FF46ng9VSY8OaDJB82Euj9fOdgu50fLjn/zHNjO3ty0bizoZHUzCE+rRaIfrxrPqCw2SecMB9Wp83xxM/MieIKUzO+M6ZPtr+h4OikYvNxVCpMFZlTU2OpFWyDzhOlA2dvqbt/GuDH2OhVMP0ZAomUwn3gbj5IFchF+S+RGOhmlyI2SUa2Kqz1E44NKR+SFr26F5m80Otb17ZtqB6bmceF67dl2k39rG9RtymOTee21MCwykvexwpiHPvoIMLp0PWHyG+LqAQYZe377XZlV805c8O4m539tuvoPyLb9SSD1eP3rfN+mahDevVWHwVvEi5UR5wStIw5aKuOqHsFOH4RmIURDmG+688+5Q/odzz5ITqJctZZEsaStWrMqRBhaQzaAO5nRzp+EulqiVS6EyAufRiG98P6yqyMaqwVTx6k/dBA/R+X6NRB0vORJCOU/NnmhPuOjSdv65F0foiJtDZCWQ0Q2unwnKgvc81btwx3gzH58VCIue8kRvO9ydfSYJ1MpNqxEoF1DEb4eGauMfeP/726duuCEXLrFAV69elfWG7nBSHx0fz74YJNv8w8DtkYA8y8krazzxGPrmPX08B2G9LwpX7bvktN/DMvtE7qFAmFM6B/NPATRoxMU8mEqvhZ/fBIq7GFzF/J//83/Op54QJfPxj388vzsXSUOtSij32AJ2O76Cib5au/Pu29onr/14WDB7Q2YQZANFGMICrsrstzJn1PDTcMwB1O9jDT56/TkP0S0TczLOI2MV6YnXajT55276iGsS3P6ZUCXxO/xCKEc7jTAUVlhRwhC+4c9RTl1BafwRULHCGR8330GoOpBzbyiX6QP7oxhEXlemhs3K0mEtzM3MtxU2W44tb4cPLWl33bW9PeXyK/KgyNHAy/zC8hUr24033Jg9f5O9G7esD2tnOuLPRby+1DiHpKK8FrbIy4odOCkr2mWPN4SxExWU0RCFORmKJRcCxO9cfRcFz1VA8U7woY/5lFz2HBaBfGbnbOJ0egALLIQzOipT5DXH+omwFFLGo4yinKxD9QMopgNhNVHqDhidm51vMwfc+d/x271rT+LsYNDbbrulnX326e3u4BHzK7kyLMqnDKy6ibHJTL9XafBBPLPMOSdmGXCvny7MIx4FsxDlXxIWzEVPaued84T4RsF0/lTeLHOkUfxWypPl5Juyo/kjBWn0Nt1/S1c7duutU7or3wwTT9YMP85xRjfeeGOekXbddddHG5/NTqSz6Iq+oFu13uSFAOn9mMGgaA8CKAyjcSKU0OfRAOl+ScEMQfU+ig4YyG/nqtlB617/f/fv/l37sz/7s3bTTTflPJPeqD1AVs45CdYFROadpFFMOsyIjw1gt96Aj0K8ErLRH25333tH7oPJOYqlh7oQ8T0nV7upn8IrGp8nQBvvLB0K6KiyiYZlX0ZE6sNfkRZB58pmR8ZLCw31DHPFS5CiN8awOEwAR++Y0BSXSsi0pSFfZEu8U60E9P9NevOXZlcc821/KBb34zsoMxv40hQVXUjFb3ixrJwgMLZseZuaWNVO23pWmxxb0RYOHm7r120Iq+We7BwQ0jeEglk+taKddpp7UZyntivpIWPCHVBwerAsNNaCuIYYCMNAORTpaAh0CuZY71D5UpBFPLyRCjac8lIE4k1ZEQbfoE98jDJ0pdJ5k4UQqjPIk7ROgQ4niwHGc4WZ43D4uTIa5Si/VAQR1goq/KozgY4sI8OCFOfZZ2/L89LuuPOWdt/2uyImxWUC2YVgrk2YzjkJeKIR684xNH47swwY2hIe3bN3H5YKC2bp0vH2hAvDgjnv4t6xwJ8Rv8Cr392r803RTF7m0I5ZCw8P0Jnigxc6Sxf/asOOvOcn3TpQ0zFF6M36puwoHO385gj/j6FoXA9imHPNmrWhbNYczSPrPIdqHz6Onyvg9sUAi2FMToTVo4WvdL+kYIZgMR0MPbBQ3PPv5sg///M/jx6enl1nRI7A1fAxrSNbrMJgxWA4UI3ksQV5R77DLOU1pIxJ79tCgHz0Ex9p+6d3hcKZb07rhWP1RnuD7BOf/JUvk4j3sugI9fwdQtZ5VxpviNqMmzdahsAyb2EynGVAyLMsrFCiQExWU0yOomfxTB/Yl/6GIWweZFWNjBOslEO/FC0n0kPgrVrpCmZp9VOlxZ+dd3fMbOJDGOWEfzwNi7GYVMeq5ava/MyhNjayPMoa5ViwxHZ123b6GXn+kg7Cvffdm0NSJr8dzulsrU9c8+GIz5rp52MZTiGclQ09CHYnUNuLgtDK1oVw35DpSUGXUkY/NFVW8ZNm8Vs6ncZdcalDdGT1cOZJ+pAhy6YrqLy2gFUUFtHosvG0DEfDmkCf3LyqDiMpw25uBd27bzondCkpu8CV0y2kW7ZuDEVPUQU/HFYfu3Mf0dJU1PBbmlaizgBrCI3hrz4olUA78zxok6ylyjk5E8JcjyJwdn/PxRdf2i44b7APJlxXzpRGt7LcxW/+y8hBt/RYlH1PlPoTVnt6uCD97HRE3aAZheXwW3tqlOGee+5JBUqRUCyeeH8yOgw5/Km9h1OH7qVxdE3dICucyXFWjTzg2zsNPe/HCtTSYuglPgYnQgnPPRog3S8pmEVQQpWyeOtb39pe//rXtz/90z/NORagcWM0YSgX7xWHsPi6r/u6PNkVI4NH0iA+d5D3ZyqYrN4Q8jffekP78D9+IBXMkpEuPFKJhCBQDrh34dVXMJUCrW+EujL7RoCThUfLG4KFv30c4hkWIygSFRosw9Z8lv51CNsQSCaTc0I53i037r8NgUUoymbM8FIoqsDVMl5CQhosFo26Fy5664EPklMqDrKkoLKuIiFW1fzsQgjVjW1yfFW7/MlPa1s2b5NB3u1/zjln5RJlS1Q3rN+Qk56XXnpJHquza/f9KYQIE4pFeQ2DKUspGZZZv+nz2A5+34pefgtHaRT/IExfDKF8oVDDPw+uDIVhhZg4XQhLyx4h8fteEErOopq89ycUi72oh+YMkYUVF+nCk6K2ebROrZa24TMbKh3RwwpbsXJF1OF80HI6lPT+tmnzmlxZuHvPjiiLRQO9ngwfmqMx9Njp2xV5ZBJ4RjniLxLPOhvI8xTYefLCiDmYJ4YFc2H8jnKHVaNMyrdr1+48Zuq///f/nqMEhLe7TzZu3BR1sCFpoo6V55FCV8o6hP1aB8+zzjqzXXTRxdkhlIcJf9cAGI6lWHLi3ztFGc+J3LdlJeJsWoE33nBD++jHPpYdEwd1Wt5cOEZyjyn01vdgGFTBUTgRSsr+aIB0v6RghoAQwEzogMF/+Zd/OY9ZAAQKxgTZc0uG7TcElvC1s9hlZu6mKD/w+aEr9TKUbwoJf/3Csauv+3jI1RAYy/XwKUGSv3rP3TqrxlVDZYRlWiohVJXP74iScwCEi3KyVlKhsDZScHZBly6EmdOAp4Jm9m+4sZGQnloxlT3AiamJHPaxIiytjvjLyevIoysOCwnML3QLyzCYeskVMvCKP1YTPCgX8zOZXvxeMRVWy6HD7fRt57Tzzr2wnXn6OYHrZO5zsTTVkS+333prW7t+beRlD9eW5rbN2+/4dLv73ltz8QDBvTKEca7OCrzQwhlY7qwxhKLchsk8Oy9ZztyvOOgWjzKEgMqVZ31exZh+V5Z9iExhJ/MoEHt96hBC57RNZTrqh4LhpOW3eqDIWQbmVUaX9ePWOQrECQBBhKSD066zh35wIS2qvW7LnN6TCoa+u/ue24L2h3OIbO++XZFH0Powa1WdG540F0KcRY0PlKsOSmi0pHcqnVwgpk768tg8Oy4smEuecEk7/5xQMFaQHa6h6CPtfe/7hxx6thfFoZYsBBPslKkd+4YI0QE/9jgPD/R9uG7FsIJ6B0Faq1atDsvqova85z0/b6KkSCzdpUQoR4qm2oGTm9FOGMOY6GeY/NO33JInVbvGeXlYhZl25vXYwZcUzKMAKrLA+/DvAmUa9j9ZGQkwQKBi8P/6X/9rzr9U2hhNGIIG9B6oJYyTeV/413/91+ehnn5/NnliWnC875UnGP5+PL9jMOw3UDDxj+D1v0avJ3rXPbe3T910bbzN593z5iqypx9/BEQmHQope6VHDA0Y2onyhyKiJIRFB71Xk9DcksDLmPx40GQEHWWXf/ZKWDE2Fk8Cr+9EJ5hyddcomtsw2Hvb8hsPnJwnljiwWOKbXeIUTw75ZBe5C7RURlEv0rFqzK5veFJIygIRczVTIaDd4rht22mhLPa1XXseaNvvvyue29u9993a9uy9r80dtEhgZ8SYbXfefXP76Ec/0P6///2n0ZO/PwT+WKRJ0OlkhPAMZwNmDpcFTVgDFK9FBgTR1FS/TdSxKpZsUyLomHNCQRS8g4bqsSwartNlIoewWBxpjUQ4/pFBKqGkavwjdHV6crNquDwxIMI6VudQOEJSOOmZGxqfmOzDVxHGVQETk0GfJfNt3/T97eZbrg5Feku7b8edbecDdwcNLF937tpchA8coyyGx6KIKVitFqNAHdOTc2qRZtZDODSHo2P5rSSjYOyxeoJJ/rMvSgUTX7K8ymMI2mhB/Exa6ES49tnQ5wtf+KKwqJy8TWn3js3DBfl05WIoTsfJ745/8niUiWK48MIL2jOe8cz2hCc8IZUI2s/MHMh601nCa+pNPc/bTBr1oSOE9uujk2L+df2G9YknhU8BawcAPbIjFH/A+7CM8F71+kjgWErHQFLDyZ0oafR5NEC6j1sFUw3veDgP+3kfFsonK6OGU99N6rvXRiPXuKWBkXyXr3cbSR3C55Kzb/7mb26vfOUrc015han8Ks3FkEw1+C69xQy3+PtwOsPvx4eIN8RSmXIoGMrkjuil2sk/OzcdYlKvOdIOwZdzMQPB3Yc+DJP1eQzzJ3bYSymF7EAB2bGdw0/Sj3cKZizoNRJCZSJ62XVMipVSJpn75LYzpuZS8EmPYumCo5dZnsqrYRPSyupdkeFGWFqiTMlo4HnDZjjWUSq/FCDy7Pn2HfUth4LM+Rw6PNemZ/a0mbndUa6ZeN8RCc22/QfuD0rMhIC9q915183x+4FQduhPUJiAPxSKJCywqbAeAhd48stnlN0dNFZiwZOzbNp8AvoR0HBiAfQ6XZodEX6EVvXQ+3BYkDLKj++E4S8OegkXmWbd1tyAhRJ61upoZMycVdRT0EbHgqBUqVagEdiUpKuhJ6fCqpqiiHU5Ztro+EL0ytWBc9AOhRLeFd8c9WQYzbUDVlYpV/B11DZBHSjKJJ9kab4HLpFgp30ooVQwLTpiC8vaxRc+sV147sUZ3zCZtCjcN7/lTe2DH/pgJO406X6RHX/19dVf/VVt65atvV6TbhHoEYK4XcH3NDyVCVR7tQzZHUtPfvJlea/U+g3rgrZh6e3b23kwCmlBCqtQMvgA3g7kfMlLvqxt3LAxf+Nz6flTDyDreMCL6Rf/sh4pm1R2Qf+O2sOGARqf4QqyzCdw8f+jAvJ83CoYDbCYwjvwrhKHyzEspMHwt8UgbFkpJkLd928CkL88PIEGx5xmsXzXd31XnhRtHNdEMZCHNCr8ifIs/woHhvEc9vde5T1Reg8GjLMonHOqovWb5LeKjCBa6p6YZtVW9IZNQkc+JoRnDhi3tzmQYI0QOddhsrrvFtaL6z1ZZ4OFoogwGglhmXsJBkKG1dAFJNw77bzPzs4EQl2Y+m44xJOfNOQLio7KTMAaatITjySiPPyDRgNhyvqhAKRJ+VE+LC7CwLxKDVvkicGHQ1jkEJshtIW2fOVkxDcRb0/JXL77bk5oIpSXITfDTS7lghMaycc3uBVdhKFwvM9GJ6jzaRcy/b1/ozh6x6WXn5/faakEVN3z5/A1etdwpe/DfA9Yei7x8hv9Oh27dcPBsdNSHIqcgGdNLY0e/GQok6mugFatSAuMMqRYALz0zLsV0TsAeCyXk4ci6YpHwh3vzCP+Avv4FeULBWMfjEn+sAOigFGv8YWwtgTYvIvysXaBMl8UAv6rvqorGHgPC+hTDWjW80CXkewoWgTwpCc9MS0anUmr6Hbs3JlKHX5pOUYcdP6K6GR+2Ute0lauWIkZMz1hMt348yyXlk2A78PvviHhowGfIQuG4FHKMsvzuFUwVSHZowvoQuxYJQ474FmNtvwWQ2+EfZKUsjCRZwKvrCU9Z2f4uOP/R37kR/JAOPMuwhKcJSi4gmEcFsOwkDge/l0Y9Hfh/C43nMfxIeItZp3BEFkqmOs+0dylbx4jVEV8jHQjD41L2vJAW/TQoJTPNbuGuhxg2pXI4fTT6HOYJPAUroQRkJbhoUhuCH8W6FwKS981UAqmylxCFk18KxqUEuqCris+/oBVRUBVHeay50HjJfBZQuqRX64Ey3xYIIbnugUhrgYvf/kWLxg+kX6P3xc5WLHW8eu4iis9fkcVQfijB2UiPQovLaoI08vR516UQXw4iFvlPVa2vlqOk26Vnes4mG/pQ4z8vEsHvYSVDn95DKdZwF89cKVQhJMGoVp05aTjW/32rkyGzzrf6Hj0YcRMEw+GMllyeCQsgieFggkLJqxbe5AqrjztNTH3YWWheOvWr2/f8A3fEIL7K9ICtLLPfFPhf+oAHv1NR8C7PKpe1q5Zk6eSuCpAJxK9zbehn4USFn1cGd++9/u+L8/vQit1nvU06JyZh7LyzlaGO++6M8tZ9ebZl++HVR+dFr8fDYiSDd4+E041RQvQ75SdRfb5gGqMKqUakLLwL0HJD1QZwYnKWWGrEVk5ZgOlpcmYSi9Gb8YFSIutlQK/xceA/P0+UX7CFQhTjbbiDadR/gUnTDP+/B8hjjKVfNJ/icn4Q+19H3xXe9Pbfr/t3rs9uq/RkJaaSLdHYvaocJWXPPudJP3EVb1zKFcDQmfCM1pSZGLY61AKa71Qk9jynctNgrMp7PrvuciDEupWgHkY36RJgBpSykYX+XPwKQEnTKdtp82wkKzfHPyLfuL5LQ/voDbQSk8Y3ypfwN93eMPJxD28vfOHAwuB4uEnnuXXfRK+Kxhh5gd0EwckPrkfY1lfKhxhXASGhnDDY/BgqVUd9PJ2JeE3Ydzz7wpJ2j0sPrMij3U0kYpB3pSp78JWeNDrocet9sLxl4e4nsrnKe/CS95FS7j0ExY6T+YR/4FLznPE72iFwVpjbemh8fbKV7y6fdVLXxFcGRbvQviF5SNdeb79z96eIwa33357dmB05MxnnnP2Ocm7wrGHHg3o9JTHMTnRyxX+oTApQTigk0l9J3ewutDitNNOS5lw8UUXJ80AZcGaz/eggaXvNnW6nZMiRTvXmruF88UvfnEuu1c3WcaI+2hAyYLjwaORI9olPwTzPG4VTIEKU/lAJS8uRzFLFvgkZayGluPmkU4XHH3Ph/gEAVpVwyuhWQ6IU4Lq4YA0QQkAAB/5JeMF3vLQGL3L+3igIfi/s1Qva+LHb6Bg3v/h97Q3/ekftF177mtHRqyKCcEzFkoh0k4BGMLBXSiGXCgOQytJ38i3D10R3iFQl/Z7SAiSaIdh8e3LhlK49uGgTkO0843Acwiku+iddqy86FWCjlAX31MdiCctfsKhk+NkKDB1ACoNdBKPIKx6Etd3Dh4c/2GaFs3rO1c4gapP+Akvvkle333jDLuVkAC+zR9aCIHfFZW4mV/QyQqwngYe6jxVZZY3GM6zFIM0U6EH4IPiBXSSLaXtNGXhykoTpsoh7Wof/KXpNzyGaSAu/6KFsJ4UbZZr0B6KFo4KUoac38jid2GN+yiYdjgU4CIFE5wTwrsr+zyGJgLLw6gB/AhdadYQEvY1j2ShyKmGyC4hsk9aK1Ond+ddKxGznoOXzWOhAavD5W9o4v3ATO+0wM88Etp0mizLI6V+6Zd+qV111VW5DNoKSvuPKJeffu1PZ4fVqddFh0cDPl8K5nE7RKYABfBWuZjBxTp6QU50LiWgkoUvAXCicvpWT+mJI00MxWE8vUyNrxpqpScPcSptT/nV+/FA2sB371UGeSiHpdIWG1i6qSFi5upFPjQcUzAFUZr4/3C7857b2vU3XRO/oyGNEw79Mq5JS2lDWGQ8QYPE9o5oQP149rBQ7CoPAZ9mfTztjj8UlktQoDlCPo+RD8nhmJOcuIxw5mEoIXsx6rfJ/3g9br1kA47f9fS9lI9zwrpwJvRMjAtHwVDEXfFB3LO+S7bPkfTvLDH+vrM4fO9ZH8lvXaHO57swO3c+kPVC0Jo7Yq3AtePbCYXXUvmGFZHP8LMgQT5zIZRSIYeFkz3i8HOMjDIJ57v8/MZXrDp5S77KoIzw70Nh3V9cv3t5QgBGWayiQyd0TeHfC3aUjvz5+V3toviwFI14vsPH9worXPkB6UlrFO+E4tPW0FN4uKpz/OOAzSWHl7UnXHxpu/C8i4IvQnmGy1tCAz3hC8+8hyd4nFAvwS7fHkY99TZ6qqDTSfrqEy5kSS+DfM3rURo6aMqbPBk4GM5ySkPyetSFoePENeq3Nr76Lc673vWu9ta3vKXtCusHKCkLkxV7yRMvCbo8IYeaj358FGCxLBiGRynLrNPPu4IpZq286zdYjM9wWBVXTOBdo/jgBz/Y/uAP/qD94R/+Yfubv/mbdvPNN+d399JUr7biHw+E9e0oc4XT4P2WPuaSjjBw4e8pnHf+3usbV1Bx6h0IC/hXXCa4W0FtOvvt3/7tLIurqCkajd9x2hTNQwOWOlZObxRMNIdQMLe3G26+NhrGfO5Z4Bf/hcQQKvAYDOMY97YkOAWjMen403isTEqlE34WA/SJ0b4fg6DRQ6+hLy57eQNaeU+rJP5ydVr4Fb2KRuhAmKtX7/X0jaCu3rkGXMIVGP/vefXfhAUw/OGbdAjRojUnjLSkaclsV/ILKUhVE2ENN+WQDkUgrVJcwuENeOEPAh/AaWnQrfLq9OlKo/ClgIoenW46Lt0yhQO8xJc/vMTz2zsH+HnvrNbLqSzCAU/lrmc5aXNw54oe0qrfaAXkwfET1/swTslrkT7XlaGFHp338YlNlbmK7KI+BxMhwj86SRm+lwl4Jl5BZ4sq6hu/5I/4k9fxoMpTaQG4gmE/YUCl6ylt3p1Pim9Y7oMVguGpHOqrgAJJ//BLesaftPADRU/phFd2pAz9vfc97wnrp1uCgBWDpwyV2ZhdceByMliM//C7Jyh/kDTLf8dosBhO/OVzA/h8QSiYxfkWgVTW8QhejNMZozMWZfKbv/mb7Y1vfGNu1DLWecMNN+RZQ8ZIXf8J5HWiciYTD757742nw+KGMPxe8YB3rqDKV9+B98J7+N0BfI6j+R//43+kgjT3Q1g4VaDOTLKZq5ZCD8Pi3+FzlKnym1eT/Ev6cf3X33hN27fflcLB9EecenwozPdQFtGbY5XoSWocGokeXArIaFR5sm9eMhYCKZyeuJN6CXWKyOGJfc6mWx8lwHoPvysJv4cbJf8S1Fz1wIUpJz4nza64+pxQp3Vf1loCrxQAYOkQ/l1BELSdf4aVBH8KUTjWC3y6oDRM0ueT5FMk9p3gEa8fYxJEWtIVZs/fzYh9I6TyiNsFVRcuyVeRlrTNQwBh5Cl/NEEP6fDv+HYeQRvl1NGBByDQCSiCURlAx7cLSW6Y9pV2pU+Ze6+OQPHSMQVyrE36LUyFg5ubS71zevw9aPwnjxDahw5GPkdG2kUXPbFdcP7FbWSpBR0U5ICgQ5DLkSPtYXjw78+McwzwU+8cKgLcCi8uQ2SZB7gG+crfk38pF9D5YxC3ez3odz4DiiZ+oxmIUBlGfrfcckv78Ec+ksN/hvmEs8LShmwrUFkwGd9f5n98kBaX4QZ5I/OwnMyyx5+2lZBoDIU/Dpz4y+cG8nxwTX4eoApexCtXjQf4vRiGGV8alImeAmFccb2bpP9IVG6NIz/WUOXrTN8rerh8flMilmn+zu/8TvuN3/iNtMQMk4EqO8GCUa1qIyT4lwP1PClEECa8vDElmjD1/aYUjoQlIowj2A17uQmPcunWiwYQ7BLfCA1P1gxnktdwR90nk0InlJM0TfJbVSSPyldZDBEY9vNOcaCBMnP8SqhqOOqaI0j18vOMs7EQzoO9OkjsvVsP5lgiz0N9GbFwBIXfC4ejRzpqxRPe6daQo1AoIX4UgDDOHfO04Q/O8EBzOAHpia8swsmbYCkHZ2n1IZ6uqCiYbuH0jXpVbvG7xdRXpqFDli0EjXK4eMz70dMWorziOEY/b/6M8jIScFmGCzrhKbhKH96gysB5H+bFgnpXBngqR5Yx0kKHwhkU/3T6dGvHaQiE6PR0r0POnIOTDuQrPxBcm89TCXBngYDk5fitAwK6f28rXRB35YJeQ8U/tYA1o7wsH1sanvWsZ+WKMwCHLVu35iS/DmPKMjycuD005Oq0KFPSs5P0aF0mHaI+ksTh1M/nEz7vFgwCFGHlP4zL0d7AwK8Lri6s6hvA7IaQ/s//+T+5BLCgM9lYboZ86lOfenR4q9J7LEBe8Bh+57wrN8vEChPW11//9V/nvhvlKcaosIDl8sIXvjCXRi8GYSpch/hd3HcUouG1hdzJbx+Ma4VtzrMPIudabInLFV69YS4PBaOxYlRpmeRM8Ft+mX538EylEvVzIISksim2p7oiaL2LJ2yWL6ISQsorjGEija3qV3j1R9j5Xa42UkKkWwVdyXD4QwOUXx8+CwsgfhPWBIr4BD7/EnR6/05s6HtzMtXEUdoEvuXY3ULrVkIqj8jHN+kYzinlBy95+e6k4kwvBTBB3YVxF9pdCFJyXJYj0EFDe1BMJs8EPnBXLvkIAHd5eZdHVyrRax/gRFF5oiEnj6N0C9x6uXq5i2dKefuujcFPvVD2flc8/sJLiz8Qzy5+SVb5hA20Mt0j/Jx9NjIZgvayvkzZEFk7vgXz0HDiOMptKfC1117Xrr/+U+322+8IGiy09etd5d7DwL8PhbF6KeI+THpCeCQoBkhf+8BLbog884wz28ZNG9vZZ52VK+S+7hWvyHMLzz///AyfrQmSJ8mv0qx68zvLEbypPoww9HYRLT3qQRgKrsKfCB5hER8S5PkFMclf+SKSd0Ty1EPCzEBj4Y9pOd8xVDJxEJmgtlrDgXXAEAVwxpXljldccUUKgM93GYsplGXnzp05HOZecGeeadDKU+E0XuXwLr7x2q/4iq/IOaViJP7D7hjE78WsE8pEDzjvg7nmY23vfqcpB82X9qGuSTcbjoxnT4s1I34+I13DZt4Nm+UE/ZH4Fsn1ITWT37M5id+FTSj2qrcIS0DXOU7d+um9MMeqVC+7BFuVtX57VlmFE/7ocTbwi/CECMFGWPRJ+D7EJV58zrCpUFL4UahdyfT0D6Vi27XrgUH43lOHA9p3ZdEXA4hTuHXF0lcViVfCnLDyO4U6Cy94zje8LJ7CwxPOnHd1Lq+uKCLtyAsOyipNrpQEB4eihbQLJ5aYMvErkDYcgDiFpzj8h+fHOOlUGE/5ScN7pVXlE7aXixXVOwM2aioH0ZrhQuiZgxldOt6e+IQnH91oeaoVDByuv/76PN7J/KXjZ5xtdvPNt7SVK1flXhb4gCi6/+N3KZjuf1x4JCgGoNfRdCMNm0UdJfPlX/7l2Ya9b960OT8LRxFQRurlRKBujSgAtBeWcqln+Wtj6irzj+RSEpwk3UdYxIcEeZ6Eso8NIEIxMyhCaDwanYamp5iVEA4BOVBhEdMmKL17CgVgfPtWnvOc57RnP/vZ2ZCS+JHXYwmLyyV/756Gwlxa5l4K+FUYUA1b+QkGJ/vaeMakRgdh6zkc72QgT9cGHzrce7p13W8OVYUCgStXiskEfqYdJKM8rHrZu2dvbhqDk1DOIINjriY7SIFEGtFo+e2P8OquVsxwfpegO7C/HxIpLNyUB1QdeXLClp99Fuox8QwECAk49nB6/1ba9c6FdK3Q8o3w00D5wYHr34/tbxHXZloK1txKV1L9BAF5CFdDexSkNPnDhb+VfxZp+C4v9Vegs1DWB4VW98agBVwKB3mjg3f7QTjh4eBZ+SmTdw7Iq++q779BfR+moedw/GpT8IULkJa2hx5wHI4vXClLLukXfvx956RjQts3p0PYPMkvPsHqKH+dSnBmmMUx7tjXrtzZ4hBKpzMbHdCZA3AYItGjBuiAv7JeQvhTHk6UME/nSCN1iQyUgTrwXZyTgXlRy6G1M4oG32y/f3sucTbUrT5TbkQHhQWDR9XL5xM+7xYMxitG90Q0B03+7d/+bfu1X/u19pa3vCXXjxNO1o5rmIgoXj0xOjPURL5hJI3SHdN6Ct/xHd+RJqn0OfBYlhPTyI/TSAsHAukNb3hDDospAwFTDFZCgNPAKch//s//eU4IUqDD9Kqy1PMYfGZDDtEc7nC74y43Wn4shPue4AACIQTBfNBxjuDuS24pH+hoCLUTP9OIlz6xb+mxHlLv6cNTfXiqD0NKcKyzt1gGEum4a07mKIIeIcQJVZ0BGxc1yCpLWXDdcuirkxyCWUNZoGjW0z1Wx2hXvCGM99pjUYJRGGl6Vnzl5VcCFz5ORM40wtqhPCmynlenfwqLKFEJWU80dH6VPPE0P0/zFC6rogR7WY/xZLlSfBQcXPihH2UJqowADuiegmVZ5zF5V7kLxFGeUg7CS7d3NOynac3FZCw1Q6RwE2c4Hfk7/VkeQBrK3mnW66gXR/hwaBZ8NTd7sI0sGW+XPfmp7cIcIouwj9iCOT6gs6Hm9/393ze3fCqbTb+EMSvFMS7bTjstQgZe8U09om/ioPAngJNi+KCPx2gNgptCsUYnY2BZpCUX4XPBTNBWC/CtVqFxZY2cCNRD1f1NN9/U/uiP/qj9/u//fi4IIjPxG9nnYNeqv8r/ZOmetIyfA8jzMVMwiFMOIKj8OAxLgZjEfsc73tFMdv/Wb/1WTs4ze03ec4SrA+gwNkBArn47dt1Q2Mtf/vL2qle9Ki//cnBd5Vv5PRrlVIbKo8oIhvP1Dl9hKRhK1NCY30WPEtDKVEryX/7Lf5nWCyFcaVSa5Qq8pTsyeIt/hQ2h7v9777+nfeLqj0VvaDoYfiR7mPMzhGIokgVDkybZQ+CMhyIZnUgBlEfAUyzRQMZG+n4Hw2MHwwKSvjLkScehoLJhJV7R60qhFfhGqNyQaUguIsBFI1u9ZlVbs3ZNppd7W6LhG3rKCfLwIwQMyZlwJ8CcDQafgsw3HBqgmZ4qYV70LHpzrCUKD6AjIU+AC0tIdiVPMS1E/fT5Bw2WnwvPII4meVpBCNRUMNGAlU/vEr7y9Kw80B8OnoYIKRmT3o51IQQoVXMuymmzps2nGRztAtfJUKhdIMGLAgulHN+i6xtWAgsz+ggRIekZio/L6xPiicrCCS+c8+Tm06LDX4RPKNvAyWGOxJZz3NYGj03oFIgn1Xha2WSRgV6yIcVcJGGxQcSVj3LOB+5zgU8L6zjnrKKunFF35FBYfrMLbeXyte2KpzytnXPWBYHLI1QwGOcEUWzyfee73pVzseo6h3GDpvBYFR3Tr3j5V7bTzzhDZUTokDnxv/IfRpgAzaW74MrBO4i+UGbZ3bG/B4E4aJ3OCICw5FLwQ9Amf0c+C8GX5L34uQgl/jqtghrBh4eCnnjiRIA/Kaobb7qx/eIv/mIOr3845KJVs3/3d3+XF6CxotUHftY5yzYQNODnvSB5M4DfotKcMsi28FgomGrsnkCD6z20fvcCAul90MaWGVMsenHCITrBYRKWyW4egqCtnt0w7sIjKtd7VX28kr+8hsOfasDUoCpuuAKB7/Co3/CxIsyRE5Tr8De4U5Tf9E3f1L77u78718krCzoIs5hZjg++hxsK5mA+An7u4Gz7xCc+3u7fsT03eEH94DxBEfQOBZEbz4KRWSl51LyrexUvw4UyOtAtHlcem7wmy2Sjd0ZhsXCsfjoYVpChM3hrRASy0wKO9syDBvYD+FbgFeX6xrXeW8MLeRDn4L1fQ4xeoTxCIRmi0UwMI+Xd84E7entyygDDnAMKganhlyVsOAuPLQ/e8l3mcEgrLvIiYMejPuZCuKrSEfgGXlXfLqFyp0p2DCLs7r39fns3a7II+CufdPKWxlBM3pUhBWZkmGUOoc9fmUeCTnk8Pp6AUPjLPMmRfJQR2s4QJhORvvKY45qdOZC8774d+1BG8Twcwy+vUAigrNAqr1eIdJx4PUbqRdtcPj4ZvfytbSxotnPHzqwrfKbjkIot4roldCFwQDOKTJsmJBeCPhTkRJRbsVxDvXxyZXQwVkSnYzQVy9Oe9sy2acOW6HyEAmsEKeweLqD7gG7peioUnw7qP370I3mPPlzVkTq79PLL27f9s++MOl+RdBCbcgFSy7f4r9REz6GnneootI33pFs+/dff+3+eYog5UDAZh3Anf+Itnp2f5dDzxxeUN6e7ha/EORGoC8NehgL/w3/4DykTq5zA8OzVV1/dPhYyhWxRN9qZoTlpUzTCDsuQdBn71IO0HxMFo0ep0Q0LUQ3P3MMf/MEfpFJxz70zfqoHKhwCiQcQhIViTsVQ2HBai+FBxBuEOVHYUwHDirMUSz35Ab+9FzMo1/r169t9992XzEDQ8TPX8tVf/dXte7/3e9N6qWtdCxane2JQ3nAPKnY0gmgIy0J4GbO+6eab01qxF4NyGQ1rxXJjKGYHOIRALl0+HI0h3lOhhHNrIutFN89Juofje2iLfBIs0prM42BW9nRd4zsyEXH1blkaYUVE+JHI73BYTPZJ9BsOQzgd7ukcCVlvM56LqkwIL1s2FoIvesSR3pIjLu3q1lakHuFCGY5MhbWxOr9J025x784tm5891Pbs3d9GQrDNstRmDHWxGEJQzodVkosbJkN5RbkCF3fIH5wLRRw9b7hk2UMBjwQ+42OTIaT18PFl0IpOirRGlkaZIl6+Rz5jEY4gnTkwn3mMhtUXOiRxUZ6p8eVRNehrSXhYSJGffMezDoIOypy9/MjHTvgot/exoIfDI9HFEvBDgVfSLvyy3OH8DnkbztzTZAp6cdRpliEUyWTkr9zuaVm5fHUomfHETR3t3z/T9u87kL+xtvrRAZmL3/C0sdamXOlHPyLSiI5P8EJO5qujpHmUZ0EJxtvKFevbpU98SnvqU57RVk6tzTrs+38exJwPCZ3zA7Jd50v/GU7boehuv/22duftXbhSvE+8+OL2nd/5He3Zz3pG8GQoe4I82kAqjuicSNU7f+mUEyYKFD+6U7xu3fgq1nBo/9efckV9xF99GyC7CKjHfNR/gxjHC9vBcJeVhe973/vyBtCuQLtcUV4y7lAofgudDJnZouGJNueec24qGwpK+FRqOg1yPC5+nztI9zFRMNLlSrgCy3H/03/6T+0//+f/nESgfYVBsGEtiygUDqJYT+7uFfdpn0zAVn7c8eBE/p8LVH4qGv5ZifFbGbj67r3Cm1M6++yz22WX9bsnnvnMZ7Zv/dZvba9+9avTgqn5lqJblbnSOjn4Hm44mLSCrfWsN2zakMMxTG5nKh08aIJ8ZQjqEDoh4Ja6GdF97/GbQCQECToCdnxsKoUVIXY4hMWSEKTLQoEsCyGVx4AcMScQveilrCMKw/LniTa9X484LLHwP3SIgHLUzEIIraDPEeP+E210CWU62g4fjA5Ji3SXEMwjPd3oCc8HHqNLQhlEPL9Hl00GLiGAvQeucwcOhxUzn7/DDsj4I5EmZbFiYnUI0KiPQ4FPxMtDGCNfAnBpvM9GmIX5EH4hFMUXTt4LBynO7j+ydKotPRzWSuB+ONzcgbCwl05GWEI2FKl0I9+psVXht7Qd2H8o0hppk/FbeZZE3KnJEOihEIVvC9HoIx9pLQs8p8ZXJX3kBacW+C1VFriG30RYBIcCl7FlU1F3k4HvkqiPFWE5hEWG3pGWeAuh6OaDFtI0/8H/UIQVXn5Rk1FfkU+EnRxYGbNRltkZw0vKxioK5pF/hKUs0AK9xBuLMo9EPUjHqrBD86GIInylmbhH2ZTnKZdd2V78wpe20zafHYJ7LHmHZflg5jw5aDWEen+mekh+zrYQf6yE9evWtgvPP79dcN557RlPf1p72Ute0r7hVa9sr3zV17UVywPP0PBHokewLKKmAol38ZamtSFFnYlMNp6RV4RZWBLtOV3IpfCnYFK5eHoM4qXFoi1wEbvCZID+36LnwAkz5FP/Hw/kQ4Fce9217b3vfW9a8yVfyElWPiUrTdanzqspBhu4DbdTMqz24SzSihrgcKoh6yYQftQPuywiFHg3MfUTP/ETOTxGw3KEc1kDLBzEMGYt/ObNm9trXvOa9n3f931pyZQA/2xgOG9wqsspfRWvDEAZ4O036wOuhlyUaTFQnhSIIUPpVHiu0iv47PBWVsrAe9RrxKnSRy3kME5gGG8H2y133tR2PnBfu/nmG9tsTuoTEL0e7F8wtj8aggBecyZ3o4xlxtvND5tlo9GjDqtnaQ6DUTjquveSDAlA2cbAyTDTd+3elXVqf0pORIekodjkJ1/DL3rDIe0ifp/jyN3wQSOr34j42fnZ6HGvTKWIPuY++mbRI23Slcvz9uEciAbXh6b01ChRw1irVop3IBuhYUgFUM6Vq1fncNj+6ekQfgs5bKdscLTzWlnQLW/mHB+cbRdpKKuVcJPLpzKdHEIKp07dG2OJ9gEWYqRl6Eo6aJnDGvGNspePdJRRWQ3Vqefk2XB6mUcrMPzhsG///uwkwHPf3r0dp0HaaKG80pwNHjSENx7h8Fiu9sJnkSm/XKgR8UaM0Qc+eZRJlNd8ALrNml+LPGsYBtfASUX7y45P/IOTF/QyP5NDauE/ObEilMq29pTLn9a2bDo9Ykc+LLwI83DbIBKUK6gUzJMkXnCMvGem9+dHeBsSdGhlaN+kt38jQWert+DoMNLUHAN8Mikv8fNQKJWw2eI3HyXG+4MhRm/hXXM0gvQUAuIlku7Jdp9Mw7tnStujgTO3gIihYtKyOz7IU/lczvba1762vf+qq1LucED9Z3kChEuaRLnwxvd87/e2173udbkYSr2p914KQY4ic8oALtJ9zBTM8JMwtU49rKdcTliQCIVLxh2ABuuoF5aL+QjvhefDwbfyBqe6nCozG3A0MEfU2JXvgEpzRuZPnvvc56ZSlK9eByWCKfw+KnQGdcDfe/0uEEYenmiy+HsHZeTQTxm5SD/+B4SORuZomNxvoQEdOdT2TO9uKyZXxhdNyJ8UMmT+ksqy6Jll7KN0DDyyMYRACQunpzuYWM8UIlxENOdj/N6k/9zBuZwsHol4C8qcwwmFdY8PXxPgUpGfeZZOk1AUYf3MHZqN3n/QzzlqkU4qxCgDlrGKCnrG4/WQ4ZpzB5TUIbdjOi7GPIy5iGiI8XIolBwlijYm8rvQoehCIIWfSWxpUXDZII+Wr+MMd7ZW/TbOLc2cV+IiQaWxobXTlqDriw6OhHQaid6/mNKHrxsghUm6xbN3BrogAHKfnTe5H3ZFKFEKkCI3LwJnOBi2DEke5aG4I7VwSePApe/7CKFjWCvwk25hnysIo47Q1WkCfqOBnnxonAzVeSpz6T/jLagVaQXGC1ZNRTh0U5ZllLwOQ3SwDJkdWdJcl52kF7WS+Cwgwwf0GY5jkL8iL9iZj6M4ck4qOhk6AWPLJzKuUT17dYD/lcDwb1pSA2SO5RFekfBClCn5OlzWff510CpKufRnhKkEMu6x9B4Mg0gBHRuhuChZPI6g1wlA7uZdWCt//76/z/1zZI1DNIdlZgLeA0EbSuf5z39+7g9yliF+yJL0f/39FANeTv6KxvuYHNdfgsnTfIPluT/1Uz+Vpx7nvgIadwA1Se9p9dQ3fuM35m58y1kREr5JpEcR34cDcFcGVtnrX//6XKRQSsAw14/+6I+2H//xH88ysWyy9xwwPDcFCFJpsXSqbJ5Fu2E4ftmPMWuxDjau2ASGnrj85lNQUw4EkVVi4xGuM55YGmDSOiLLXn59ghhEmHgh1OC21PxDgDigUug+elLxL1qP1AlXiolANYZ/rB45eKNF5BsNTdMenpgkVFlHBJbmS2B1kFe8EwhRxj6p3p+SDq+jGPmd9OQXgpZQ6vQXtqdzjN5HYyXeXmVZVFK64SebJMtIS0VGKfAjLd8Oh4LpK/uUTriuaHJIBU7+ImyePpzB5NvLOfAIqDKHYgw+6avLjn3tbz2eTgRF008JQGdKIL5QPl2S9bDxyGIHwM9NnuJTQj4mXhmuY+Jb1ZPw+S3+LRwOKzOU+NjEaPCMOYFQ+pmvFWPRlYhnkjVccufRrv/DgEhAEh2vfBx9t2hBPZsbHA2FaxJdfr4Gm7WDgX8WKX7r1qBFbbL03r90gF9CeQwQldYgaELnF3Xp2d89o9TxDKvxQaEXQ0+rrzLjeq66HCeKho/MwViYY4Ov09b//u//vr31rW/NVba5YCVkShYoiR0dqVAueMWCoV//9V/PK52PypuoI52r48uSzw2S7yPdx2QORmaExKEQoCVQ9fY//OEPHz3xWN4EqxVi7kd4wQte0H7mZ36mfdu3fduDJrrFT1M8CPdoEQYMp30iP3irVOOcllb/6q/+ap6JBseyaixH9jTHYjcxvEuZekcL3+s3J21Oflz9BvVeTPJgWEwPv4/5Jf6ZTLBztMasixBoJnoPh7DI3maOIfNHX0MMxtzhSVCEQEvBBCfhCMPuJ+3ea49mlhJEPvGgDMI5obnTTzh+0o4e7qDH3sN1fCz9jR+Zvv+9p0CLb5mXP4IyYIFUyd/o0cN4dmqJT9jJu/spA+HacZZPD0MY5rf437dUnvEL2eGeP6JcqTsy3UGemY7nMX8KtN6lShCbxxJCeEK+W2/xPYRcCeuOP/9eBt+P4iRu+MFHfiW84VNhM/ygnOpAvSVN46mnLl+YVNgePtIXYVCOXEI8hEP6BQ69PJy//kwltaA8fRjSKkJf4Chty9rxkfoFuQghvqleUOoCP+ts1XvxfIG8hIVxlDx/db+Biw+pXCIO6+VQeKgypFE1+YzfLPYjFHM8da2Wusn1cFjVLSzkUMh+L2lhGefzUBsJ4o5EWiORuO7Oskifg0NzpXZ0KbpigDMM4dwxrXqDMzhanPDofv0b16lTAeJXRToOaLOCopFpAyMkRnfs/9NxtSI1aanNoGPEMSxmXpcVI+2SIersJFkl9Db7yEDcx8SCIVAzs3D1bk+CDZT2u1iqTFDr7bNUXvSiF+WOdQQUFn7DArWYz7dTDWVVSPt4+ZS/cE471oOwAk4Pou7vpySCrhmWc+vdH//xH+ckvt/DZTm+ovhcAM4d7w5DdBs8HwxdkAp3ImrmeHWUC66Uod5t3vsS3wzPeCIR5z91LGwOjZ2gfEgr3aKR9KVdv3v8jpnfBaWMK0691+/yA96l45v6Ui9p4VTvNuP1sNKliHwrP9/1cvtmtWPpPgjCO+e18rP/QrQETSgAsicP5AQe4dXRCzzhQRgeDD6JPGsORZ4QyOiG2hKf3iEAfg9IMHhX5t4T99um2F5PvSyctDxB5Q+hKmeXkT39B0F9H8CDQ/SP2YlPiJf84dl9Ekj/IY9BiMgy+C5wtDnQKkpHPelcGlY2IU1YUlhRul5+igEtB0OVNEcX753WSZIsUPhFBibx2Xf+KIpllrul9Rshw9o6cmimHZx3qkS4g3Pdn4vwR9E9bIhvKhTTWC5PHxkfb0tG+9aHecO2oUCjsoO2Og9yC1prR+JLxrBy/ODf1WJ4x7eBfk2fXC6eX7IE8XZiC+ZkoCPrHiyT/27ORFP8hOdt1P7BH/zBdsbpZ6RcMsSW7SjyyQ7dII3jQfLjI4Di5cdsDobQ6Q28E1KeVo458bh2OxsCM1dhddXwMFEJCemAo8g/CviWcIQnN0ybKoM5JArl7W9/e/urv/qrVDSsqipnhS+8HU5pxZwl1mXdqOQKd2oh2bi/JuscS798jwsn+UgQELRwRROTprOzfbe4CVuHZcbHLH8KY725TE+c4ysYAXK5awA6ieupAXgW3QuG6STssKv4hZ/fnn5z1aiEGaZH/97Ti+ABnTdttJSGurbTfcyy6iSQuEWo/j7v2I5R4cTpZclht1AypEkOBaWS7/HCJ6yjsG6j7CNBt1RqkVRabREGrkJKU2hKhkUBzyqTp282S2aRIkZ/CoP/8F21kaJNxIj/Krz4R5/xSPEX+KaSqOeD4Fj4yC2fnxmERzhBCzJMpn4UYP//b+9NAOw6qjvv8/bXq/bdi2zLuwGzGBjArGHJAlnI94VsQ0yYJDNZmUwgJCFhCQSYJJN8k4TgEEgCJANxQj4ISdjB7MbGxgYZY1uWLcnapZZ6ffv8f+e+07p67m6pn7rbLfH+rdK9r27dqlOnqs6pU9tlGHF8bNze//fv9z1wDPcwJM4WBIZzXvSiF9ma1WucZl9aSwZkNWRR5lBAvRLPmiga8QOl4lXNlX1SFjkpDIZUc42KZSaPW/XYYRs7fsQmJ45ZffyoOrkjqsejIobFDE5V+wpIr2iF7IAUXdkK5T4rDgxb38o11r9qrfXpPl8aFg2qG6x0lBJy5cASc/gsJQadbuE7YaoX8k+UnyfgbEoUTJImv1GYJ/HvNOH1XumwwIVPvdNpp30ib1DcWy/c6nWSuoDlwvAYoGNDnZwN5KUbRHtcMgUDA0K4xj2IniUg/aTx0DEIPX8yiAs48QtMb8QNoMMLQ7TR6EOIUXD0ENi/gwWGcoywIB0H9PH+i1/8Yl/BEacgwwPi43nwfuFA+jh4Mw/+nCB7RrChEiFKb9k3c91xh/LdsqHhAZnpVyhvl3qvk/HeZFURQiWp9I+EnolPSS8bIUu8Ca8ByjpW3OEf5cw1eS8RtICyoa7E73T4iJswoWCSciQuwibh6d0TJ88SSyGJg/e4Mk49G8gv4ZnjgN0oY4BV4sLdrZCkL51IQQVy8iQ46+zMT4ZGQeSNGJJNecSR1MVk+MqD+W+ehXXCe9AAvclHzfBP2lHwirzhQBKeq/9PKvprg5vk8WmAwNNvCm3hnPYSHhldxsbVoWSC+rWvfa3vvmdZLRlkdduznv1sn5990pOe5KsEUTB0XBDaOSnsZAWf0iKfypPzRb+bLT4lgF1TkyKqWmXsuE2MHbPGmBTLnh1WObLPxqRk6tUJxaN6I6cSVB3hCB5oF6VSkgm9qhOyNZrNvHSElEcmbw25HEvCB9e4G16zxQZWbLChVZutMLhWhcaHAFUPGPb0tRvEqTrAkKOccqE4kzIFzj0VgkLojnKACpVRB/9OC4qCsuZzzZSzD38pIZ9nUZ3wOqN4vQ4QVrRxf1LZzwDi6AbUMd5dEgWTNIgkc9wnjToR2On7NJy4Nj0RLo3084UCaaDwEG5xD70IJxovS6r5uuSHPvQh37vDcy8k0cFz3mGuiCtWDj0yvgPB8mpOdOZ35D+E4kLnwWvPNNJxn8w/f9bp1QleVxiEKHlll/xnP/dZe+df3mh3ffNOKY+c9fWX7FnPeobdcMMN9uSnPMVfieP+k5VbyX0C6lm70amCI/xxMacG4B88gj/wKcB98Cru4zn3DBEQFyAurGHKgPIhLp4lE91J2vhF+eGPpYIVzRBTckRLslzYyzdFRyfc2mFIrM0jaOIdlg7T656a4lsz7bk1KRhvC8oGacIf6ACcNoD14bxgN7zoTBaDJFYxcQYZyXBXohRx/A5LhXvOkfMNtHqHOhfl0WafcIKPXsD6feJZB/R4tkcJ0k9P8MnvOl6Mp1wZueDkjre8+c3eaWOlE20Imjne6U1vepMf+QT9wBc0yBppSWCyWhBFwKrDupRORpYNyiKDs6q1xo/Ykb077eEH77NxKZRCfdyaIwes0MKqIAzvMGQmhYRVRJ0Mc6yletVmhqsq8SiXL7mSQcHUmszxFHSvsskN2uDKTbZ67QW2ct35NrRinRX6V8mg0TOVL0oFhdOSVWMZdXBk7WDFBB9IhWRVcrpD9fB/lwpGoDyxnnkfPgLqTlgsXN3PrVxRRnvwu9nRrXyCFt5dMgVD3CSaNIJEKCcVPCGGxkljC0FDZfNG2X6nE078ItAb6XnBKH1o5xsT7J5laTU7aBFE5CGUStCBX7zP/BFmPqvgrr/+ej+aJARFIhQSHixGHh4J+PdIHtKYTq7NEYar/L3RIcg4HLImHnzBG/6Xv/wV0c2hmDT2rK1fv8Fe+cpX2C//8i/b2rXr/X2fu5AgQPA9EknZHzs2Yp/85Cd8uBHeMBnJKQacjM1zeASCp4HgGX7cs5GMVYmMO1NmbMT9/u//fl8cEjwm/lwusWK4R/FFeSDsmEvjFF7mAlFOzAVylh1ltWJo2NObCVDFqdF0PDj2hzpBPp7/ghf4ZllXlIqDcHEvgpym2KcyPjbmx3+w+vDI0SOunNh8y0kOw8PD03kPPhAP70Mbv4NPtCHywGcrWP7PUDO85Hglvp4Y7xE+HSfAf0bo8SxP5oTH2n4xSeEElAvnOcts+cAeowCeN9qFaGTO8vWvf70PldHhcOvFYyGMxL6smAxDWVIwKAvZvLpX52B0vx3c/W07tOs7NnH4YauOS7lIkZTzErz1SbcfsIJadZa4qyNR5GSErHFSeAIIxiHylSa30hFVhZeYlILIyYLpt2y+T/d9Uj55q9SyVmsUVGbDUjSbbMOm82XZXGDldReZyc/yLJOWTOOECSko9owxrAc8NWXLFYwzSfTxrM23+YCyp06rZjkvUSJRNxhFgH9+hc9ylLdf9e6sZS/M9WwuRBpLupM/Mkemo3FEL9KZozA0evyjMcyEiG8xEHSyXwUaEFr0tP74j//YD6ZEuUA7iN4Vv9ONngbyspe9zP7bf/tv/t0HeqL485xwxB/CbbHycQIJrQmSRjrtSNod951O/h5Ot7p/YOcOe8c7/sI+9enPqJcks1uNk+ND/CBLPV+zZp09/enPsMFBjodJrIhEuUwnoujinktGce60P/yjP7b3//0/uIC/9bav+2bHy6+4woZXrPT3PQ53es/jk2J3ZcG6HjV+WRwf/Meb7M1veYuU1aekBL9kX73lawrTtEu2bbOVq1b76brsgQleJ/GqDon/E5NTdtM//bOU46+o8/Axf/fmmz8vC3W7bdy02U+P8E6Pp/9Ix/t/+c4b7U2///v2sY9/wt//vPLyhS980baye/riS9zCQfEk8ShtrAxoYvhHvPzkpz5jr3/DG+y973uf3fb12z39byr94eEVtu3SS1XPyp6WCws57uExI27JgoKED3d981v2hje+yW688a/8/qtfvcXdhg0b7corr1L69KST9D0OyqKdD/037fib/h3P0y7CTJdn2+lZW2RNu+k0dPXeuxy8R5k8tOshH2ZmwY/7KVNc+d4RyvXyyy83zqTzZ4qhrneYWCdZ2W4SmPT3pRyqx2384EN21y2ftl1332aVQztsRW7MVhUrVqodsXr1qDVhfUHtr5S1fEm8FCtYOu+qXzz0zTkcw5OV4zSGHDyXn9JkiKlPio7DUfNSbo2alFnluNKeskK2auVCxXKZUatN7rOjB+633bKc+gbXiWI25pYVjbSUmqGiUpzwX063IOFM6lfiMW8gV5ApWCrwi98oZh+iVnzwljp4kmz1dE6kPhM8XJdwOpZCwaSFqTeQtl8IW/zTNOCHi7CdSIefLyI9rjMhFB5DFfRI3/nOd7qCQdFAcwz5hIIMK4d3UDh8OZOePCcOsBqGPAKeU8BxH24uzEZjJ9I8eyRf0nHEM66kfXLYE8lxkzzDj8UY/3TTP/mnE44dHxFvGlarY3pTqZPNe8wvvfCFL3JLLZmghkeUYSc9CRiS+vgnPuFr+OnNwieUN+PxQ1JST3nqU3xoyXnUJmw6Jt3QcOA7+wL++Z//2Xc10/OHxwyNsfwdwXD1VVfbKldWydBRlEeAnj7Ly++6807fGU8Zk96hw4f8TKfHP/4JtlkW0Yxox/n2t73Nz9FDCDHsRZ04JKuXuK+48kq7QNaDl7fCEz9DZf4pZ/mhUN4s5YSFHMODLLVlonb3nj2+ZP+irVtJyvkcXEgWSCRthDwfOHDQ8/HRj/6r71Rn1z57IqrqKKGQHytLZsOG9RKEej/5J8dfFHoSLzhxNzsIk2zATH6f/FJHDO2f3ov2G07Mzlp/f9m+/e277djRET+Bgfq0ZuVqe8H3PN+/9rh2DSd2cO5czYfQiAgLJifrI4/VUjtsx/Z82+6/42bb+a0v2NSRB6zcOGqDuUnL1MetNn5EaVWsWM5bQ38MpzXqlWSISFqKc/FgKXQ5F1TuPm3CFnw/fogl/LpvcaIDe/U4LVq0yKuYK4rPGdEh2SYll2lOWLY1JT+GZVt2YO8hq1cmrKwM++ZZXJ6TExRvwgVnizvYKHq4T3gaZcI1fd8JaGvfCtQFhsFcqcg/yZWc8oAfdd8X4cgLHpCiL56YA93KWcC7SU4XGZ2NmoTDYuHKc+7DOSPa7/DbG2fK4dctXIC0QcOkQaNUcCHQ2Y3/N3/zN74Ph28uIGhIF/AOgAbe5TeKhd7Wz/7sz9pb3/pW+6mf+ik/yDIEftDL3E7kNeKbDcQNrVxB0BqKJJD2S+fhBEjndB2KiqWuyZJdTlUeG5uwT3/6s/bud/+tPfTQHj/wENoRpgg8yg+lwgkLg4N8LCvJK/QmE9Up8KjtoPU7377HDkkwshekoR44XfF6tWYf+fCH7WvqeXOcigjyV/2kY4FTg+n/RVR79zxsd6u3z/Hs1amKC2/iObj/gH3tllvswP79CQ8VDycUJ+8hSJSm4ixImB85fFB0E/eUntFZEDcU8Jt3fcMelOXmNMhFmmnXZKLehR4nPUvIyK/Gkfjyu/POO0Tfbk+LeRzKBp641UHeBE4hfmCHlKH8eK9RT+ZPFLPtfOB+Kc4verzEwQnJ0BVLdvkdtEHrLV/5kh5y7JAErN4nzqrydNvXbrE7br/N46cq8n7wFn6RD+INR5g5HZnE6X7agenfoqntfDWb+I3jFUdGwk1K4pJLttrvv+kN9rrf/i37ebWdX/q5X7Df/c3X2qt+6Zds28UXSzBnRR8jBVL8LvgVh/idrY5Z9chO23/Xp+z+r9xkYzs+Y32j2211fY8Nt45YsTGmvKlc1N5qhT6bUlazzboVW+ogKpp8W4Fwll2mJcXVgq/UEfG9OcnJalZWkJzeQxcxIZ7JcAo4B9JO+RExmbracUXWVU2ySu0lzxlnTVlTNSmbylErVe61Yw98zh68/V/t8D1ftMoR1YPKqJ6rDBQfq+GoE84beEYxelP3jMpRP+K+0ymwuwDtAWF+ol2gOPwz6LiUfzxj4YqvINP9XO5MMV3m3y2AaSG0AY0eP65YLTfffLP90R/9kY8Pf/azn/WNS/EcRYJwTQRFogAZb2esnm+2/I//8T98vDsm+sN1A5QL6ZIO9/SKI21c5CHywzOEfVqBzoyoZjMhySdDKcSJAmEJ9nvf+z5XujwjHdJgVVlYc2wiZa19HIGf5u9cID54TnjuyQtKmCWrMXTCM1x0SMIBlBgWD9YlCovfPCMuHBYElkDQE+/xDERY8hTP0nFjCWFVzQXS5R3ne7uolboLJc5rIw+RN924ouAaZck8Cd9lj3JT7pKrwnMsCHMqWHhBF4i6B8gbPKRuYvlhGfKcdBgu4fnIyFH79Kc+bQelzInHJ3dJX8881u6q6AkQyQnyZkUSDKGa3NHbvnTbpb4J8Ld/57ftt1/3Onv5DTfYJZddrmcstJGAYr5FwpbNkIWc8pY5ZpOH77Vd3/q8PXj3l60xscdKdtzyjWOWb03I0QGhd04pSJEzlyKVkWmp7TbVwWuW5Mp+gCiHsjKMhcbkMxU1hZbRYpyr2tC1Kl5VmdDPDlgzP2A1xTFVzyisXnHBrbKQsuKwTJGp36TI7E3N+rJTVmgesdEj99uD933Fdt19s43t367O1IgSUJ1q1Z3/0nmeTyKDYvDI4ggfXbl1Jx5OBwzP5YfvSgUToJEDhAmbJD+snjPDDCxB5tsSIRjSAikEHu+y2oW5lle/+tX20pe+dPqcH1wIgXh3vuD9SBv6AOkiiPCPfKTzgF/87gbp/KIomPBmYQOKFiGWThNaAJ8XYEKdSXH8I45T0cFzNtYyPxXheZcrCySYnGayHT9AvnGh1PBnnoyJccou0kvTSHjojDwF0mFQIhEuEGER2nQW5gLvEc6XzQoICQQofygfPgBF/ErUnzt07+diKR34d91117lihZ6gDf5zz1AfCjQQdFLexMs70HjppZd6GfCdGR8GaQM6KLuvfvWrPocY+SVunwtIpblkQDgiyUUbw6BDK4ZsxZqV1j80aAVW7+U4WaKt+KVYpEUkqEatUd1rx/bcbg/d83nb8+BtNj66y+qyFrA8+BAdFpOXnOL3ISf94NgarJRWs09pDshxLRmnWmelSVqtnPkXD/icQmHQKpmSHau37LgUzlReFlBxpU3YsI3Vh22qtUrKB1cyzimTGSP6xEtPR+3VHeWP0ueQXpyUzPH7ZcneYrvu/7zt33GLsrNf4TjzTS+q3mDB+1l10nXJKrNEVSnWDke5whMcf3AwccsVUP1dh2ikCBJ6mHw3gY2QrFxhJ6w3PjnCIeip6NzTUHknPnzG8mPmWxAQ9ER5JxSLCxWh28ZLmggo0kWoco81RY88hBZx4x+CCcd9NyBfpIUjbtLi66I33XTT9IIH/HFhpSBY2eODcmVIkLSJBzpCSM8G8oQSgXcIWeInPhZIcPbcc5/7XP9NnOn8kW7QSs+epeNhZQL8uYdGjuZBWQVdIMIBhDTfH8LFc94HvMMGNY7gmAsId8qeoQji8HiUBOlgQaD83AqSP37Ey33kYWh42FebYQlHDxZE/WGFFfuOgvdpOsPBO1bOPfvZz/bPP1AnQKy+QhRRb1hpx0fKGGYEQW863cUH/EdAMlfQni+AX1lRSVtjGFD3vvSa4aD6pITxuLUq+2xk99ftoe2yxB661ayyxwbLshLyDCdW9L54gYIRjxPhTCr6ozhQaG7JqG1KCaAMkiP6qadYJHmrSPHUslIefRsst+J8K6/bakObL7fi6ossM7jVGqULrZbfYtXsGqvlyrJqVH7so2G4j7SkMF2Z6R66GepkbqZcnLL+8nHlY5cd2nub3fvNT9i+Hbfa1NHdooshWaxMPt9dE32q29DkMWB9cYVG6oxi9nzgBIrMHf8ldXY5Ykkm+bvFYtBDnBEvgoXd+HyThuXH/KbXTqMlTAiBdKNG4PA5ZlaIsbeFXjjCDMHB87qEVvQ+QzB2i4iDs87e9a53+XEz0ItCxB+hEnt2+M31TNIDxIPAYtKZw/FIC5CvUJ7kEwXB2UZ8coGJ6Mhz0BA0zQbCoJRQKCgYltFy0gFLu3/mZ37Gn5EOcZA2V95ByEIHzzj3jUUCHDMSfoCwdAKI6/nPf74v9QVpmoJPWAjEgZIKRBh2lTN8s1FKCsQ709Bv+ACvOFcv0k9EdlJnLrn4EleWWGoRL+GwHLjCNxQCp+Pu2b3HLaHIC/Ryz6oqTuSmrKEhHM+C38TNEBm8gBbAEBTxIMS50lGAx7FkOd5FZvl1KSC2JBPaCE1EoxSnLAEsFkQ1Q0/MUfHpbWtUJKEkfDPH7eADX7ed22+2qcPfsbIds2Jm3HKyEEoFhWvVjc8UJAekqo5mZEm0BbGLa90im93S0O8Q3RwN0xTf6rk+q7QGLFteb6s3Xm6btz7ONl14la3evM2G11xoqzZcbAMrNks39dskX3KtyTJpTlleyoW4EmWVKJdkkh6e44flWlE5QJs6i40pq0xNyPIa9xPF+/oHLVcqS6m2iaOT4ntnEtq5Jn8n7uIJ8Ly18+dPlqoMTxNeL9v33zWgkZFxhBNLj9/+9rf7KcgoF3qaCAwaffQWaYjRk6bH/eu//uu+y/h5z3ue93DpwcY8AmEQAoD38esWvA+dbEJjmOp//a//5QsO6IVy/cM//EPv2YLosULvmSCEDEKKNJmPIm4ccUeecMwb8HE0DtsD8ADAg1ACc4H4Qgm87nWv8/0QLJDgS54IdmghDtKKsgChyKAJ5cACDH6n8w4NKCj2kjAvxLN0GO4jfvyIE/BeGvhTH06FGEYjzjRo9GwAJV6cn5nVpgV4erpfs3atXXbpZSfREWGokwzX8vGo8I+6xn3kDXf+Bef78l6GagF8C/Ccs6r4djtWO/A4eOb/Lx1ID3nKXTIJnfDHy0N+VOdmjSW11KlxO/7AHXbvXTfb6L5vW19jxAazU1IyascNCXp24bvlwj4TBDQqpB23eJMoE8WTmVCGx8UHPnXAIojEesDiyRaGbWDlRbb+/KfYeZc+11Zf8lwrX/hUK553rQ1te4Ktuuw623LVM+2iK59tG7Y+wUrDm6zGAbFiGx2JZA6G4TGsGCUtV5D16GqOMqhWrCA6+zNTNiyLpja60/bs/Krtu/8Wqx5/UKGgiU4tFozal3yg/xHO425fHe2b6d/LD2etgqFhpd1Mfp2OholgopH91m/9ln/Xms82R6MNAZoWljxDSDFsQ4/+N37jN3z5Mc8CzBXQONLj2yFgI+30fefvme6JnyvLX1mGy1Jh4kTgMDTE3AOb80izrh4+acY73YJ4GEpBuXzwgx/0vBAnAjTyw2+GhBgaYxMpzxCMKFZ4lwbKfDYQD8KbKwocZU0vf3Bw8CSFQr54TvpYl4DyQfHSSYjhLWgHwXuELPMSvBvAn7DQSXjqAhPpKAHAu3HFka9T8TQ6LCHMCe+T6PrjfdLg6pPqigfHZkLeISzoV74vvPDC5NvpEpDxDjzlnk9a8H0hypr3Ih4cz4HzXs9YzUf9dD9ZQ9BBOOgbHRu1j3zkI24RT4qX4R/zR2eCNE2BtN9J/koOR14QQaRea9Wszu56Cdl8TjwqEn7Sxnffbd/4yidsZO+3bc1Ay8pSOq3JMcsrvnI2b3zWma+Blkv9krOy2NpDYQhq4vI5HFkPrazaNC7D0JWscVkXzHtIVVtTlsnazVfaeZc93fo3Pd4yJVkrdT5pXbZMXRys5iybX22Dm6+wrVc+2TbIuskPrrGa0k92/SP0cZQn16QtUZbFbNkKLVkptazl6+pUWcUGC2M2duRu23n/zbZ/121WHd+jdxhGxSJKQfEE27i2bzsA93DLE8tOwVDpws2FEChU3LRg66zQPKMRIURYCfXnf/7n9prXvMZPQEZY85xGSvgQJlxp4AhPesG/+qu/6vMzbJqMuHkPGkNIgBDEPI88hLDEgbjHEUenSz/jXcbg6b0SL3mOeLlH6UB79LLjnW6B4MZqQbnAr8gfgg2aoAElwKQ+c09p4Q14zjsuUHWNnv1sIO7gH1feAbwfv9P+KHJAPpnb2L59+zRPAOkDnjMMxNBSvA/9gcgL5U+vPoQ0vMOfKw4raEYLhvRwioc8MswHbZ4X9z5R1qyIo5y4hw6nJVXOAEXCMCNDngHyEB0d3xOze7f/xj/4jKM8gKet6JhzQvGvGF7hzx3QpD9+3/XNu3xIEGXtK9qEOD/tTBF5SueNKzTHb2ihn85PXJK0OhucWEyeWkycS9jWRmz8wP32nbu+ZPXJ/bZuBcuBpyzfUFhWgFX0vtiDAGc1WA1WyYo4WaTRFhh4C/kAI1QfWglffLWyOgPloTW2auNFVhzapOeKr5n35eN8QI3v+LTY18WO/FbJCqvOs01br7YNF1yuYH1SipIZrO2Gv/rfP2CmO8qIz3y3aiUpqUHRPWy5uqweTg2oHrXB0nGrTuywXTu+Ykce3m7NyoiU2pQUn6s8xdDmoRzF6OzjSiI4AS9+u0u8lh3SpXFWAeZHI6NxUYlx8QwBERWb3i4T1m94wxt8qImDGkMQpwUYQLjhmHRl+IYhMeYE4ps06XgB13AB7jvp6QwT6Yc/dOAiTLzP/EF8tiDCck9PnyEm7hGCEQe0dwPeZ0nyRz/6URfcER80BI8BBxD+/M//vA9jkYc075YSDI1Bb9pKglboRthTXvAuFEQnrYTDDyWDAg3gD8gvlmsotUcgFY50KA/QKazD4iQtwuI4/RcEb/tUjixI4Dh132UvEN6FlNKBPjoZKMJT8XtAdHDcDhP+Xoa5ZPMd4DdxYMHTkfA0VF9IpxsQX/AcRP5m8p+mW17q2PuKKR6zz8QlvcA38zPekx+zytjD9tC9X7NjB3ZYKTMh4Tzue1mSdcS8nLhMLDeeVi7Bn3Y5oCDkxVLlVlMdIimQVot5S04EUJsSbX1SxpyUnOHUAHbd52QhH9lh+3d83Q7c+w0pugelcJS+nmWyfVYYXG/rzrvCcqXVIqfPVZgIVxq0T1SDeOCJix6ll2kOWK45aNmGOqBSOmzKzNuoFXPHrDa1xw7u2W7j+3eIR2hJvkWDYx4nUS5EJjKnQdyhWKaRvl9GSJF9diGGZKISxxVQoWlICB/Gr9///vf7fAvDAzHU1ClsonEgoNmVfsMNN/hJr/TWmYTmWYSNhl9X75krLoQVPf+0wy8cPVDeISyAfuIlPvxD4HAF0MJQD6uMWExAOgChyTAImzvTVgTvxbvzBbxiGSvLWaE16CDNiBchyAIHlAz8DZ4sJaALmihHhrfid4DfDOExPEaHIOiH1ggX7+AQ3jzHD0QYwsNb/OOZg/t2GEBZxhCe86v9ByINyp1J3+Bj8C3oYMMbVhDzWsQVz4NmrA3mm7BmT6KlA1GvGG5jCJNJfxReHG4IoPPe++51BcPCBqexTe98AX1BI2l7/nUf/gFPo+1cFutRcIq8F7IFCdzk49H5XMPqU4ds74O3275dd0oYH7VStr2BUVWbITCpRVk+CHG1Q4kwdX/0JuXSdg4EPYA+2mtRz9Qha2LxlBWPrAml2ZLy7VuxwkqDA5bJUR5TVps8YLsfus3uvvMTds8dn7Gdd3/Vjh283+pSMv5hvr61NrBB9WtQFk+h3xpKspmRLMgy3Ej66phBiu5IWyZQO33240jGZEW5zK9ydsoy1RE7uu8+O7zr29KrB/UGQ3ioLLUvX0TQ5ls7N9NoZ/WkLC9DnKgFZyGo0AEqdDRywJVNaigW5k7YuEdDrbcFOYVGY003BgQTJ7gyic8qMYbHEFKEowERP4oNgRENnUZP4yctFBgnAHC8zDve8Q7/mBr3rABDyWFFMUxHj5Y4ALREfBEn6QRdKJgf+7Ef89VMbOhk5RbC4+Uvf7l/wAxlE0M86TjmC2hgToMl0KQLXeQ5zRtWZEEDaZIOdIZQWypQbsFz+JgGtIZSZo9SWC/BSxA8wpFHFCvPoj6kwftRTp3PAO/gIm4EpmJ2PwQAmE5DvPKhMTnCE1+ky8Q/FhCKob+PI99PBjQwV8iw4Fz8jnipDxx5z0nelFHaqvIVZY2mz+FxSChLlrsdIot2RLqkE34zKZvgH36city0uhRN0kOXHLVWVTTUVY+ro3Z833ds3847LNc4bP2FKctL6Mu2cDoZGK/pnbpcQ/xmabJS5am7dinLibfk1UV0Yt0g3MPS8Wd6t8FyaNWZbFEdNTQfGyDro1YZ3WW14w9YQ+743u12RK46eUi0oxr7ZO2skeVznjTigNPUyslfGYESlCBSKFk2rU5F27kykH+Ob8goLzm5YqtmjfFDNqI8H37wLvFiXDEwrF5Tfhn+pVPCb70oJLl9pFuuWNbLlE8HVF4qdAhDKjAN8a//+q99ZRKCn9OQQ4jTQwyhEQKIK1YLK5j+83/+z/65ZiyGaDjRSFBOOMLT86XHz3j23/3d3/l+EZYQf/zjH/dlqyg0rvQUuScsCobl0DTsGIaDHu7TDTRAnkgLwcO+G5QLAh4liHLh42yE533oI3/dliH54cBJTjZGIMLHGBIkfoQV8y4oXWjFIch4tpT1BrpY5caS7eSbNMmcBP6ADgBLen/4h3/YleJsIDwLBFiVx5lzxJPOB+XC6QTwfHhoqO0rtMNEeiiO/fv2+UpEhmIBzxDkxEe5EMcVsjahEz+eo2h8s6WAH465FhZuHB1J4gGRDmCehlMTyONM8OE10la8DJ9yWvMXv/RFL9tYsuz8yuZsbHzM53yuvuYaG6D33s7XfOD5kIt8xjVdFyPeCIdDELOcl889tNT9V+ffVQLH7R8/8oA9+K2bJeAfkHIZs8bEEf9gWF++ZLW6FIKsjAaCHK2EuJXVEJQrJv0p7fZvhysShcxK1UjC8xQV0NB7NVlLtWKfrdh0ha3ccIXiWikLR7SN77cDD37ZitXDNiT10aypPRSKtmLDFisPrRPtzKu0rDbKTv3d1pDFlc1JvsAPPj4mBZPJSnE7jUrcM6f7bM2aSpfTCTjaCHWYRXU2RaPKaHRsyobXX2DFgRWetSjL+Nw4S7jdezqD/svvImfLCdCc1PCzEDQUhD2g4SLoEHj0wn/lV37FLQlWyzBWj5AMSwThCaIh8C7C+o1vfKP94i/+oh9WiXCJxkOcIXxCkNN75jgZPkP65je/2U8AQJGx0gchw9ADwzfcM9zEcA49UGjjaBOE4y/8wi+YlPtJx9HgoCeAcomGyf4bhAtLpRlKYdwf2ngOTVxD0XYD0qDnz8R2IPJNulhRpB0KhbRDYC41KFMswSh/6ATwAOGLQg7lEvxAyIIICxjCpGzSfsFv4qGTEXMrDvKq5wHCAoa3fJ5Mf8TlVgI9XT2nMxNDUf5+O454N/hHnWMIEv7jR9mn6cKyJM/Up7kAT7xuKw6GVq+5+hpXKAC6QE2WAlYgHaAHduzoWixBJy5d76CZPFM/4jngSp7pjUu8u/N5C7LobNF/sqzG9j9sR/c/aHkbt2Z9RMJ3XEJKvFT8Ci3LRZ089s3g/INhxMOKLdXVWJ7mOSKvUmA4hHtmXD/H5D2h3+JhpurCHisj418slWuowynXmJDiOV6xQk2uflxW1SGrjO212hSnBpCWZElu0EoDa2XBJENkbqlIcZC8C3r9hq5mTsopp7zkJvScjq1yLrKzWEENKRfdFxkyUz6PHd5pO+7bro6B5IHyhSIkPFbM9KGx7QtInipt/7U8cdYqGBoRoNJSubFSWBlGL5uJapQLAgQhSKVHwBAWAUnjpUIzgcvyY742yaZJhDbx0khxhCFsCHAaJZ935dyxt73tbf7RMfyjEREu0ooGRmMjLsLhGKZD+WBlMXTGijaGz1glxDuRLnkiLuiPeEH4E1dYP/jxDuFw3QBBysQwvX8UTUxco1Q4GRo+wa8QJKSHC77iAvF7Nnc6mOkdrqSPoub4lKAhnsML6GYBAqur0u+F4g4+AuKC/uAZcQHCc0+nJK3w9aB9czJQRCyzdrmi97wj0hbm1B+UVaGYnBPnZZVTx0ZhSMe/PEl6ooFORJxqQBwB6KNjRB2njswKkef0tmnYLD5gjXNaAKcKeL7aEoorljQLOvgoWjeAl7iod8RPuWC1f+ADH/COFNY7lmKEScqL9FEbokLC1RWN1Wxq3902sueb6ugftebEMQn5cRsoDFg+W7LJasV3+idKA96qo8O1xf+J1dIuPTnqaKJ4sHRQRPW8lIasjIYLfNXZXHtY2Y+RkauKLvSVlDFlx5czC0qPAzIHRHeBNldVfLJcWnWl2yyoTPu93KBeWfA9MDlZIzkpqVZ78QH+qIFEYfCDRR4FWZT9ykmfegSqI6oDZdFYao3a4Ye+aY3RvQrLvB1xy/IUTa5uUFpi3onzz5Rjjx+cqNfLCUkrOAsRlZtNY1gPWBR8DItJ6gCNLQRQXGngCGbObfqd3/kdtyKwWmLYgTC8F42BNHiHRsJwGMuVUTLRI6bBR/y4QKQX9zjiCRAvfuxzYdPk29/+dr+Pd0KxAd6LvCA4gj6AnwuV9j2uGxAfS3vZmY/y/M3f/E13zGFx3hoCFJpIP+jgHfgWZYELHsd9XEHkn9/hNxvS8aTjQGEjFGNPDP7BG8Ix7MhwIvdBJ2G4AsIGHUF/xJ3mKe9TTyJsJwhDeMIh/Ol8MEeAUOAdFzpSJKPjYzYxNenH5yMBc6xSElykypLwYTL1Tvm9+bwt9qQnX+fDW+Qz0sAFv+eE4q8zoa8raW/YuMGe9Zxn21VXX5UIQvmLk67calI4hIW29CKA+SD4xpX2gJXFkUuMIFCP2DPGcUooGvKDU6ZEHkPTxUQxeBQTomqv7d/9RRs5cLuVW0etLGtmMLvCWlNla9YUtqB6pnQ4sDLf7LM8h1fK5aykTCm+9tlm9PqTvS9YC/Bw0pVMVSEb4n0NxZNjrw0CmuXRfVaSNZLJckqCXmlVbHTiiIeZquhdRVPK9osOKbZqQcoDuqlvKpMinVXKRXEpVVcu7JupiZZ6nzVqZWvV1I7r6jA0c3qusHI5WUANTnOWAmKBQ0ZlkalN2qBoHZh6wPZv/7w1jx92hVdXmCnFmwzqq+zkEkWGYhL9Tg0dh+WJU9TY5QsaMcIdYY+AxgqgZxtDYAgSGj/haKg0Ahoo485MmGO10CtHqCI4CcvzsDxCceDPElGG3NiYybh/CK14HgIe0OtnmINeLcKOoRp6/qHAAPED3iUOhtagnxOcUTLpXirP00IQpO8XCtBCj525KBYRsMgBy4W5F+Z65gJ8I08IkOAHv9MOf67Bs9PNA3GllQJlQRmQVqQbcXNlWAhLgDLFLw3SxC/oC2uSexzWI894F0uI8ptNwQT4ljzlyxAZSgIaYoMjw1TQyGKEoBEXeSetNKLjw/4dwvEu71EfoGnWfTkppOsK9ZSzyRjipGxDSUUZRNvArxuE0iYO0uUb+2wKxjKCrww/YuXTeWI1p7czDnaUIuYdf1eSMpOXshvbZ0cOP2C1yiEJzIoEMj11lRNLkF1MkaeGeErPXopDSoQNk/hhHShT7TBcUFy8o46Y3s82lXeWCddkcUhBoJBaDIXVE0ujmGdhBfRQ1snwG0kyp9XC8uFrmc1xhR9XMupYZtWBkJR3PrPZMpe3hqwLliBkC3UrSOfxvRsUkC9tVtTiuBz8VhJOJzeJi4M5c9IoueqIje3fYaMHdquMZHWqjAric7KYoa1IuMVg0ZWuSeKxPHHWKhgqK2PIrNZiohbBAyj0ED7RmHAIfhovPSuEJ58xpiHTqAkXDZ9Gz5XGgx8TrzSad7/73T7sFg2DMIBwDMcw7s+ZUwjlV73qVb5/huP7OWmZ9Jh0xlKKMXZcpEteaIysQmNxAo0SYUcaIQQAQqFbYXA6iPgRRghNetLkL/I6G9K8CJ53CmZ+p4XsqfIR4SJu3gXwhgMuQTzjSnykz3xazL/wDs+CfwH8EdrMkcVJABEXYXmGxUaZxkbG2VASr+AT8zD+9cX2WDn1iB43cbETn7mToCcQdS3AbxQkS+PjkE7qBrSw7Jr6c9Kc0AwgvuAz98TD8O+1117rfsRJOvCK/KGAuO8GkQ6O8mVuknoc+SLvtEXmzCgzwrMogvSm50saDLFO2ZHdD9j48aMukJyDDAe5BG07vDIs3Z2QYxPwhNyUXKJwOOuLQTfe98MsZelkODW50WeF2oD1VQatVOm3Un1Avf5BJS3LiD0qOT0vS8GQKKaB4mgyTM3SZv1uFCpWzY1aLXvcqrKsWtlxhUOx6Rn7cfIDEkYD1sgVrJZXvcpO2mTrmKyOcSmmKSmeijWy6njpyokCmVyiFEnH4coFqlGGKMamjR47bAcf3unfj8k0lS/nFe+BE/Ulgd5fxmL8rF1FRq+QiXk2jWG1UGnTjQuHkKaBYrW84AUvcOVC42WOgUYACMd7ccWfOIiPXhjfWr/xxhu9V0YYGmj0dBEsMQHOR8ZwxE+vH0GH47RgTgDAj3saNPFAPz1o0vQGJz+GGWJugY2C9KC5xwHChmAOv4UC8YXwAfAAoQFt4TcTeI+wkY80/xGsKGV6rwxlorQoj3Q+ZgLPO0F80MOKvc985jMehrQCPMfq4NQFrFLij3h4BiLN8Gc1GnHRiQjaoY/8MuHOaj2uMZ8yE4iJL0eyeIMVYNSNmOBHmBIXSoP6R2cGQEfQRJ4IEzxEgUA/SoW5JBQX82IveclLvAODZTwbeB9H3HElbuo/8TEnSfzEyR4qhj45Uw+/oGc+CJojP5Q1q+lQKvzGkWd+s4CGdgfH6g2GBsUHCdlMY8KscsT3mlRG91hZAjrbqiYf9XKpr3KWsslk6GhJgXDlvZOcwp1EPj/wRWCrDORkiLgrKOGclMGUqs5Epmi5FRtt87bHW75PbU3+MqVsZO+9dvzAd8xqRyyfqxhTLtVin/WvVbms3yqrRB0YWVe1yQk7dGCP2vJ+5ZGhOPFfcVR1bRSUvjKRw0JzmhOl5MucndfUKdGXUCk62zRn+fINQ5glG153npWGVN4c3qnH/kUChUreFfwVyplamMS0nOD172xVMBzxwdAYE59UcCp7CJxoaFRultWy9Pgnf/In3YJBgMSKsnRDB9wTB42SRsF8DsolvqNBnPRoeUajZKc/480IItKhAaF0GC7AEQ+Od9gVTm8SGvjOOzSQBwRv0A5trDiix4dyYbUY8QWN0Zi5LnRZkX7ayiAdaOd+rvR4Fs+jHLgibLD6+Nz0Jz/5SZ8nw1pAaCIkI9xsiDi5AsIyxs/eInrKabrinmW8rOxD0eAH0tfOe+ZNKGNW+EFPOk3Kk/L1TbZzKBi94BdWY5HPqQpHyCdKlB37lD0WBEoCfkYagGt0VgD8J59YuZT9c57zHH+P/UfUm8hXvN+J4CmOThf1CT+u7Auio8PSaxZzMAxK3NRL4purLGZD0BLp0mFiqTsKO+IjTxyIylwMbcb9EYgSumwoxPqYOviA7br3NmtVD/lHw7ItKSC9O02RKxgUifwkiJMhJTlEM+nrAbXETzImOL+m79WLllDPM3yFkMcqyWVsTMqmVhqygQ0X24aLHmvZIrxV25o4Yod33W0TB++3XHPMctmG1VU+DVkq5ZWbbcWarZYrrhWzJUOkZKqT7KOSJatyzpcGpYz6bII9PXl1GpQ/X47OGWMQAp2QRX3yOpXkIVEz/NGWpIzyZZus56w0vNZWrt0g/aJOnhRPhGIIkAvOqwLOn0xzbFmAsjlrFQyC+Z/+6Z98aAy6qbhBP71RKjYNk4lqzmaKuRYcYWnomPDxXjgUCWHofTNcxRwPCgVBT3gcz+n50Wg4/hyBgCAhTcIC4sURHgES6aL06EGyOgsLCWFJzxJ6aKjQgD9DKlgxhI240oi8LiQinTQ/0m4muCBVvuE597yPgEG58BkEltayQo75MSbnseAQlvCFd2bDTIIYpfWe97zHFRW8imcAvtIj55iUyEfE0RkXwA9gXWF9IJBR+qRDb58hzbA65lIw/vlhOcqLOYhDB9mMl8TNEBlzWli2DHGRdqQP0rTFO4D6gkMRM/+FYqH+wC/yNRfiOfEFf7knPjo4WGQMDXOlzhKeZ2m65oNQLgA6wwrHQidOlAtL+RmiI9zUFB/hYpKdusJ854Tt/fatdmD3ditmxizbnDTWTGHdTANloX/Mp/iwV6soYcpclBQoe2mg3ZWWBDRDa1JeXKctHNLJTVojMyVl0bSqhP9krmzFdRfYhkuulVVyqSKXwlAUteP77OD937DqyIPWn+V9UaP06la2Qt8aG159gRX7NiksQ+slG5Lls37jFlu3casNrtximfJ6a2YHlSodDCmnmuhRvP75YuVfNYAMTbsTCoZfortVF72yYFqSFwV1TKVgCn0cvMkoBx0RHPnVBXi+uYlYlg8o/7NWwVBY9BgRYDQQgKCjMWFJMBfCii+EGY2AMLzD82gQ0QB5j7x7BdAVx1g/55ahaHgfxYE/79ALZAUaPUwaPnFHHC6Q2unwm+fc8zxt1dCb48gVFGWc/UU64bBiOA6GXjlxkm7QHjQuJIg7aAbBy0hvLgQ/Ec7cs0ucRRExrEh+yRNzHghMhgsRRqdCOq/0jikT5sNiPiPAcyw+rElOEw46oD8QeeAa+QyBiAKko0Kc9OiZn2MhCELY680cCibiXa1OBkNlKD+EK+9dKGVKHeHUBYYH0/wF6XvS9rTadFPe8ZtwuMhP+r008Cfv8IcOEXHiiIt4okPFs3S88e58wTsRJwoa3jEcyFwRVhKKNU7EoA4DaMnnSVtKhE8H10bs/jtutvEjO21lWfVNflnv8ZNXhCc804U/VmFJsLMCjbPF1KKkYJhglzpSIPah+BchZS64VYNA9mctq+frVtG1mitatTBs9b71tuq8x9j5lz1VAnyDAivu5pRVju6yQzvvsMzYPhsQndYsqi0k9k+uOGBrVm+x4iBnAyL01ZaL/ZYbWmn5wdXWN7zZVq67xNZK2VAX8lkWNUA3akRXZadZl5zgIDZXBol/8o98NqSIWDmmR6KTobL+NRttYMVaPVdeFF9YPvxzp/+wvODPcgP146xVMFRYBDaNCQuAewQCQpvJdXqgMd8RSgDM1LDCD2EDiI/hN9bw02B5RuNGSDDnglXEeDjg3RAOhMEhnONZCDuuNC7ChlUDzVgy9Pjo4aPECAsIx3AZjZPhkng/EPQvFNJ8iPv4fSoQBnrJO3S+973vtQ996EPTfAD4Uw4oTYZn0mUyE4IO3sMxefwP//APPs8Bn4KXwRP4xCGc9PqJN52HmfIR8VNnsHThMUNiKBbm1CjnaUHcfmdGtNMpqSzpDFD/mHvjxIUbXnGD10OUaqSfvqZdmsbw68Rs/mkQD/UKEDbixVHvaDeUE/dc8YePAD4TnmfRweAZfrMB/keaxMWVdkd5wMPOlW8KQm9GN2pXHMe/9147IIHen520+uRRK2B9sGeH3rz/JRaAO5YiozmkVGottTsJ4Vx5SESUrdJSXUHZtOcwmlaSK4v+PqtkizahZ5XCkDVlYQyu59j9Z9p5254pZXGB6BiS8G9a5dheO7jjNjuy607LT+2zIfYuVWjXUi6FpJ2PT05YX54DL/UOtPjCANVz0YIV1MyssMLQelurerhi5TobPzZh1YmKNWsoj6wst4SXsMF5oYz5vV+bVtRz9iyxFK0hmodWrrWhNVsUd58cZacOSOpPZnKbn8TnES4bQM9Zq2Co/Ax7Pfaxj3VHr5iDGOktYo6zVJX8ROOhEUSDmi2f0ZD4kBcf9YpvxfAeoIfGycoIyPRKpbSgJI4QcNG7i/TinufEGWEZqmDpbaxoIgzxcmWIhfyc3EhPLWiWEkEr4JPTzFthFSCk8I8rjj0qDD1hwc2F4Dk84h5Lkv0UrEaKuIJXOOYTWHYePeWZAB3psgL8hrcswEBBMJTFpDjxkC9/R0JrNjDGzhAZNJRVjgxDeZnJcmYoCgHr4URr0AuC7qUCaZNPrqFIcCCu8CLaC4oj6I3nCwcEohRM47gd3b3djsjlZMkUmuxWIX3xKsNkOENU/Ik2zhCTEmD3PWeHtfJFm6rnbLQqxcBwWUn1qSArMa9rbtgyuVXK2Cp1+GVZFlZbq2+jrdp8tW266Am24cIn2soN11i+/0LFOejH1dTHj9q++2/3j4Dlq/ttMD9htYlxWSF9okMCPyMl0apYrT4l/qmDKOcHAOSq8p9UmISupu/JkeUpBcEQVx75X63Z1ESyIkyVpW2dCV788PjEb6y3muczJ2VZtOHVG21o7fmKW4pUv/2DarznvNG7zMfIDlIk/FtWoO6ctQqGho9gphEzaU7PkR4Twx7RmwKeybZAj9+z5RN/GhjLnumBM3wVjZJGRhpYLyg2wkUjjffScfObdONZ3EN3xAeglYlvhsQYwwfRsLGoUJTpydiIP67LBdCMlcH3djhzLazByAtXhC1KgB4+fqcSXLyDg2fMkzD/wvxUPAt+UA9YZcWZX2krrxO8E2lSJoD3KYMoI97HDxDW42u3/5kQYaER5FVfiI93I17SBUEvz+K9pQL0RdrQQ16jLuJPZyhNU/BnLn52D6XJkfSVQ/bwfbfa2P77LN8YtSJCUwLY++YIXTk/s4xlxygYvrufr6pnb3pb1oWUSWFog63edImtO+8yW7v5Uv+88ar122zVusvkLrdVa6+wlRuvtvUXPtnWn/94W7XxSutbeZGE/zqRMejDVo2JY3Zkz3bbu+MrNnnkHuvLHpeVImXABkjxCxXWykmJyOKqViZsanzMRo8fssmJgzY+utuOjTxok+OHpP8q6oxkrCCLShpP+qDP5/VaeufY4f1i6pSclKjy4ZUKdsu1L4lTedSlYDiEs54pWHl4nQ2vu1jGEavJyrKVUCsABUN4/Y9LdMyygte39v1ZDRpJNOQQIAEyGc+4TzeiThCOYSmEGfMF6XdpkAh6hlIAfuEIQ68w4mY8mjH9mOyMtAkX9MW7gKEYhlJYsQTwJxxDQcwxxfxAPIv75QJoQkBxUCbHhKSHX+AbecGxion5DRpdCOSZwHu4iAPEOW/xO+LGwTeW3caz2ZCuG8SNA3PxM8LMBhfcipfd8Sel344/3ifteH6qOBcDpB/0wLOwYigrPorGcDBL/llVx8pMwkDvYtW1VkPKojppE8cP+7wLsxys9pKOkTKhnOBV8FNX/LhIz1TUy6+oJz+4Zottu/o/2UWPe45tuep623TlM2zTFbjrbaPuN8itu+oZtvGy623dBdfZwKptlisiqGVlsK9EFlRz8qAdevBW233f52386LetmOPcuAmrVEVPqWz1rCyX7JSEek101qUI1XGaOGKTh3farnu+ZDu+9Um5j9sD2z9mD3zzP2z//V+wyrEHnW8tK1u2f5WVVqz1vTY+90IdcOUJXzvrgeo88yksOZNFxFfVpiaPW70mxeRmi8pQ//MmsU+vmiO6zqiWCU6WxmcR6FlRiDRwGko0YPxC8KQb8qmEDyA8S1cR6igJfkdDZEiMYRTiwRG/V6J2GtHT42Rejuj/vd/7PZ8LYi4HocskNe8FrSBoJg7mYhgKC8EbcbNXg1VZ0AEiveUEaIJvLLqIM9VA5Je8YKUxtMgQFOHh31yIfPJ+TPCjcPGPMoBXxM1qO4al0sOIs4H3celyiLRAZxmdCkEL4blCDw6wOIB8xjOQTmspkc4PdQkasTKxmv/gD/7AP1Hxute9zhevsLSccgSRl4VE7FyvTE5YozohIVT3Ax+tzuqxRJCiUBJORbul5878Cq5gpf61tvH8q23NtidanyyVXP951iqul1tnrdIaudUyIqRMSivlhn34TI1UTvnh0MvKQ7Kcvm4H7v+MPfSdT9roodutVXtIKXOyQ8MarZIUWcGqqqb1vOqMazdZtM28FWRCFfjOflWdRz53PMGx/vfYyO6v2eEHvmQjD9/lcaAsSLM42G/lgT7XkYkm8Ng8R4liaOcZ116YwDAaK8qmpsbEIxQMNPBm4s4WkKuzFjTaEFQ0BAQOv7niolGnG/9cDZxwCLGYC4n3cAxVMXkZQi38QaTF8A3zBJyLxpVNmpw0wGo0BCRh4l3ijkaPcqJXj5AMkH7EGYd2dr63XADPmLfiZAWUS1oocc98BnNkDGHFUuC58hBlFGEQduxFCv/0FYdVGcu5TwXCw8e0C54GjwPp+9lAGOZhFDE/puNik2VsuMRRR9JpLzVIO/gTecXCZq7xgx/8oN16663TZUjdZT8L5RTta+GgvNNL193k5Lh0Ct+jYcWV+FhTeghlKaAE8ptmFQqnZI3mgPxW2aq123wVWKZvs/K2QgphUP5D1sj0+dBSkyNc2JmI42iX1qg16wesObXTpg7fbnsf/LTdv/3/tx13/4tNHrtNKmunlQtHLJcdV9mJvvwKq7bKVlP+G3niK4nOPss1+qVgcHnrE3F9zYoV68csV9lnmfGHbOrAt23/g98Q6ey5EdlSFKX+kpXlmlIYvoCsbYMkEH1oHo7E0ZU5e+oR77EnZmpqwurqCHBkDEhUE9cT/y9njXPqFrlMkVYgACEdAgJHI+KabtzRwOYCYVmZFvHg8ONdhrJiTgahChCgkS5DDewM56RkgLBlHodeIsNHvAcIy3vR0wc0ZgQx+Yh0SZNeJs+455oW3ssB5AkFyOouLD/oC2uOexxzLyiYUAKRx1OBuMkzG1LZr8I7Mb9GOcB3eMaRJywaOB3epNMlbhzp4B+OeKLOnBIKTzje8bh1z7tM/CeP2wIhlUakuZQIOqhPlAE0Ul9ZNIGFSF2k3uMPrzkTj3KN9xYM09nOWHWq4nzi2yiMCtX4wFZ7ldVMYC8Iy5Qz2QEbWrnZ8is5GWBQBak2KVE2NrLfpo7tstqxnVYb2WG1ozuseuw7Vh3ZbhP7bpN18QV7aPsn7f47/8N23v0pO/zwrVYdu8+KmUOWa43IipqSolPZ15tWrdP+yhII6iwg/DMlScs+a+b6rSXHcf2r12yw1avW2IDqZEkKYbBo1petWm3skN4bE72qAy3Fk++zTLFPUYnKAssYqCeST3rGnAtAcTSVh4b8EltF9c/47IGsvFqFyuq8S7ij91i2TDzuSb2fZuyywlmrYKJnRQNIK5bO3zSmzudzIYRLNEIEAffss+DK+whIXDpuFA5DWcyX4M8QW6TH5DeO+PgdcRJHCEX8UGDxPBzhYtMaaQUNS4ngCS5NLwIIsAGSiX2EFI5nIGhm5RhzLygD/ODNXAgeEBdphhAk7yHI4Tf3lMvpDo/xXtqlyzENfnf6zYYoCeZh2PsQdFHeCHCsBPyCdvIDonzDdaKT1m5cGqRLOpQBgB54Bl/xJ3zQAZ2UEYoQt7BIRCmrqRDkCNpCX9kmlE6xv88qfNUSAeoCWE5B/Nwy4+BHdbAaCOyi5YeHfCkvS5QzpaLVxw/Yw3d+1O75+Dvs/n//U9vx739mOz/9V3bvp//cHvjCX9rOL7zTHvrye+3gHf9ux+/9mmWP7rXVspYGZVIUm1kpGdXNpoS/sqvUpWgkY6T4+qVgCiIJGd5SXWkMlKywYZ2tvexyu/BJT7MNF15hfcOb3OKpN2SdN5KOT23igHjK+WNSLJkBa5SGrV7qM6lwcUDtWGnlGnJkLcNpAQ1ZS0pTSrSI9cVx/ZxhVp/0I2n0wzKy8BjhK6K0WjlZVEVZVsnCBz6othxx1iqYxQANLIQ49+FocEz+cw3QIGm0IYjoWTP8w5VGSUOOeFgBlt7cFnFyDfAOfmmrhrDQwyopkBZOSwnoho50utBKHhlOZFiFTZUIpcgzgH4m4FkcwX6TEG6nUga8z7sIfwQ1px3Q80YYBp8Az1lajAUTvH00AD18PRIl8+CDD9r/96d/av/l5/6LveKGV/hGQ07hDqsWwMulppU0qT/BO3jMvGIcqgm4Eob6huKmPvPegsOrBzZHQov33PGBJXJ+bcMpcy1Dx0LvwDf9a3gdU1vCNdSpqY6aSahnx3dbRhaMyXqpH7rXKgfvscrhe8zGH5KiOGp9VrOBTM7KcjkOwa8zvyHLiaXFDIG1+iS8UdBjiluWHSNdxRUS4kM2JWVRXr3FzrviMbb5msfY4f0HbP+hgz7/2KzWUBtShlIO7JSsS7nwGQQUgZQXQ2xNvirqlofCEVoKNAF5OSFb+C07VzRg67SfuZLVb/10Ryj9J/WiPzoB6feXD3oKpgM0shgGQwiE4KIXih+Oe4A/v6PRMtnMPAMKhTAIQxQOx2UgCImLsLyXdoCGzBAFVwQnIG7u2eAJQsE8WghaAfmAvm984xv+GWgUDcAvBChXVncxPMYGSPzIA1fCnQqEY/6FTaiR9xCGvA9v2TXOyQ1Bz1Ij8ssqsmOyNPlkNsfkcMTQ57/wed8XxJE5//7v/+40UieiviwloBMX/IO3LLxgQygWIB0gFArDmViclBkdgkXhqSsMevL6Q1o+Qjji375NweuU6M9yLhdjaqCdLzHVh9rgL/tUEmuaIaaqVetyLSbuC3KyJlqDiqxfVoeEvEwC/+iZBD5zLMZJAcSXGdWtLOjBFTaWHbR63zrbeMnj7OLHPc0GVm2ykf2HbP/eXXb8yF7pkhG9XfFl1nyfJSurp9FQnnwTpNq4/Jhbyol+V5CuHtrOf6cBL2arH9ApdL6yjNFTMCmEckEYUmmp0KFgOGiRFV0IuhCSPItwXJlj4GBN9npwRAhHynC6Mpsz2UND5UfxEB4HQjASJxs7XVjJxTN6kzR+EO8sNaAPWtLCHRoZumNpa0zA48c1wqFoOfGAlWPBKxDP5wK8wmphXodhJn4HgvfseWIPFD3xUECPFqg3WFtMlmPFIAvgB+XNHicmzdNKOHixVEiXX9xTz1kezxE7r3jFK/x4JSyun/u5n/MVk6eyNLsCVdiVCkpEdX9aaPL7xP2sUBawZHxzIlcpGtc1tCk94+NfKKG8eM/HwAqFouUKUkj02dQJYHVYtVGWZdKnezmTEuVIFxQMR7Fwr4gQ8bVs0cZz6hit2mobLn2cbb7yWitI4Rzat8/u2/5NGxs5ak1Z7SWVZUnps8w6K2uIBQtUx1b7FE7Ig/N+beeN/0W9/kcB8ccv6jB8cO/pMJy1lpzADLeS9xP4U4IuW5y6pX+XAYGOQMRyCMUBUDDstud3DPWkBQWNlnfYRMjyZL4KyfLP3/qt35o+LgSEEAYhKLmyz4MlzghK4gqwqzwUHu8SFreUiHym+QGYG2EJNgsZ8A/BFcN8nAvGrn0UAM/ScaTjmQmEY46HoTcEd/AkzRtW9sUhpqQbAnQpAZ2UGfnBAmWvDkol8hvL3Rki4zl15FR5XyzAH2ilfKAbx9E9HI8TX6BEwWDVoLyhkzCLgraCwJpJFEvageRZGhySyaIAvuvvn5r2MO13IHOGeBKRLOuGuQ8JfpQHlkyTxQGZVfq9yiqNPpviZGRJds4SqKKEbMjqhfW2YvNj7byrn2Ybr7rWMuW87Xlguz1w/11WHT9qrSlZLc28lTN80EztusY8Ed/7ryUKgU07ijMjS8bPV1OdiEl9CHbFMa0e8E/yhIJJQlGf1TELMe2WX/p58nbEsBzRUzApIBRoWFgbXGlcIShomGxGi2+H4JcWFCHcGGag0XIWExsL2d/CsENdPXDei+G3iJf3mFtgCIWeOv6khT9hOZ2AoQz88eO61IAPkT/uoQ/HhtQ4Tif8yCM0olDZXY+S4XmaV6cD3on5l1gwESAulC3zOqRDemnFvZSIMgSUPfXGeYAwFF0M43FFGaJoHw0aQXROgncB7rE0GWbkVAzoZEUe4Zairjk3ZpSQM/MpURjJ1eclJLhRIH7Vb1dCuod2r5Nqdw3ONuOZ1aRQqsZXJgeH19u6jdfY5vOvs/4Vl5iV1thkpmATslrq5bXWv+ZxtuH8Z9ilj3u+nxLQatZt/567bc/u221i7EErNMelXDJWkDWUrw1YRteWJH8zWzG++5+Bx5hNvlBB9IkWTimA5kQPolxQHlyTnLnzhzxuP/erGBSaxDdgKq74KRf/L0f0FEwKVEqEBHMmHNmebogIeyazWW7M3hTCIlhwIWBplNwjVLhGowYIHYCiiXfjN+ds3XTTTd6zJP1o2NyzxyMOS8Q/vQhgqRB5IH3ug5bolZOX9KIGwNzLD/7gD07PH5F/3gt+RZyzASuAHeUoXdKIeHmfuIiXOS+UN3Gly2qp4ceJqPw3qyOABYtVBY046gWKkKFC6kUo4UcD0cnBcR91MOoUvynX4PWi0qkyk4zlxn+SYntEaVZQZTgsMsf39KHdx8Z4kDi/6D//Rn5eTuFyuuZz6thJqbAzvinFkC80bM26NbbxiifZlsc/z7Zue4at2HC1tfo3W620Xrrmctty+XPt/Gu/18qDG60xMWkP3/dN2/mdW6w6ttMG8hxrM2F9SitfV7x1tXe+jpkvWasoHrI0jPPrcCgMKTxfnuaLCWKoN0QvVCdA3UxzQIoJxRKLAvjtcAWEfFBbTDz8b7kictmDEEIKocWkfAiu8Md6YcIWoUejxEWDpDGG0OQ3DZjfoXgA4UPp4M+7KCu+0sgmN8KFwCYcPcr4SBrP8EdIRXxLBdLDRV6hg5UzITChNVaQkW+G9RgWZHUXeQ2+nA4iHRzDhijfzvd5Rk8b3kADOB2eMKfDu7G3iHegH57zmyE5/CIurii6OSHafM+Lrii9l/34j9vv//7v20t/5KV+ZP1P//RP+5dXmYtjLo16Qrzz4clCIa0wqFNRr7mHnsg7zgV4G+khv+BbuPngRF0g7pz19Q9JAbB5Uj4Sxj5nwURKizAn8yf5xLLKS1aAD5G5wJYfryCUEbxt4evWSpte3vFhqRrzIwxji34bs32HdtrogQdlafTZym3X2VVPfqld+5T/1654/A/Z5U/6fvfLFIasPn7EDt93p+2//xvWOL7PivXjsljkGlJULVlDUhpQUKmr82d5m2oWLN+/wlp58RQeYj2J3nqVTxNULO98Vf0WrWGh8H6ok8QKow1QR6QY+RyAnAoL7aqwbeh9ddV00f9ttxyxPKl6lEDBInzogSIQUDT4IYRoZPTSmXPgQEcmbkE0GpQHAoorv6Mx04hpnAjgUA6kQTiGxthFjaPh8px3adxc+ZgZ1hS/o4GHW0pEmpEX+AFvGP6id05egkbCsArpWc961vRc1XxB3uE3w2NMjBMv8UcaPGd5LUOR019JbL83F+Bv0EgZsH+HFXDvf//7/ZgbFi2gbMgP+SUswncuIMhYQUac3DNf9uKXvMRPc7jxne+0N7zhDf7FU+glPsqZ61KX4ekg8gsfoY8ygBfkDT/qa/CYOoCbNzzbKq+shGdpQJ185s8YUlRnjm3u6AQJToTudK8duBc9dyKIK0hf0/eEQQGhYNQOmzkphKwVmPNpjdvk1F7bvfdbduiBb1qzpjZX2GirNlxn5219ug3JgmkVZH3WD9vI/V+z0X3brTV2wIpSEkUpqoKUSV6KI2tTsloqEvwV34hfy3AA50rrW3We5Uv9okLpZyU/6hNWmxoVWZINKCWn7WSKfSDMf9DW9Nt5wkKFfusbGPLfyVNcOv/wCcWTlMtyQ0/BpBCNB0HEkAZLNUPoA64IJr6kyd4GJrlDYKBQYq8LfjS+EFI0UBYP4MdvBC+Wywc+8AF717ve5TunUUA0aN7nPY6lQclhxYB073OpQb7TDvq4MsfEVyT5XAL0MpzHnhesl/jwVzcgfoQ9CoAFBOEXQAhiJSG0XbDrWbi5EOVCGbCqi3O3+MQy3/Hnm/FYHiy7Jm+A+E6VB+KKdAnLZku+DbNR5XaBLDg6K8zLAMo2LIdIYzkA+qEH+rhGnqGT/V9Y7tRX6j5hyHM8nz/It8ROpmjl0pB66Ey2YwmrAyFlg6JJwnTyJ0nzZISgbV+R0NNKKKB7xen7XKQF2KuSy3Ls/kF1XrbbgztvtWN7dlh9jHDrRNp6p6cy9rAd2v1V2/PAzbJ0tltmYsRKdeZcSlIuJctlVO+yUjCFSWvmx62eVydUFkcjt9pWrN5mhbKsH47nz9GhHLfK5DHLNKSI8GvT52eVhRKFdP3HVysbLG9WXC3RXCoPWH5gpfxp/4lqSt4OHvE+8XTya3ngrD2ufzEQjYwGxPwHvxFyTDanhQ09OYbJEFb0WJkkjZ4f73KNnm/08vDjHiXC0A/nlKFcOJIDfxRIKBE2ubHUmU8900Pn3bQg7a5hdw/SB+QN/gBoZp6KFXdYLHzJkKXZfJMHJcNwEb3fuRRjxNsJ4mb12D/+4z/6PhjCpQU5AhsLifSCPxHXbHGCoJ84OdDxwx/+sM/zAAQoZYpCQGESLmif85PJoom9DS6k9U6UTVJWJ+gJ2vmdvp8Ncz1bDJAefI906fCwqpF9PShjztLjyB7KHP7DH8LOm04Pzn/iW3PcRg8+YJXRfWbVcStIwdTZ3Q8PpSg4MJJhI7jPEFBLQpaPijULA7Z68zbrX3OJH9kiwq0+dchG9n5TimKf5eoS/Ahc0cjqMWjN6X0EuP9xNllGnY1WXYqmYZPjTesrDKnj16cyrFp9Yp89vPtrtuveL1t9ZKdlq8csL1oKsiJyLbXzVlFKStZ8pirLpW7VbM0qsl4qmUEr9J9vF1z2FCus2GD1hjqeem/84P12ZPc3rFXZJyXHFzuLyj51C6f8ihYfIvNqoXiV4UaebaD9/smBtec/XlbySj2CGwkYVEuGxpJfztIlrjOnAnWjp2A6EI0f4YLyQJmwF4M5B4QHPCIMvTlWUPmehzZQSghWKjRhCItDqeBY6syZXRwmiBWE8kJpRVjSJA2GVNiLwBAQv4kvGn8ISe6XEtAYyhPHb2gjvwyTManPhj0sGfhAvk41RDZbHlBMt9xyiysAlv2SFgi+Mv+CIsOCSiswns8Fyow0Wf1GGWA58k4M8fEcAUq8DAFGfudSMJ4m+YDGNp3TV+CPko5B8C4wW/7BXM8WG9CKQmEoGCubxS2cp8dR/vCElZGUO+FOxfOZ4OyRyzQnrCFhPnboQWtKwTCE1WLugcl7X5JLnW/6cSoIVD6BXGfoqNBvq7egYC5W2KGZFQwJqX7KXtWFo1+SIcxGe9UZRepzJEJlYtIaSr+YnbRM7aAdevgu2/3AbVY9vtv6mmNSKnzDRWUn4d9qqr4xJKXfKKq6lEtN0UyhMEprbMWabbZ56zWW6ZMF01LatYode/huO7b/bsvWD0khSMHwgTS5FgrGFWldcSvfTjWKS1Yk8eeGbd3mq/17NtmsFKny80gFwzvwC5c8Wy6gDvcUTAo0HhpNCHWGvNg8ybg8ygRlw7MIx+/4lgaNEIXB0A7KiDkaesRszmT/DJ/75Rh/VovRWJm8RrBh6UR8DMcx78KwDVYBNAQthEk35kejrEgTBx04aEZxQiP5CAUJgo9zYbY8wFfmpT73uc95/CCdJoqMDa0oYIAf/DlVegBF3am8gq9csYjYIMvScMI6/+fgda1t1fIuAstDtvmUSNET/Ir8kmbwcjbM9WwxEPzjSv39xCc+4XNTdKBQvAxVMh9GvcZChT+nysOMEEuU/YQ1rQkr26gd2XOvLJhJa4mXyddDFSfLcdsKho32CF+3YFzBYMFc0lYwAyK+LgVzUArmrpQFo2gUF+rEV5WRpOLiD+2SNTo/skaaUj42ZRNjD9jE8Xts9PB2O7TnbimX4zYkKyLfoP5h8ShCRcJ4BENXitQ4CaAiK6VV4Gj/kvWv2GSbL7jKhjdf5IdiNqRgGqNH7MAD37DJkR1SlIdl0dSUEykYrJiUgsk6U+hAKl4+m6z08n1rbOPWx1v/8EWWKQxLoan+wzjnhv5QMKFxyODSVplTgrpxQmL14EAQxCGOCE165uzEf+lLX+r7GFAKMC6EGr9ZrovQ+ru/+zvfWEl4Nq/dcMMNLgh//dd/ffpLjxx7wnBMWCQx7EZvn13p7KZm+AdhHWkQhsbPNS2olgrQEddwCH7ogG5oAkEj/vCOPHYDhmdQylyJn/jgA460LrnkEl+hxm+AX9qSmQvQjZAk7hCo0Bl8hm7SxC89/zYbPF3xo6Z40/llZRlH9gPqCM8inUejDOcCtEBjupyxtlEoad7DG4aL8Y/5mO6BEilafsV6Cc9BOVm9CE1fKSUF7L1zBGiSBgK+KWmK9UGp09/nfx9iSsS+/pijkBPNPOGsr4xvdmwf3SLkpaDyVvRhqnxTri7F2hi1weKoNSZ32Pihb1lJimAVRsaUylTpoBKIE6slk1M6eZUjZpXKV10QXVnlNWjlgbW2au1Gs2LZKck3a1YZO2Rjxw8YZ5NllZeCp53ksSXFwqeWyVurXR18hZz4qtpn2dKwFQZW6Zksp3Z9gRuJa5cVP3jUfn+54UxqyDmHaPiY/1xDcPEhMHbns+SURkYDRDiFsA3Q6JgQpdeHZYMywfJh7JpnCJgIH3GTDgsA6BWinH7oh35oOg0EHGEiHP5ccYuByA+CFhfAD9rT6UILwI+8hLBJ0xh0z+RAxIsjPYQc4LiV9KkGxB3KgDiZ92H4MuLhGu/OBd6lJ471GEo+AC0oFuZg2HTI79OJEwqgzctKV2jB4iEtZAC0wxPC4IJPaQRP0m4uBN+4BuAN9HINRB7S4WZDWplSH+FF0Mv7+JEPrHmGQD1/pwHeTafPne93UVriuIT1Ktty+bV2rJ61qgQ4E+M8yUkY5xtYGEVruOUiNSLBXuf0YMWRz3NsPzGqjOTvVoZUR1OCmasrG3lnahLU9T7xRXHrd70u3tXUqaiKL+JNVoGyDdWtKeW11m+5Vr81q+psVMesmZ20CqccF/KiLW8VJcwGWuMrl7K8xquH3BAZb2SsPLzZNmy5xoorZVU3JD/qKkdZUkd3f8vqo/usLB5kK0UrtFRvm3xSWcpS8fMp5ma23laKqjeFjPSa0mytsKH1V9jwuousVSqLX7J09BaWDsutfdk2K9Skq+oqCni6HNFTMKcJes2/9mu/5kfAsEsf0CDTDZpGT4OOxs9zGi4IYYUfjZb3cIz1Yx2xV4IvPoZQpnEvNUIYQAPpc09e0oIYYAVEftL5ny+CR2kHUMooAn6jeEgjBDNDWJxuAF95PxCCcC6QjygPwkb6AeIg36SHMA1luZwQ/I76AX8oD/ISflhn+EN7WnHMhjQf4BHxYE3H58EBcVLmHC4aZ8tFHZgvPCX+Q0mUh2xw1RYJ6LVWaagMcygHyhF3YogFAcqCCoa0crIDmlWFQOIjaMUT9sWw+qqO07tYO3wZ2T8eJsWVyxXlUPRyqt9svCzk1GljE6aeFbJSoNn+5MrvfEtXWTdKs9CSpa5UOYG5qHwXGHKTwuHjZpN1KYv8elux7gobXLtN+VmnwumDAqsd22sTI7vU+I+IsZNuTTX4RKauCQ/gHx05tS9lVyVoHMRseSnE7JCtXHuhemxDls2jYOQfbGk7yo3aQOvsvhUuLnoK5jRBg2VY5qd+6qduwiMyAAA3tElEQVTsVa96lb3whS/0cej0pD6OexxAGND4uSK0EViA50xUs+ub85/e8pa3+Lh/PKOxE9ejBa+4NNp2frgyLs9iB1a9sQqO5atYZWdKJ3kNfnFFaHF4JnEHH3AhAJl3waIMYRr+8LdTEXaCeAiD8iJ/8S6IewRyCHH8KPfliuBL1CvqGogVkOSVMOQn8jQbgs/wEcdhlz/xEz/h9TI+Sc3iE+o+S+fT6XYD2OpLkpsS2gOrbO3aC1wwZyTc8faDMDPwnp67OhiqZnxDxT9ZXJe14VMjqjfMh8iCYFVWJqPOQ/uwyjrzGHpUz9Ws0qraVK1iFVkt83GNSsP6qlnrlyvXpGjYrAnddVa7DYnWLTa08jF2/sXX2wXbnmb9ay9OlIusombtqB3efbeNHd8jS2rMGq0pKQrVP9+YKXJRngzhSQRzxD/0t+RqssCaubL1rVhjq9ZtVCXEXxY6Q3xeRckr7UUdsuSXI67LDRk1oFY08GhkPcwMGmw0VlYgcRQ7q8IYCmNcn/Hp2A3eyUsaLb1vjn2hwbILnb027BdhuIfGynuURQiDKJelQggj0kWwQjO/USiclUZe+aAaK60Q8hyKyGKEEPbzAWmlwW8cS4hZos0wGXTAc67BT+ao2MTIkE0nCAvNswEBzKKL17zmNfYv//IvnjfeAbzHog4Oe2TOLL3Jll5uN/AcnkaTmk+7QwEHP6ANGuF//CYfXAlD/vCP+OdKh3jgD8qJe9KJs+CYY2TIjKFDrPfgG3WWdOYCcYFIm5/UboavckxuSxBb45CNPnSH3f21T1i2ckBC/Jj68lP058U+D50MIUmB1G3Q6vlNdukTvtdWXflc9fBXypKZtMmxPXbv7R+3sYN3+0qwTKsi+orqqKhN6S8PH5yC00de1lKeTZhYSTnRyhE14kOrMCB9sNL6V15ogxsus8H1F1lxeL00+6AP1DWrIza1707b8Y1P2tjhe6SYRiwvC6acLSkrKhcpiKby3kRLYmnpd65R8nmXaqFs1dJK23Ll023r45+ndNZbraX09IwPkWVQUG2eMjfTkDKFQ9TQpZUWc4Ny97rXUzCnh2jY0XhxjEcz4YlQRAizd4N7Giq8hMnBWywdhtk4ggYFgwVDo8URDiGBUE8P/SxleUSaUTFC0dDb/z//5//YW9/6Vp+7YKgEIcZeHRYyvPa1r/UNj2cC0sTBYxQZmx7jiBj84Q18Z//F//7f/9vnwvAP3kaZgLl4Bn9Z6cdcF+kQB+8C3kf5v+51r/Oj6xG08MCFd8KaecNfO40inG85QxcgP9Q35v245+NurHqMDb/kD3AljeBRJ6KssRqjPnIfSpxyiTIA6bjnUuggwkUe+e2xyDsnxmYqo/oxbg0UxJf+zQ7u+rqVc8elEMYsLyWBgomluI1s0WrZAZvKrLVt177I1j/mhergr5GlUVOoSTv40F02dewhWTojSqdqRSnAquSxxLfiUgwJKacNTkjOswaZpc1Ztf+CFE6feFtaIVN3tZWGzrP84CYFFJ+kfFgcVq+N2eihe+3g3Z+xww/dahkpzzyfT65LeedZ8cY3aVCWdcUpOeH5k0XGJwRMeSuvsMzwRrv2mS+x8tptUkKrrcJihGxZPMHaoeyTciBnKBhx0ZXLzKX76CDqXE/BnCaicU0LHfEKJkYDQqkwcYzSAenn3NPbo+FjxYS1EoKRe64RN/68w/1SIYQWCNqhCQH2p3/6p/aOd7zDlw/jD/0IHTY68ox9Ed2C+HCkybAbu+n/4i/+YnolXwBa2GPD5kusJ3gUwi0EJHHMBcKx+OLNb36zLxunzNL5ZhiIOTZOUEiXi2Juh5gfvGacxqunojsN6hdKALo+9rGP+crF7du3+zM6L8znccgoz1E6UVZgNmUQ9TDqHwi+cIUP8W6UF+FBXGcDYUHkUW/78l3izcPZpqyUqqz++lE7dM+X7Tt3yopp7JOsHpGblGoQbSLFh4+yOauohz8pobt529Pt4sf9gOWHLlT+GNZTB61yzBqyHvIZFtTUrFAsWF0WQy5Dz3/+Zegr0BiCkxJQ9wcP45TkDAqFZc5NuQLfaoJXFWniETu4Xxbf/bfZ1J47ZFk9LFqOi8ETCtKwUn5Ql5ziUt1i+C8TCkb0Nfv8EwGTA5tt5YXX2NVPfq4spdVWz64Uv/osz5E64iFzQkl6XKV0l7mCWU40LWvQkHBpoQ8DYSSNhUZPT555GjYeMpzAFYcf8zUMLcU7uIgrCiMaMf6nargLDdIP2kBcEVLsF8FyCQSdDKGEQp0viD+EVwCBz6GfEWea3/AXqw8+Bng3TW86rplA/lhqzkqxzkUCWCz0/nHBe9LmneUEeA9NHFOE0mfDLpsiUTL//M//7AqH4UVAPuBpZ73tBM9CyRB3WCzB0+AD5RW8AV3xRixHJOYUja/IYia+VRYRQzZ84dW2Yt1Wq/t37Fk9xvAPaTC8pfRlSTQkyDmiZXRsv00cf1iPpixXQG1J+LKsd3Cz5QYvlOLZapn+Cy03sFXuAssOzt/Z0BZrrdgkpzq34iJrDV9szQFWdclqKa2Scil6+tYakRH2oB2T9bX/O1+yEVlSzbFD1p9VZ0yO/HKic0b5QblCLUNjuGT5tXSQeFkXL4qyXtaff6VlyquUTxRZsvpQrE+BMtBLehcOJSpmeWJppdg5gGiEAQo/Gj3gGg06rviFf4SNeCJMGrMJS/xo5LjFAPFCE0DgAAQ7q4Zi4jieAwQ1Q2VnCtJCqGHBRG87eEOeI03mrOJomOBjhIswc4G4Gapk4poNrel5HOZc+DhabCCMOGcqh050lhf3KObgIYg84n8miyMibpTKZz7zGVcgxIs/9yyQ4EBWAP1R/06FCEc88JYrPOAeUDfS9ZQ0yRNpRt4A4dKdkZkANZCUxKcbWQSZ/JCE6wbbfNV1NrByszWyAxK4fMu+YJVq01eIlWSN5aVimM+YHNlne3d+08b23mOZ2mHFMi4nZcqchmLNZhS3WOwzFLQXTl+ep2u2KlZvjVstMylapNwUZxNH2elZKzNilSPbbf+3P2733PKPtuOOj9r47lutVNlvpZb4UamKUVIAeodl2TUmnjhRQEqnrvj9xAK5JnwolW1Mj694/NNs5YaLxBaGOctSxEUFoXNLrkBcAygX5EF39Wmx0dvJf5qAN2k+zdfN9B6NMRoyv7lPh+tE+M32/ExAfJF+CHauDLFwOgHHq7CSDD8EHBbaL/zCL/hKuFj6O1+k84sgw1Li7Cvms3gGf/AnTZTZj/3Yj/nyWWgKHnS6uUB80IqlyXAYK9IYduPEag6+fNGLXuQrpAhHHqNcTsVpwrL0FZoRtv6O3uVoeSbIIy/QTX5wp0tzJwiPAEeRfOhDH5p+P8oM6w8rDWVJ5yCNudJKP4t7rmmHYgShjEgzHHA+6Bm/4UOEwwX8lqEmBKMEJxPc7sm9BG8uK8VcGbfR40etXp2ygkwdhoaaDYaScA0OJbZmTUq9qvQ41bguuqpjlpHiaVWOyX8kcRXcUYWXq8u/lnaE0bUh1xzT9XjKya8+qkSOih455lCqE9acOGZTxw7a5JE9Nn5khz1875ft0O6v28jeO2zy8H3WmtjnR/mXGlVTDVVGRaN/3VJ3nnEpa+WT89aKxazVGupwSOH4FzRb/bZy81V24dXPlMW1XgWqspMVx+kF4rSc/nfe8S9uEsslnF7y/5cLvOxVKXpzMMsE0ROlHKJxdmIxywihAEg7hAX0MNHPh9Y+8pGP+CZSev4IY75YGcN+8wXxhov3maxm0cD73vc+F8gB6Hj+859vf/Inf+KKoVsekFbkizjoffOb/DDnwxV/+ECbIBxQO54VEWdeyiP4x5lXrL76j49/zBUmeWFPCYeXsvwXa5D4u80Hc33MRaHgiTviCX4yLMscE8qf39G+uwF5S9PKFUuTxS0MkQKsWJR2WDso0tnThZnwifJV+JZUTVOCiBOETZaPhPro/u32wJ2ftaMPb7dy65iVsxVZKRMS9KzokwUh8V1pIpj7ZPyssvLwesuXhxQdS5RRXfBEit6H4JigF+25UlvIB0gP+hRGNJyM5FnWKpazCV2Vn6YsqkbZquiy6qQ16sel6PcqK0eVxDErNCv+Xf4CQ1pNvnGj9BR3M7WR0vygzJx/ZbNvsGhjk6NWz5X9iP9S3xa78onfZ0OXPUPhOH0b2uSwxBQnS5WD/OQCjfAw2gnhk/q6HED5U1d6CuZRRggFEOUQv9PlMZPfQiMEJHQguEgTIcs9z+g5I1wYpsKFIA7BMh9EviOtSIMVa3/2Z3/mq714jrBi9R2Hf7785S/38Ph1gxDGwcv0lXjjN/cRDpo4KHE28JywODoI8IuTG/icwz/edJPt27/Pw6G8WBTxy7/8y/bMZz7zEdbFfIAlwRJ5lmxj7QX/I39c3/SmN7myBvidCeBD8Ijy/+AHP+jDc+yLIm7mGNkjw/LyUNLhHgl4HIKR2QPVeSYhdCfVrouE98R+O7zjdnvoni/bxKF7rS8rqyA3ZflqzQp1FH/eX6k0WlaTBdTKsXcEh/LRAx8mwyXfXiFsk/0k8+RDTqZSTopNNVxx9ou2PsXGsgP4MaX4JhSKwysrUiyytqUMOAam1UBxDihN1R/RjYIRM0REUQqGZ2pXhZyNSVvVcgPWt+oi27T1ybblmudYpm+z4i8pXFtAt608FExiwpyA80vpJlieCqY3RPYog4IIwRBAaIGkgnVUqkUsI+KGHhBCNg2EIr1vhAggbFgD3SAqYaSL4mAin6Er5kIYDqMXjuB63vOe5+kSptv0gs+RHr/BtKXSfgaCNueD+8wMP5GXsLr6UI7u+abMO298p90nKybiRCkwfMV8Fqu9Yk5rvgie8z7DliyNj7Ki3lBG6jT6JyS+7/u+z8NFXroFfIo0OGWBlYOcq4dy48wyFA10UFaxCIOwp5emyoJgCisq/S+bLVixJP7UKjZ+/LDVKsfEW5SF8t9Agap9yDLJ5hiGk38OxS4hLoWQzejeLQ8JffbCSBH4cueG/JpTMzqe57l2uILeKSutfFNWnH5nmuMS9mNSPBPqdFSkTEiLORaGr9QORCGtx1svHx/jWBvR5gdlkjNWpekN/qp11b+sLNnSOlt73mNs06XPsPzghWp4/cSo+Kh3/AkqP69j8ks8EsAxPUh++AM4tHxA+S8vir7LEAIvLaTDjysCA+GwFIh0ECSBECpccdCEgOeKo+eMMOsWnWmRX+ZA6A1z9turX/1q+5Vf+RX7gR/4AZ+Ex0JIvzNfkEfoDYEbPO9E2v9U/PeQxKULh1vywTHmkljSzcoh8kSaxIkf81jRgegW8J49L3wQD4VCfBFn0IvQZ2UZYRcC0E/c7E8iXiwZEPnDD+VDenPzDE6l+CtxOv2nNFi8jJAtDG6w9RdcbZsvuMzypQHfyY6F0igVrZqXwpZVUM1OWdUn4GUlSNGYFA4SjY9zMayVtaKUQUmOq8T6LM5XDM/gWg32rLB5klVtTM7LWs1JWeXZIMmiBjoUnPzQpzxLMfiiBFlKOfansJGyJtdIXHvFmOdZJhXH/ufzQ7Zm/cW2XgqmOLzVmg2sHubnkAeJglFAd6kqeVahp2CWAWi89HCZg2DsnpMB6BkyR3DqBrtwIJ0QJDMB4c5zriHouxke60SkG/ETJwqF3jBfrsRyYXKea6xW6gZBd/AUxY7r5DG/oeN0gHANywXlAu3QWioyBp/EiRIgfvfX/enGPRvgAYqeXfVsPo34yEvwh5MlmDc71Yqu00GaXvIbq+DSvOPK3BD3p5e/dP87Vd8kWDFQmg3xcc0W23QRwneLVTIr5PpsstUwjvNqFtXRyRdMXQ6r6XVyzfdXGqKDb5Y1JMQbDSl8xUNcPsSUjJW1BfwJlwwtPdJxGGe1yQbIfikMKXI+iKb6U5PKqZFvlA6DYy11tKSo6koDNd9wZaI6JHXpQ13tjOpOPrwvBVIclvWy1lZuusKGNl4uRTacKDEF9bBx43NTYCae4jeT//JBT8EsMujhhfCKXiaNEUEQDZP7f/u3f7Nf+qVf8nF1Jm85rgQ/er1pED7iWWiEYAjlkUYI5/Q94WcKe7oIvnTmCcHFs3SagHBnotCgNwQgghIHIp14BkiLe39Hv2dzOU7ardckF8WLvBSWfl92+eX21Kf9J1cCgLyRJyb62STKUuluQV1BUdH5YO6D4TYQdKd5GivYPA9t/27Au8QHsJw48YD8EC95g49sImbDLQrtdOqEz72cJNBjOEjp5HQvS8UtmdVX2MWP+yEbOu97bNzWu3WQLWAhlCTkhyTIV8utlLXB/AaxVvT6uK6Tio+NjIBhLBYr8IkBOVkfiWs80mGlTDveQS3ojwn6ZuI46p9PJqPWMnw2OS8lnpuUhVOR/vLD/a0gWkpSPCXC11Sfa1Ai66Tcb8ezZStsuMQuetLzbd3lT7VWeZ0Ul5SgLDMAZ6bvOKaIOUCGxx4BQuEfbvmhNwezyKCxpRt/NL640nBZEcSkLF8MxIJh93x8N4YJboaN0u/F/UICGtP1oPM+7dL+Z4IQfuQnBBYOoYVfWihGGNBtupEe8aCo+I3ADqVFWQR/T0qf5GZzbRAvQp93WFWF8GchBHGzeZNVdxyUyh6cM1lFRvzBCxQNw1K33Xab8yyUQOBJT3qSPfvZz57OXzfpBU9Ij7SxIrG0SZfhPuLE2uT0gJe97GXT+6IIO1t6iOxgYFt8+x8zGPgoOb1LSP2X77diebWUyrBombLxUTZXspJLFousj2KhZAWGlFpSBrIfmILH+fuYDu7UecnKxkmSbDv802FOOB/KYoMkP/nTb6cUq4R3eBE//fYrlopfVaZy/r8sD1aLoTyLxQErlIZlaZVspCKaV5xvFz/2elt7weOkMFdZMzsoiybpjBQUNXP5zjt3MKPNkOTftDtxhzxIfJYTyENvFdkSgMZGQ41GGo2WKzvXf/u3f9utFfwQFJQD4dj78fa3v92P/0BIhOAFcT2bQf5DEJE3EII/eNBZJ+kth2UwX5Ae6SAg6d1jHSKkGYpjmS3DVwHSJXxn+jMhXS5Bc7wX353BaoHudLmdTtydIH6AYsT967/+q3/qAYEfcWNFYGmwt+eGG25whQZCQc8HkR60okDJA8ftsIosFFssxED5pPM3ex0lThxiGwQfEn8ENuNkHMEfAtyqU3Z8/112/7c+bscO7VBFGLWBfNWy9XHL1KaMGpH14S6pKYbZdNeQFcJQFfD9Np5OOBDXE0joCZC2XJsH0CLC5CcVolv3bsfrE/DM5/i+Hj4xIbpkzbYyZSkWTiUYNCuttlzfetty6RNt0yXXmg1sEP9U52TRtHIMtUnB8DppneWYbgc9BbP4gNk0xBCeIZA42ZflrO95z3t8hVF6IxvCgz0mKJif/Mmf9MabFnizN96zA/Ah8pOud9wHf9LPUSzBv27zDn/Zx/O3f/u3fo4XJ0Oz2gprgwMwORkaATrdONp08XsuQCdhogMBrXFPHJGPEPDkj/uIfz4gLlzwAmH/rne9y0+HZt6FuMkTS6IZZmUILdLtFkF/Oj/Uz8gnDkXNXiKu0AZmL6dEUCdIwgSHk8Mck+eths+0qwMvPjG/Uj1iY0fvs/2777J9D37DGscfsoGsOgn1ScuyhDmrdCXkOa6fE/zruUaiZCSycwyhzbenL8sn47M7yn/i4+CYfZ/PaSlG7lEsslRw3LeydatkxyxXLsnK6rPxaslypfW2/vzH2PoLH2srNl6mYEPqTSVf8kQhNtoM4AideVC4bBF1pTdEtsiA0SCEJuBKY6T3iXJhSAzBRg8R8A5h2C3PFy75bDONOPzBuVBWCCnyg3JF2GNZMOyCAEtPhhMGvzPNO+mx+53PV7PPhjJgxRdKB/4yP8KkeTQOXJTfbIgy4Zp+L01zOp64hn834D3iBvApzrzjlO4nPOEJvuqOAzu5D9q6TQtE3uAR9RhEvNRbHP7QEs8JO3Oa5D8cSK6E7AzN+24ZCITKqJdfWrHGBoZXucfE2Kg11GnIwme5nIdPZH+D41j0Kl98VAlJEbAjHkUbqUSK8Ruk/XAoFiWkWywWfJwav0e5JOESxZUMj3GoJl95rrPPRbqpYoM2uPoi23Txk2zTtifbwMYrLSNlYy0Wgcju4ugYMie4ciHKcwRefuqF9CyYRQSCAL4i3OjZwWt60hz1wbzLpz71KVcsoUAISyMlLELi9a9/vfdC0z1rcLaXFXmBN+wGZ08FQy4sgWWymC9W/siP/Ih/Kwc+kNfgI71meNENSIvhpL/8y7/09AG8Jl72p7z3ve91JQOiTaR5PhOgJ3rsIfQD/I54uPKb9LifXQDPDd6PeHGkTzwM97F0GL8YjsMRNnjYDYJPwffgB/U54o58MRQXdXluBQOf0rxKhWul31EYfirNliwY2f5WZ+K+OeFHwIzv+449dNcXbeLwDuu3cT8CJqvnDIthwbAqC4ci4NsuPsLl/yV5iqsrkfbdSZB3suHx5PDT8CE5OcXvS4tlvTBkxvEvlXK/TVnJBleeb1suvtbWXnCt5YfOE58GZJHJcnHFRx1RDIrCFxN4OmgZIj+7EfUkqf09LBpofCAaHL85ZoMjRFhGSsMEFEg0Zhoy1gv7QTgrK+Lg/Si4cwEoWhY2vPOd7/TjYT7xiU/4icA33nijD2Mx5APIc5qP3SIELvzDwXviDqEd/I30wm8uQA/CNx0vQp44uOKfxpkIe8C7IcBJlzQASoV5JDaqMpyKsA9aAPR0g6A/+E6agN8MhxE/jnvKE/9T5hFSTiIn9aMtzFn2TdItn9NQXAx/ZdWxyBQlnIctV9hoKzddZ9ue8v/YBVd8jzUHL7Lx7EqbzPZbJcuch8K2RF+jLOuGlV+Ibil3KSp3UlU5XzAs11Lnz121fQ3X0DPlr6mOoVyyC5+tle2lBNISdbmq8oyryASp5OU4pLJ/q513yTPt8id+r6299CmWH94iy2ZAFaBsfAGgrixJL4l3crr60GCXZbSc0VMwiwwaHI07GibnejE888lPftJ71KFgaKQ0TH4z9/IzP/Mz/llmViKlhx5Ap9BarghBDUKI44dDAKFoP/rRj/pkMT1w/OkZHzx40D73uc/5xDW/eRc+cg2B2Q1Ik/kWBDHCMGgBnB4Qy4fTNJ4OQqDGO9DJNfLLPfkA1INIE3BPuODPqRACHZAu9/Am/HFBT/zuzEukGVbIXOD99JW4O+OLvKJkuMeKIZ840uDK80h3GsEGrifJVuJXvO00GeJSS5LLWkGKIyd7JZtfZVbcaAPrHmubnvgSu+w5P2Vbrnm+FdZdZZOZNVZpDOn9YctL4WRbbLr0AaxEkPtpyTVXNIUsyoalxWknq1DPOFgz2cdC5wF61ElkMj6Tt6qUzYTirRWGrFFebVOFlTbFEf4rNlvfxqvsyif8oG296nttcNMTLN93nq8UYxNpU0qIIbSW4sORNR8F9P9w5xbOvRwtM0SDikZPL5rJfeZdeBY9zWiENNInPvGJvryU5a0ID56HC6FxNgHBAiIP/EagMufCjnOUblr4EAaFwwos8hpCDV6cJKDmCXr2DIE99rGP9ROHiZvyYBUZe49YEk4a4aADYTkX0nmLcol74g6riXKNeCNcOr/4cY34TgeET7uIA94i2IkLP9KkfuGf9oMmMBdPI+5A/A4XcZEevGI+jfrNJ8WZ3wqQBs8Ug9Xq6ix5nCFlT8Tv0M+IPxG8KBelxTyKrBKGonxSHYsmJwVSXm8D66+2rdf9kF311B+VYH+e9a261CZrAzZVUd4bOZusqCx1Zbd9Lt8nV8aesUqdgTd1Xpicd4dCTlxTtFVbDMo1rNJs2FRDeZB2qMlCaRSGrVVeayPVsh0aL1tr8EI778pn2rXXv9Qe+9yXSfFda7mBiyVh14t2hTV1EmXtqCuhLIvf0y7KewY+nAPozcEsAWjU0YiZWGYOgPkX7qPBA4QRk7UsW+Zo+lg2G+9GOHC2lBX5w6Xp5TcC76abbvKltJxpBcgfQhCFwsIGvjzJeVrhD3/ieTdAacHTXbt22Ze+9CXfc8Qejuuvv97TI17oCoUGzfAeATobCAdNhCF85DdoRuiy0gsBzAIC9okwzxThAdd4l/R4N57NB/F+xBd+MXSVVijBxzS93YAl0ZQL8X/2s5/1PV188IzOAcO8rIBkCTMr21A4KHZRNS1LxeHkJq1X/Rn/iSfh9DxHmHZwusZ+mGQ7HlactRpTVszL+miOmh3daUceutsOPXyPVY4fksEypbIYVzlMKTbmjlpWULGiXvj6JREzQZ+sBCNGKRlZN5lccoSNujdWk3KpW9GyhUH1GOWkZMoDa231+q226fxLrbx2s8L3mcwavb4uiUb0ceVcslYG5UJuyAQpqbOoazJ30w6cZPusB3XK62FPwSwuogHDWxo1guYDH/iA/e7v/q6vnOI3DR8hQCPkSPdYXtrZ+NNxdSsQlhJBL4DmUJQII6yWP/iDP/Bl2jE8BsgX91hxf/RHf+TnbcUzBOKZ1NGIByVCPDj4T5phaeBIB3/oPB0+Rxy4tIDHSmWlIAs5GPZDmbH5kTJmUUHkFRfvUEfw536+IF/ERV64duYh8k/cPDtTfgIUDPGgSDk3DgVD2QY/WLDBJ7Cf8YxnePqujFFsejdJOakTJ5Yn8yP+Q7CLR1z1yBUMI8U8yqJcksl8D6NnnB+Wa2GXSIlkRi1TO2Kt8b1Wk4I5sm+vTYyNqFN3zCp826U+JcumYg0pnHqj6oaESsCVTHKnspRC4CTkQl/JiqU+y2L5FIes1LdKfqts7aZtUjDrrTwkK6XIEft0CDmSX/znfcXpJ72I/Uzqu8XiGUjy2lYvnpbvpyHtJPmzHtN1uqdgFhcwmoZPIwQ0bHrPb3nLW+wLX/iCDxugYBgqY1jsv//3/+77MaK36YUklxYOZwugOeimjoUgRugxjMKxOEzsh2AHWBjw63u+53tc+bD0FvBO9Lq7RQjvALSRbtqP+7R/uuxmA8I1hDXv8h4dhr//+7/3csaCCX9OZaCMf/7nf94tGfxxgOdpBTVfRDzkE6Ud/KZuwVfiDjrgZzrtbtIjHd4jvjvvvNN++Id/2K1RfofC5vr2t7/d88tvzgorQoveJ8XEYT20FcxJZCSWAwrGH7Wd/3CLQE6/mEXxxQD+Q/9RZrmaZbJVPeNjYVNmlalEmdQm3ZKpTh638bFjNjlx3KYmx4jUlYsnryvCvyklVugrWFnl1DcwZMV+uZJceUiKZtBy5dWqmBzjXzYOr2zKwmGexhWiIoq9LUziiyWC6G1KwcJrT4gLN3IeFv/2g7Mc1Cuvx2pAPQWziIDRacHGbyb3US4f/vCHfbiGxk5PL77YiDBAwXgByfEOjRMQz9lSTtCNA9AdvWbywgq6H//xH/c9KCDCkW/C/Nf/+l/9eybJkEqiYHgfgdUtgp7gX6QJPcQfwB96uZ6uggm64l0sFr79wrdTIs+AZyjPv/qrv/I5tjQtkSbopoyDXr7Xz3AV36WBn9QpLEEWOACUH8oNmiLdbhAKhisK5sUvfrFb5cQZCgzl9nu/93v2a7/2ax6WfS18lyXDpg+BXHLHhHrSs+dHckluUDJt+pw3UkbJr2m4QNczviDq5ag0GpLwCHN16WQ4qHwl5TkZoNXS71ZVBhDH+lStwdcwPU7iTmJOdv0Tr5SM5WVxFdzqUuRtP+oKSppPITAvSHgWXBCL+KGoOHlZrVahUCGJreJJSAFyOGo7qTb0YPp3O69nOSgPL++egllcwGhAww8hxj2NmxOTUTYIgVWrVvnqMcLQYLniQuhEgUV83QqFpUZasIaiZViFoSNWynEfAj4EFvMU7373u6fnX9JxnEm+4V3QkK7rsymuKLNTtQvC8T5xkwb08n2Un/iJn/CjgCJvQTsnRHM0EPM+COAoU9LhXa6nSnM2kC5W03/8x3/4UBVpU7eYC2EhA8cPoRDpxEAT6Z1Kgc4F6ERhsaQcBcMZepRplBtpU5YsuY90GtRl0RWAK1lXMPAh4UUicPkvEdrJPSsxcYhrvc/cBZD1I9UqR/1RuiwfbvH1/vZsh6LMSbDn3eIhNoS84uGMMoXKJmZRglakpVuGuuSY7Ad80pk74gAUG/lMii8pM1xDfzWG6RROrVjpJy6GxE6C/1SMbRp8uOwcQMircyM3yxhR6UJQ4WhoNPD4qBafAebsKIQU4eJK2IgjhGK42UCjxgVo/CH4QqAgALiP5+GHoA1hF/GEwDxTEAd5IF3yfsstt3jakV7QA28QvDH3Ql7hReT/VOAdBD6IPAS47+QrfiH4+B0OpMPOBeIg3cgLv6EhOexQNEm4ldSJ4FPK3B87OmL333ufFQtFq0yJ/+28u9xKougKpMkGXpQXE+rwl4UkzAXh961vfcv5nAjFJKHTyd+pEB0kLFIUWPAQ65NDPqnf8Dh4lFf6rlTaztUAZDgtJz85AejlN2WVWBAJknfY6MiHyqz9DXsOjSzKMSvCtZCjDdFpk6WRK0hZcHRMWa5PMbddiw/pcW5b27HnJisLhvqH82+1YKkU/J6PjJE2HwfDKoESRaIrn07Oy7E8+mTFclLxJl66chPu3EKUUg+LjLSCSAvLme7TYTsxm3+AZ2lhR8MmPhCCDwHPEuGvfOUrvgeFXmcMTSGAUDTpNOZKby6k6Yg4iJ9x+ttvv/2k52kgkFhxFXTz7nxo6HyPNEkH/7jHwQt4MlP8M/nNBuJN5wU+sn9p08ZNlmOZrfybDYZh+DOfd2OPDwqn4OWTc8WDojndNGcCyoT5HqxiyjDySh7xR/mgdAKkBe2R1/k64sYa4soeole+8pW+OpKPxf3iL/6iL2R51ate5cu/o0z8qiz6vEvbJSDfPGi7+C134k60SnC79TLtG7f4Jc+ScIka4gR8nG9mxLWDy0e/CSGlJCvFne45vkUq0F0SJnlv+n0crwvOh/Z9GszlsPfGj/hnc2Y7niSw6sj0/YkrMc0c29mNpNR7OGdApQfRq46GjT+WUQxP8X17epccyULP84//+I993gB0CuSIsxuEAAtwT0+aeQLSCEQYeouPf/zjXQl2WhunC8KS/0A6HZQKQ0chhAkbllunA6eTbqelg4Kh9z40POT+is3jgxc4fseZa7GZUAEQPR6+W0HDuwh86InfQRvHyMBzlBv0xXMQeZ0veJ86xfvwFSuGk7+Zc+GII4bkWA0IDeTV866wrkh5P+VOH6m3pm9TfnIn/tK+nS7uwMlPTrjukLx98t90fHGb8jqX0VMwjyJooHO5hQANGyUR9/ScWd2E9YLQYeycb8j/9V//td18880eNgQQOBM6Ih/EGUoLx+ZKhnDSgi3SoecfH9GK8BHudGiJsOkrgg0w58URNAjA17zmNb66iVVsnQpmvoj4gz7iYBIdjcHEcyGfHNMP/3EAoZuXcAZYMgzB4Oc0uKqZP7AiGKKK79AQV/AdsKCE0xNA1AnoOh2+zgSnVS7iQMkANrRigdJJwA/+EiboCQW4HADdc7nZMFPY03XfTegpmHMQVOJo9CHQaNwMobB67Ytf/OL0yiccwohlwwxbxYGJ0RBCEC0U2IBHTxpLKhBpIXgYTmGDXgjFuJ4uZqKX+Bka4jDLt73tbb4vg3ustj/5kz/xDZek022aoJPn3DPHNs1HKZpEdSRj9Ci7mspAifnS3en0u0g7QJos60bBRLpcQ3GxYq/zO/3T6XYJ3iU+0qAukR5lgAt/FA1A2Zxpej2cXegpmHMM6cYb9zRyGjfLVlEwDIXxG6GLQKCHCbji1ymAzhQoMBxpocgQchFvCEJAr58vPrLgAcyU9qnoifi4psMy78PSYK4hAFGmzEuwETIw3/wSPhxp4ogbYX/NNdf4RH6tfuLYFn9HfxylwjCZXjjhD9+Jo8uxE8oNCwbFFmUIPcTPFaVGfoM+QLj55jmNyHOA+PhNeZMGcQctKKCoiz18d6CnYM5BRIOPhkwjx3phQp/Ti1EiCAAQYfjNvAG9XwRDKB38EUjdAuESAh2rBSVHTzqEXlpAoWDimywg/SxwKmEYvfUIF+9jpTA8mI4PgYeQ//KXv3zKeE+FtKAmDeiIPTzA/bIn5kZOUuR6D6rStHUD3ue0AI4bCkEPooyZf2HZNJswI23CdJtu+t3Ie7pco97EPY77UG49nPvolfQ5BhpwWthFo6b3ylJVPhVMA8c/rqwgY1gqNnnih4BcCIHA+wCaEOgMw7EZLwCdOJ5z1DxDPCGkArPdz4QQrBEO4Ur8KDXyA4I3kTZKL9LsjD/CzoYIn77Cu+AZ9GDFKOYTYfTHECXPpqFnntIp0psL0Mq+GibWuYff4R/5Y4EFKwg7+dQN4v10PKQTeU8/Iz3KAiWXznt6/is6NT2cO+gpmHMQIUywPhB2WC9M6iPcacQIWho4zwDhOCsKwYSC4d2IIxp/N+C9ECTEx8Q+O75D6HeCnvfatWs9XcA17gOdvztBOsQdyoTwWAv03NP0pBUox7dEWuHmi/R7cU9emPDmPp029yMjI76SbXoPjOBvt+PoBqRD+XHeGZs5QeSRtLlHuaNk+J2m6UwQ+cUFiDuAQvnIRz7iS5hf/epX++IKvocED8KSTofv4dxBT8GcY4iGGg0eQYrVgvXC/EMoHXq30WPkCJGXvexlLmgROGlBQdjokc4XaaFDPOzFYKd5AFrDkQZfsGRYKZ1+N4g84MgvAg4rJYA/9EQ6WG6LAeZDyE8IcacrUSO+mgtLInrw+u+MLZjI82Me8xhfiRdDY8FjgAXBPFzkPd5ZDFCmKHc+IseqPU4YeMc73mH/83/+Tz/IlM22lA10wpuwuHo4d9BTMOcopgWXwKQ+HznDj8ZMTzZ6+AyPPf3pT/fd8/FO2gpIC6czAQIEGrBiGMYBIdxwCGImxVlqG7R1C+hHsZCmC3XFjyUBuMePPHFPWhzRsxhgTimGHD1dDnSULEeVQAPzPwjV6MWfEPPd8Tudn8c97nHTfuHgC+lyDhwLHOL5QpRvJ4gXMDT5nve8x+fAgoaJiUm7445v+GpGeIAfCn+h6loPywc9BXOOIYRJNHAECkMRLA9GkKWf06j5JDPf/o+9EzT2eC8EH/fdIIQ4V2igx8o1FFmaDo6vDwWDX7dIp4kDKDXSBZG/9DBd+C00EPbkx9OJLLXlJ36UCRst8UrCKBC0J0G6Aryk08CJ3CiaNC9JA5rYhxQdjuDBQoN44TF8R7mgaOEz6cOE48eP+YpCFn4E/3m2WPT08Oigp2DOMdBAwwGUA71kFEjSuBMlFI2Zni5zL/TwO4VvCOozAekT78MPP+xj/wyZBB08w5EOp0nHXMiZpBl5iHSJjyFChqNA5IvnAGuKHeiLgVw+5wsXPE9+iq5oa8t7VnIxH1IVP6AJepKzyrqfEyGe4B1DZHQe0ohnWC9YMZRz8GihEXzmG0fULco90scfh/JFGabrZZRfD+cGeqV5joLGSoOmR8scC0NgDNnQgEP4smKLo2IQguneY7qhI4SIo1sQD3HQi6XHShphGfGMtFCAbLBECYKgoxtEPnDEDdLHo4Q/V/hAmnGM/UJjaHDIJ9vhH+lxDb5iPSDooQEqsWSgq6lwCuxhukEoTtLl09BYDqSdBmE4vQHrAX7FOwsJ8oLbsGGDPec5z5m25PDjwEn8mXPDn3mYeGcxaOnh0UNPwZyjQJjRWLmy8Y5vzaBMsFgQPC95yUv8UMLnPe953oukcYfATwtC7s8E0IAAYQ8Kq9lACDzSwrGxEmGTnpvpFrxL/NAfyoYl2LGqKp5HvtLPFhrFcsm2XnyRFYqF9geokg9ugXJ/n10oCwOF4ueR6TlcycSpil2AvJFv+I3gppwpW/xCuEc4Fnzgwm+hEWXM3NpP//RP2yte8Qpf3caCimc965n28pf/jD3tac9QmWM58wVRFB1vQM9croezCT0Fc44iBCk9ZYYoUCS/8Ru/4UejsIKHk275Vjob8wiLwOWaduBMFQzxxDg8PXZoiiERlA+WBdbVtm3bplcRhXLrBmnaSQtHb/kJT3iCx0uaXAmD8CXd9IbImRBxzteRN1Z0bZES43dM6CN6UWoXX3KxlfvKPvkPXaI2SbBLEEekTVoXXXSRb1oNYR9AATE8x6q+KIuFRvCe+sPhpZyq/Na3vtXr3hvf+CYpnJ/1U7OxZrCy4EtSByn7tELpdD2cTegpmHMMCBcEDS4EGn6xSuv666/3LyrS6PGLZaKEWSwwNMbEcvr8MYAAgkZ62lhZCH7CnAktvBvvhyJByGKxPfWpT3WlEnMPnBrwgz/4g66AFgMITo6+4WNb8Jp5CBQ+H1TDoqQMonzSdHeLUCTkDWGNgonhv/AD1A324FAmDB+eabozgbRwpEUemQ967nOfay94wQv8Wz/8puwpi1CMKDv408O5g5x6sq+PCrYYFa2HpQcNFmET5ck9jTdtOQCeI3hCEC80SBehyoQyG+3Y+xFChzR5jgWFkL/uuutc4IAQhGcK4gmhy6ZHBDpzPShahB1Hy3Nlbmqu/J8JbxiqQtCzSg5F+sxnMjz0cvvRH/1RHxpMlwW0nklZxHvEiUNYs7mW4UkEOfETJpQNSj1Wmy00gu8g6h5+0BX30ICDpqgTKKMezg1Qrr1PJp+DiIYcDTcEdrrRd5b1YpQ96bEU98Ybb/ShET4NQDr4hyBlCOmNb3yjvfCFL5xWMPG8W/B+xIEwIx0cvMBiQ+nBE4YOueKHZTMbzoQ3zDuhZBD2rBwjrvSQUCxAwEFz0NoNeB+QTxxWyp/92Z/55kbu4zl8gdfPfvaz7c1vfrOvIlxokD4grSiPyFf6HoQCgqYzyX8PywdRxr0hsnMM0Zhp2LgQNvEseo9pt1iggiFUOTmYKyC9ECBc6UVv3rzZaQ1A40KAtIg34uPKQgJWjqFcSJ+efSi2xQBKJOggTZbtghgKgp7Ie/DlTMuE+FBYpIflFMuwIx3qA+mzdJwTDqJ+LCQiL8SdLvOoj/iF4xl8Cv8ezh30FMw5CBpqKBIETTRurp2/4553FhrEySGbKJj03AqCDtoQrkx2x14RwDsImzNBxBXCKgQreQ8hFtc0DxYaodDS8wr4YS2h1GL+gfxCA/QEzd2AOIiPeAGWEkOC7C+KNAKEw6Jk+AyLbjEQ+Qkex/1MChX6zrTce1h+6CmYcwzRgKPxch+/w2+pgBBDwbBiKRQetIRwx5JgfoJefdAW9HeLSCeNEK6ky5XfKJsQavgvBjrzRJqR/3SZQC8uwp8JIr64R7nAYxRdJ18YvovVfYsB8hj5DHCfduEXV8L3cO6gV5rnIGikIVTTiEadbvhpv4UGAo05hlieDGI4ivSYeGfHeXqSnXCdgnA+SOeDOBHmWBD06vkdvXvuIx2u/J7NdQviJe201QjwD+slndeFSI/3SS/ABD4KJjZcxhAdwHLhGB3moBYakZd0fjrrXPjNVFd7ODfQUzA9LCoQHnHoI0IEoYago0fNJsf4/ksIx1AAZwKsmBBYCPGwVCIdQDoIf36nldJCIh0v6UFXWC8ogVA8PAt6ucb9fBF5S8cF71HiMUyGwo9n0MEVunroYTHQUzA9LBoQYOxBoReNEOM3igYgXNmTg+BDMCJkuS7EhDtCk7jomYeQ556Te9n0iZCNtBD4i4nIF3Sg0EifFV2srgvBHgoBdFo180E6HkA88Jvl0WxmDV5EGTBEyWbH+IJoDz0sNHr7YHpYNCDQsFRYQcaBk1gvKBb2f7D58JWvfKVvBMQvFBAuevndICwWBDv31Ont27fbhz70IfvABz5gn/70p/3QTSbaWWBAuiiaxaj70BB54th69gLxbZSPfexj/vlqFA6bPLEy0koFWrqhh3ciz4B7gCKBBubCGK7kOZs92ZPDd4BYadYtv3voYTZ4PVYj6O2D6WFRgNBEyDHR/9WvftVXk9FzR6iyByMEG+FwUQ/T9/NFCOqwDrAW/vzP/9ze9773uZBH4eH4Bs5v/uZv+gZP6j1KaaGBgkF5ssH0b/7mb+xv//ZvfVIdfxQcJwtwfA+bPaEB2qHjTNphKOq4h//QgGJhwytf9sSKwnLkXLqF+ERCDz10grpMneopmB4WDQg3hGkITSod1gwCL72qKYQi4U616fFUIE7SJT6ut956q732ta+1m2++2dMJa4kFBgj3G264wYfwFmJorhOkD7CgSOtTn/qUpw0voA9aUHK/+qu/Oj35Hm2xGwQ/iZ+044p/KDuAsmGPDM8YLiPNXtvvYSFBnfN63v7dQw8LDgRXCO4QqgwHIdwC4R8CbiEEXQhXwLwLVgxAqYWgZR6Gb8SwPycE70IjlAUrtXbv3j2tXII+aOBro/gDwkNfKIozAfHjiBNHHlHgXBkyQ7Es1tBgDz0Eegqmh0UFAiwsmLgP/1As+IUwXghLIuJCkCNQGQJCaDPnARDohAlBu1hAWZAOio2J9LAmIr9ceRZ5jl5ftwgex31cSQs+hF8oFq48C/8eelho9BRMD+ckQpCff/75Ps+AIgmFg0BlhzuHX6J8FmMfCAjBzXJsVszFkS0oHhY88KkAvo8Sk/yh+Hro4VxBbxVZD+ccYigKxzH5DMnRW2c4jN8csMlpxhywidBH6SwGUBZYTVhKnLlGOig90uQDa6zgevGLXzx9mjHPworptcUeznZ4PVZvqjfJ38M5AwR0COmwCLgyD8KcC5YDK6hYpotABzFUtNAIq4R0sFpYTbdr1y73Z8iMJdoMkaGEYmED9yiiniXTw9mM6Y5ST8H0cC6Bih1IT/Zzj0PQY9EQjnuEP2EWQ6CjLFBekS73IGjkSrqhVOJ3rx32cLaDuuztqv27hx7OCYTwTisX/EKZxPJc/MJywcpYDKA0mN8hPdImHe5x3Ee60AA9QVfkoYceznb0LJgezikgpKnHaSHNbxwCPeo6SIdbrLqPgkG5hBIBkVakjwu/uF8senroYSkwXY97CqaHHnrooYeFRCiY3hBZDz300EMPi4Kegumhhx566GFR0FMwPfTQQw89LAp6CqaHHnrooYdFQU/B9NBDDz30sAgw+7+AiWM4rIQi4QAAAABJRU5ErkJggg==`

        _d.getElementsByTagName("html")[0].innerHTML = `

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
                
                <hr style="margin-top: 10px;margin-bottom: 20px;">
                <div class="panel panel-info" id="normalQuery">
                    <div class="panel-heading">任务配置</div>
                    <div class="panel-body">
                        <div>
                                 ！！！不建议开启倍速！！！易被检测清除进度<br/>
                            <div style="padding: 0;font-size: 20px;float: left;">视频倍速：</div>

                            <div>
                                <input type="number" id="unrivalRate" style="width: 80px;">
                                &ensp;
				   <br/>
                                <a id='updateRateButton' class="btn btn-default">保存视频</a>
                                &nbsp;|&nbsp;
                                <a id='reviewModeButton' class="btn btn-default">复习模式</a>
                                &nbsp;|&nbsp;
                                <!-- <a id='videoTimeButton' class="btn btn-default">查看学习进度</a> -->
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
                                <input type="text" id="token" style="width: 150px;" value="`+tikutoken+`">
                                 <a id='updateToken' class="btn btn-default" >保存</a>

                                 <br/>
                                 关注微信公众号：一之哥哥，获取token，此题库免费。<br/>

                                <div class="panel-body" >
									<p style="font-size:20px;color:blue">编写不易，还望支持<p/>
                                    <img src="`+ base222 + `" alt="Smiley face" width="120" height="120">
                                    <p style="font-size:50px;color:red">祝大家学业有成！<p/>
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
                        if(token.length==16){
                            logs.addLog('一之哥哥题库token已更新为' +token, 'green');
                        }else{

                            logs.addLog('请检查一之哥哥题库token', 'green');
                        }
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
                        _d.getElementById('backGround').setAttribute('class', 'btn btn-success');
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
                 /*   _d.getElementById('videoTimeButton').onclick = function () {
                        _d.getElementById('videoTime').style.display = 'block';
                        _d.getElementById('videoTimeContent').src = _p +
                            '//stat2-ans.chaoxing.com/task/s/index?courseid=' + courseId + '&clazzid=' +
                            classId;
                    }*/
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
                //logs.addLog('如遇脚本使用异常情况，请检查脚本版本是否为最新版，<a href="https://scriptcat.org/script-show-page/878" target="view_window">点我(脚本猫)</a>或<a href="https://greasyfork.org/zh-CN/scripts/462748" target="view_window">点我(greasyfork)</a>检查', 'orange');
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
                        _d.title = '🙈挂机中';
                        c = 0;
                    } else {
                        _d.title = '🙉挂机中';
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
                               // _w.top.unrivalWorkInfo = ctResult['msg'] ;
                                _w.top.unrivalWorkInfo = '题目：' + quu['question'] + '：未搜索到答案';
                            }
                        } catch (e) {

                        }
                       // busyThread += 1;
                      /**  GM_xmlhttpRequest({
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
                        }); **/
                        return;
                    }
                    else if(ctResult['code'] == -2){
                         _w.top.unrivalWorkInfo = ctResult['msg'];
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
            nowTime += parseInt(Math.random() * 3000 + 3500, 10);
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
                logs.addLog('超星挂机小助手可能运行异常，如页面无反应，请尝试重启脚本猫或重启浏览器(脚本猫0.9.0版本有此问题)');
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