// ==UserScript==
// @name         emoji class for DTF-markdown
// @namespace    https://github.com/TentacleTenticals
// @version      0.0.1
// @description  emoji class
// @author       Tentacle Tenticals
// @license MIT
// @require https://greasyfork.org/scripts/455674-emoji-for-dtf-markdown/code/emoji%20for%20DTF-markdown.js?version=1123016
// ==/UserScript==
 
(function () {
'use strict';

class Emoji {
  constructor({ path, name, url, type }) {
    // this.m=document.createElement('div');
    // this.m.className='emojiContainer';
    // path.appendChild(this.m);

    // this.name=document.createElement('p');
    // this.name.className='emojiName';
    // this.name.textContent='';
    // this.name.textContent=name;
    // this.m.appendChild(this.name);

    this.mask = document.createElement('div');
    this.mask.className = 'emojiMask';
    path.appendChild(this.mask);

    type === 'animated' ? (this.e = document.createElement('video')) : (this.e = document.createElement('img'));
    this.e.className = 'emoji';
    this.e.src = url;
    this.e.onclick = () => {
      document.querySelector(
        `div[class='writeComment']`
      ).innerHTML += `::${name}::`;
      document.querySelector(`div[class='emojiPicker']`).remove();
    };
    this.e.onmouseenter = () => {
      this.e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].textContent = `:${name}:`;
      type === 'animated' ? (this.e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children[1].src =
            url)
        : (this.e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children[0].src =
            url);
    };
    this.e.onmouseleave = () => {
      this.e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[1].textContent =
        '';
      type === 'animated' ? (this.e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children[1].src =
            '')
        : (this.e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children[2].children[0].src =
            '');
    };
    this.mask.appendChild(this.e);
  }
}

window.EmojiPicker = class EmojiPicker {
  constructor(path) {
    if(document.getElementById('emojiPicker')) return;
    this.d = document.createElement('div');
    this.d.className = 'emojiPicker';
    this.d.id='emojiPicker';
    path.appendChild(this.d);

    this.title = document.createElement('div');
    this.title.className = 'title';
    this.title.textContent = 'EMOJI PICKER';
    this.title.onclick=() => {
      this.d.remove();
    }
    this.d.appendChild(this.title);

    this.field = document.createElement('div');
    this.field.className = 'emojiPicker-field';
    this.d.appendChild(this.field);

    // this.fieldPreviewName=document.createElement('div');
    // this.d.appendChild(this.fieldPreviewName);
    this.fieldPreview = document.createElement('div');
    this.fieldPreview.style = `
    display: flex;
    height: 70px;
    flex-direction: column;
    `;
    this.d.appendChild(this.fieldPreview);
    this.image = document.createElement('img');
    this.image.style = `
    position: relative;
    margin: auto;
    max-width: 70px;
    max-height: 70px;
    `;
    this.fieldPreview.appendChild(this.image);
    this.video = document.createElement('video');
    this.video.style = `
    position: relative;
    margin: auto;
    max-width: 70px;
    max-height: 70px;
    `;
    this.video.setAttribute('autoplay', '');
    this.fieldPreview.appendChild(this.video);

    this.na = document.createElement('div');
    this.d.appendChild(this.na);
    this.naLabel = document.createElement('div');
    this.naLabel.textContent = 'Not animated';
    this.naLabel.style = `
    text-align: center;
    color: white;
    margin-top: 5px;
    box-shadow: inset 0px 0px 8px 0px rgb(134 167 185);
    cursor: pointer;`;
    this.naLabel.onclick = () => {
      this.naLabel.nextElementSibling.classList.toggle('hidden');
    };
    this.na.appendChild(this.naLabel);

    this.emojiList = document.createElement('div');
    this.emojiList.className = 'groupList';
    this.na.appendChild(this.emojiList);

    this.a = document.createElement('div');
    this.d.appendChild(this.a);
    this.aLabel = document.createElement('div');
    this.aLabel.textContent = 'Animated';
    this.aLabel.style = `
    text-align: center;
    color: white;
    box-shadow: inset 0px 0px 8px 0px rgb(134 167 185);
    cursor: pointer;`;
    this.aLabel.onclick = () => {
      this.aLabel.nextElementSibling.classList.toggle('hidden');
    };
    this.a.appendChild(this.aLabel);

    this.animatedEmojiList = document.createElement('div');
    this.animatedEmojiList.className = 'groupList';
    this.a.appendChild(this.animatedEmojiList);

    // for(let group in emoji){
    //   for(let emj in emoji[group]){
    //     new Emoji({
    //       url: emoji[group][emj],
    //       name: emj,
    //       path : this.emojiList
    //     })
    //   }
    // }
    new EmojiGroup({
      path: this.emojiList,
      type: 'not animated',
    });
    new EmojiGroup({
      path: this.animatedEmojiList,
      type: 'animated',
    });
  }
}

class EmojiGroup {
  constructor({ path, type }) {
    // this.eg=document.createElement('div');
    // type === 'animated' ? this.eg.textContent='Animated' : this.eg.textContent='Not animated';
    // this.eg.style=`
    // text-align: center;
    // color: white;`;
    // path.appendChild(this.eg);

    for (let group in emoji[type]) {
      this.main = document.createElement('div');
      this.main.className = 'emojiGroup';
      path.appendChild(this.main);

      this.name = document.createElement('div');
      this.name.className = 'groupName';
      this.name.textContent = group;
      this.main.appendChild(this.name);

      this.g = document.createElement('div');
      this.g.className = 'emojiList';
      this.main.appendChild(this.g);

      for (let emj in emoji[type][group]) {
        new Emoji({
          url: emoji[type][group][emj],
          name: emj,
          path: this.g,
          type: type,
        });
      }
    }
  }
}

 
})();