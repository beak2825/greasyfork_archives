// ==UserScript==
// @name        Bilibili 动态页显示当前所有直播
// @description 显示当前所有直播
// @version     3.1
// @author      Myitian
// @license     MIT
// @namespace   myitian.bili.tPage-showMoreLives
// @match       t.bilibili.com/*
// @icon        https://www.bilibili.com/favicon.ico
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/422804/Bilibili%20%E5%8A%A8%E6%80%81%E9%A1%B5%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E6%89%80%E6%9C%89%E7%9B%B4%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/422804/Bilibili%20%E5%8A%A8%E6%80%81%E9%A1%B5%E6%98%BE%E7%A4%BA%E5%BD%93%E5%89%8D%E6%89%80%E6%9C%89%E7%9B%B4%E6%92%AD.meta.js
// ==/UserScript==

/**
 * @template T
 * @typedef {Object} BiliResponse
 * @property {number} code
 * @property {string} message
 * @property {T} data
 */
/**
 * @typedef {Object} UserFollowingItem
 * @property {number} roomid
 * @property {string} uname
 * @property {string} title
 * @property {string} face
 * @property {0|1} live_status
 */
/**
 * @typedef {Object} UserFollowing
 * @property {string} title
 * @property {number} pageSize
 * @property {number} totalPage
 * @property {UserFollowingItem[]} list
 */
/**
 * @typedef {Object} RoomInfo
 * @property {number} area_id
 * @property {string} area_name
 * @property {number} parent_area_id
 */
/**
 * @typedef {Object} FullRoomInfo
 * @property {RoomInfo} room_info
 */

/**
 * 打开面板
 */
