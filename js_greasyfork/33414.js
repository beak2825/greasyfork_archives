// ==UserScript==
// @name        ctrl + shift 切换大小写
// @namespace   ctrlnshift
// @match       http://tool-bcg.bwe.io/editor/promo.php?*
// @version     1.4
// @author      Tiger
// @grant       none
// @description ctrl + shift切换选择文本的大小写(全部大写、全部小写或者首字母大写)
// @downloadURL https://update.greasyfork.org/scripts/33414/ctrl%20%2B%20shift%20%E5%88%87%E6%8D%A2%E5%A4%A7%E5%B0%8F%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/33414/ctrl%20%2B%20shift%20%E5%88%87%E6%8D%A2%E5%A4%A7%E5%B0%8F%E5%86%99.meta.js
// ==/UserScript==
class ToggleCase{
	constructor(id){
		this.el = document.getElementById(id);
		this.iCount = 1;
	}
	getStartIndex(){
		return this.el.selectionStart;
	}
	getEndIndex(){
		return this.el.selectionEnd;
	}
	toggle(start,selected,end){
		switch(this.iCount)
		{
			case 1:
				this.el.value = start + selected.toLowerCase() + end;
				this.iCount++;
			break;
			case 2:
				this.el.value = start + selected.replace(/(^|\s+)\w/g,s=>s.toUpperCase())+ end;
				this.iCount++;
			break;
			case 3:
				this.el.value = start + selected.toUpperCase() + end;
				this.iCount = 1;
			break;
		}
	}
	exe(){
		this.el.addEventListener('keydown',(e)=>{
			//if(e.shiftKey && e.key=='F9')
			if(e.shiftKey && e.ctrlKey)
			{
				e.preventDefault();
				let iStart = this.getStartIndex();
				let iEnd = this.getEndIndex();
				let sStart = this.el.value.substring(0,iStart);
				let sSelected = this.el.value.substring(iStart,iEnd);
				let sEnd = this.el.value.substring(iEnd,this.el.value.length);
				this.toggle(sStart,sSelected,sEnd);
				this.el.setSelectionRange(iStart,iEnd);
			}
		});
	}
}
let oTitle = new ToggleCase('title');
let oCode = new ToggleCase('couponCode');
let oDes = new ToggleCase('description');
oTitle.exe();
oCode.exe();
oDes.exe();
