// ==UserScript==
// @name         CNBS Configurator Library
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Configurator library
// @author       Justin Shultz
// @grant        none
// ==/UserScript==

class Configurator{
	constructor(){
		this.cache = {};
	}
	
	init(imageID, selectionClass, baseConfig, imageUrlRoot, imageExtension){
		this.imageID = imageID;
		this.selectionClass = selectionClass;
		this.baseConfig = baseConfig;
		this.imageUrlRoot = imageUrlRoot.endsWith("/") ? imageUrlRoot.substring(0, imageUrlRoot.length - 1) : imageUrlRoot;
		this.imageExtension = imageExtension;

		this._setEventListeners();
	}
	
	reinitialize(){
		this._setEventListeners();
		this._updateImages();
	}
	
	async _updateImages(){
		let newImg = await this._combineImages(this._getCurrentSelectionURLs());
		document.getElementById(this.imageID).src = newImg;
	}
	
	_setEventListeners(){
		const selects = document.getElementsByClassName(this.selectionClass);
		Array.from(selects).forEach((s) => {
			s.addEventListener('change', this._updateImages.bind(this));
		});
	}

	async _combineImages(images){
		let c = document.createElement("canvas");
		let ctx = c.getContext("2d");
		let baseImg = await this._loadImage(`${this.imageUrlRoot}/${images[0]}`);
		c.width = baseImg.width;
		c.height = baseImg.height;
		
		ctx.drawImage(baseImg,0,0);

		for(let i=1; i < images.length; i++){
			let fullURL = `${this.imageUrlRoot}/${images[i]}`;
			let img = this.cache[images[i]];
			if(img === null) //url does not exist, skip to next image
				continue;
			
			if(img || await this._urlExistsPromise(fullURL)){ //if an image was pulled from the cache, continue, otherwise check if url exists
				if(!img){
					img = await this._loadImage(fullURL);
					this.cache[images[i]] = img;
				}
				ctx.drawImage(img,0,0);
			}
			else
				this.cache[images[i]] = null;
		}
		return c.toDataURL("image/png");
	}
	
	_loadImage(url){
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin="anonymous";
			img.onload = () => resolve(img);
			img.onerror = () => reject(new Error(`loading ${url} failed`));
			img.src = url;
		});
	}

	_getCurrentSelectionURLs(){
		var urls = [];
		let subFolder = this.baseConfig.subFolders[document.getElementsByName(this.baseConfig.baseImage)[0].value];
		if(subFolder.length > 0 && !subFolder.endsWith('/'))
			subFolder += '/';
		
		urls.push(`${subFolder}${document.getElementsByName(this.baseConfig.baseImage)[0].value}.${this.imageExtension}`);
		
		Array.from(document.getElementsByClassName(this.selectionClass)).forEach(async (e) => {
			var s = this.baseConfig.baseImage == e.name;
			if(!s && e.value){
					urls.push(`${subFolder}${e.value}.${this.imageExtension}`);
			}
		});
		
		return urls;
	}
	
	_urlExistsPromise(url){
		return new Promise((resolve, reject) => this._checkURL(url, (status) => status == null ? reject(status) : resolve(status)));
	}
	
	_checkURL(url, status){
		const xhr = new XMLHttpRequest();

		xhr.onload = () => {
			if (xhr.status == 200) {
				status(true);
			} else {
				status(false);
			}
		};

		xhr.open('HEAD', url);
		xhr.send();
	}
}