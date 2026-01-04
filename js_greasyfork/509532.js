// ==UserScript==
// @name        (MY) Succor & FastYT
// @namespace   Violentmonkey Scripts
// @description This UserScript is provided to help you to get fast info about watching video especially using embed mode
// @match       https://www.youtube.com/*
// @grant       GM.xmlHttpRequest
// @version     1.0.2409
// @author      is_competent
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/509532/%28MY%29%20Succor%20%20FastYT.user.js
// @updateURL https://update.greasyfork.org/scripts/509532/%28MY%29%20Succor%20%20FastYT.meta.js
// ==/UserScript==

const $0 = (selector, property, value) => {
  try{
   if (!property && !value)
       return document.querySelector(selector);
    document.querySelector(selector)[property] = value;
  } catch(e) {}
};

const createElement = (tag, textContent = '', attributes = {}, styles = {}) => {
  const element = document.createElement(tag);
  element.textContent = textContent;
  Object.keys(attributes).forEach(attr => element.setAttribute(attr, attributes[attr]));
  Object.assign(element.style, styles);
  return element;
};

const searchPlayer = setInterval(() => {
  const player = $0("video")?.closest('[id]');
  const parent = $0('.ytp-chrome-bottom') ?? player;
  if(!parent)
    return;
  clearInterval(searchPlayer);

  const insertPart = $0(".ytp-chrome-bottom, .ytp-offline-slate-background") ?? player;
  const infoTable = Object.assign(document.createElement('info'), {textContent: 'i', classList: 'info-table', onclick: doEvent, player, parent});

  insertPart?.before(infoTable);

});

function getVideoInfo(videoPlayer) {
  const { getVideoData, getSize, getAvailableQualityLabels } = videoPlayer
  || { getVideoData: false, getSize: false, getAvailableQualityLabels: false };
  const { video_id, video_quality } = getVideoData()
  || { video_id: 0, video_quality: 0 };
  const availableQuality = getAvailableQualityLabels();

  return { availableQuality, video_id, video_quality }

}
const builder = () => {
  return Object.assign(document.createElement('info'), {id: 'M_5985'});

}

function doEvent(event) {
  const { target } = event;
  const { player, parent } = target;
  if(parent) {
    const info = ``;
    const panel = $0('#M_5985');
    let stopUp;

    if(!panel){

      parent.after(builder());
      integration(player);

      return;
    }

    clearInterval(stopUp);
      panel?.remove(true);
  }

}

const isJson = jsonContent => {
    try {
        if (JSON.parse(jsonContent))
            return true;
    } catch (e) {}
    return false;
}

const rr = async (id) => {
  return requestSource({'method': 'GET', 'url': `https://terminaltemp.coolpage.biz/youtube/rest.php?endpoint=${id}`, headers: {"REQUEST_SCHEME2": 'nooob'}}).then(e => {
    if(!isJson(e.responseText))
      return {};
    const json = JSON.parse(e.responseText);
    return json;
  })
}
const hh = async (id) => {
  return requestSource({'method': 'GET', 'url': `https://returnyoutubedislikeapi.com/votes?videoId=${id}`}).then(e => {
    if(!isJson(e.responseText))
      return {};
  const json = JSON.parse(e.responseText);
    return json;
  })
}

const callMe = async (player) => {
  const id = getVideoInfo(player)['video_id'];
  // const ch = getVideoInfo(player)?.['externalChannelId'];

  try {
    const [r, h, p] = await Promise.all([rr(id), hh(id), getVideoInfo(player)]);
    r.dislikes = h.dislikes;
    r.player = p;

    return r;
  } catch (error) {
    console.error('Error:', error);
  }

};

setTimeout(clearInterval, 20000, searchPlayer);

function getVideoID() {
     const e = $0('video');
     return e?.closest('[id]')?.getVideoData()?.video_id ?? new URLSearchParams(location.search).get('v');
}

async function integration(player) {
  let oldID = '';
  const stop_ = await setInterval(()=>{
      if(!$0("#M_5985")){
        clearInterval(stop_);
        return;
      }

    if(getVideoID() === oldID){
      return;
    }
    oldID = getVideoID();
    callMe(player).then(somePart);

  }, 5);
}

function requestSource(opts)
{
    return new Promise((res, rej) => {
        opts.method = opts.method ?? "GET";
        opts.onload = response => res(response);
        opts.onerror = response => rej(response);

        return GM.xmlHttpRequest(opts);
    });
}