async function moreBtn() {
    // 基底div
    const base = document.createElement('div');
    base.className = 'sml-base'
    base.id = 'sml-base';
    base.innerHTML = `
<style class="sml-style" id="sml-style">
  :has(.sml-mask):not(.sml-mask) {
    overflow: hidden;
  }

  .sml-mask {
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #0000007f;
    z-index: 10000;
  }

  .sml-mainbox {
    margin: auto;
    --width: 1000px;
    --height: 666px;
    width: var(--width);
    height: var(--height);
    border-radius: 4px;
    background-color: var(--bg1, #fff);
  }

  .sml-livepanel {
    height: calc(100% - 58px);
    width: 100%;
    overflow: auto;
  }

  @media screen and (max-width:1030px) {
    .sml-mainbox {
      --width: 756px;
    }
  }

  @media screen and (max-width:786px) {
    .sml-mainbox {
      --width: 512px;
    }
  }

  @media screen and (max-width:542px) {
    .sml-mainbox {
      --width: 268px;
    }
  }

  @media screen and (max-height:690px) {
    .sml-mainbox {
      --height: 590px;
    }
  }

  @media screen and (max-height:614px) {
    .sml-mainbox {
      --height: 514px;
    }
  }

  @media screen and (max-height:538px) {
    .sml-mainbox {
      --height: 438px;
    }
  }

  @media screen and (max-height:462px) {
    .sml-mainbox {
      --height: 362px;
    }
  }

  @media screen and (max-height:386px) {
    .sml-mainbox {
      --height: 286px;
    }
  }

  @media screen and (max-height:310px) {
    .sml-mainbox {
      --height: 210px;
    }
  }

  @media screen and (max-height:234px) {
    .sml-mainbox {
      --height: 134px;
    }
  }

  .sml-title {
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: var(--text1, #18191c);
    border-bottom: 1px solid var(--graph_bg_thick, #e3e5e7);
  }

  .sml-titlesp2 {
    color: var(--text3, #9499a0);
    letter-spacing: 0;
    font-size: 14px;
    flex-grow: 1;
  }

  .sml-title>button {
    flex: 0;
    margin-left: 24px;
    width: 24px;
    height: 24px;
    cursor: pointer;
    stroke: var(--text3, #9499a0);
    padding: 0;
    background: none;
    border: none;
    box-shadow: none;
    stroke: var(--text3, #9499a0);
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    stroke-width: 1
  }

  .sml-title>button:hover {
    stroke: var(--brand_blue, #00aeec);
  }

  .sml-livecontainer {
    display: inline-flex;
    flex-grow: 0;
    flex-shrink: 0;
    position: relative;
    margin-bottom: 10px;
    margin-top: 10px;
    margin-left: 16px;
    height: 56px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    width: 224px;
  }

  .sml-a1 {
    width: 38px;
    height: 38px;
    border-radius: 22px;
    position: relative;
    margin: 1px;
    margin-right: 11px;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    background-size: cover;
    background-color: var(--Ga3, #c9cdd0);
    box-shadow: 0 0 0 1px var(--brand_pink, #f69);
    -webkit-box-shadow: 0 0 0 1px var(--brand_pink, #f69);
    border: 1px solid var(--bg1, #fff);
  }

  .sml-a2 {
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: keep-all;
    max-width: 176px;
    padding-right: 16px;
    letter-spacing: 0;
  }

  .sml-upname {
    font-size: 14px;
    color: var(--text1, #18191c);
    line-height: 20px;
    max-height: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }

  .sml-upname:hover {
    color: var(--brand_blue, #00aeec);
  }

  .sml-areaname {
    font-size: 12px;
    color: var(--text3, #9499a0);
    line-height: 20px;
    max-height: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }

  .sml-livename {
    font-size: 12px;
    color: var(--text2, #64666d);
    line-height: 16px;
    word-break: break-all;
    word-break: break-word;
    text-overflow: ellipsis;
    max-height: 32px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .sml-word {
    word-break: break-all;
    word-break: break-word;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .sml-center {
    text-align: center;
  }

  .sml-block {
    display: block;
  }
</style>
<div class="sml-mask" id="sml-mask">
  <div class="sml-mainbox sml-block" id="sml-mainbox">
    <div class="sml-title"><!--
   --><span>正在直播</span><!--
   --><span class="sml-titlesp2" id="sml-titlesp2">（0）</span><!--
   --><button class="sml-refresh"><!--
     --><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path d="M6.343145750507619 10A6 6 0 0 1 17.65685424949238 10v-3m0 3l-2.5917778669 -1.5108566617" />
          <path d="M17.65685424949238 14A6 6 0 0 1 6.343145750507619 14v3m0 -3l2.5917778669 1.5108566617" />
        </svg><!--
   --></button><!--
   --><button class="sml-exit"><!--
     --><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
          <path d="M6 6l12 12m0-12L6 18" />
        </svg><!--
   --></button><!--
 --></div>
    <div class="sml-livepanel sml-block" id="sml-livepanel"></div>
  </div>
</div>
`;
    const refresh = base.querySelector('.sml-refresh');
    refresh.addEventListener('click', loadContent);
    const exit = base.querySelector('.sml-exit');
    exit.addEventListener('click', exitBtn);
    document.body.appendChild(base);
    await loadContent();
}

/**
 * 加载内容
 */
