// ==UserScript==
// @name         hifini音乐播放管理
// @namespace    http://tampermonkey.net/
// @version      0.4.6
// @description  在HiFiNi网站自动播放歌曲，可以自定义播放列表
// @author       zs
// @license MIT
// @match        https://www.hifini.com/*
// @match        https://hifini.com/*
// @icon         https://hifini.com/view/img/logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470786/hifini%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/470786/hifini%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function () {
  'use strict';

  insetPanel();
  // 初始化 判断url是否有thread字符串，有的话是播放音乐页面，则自动播放
  // 没有的话是外层音乐列表页面，则在每个记录上insert'添加到播放列表按钮'
  init();
})();

function insetPanel() {
  // 播放音乐页面
  // if (location.href.indexOf('thread') !== -1) return;
  const body = document.getElementById('body');
  const panel = `
    <div id="play-list-panel-zs" style="position: fixed;top: 100px;left: 0;width: 240px;background: #b1cde4;border-bottom-right-radius: 5px;border-top-right-radius: 5px; padding: 6px 8px;font-size: 12px;z-index: 1001;transition: width 2s, height 2s;">
      <div style="display: flex;align-items: center;justify-content: space-between;width: 100%;height: 30px;border-bottom: 1px solid #333;">
        <span id="start-auto-play-zs" style="color: #333;cursor: pointer;">开始自动播放</span>
        <span style="width: 1px;height: 8px;background: #333;"></span>
        <span id="clear-play-list-zs" style="color: #333;cursor: pointer;">清空播放列表</span>
      </div>
      <div style="display: flex;align-items: center;flex-wrap: wrap;width: 100%;min-height: 30px;border-bottom: 1px solid #333;">
        <span id="order-play-zs" style="margin-right: 8px;cursor: pointer;">顺序播放</span>
        <span style="cursor: pointer;">
          <input id="play-end-remove-zs" type="checkbox" id="vehicle1" name="vehicle1" value="remove">
          <label style="margin-bottom: 0;" for="vehicle1">播放完成在列表移除</label>
        </span>
        <span id="random-order-zs" style="margin-right: 8px;cursor: pointer;">随机排序</span>
      </div>
      <div id="diy-play-list" style="display: flex;flex-direction: column;max-height: 500px;">
        <span style="color: #000;font-size: 14px;">播放列表</span>
        <span style="color: #333;">播放列表暂无添加音乐</span>
      </div>
      <div id="tips-zs" style="color: #008cff;cursor: pointer;">
        关于进入音乐播放页面无法自动播放问题
      </div>
      <div style="
        position: absolute;
        top: 50%;
        right: -14px;
        width: 14px;
        margin-top: -20px;
        background: #b1cde4;
        cursor: pointer;
        display: flex;
        justify-content: center;
        height: 40px;
        writing-mode: vertical-rl;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        "
        id="fold-zs"
      >
        收起
      </div>
    </div>
  `;
  body ? body.insertAdjacentHTML('beforeend', panel) : '';
  setPlayList(getPlayList());


    const rightPanel = `
    <div id="play-list--right-panel-zs" style="position: fixed;top: 100px;right: 0;width: 240px;background: #b1cde4;border-bottom-right-radius: 5px;border-top-right-radius: 5px; padding: 6px 8px;font-size: 12px;z-index: 1001;transition: width 2s, height 2s;">
      <div style="display: flex;align-items: center;justify-content: space-between;width: 100%;height: 30px;border-bottom: 1px solid #333;">
        <span id="start-auto-play-zs" style="color: #333;cursor: pointer;">开始自动播放</span>
        <span style="width: 1px;height: 8px;background: #333;"></span>
        <span id="clear-collect-list-zs" style="color: #333;cursor: pointer;">清空收藏列表</span>
      </div>
<!--       <div style="display: flex;align-items: center;flex-wrap: wrap;width: 100%;min-height: 30px;border-bottom: 1px solid #333;"> -->
<!--         <span id="order-play-zs" style="margin-right: 8px;cursor: pointer;">顺序播放</span> -->
<!--         <span style="cursor: pointer;"> -->
<!--           <input id="play-end-remove-zs" type="checkbox" id="vehicle1" name="vehicle1" value="remove"> -->
<!--           <label style="margin-bottom: 0;" for="vehicle1">播放完成在列表移除</label> -->
<!--         </span> -->
<!--         <span id="random-order-zs" style="margin-right: 8px;cursor: pointer;">随机排序</span> -->
<!--       </div> -->
      <div id="diy-collect-list" style="display: flex;flex-direction: column;max-height: 500px;">
        <span style="color: #000;font-size: 14px;">收藏列表</span>
        <span style="color: #333;">收藏列表暂无添加音乐</span>
      </div>
<!--       <div id="tips-zs" style="color: #008cff;cursor: pointer;"> -->
<!--         关于进入音乐播放页面无法自动播放问题 -->
<!--       </div> -->
      <div style="
        position: absolute;
        top: 50%;
        right: -14px;
        width: 14px;
        margin-top: -20px;
        background: #b1cde4;
        cursor: pointer;
        display: flex;
        justify-content: center;
        height: 40px;
        writing-mode: vertical-rl;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        "
        id="fold-zs"
      >
        收起
      </div>
    </div>
  `;
  body ? body.insertAdjacentHTML('beforeend', rightPanel) : '';
  setCollectList(getCollectList());


  setTimeout(() => {
    // 点击开始自动播放
    document.getElementById('start-auto-play-zs').addEventListener('click', () => {
      const data = getPlayList();
      if (Array.isArray(data) && data.length) {
        window.open(data[0].href);
        localStorage.setItem('play-list-index-zs', '0');
      } else {
        alert('请先去音乐列表添加音乐到播放列表');
        location.href = 'https://www.hifini.com';
      }
    })
    // 点击清空播放列表
    document.getElementById('clear-play-list-zs').addEventListener('click', () => {
      setPlayList([]);
    })
    // 点击清空收藏列表
    document.getElementById('clear-collect-list-zs').addEventListener('click', () => {
      setCollectList([]);
    })
    // 点击关于进入音乐播放页面无法自动播放问题
    document.getElementById('tips-zs').addEventListener('click', () => {
      alert(`由于浏览器策略不同，可能不允许脚本驱动媒体播放，可以手动点击播放音乐按钮，次数多了浏览器会记住你的选择，则脚本驱动媒体播放不会再失败。
        您也可以手动开启浏览器对声音的设置，将该网站设置为允许播放声音。`);
    })
    // 点击顺序播放、随机播放
    document.getElementById('order-play-zs').addEventListener('click', (e) => {
      const text = e.target.innerText;
      if (text === '顺序播放') {
        document.getElementById('order-play-zs').innerText = '随机播放';
        localStorage.setItem('play-order-zs', 'random');
      }
      if (text === '随机播放') {
        document.getElementById('order-play-zs').innerText = '顺序播放';
        localStorage.setItem('play-order-zs', 'order');
      }
    })
    // 勾选、取消勾选 播放完成在列表移除
    document.getElementById('play-end-remove-zs').addEventListener('change', (e) => {
      const checked = e.target.checked;
      localStorage.setItem('play-end-remove-result', `${checked}`);
    })
    // 点击随机排序
    document.getElementById('random-order-zs').addEventListener('click', (e) => {
      setRandomOrder();
    })
    // 点击收起按钮
    document.getElementById('fold-zs').addEventListener('click', (e) => {
      const panelELe = document.getElementById('play-list-panel-zs');
      panelELe.style.overflow = 'hidden';
      // panelELe.style.width = '0px';
      setTimeout(() => {
        panelELe.style.display = 'none';
        initFoldPanel();
      }, 0)
    })

    const localOrder = localStorage.getItem('play-order-zs');
    const checked = localStorage.getItem('play-end-remove-result');
    if (localOrder === 'random') {
      document.getElementById('order-play-zs').innerText = '随机播放';
    }
    if (`${checked}` === 'true') {
      document.getElementById('play-end-remove-zs').checked = true;
    }
  }, 400)
}

