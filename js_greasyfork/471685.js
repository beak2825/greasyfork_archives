// ==UserScript==
// @name        豆瓣观影
// @namespace   liuser.betterworld.love
// @match       https://movie.douban.com/subject/*
// @match       https://m.douban.com/movie/*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @antifeature tracking
// @connect     *
// @run-at      document-end
// @require     https://cdn.staticfile.org/artplayer/4.6.2/artplayer.min.js
// @require     https://cdn.staticfile.org/hls.js/1.4.3/hls.min.js
// @version     2.14
// @author      liuser, collaborated with ray
// @description 想看就看
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471685/%E8%B1%86%E7%93%A3%E8%A7%82%E5%BD%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/471685/%E8%B1%86%E7%93%A3%E8%A7%82%E5%BD%B1.meta.js
// ==/UserScript==

// 茶杯狐
(function(){var host=location.hostname;if(host==='movie.douban.com'){const title=encodeURIComponent(document.querySelector('title').innerText.replace(/(^\s*)|(\s*$)/g,'').replace(' (豆瓣)',''));const subjectwrap=document.querySelector('h1');const subject=document.querySelector('.year');if(!subjectwrap||!subject){return}const sectl=document.createElement('span');subjectwrap.insertBefore(sectl,subject.nextSibling);sectl.insertAdjacentHTML('beforebegin',`<style>.cupfox{vertical-align:middle;}.cupfox:hover{background:#fff!important;}</style><a href="https://cupfox.app/s/${title}"class="cupfox"target="_blank"><?xml version="1.0"encoding="UTF-8"standalone="no"?><svg width="32px"height="23px"viewBox="0 0 600 468"version="1.1"xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient x1="21.1782278%"y1="82.8285131%"x2="37.8576227%"y2="60.1283873%"id="linearGradient-1"><stop stop-color="#C74B1E"offset="0%"></stop><stop stop-color="#B84528"offset="100%"></stop></linearGradient></defs><g id="Page-1"stroke="none"stroke-width="1"fill="none"fill-rule="evenodd"><g id="Group"><path d="M405.967444,210.50526 C394.037565,219.253035 383.12336,215.368213 378.283978,213.73458 C373.444596,212.100946 362.906081,204.171248 355.021872,192.216023 C347.137663,180.260798 342.627341,168.670681 337.926445,156.567005 C328.438238,132.137155 325.079615,111.782956 323.419853,106.903084 C321.760092,102.023212 321.053089,99.893369 317.715028,99.893369 C314.376968,99.893369 309.513561,104.479737 307.53868,106.043386 C305.563799,107.607035 268.593569,147.712322 263.448505,151.409859 C258.303441,155.107396 251.794503,157.331292 247.07616,157.331292 C242.357817,157.331292 201.064503,156.567005 195.816161,156.567005 C190.56782,156.567005 185.843742,154.282944 180.849089,151.409859 C175.854436,148.536774 138.435247,105.232854 132.973453,102.023212 C127.511659,98.8135695 124.149128,100.505422 123.018926,103.726059 C122.265458,105.87315 120.985463,113.006425 119.178942,125.125884 C106.371382,211.094535 100.284013,254.147043 100.916834,254.28341 C108.521506,255.922136 129.423012,265.195295 146.609075,274.412831 C163.795138,283.630368 195.33956,306.839108 210.384322,321.600478 C219.051706,330.104598 232.732443,329.591062 241.092911,321.600478 C252.505717,310.692597 285.980687,283.156841 303.419577,274.412831 C320.858467,265.668821 346.635945,247.738916 405.967444,244.891919 C535.588485,238.672107 583.061124,358.406212 585.998593,363.958731 C588.936061,369.51125 594.589696,385.960362 594.589696,388.680094 C594.589696,391.399826 579.063037,376.003584 534.533872,375.452187 C513.204274,375.188067 500.971609,376.188695 488.851592,377.979456 C475.669011,379.927214 461.803171,382.879661 427.665368,391.098724 C397.589105,398.339926 339.141611,413.638653 320.053265,417.110904 C310.064837,418.927841 291.59889,422.778016 282.41283,424.17947 C273.226769,425.580924 265.207673,427.486088 241.092911,428.971008 C142.356632,435.050915 92.1210311,394.941123 57.3921328,360.596727 C38.4323518,341.84686 4.92205534,292.37194 0.655586004,228.435677 C-2.89289672,175.258986 14.9974234,110.340831 67.1612928,60.8011178 C182.043672,-48.3019882 319.303989,22.905392 324.98577,26.7565516 C330.667551,30.6077112 350.570688,43.5702955 361.180485,54.745147 C371.790282,65.9199986 386.567988,85.4179405 392.05573,95.5659406 C397.543472,105.713941 410.681329,132.409578 414.846079,156.567005 C416.434664,165.781513 418.271069,181.810135 415.914887,192.216023 C413.558705,202.621912 410.081252,207.488745 405.967444,210.50526 Z M471.283281,357.39858 C474.030901,354.572589 492.177564,350.322661 513.892722,350.816979 C534.567208,351.287608 559.359147,356.585595 559.359147,355.51735 C559.359147,354.514227 541.507738,322.627594 518.763377,303.253768 C505.945496,292.335397 502.438553,291.025697 494.698641,285.844287 C488.638571,281.787431 483.763273,278.086492 481.378671,279.250524 C479.576136,280.130422 490.935283,293.158804 493.204604,303.253768 C496.220014,316.667671 490.9642,328.584138 488.304218,333.41358 C481.378671,345.987544 472.692851,350.907527 471.283281,352.760376 C469.320729,355.340106 469.834848,358.888326 471.283281,357.39858 Z"id="Combined-Shape"fill="#DB542F"fill-rule="nonzero"></path><path d="M124.269531,101.663556 C123.71674,102.222757 123.299195,102.927402 123.018926,103.726059 C122.265458,105.87315 120.985463,113.006425 119.178942,125.125884 C106.371382,211.094535 100.284013,254.147043 100.916834,254.28341 C108.521506,255.922136 129.423012,265.195295 146.609075,274.412831 C163.795138,283.630368 195.33956,306.839108 210.384322,321.600478 C219.051706,330.104598 232.732443,329.591062 241.092911,321.600478 C252.505717,310.692597 285.980687,283.156841 303.419577,274.412831 C318.418318,266.892333 339.585344,252.576773 382.963239,246.906469 C382.863843,246.982734 382.751195,247.057123 382.625107,247.129634 C360.215763,260.016863 302.905393,301.507043 281.401998,324.406059 C251.036267,356.742598 233.981406,375.692929 229.781019,381.69161 C215.505525,402.078812 203.693196,402.078812 189.115767,381.69161 C184.032672,374.582669 171.955923,347.218334 140.584753,324.406059 C110.050789,302.202577 66.9769791,285.850282 61.6574349,283.245103 C56.3378907,280.639924 46.2087011,283.767012 56.3378907,264.423612 C66.4670803,245.080212 118.34202,107.015496 123.219804,101.450334 C123.413706,101.229107 123.762252,101.310184 124.269531,101.663556 Z"id="Combined-Shape"fill="url(#linearGradient-1)"></path><path d="M144.412304,221.199295 C148.497769,220.708023 152.186044,220.708023 155.477131,221.199295 C160.413761,221.936203 170.632064,226.243167 173.78433,228.769993 C174.853535,229.627057 188.223924,240.76347 189.515855,249.367158 C189.918965,252.051693 189.515855,252.058905 189.515855,252.90233 C189.515855,253.464614 186.337884,253.464614 179.981943,252.90233 C168.860015,249.687221 161.18792,246.11257 156.965657,242.178377 C150.632262,236.277088 145.162176,228.930692 144.412304,225.064993 C143.912389,222.487861 143.912389,221.199295 144.412304,221.199295 Z"id="Path-3"fill="#DB542F"></path><path d="M261.374936,221.368454 C265.460401,220.877182 269.148677,220.877182 272.439763,221.368454 C277.376393,222.105362 287.594696,226.412326 290.746962,228.939152 C291.816167,229.796217 305.186557,240.932629 306.478487,249.536318 C306.881597,252.220853 306.478487,252.228064 306.478487,253.07149 C306.478487,253.633773 303.300516,253.633773 296.944575,253.07149 C285.822647,249.85638 278.150552,246.281729 273.928289,242.347536 C267.594895,236.446247 262.124808,229.099851 261.374936,225.234153 C260.875021,222.65702 260.875021,221.368454 261.374936,221.368454 Z"id="Path-3"fill="#DB542F"transform="translate(283.828824, 237.246601) scale(-1, 1) translate(-283.828824, -237.246601) "></path><path d="M217.401791,287.108711 C215.734305,287.108711 212.016489,287.686017 210.274407,288.726392 C208.532325,289.766768 207.458893,290.406998 205.901072,292.548821 C204.343252,294.690645 204.561054,296.600631 205.266059,299.191854 C205.971064,301.783077 218.935551,315.057147 221.094066,316.448521 C223.252582,317.839896 228.072996,317.839896 230,316.33981 C231.927004,314.839724 245.123003,301.674365 245.828007,299.083142 C246.533012,296.491919 246.750815,294.581933 245.192994,292.44011 C243.635173,290.298286 242.561741,289.658056 240.819659,288.617681 C239.077577,287.577305 235.359761,287 233.692276,287 L217.401791,287.108711 Z"id="Path-4"fill="#DB542F"></path></g></g></svg></a>`)}})();



