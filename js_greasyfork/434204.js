// ==UserScript==
// @name        rendero-info
// @namespace   what.ever
// @match       https://www.renderosity.com/rr/mod/*
// @match       https://www.renderotica.com/store/sku/*
// @connect     renderosity.com
// @connect     renderotica.com
// @grant       GM_xmlhttpRequest
// @version     1.01
// @author      -
// @description -
// @downloadURL https://update.greasyfork.org/scripts/434204/rendero-info.user.js
// @updateURL https://update.greasyfork.org/scripts/434204/rendero-info.meta.js
// ==/UserScript==

const W = 380;
const H = 494;

let info = null;
// get info
try {
  if(location.host.includes('renderosity')){
    info = {
      store: 'Renderosity',
      title: document.querySelector('.title-header').innerHTML.split('<small>')[0].trim(),
      productID: document.querySelector('.mainImage').href.replace(/.+?product_(\d+).+/, '$1'),
      venderName: []
    }
    for(let a of document.querySelectorAll('.title-header > small > a')){
      if(a.innerText.length > 0){
        info.venderName.push(a.innerText);
      }
    }
  }else if(location.host.includes('renderotica')){
    info = {
      store: 'Renderotica',
      title: document.querySelector('.product-info > h1').innerText.trim(),
      productID: document.querySelector('.product-info > p > span').innerText.trim(),
      venderName: []
    }
    for(let a of document.querySelectorAll('.product-info > p > a')){
      info.venderName.push(a.innerText);
    }

    // wrap cover with lightbox
    const pImg = document.querySelector('.primary-image > img');
    const a = document.createElement('a');
    a.href = pImg.src;
    a.dataset.lightbox = 'image';
    pImg.parentNode.append(a);
    a.append(pImg);
  }
} catch (error) {
  console.error(`can't get product info\n`, error);
  return;
}

// add switcher for info panel
addBtn('📃', switchInfoPanel);
addBtn('✂', clipImage);

function switchInfoPanel(){
  const infoPanel = document.querySelector('#ro-info-panel') || createInfoPanel();
  if(infoPanel.style.display === 'block'){
    infoPanel.style.display = 'none';
  }else{
    infoPanel.style.display = 'block';
  }
}

function createInfoPanel(){
  const infoPanel = document.createElement('div');
  infoPanel.id = 'ro-info-panel';
  infoPanel.innerHTML = `
    <div class="ro-title">
      Product Name:
      <input type="text" class="value">
      <button class="ro-copy">copy</button>
    </div>
    <div class="ro-vender">
      Vender Name:
      <input type="text" class="value">
      <button class="ro-copy">copy</button>
    </div>
    <div class="ro-store">
      Store Name:
      <input type="text" class="value">
      <button class="ro-copy">copy</button>
    </div>
    <div class="ro-id">
      Product ID:
      <input type="text" class="value">
      <button class="ro-copy">copy</button>
    </div>
  `;

  // add style
  addStyle(`
    #ro-info-panel{
      position: fixed;
      top: 10rem;
      right: 3rem;
      z-index: 1;
      background-color: #fff6;
      padding: 1rem;
      border-radius: .5rem;
      text-align: right;
    }
    #ro-info-panel > div{
      margin: 5px;
    }
    .ro-copy{
      margin-left: 5px;
      cursor: pointer;
    }
  `);

  
  // fill info panel
  infoPanel.querySelector('.ro-title > .value').value = info.title;
  infoPanel.querySelector('.ro-vender > .value').value = info.venderName.join(',');
  infoPanel.querySelector('.ro-store > .value').value = info.store;
  infoPanel.querySelector('.ro-id > .value').value = info.productID;
  
  // bind listener
  infoPanel.addEventListener('click', ev=>{
    const t = ev.target;
    if(t.classList.contains('ro-copy')){
      t.previousElementSibling.select();
      if(document.execCommand('copy')) console.log('copied.');
    }
  })

  // show node
  document.body.append(infoPanel);

  return infoPanel;
}