// 设置随机排序
function setRandomOrder() {
  const list = getPlayList();
  const result = [];
  let len = list.length;
  while (len) {
    const index = Random(1, len);
    result.push(list[index - 1]);
    list.splice(index - 1, 1);
    len--;
  }
  localStorage.setItem('play-list-index-zs', '0');
  console.log('重新排列后result:', result);
  localStorage.setItem('hifini_play_list', JSON.stringify(result));
  location.href = result[0].href;
}

// 初始化收起后的面板
function initFoldPanel() {
  const foldEle = document.getElementById('fold-panel-zs');
  if (foldEle) {
    foldEle.style.display = 'block';
    foldEle.addEventListener('click', () => {
      foldEle.style.display = 'none';
      document.getElementById('play-list-panel-zs').style.overflow = 'inherit';
      document.getElementById('play-list-panel-zs').style.display = 'block';
      document.getElementById('play-list-panel-zs').style.width = '240px';
    })
  } else {
    const body = document.getElementById('body');
    const divDom = document.createElement('div');
    divDom.setAttribute('id', 'fold-panel-zs');
    divDom.style = 'position: fixed;top: 100px;left: 0;width: 40px;height: 40px;border-radius: 50%;background: #b1cde4;font-size: 12px;z-index: 1001;cursor: pointer;text-align: center;line-height: 40px;';
    divDom.innerText = '展开';
    divDom.addEventListener('click', () => {
      divDom.style.display = 'none';
      document.getElementById('play-list-panel-zs').style.overflow = 'inherit';
      document.getElementById('play-list-panel-zs').style.display = 'block';
      document.getElementById('play-list-panel-zs').style.width = '240px';
    })
    body ? body.appendChild(divDom) : '';
  }
}

