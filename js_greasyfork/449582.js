// ==UserScript==
// @name B站 邓紫棋!!!
// @namespace http://tampermonkey.net/
// @version 0.3
// @description try to take over the world!
// @author You
// @match https://www.bilibili.com/
// @icon https://www.google.com/s2/favicons?domain=bilibili.com
// @grant none
/*jshint esversion: 6 */
/*jshint esversion: 8 */
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449582/B%E7%AB%99%20%E9%82%93%E7%B4%AB%E6%A3%8B%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/449582/B%E7%AB%99%20%E9%82%93%E7%B4%AB%E6%A3%8B%21%21%21.meta.js
// ==/UserScript==


//获得分区主体DOM树，header栏可替换
const gemDOM = `
<section id="bili-gem" class='bili-grid'>
    <div class="video-card-list is-main">
        <div class="area-header">
            <div class="left">

                <a class="title" href="https://space.bilibili.com/1889545341" target="_blank"><img
                        src='https://i2.hdslb.com/bfs/face/ea989809f658d45c3ca9510cb5becb142f7a0642.jpg@34w_34h_1c_1s.webp'
                        style='border-radius:100%'></img><span style='margin-left:10px'>邓紫棋</span></a>
            </div>
            <div class="right"><button class="primary-btn roll-btn" id = 'gem-btn'><svg style="transform: rotate(0deg);">
                        <use xlink:href="#widget-roll"></use>
                    </svg><span>换一换</span></button><a class="primary-btn see-more"
                    href="https://search.bilibili.com/all?keyword=%E9%82%93%E7%B4%AB%E6%A3%8B" target="_blank"><span>查看更多</span><svg>
                        <use xlink:href="#widget-arrow"></use>
                    </svg></a></div>
        </div>
        <div class='video-card-body'></div>
    </div>
    <aside>
        <div class="aside-wrap">
            <div class="aside-head">
                <div class="area-header">
                    <div class="left">
                        <!---->
                        <!----><a class="title rank-title" href="https://www.bilibili.com/v/channel/69811?keyword=%E9%82%93%E7%B4%AB%E6%A3%8B&tab=multiple"
                            target="_blank"><span>排行榜</span></a>
                    </div>
                    <div class="right"><a class="primary-btn see-more"
                            href="https://www.bilibili.com/v/channel/69811?keyword=%E9%82%93%E7%B4%AB%E6%A3%8B&tab=featured target="_blank"><span>更多</span><svg>
                                <use xlink:href="#widget-arrow"></use>
                            </svg></a></div>
                </div>
            </div>

            <div class="aside-body">
                <div class="aside-core">
                    <div class="bili-rank-list-video bili-rank-list-video__grid" data-report="partition_rank.content">
                        <ul class="bili-rank-list-video__list video-rank-list">


                        </ul>
                    </div>
                    <!---->
                    <!---->
                </div>
            </div>
        </div>
    </aside>
</section>
`

//设置数组缓存NewVideo数据
let videoList = []
//设置NewVideo页数，NewVideo API接口页数
let currentPage = 0
let queryPage = 1

//js字符串转dom
function s2d(string) {
    return new DOMParser().parseFromString(string, 'text/html').body.childNodes[0]
}

//按键刷新，视频缓存超出后向API再次获取数据
async function refresh() {
    currentPage++
    if (videoList.length < (currentPage + 1) * 8) {
        queryPage++
        await getNewVideos()
    }
    drawZoneList()
}

//数组降重
function uqique(arr) {
    let res = new Map()
    return arr.filter((item) => !res.has(item.arcurl) && res.set(item.arcurl, 1))
}

//获取搜索API数据
async function getNewVideos() {
    var myHeaders = new Headers();
    const url =
        `
        https://api.bilibili.com/x/web-interface/search/all/v2?__refresh__=true&_extra=&context=&page=${queryPage}&page_size=42&order=&duration=&from_source=&from_spmid=333.337&platform=pc&highlight=1&single_column=0&keyword=%E9%82%93%E7%B4%AB%E6%A3%8B&preload=true&com2co=true
`
    let res = await fetch(url, {
        method: 'GET',
        headers: myHeaders,
        credentials: "include"
    })

    //拼接数据

    videoList = videoList.concat((await res.json()).data.result[10].data)

    videoList = uqique(videoList)
    // console.log(videoList);
    return videoList
}

//获取频道API数据
async function getHotVideo() {
    const url =
        'https://api.bilibili.com/x/web-interface/web/channel/multiple/list?channel_id=69811&sort_type=hot&offset=&page_size=30'

    let res = await fetch(url)
    return res.json()
}

