// @namespace   https://github.com/TentacleTenticals/DTF Album library
// @grant       none
// @version     1.0
// @author      Tentacle Tenticals
// @description Библиотека для DTF альбома
// @homepage https://github.com/TentacleTenticals/DTF Album library
// @license MIT
// ==/UserScript==
/* jshint esversion:8 */

class CommAlbum {
  constructor({ path }) {
    this.album = document.createElement('div');
    this.album.className = 'commAlbum';
    path.appendChild(this.album);

    this.header = document.createElement('div');
    this.header.className = 'commAlbum-header';
    this.header.textContent = 'DTF Album Mini';
    this.album.appendChild(this.header);

    this.itemsNumber = document.createElement('div');
    this.itemsNumber.className = 'commAlbum-itemsNumber';
    this.album.appendChild(this.itemsNumber);

    this.list = document.createElement('div');
    this.list.className = 'commAlbumList';
    this.album.appendChild(this.list);

    return {
      album: this.album,
      itemsNumber: this.itemsNumber,
      albumList: this.list,
    };
  }
}