function init() {
  // 播放音乐页面
  if (location.href.indexOf('thread') !== -1) {
    setTimeout(() => {
      if (!document.querySelector('.aplayer-icon-play')) {
        next();
        return;
      }
      const playerEle = document.getElementById('player4');
      playerEle.style.position = 'relative';
      const btnEle = document.createElement('button');
      const addBtnEle = document.createElement('button');
      const addCollectBtnEle = document.createElement('button');
      btnEle.style = 'position: absolute;top: 14px;right: 57px;cursor: pointer;';
      addBtnEle.style = 'position: absolute;top: 14px;right: 130px;cursor: pointer;';
      addCollectBtnEle.style = 'position: absolute;top: 14px;right: 127px;cursor: pointer;';
      btnEle.innerHTML = '下一首';
      addBtnEle.innerHTML = '添加到播放列表';
      addCollectBtnEle.innerHTML = '添加到收藏列表'
      btnEle.addEventListener('click', (e) => {
        e.stopPropagation();
        next();
      });
      addBtnEle.addEventListener('click', (e) => {
        e.stopPropagation();
        const href = location.href;
        const name = document.querySelector('.media-body h4').innerText;
        addItemPlayList({ href, name });
      });
      playerEle.appendChild(btnEle);
      // playerEle.appendChild(addBtnEle);


      addCollectBtnEle.addEventListener('click', (e) => {
        e.stopPropagation();
        const href = location.href;
        const name = document.querySelector('.media-body h4').innerText;
        addItemCollectList({ href, name });
      });
      playerEle.appendChild(addCollectBtnEle);
      document.querySelector('.aplayer-icon-play').click();
      watchPlayEnd();
      const alreadyPlayList = localStorage.getItem('already-play-list');
      if (alreadyPlayList) {
        try {
          const list = JSON.parse(alreadyPlayList);
          list.push({
            pathname: location.pathname,
            timeStamp: new Date().getTime()
          });
          const _list = list.filter(i => {
            return (new Date().getTime() - i.timeStamp) < 60 * 30 * 1000;
          });
          console.log('有已播放列表，收录，且过滤列表中超过半小时的项', _list);
          localStorage.setItem('already-play-list', JSON.stringify(_list));
        } catch (err) {
          console.log(err.message);
        }
      } else {
        console.log('无已播放列表，收录第一首');
        localStorage.setItem('already-play-list', JSON.stringify([{ pathname: location.pathname, timeStamp: new Date().getTime() }]));
      }
    }, 1000);
  } else { // 外层音乐列表页面
    try {
      let ulEle = Array.from(document.querySelector('.card-body').children[0].children).filter(i => i.tagName === 'LI');
      if (location.href.indexOf('search') !== -1) {
        ulEle = Array.from(document.querySelector('.search .card-body').children[0].children).filter(i => i.tagName === 'LI');
      }
      ulEle.forEach(it => {
        const mediaEle = getNodeByClassName(it.children, 'media-body');
        const subjectEle = getNodeByClassName(mediaEle.children, 'subject');
        const btnEle = document.createElement('button');
        btnEle.style = 'margin-left: 20px;cursor: pointer;';
        btnEle.innerHTML = '添加到播放列表';
        btnEle.setAttribute('data-href', subjectEle.children[0].href || '');
        btnEle.setAttribute('data-name', subjectEle.children[0].innerText || '');
        btnEle.addEventListener('click', (e) => {
          e.stopPropagation();
          const href = e.target.dataset.href;
          const name = e.target.dataset.name;
          addItemPlayList({ href, name });
        })
        subjectEle.appendChild(btnEle);

        if (subjectEle.children[0].href) {
            var href = subjectEle.children[0].href;
            var name = subjectEle.children[0].innerText;
            addItemPlayList({ href, name });
        }
      })
    } catch (error) {
      // console.log("插入'添加到播放列表'按钮失败:", error);
      // alert("插入'添加到播放列表'按钮失败");
    }
  }
}

