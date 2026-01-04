// ==UserScript==
// @name         知乎页面优化 | 热榜类别优化展示
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  知乎热榜分类展示，美化分类展示效果，快速了解感兴趣内容！
// @author       xy
// @match        *://www.zhihu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459065/%E7%9F%A5%E4%B9%8E%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96%20%7C%20%E7%83%AD%E6%A6%9C%E7%B1%BB%E5%88%AB%E4%BC%98%E5%8C%96%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/459065/%E7%9F%A5%E4%B9%8E%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96%20%7C%20%E7%83%AD%E6%A6%9C%E7%B1%BB%E5%88%AB%E4%BC%98%E5%8C%96%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

console.log('Hi ZhiHu ~~');

// 首页样式重写
(function () {
    let tempDivElement = document.createElement('div');
    tempDivElement.innerHTML = `
        <style>
    
        </style>
    `;
    let style = document.createElement('style');
    style.innerHTML = tempDivElement.querySelector('style').innerHTML;
    document.querySelector('head').appendChild(style);
})();


class Svg {
    static getSvg(name, color = '', width = 16, height = 16) {
        color = color ? `color: ${color}` : '';
        let svg;
        switch (name) {
            case 'calendar-heart-fill':
                svg = `
                    <svg style="${color}" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" fill="currentColor" class="bi bi-calendar-heart-fill" viewBox="0 0 16 16">
                        <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5ZM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2ZM8 7.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132Z"/>
                    </svg>
                `
                break;
        }
        return svg;
    }
}

class RectMessage {
    constructor(right, top) {
        this.right = right;
        this.top = top;

        this.addStyle();
    }

    addStyle() {
        let tempDivElement = document.createElement('div');
        tempDivElement.innerHTML = `
            <style>
                .msg-section {
                    position: relative;
                    width: 90%;
                    margin: 0 auto;
                    padding: 14px 26px 14px 13px;
                    border-radius: 8px;
                    border: 1px solid #EBEEF5;
                    box-shadow: 0 2px 12px 0 rgb( 0 0 0 / 10%);
                    box-sizing: border-box;
                    animation: arise .6s;
                }
                .msg-section .group {
                    margin-left: 39px;
                    margin-right: 8px;
                }
                .msg-section .title {
                    font-weight: 700;
                    font-size: 16px;
                    color: #303133;
                }
                
                .msg-section .content {
                    font-size: 14px;
                    line-height: 21px;
                    margin: 6px 0 0;
                    color: #606266;
                    text-align: justify;
                }
                
                .msg-svg {
                    position: absolute;
                    top: 17px;
                    left: 13px;
                }
                
                @keyFrames arise {
                    0% {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                    
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .hot-select-item {
                    animation: arise .6s forwards;
                    animation-delay: calc(0.1s * var(--title-i));
                }
            </style>
        `
        let styleElement = document.createElement('style');
        styleElement.innerHTML = tempDivElement.querySelector('style').innerHTML;
        document.querySelector('head').appendChild(styleElement);
    }

    display(title, content, parentNode) {
        let msgSection = document.createElement('section');
        let svg = Svg.getSvg('calendar-heart-fill', '#f73859', 24, 24);
        msgSection.className = 'msg-section';
        msgSection.innerHTML = `
            <div class="msg-svg">
                ${svg} 
            </div>
            <div class="group">
                <div class="title">
                    <span>${title}</span>
                </div>
                
                <div class="content">
                    <span>${content}</span>
                </div>
            </div>
        `

        if (!parentNode) {
            document.body.appendChild(msgSection);
        } else {
            parentNode.appendChild(msgSection);
        }
    }
}


class Zhihu {
    constructor() {
        this.rightElementClassName = 'css-1qyytj7';
        this.rectMessage = new RectMessage();

        this.category = '';
    }