const normalizeDate = (dateString) => {
  if(isNaN(Date['parse'](dateString)))
    return;

  const date = new Date(dateString);
  const wowDate = date.toDateString().substr(2<<1);
  const pad = w => w.toString().padStart(2, '0');
  return {date: wowDate, time: `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`};
}

const somePart = async utilArray => {
    console.debug(utilArray);
     // return;
    const s = utilArray;
    if(!s) {
      alert('Sorry, cannot load video info');
      return;
    }
    const f = i => i?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    const b = s.authorSupport.support;
    const a = s.authorSupport.additional;

    const titleRow = createElement('tr');
    const logoRow  = createElement('tr');
    const videoRow = createElement('tr');
    const descrRow = createElement('tr');
    const tagRow   = createElement('tr');
    const comRow   = createElement('tr');

    titleRow.appendChild(createElement('th', '', {
            colspan: '7'
        }, {
            border: 0,
            padding: '1px'
        }))
        .appendChild(createElement('vid', '', {}, {
            display: 'flex',
            justifyContent: 'space-between'
        }))
        .appendChild(createElement('label', s.dez?.title, { title: s.dez?.title }, {
            textWrap: 'wrap'
        }))
        .after(createElement('label', f(s.livecounts.viewCount), { title: `${s.livecounts.viewCount} views` }));

    logoRow.appendChild(createElement('td', '', {}, {
            width: 0,
            textAlign: 'center'
        }))
        .appendChild(createElement('img', '', {
            src: s.aboutChannel.thumb.high.url
        }, {
            width: '90px',
            borderRadius: '10px'
        }))
        //.after(createElement('label', 'i', {id: 'aboutchannel', title: `More info about this channel`}));

    logoRow.appendChild(createElement('td', '', {
            colspan: 2
        }))
        .appendChild(createElement('div'))
        .appendChild(createElement('vid', s.aboutChannel.name, { title: s.aboutChannel.name }, { maxWidth: '180px', textOverflow: 'ellipsis', overflow: 'hidden' }))
        .after(
            createElement('a', 'Channel by short', {
                href: `https://www.youtube.com/${s.aboutChannel.custom}`
            }),
            createElement('a', 'Channel by ID', {
                href: `https://www.youtube.com/channel/${s.aboutChannel.id}`
            }),
            createElement('a', 'Video in channel playlist', {
                href: `https://www.youtube.com/watch?v=${s.id}&list=${s.aboutChannel.userContent.playlistID}&index=1`
            })
        );

    logoRow.appendChild(createElement('td', '', {}, { width: 0 }))
        .appendChild(createElement('cap', 'Subscribers'))
        .after(
            createElement('vid', f(s.aboutChannel.livecounts.subscribers))
        );

    logoRow.appendChild(createElement('td'))
        .appendChild(createElement('cap', 'Likes'))
        .after(
            createElement('vid', f(s.livecounts.likeCount), {}, {
                color: '#7adb09',
                fontWeight: 'bold',
                wordSpacing: '13px'
            })
        );

    logoRow.appendChild(createElement('td'))
        .appendChild(createElement('cap', 'DisLikes'))
        .after(
            createElement('vid', f(s.dislikes), {}, {
                color: '#f00000',
                fontWeight: 'bold',
                wordSpacing: '13px'
            }));

    videoRow.appendChild(createElement('td', '', {}, {
            width: '0'
        }))
        .appendChild(createElement('cap', 'Video ID'))
        .appendChild(createElement('vid', s.id, {id: 'vidID', title: 'Click here to copy this id'}, {cursor: 'pointer'}));

    videoRow.appendChild(createElement('td', '', {}, {width: 0}))
        .appendChild(createElement('cap', 'Duration'))
        .appendChild(createElement('vid', s.duration));

    videoRow.appendChild(createElement('td', '', {}, {
            maxWidth: '110px'
        }))
        .appendChild(createElement('cap', 'Available Qualities'))
        .insertAdjacentElement('beforeend', createElement('vid', '', {}, {
            display: 'flex'
        }))
        .appendChild(createElement('vidlist', '', {
            target: 'list'
        }, {
            display: 'flex',
            flexWrap: 'wrap'
        }))

    const q_0000001 = videoRow.querySelector('[target=list]');
    s.player.availableQuality.map(e => {
        q_0000001.appendChild(createElement('label', e))
    });
    if(!s.player.availableQuality.length)
      q_0000001.appendChild(createElement('label', '...'))

    videoRow.appendChild(createElement('td'))
        .appendChild(createElement('div', 'ad', { id: 'ad' }, { width: `${a.size[0]}px`, height: `${a.size[1] || '75'}px`, backgroundImage: `url("${a.logo}")`, backgroundSize: `${a.size[0]}px` }));

    videoRow.appendChild(createElement('td'))
        .appendChild(createElement('cap', 'Category'))
        .after(createElement('vid', s.categoryList?.[0]?.replaceAll('_', ' ') || '...', {}, { whiteSpace: 'break-spaces' }));

    videoRow.appendChild(createElement('td'))
        .appendChild(createElement('cap', 'Date PUB'))
        .appendChild(createElement('div'))
        .appendChild(createElement('vid', normalizeDate(s.publishedAt)?.date))
        .after(createElement('vid', normalizeDate(s.publishedAt)?.time));


    if (s.dez.description) {
        descrRow.appendChild(createElement('td', '', {
                colspan: 7
            }, {
                padding: '0'
            }))
            .appendChild(createElement('span', '', {}, {
                display: 'inline-flex',
                justifyContent: 'space-between',
                width: '100%'
            }))
            .insertAdjacentElement('beforeend', createElement('label', '📋', {
                title: 'Copy description (maybe length limits)',
                meta: s.dez.description,
                id: 'copyDes'
            }, {
                position: 'relative',
                right: '5px',
                padding: '2px',
                borderRadius: '10px',
                cursor: 'pointer'
            }))
            .insertAdjacentElement('beforebegin', createElement('details', ''))
            .insertAdjacentElement('afterbegin', createElement('summary', 'Description'))
            .insertAdjacentElement('afterend', createElement('hr'))
            .insertAdjacentElement('afterend', createElement('div', s.dez.description))
    }

    if (s.tags) {
        tagRow.appendChild(createElement('td', '', {
                colspan: 7
            }, {
                padding: '0'
            }))
            .appendChild(createElement('div'))
            .insertAdjacentElement('beforebegin', createElement('details', ''))
            .insertAdjacentElement('afterbegin', createElement('summary', 'Tags'))
            .insertAdjacentElement('afterend', createElement('hr'))
            .insertAdjacentElement('afterend', createElement('div', '', {
                id: 'tagsID'
            }))
        const q_0000002 = tagRow.querySelector('#tagsID');
        s.tags.map(e => {
            q_0000002.appendChild(createElement('label', e))
        });
    }
    if (s.comments) {
    comRow.appendChild(createElement('td', '', {
                colspan: 7
            }, {
                padding: '0'
            }))
            .appendChild(createElement('div'))
            .insertAdjacentElement('beforebegin', createElement('details', ''))
            .insertAdjacentElement('afterbegin', createElement('summary', `Comments (Last ${s.comments.length + ' of ' + s.livecounts.commentCount ?? 'Are turned off'})`))
            .insertAdjacentElement('afterend', createElement('hr'))
            .insertAdjacentElement('afterend', createElement('content', '', {
                target: 'list'
            }))
        const q_0000003 = comRow.querySelector('[target=list]');
        s.comments.map(e => {
            q_0000003.appendChild(commentBuilder(e.text, e.appreciated, e.authorIcon, e.authorLink, e.authorName, `${normalizeDate(e.dated)?.date} ${normalizeDate(e.dated)?.time}`, e.reply))
        });
    }

  const author = createElement('meta');
  author.appendChild(createElement('label', s.authorSupport.info));
  author.appendChild(createElement('label', '', {}))
    .appendChild(createElement('img', '', {scope: 'BTC', src: icons.BTC, value: b.BTC || '', title: 'Copy selected...'}))
    .after(
    createElement('img', '', {scope: 'ETH', src: icons.ETH, value: b.ETH || '', title: 'Copy selected...'}),
    createElement('img', '', {scope: 'TRX', src: icons.TRX, value: b.TRX || '', title: 'Copy selected...'}),
    createElement('img', '', {scope: 'MAIL', src: icons.MAIL, value: b.contact || '', title: b.additional || ''}));

    const table = createElement('table');
    table.append(titleRow, logoRow, videoRow, descrRow, tagRow, comRow);
    const target = $0("#M_5985");
    if (!target)
      return;

      target.textContent = '';
      target.append(table, author);

      const meta = target.querySelector('meta');
      const cont = meta.querySelector('label:nth-last-child(1)');

      cont.onclick = helpLogic;
      meta.onclick = metaLogic;
  const ad = $0('#ad');
  if(ad){
      ad.onclick = ()=>{window.open(atob(a.event), '_blank')}
      ad.removeAttribute('id');
  }
  const vidID = $0('#vidID');
  if(vidID){
      vidID.onclick = (event) => {
              const { target } = event;
              if(target.textContent.length === 11)
              {

                  copyToClipboard(target.textContent);
                  target.style.background = "#7adb09";
                  setTimeout(()=>{ target.style.background = "" }, 2e3)
              }
          };
      vidID.removeAttribute('id');
  }

  const tagsID = $0('#tagsID');
  if(tagsID){
      tagsID.onclick = (event) => {
          const { target } = event;
          if(/label/i.test(target.tagName) && window.getSelection)
          {
              const range = document.createRange();
              range.selectNode(target);
              window.getSelection().removeAllRanges();
              window.getSelection().addRange(range);
          }
      };
      tagsID.removeAttribute('id');
  }
  const copyDes = $0('#copyDes');
  if(copyDes){
      copyDes.onclick = (event) => {
          const { target } = event;
          if(target.getAttribute('meta'))
          {
              console.log(target.getAttribute('meta'));
              copyToClipboard(target.getAttribute('meta'));
              target.style.background = "#7adb09";
              setTimeout(()=>{ target.style.background = "" }, 2e3)
          }
      };
      copyDes.removeAttribute('id');
  }

      await setTimeout(() => {
       const move_ =  setInterval(async () => {
         let nowTop = Number(/-?\d+/.exec(window.getComputedStyle(meta, null)?.getPropertyValue("top"))?.[0] || 0);

          if(nowTop >= 0){
            clearInterval(move_);
          }
          meta.style.top = `${++nowTop}px`;

        }, 5);
        setTimeout(clearInterval, 18e3, move_);
       }, 30e3);

}

