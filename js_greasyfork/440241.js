// ==UserScript==
// @name         过滤广告
// @namespace    http://tampermonkey.net/
// @version      0.5.26
// @description  很垃圾的过滤广告脚本
// @author       LongLong
// @match        *://*/*
// @match        *://*
// @match        *
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440241/%E8%BF%87%E6%BB%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/440241/%E8%BF%87%E6%BB%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

const DebugMode = {
    None:   0,
    Simply: 1,
    Detail: 2
}

const FilterMode = {
    Normal: 0x0,
    Parent: 0x1,
    Test:   0x2,

    Parent_Test: 0x3
}


//![1] 脚本设置
const settings = {
    times:          30,                                   // 脚本执行次数
    interval:       3 * 1000,                             // 脚本执行间隔
    filterMode:     FilterMode.Parent,                    // 过滤模式，过滤模式越多，过滤力度越强，若过滤后内容缺失，请将此项设为 FilterMode.Normal 或 0
    debugMode:      DebugMode.None,                       // 调试模式，脚本会在控制台输出调试信息
    htmlNoClass:    0                                     // gray
}
//![1]





//![2] 在此处添加广告标签
const adsLabel = [
    {
        type: "class",
        className: "adsbygoogle"
    },
    {
        type: "class",
        className: "google-adsense"
    },
    {
        type: "class",
        className: "Banner-link"
    },
    {
        type: "class",
        className: "adsbygoogle-noablate"
    },
    {
        type: "tag",
        tag: "section",
        propertyName: "aria-label",
        propertyValue: "baidu-ad"
    },
    {
        type: "fuzzy",
        propertyName: "className",
        propertyValue: [/((^a)|(-a)|(_a))((d[1-9]*-)|(d[1-9]*_)|(d[1-9]*$))/i]
    },
    {
        type: "fuzzy",
        propertyName: "className",
        propertyValue: [/((^a)|(-a)|(_a))d((s[1-9]*-)|(s[1-9]*_)|(s[1-9]*$))/i]
    },
    {
        type: "fuzzy",
        propertyName: "id",
        propertyValue: [/((^a)|(-a)|(_a))((d[1-9]*-)|(d[1-9]*_)|(d[1-9]*$))/i]
    },
    {
        type: "fuzzy",
        propertyName: "id",
        propertyValue: [/((^a)|(-a)|(_a))d((s[1-9]*-)|(s[1-9]*_)|(s[1-9]*$))/i]
    },/*
    {
        type: "fuzzy",
        propertyName: "id",
        propertyValue: [/google/i, /ads/i]
    },
    {
        type: "fuzzy",
        propertyName: "src",
        propertyValue: [/google/i, /ad/i]
    },*/
    {
        type: "fuzzy",
        propertyName: "src",
        propertyValue: [/pos\.baidu\.com/i]
    },
    {
        type: "class",
        className: "clear360doc"
    },
    {
        type: "fuzzy",
        propertyName: "id",
        propertyValue: [/^carbonads$/i]
    },
    {
        type: "class",
        className: "youlike"
    },
    {
        type: "class",
        className: "eva-banner"
    },
    {
        type: "fuzzy",
        propertyName: "innerHTML",
        propertyValue: [/^广告$/i]
    },
    {
        type: "fuzzy",
        propertyName: "innerHTML",
        propertyValue: [/^特别推荐$/i]
    },
    {
        type: "class",
        className: "adsense"
    },
    // 2023-9-15 添加，csblogs顶上标题栏
    {
        type: "class",
        className: "bannerbar"
    },
    // 2023-9-15 添加，csdn顶上的标题栏
    // 2023-9-22 修复，将class改为className
    {
        type: "fuzzy",
        propertyName: "className",
        propertyValue: [/-?advert-?/i]
    },
    // 2023-9-20 添加，天猫横幅
    {
        type: "fuzzy",
        propertyName: "href",
        propertyValue: [/https:\/\/detail\.tmall\.com\/item\.htm/i]
    },
    // 2024-2-1 添加，csdn左侧广告图
    {
        type: "class",
        className: "ad_outpromo_single_image_class"
    },
    // 2024-2-18 添加，csdn左侧广告图
    {
        type: "id",
        id: "footerRightAds"
    },
    // 2024-3-15 添加，csdn右侧广告图
    {
        type: "class",
        className: "wwads-cn wwads-vertical"
    },
    {
        type: "id",
        id: "recommendAdBox"
    }


]
//![2]