    /**
     * 全局样式
     */
    addStyle() {
        const styleElement = document.createElement('style');
        const tempDivElement = document.createElement('div');
        tempDivElement.innerHTML = `<style>
        * {
            scroll-behavior: smooth;
        }
        .right-content {
            position: fixed;
            top: 75px;
            
            left: 50%;
            margin-left: 200px;
            
            width: 510px;
        }
        
        .right-content:hover {
            cursor: pointer;
        }
        
        .category-div {
            display: flex;
            justify-content: space-evenly;
            margin-bottom: 20px;
        }
        .category-button {
            width: 50px;
            height: 30px;
            border-radius: 6px;
            font-weight: bold;
            color: #0066ff;
            background-color: #e1edff;
        }
        
        .category-button:hover {
            background-color: #b3d1ff;
            /*background-color: #618bbd;*/
        }
        
        .category-active {
            color: #FFF;
            /*background-color: #1378ef;*/
            background-color: #73a8e8;
            /*animation: color-arise .6s forwards;*/
        }
        
        @keyframes color-arise  {
            0% {
                
            }
            
            100% {
                /*background-color: #9D6163;*/
            }
        }
        
        .hot-select-item {
            margin-top: 10px;
            margin-bottom: 50px;
        
            padding: 9px;
            border-radius: 9px;
        }
        
        .index-div {
            float: left;
            
            font-family: georgia, serif;
            font-size: 18px;
            font-weight: bold;
        
            width: 18%;
            height: 24px;
            text-align: center;
            line-height: 24px;
        
            margin-right: 5px;
            /*padding: 2px;*/
        
            border-radius: 6px;
            /*background-color: antiquewhite;*/
        }
        
        .index-div:hover {
            /*background-color: #e5ceaf;*/
        }
        
        .title-div {
            display: flex;
            align-items: center;
            
            font-family: "lucida sans unicode", "lucida grande", sans-serif;
            font-size: 12px;
        
            height: 35px;
            
            float: left;
            width: 70%;
        
            padding: 12px;
        
            border-radius: 9px;
            background-color: #EEE;
            margin-left: 2px;
        }
        
        .title-div:hover {
            background-color: #ecf2f3;
        }
        
        .hot-metrics {
            font-size: 8px;
            font-weight: normal;
            margin-top: 1px;
            color: #c5a78e;
        }
        
        /* 搜索文本 */
        .search-text {
            /*color: #6b2d00;*/
            color: #F89623;
            font-family: '仿宋', serif;
            font-weight: bold;
            font-size: 16px;
        }
        
        .title-box {
            height: 600px;
            overflow: auto;
        }
        
        .zhihu-icon {
            display: flex;
            justify-content: center;
            margin-bottom: 16px;
            align-items: center;
        }
        
        .zhihu-icon svg {
            margin-right: 20px;
        }
        
        .zhihu-icon div {
            font-size: 13px;
        }
        
    </style>`;
        styleElement.innerHTML = tempDivElement.querySelector('style').innerHTML;
        document.querySelector('head').appendChild(styleElement);
    }

    hotDetector() {
        this.addStyle();
        this.removeRightElement();
        this.constructDetectorDisplay(this.rightElementClassName);
    }

    /**
     * 移除热榜右边元素
     */
    removeRightElement() {
        let rightElement = document.querySelector(`.${this.rightElementClassName}`);
        if (rightElement) {
            rightElement.innerHTML = '';
        }
    }