(function () {
    const _debug = 0;
    let art = {}; //播放器
    let seriesNum = 0;
    let sourceSelected = false;
    const { query: $, queryAll: $$, isMobile } = Artplayer.utils;
    const tip = (message) => alert(message);




    //获取豆瓣影片名称
    const videoName = isMobile ? $(".sub-title").innerText : document.title.slice(0, -5);

    // debug
    const log = (function () {
        if (_debug) return console.log.bind(console);
        return function () { };
    })();


    function htmlToElement(html) {//将html转为element
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }

    function addScript() {//添加统计脚本
        let statistic = document.createElement('script');
        statistic.setAttribute("src", "https://hm.baidu.com/hm.js?f02301d8266631b0285c3e325c9a574b")
        document.head.appendChild(statistic);
    }

    //搜索源
    const searchSource = [
{name:"红牛",searchUrl:"https://www.hongniuzy2.com/api.php/provide/vod/",},
{name:"新浪",searchUrl:"https://api.xinlangapi.com/xinlangapi.php/provide/vod/",},
{name:"卧龙",searchUrl:"https://collect.wolongzyw.com/api.php/provide/vod/",},
{name:"量子",searchUrl:"https://cj.lziapi.com/api.php/provide/vod/",},
{name:"影图",searchUrl:"https://cj.vodimg.top/api.php/provide/vod/",},
{name:"金鹰",searchUrl:"https://jyzyapi.com/provide/vod/",},
{name:"樱花",searchUrl:"https://m3u8.apiyhzy.com/api.php/provide/vod/",},
{name:"天翼",searchUrl:"https://www.911ysw.top/tianyi.php/provide/vod/",},
{name:"闪电",searchUrl:"https://sdzyapi.com/api.php/provide/vod/",},
{name:"人人",searchUrl:"https://www.rrvipw.com/api.php/provide/vod/",},
{name:"光速",searchUrl:"https://api.guangsuapi.com/api.php/provide/vod/",},
{name:"天空",searchUrl:"http://api.tiankongapi.com/api.php/provide/vod/",},
{name:"快播",searchUrl:"http://www.kuaibozy.com/api.php/provide/vod/",},
{name:"星辰",searchUrl:"http://www.kuaibocaiji.com/api.php/provide/vod/",},
{name:"TVB",searchUrl:"http://www.tvyb02.com/api.php/provide/vod/",},
{name:"飘花",searchUrl:"http://www.zzrhgg.com/api.php/provide/vod/",},
{name:"FOX",searchUrl:"https://api.foxzyapi.com/api.php/provide/vod/",},
{name:"酷点",searchUrl:"https://api.kuapi.cc/api.php/provide/vod/",},
{name:"优酷",searchUrl:"https://api.ukuapi.com/api.php/provide/vod/",},
{name:"无尽",searchUrl:"https://api.wujinapi.net/api.php/provide/vod/",},
{name:"鱼乐",searchUrl:"https://api.yulecj.com/api.php/provide/vod/",},
{name:"68云",searchUrl:"https://caiji.68zyapi.com/api.php/provide/vod/",},
{name:"快车",searchUrl:"https://caiji.kczyapi.com/api.php/provide/vod/",},
{name:"乐活",searchUrl:"https://lehootv.com/api.php/provide/vod/",},
{name:"飘零",searchUrl:"https://p2100.net/api.php/provide/vod/",},
{name:"飞速",searchUrl:"https://www.feisuzyapi.com/api.php/provide/vod/",},
{name:"FF9",searchUrl:"https://www.ff9.top/api.php/provide/vod/",},
{name:"影乐",searchUrl:"https://api.ylzy1.com/api.php/provide/vod/",},
{name:"南国",searchUrl:"http://api.nguonphim.tv/api.php/provide/vod/",},
{name:"百度",searchUrl:"https://api.apibdzy.com/api.php/provide/vod/",},
{name:"CK云",searchUrl:"https://ckzy.me/api.php/provide/vod/",},
{name:"优猫",searchUrl:"http://umao.ml/api.php/provide/vod/",},
{name:"飞飞",searchUrl:"http://www.feifei67.com/api.php/provide/vod/",},
{name:"TOM",searchUrl:"https://api.tomcaiji.com/api.php/provide/vod/",},
{name:"映迷",searchUrl:"https://www.inmi.app/api.php/provide/vod/",},
{name:"龙腾",searchUrl:"http://175.178.7.35:2020/api.php/provide/vod/",},
{name:"77韩",searchUrl:"https://www.77hanju.com/api.php/provide/vod/",},
{name:"淘片",searchUrl:"https://taopianapi.com/home/cjapi/as/mc/vod/",},
{name:"八戒",searchUrl:"http://cj.bajiecaiji.com/inc/seacmsapi.php/provide/vod/",},
{name:"韩剧",searchUrl:"http://www.hanjuzy.com/inc/api.php/provide/vod/",},
{name:"资源",searchUrl:"https://api.1080zyku.com/inc/ldg_api_all.php/provide/vod/",},
{name:"爱酷",searchUrl:"https://www.zhanlangbu.com/api.php/provide/vod/",},
{name:"看看",searchUrl:"https://zy.hikan.xyz/api.php/provide/vod/",},
{name:"每天",searchUrl:"http://47.113.126.237:1234/api.php/provide/vod/",},
{name:"干饭",searchUrl:"http://124.220.183.81:83/api.php/provide/vod/",},
{name:"易看",searchUrl:"https://api.yikanapi.com/api.php/provide/vod/",},
{name:"海玉",searchUrl:"http://tv2.hykjtv.cn/api.php/provide/vod/",},
{name:"阿里",searchUrl:"http://aliys.cn:90/api.php/provide/vod/",},
{name:"创艺",searchUrl:"https://www.30dian.cn/api.php/provide/vod/",},
{name:"39影",searchUrl:"https://www.39kan.com/api.php/provide/vod/",},
{name:"云播",searchUrl:"https://api.yparse.com/api/xml",},
{name:"天天",searchUrl:"http://47.113.126.237:1234/api.php/provide/vod/",},
{name:"瞬间",searchUrl:"http://app.7en7.com/api.php/provide/vod/",},
{name:"快播",searchUrl:"https://www.kuaibozy.com/api.php/provide/vod",},
    ];

    const pushSource = ()=>{
      let sourceAdded = GM_getValue("sourceAdded","")

      sourceAdded.split(",").forEach((item)=>{
        if(item==="")return
        name_url = item.split("|")
        searchSource.push({
          "name":name_url[0],
          "searchUrl":name_url[1]
        })
      })
    }


    const SourceTop = ()=>{
      let sourceAdded = prompt("请输入自定义源，名称与链接用|隔开，每项用英文逗号隔开")
      GM_setValue("sourceAdded",sourceAdded)
      pushSource()
      }




    GM_registerMenuCommand("自定义源",SourceTop)




    //处理搜索到的结果:从返回结果中找到对应片子
    function handleResponse(r) {
        if (!r || r.list.length == 0) {
            log("未搜索到结果");
            return 0
        }
        let video, found = false;
        for (let item of r.list) {
            log("正在对比剧集年份和演员");
            log(item)
            let yearEqual = getVideoYear(item.vod_year);
            let actorContain = videoActor(item.vod_actor.split(",")[0])

            if (yearEqual === true|| actorContain=== true){
              video = item;
              found = true;
              break
            }



        }
        if (found == false) {
            log("没有找到匹配剧集的影片，怎么回事哟！");
            return 0
        }

        let playList = video.vod_play_url.split("$$$").filter(str => str.includes("m3u8"));
        if (playList.length == 0) {
            log("没有m3u8资源, 无法测速, 无法播放");
            return 0
        }
        playList = playList[0].split("#");
        playList = playList.map(str => {
            let index = str.indexOf("$");
            return { "name": str.slice(0, index), "url": str.slice(index + 1) }
        });

        return playList
    }

    //到电影网站搜索电影
    const search = (url) => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: encodeURI(`${url}?ac=detail&wd=${videoName}`),
            timeout: 3000,
            responseType: 'json',
            onload(r) {
                try {
                    resolve(handleResponse(r.response, videoName));
                } catch (e) {
                    log("垃圾资源，解析失败了，可能有防火墙");
                    log(e);
                    reject()
                }
            },
            onerror: reject,
            ontimeout: reject
        });
    });

    //播放按钮
    class PlayBtn {
        constructor() {
            const e = htmlToElement(`<button class="liu-btn play-btn">一键播放</button>`);
            $(isMobile ? ".sub-original-title" : "h1").appendChild(e);
            const render = async (item) => {
                const playList = await search(item.searchUrl);
                if (playList == 0) return;
                if (e.loading) {
                    e.loading = false;
                    new UI(playList);
                }

                //渲染资源列表
                const btn = new SourceButton({ name: item.name, playList }).element;
                if(!sourceSelected){
                  btn.classList.add("selected")
                  sourceSelected = true
                }



                $(".sourceButtonList").appendChild(btn);

            };
            e.onclick = function () {
                e.loading = true;
                //tip("正在搜索");
                searchSource.forEach(render);
                setTimeout(() => {
                    if (e.loading == true) {
                        e.loading = false;
                        tip("未搜索到资源")
                    } else {
                        speedTest()
                    }
                }, 3500);
            };
        }
    }




    class UI {
        constructor(playList) {
            document.body.appendChild(htmlToElement(
                `<div class="liu-playContainer">
				<button class="liu-closePlayer liu-btn">X</button>

				<div class="playSpace" >
					<div class="artplayer-app"></div>
          <div class="series">
            <div class="seletor-title">选集</div>
            <div class="series-contianer"></div>
          </div>
				</div>
        <div class="sourceButtonList"></div>
				<div class="mannul">
          <div class="show-series" style="color:#a3a3a3"></div>
          <a class="love-support liu-btn" href="http://babelgo.cn:5230/m/1" target="_blank" style="color:#4aa150">☕赏作者喝一杯咖啡？</a>
          <a class="love-support liu-btn" href="https://t.me/wzxhhgy" target="_blank" style="color:#4aa150">电报群</a>
          <a class="love-support liu-btn" href="https://greasyfork.org/zh-CN/scripts/459540-%E6%88%91%E5%8F%AA%E6%83%B3%E5%A5%BD%E5%A5%BD%E8%A7%82%E5%BD%B1/feedback" target="_blank" style="color:#4aa150">👉反馈</a>
        </div>
			</div>`
            )).querySelector(".liu-closePlayer").onclick = function () {
                this.parentNode.remove();
                document.body.style.overflow = 'auto';
            };
            document.body.style.overflow = 'hidden';
            //第n集开始播放
            log(playList[seriesNum].url);
            initArt(playList[seriesNum].url);
            new SeriesContainer(playList);
        }
    }

    //初始化播放器
    function initArt(url) {
        art = new Artplayer({
            container: ".artplayer-app",
            url:url,
            pip: true,
            fullscreen: true,
            fullscreenWeb: true,
            screenshot: true,
            hotkey: true,
            airplay: true,
            playbackRate: true,
            controls: [{
                name: "resolution",
                html: "分辨率",
                position: "right"
            }],
            customType: {
                m3u8(video, url) {
                    // Attach the Hls instance to the Artplayer instance
                    if (art.hls) art.hls.destroy();
                    art.hls = new Hls();
                    art.hls.loadSource(url);
                    art.hls.attachMedia(video);
                    if (!video.src) {//兼容safari
                        video.src = url;
                    }
                },
            }
        });
        art.once('destroy', () => art.hls.destroy());
        art.on("video:loadedmetadata", () => {
            art.controls.resolution.innerText = art.video.videoHeight + "P";
        });
        log(art)
    }


      //影视源选择按钮
    class SourceButton {
        constructor(item) {
            this.element = htmlToElement(`<button class="source-selector liu-btn" >${item.name}</button>`);
            this.element.onclick = () => {
                $(".selected")?$(".selected").classList.remove("selected"):null;
                this.element.classList.add("selected")
                switchUrl(item.playList[seriesNum].url);
                new SeriesContainer(item.playList);

            };
            this.element._playList = item.playList
            this.element._sourceName = item.name
        }
        //sources 是[{name:"..资源",playList:[{name:"第一集",url:""}]}]
    }

    //剧集选择器
    class SeriesButton {
        constructor(pNode, name, url, index) {
            let selector = htmlToElement(
                `<button class="series-selector liu-btn" style="color:#a3a3a3" >${name.slice(0,4)}</button>`
            )
            pNode.appendChild(selector).onclick = () => {
                seriesNum = index;
                switchUrl(url);
                $(".playing")?$(".playing").classList.remove("playing"):null;
                // $(".show-series").innerText = `正在播放第${index + 1}集`;
                selector.classList.add("playing")
                speedTest()
            };
        }
    }

    //剧集选择器的container
    class SeriesContainer {
        constructor(playList) {
            //const e = htmlToElement(`<div class="series-select-space" style="display:flex;flex-wrap:wrap;overflow:scroll;align-content: start;"></div>`);
          const e = $(".series-contianer")
          e.innerHTML = ""
          for (let [index, item] of playList.entries()) {
                new SeriesButton(e, item.name, item.url, index);
          }
          seriesNum==0?$(".series-selector").classList.add("playing"):null;
        }
    }



    function switchUrl(url) {//兼容safari
        art.switchUrl(url)
        if (art.video.src != url) {
            art.video.src = url;
        }
    }

    //获取电影的年份
    function getVideoYear(outYear) {
        const e = $(isMobile ? ".sub-original-title" : ".year");
        if (!e) {
            log("获取年份失败，请检查！");
            return 0;
        }
        return e.innerText.includes(outYear);
    }
    //对比电影演员
    function videoActor(outActor){
      const e = $(isMobile?".bd":".actor")
      if (!e) {
            log("获取演员失败，请检查！");
            return 0;
      }
      //log(`${outActor}：匹配结果${e.innerText.includes(outActor)}`)
      return e.innerText.includes(outActor);
    }


    //下载
    const get = (url) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: encodeURI(url),
                timeout: 10000,
                onload: function (r) {
                    resolve(r.response)
                },
                onerror: function (e) {
                    resolve("html")
                },
                ontimeout: function (o) {
                    resolve("html")
                }
            })
        })
    }

    //下载m3u8的内容，返回片段列表
    async function downloadM3u8(url) {
        let domain = url.split("/")[0]
        let baseUrl = url.split("/")[2]
        let downLoadList = []
        log(`正在获取index.m3u8 ${url}`)
        let downloadContent = await get(url)

        if (downloadContent.includes("html")) {
            log(downloadContent)
            log(`下载失败，被反爬虫了`)
            return []
        }

        if (downloadContent.includes("index.m3u8")) { //如果是m3u8地址
            let lines = downloadContent.split("\n")
            for (let item of lines) {
                if (/^[#\s]/.test(item)) continue //跳过注释和空白行
                if (/^\//.test(item)) {
                    downLoadList = await downloadM3u8(domain + "//" + baseUrl + item)
                } else if (/^(http)/.test(item)) {
                    downLoadList = await downloadM3u8(item)
                } else {
                    downLoadList = await downloadM3u8(url.replace("index.m3u8", item))
                }
            }
        } else {//如果是ts地址
            let lines = downloadContent.split("\n")
            for (let item of lines) {
                if (/^[#\s]/.test(item)) continue//跳过注释和空白行
                if (/^(http)/.test(item)) {//如果是http直链
                    downLoadList.push(item)
                } else if (/^\//.test(item)) { //如果是绝对链接
                    downLoadList.push(domain + "//" + baseUrl + item)
                } else {
                    downLoadList.push(url.replace("index.m3u8", item))
                }
            }
        }
        // log(`测试列表为${downLoadList}`)
        return downLoadList

    }


    //对资源进行测速
    function speedTest() {
        // tip("脚本自动测试源的速度，随后请自行切换源进行尝试")
        let sourceButtons = $$(".source-selector")
        //log(sourceButtons)
        sourceButtons.forEach(async (e) => {
            let url = e._playList[seriesNum].url
            let tsList = await downloadM3u8(url)
            let downloadList = []
            for (let i = 0; i < 8; i++) {
                downloadList.push(tsList[Math.floor(Math.random() * tsList.length)])
            }

            let downloadSize = 0
            let startTime = Date.now();

            for (item of downloadList) {
                log("正在下载" + item)
                let r = await getBuffer(item)
                downloadSize += r.byteLength / 1024 / 1024
            }
            let endTime = Date.now();
            let duration = (endTime - startTime) / 1000
            let speed = downloadSize / duration ? downloadSize / duration : 0

            log(`速度为${speed}mb/s`)

            e.innerText = e._sourceName + " " + speed.toFixed(2) + "mb/s"
            let state = speed > 1 ? "fast" : "slow"
            e.classList.add(`speed-${state}`)

        })
    }


    //将GM_xmlhttpRequest改造为Promise
    function getBuffer(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                timeout: 3000,
                url: encodeURI(url),
                responseType: "arraybuffer",
                onload: function (r) {
                    resolve(r.response);
                },
                onerror: function (error) {
                  log("速度太慢了或无法测速")
                    resolve({ "byteLength": 0 })
                },
                ontimeout: function (out) {
                    log("速度太慢了或无法测速")
                    resolve({ "byteLength": 0 })
                }
            });
        });
    }

