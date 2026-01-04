// ==UserScript==
// @name         视频分区插件
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  可以通过关键字在b站主页添加一个自定义分区（默认分区为A-soul分区）
// @author       tuntun
// @match        https://www.bilibili.com/*
// @icon         https://i2.hdslb.com/bfs/face/48d65a10a2c643dddc4a51e0a60fae892393417a.jpg
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437803/%E8%A7%86%E9%A2%91%E5%88%86%E5%8C%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/437803/%E8%A7%86%E9%A2%91%E5%88%86%E5%8C%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(function() {
  'use strict';
  GM_addStyle(`
    @media (min-width: 1701px) and (max-width: 2559.9px) {
      .tuntun-grid {
        grid-template-columns: repeat(5,1fr);
      }
    }
    @media (min-width: 1367px) and (max-width: 1700.9px) {
      .tuntun-part {
        grid-column: span 5 !important;
      }
      .tuntun-card-body {
        grid-column: span 5 !important;
        grid-template-columns: repeat(5,1fr) !important;
      }
      .video-card-list.is-main .tuntun-card-body>*:nth-of-type(1n + 9) {
        display: block!important;
      }
    }
    @media (min-width: 1100px) and (max-width: 1366.9px) {
      .tuntun-part {
        grid-column: span 5 !important;
      }
      .tuntun-card-body {
        grid-column: span 5 !important;
        grid-template-columns: repeat(5,1fr) !important;
      }
      .video-card-list.is-main .tuntun-card-body>*:nth-of-type(1n + 9) {
        display: block!important;
      }
    }
    @media (max-width: 1099.9px) {
      .tuntun-part {
        grid-column: span 4 !important;
      }
      .tuntun-card-body {
        grid-column: span 4 !important;
        grid-template-columns: repeat(4,1fr) !important;
      }
      .video-card-list.is-main .tuntun-card-body>*:nth-of-type(7) {
        display: block!important;
      }
      .video-card-list.is-main .tuntun-card-body>*:nth-of-type(8) {
        display: block!important;
      }
    }
    .tuntun-setting-popover {
      width: 300px;
      // height: 200px;
      background-color: white;
      border-radius: 20px;
      position: absolute;
      left: -120px;
      top: 43px;
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
      transition: opacity 0.5s, height 0.25s;
    }

    .tuntun-setting-none {
      opacity: 0;
      height: 0;
      overflow: hidden;
    }

    .tuntun-setting-form {
      padding: 20px 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .tuntun-setting-btn {
      margin: 0 auto;
      width: 84px;
      height: 38px;
      background-color:#b8a6d9;
      border: none;
      border-radius:10px;
      display:inline-block;
      cursor:pointer;
      color:#ffffff;
      font-family:Arial;
      font-size:17px;
      text-decoration:none;
      text-shadow:0px 0px 0px #9752cc;
    }
    .tuntun-setting-btn:hover {
      background-color:#bc80ea;
    }
    .tuntun-setting-btn:active {
      position:relative;
      top:1px;
    }

    .tuntun-setting-input {
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }

    .tuntun-setting-input div {
      margin-right: 10px
    }

    .tuntun-setting-input input,select{
      width: 200px;
      border: 1px solid #ccc;
      padding: 7px 0px;
      border-radius: 3px;
      padding-left: 5px;
      transition: border 0.25s
    }

    .tuntun-setting-input input:focus{
      outline: none;
      border: 1px solid #B8A6D9;
    }

    .tuntun-setting-input select:focus{
      outline: none;
      border: 1px solid #B8A6D9;
    }
    
    .tuntun-setting-imgRadius {
      padding-left: 0px !important;
    }
  `);

  const getTemplete = (videoKey, imgUrl = '') => {
    return `
    <section class="bili-grid tuntun-grid">
      <div class="video-card-list is-main tuntun-part">
        <div class="area-header" style="z-index: 1000;">
          <div class="left tuntun-part-left">
            <a id="A-soul分区" class="the-world area-anchor" data-id="8"></a>
            <img class="icon tuntun-part-img" src="${imgUrl}"></img>
            <a
              class="title"
              href="https://search.bilibili.com/all?keyword=${videoKey}"
              target="_blank"
              >
              <span>${videoKey}分区</span>
            </a>
          </div>
          <div class="right" style="position: relative;">
            <div id="tuntun-setting" style="position: relative;">
              <button class="primary-btn roll-btn">
                <span>设置</span></button
              >
              <div
                class="tuntun-setting-popover tuntun-setting-none"
              >
                <form class="tuntun-setting-form">
                  <div class="tuntun-setting-input">
                    <div>分区名称:</div>
                    <input type="text" name="name" />
                  </div>
                  <div class="tuntun-setting-input">
                    <div>分区图片:</div>
                    <input type="text" name="picUrl" />
                  </div>
                  <div class="tuntun-setting-input">
                    <div>图片圆角:</div>
                    <input class="tuntun-setting-imgRadius" type="range" min="0" max="50"/>
                  </div>
                  <div class="tuntun-setting-input">
                    <div>时间范围:</div>
                    <select name="timeRange" id="">
                      <option value="7">一周之内</option>
                      <option value="30" selected>一月之内</option>
                      <option value="90">三个月之内</option>
                      <option value="0">不限时间</option>
                    </select>
                  </div>
                  <input class="tuntun-setting-btn" type="submit" value="确认" />
                </form>
              </div>
            </div>
            <button id="refreshVideo" class="primary-btn roll-btn">
              <svg style="transform: rotate(0deg)">
                <use xlink:href="#widget-roll"></use></svg><span>换一换</span></button
            >
            <a
              class="primary-btn see-more tuntun-see-more"
              href="https://search.bilibili.com/all?keyword=${videoKey}"
              target="_blank"
              ><span>查看更多</span><svg><use xlink:href="#widget-arrow"></use></svg></a>
          </div>
        </div>
        <div class="video-card-body tuntun-card-body">
        </div>
      </div>

      <!-- 
        <aside>
          <div class="aside-wrap">
            <div class="aside-head">
              <div class="area-header">
                <div class="left">
                  <a
                    class="title rank-title"
                    href="https://www.bilibili.com/v/virtual"
                    target="_blank"
                  ><span>排行榜</span></a>
                </div>
                <div class="right">
                  <a
                    class="primary-btn see-more"
                    href="https://www.bilibili.com/v/virtual"
                    target="_blank"
                    ><span>更多</span><svg><use xlink:href="#widget-arrow"></use></svg></a>
                </div>
              </div>
            </div>
          </div>
        </aside>
      -->
    </section>
    `;
  };

  let asideBody = `
  <div class="aside-body">
          <div class="aside-core">
            <div class="bili-rank-list-video bili-rank-list-video__grid">
              <ul class="bili-rank-list-video__list video-rank-list">
                <li class="bili-rank-list-video__item">
                  <div class="bili-rank-list-video__item--wrap">
                    <span class="bili-rank-list-video__item--index" data-index="1"
                      >1</span
                    ><a
                      href="//www.bilibili.com/video/BV1Hi4y1R7gy"
                      class="rank-video-card"
                      target="_blank"
                      data-mod="partition_rank"
                      data-idx="content"
                      data-ext="click"
                      ><div class="rank-video-card__image">
                        <picture class="v-img rank-video-card__cover"
                          ><!---->
                          <source
                            srcset="
                              //i2.hdslb.com/bfs/archive/c92ce434742fb724af5577de2485a1eaff8aa226.jpg@192w_108h_1c_100q.webp
                            "
                            type="image/webp" />
                          <img
                            src="//i2.hdslb.com/bfs/archive/c92ce434742fb724af5577de2485a1eaff8aa226.jpg@192w_108h_1c_100q"
                            alt="B站以前的LV6 VS 现在的LV6 2.0"
                            loading="lazy"
                            onload=""
                        /></picture>
                      </div>
                      <div class="rank-video-card__info">
                        <h3
                          class="rank-video-card__info--tit"
                          title="B站以前的LV6 VS 现在的LV6 2.0"
                        >
                          B站以前的LV6 VS 现在的LV6 2.0
                        </h3>
                      </div></a
                    >
                  </div>
                </li>
                <li class="bili-rank-list-video__item">
                  <div class="bili-rank-list-video__item--wrap">
                    <span class="bili-rank-list-video__item--index" data-index="2"
                      >2</span
                    ><a
                      href="//www.bilibili.com/video/BV1Rb4y1Y7Pw"
                      class="rank-video-card rank-video-card__concise"
                      target="_blank"
                      data-mod="partition_rank"
                      data-idx="content"
                      data-ext="click"
                      ><!---->
                      <div class="rank-video-card__info">
                        <h3
                          class="rank-video-card__info--tit"
                          title="【自制动画】《鬼灭之刃》无限城篇（香奈乎单挑童磨 片段）"
                        >
                          【自制动画】《鬼灭之刃》无限城篇（香奈乎单挑童磨 片段）
                        </h3>
                      </div></a
                    >
                  </div>
                </li>
                <li class="bili-rank-list-video__item">
                  <div class="bili-rank-list-video__item--wrap">
                    <span class="bili-rank-list-video__item--index" data-index="3"
                      >3</span
                    ><a
                      href="//www.bilibili.com/video/BV1Z44y177Wt"
                      class="rank-video-card rank-video-card__concise"
                      target="_blank"
                      data-mod="partition_rank"
                      data-idx="content"
                      data-ext="click"
                      ><!---->
                      <div class="rank-video-card__info">
                        <h3
                          class="rank-video-card__info--tit"
                          title="小伙买了80个模型，爆肝一周，只为在家建造一个迷你世界"
                        >
                          小伙买了80个模型，爆肝一周，只为在家建造一个迷你世界
                        </h3>
                      </div></a
                    >
                  </div>
                </li>
                <li class="bili-rank-list-video__item">
                  <div class="bili-rank-list-video__item--wrap">
                    <span class="bili-rank-list-video__item--index" data-index="4"
                      >4</span
                    ><a
                      href="//www.bilibili.com/video/BV1mi4y1R7rT"
                      class="rank-video-card rank-video-card__concise"
                      target="_blank"
                      data-mod="partition_rank"
                      data-idx="content"
                      data-ext="click"
                      ><!---->
                      <div class="rank-video-card__info">
                        <h3
                          class="rank-video-card__info--tit"
                          title="准备好了么？来点刺激的！！！【嘉然】"
                        >
                          准备好了么？来点刺激的！！！【嘉然】
                        </h3>
                      </div></a
                    >
                  </div>
                </li>
                <li class="bili-rank-list-video__item">
                  <div class="bili-rank-list-video__item--wrap">
                    <span class="bili-rank-list-video__item--index" data-index="5"
                      >5</span
                    ><a
                      href="//www.bilibili.com/video/BV1VD4y1c788"
                      class="rank-video-card rank-video-card__concise"
                      target="_blank"
                      data-mod="partition_rank"
                      data-idx="content"
                      data-ext="click"
                      ><!---->
                      <div class="rank-video-card__info">
                        <h3
                          class="rank-video-card__info--tit"
                          title="顶上海鲜战争12分钟总集篇"
                        >
                          顶上海鲜战争12分钟总集篇
                        </h3>
                      </div></a
                    >
                  </div>
                  <!---->
                </li>
                <li class="bili-rank-list-video__item">
                  <div class="bili-rank-list-video__item--wrap">
                    <span class="bili-rank-list-video__item--index" data-index="6"
                      >6</span
                    ><a
                      href="//www.bilibili.com/video/BV14r4y1S71X"
                      class="rank-video-card rank-video-card__concise"
                      target="_blank"
                      data-mod="partition_rank"
                      data-idx="content"
                      data-ext="click"
                      ><!---->
                      <div class="rank-video-card__info">
                        <h3
                          class="rank-video-card__info--tit"
                          title="【原神手书】荒泷一斗 【Misfit Lunatic】"
                        >
                          【原神手书】荒泷一斗 【Misfit Lunatic】
                        </h3>
                      </div></a
                    >
                  </div>
                  <!---->
                </li>
                <li class="bili-rank-list-video__item">
                  <div class="bili-rank-list-video__item--wrap">
                    <span class="bili-rank-list-video__item--index" data-index="7"
                      >7</span
                    ><a
                      href="//www.bilibili.com/video/BV1jL411L7Vm"
                      class="rank-video-card rank-video-card__concise"
                      target="_blank"
                      data-mod="partition_rank"
                      data-idx="content"
                      data-ext="click"
                      ><!---->
                      <div class="rank-video-card__info">
                        <h3
                          class="rank-video-card__info--tit"
                          title="【平成三萌】摇起来迎接2022~~~~~~"
                        >
                          【平成三萌】摇起来迎接2022~~~~~~
                        </h3>
                      </div></a
                    >
                  </div>
                  <!---->
                </li>
                <li class="bili-rank-list-video__item">
                  <div class="bili-rank-list-video__item--wrap">
                    <span class="bili-rank-list-video__item--index" data-index="8"
                      >8</span
                    ><a
                      href="//www.bilibili.com/video/BV1tY411p7G5"
                      class="rank-video-card rank-video-card__concise"
                      target="_blank"
                      data-mod="partition_rank"
                      data-idx="content"
                      data-ext="click"
                      ><!---->
                      <div class="rank-video-card__info">
                        <h3
                          class="rank-video-card__info--tit"
                          title="你瞧瞧现在哪儿有萌新啊"
                        >
                          你瞧瞧现在哪儿有萌新啊
                        </h3>
                      </div></a
                    >
                  </div>
                  <!---->
                </li>
                <li class="bili-rank-list-video__item">
                  <div class="bili-rank-list-video__item--wrap">
                    <span class="bili-rank-list-video__item--index" data-index="9"
                      >9</span
                    ><a
                      href="//www.bilibili.com/video/BV1ji4y1R7LL"
                      class="rank-video-card rank-video-card__concise"
                      target="_blank"
                      data-mod="partition_rank"
                      data-idx="content"
                      data-ext="click"
                      ><!---->
                      <div class="rank-video-card__info">
                        <h3
                          class="rank-video-card__info--tit"
                          title="女生想让男朋友知道的事有哪些？"
                        >
                          女生想让男朋友知道的事有哪些？
                        </h3>
                      </div></a
                    >
                  </div>
                  <!---->
                </li>
                <li class="bili-rank-list-video__item">
                  <div class="bili-rank-list-video__item--wrap">
                    <span
                      class="bili-rank-list-video__item--index"
                      data-index="10"
                      >10</span
                    ><a
                      href="//www.bilibili.com/video/BV12L4y1E7G2"
                      class="rank-video-card rank-video-card__concise"
                      target="_blank"
                      data-mod="partition_rank"
                      data-idx="content"
                      data-ext="click"
                      ><!---->
                      <div class="rank-video-card__info">
                        <h3
                          class="rank-video-card__info--tit"
                          title="看到朋友脱单我比si了还难受"
                        >
                          看到朋友脱单我比si了还难受
                        </h3>
                      </div></a
                    >
                  </div>
                  <!---->
                </li>
              </ul>
            </div>
            <!----><!---->
          </div>
    </div>`

  const Tool = {
    // 大数转万
    formatBigNumber: (num) => {
      return num > 10000 ? `${(num / 10000).toFixed(2)}万` : num
    },
    // 字符串转DOM
    s2d: (string) => {
      return new DOMParser().parseFromString(string, 'text/html').body
        .childNodes[0]
    },
    // 发布时间格式化
    diffTime: (time) => {
      let upDate = new Date(parseInt(time, 10) * 1000);
      let nowDate = new Date();
      let nowTime = nowDate.getTime(),
          upTime = upDate.getTime(),
          Day = 24 * 60 * 60 * 1000,
          Hours = 60 * 60 * 1000,
          Minutes = 60 * 1000,
          diffDay = parseInt((nowTime - upTime) / Day),
          diffHours = parseInt((nowTime - upTime) / Hours),
          diffMinutes = Math.floor((nowTime - upTime) / Minutes);
      if(diffDay != 0 && diffDay < 7) {
        if ( diffDay === 1 ) {
          return '昨天'
        }
        return diffDay + '天前';
      }
      else if(diffDay === 0 && diffHours != 0) {
        return diffHours + '小时前';
      }
      else if(diffDay === 0 && diffHours === 0 && diffMinutes != 0) {
        return diffMinutes + '分钟前';
      }
      else if (diffDay === 0 && diffHours === 0 && diffMinutes === 0) {
        return '刚刚';
      }
      else {
        let month = upDate.getMonth() + 1;
        let day = upDate.getDate();
        if (nowDate.getFullYear() !== upDate.getFullYear()) {
          return `${upDate.getFullYear()}-${month < 10 ? 0 : ''}${month}-${day < 10 ? 0 : ''}${day}`
        }
        return `${month < 10 ? 0 : ''}${month}-${day < 10 ? 0 : ''}${day}`
      }    
    },
    // 判断发布时间与现在时间是否过长
    isTimeTooLate: (time, rangeDay = 30) => {
      let day = parseInt(rangeDay, 10);
      if (day === 0) {
        return false;
      }
      let upData = new Date(parseInt(time, 10) * 1000);
      let nowTime = new Date().getTime(),
          upTime = upData.getTime(),
          Day = 24 * 60 * 60 * 1000,
          diffDay = parseInt((nowTime - upTime) / Day);
      if (diffDay > day) {
        return true;
      }
      return false;
    }
  }

  const API = {
    // 封装get方法
    Get: async (props) => {
      const { url: baseUrl, params = {} } = props;
      let pStr = Object.keys(params).map((key) => {
        return `${key}=${params[key]}`;
      }).join('&');
      let url = `${baseUrl}${pStr !== '' ? '?' : ''}${pStr}`;
      try {
        let res = await fetch(url, {
          credentials: "include"
        });
        return (await res.json()).data;
      } catch (error) {
        console.error('Get Error', error);
      }
    },
    // 通过关键词获取视频数据
    getVideo: async (keyWord, page = 1) => {
      try {
        let res = await API.Get({
          url: 'https://api.bilibili.com/x/web-interface/search/type',
          params: {
            search_type: 'video',
            keyword: keyWord,
            page: page,
          }
        });
        return res.result;
      } catch (error) {
        console.log('getVideo', error);
      }
    },
  }
  
  let videoList = [];
  let page = 1;
  let searchPage = 1;
  let bvList = [];
  let pageSize = 10;
  let videoKey = GM_getValue('videoKey', 'A-soul');
  let rangeDay = GM_getValue('rangeDay', '30');
  let imgBorderRadius = GM_getValue('imgBorderRadius', '15');
  let defaultImgUrl = 'https://i2.hdslb.com/bfs/face/48d65a10a2c643dddc4a51e0a60fae892393417a.jpg';
  let imgUrl = GM_getValue('imgUrl', defaultImgUrl);

  // 获取数据并渲染
  const getVideoCardTemplete = (data) => {
    let videoCardBody = document.querySelector('.video-card-body');
    videoCardBody.innerHTML = '';
    data.forEach((item, index) => {
      if (index < pageSize) {
        const {
          bvid, pic, mid,
          upic, author, play,
          like, duration, pubdate } = item;
        let title = item.title.replace(/<em class="keyword">(.*?)<\/em>/g, '$1');
        // let domStr = `
        // <div class="bili-video-card">
        //   <div class="bili-video-card__skeleton hide">
        //     <div class="bili-video-card__skeleton--cover"></div>
        //     <div class="bili-video-card__skeleton--info">
        //       <div class="bili-video-card__skeleton--face"></div>
        //       <div class="bili-video-card__skeleton--right">
        //         <p class="bili-video-card__skeleton--text"></p>
        //         <p class="bili-video-card__skeleton--text short"></p>
        //         <p class="bili-video-card__skeleton--light"></p>
        //       </div>
        //     </div>
        //   </div>
        //   <div class="bili-video-card__wrap __scale-wrap">
        //     <a
        //       href="//www.bilibili.com/video/${bvid}"
        //       target="_blank"
        //       data-mod="partition_recommend"
        //       data-idx="content"
        //       data-ext="click"
        //       ><div class="bili-video-card__image __scale-player-wrap">
        //         <div class="bili-video-card__image--wrap">
        //           <div class="bili-watch-later" style="display: none">
        //             <svg class="bili-watch-later__icon">
        //               <use xlink:href="#widget-watch-later"></use></svg><span
        //               class="bili-watch-later__tip"
        //               style="display: none"
        //             ></span>
        //           </div>
        //           <picture class="v-img bili-video-card__cover"
        //             ><!---->
        //             <source
        //               srcset="
        //                 ${pic}@672w_378h_1c_100q.webp
        //               "
        //               type="image/webp" />
        //             <img
        //               src="${pic}@672w_378h_1c_100q"
        //               alt="${title}"
        //               loading="lazy"
        //               onload=""
        //           /></picture>
        //           <div class="v-inline-player"></div>
        //         </div>
        //         <div class="bili-video-card__mask">
        //           <div class="bili-video-card__stats">
        //             <div class="bili-video-card__stats--left">
        //               <span class="bili-video-card__stats--item"
        //                 ><svg class="bili-video-card__stats--icon">
        //                   <use xlink:href="#widget-play-count"></use></svg><span class="bili-video-card__stats--text"
        //                   >${Tool.formatBigNumber(play)}</span
        //                 ></span
        //               ><span class="bili-video-card__stats--item"
        //                 ><svg class="bili-video-card__stats--icon">
        //                   <use xlink:href="#widget-agree"></use></svg><span class="bili-video-card__stats--text"
        //                   >${Tool.formatBigNumber(like)}</span
        //                 ></span
        //               >
        //             </div>
        //             <span class="bili-video-card__stats__duration">${duration}</span>
        //           </div>
        //         </div>
        //       </div></a
        //     >
        //     <div class="bili-video-card__info __scale-disable">
        //       <a
        //         href="//space.bilibili.com/${mid}"
        //         target="_blank"
        //         data-mod="partition_recommend"
        //         data-idx="content"
        //         data-ext="click"
        //         ><div class="v-avatar bili-video-card__avatar">
        //           <picture class="v-img v-avatar__face"
        //             ><!---->
        //             <source
        //               srcset="
        //                 ${upic.substr(5)}@72w_72h.webp
        //               "
        //               type="image/webp" />
        //             <img
        //               src="${upic.substr(5)}@72w_72h"
        //               alt="${author}"
        //               loading="lazy"
        //               onload="" /></picture
        //           ><!---->
        //         </div></a
        //       >
        //       <div class="bili-video-card__info--right">
        //         <a
        //           href="//www.bilibili.com/video/${bvid}"
        //           target="_blank"
        //           data-mod="partition_recommend"
        //           data-idx="content"
        //           data-ext="click"
        //           ><h3
        //             class="bili-video-card__info--tit"
        //             title="${title}"
        //           >
        //             ${title}
        //           </h3></a
        //         >
        //         <p class="bili-video-card__info--bottom">
        //           <a
        //             class="bili-video-card__info--owner"
        //             href="//space.bilibili.com/${mid}"
        //             target="_blank"
        //             data-mod="partition_recommend"
        //             data-idx="content"
        //             data-ext="click"
        //             ><span class="bili-video-card__info--author">${author}</span
        //             ><span class="bili-video-card__info--date"
        //               >· ${Tool.diffTime(pubdate)}</span
        //             ></a
        //           >
        //         </p>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        // `;
        let domStr = `
          <div class="bili-video-card" data-report="partition_recommend.content">
            <div class="bili-video-card__skeleton hide">
              <div class="bili-video-card__skeleton--cover"></div>
              <div class="bili-video-card__skeleton--info">
                <div class="bili-video-card__skeleton--face"></div>
                <div class="bili-video-card__skeleton--right">
                  <p class="bili-video-card__skeleton--text"></p>
                  <p class="bili-video-card__skeleton--text short"></p>
                  <p class="bili-video-card__skeleton--light"></p>
                </div>
              </div>
            </div>
            <div class="bili-video-card__wrap __scale-wrap"><a href="//www.bilibili.com/video/${bvid}" target="_blank"
                data-mod="partition_recommend" data-idx="content" data-ext="click">
                <div class="bili-video-card__image __scale-player-wrap">
                  <div class="bili-video-card__image--wrap">
                    <div class="bili-watch-later" style="display: none;"><svg class="bili-watch-later__icon">
                        <use xlink:href="#widget-watch-later"></use>
                      </svg><span class="bili-watch-later__tip" style="display: none;"></span></div>
                    <picture class="v-img bili-video-card__cover">
                      <!---->
                      <source srcset="${pic}@672w_378h_1c.webp"
                        type="image/webp"><img
                        src="${pic}@672w_378h_1c"
                        alt="${title}" loading="lazy" onload="">
                    </picture>
                    <div class="v-inline-player"></div>
                  </div>
                  <div class="bili-video-card__mask">
                    <div class="bili-video-card__stats">
                      <div class="bili-video-card__stats--left"><span class="bili-video-card__stats--item"><svg
                            class="bili-video-card__stats--icon">
                            <use xlink:href="#widget-play-count"></use>
                          </svg><span class="bili-video-card__stats--text">${Tool.formatBigNumber(play)}</span></span><span
                          class="bili-video-card__stats--item"><svg class="bili-video-card__stats--icon">
                            <use xlink:href="#widget-agree"></use>
                          </svg><span class="bili-video-card__stats--text">${Tool.formatBigNumber(like)}</span></span></div><span
                        class="bili-video-card__stats__duration">${duration}</span>
                    </div>
                  </div>
                </div>
              </a>
              <div class="bili-video-card__info __scale-disable">
                <!---->
                <div class="bili-video-card__info--right"><a
                    href="https://www.bilibili.com/video/${bvid}"
                    target="_blank" data-mod="partition_recommend" data-idx="content" data-ext="click">
                    <h3 class="bili-video-card__info--tit" title="${title}">${title}</h3>
                  </a>
                  <p class="bili-video-card__info--bottom">
                    <!----><a class="bili-video-card__info--owner" href="//space.bilibili.com/${mid}" target="_blank"
                      data-mod="partition_recommend" data-idx="content" data-ext="click"><svg
                        class="bili-video-card__info--owner__up">
                        <use xlink:href="#widget-up"></use>
                      </svg><span class="bili-video-card__info--author">${author}</span><span class="bili-video-card__info--date">·
                      ${Tool.diffTime(pubdate)}</span></a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        `;
        videoCardBody.appendChild(Tool.s2d(domStr));
      }
    });
  };

  // 更新视频
  const refreshVideo = async () => {
    let firstVideoIndex = (page - 1) * pageSize;
    let lastVideoIndex = firstVideoIndex + pageSize - 1;
    while(videoList.length < lastVideoIndex + 1) {
      let data = await API.getVideo(videoKey, searchPage);
      data.forEach((item) => {
        if (!Tool.isTimeTooLate(item.pubdate, rangeDay)) {
          if (bvList.indexOf(item.bvid) === -1) {
            videoList.push(item);
            bvList.push(item.bvid);
          }
        }
      });
      searchPage++;
    };
    page++;
    let applyData = videoList.slice(firstVideoIndex, lastVideoIndex + 1)
    getVideoCardTemplete(applyData);
  };

  // 填入框架
  let main = document.querySelector('.bili-layout');
  let gridAll = document.querySelectorAll('.bili-grid');
  if (main !== null) {
    let templete = getTemplete(videoKey, imgUrl);
    main.insertBefore(Tool.s2d(templete), gridAll[2]);

    // 第一次获取数据并渲染
    const applyFirstData = async () => {
      refreshVideo();
    };
    applyFirstData();
    // 换一换按钮添加更新视频事件
    let refreshVideoBtn = document.querySelector('#refreshVideo');
    refreshVideoBtn.addEventListener('click', refreshVideo);

    // popover
    const showpopover = (x, y) => {
      return `
      <div id="asoul-popover" style="position: absolute; z-index: 2000;  top: ${y}px; left: ${x}px;">
        <div class="v-popover is-top" style="padding-bottom: 0px; margin-left: 0px; pointer-events: none;">
          <div class="v-popover-content bili-rank-list-video">
            <div class="rank-video-card__popover">
              <div class="rank-video-card__popover--top">
                <div class="rank-video-card__image rank-video-card__popover--image">
                  <picture class="v-img rank-video-card__cover rank-video-card__popover--cover">
                    <!---->
                    <source srcset="//i1.hdslb.com/bfs/archive/6ac4c468f90987ecd2a51f1753f7d043560ac271.jpg@192w_108h.webp"
                      type="image/webp"><img
                      src="//i1.hdslb.com/bfs/archive/6ac4c468f90987ecd2a51f1753f7d043560ac271.jpg@192w_108h"
                      alt="小伙买了80个模型，爆肝一周，只为在家建造一个迷你世界" loading="lazy" onload="">
                  </picture>
                </div>
                <div class="rank-video-card__info rank-video-card__popover--info">
                  <h3 class="rank-video-card__popover--tit" title="小伙买了80个模型，爆肝一周，只为在家建造一个迷你世界">小伙买了80个模型，爆肝一周，只为在家建造一个迷你世界
                  </h3>
                  <p class="rank-video-card__popover--author"><span>拜托了小翔哥</span><span> · 12-29</span></p>
                </div>
              </div>
              <ul class="rank-video-card__popover--stats">
                <li class="rank-video-card__popover--stats__item"><svg class="rank-video-card__popover--icon">
                    <use xlink:href="#widget-play-count"></use>
                  </svg><span>93万</span></li>
                <li class="rank-video-card__popover--stats__item"><svg class="rank-video-card__popover--icon">
                    <use xlink:href="#widget-danmaku"></use>
                  </svg><span>3931</span></li>
                <li class="rank-video-card__popover--stats__item"><svg class="rank-video-card__popover--icon">
                    <use xlink:href="#widget-favorite"></use>
                  </svg><span>1.3万</span></li>
                <li class="rank-video-card__popover--stats__item"><svg class="rank-video-card__popover--icon">
                    <use xlink:href="#widget-coin"></use>
                  </svg><span>7.6万</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      `
    }

    // 侧边
    // let aside = document.querySelector('.aside-wrap');
    // aside.append(Tool.s2d(asideBody));

    let setting = document.querySelector('#tuntun-setting');
    let settingBtn = setting.children[0];
    let settingPop = setting.children[1];
    let settingForm = settingPop.children[0];
    let partNameInput = settingForm.children[0].children[1];
    let partImgUrlInput = settingForm.children[1].children[1];
    let partImgDom = document.querySelector('.tuntun-part-img');
    partImgDom.style.borderRadius = `${imgBorderRadius}%`;
    let radiusRangeInput = document.querySelector('.tuntun-setting-imgRadius');
    let partTimeRangeInput = settingForm.children[3].children[1];

    // 设置按钮点击事件
    settingBtn.addEventListener('click', () => {
      if (settingPop.className === 'tuntun-setting-popover tuntun-setting-none') {
        settingPop.className = 'tuntun-setting-popover';
      } else {
        settingPop.className = 'tuntun-setting-popover tuntun-setting-none';
      }
      partNameInput.value = videoKey;
      partImgUrlInput.value = imgUrl;
      partTimeRangeInput.value = rangeDay;
      radiusRangeInput.value = imgBorderRadius;
      partImgDom.style.borderRadius = `${imgBorderRadius}%`;
    });

    // videoKey改变
    const videoKeyChange = (newKey) => {
      let seeMoreBtn = document.querySelector('.tuntun-see-more');
      let headerLeft = document.querySelector('.tuntun-part-left');
      videoKey = newKey;
      videoList = [];
      page = 1;
      searchPage = 1;
      bvList = [];
      GM_setValue('videoKey', newKey);
      seeMoreBtn.href = `https://search.bilibili.com/all?keyword=${newKey}`;
      headerLeft.children[2].href = `https://search.bilibili.com/all?keyword=${newKey}`;
      headerLeft.children[2].children[0].innerHTML = `${newKey}分区`;
      refreshVideo();
    }

    // imgUrl改变
    const imgUrlChange = (newUrl) => {
      let partImgDom = document.querySelector('.tuntun-part-img');
      imgUrl = newUrl;
      GM_setValue('imgUrl', newUrl);
      partImgDom.src = newUrl;
    }

    // 设置img的圆角
    radiusRangeInput.addEventListener('change', () => {
      partImgDom.style.borderRadius = `${radiusRangeInput.value}%`;
    });
    const imgBorderRadiusChange = (newRadiusNum) => {
      imgBorderRadius = newRadiusNum;
      GM_setValue('imgBorderRadius', newRadiusNum);
    }

    // 时间范围改变
    const timeRangeChange = (timeRange) => {
      rangeDay = timeRange;
      videoList = [];
      page = 1;
      searchPage = 1;
      bvList = [];
      GM_setValue('rangeDay', timeRange);
      refreshVideo();
    }

    // 设置表单确认
    settingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (partNameInput.value !== videoKey) {
        videoKeyChange(partNameInput.value);
      }
      if (partImgUrlInput.value !== imgUrl) {
        imgUrlChange(partImgUrlInput.value);
      }
      if (radiusRangeInput.value !== imgBorderRadius) {
        imgBorderRadiusChange(radiusRangeInput.value);
      }
      if (partTimeRangeInput.value !== rangeDay) {
        timeRangeChange(partTimeRangeInput.value);
      }
      settingPop.className = 'tuntun-setting-popover tuntun-setting-none';
    });
  }
  
})();