    constructDetectorDisplay(className) {
        let targetElement = document.querySelector(`.${className}`);
        let boxDivElement = document.createElement('div');

        boxDivElement.className = 'right-content';
        targetElement.appendChild(boxDivElement);

        // icon区域
        let iconElement = document.createElement('div');
        iconElement.className = 'zhihu-icon';
        iconElement.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        t="1677934993353" class="icon" viewBox="0 0 1152 1024" version="1.1" p-id="3996" 
         height="26"><path d="M1067.3408 812.7488V145.7152c17.664 0 34.688 6.784 47.104 19.0464 12.4672 12.288 19.5584 28.8256 19.5584 46.0288v661.8624c0 51.6608-33.1264 135.3472-133.376 126.9248-70.5792-5.8112-75.1616-8.32-134.7584-7.3216-58.2912 0.9984-139.9808-0.9984-212.992 15.744 40.9088-33.3312 100.736-56.9088 140.3648-65.0752 39.4752-8.2944 88.9088-11.904 146.944-14.0032 73.6768-2.5856 127.1552-56.6528 127.1552-116.1216v-0.0512z m-1000.4992 0c0 53.6832 40.6016 113.0752 128.5632 116.1728 58.112 2.0992 94.464 8.2944 145.664 14.0032 51.2 5.6064 100.48 31.8208 141.3376 65.0752-73.0112-16.768-148.608-15.744-214.144-15.744-51.5584 0-60.544 7.3216-134.784 7.3216-87.4752 0-133.4784-77.2352-133.4784-126.976V210.6368c0-35.9424 29.8496-65.0496 66.7136-65.0496v667.1616h0.128z" fill="#98CCFF" p-id="3997"/><path d="M907.3408 0.0512c10.88 0 21.8112 0.4608 32.7424 1.4592 34.304 3.072 60.5696 31.232 60.4672 64.8448v731.0336c0 35.072-28.5184 63.6928-64.256 64.9472-64.6912 2.3552-119.552 10.752-164.4032 25.4208-58.7776 19.2-116.0704 54.0672-171.52 104.3712V174.6944c40.96-68.6848 98.2528-117.888 171.52-147.7632a359.4752 359.4752 0 0 1 135.3984-26.88h0.0512zM226.8928 0c46.08 0 91.136 9.0368 135.3728 26.9312 73.2672 29.7472 130.56 79.104 171.52 147.7632V992.256c-55.424-50.432-112.7168-85.2736-171.52-104.3712-44.8256-14.4896-99.584-23.04-164.352-25.2928-35.84-1.2544-64.256-30.0288-64.128-65.0752V66.3808c0-33.664 26.1376-61.6448 60.4416-64.768C205.0304 0.512 215.9616 0 226.8928 0z" fill="#0381FE" p-id="3998"/></svg>
        <div>有问题，就会有答案</div>
        `
        ;
        boxDivElement.appendChild(iconElement);

        // 类别按钮选择区域
        let categoryDivElement = document.createElement('div');
        categoryDivElement.className = 'category-div';
        let categories = new Map();
        categories.set('军事', '战争|军事|核武器|同盟|和平|北约|俄乌|坦克|击落|武力|洲际导弹|导弹');
        categories.set('经济', '经济|股[市票]|A.*?股|GDP|[沪深]指|IMF|利率');
        categories.set('医疗', '医[疗院生]|药[物品水]?');
        categories.set('数码', '手机|iphone|苹果手机|苹果手表|小米|oppo|vivo|华为|耳机|笔记本');
        categories.set('科技', 'chatgpt|ai|人工智能|深度学习|硅谷|语言模型|科学');

        let categoryElementMap = new Map();
        for (let [category, value] of categories) {
            let categoryButtonElement = document.createElement('button');
            categoryButtonElement.className = 'category-button';
            categoryButtonElement.type = 'button';
            categoryButtonElement.innerHTML = category;
            categoryDivElement.appendChild(categoryButtonElement);

            categoryElementMap.set(categoryButtonElement, {regx: value, category});
        }

        for (let [element, obj] of categoryElementMap) {
            element.addEventListener('click', () => {
                Array.from(categoryElementMap.keys()).forEach(item => item.className = 'category-button');
                element.className = 'category-button category-active';
                this.category = obj.category;
                this.getDetectContent(obj.regx);
            })
        }

        boxDivElement.appendChild(categoryDivElement);

        // 探测内容区
        this.titleBoxElement = document.createElement('div');
        this.titleBoxElement.className = 'title-box';
        boxDivElement.appendChild(this.titleBoxElement);


        // 默认展示
        this.getDetectContent(categories.get('军事'));
        Array.from(categoryElementMap.keys())[0].className = 'category-button category-active';
    }

    getDetectContent(regx) {
        regx = new RegExp(regx, 'gi');

        const hotItemList = document.querySelectorAll('.HotItem-content');
        const titleList = [];

        hotItemList.forEach((hotItem, index) => {
            let title = hotItem.querySelector('h2[class="HotItem-title"]').innerText;
            let hotMetrics = hotItem.querySelector('div[class="HotItem-metrics HotItem-metrics--bottom"],div[class="HotItem-metrics"] ').innerText
            hotMetrics = hotMetrics.match(/\d+.*?万热度/)
            // let excerpt = hotItem.querySelector('p[class="HotItem-excerpt"]');
            // excerpt = excerpt && excerpt.innerText;
            let content = title + '';

            if (content.match(regx)) {
                title = title.replace(regx, '<span class="search-text">$&</span>')
                let hotItemObj = {};
                hotItemObj.index = index + 1;
                hotItemObj.title = title;
                hotItemObj.element = hotItem;
                hotItemObj.hot = hotMetrics[0];

                titleList.push(hotItemObj);
            }
        })
        this.constructHotContent(titleList);
    }

    constructHotContent(titleList) {
        this.titleBoxElement.innerHTML = '';
        // let rectMessage = new RectMessage(this.titleBoxElement);
        if (!titleList.length) {
            // this.titleBoxElement.innerHTML = `<div class="oops">oops, 暂无内容</div>`;
            this.rectMessage.display('oops', `${this.category}区暂无内容`, this.titleBoxElement);
            return;
        }

        titleList.forEach((title, idx) => {
            let hotItemDivElement = document.createElement('div');
            hotItemDivElement.className = 'hot-select-item';
            hotItemDivElement.setAttribute('style', `--title-i: ${idx}; opacity: 0`)
            hotItemDivElement.addEventListener('click', () => title.element.scrollIntoView());

            let indexDivElement = document.createElement('div');
            indexDivElement.className = 'index-div';
            indexDivElement.innerHTML = `<div class="index-text">${title.index}</div>`;
            let hotMetricsDiv = document.createElement('div');
            hotMetricsDiv.className = 'hot-metrics';
            hotMetricsDiv.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" class="ZDI ZDI--FireFill24 css-15ro776" fill="currentColor"><path fill-rule="evenodd" d="M14.602 21.118a8.89 8.89 0 0 0 3.72-2.232 8.85 8.85 0 0 0 2.618-6.31c0-.928-.14-1.836-.418-2.697a8.093 8.093 0 0 0-1.204-2.356s.025.035-.045-.055-.1-.115-.1-.115c-.955-1.078-1.504-1.984-1.726-2.854-.06-.232-.138-.88-.22-1.824L17.171 2l-.681.02c-.654.018-1.089.049-1.366.096a7.212 7.212 0 0 0-3.77 1.863 6.728 6.728 0 0 0-1.993 3.544l-.088.431-.182-.4a5.032 5.032 0 0 1-.326-.946 71.054 71.054 0 0 1-.204-.916l-.199-.909-.833.42c-.52.263-.862.462-1.076.624a8.588 8.588 0 0 0-2.5 2.976 8.211 8.211 0 0 0-.888 3.723c0 2.402.928 4.657 2.616 6.35a8.87 8.87 0 0 0 3.093 2.027c-.919-.74-1.593-1.799-1.76-3.051-.186-.703.05-2.352.849-2.79 0 1.938 2.202 3.198 4.131 2.62 2.07-.62 3.07-2.182 2.773-5.688 1.245 1.402 1.65 2.562 1.838 3.264.603 2.269-.357 4.606-2.003 5.86Z" clip-rule="evenodd"></path></svg>`;
            let hotMetricSpan = document.createElement('span');
            hotMetricSpan.innerText = title.hot;
            hotMetricsDiv.appendChild(hotMetricSpan);
            indexDivElement.appendChild(hotMetricsDiv);

            let titleDivElement = document.createElement('div');
            titleDivElement.className = 'title-div'
            titleDivElement.innerHTML = `<span>${title.title}</span>`;


            hotItemDivElement.appendChild(indexDivElement);
            hotItemDivElement.appendChild(titleDivElement);
            this.titleBoxElement.appendChild(hotItemDivElement);
        })
    }
}

const zhihu = new Zhihu();

let intervalID = setInterval(() => {
    if (location.href === 'https://www.zhihu.com/hot') {
        zhihu.hotDetector();
        clearInterval(intervalID);
    }
}, 1000);


setInterval(() => {
    if (location.href === 'https://www.zhihu.com/hot') {
        let rightElement = document.querySelector('.right-content');
        if (rightElement) {
            rightElement.style.visibility = 'visible';
        }
    } else {
        let rightElement = document.querySelector('.right-content');
        if (rightElement) {
            rightElement.style.visibility = 'hidden';
        }
    }
}, 1000);