function clipImage(){
  const imgBox = document.querySelector('#lightbox');
  const img = imgBox.querySelector('img');
  if(imgBox.style.display !== 'block'){
    alert('please select an image');
    return;
  }

  // get select box
  let selectBox = document.querySelector('#ro-select-box');

  if(!selectBox){
    createSelectBox();
  }else if(selectBox.style.display === 'none'){
    selectBox.style.display = 'block';
  }else{
    clip();
    selectBox.style.display = 'none';
  }

  function createSelectBox(){
    let selectBox = document.createElement('div');
    selectBox.id = 'ro-select-box';
    // add style
    addStyle(`
      #ro-select-box{
        position: absolute;
        z-index: 99;
        cursor: move;
        border: 2px dashed #fff;
      }
    `);
    selectBox.style.width = W + 'px';
    selectBox.style.height = H + 'px';
    selectBox.style.top = '0px';
    selectBox.style.left = '0px';
    imgBox.querySelector('img').after(selectBox);
    selectBox.addEventListener('mousedown', ev=>{
      const t = ev.target;
      window.prevX = ev.screenX;
      window.prevY = ev.screenY;
      if(t.id !== 'ro-select-box') return;
      selectBox.addEventListener('mousemove', handleDragBox);
    });
    document.body.addEventListener('mouseup', ev=>{
      selectBox.removeEventListener('mousemove', handleDragBox);
    });
    selectBox.addEventListener('contextmenu', ev=>{
      ev.preventDefault();
      selectBox.style.display = 'none';
    });
  
    // create resize corner
    const resizeCorner = document.createElement('div');
    resizeCorner.id = 'resize-corner';
    addStyle(`
      #resize-corner{
        width: 20px;
        height: 20px;
        background: red;
        position: absolute;
        bottom: -5px;
        right: -5px;
        cursor: se-resize;
        border-radius: 10px;
      }
    `);
    resizeCorner.addEventListener('mousedown', ev=>{
      window.prevX = ev.screenX;
      document.body.addEventListener('mousemove', handleResize);
    });
    document.body.addEventListener('mouseup', ev=>{
      document.body.removeEventListener('mousemove', handleResize);
    });
    selectBox.append(resizeCorner);
  
    function handleDragBox(ev){
      // console.log('dragging');
      const t = ev.target;
      const x0 = parseFloat(t.style.left.replace('px', ''));
      const y0 = parseFloat(t.style.top.replace('px', ''));
      t.style.left = ev.screenX - window.prevX + x0 + 'px';
      t.style.top = ev.screenY - window.prevY + y0 + 'px';
      window.prevX = ev.screenX;
      window.prevY = ev.screenY;
    }
  
    function handleResize(ev){
      // console.log('resizing');
      const x = ev.screenX - window.prevX;
      const y = x / W * H;
      const w0 = parseFloat(selectBox.style.width.replace('px', ''));
      const h0 = parseFloat(selectBox.style.height.replace('px', ''));
      selectBox.style.width = w0 + x + 'px';
      selectBox.style.height = h0 + y + 'px';
      window.prevX = ev.screenX;
    }
  }

  function clip(ev){
    // get img
    // can't use original img, blocked by CORS
    GM_xmlhttpRequest({
      url: img.src,
      method: 'GET',
      responseType: 'blob',
      onerror: console.error,
      onload: result=>{
        createImageBitmap(result.response).then(
          bitmap=>{
            const ratio = bitmap.height / img.parentElement.clientHeight;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const sx = ratio * parseFloat(selectBox.style.left.replace('px', ''));
            const sy = ratio * parseFloat(selectBox.style.top.replace('px', ''));
            const sw = ratio * parseFloat(selectBox.style.width.replace('px', ''));
            const sh = ratio * parseFloat(selectBox.style.height.replace('px', ''));
            canvas.width = W;
            canvas.height = H;
            ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, W, H);
            ctx.imageSmoothingQuality = 'high';
            // ctx.imageSmoothingEnabled = false;
            const a = document.createElement('a');
            a.download = info.title + '.jpg';
            a.href = canvas.toDataURL('image/jpeg', 0.9);
            a.click();
          }
        );
      }
    });
  }
}

function addStyle(css){
  const elm = document.createElement('style');
  elm.textContent = css;
  document.head.append(elm);
  return elm;
}

function addBtn(icon, callback){
  let ctn = document.body.querySelector('#my-btn-container');
  if(!ctn){
    ctn = document.createElement('div');
    ctn.id = 'my-btn-container';
    addStyle(`
      #my-btn-container{
        position: fixed;
        bottom: 80px;
        right: 80px;
        z-index: 20000;
      }
      #my-btn-container > div{
        background: #fff8;
        border-radius: 10px;
        border: 2px solid #0008;
        padding: 5px;
        margin: 5px 0;
        font-size: 20px;
        cursor: pointer;
        user-select: none;
        text-align: center;
      }
    `);
    document.body.append(ctn);
  }

  const btn = document.createElement('div');
  btn.innerText = icon;
  btn.addEventListener('click', callback);
  ctn.append(btn);

  return btn;
}