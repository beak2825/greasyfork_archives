// ==UserScript==
// @name           Newegg cart to post converter for eggxpert.com
// @namespace      http://userscripts.org/users/62850
// @description    Converts the cart in to postable html that has been patched for the forums
// @include        http://secure.newegg.com/Shopping/ShoppingCart.aspx*
// @include        http://secure.newegg.ca/Shopping/ShoppingCart.aspx*
// @include        https://secure.newegg.com/Shopping/ShoppingCart.aspx*
// @include        https://secure.newegg.ca/Shopping/ShoppingCart.aspx*
// @version        3.7.2
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/1626/Newegg%20cart%20to%20post%20converter%20for%20eggxpertcom.user.js
// @updateURL https://update.greasyfork.org/scripts/1626/Newegg%20cart%20to%20post%20converter%20for%20eggxpertcom.meta.js
// ==/UserScript==
function addCommas(nStr){//http://www.mredkj.com/javascript/nfbasic.html
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
function getURL(findMe,txt=location.search){
	if(txt){
		txt=txt.slice(txt.indexOf('?')+1);
		var l=txt.indexOf('#');
		if(l>-1)
			txt=txt.slice(0,l);
		txt=txt.slice(txt.indexOf(findMe+'='));
		l=txt.indexOf('&');
		txt=txt.slice(findMe.length+1,l!=-1?l:void(0));
		return decodeURIComponent(txt.replace(/\+/g,'%20'));
	}
	return false;
}
function findEle(target,i,e){
	if(i==9)
		return document.evaluate(target, e?e:document, null, i, null).singleNodeValue;
	else
		return document.evaluate(target, e?e:document, null, i, null);
}
function make(tag){
	return document.createElement(tag);
}
function makeTXT(txt){
	return document.createTextNode(txt);
}
function genDivBox(table){
	var div=make('div'),
		child=make('div');
		child2=make('a');
	div.style.height=findEle('.//body/div[@id="container"]',9,false).offsetHeight+'px';
	div.id="GM_alert";
	child.addEventListener('click',function(){
		document.body.removeChild(findEle('.//body/div[@id="GM_alert"]',9,false));
	},false);
	child.textContent="X";
	child.className="close";
	child.title="Close";
	div.appendChild(child);
	child=make('div');
	child.appendChild(makeTXT('If you would like to readable HTML code, paste it in the '));
	child2.href="http://tools.arantius.com/tabifier";
	child2.textContent='Tabifier';
	child2.target="_blank";
	child.appendChild(child2);
	child.appendChild(makeTXT('.'));
	child.appendChild(make('br'));
	child2=make('input');
	child2.setAttribute('readonly','readonly');
	child2.setAttribute('onclick','this.select();');
	child2.value=table.outerHTML;
	child.appendChild(child2);
	child.appendChild(makeTXT('Copy & Paste the above code.'));
	child.appendChild(make('br'));
	child2=make('fieldset');
	child2.innerHTML='<legend>Preview</legend>';
	child.appendChild(make('center'));
	child.childNodes[child.childNodes.length-1].appendChild(child2);
	div.appendChild(child);
	child2.appendChild(table);
	document.body.appendChild(div);
}
var holder=findEle('.//table[@class="head"]/thead/tr/th[@align="right"]',9,false),btn,style;
if(holder){
	btn=make('a');
	btn.className='button button-mini button-tertiary';
	btn.href="javascript:void(false)";
	btn.textContent='Generate HTML Code';
	btn.title="HTML code for posting on forums";
	btn.addEventListener('click',function(){
		var table,tbody,tr,td,div,img,uri,
			i,cart,item,val,a,txt,IMG,price,
			items=Array(),mir=Array(),
			redirect='evilkitty.duckdns.org/neweggAdd2Cart.php?i=',//ITEM|Qty
  		direct='secure.newegg.com/Shopping/AddToCart.aspx?Submit=ADD&ItemList=',//ITEM|Qty,ITEM|Qty
			workaround=confirm("Re-write 'add to cart link' to make them work on community.newegg.com?\nLinks will run through 3ed party server.");
		table=make('table');
		table.border=1;
		table.appendChild(make('tbody'));
		tbody=table.childNodes[0];
		tr=make('tr');
		tr.align="center";
		td=make('th');
		td.textContent='Item';
		td.setAttribute('colspan',2);
		tr.appendChild(td);
		td=make('th');
		td.textContent='Quantity';
		tr.appendChild(td);
		td=make('th');
		td.textContent='Price';
		tr.appendChild(td);
		tbody.appendChild(tr);
		cart=findEle('.//table[contains(@class,"shipping-group")]/tbody/tr',6);
		for(i=0;i<cart.snapshotLength;i++){
			item=cart.snapshotItem(i);
			tr=make('tr');

			td=make('td');
			img=make('img');
			IMG=findEle('./td/div/a/img[@class="l-block product-image"]',9,item);
			img.src=IMG.src;
			td.appendChild(img);
			tr.appendChild(td);

			td=make('td');
			a=make('a');
			a.href=IMG.parentNode.href;
			a.target="_blank";
			a.textContent=IMG.parentNode.title;
			td.appendChild(a);
			tr.appendChild(td);

			td=make('td');
			td.align='center';
			txt=findEle('./td[@width="50px"]/input',9,item);
			td.textContent=txt?txt.value:findEle('./td[@width="50px"]/div',9,item).textContent;
			tr.appendChild(td);

			txt=td.textContent;

			td=make('td');
			td.align="right";
      price=findEle('./td[@align="right"]//li[starts-with(@class,"price-current")]',9,item);
			if(price){
				uri=getURL('Item',a.href);
        if(!uri){
          uri=getURL('ItemList',a.href);
        }
        a=uri;
				items.push(a+(workaround?',':'|')+txt);

				td.textContent=price.textContent.replace(/(\s|\t|\n)/g,'');
				a=make('a');
				a.target="_blank";
				a.textContent='Add to cart';
				a.href='http://'+(workaround?redirect:direct)+items[items.length-1];
				td.appendChild(make('br'));
				td.appendChild(a);
			}
			else{
				txt=findEle('./td[@align="right"]//li[starts-with(@class,"price-current")]',9,item);
				if(txt){
					td.textContent=txt.textContent.replace(/(\s|\t|\n)/g,'');
					td.appendChild(make('br'));
				}
				td.appendChild(makeTXT("Combo Item"));
			}
			tr.appendChild(td);

			txt=findEle('./td[@align="right"]//li[starts-with(@class,"price-note")]//a[contains(@title,"Mail In Rebate")]',9,item);
			if(txt){
				a=make('a');
				a.target="_blank";
				a.href=txt.href;
				a.title=a.href.slice(a.href.lastIndexOf('/')+1);
				txt=txt.textContent+' Rebate';
				txt=txt.slice(0,txt.indexOf(' '));
				a.textContent=txt;
				mir.push(a);
			}

			tbody.appendChild(tr);
		}
		tr=make('tr');

		td=make('td');
		td.setAttribute('colspan',3);
		td.textContent="Subtotal:";
		tr.appendChild(td);
		txt=findEle('.//table[contains(@class,"shipping-group")]/tfoot//span[@class="amount"]',6,false);
		td=make('td');
		val=0;
		for(i=0;i<txt.snapshotLength;i=i+2){
			val+=Number(txt.snapshotItem(i).textContent.replace(/(\$|\s|\t|\n|,)/g,''));
		}
		td.textContent='$'+addCommas(val.toFixed(2));
		td.align="right";
		tr.appendChild(td);

		tbody.appendChild(tr);
		tr=make('tr');

		td=make('td');
		td.setAttribute('colspan',3);
		td.textContent="Shipping + Tax:";
		tr.appendChild(td);

		td=make('td');
		td.align="right";
		val=0;
		for(i=1;i<txt.snapshotLength;i=i+2){
			val+=Number(txt.snapshotItem(i).textContent.replace(/(\$|\s|\t|\n|,)/g,''));
		}
		td.textContent='$'+addCommas(val.toFixed(2));
		tr.appendChild(td);
		tbody.appendChild(tr);

		cart=findEle('.//table[@class="applied-code"]/tbody/tr',6,false);
		for(i=0;i<cart.snapshotLength;i++){
			try{
				tr=make('tr');
				item=cart.snapshotItem(i);
				td=make('td');
				td.setAttribute('colspan',3);
				td.textContent='Promo Code: '+findEle('./td/strong',9,item).textContent;
				tr.appendChild(td);
				td=make('td');
				td.align='right';
				td.textContent=findEle('./td[@class="discount"]',9,item).textContent;
				tr.appendChild(td);
				tbody.appendChild(tr);
			}
			catch(e){
				continue;
			}
		}
		tr=make('tr');

		td=make('td');
		td.setAttribute('colspan',3);
		td.textContent="Grand Total:";
		tr.appendChild(td);

		td=make('td');
		td.align="right";
		td.textContent=findEle('.//td[@class="grand-total"]/span[@class="amount"]',9,false).textContent.replace(/(\s|\t|\n)/g,'');
		tr.appendChild(td);

		tbody.appendChild(tr);
		tr=make('tr');
		if(mir.length>0){
			td=make('td');
			td.setAttribute('colspan',2);
			td.appendChild(makeTXT(mir.length>1?'There are '+mir.length+' Mail-in Rebates: ':'There is '+mir.length+' Mail-in Rebate: '));
			for(i=0;i<mir.length;i++){
				td.appendChild(mir[i]);
				if(i+1<mir.length){
					td.appendChild(makeTXT(" | "));
				}
			}
			tr.appendChild(td);
		}

		a=make('a');
		a.target="_blank";
		a.href='http://'+(workaround?redirect:direct)+items.join(',');
		a.textContent='Add all to cart';
		td=make('td');
		td.align='right';
		td.setAttribute('colspan',mir.length>0?2:4);
		td.appendChild(a)
		tr.appendChild(td);
		tbody.appendChild(tr);

		genDivBox(table);
		window.scrollTo(0,0);
	},false);
	holder.insertBefore(btn,holder.childNodes[0]);
}
style=make('style');
style.type="text/css";
style.textContent='\
#GM_alert{\
	position:absolute;\
	top:0;\
	left:0;\
	width:calc(100% - 60px);\
	background-color:rgba(0,0,0,0.5);\
	padding:30px;\
	z-index:9001;\
}\
#GM_alert a{\
	color:blue;\
}\
#GM_alert .close{\
	background-color:red;\
	width:24px;\
	height:24px;\
	position:absolute;\
	right:3px;\
	top:3px;\
	border:1px solid white;\
	color:white;\
	border-radius:5px;\
	font-family:monospace;\
	font-size:21px;\
	text-align:center;\
	cursor:pointer;\
}\
#GM_alert > div:not(.close){\
	border-radius:5px;\
	background-color:#FFF;\
	padding:10px;\
}\
#GM_alert fieldset{\
	display:inline;\
	border-radius:5px;\
	text-align:left;\
}\
#GM_alert > div > input{\
	width:calc(100% - 9px);\
}\
#GM_alert table{\
	margin:0;\
	border:1px outset;\
}\
#GM_alert td, #GM_alert th{\
	border:1px inset;\
	padding:0;\
}';
document.head.appendChild(style);