const helpLogic = (event) => {
  const { target } = event;
  const scope  = target?.getAttribute('scope');
  const title = target?.getAttribute('title');
  const value = target?.getAttribute('value');
  switch (scope){
    case 'BTC':
      prompt(title, value);
      break;
    case 'ETH':
      prompt(title, value);
      break;
    case 'TRX':
      prompt(title, value);
      break;
    case 'MAIL':
      prompt(title, value);
      break;
  }
}
const copyToClipboard = (content) => {
    if (!navigator.clipboard) {
        alert(`Clipboard maybe is not allowed in this browser.`);
        return;
      }
      navigator.clipboard.writeText(content)
        .then(`Copying to clipboard was successful!`)
        .catch(`Could not copy text`)

}

const metaLogic = (event) => {
    const { target } = event;
    let after = window.getComputedStyle(target, ':after');
  if(!/none/.test(after?.content)){
    target.remove();
  }
}

const commentBuilder = (text, appreciated, authorIcon, authorLink, authorName, dated, reply) => {
  const custom = createElement('divv', '', {}, {
      margin: '0',
      padding: '0',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      fontSize: '12px',
      borderBottom: '5px dotted #aaa1'
  });
  custom.appendChild(createElement('a', '', {
          href: authorLink
      }))
      .appendChild(createElement('img', '', {
          src: authorIcon
      }, {
          width: '30px',
          borderRadius: '50%'
      }))
  custom.appendChild(createElement('yt-cad'))
      .appendChild(createElement('yt-cad'))
      .appendChild(createElement('a', authorName, { href: authorLink }))
      .after(createElement('label', appreciated, {title: `Appreciated by ${appreciated}`}), createElement('label', dated), createElement('yt-cad', text))

  return custom;
}
const icons = {
  MAIL: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAX5JREFUSEtjZKAxYKSx+QzDyAKJhKypvIbm6ewS0syUBNvPF0//fj5/cuaLBdOyQebAg0i1f/4fdilZigyHOezns8d/bxcmsqBYoLNyz3+QwJVwF4riBd0cuGE0t0C+vPU/r5E52Jf//zMsYGFirLkY5vyUmPjQW7tf5u/vv82MjAwJIPWfzx5neNhVC3Y8cnD85zWyYJAvb7nOwMCgycDA8J3h//8+pl//2i/FuX/FZpH6xiO8rD9+VDAwMBQyMDBwMjAwXH/YWaP5+dwJuNkoFoBEQ1etYrnOIJjG8J+xgYGBQYyBgeEVAwNjvSbj29mrw8L+QtUw41HzB+oYTB8gS2BzHQPj/1KGf4yMDIwMXXh8CU4ssNDB8AFasDGghy8sqPDEE2kWwAzUWrXLgOk/Ux+I/4/xX9G1MLcLOBIAeRYQk5qgakYtIBhYOIPoFQMDgyhB7cQpeA3NQyg5OZGBgaGTCpaADC9nYGCYj15UEOc2ElVRVDQTY9fQtwAAl9mYGXjtmaEAAAAASUVORK5CYII=`,
  BTC: `data:image/png;base64,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`,
  ETH: `data:image/png;base64,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`,
  TRX: `data:image/png;base64,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`
}