function addItemPlayList({ name, href }) {
  const playList = getPlayList();
  if (playList.find(i => i.href === href)) {
    console.log(i)
    return;
  };
  playList.push({
    name,
    href
  });
  setPlayList(playList);
}

function addItemCollectList({ name, href }) {
  const playList = getCollectList();
  if (playList.find(i => i.href === href)) {
    console.log(i)
    return;
  };
  playList.push({
    name,
    href
  });
  setCollectList(playList);
}


// 获取播放列表
function getPlayList() {
  const data = localStorage.getItem('hifini_play_list');
  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

// 获取收藏
function getCollectList() {
  const data = localStorage.getItem('hifini_collect_list');
  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

// 设置播放列表并且重新渲染
function setPlayList(data) {
  localStorage.setItem('hifini_play_list', JSON.stringify(data));
  if (Array.isArray(data)) {
    const ele = document.getElementById('diy-play-list');
    ele.innerHTML = '<span style="color: #000;font-size: 14px;">播放列表</span>';
    const divEle = document.createElement('div');
    divEle.style = 'width: 100%;overflow-y: scroll;overflow-x: hidden;';
    let html = '';
    const index = localStorage.getItem('play-list-index-zs');
    data.forEach((it, idx) => {
      html += `<div style="display: flex;height: 24px;align-items: center;">
        <span
          data-href="${it.href}"
          data-type="play"
          data-index="${idx}"
          style="overflow: hidden;flex: 1;word-break: break-all;white-space: nowrap;text-overflow: ellipsis;cursor: pointer;color: ${index && +index === idx ? 'blue' : '#212529'};"
        >
          ${it.name}
        </span>
        <span data-href="${it.href}" data-type="collect" data-index="${idx}" data-name="${it.name}"style="white-space: nowrap;color: #9a2121;cursor: pointer;margin-left: 6px;">收藏</span>
        <span data-href="${it.href}" data-type="del" data-index="${idx}" style="white-space: nowrap;color: #9a2121;cursor: pointer;margin-left: 6px;">删除</span>
      </div>
      `;
    })
    divEle.innerHTML = html;
    divEle.addEventListener('click', e => {
      const { type, href, index, name } = e.target.dataset;
      const list = getPlayList();
      if (type === 'play') { // 播放
        location.href = href;
        localStorage.setItem('play-list-index-zs', index);
        localStorage.setItem('current-play-list-item', 'playList');
      } else if (type === 'del') { // 删除
        list.splice(+index, 1);
        setPlayList(list);
      } else if (type === 'collect') {
        const list = getCollectList();
        list.splice(list.length, 0, {name,href});
        setCollectList(list);
      }
    })
    ele.appendChild(divEle);
  }
  if (Array.isArray(data) && !data.length) {
    const ele = document.getElementById('diy-play-list');
    ele.innerHTML = '<span style="color: #000;font-size: 14px;">播放列表</span><span style="color: #333;">播放列表暂无添加音乐</span>';
  }
}

// 设置收藏列表并且重新渲染
function setCollectList(data) {
  localStorage.setItem('hifini_collect_list', JSON.stringify(data));
  if (Array.isArray(data)) {
    const ele = document.getElementById('diy-collect-list');
    ele.innerHTML = '<span style="color: #000;font-size: 14px;">收藏列表</span>';
    const divEle = document.createElement('div');
    divEle.style = 'width: 100%;overflow-y: scroll;overflow-x: hidden;';
    let html = '';
    const index = localStorage.getItem('collect-list-index-zs');
    data.forEach((it, idx) => {
      html += `<div style="display: flex;height: 24px;align-items: center;">
        <span
          data-href="${it.href}"
          data-type="play"
          data-index="${idx}"
          style="overflow: hidden;flex: 1;word-break: break-all;white-space: nowrap;text-overflow: ellipsis;cursor: pointer;color: ${index && +index === idx ? 'blue' : '#212529'};"
        >
          ${it.name}
        </span>
        <span data-href="${it.href}" data-type="delCol" data-index="${idx}" style="white-space: nowrap;color: #9a2121;cursor: pointer;margin-left: 6px;">删除</span>
      </div>
      `;
    })
    divEle.innerHTML = html;
    divEle.addEventListener('click', e => {
      const { type, href, index } = e.target.dataset;
      const list = getCollectList();
      if (type === 'play') { // 播放
        location.href = href;
        localStorage.setItem('collect-list-index-zs', index);
        localStorage.setItem('current-play-list-item', 'collectList');
      } else if (type === 'delCol') { // 删除
        list.splice(+index, 1);
        setCollectList(list);
      }
    })
    ele.appendChild(divEle);
  }
  if (Array.isArray(data) && !data.length) {
    const ele = document.getElementById('diy-collect-list');
    ele.innerHTML = '<span style="color: #000;font-size: 14px;">收藏列表</span><span style="color: #333;">收藏列表暂无添加音乐</span>';
  }
}

// 通过判断className获取节点
function getNodeByClassName(node, name) {
  for (let i = 0; i < node.length; i++) {
    if (node[i].className.split(' ').includes(name)) {
      return node[i];
    }
  }
}

// 监听播放完毕
function watchPlayEnd() {
  const url = location.href;
  let count = 0;
  const timer = setInterval(() => {
    if (url !== location.href) {
      clearInterval(timer);
    }
    try {
      const dtime = document.querySelector('.aplayer-dtime').innerText;
      const ptime = document.querySelector('.aplayer-ptime').innerText;
      if (dtime === '00:00' && ptime === '00:00') {
        console.log('00:00');
        count++;
        if (count > 6) {
          next();
        }
        return;
      }
      const end = computedTime(dtime);
      const start = computedTime(ptime);

      if (start === end || start === (end - 1)) {
        clearInterval(timer);
        document.querySelector('.aplayer-icon-pause').click()
        next();
      }
    } catch (error) {
      clearInterval(timer);
    }
  }, 1000)
}

// 下一首
function next() {
  //播放收藏列表
  if (localStorage.getItem('current-play-list-item') == 'collectList') {
    let index = localStorage.getItem('collect-list-index-zs');
    if (index) {
      const data = getCollectList();
      // 顺序播放
      if (data.length === +index + 1) {
        location.href = data[0].href;
        localStorage.setItem('collect-list-index-zs', '0');
        return;
      }
      location.href = data[+index + 1].href;
      localStorage.setItem('collect-list-index-zs', +index + 1);
    }
    return;
  }

  //播放播放列表
  let index = localStorage.getItem('play-list-index-zs');
  if (index) {
    const data = getPlayList();
    const localOrder = localStorage.getItem('play-order-zs');
    const checked = localStorage.getItem('play-end-remove-result');
    if (`${checked}` === 'true') {
      data.splice(+index, 1);
      index = index - 1;
      localStorage.setItem('hifini_play_list', JSON.stringify(data));
    }
    // 随机播放
    if (localOrder === 'random') {
      let sindex = Random(1, data.length);
      console.log('随机生成 ', sindex);
      const alreadyPlayList = localStorage.getItem('already-play-list');
      if (alreadyPlayList) {
        try {
          const list = JSON.parse(alreadyPlayList);
          let count = 0;
          while (list.find(i => data[sindex - 1].href.includes(i.pathname)) && count <= 5) {
            sindex = Random(1, data.length);
            console.log('重新随机生成 ', sindex);
            count++;
          }
        } catch (err) {
          console.log(err.message);
        }
      }
      console.log('最终随机播放url：', sindex, data[sindex - 1].href);
      location.href = data[sindex - 1].href;
      localStorage.setItem('play-list-index-zs', sindex - 1);
    } else { // 顺序播放
      if (data.length === +index + 1) {
        location.href = data[0].href;
        localStorage.setItem('play-list-index-zs', '0');
        return;
      }
      location.href = data[+index + 1].href;
      localStorage.setItem('play-list-index-zs', +index + 1);
    }
  }
}

// 计算04:22 格式时长
function computedTime(time) {
  let result = 0;
  const arr = time.split(':');
  result += Number(arr[0]) * 60;
  result += Number(arr[1]);
  return result;
}

// 生成指定范围随机数
function Random(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}