//按钮样式
GM_addStyle(
`
.liu-btn{
  cursor:pointer;
  font-size:1rem;
  padding: 0.6rem 1.2rem;
  border: 1px solid transparent;
}

.play-btn {
  border-radius: 8px;
  cursor: pointer;
  font-weight: bolder;
  background-color:#e8f5e9;
}
.play-btn:hover {
  background-color:#c8e6c9;
}
.play-btn:active{
  background-color: #81c784;
}

.source-selector{
  background-color: #141414;
  color: #99a2aa;
  padding:0.2rem 0.5rem;
  margin:0.5rem 0.875rem;
  border-radius:4px;
}

.series-selector{
  background-color: #141414;
  border-radius:3px;
  color: #99a2aa;
  width:3.5rem;
  height:3.5rem;
  font-size:0.75rem;
  line-height:3.5rem;
  padding:0;
}

.playing{
  border:1px solid #4caf50;
}

.selected{
  border:1px solid #4caf50;
}


.liu-closePlayer{
  border-radius:3px;
  background-color: #141414;
	float:right;
  color: #99a2aa;
  width:2rem;
  height:2rem;
  line-height:2rem;
  padding:0;
  margin:0.5rem 1rem;
}
.liu-closePlayer:hover{
  background-color:#1f1f1f;
  color:white;
}

.love-support{
  margin-top:1rem;
  background-color:#141414;
  margin-right:1rem;
}
.love-support:hover{
  background-color:#1f1f1f;
}


`

);