async function loadContent() {
    const livepanel = document.querySelector('#sml-livepanel');
    livepanel.innerHTML = '';
    /** @type {HTMLSpanElement} */
    const titlesp2 = document.querySelector('#sml-titlesp2');
    let liveCount = 0;
    let hasMore = true;
    let page = 1;
    let maxPage = 1;
    while (hasMore && page <= maxPage) {
        const resp = await fetch(`https://api.live.bilibili.com/xlive/web-ucenter/user/following?page_size=29&page=${page}`, {
            credentials: 'include'
        });
        if (!resp.ok) {
            const err = document.createElement('p');
            err.className = 'sml-center';
            err.innerText = `直播数据获取失败！（${resp.status}）\n${await resp.text()}`;
            livepanel.appendChild(err);
        } else {
            /** @type {BiliResponse<UserFollowing>} */
            const json = await resp.json();
            const jsondata = json.data;
            maxPage = jsondata.totalPage;
            for (const user of jsondata.list) {
                if (user.live_status == 0) {
                    hasMore = false;
                    break;
                }
                liveCount++;
                const roomid = user.roomid;
                const link = `https://live.bilibili.com/${roomid}`
                /** 容器div */
                const livecontainer = document.createElement('div');
                livecontainer.className = 'sml-livecontainer';
                /** UP主头像a */
                const a1 = document.createElement('a');
                a1.className = 'sml-block sml-a1';
                a1.style = `background-image:url('${user.face}@50w_50h.png');`;
                a1.href = link;
                a1.target = '_blank';
                /** 直播信息a */
                const a2 = document.createElement('a');
                a2.className = 'sml-block sml-a2';
                a2.href = link;
                a2.target = '_blank';
                /** UP主名称div */
                const upname = document.createElement('div');
                upname.className = 'sml-word sml-block sml-upname';
                upname.innerText = user.uname;
                /** 分区名称div */
                const areaname = document.createElement('a');
                areaname.className = 'sml-word sml-block sml-areaname';
                areaname.target = '_blank';
                /** 直播名称div */
                const livename = document.createElement('div');
                livename.className = 'sml-word sml-block sml-livename';
                livename.innerText = user.title;

                fetch(`https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${roomid}`, {
                    credentials: 'include'
                }).then(async resp => {
                    if (!resp.ok) {
                        return;
                    }
                    /** @type {BiliResponse<FullRoomInfo>} */
                    const json = await resp.json();
                    const jsondata = json.data.room_info;
                    areaname.innerText = jsondata.area_name;
                    areaname.href = `https://live.bilibili.com/p/eden/area-tags?parentAreaId=${jsondata.parent_area_id}&areaId=${jsondata.area_id}`;
                });
                a2.appendChild(upname);
                a2.appendChild(areaname);
                a2.appendChild(livename);
                livecontainer.appendChild(a1);
                livecontainer.appendChild(a2);
                livepanel.appendChild(livecontainer);
            }
        }
        page++;
        titlesp2.innerText = `（${liveCount}）`; // 人数
    }
    if (liveCount == 0) {
        const err = document.createElement('p');
        err.className = 'sml-center';
        err.innerText = '当前无直播';
        livepanel.appendChild(err);
    }
}

/**
 * 退出面板
 */
function exitBtn() {
    document.body.removeChild(document.querySelector('#sml-base'));
}

/**
 * 重新放置元素，清除事件处理器
 * @param {Element} oldEelement
 * @returns {Element}
 */
function replaceElement(oldEelement) {
    const newElement = document.createElement(oldEelement.tagName);
    for (const t of oldEelement.attributes) {
        newElement.setAttribute(t.name, t.value);
    }
    for (const t of oldEelement.childNodes) {
        newElement.appendChild(t);
    }
    const parent = oldEelement.parentElement;
    const next = oldEelement.nextSibling;
    parent.removeChild(oldEelement);
    parent.insertBefore(newElement, next);
    return newElement;
}

/**
 * 替换按钮功能
 */
function replaceBtnFunc() {
    const moreBtnEle = document.querySelector('.bili-dyn-live-users__more');
    if (moreBtnEle) {
        if (!document.querySelector('#sml-stop-event')) {
            const moreBtnEleNew = replaceElement(moreBtnEle);
            moreBtnEleNew.id = 'sml-stop-event';
            moreBtnEleNew.addEventListener('click', moreBtn);
        }
        window.removeEventListener('keydown', replaceBtnFunc);
        window.removeEventListener('mousemove', replaceBtnFunc);
        window.removeEventListener('mousedown', replaceBtnFunc);
    }
}

window.addEventListener('keydown', replaceBtnFunc);
window.addEventListener('mousemove', replaceBtnFunc);
window.addEventListener('mousedown', replaceBtnFunc);