const CSS = `
#M_5985 {
    z-index: 43;
    background: red;
    place-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80vw;
    height: 60vh;
    background-color: #111e;
    text-align: center;
    /*backdrop-filter: blur(20px);*/

    border-radius: 9px;
    border: 1px solid #fff8;
    padding: 10px;
    font-size: 15px;
    white-space-collapse: preserve;
    max-width: 50em;
    max-height: 25em;
    overflow: auto;
}
#M_5985 > meta {
    display: flex;
    border: 1px solid red;
    border-radius: 0px 0px 10px 10px;
    position: absolute;
    top: -80px;
    z-index: 5;
    padding: 10px;
    background-color: #777;
    color: black;
    left: 50%;
    width: max-content;
    height: 50px;
    transform: translate(-50%);
    background-color: wheat;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
}
#M_5985 > meta:after {
    content: '\❌';
    position: absolute;
    bottom: 5px;
    right: 5px;
    cursor: pointer;
}
#M_5985 > meta label, #M_5985 span label {
    user-select: none;
}
#M_5985 > meta label img {
  width: 40px;
  cursor: pointer;
}
#M_5985 > table td:nth-child(4) > div {
    margin: 0;
    padding: 0;
    display: block;
    background-repeat: no-repeat;
    background-position-y: 10px;
    font-size: 10px;
    cursor: default;
    user-select: none;
    color: white;
}
.info-table {
    position: absolute;
    z-index: 45;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #7777;
    border: 1px solid #f8000088;
    color: white;
    border-radius: 50%;
    width: 23px;
    margin-top: 8px;
    height: 23px;
    cursor: pointer;
    user-select: none;
    bottom: 75px;
    left: 15px;
}
.info-table:hover {
    background: -webkit-gradient(linear,left bottom,left top,from(hsla(0,0%,100%,.1)),to(hsla(0,0%,100%,.1))),#f3382c;
    background: linear-gradient(0deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,.1)),#f3382c;
    -webkit-box-shadow: 0 0 10px 0 #f44c41;
    box-shadow: 0 0 10px 0 #f44c41;
    color: #fff!important;
}
info table {
    width: 100%;
    text-align: left;
    /*user-select: none;*/

    border-spacing: 0;
    margin: 0;
}
info table th,
info table td {
    border: 1px solid black;
    border-collapse: collapse;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
/*  details {
  height: auto;
  overflow: hidden;
  transition: max-height ease-in-out;
  transition-duration: var(--duration, 0.3s);
}*/

table td {
    padding-left: 5px;
    padding-right: 5px;
}
table td > div {
    width: 0px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
}
table td > label {
    left: 15px;
    position: fixed;
    background-color: #321;
    margin: 1px;
    padding: 1px;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-family: monospace;
    border: 3px dotted lawngreen;
}
table tr:nth-child(2) td {
    width: 0;
}
/*table tr td {
  width: 0px;
}*/
table td > label:hover {
    opacity: 0.7;
    cursor: pointer;
}
table details {
    max-width: 750px;
}
table details div {
    max-height: 200px;
    overflow: auto;
    word-wrap: break-word;
    white-space: pre-wrap;
    display: block;
    margin: 2px;
    padding: 2px;
}
table details label {
    margin: 1px;
    border: 1px dotted lightblue;
    border-radius: 10px;
    padding: 0 3px 0 3px;
}
table a {
  padding: 2px;
}
table a:hover {
    color: wheat;
    background: #9995;
    border-radius: 10px;
}
table details summary, td > label {
    cursor: pointer;
    user-select: none;
}
vid {
    display: block;
    color: wheat;
    background: #9995;
    border-radius: 10px;
    padding: 5px;
}
cap {
    display: block;
}
vidlist label {
    padding: 2px;
    background-color: #ccc2;
    border-radius: 10px;
}
yt-cad {
    max-height: 200px;
    overflow: auto;
    word-wrap: break-word;
    white-space: normal;
    display: block;
    margin: 2px;
    padding: 2px;
}
`;

const STYLE = document.createElement('style');
STYLE.textContent = CSS;
document.head.prepend(STYLE);