const testLabel = [
    {
        type: "fuzzy",
        propertyName: "class",
        propertyValue: [/((^b)|([a-z]-b)|([a-z]_b))anne((r-[a-z])|(r$))/i]
    }

]

var ads = []

function log(str, level = DebugMode.Simply) {
    if (settings.debugMode >= level)
    {
        console.log(str);
    }
}

function searchAds() {
    if ((settings.filterMode & FilterMode.Test) > 0)
    {
        adsLabel.push(...testLabel)
    }

    log('* searchAds execute!', DebugMode.Detail)


    for (let i = 0; i < adsLabel.length; ++i)
    {
        let adsNums = ads.length
        if (adsLabel[i].type == "id")
        {
            let e = document.getElementById(adsLabel[i].id)
            ads.push(checkParent(e))
        }
        else if (adsLabel[i].type == "class")
        {
            let list = document.getElementsByClassName(adsLabel[i].className)
            for (let j = 0; j < list.length; ++j)
            {
                ads.push(checkParent(list[j]))

            }
        } else if (adsLabel[i].type == "tag") {
            let list = document.getElementsByTagName(adsLabel[i].tag)
            for (let j = 0; j < list.length; ++j)
            {
                if (list[j].getAttribute(adsLabel[i].propertyName) == adsLabel[i].propertyValue)
                {
                    ads.push(checkParent(list[j]))
                }
            }
        } else if (adsLabel[i].type == "fuzzy"){
            const child = document.body.children
            let arr = []

            function fn(obj){
                for(let j = 0; j < obj.length; ++j){
                    if(obj[j].children){
                        fn(obj[j].children)
                    }
                    arr.push(obj[j])
                }
            }
            fn(child)

            for (let j = 0; j < arr.length; ++j)
            {
                let flag = 0
                for (let k = 0; k < adsLabel[i].propertyValue.length; ++k)
                {
                    let property = arr[j][adsLabel[i].propertyName]
                    if (property != null && adsLabel[i].propertyValue[k].test(property) == true)
                    {
                        ++flag
                    }
                }
                if (adsLabel[i].propertyValue.length == flag)
                {
                    ads.push(checkParent(arr[j]))
                }
            }
        }
        if (ads.length > adsNums)
        {
            log(`* * ads type ${i} found`);
        }
    }
    if (settings.debugMode != DebugMode.None)
    {
        log(`* ${ads.length} ads found!`);
    }
}

function checkParent(element){
    if (!element)
    {
        return
    }

    if ((settings.filterMode & FilterMode.Parent) == 0)
    {
        return element
    }

    var reg = /(^ad$)|(^广告$)|(^advertisement$)|(adsbygoogle)/i
    let exit = true
    do
    {
        let brothers = []
        if (element.parentNode)
        {
            brothers = element.parentNode.children
        }
        if (brothers.length > 1)
        {
            let flag = 0
            for (let j = 0; j < brothers.length; ++j)
            {
                if (reg.test(brothers[j].innerHTML) == true || brothers[j].innerHTML == "")
                {
                    ++flag
                }
            }
            if (flag != brothers.length)
            {
                break
            }
        }
        if (element.parentNode && element.parentNode != document.body)
        {
            ads.push(element)
            element = element.parentNode
            exit = false
        }
    }while(exit)

        return element
}

function deleteAds() {
    log('* deleteAds execute!', DebugMode.Detail);

    for (let i = 0; i < ads.length; ++i)
    {
        log(ads[i], DebugMode.Detail)
        if (ads[i])
            ads[i].remove()
    }
    ads = []
}

function setGS(tagName) {
    let elements = document.getElementsByTagName(tagName);
    for (let i = 0; i < elements.length; ++i) {
        let e = elements[i];
        e.style["-webkit-filter"] = "none";
        e.style["-moz-filter"] = "none";
        e.style["-ms-filter"] = "none";
        e.style["-o-filter"] = "none";
        e.style.filter = "none";

        let list = e.classList;
        let pat = /.*(gray|grey).*/i;
        for (let j = 0; j < list.length; ++j) {
            let str = list[j];
            log(str, '/n', pat.test(str), DebugMode.Detail);
            if (pat.test(str)) {
                e.classList.remove(str);
            }
        }

    }
}


(function() {
    'use strict';

    if (settings.htmlNoClass) {
        setGS('html');
        setGS('body');
    }

    log('remove ads!');

    let times = 0;

    let timer = window.setInterval(()=>{
        if (times >= settings.times)
        {
            window.clearInterval(timer);
            return;
        }
        log(`[${times}] script execute!`);
        searchAds();
        deleteAds();
        ++times;
    }, settings.interval);

    })()