//分区视频绘制
async function drawZoneList() {
    const VIDEO_DOM = document.querySelector('#bili-gem .video-card-body')
    VIDEO_DOM.innerHTML = ''

    let videoList = await getNewVideos()
    videoList = uqique(videoList)


    videoList.slice(currentPage * 8, (currentPage + 1) * 8).forEach((item, index) => {

        let title = item.title.replace(/<(\S*?)[^>]*>.*?|<.*?\/>/g, '')
        let time = new Date(item.pubdate * 1000).toLocaleString();
        let DOM = `
    <div>
        <div class="bili-video-card" data-report="partition_recommend.content">
            <div class="bili-video-card__skeleton hide">
                <div class="bili-video-card__skeleton--cover"></div>
                <div class="bili-video-card__skeleton--info">
                    <div class="bili-video-card__skeleton--right">
                        <p class="bili-video-card__skeleton--text"></p>
                        <p class="bili-video-card__skeleton--text short"></p>
                        <p class="bili-video-card__skeleton--light"></p>
                    </div>
                </div>
            </div>
            <div class="bili-video-card__wrap __scale-wrap"><a href="//www.bilibili.com/video/${item.bvid}"
                    target="_blank" data-mod="partition_recommend" data-idx="content" data-ext="click">
                    <div class="bili-video-card__image __scale-player-wrap">
                        <div class="bili-video-card__image--wrap">
                            <div class="bili-watch-later" style="display: none;"><svg class="bili-watch-later__icon">
                                    <use xlink:href="#widget-watch-later"></use>
                                </svg><span class="bili-watch-later__tip" style="display: none;"></span></div>
                            <picture class="v-img bili-video-card__cover">
                                <!---->
                                <source srcset="${item.pic}@672w_378h_1c.webp" type="image/webp"><img
                                    src="${item.pic}@672w_378h_1c" alt="${title}" loading="lazy" onload="">
                            </picture>
                            <div class="v-inline-player"></div>
                        </div>
                        <div class="bili-video-card__mask">
                            <div class="bili-video-card__stats">
                                <div class="bili-video-card__stats--left"><span
                                        class="bili-video-card__stats--item"><svg class="bili-video-card__stats--icon">
                                            <use xlink:href="#widget-video-play-count"></use>
                                        </svg><span class="bili-video-card__stats--text">${(item.play /
                10000).toFixed(1)}万</span></span><span
                                        class="bili-video-card__stats--item"><svg class="bili-video-card__stats--icon">
                                            <use xlink:href="#widget-video-danmaku"></use>
                                        </svg><span class="bili-video-card__stats--text">${item.danmaku}</span></span>
                                </div>
                                <span class="bili-video-card__stats__duration">${item.duration}</span>
                            </div>
                        </div>
                    </div>
                </a>
                <div class="bili-video-card__info __scale-disable">
                    <!---->
                    <div class="bili-video-card__info--right">
                        <h3 class="bili-video-card__info--tit" title="${title}"><a href="${item.bvid}" target="_blank"
                                data - mod="partition_recommend" data - idx="content" data - ext="click"> ${title}</a>
                        </h3>
                        <div class="bili-video-card__info--bottom">
                            <!----><a class="bili-video-card__info--owner" href="//space.bilibili.com/${item.mid}"
                                target="_blank" data-mod="partition_recommend" data-idx="content" data-ext="click"><svg
                                    class="bili-video-card__info--owner__up">
                                    <use xlink:href="#widget-up"></use>
                                </svg><span class="bili-video-card__info--author">${item.author}</span>
                                <span class="bili-video-card__info--date">· ${time}</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
        VIDEO_DOM.append(s2d(DOM))
    })

}
//RankFirst视频绘制
function drawRankFirst(item) {
    const RANK_DOM = document.querySelector('#bili-gem .bili-rank-list-video__list')
    let pic = item.cover.replace(/http:/, '')
    let DOM = `
    <li class="bili-rank-list-video__item">
        <div class="bili-rank-list-video__item--wrap"><span class="bili-rank-list-video__item--index"
                data-index="1">1</span><a href="//www.bilibili.com/video/${item.bvid}" class="rank-video-card"
                target="_blank" data-mod="partition_rank" data-idx="content" data-ext="click">
                <div class="rank-video-card__image">
                    <picture class="v-img rank-video-card__cover">
                        <!---->
                        <source
                            srcset="${pic}@192w_108h_1c.webp"
                            type="image/webp"><img
                            src="${item.cover}@192w_108h_1c"
                            alt="${item.name}" loading="lazy" onload="">
                    </picture>
                </div>
                <div class="rank-video-card__info">
                    <h3 class="rank-video-card__info--tit" title="${item.name}">
                    ${item.name}</h3>
                </div>
            </a></div>
    </li>`
    RANK_DOM.append(s2d(DOM))
}
//RankBody视频绘制
async function drawRankList() {

    let rankList = (await getHotVideo()).data.list[0].items
    drawRankFirst(rankList.shift())
    const RANK_DOM = document.querySelector('#bili-gem .bili-rank-list-video__list')

    rankList.forEach((item, index) => {

        let DOM = `
    <li class="bili-rank-list-video__item">
        <div class="bili-rank-list-video__item--wrap"><span class="bili-rank-list-video__item--index"
                data-index="${index + 2}">${index + 2}</span><a href="//www.bilibili.com/video/${item.bvid}"
                class="rank-video-card rank-video-card__concise" target="_blank" data-mod="partition_rank"
                data-idx="content" data-ext="click">
                <!---->
                <div class="rank-video-card__info">
                    <h3 class="rank-video-card__info--tit" title="${item.name}">${item.name}</h3>
                </div>
            </a></div>
        <!---->
    </li>
    `
        RANK_DOM.append(s2d(DOM))
    })

}

window.onload = function wath() {
    (async function () {

        const content = document.querySelector('.bili-layout')
        const anchor = document.querySelectorAll('.bili-grid')[1]
        const gem_init = gemDOM
        content.insertBefore(s2d(gem_init), anchor)
        document.querySelector('#gem-btn').addEventListener('click', refresh)
        await getNewVideos()
        drawRankList()
        drawZoneList()

    })()
}
