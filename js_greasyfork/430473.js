// ==UserScript==
// @name      Imgur numbered images 3
// @description Numbers images in Imgur galleries
// @namespace ouroborus.org
// @version   1
// @match     https://imgur.com/*
// @grant     none
// @downloadURL https://update.greasyfork.org/scripts/430473/Imgur%20numbered%20images%203.user.js
// @updateURL https://update.greasyfork.org/scripts/430473/Imgur%20numbered%20images%203.meta.js
// ==/UserScript==

var script = document.createElement('script');
script.id = 'numberedImages';
script.textContent = `
(()=>{
const client_id = '546c25a59c58ad7';
const root = document.querySelector('#root');
const old = {};
let here = '';
let items = {};

const styles = [
  '.Gallery-ContentWrapper .Gallery-Content--mediaContainer {position:relative;}',
  '.Gallery-ContentWrapper .Gallery-Content--mediaContainer[data-idx]::after {position:absolute;top:0.5em;right:100%;padding:0.5em;border-radius:3px 0 0 3px;background:#2c2f34;content:"#" attr(data-idx)}',
];
const sheet = document.createElement('style');
sheet.setAttribute('id','numberItems');
sheet.appendChild(document.createTextNode(styles.join('\\n')));
document.head.appendChild(sheet);

const watcher = (fn,cb) => {
  const w = () => {
    if(fn()) setTimeout(w, 100);
    else cb();
  };
  w();
}

['pushState', 'replaceState'].forEach(state => watcher(
  () => history[state] == history.__proto__[state],
  () => {
    old[state] = history[state];
    history[state] = function(...args) {
      //console.log(state, this, args, location.pathname);
      
      if(args.length >= 3) number(args[2]);
      
      return old[state].call(this, ...arguments);
    }
  }
));

window.addEventListener('popstate', event => {
  //console.log('popstate', event, location.pathname.toString());
  
  number(location.pathname);
});

const update = node => {
  //console.log('###',node);
  const inner = node.querySelector('.PostVideo video > source, .imageContainer img');
  if (!inner) {
    //console.log('inner not found');
    return;
  }
  const id = inner.src.split('.com/',2)[1].split('.',1)[0];
  if(id in items) node.setAttribute('data-idx', items[id]);
};

const number = (pathname) => {
  if(pathname == here) return;
  here = pathname;

  if(!pathname.startsWith('/gallery/')) {
    here = '';
    return;
  }
  
  items = {};
  const gallery = pathname.substring(9);
  
  fetch('https://api.imgur.com/3/gallery/album/'+gallery+'?client_id='+client_id)
    .then(response=>response.json())
    .then(json=>{
      items = Object.fromEntries(json.data.images.map((v,i) => [v.id, i+1]));
      root.querySelectorAll('.Gallery-Content--mediaContainer').forEach(update);
    });
};

const observer = new MutationObserver((mutations, observer) => {
  //console.log('MutationObserver', mutations);
  mutations.forEach(record => record.addedNodes.forEach(node => {
    //console.log('addedNodes', node);
    if(node.classList.contains('Gallery-Content--mediaContainer')) {
      update(node);
      return;
    }
    // handle "Load More" button
    if(node.nodeName == 'DIV') {
      const parent = node.parentElement;
      if(parent && parent.tagName == 'DIV' && parent.classList.contains('Gallery-ContentWrapper')) {
        node.querySelectorAll('.Gallery-Content--mediaContainer').forEach(update);
        return;
      }
    }
  }));
}).observe(root, { attributes: false, childList: true, subtree: true });

number(location.pathname);

//console.log('installed');
})();
`;
document.head.append(script);