//剧集选择器布局
GM_addStyle(
`
.series-contianer{
  display:grid;
  grid-template-columns: repeat(5,1fr);
  grid-column-gap:0.5rem;
  grid-row-gap:0.5rem;
  margin-top:1rem;
}
@media screen and (max-width: 1025px) {
.series-contianer{
  display:grid;
  grid-template-columns: repeat(5,1fr);
  grid-column-gap:0.5rem;
  grid-row-gap:0.5rem;
  margin-top:1rem;
}

}


`
)


//布局
GM_addStyle(
`

:root{
  font-size:16px
}

.TalionNav{
	z-index:10;
}
.speed-slow{
	color:#9e9e9e;
}
.speed-fast{
	color:#4aa150;
}



.mannul{
  margin:1rem;
  font-size:1rem;
  display:flex;
  flex-wrap:wrap;
}



.liu-playContainer{
	width:100%;
	height:100%;
	background-color:#1c2022;
	position:fixed;
	top:0;
	z-index:11;
  overflow:auto;
}



.video-selector{
	display:flex;
	flex-wrap:wrap;
	margin-top:1rem;
}

.liu-selector:hover{
	color:#aed0ee;
	background-color:none;
}

.liu-selector{
	color:black;
	cursor:pointer;
	padding:3px;
	margin:5px;
	border-radius:2px;
}

.liu-rapidPlay{
	color: #007722;
}

.liu-light{
	background-color:#7bed9f;
}

.artplayer-app{
  height:600px;
}


.playSpace{
	display: grid;
/* 	height:400px; */
  margin:1rem;
	grid-template-columns: 2fr 1fr;
	grid-row-gap:0px;
	grid-column-gap:1rem;
  margin-top:2rem;
  clear: both;
}



@media screen and (max-width: 1025px) {
	.playSpace{
		display: grid;
/* 		height:600px; */
		grid-template-rows: 1fr 0.5fr;
		grid-template-columns:1fr;
		grid-row-gap:10px;
		grid-column-gap:0px;
	}
}


.seletor-title{
  height:3rem;
  line-height:3rem;
  background-color: #141414;
  color:#fafafa;
  font-size:1.25rem;
  padding: 0 1rem;
}
`
    );
    new PlayBtn();
    addScript();
})();