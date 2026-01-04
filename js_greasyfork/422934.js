// ==UserScript==
// @name         JQuery DOM
// @namespace    https://greasyfork.org/
// @version      1.1.16
// @description  Optimize JQuery experience of insert DOM.
// @author       JMRY
// @include      *://*
// @grant        none
// ==/UserScript==
if(typeof jQuery===`function`){
	jQuery.getDOMString=function(dom_tag,dom_attr,dom_html){
		/*
		dom_tag:string
			HTML tags, like div, input, p, button, and so on.
		dom_attr:object
			HTML attributes, struct:
			{
				id:`id`,
				class:`class1 class2` OR [`class1`,`class2`],
				style:`border:none;` OR {border:`none`},
	
				Extend attributes:
				bind:{
					click:function,
				},
			}
		dom_attr:string
			HTML inner text
		dom_html:string
			HTML inner text
		*/
	
		//属性黑名单指的是在遍历属性时直接忽略的key。
		//如果需要处理这些key但不要插入html中，则应使用allow_insert_attr，将它置为false即可。
		let attr_blacklist=[
			`bind`,`children`,
		]
		
		if(dom_tag==undefined){ //html标记为空时，直接返回空值
			return ``;
		}else if(dom_tag!=undefined && dom_attr==undefined && dom_html==undefined){ //html标记不为空、属性和内容为空时，直接返回字符串
			return dom_tag;
		}else if(dom_tag!=undefined && dom_attr!=undefined && dom_html==undefined){
			dom_html=``;
		}
	
		let dom_attr_string=[];
	
		//dom_attr is string, it will be the inner html, without attributes.
		if(typeof dom_attr==`string`){
			dom_html=dom_attr;
		}else if(typeof dom_attr==`object`){
			let allow_insert_attr;
			for(let key in dom_attr){
				allow_insert_attr=true;
				let cur_dom_attr=dom_attr[key];
				// if(key!=`bind`){
				// if(jQuery.inArray(key,attr_blacklist)<0){
				if(!attr_blacklist.includes(key)){
					//HTML属性的特殊处理
					switch(key){
						//Class数组化处理
						case `class`:
							if(typeof cur_dom_attr==`object` && cur_dom_attr.length){
								cur_dom_attr=cur_dom_attr.join(` `).trim();
							}else if(typeof cur_dom_attr==`object` && cur_dom_attr.length==undefined){
								let classList=[];
								for(let key in cur_dom_attr){
									if(cur_dom_attr[key]==true){
										classList.push(key);
									}
								}
								cur_dom_attr=classList.join(` `).trim();
							}
						break;
	
						//Style对象化处理（交给getDOMObject，因此将allow_insert_attr置为false，以跳过插入属性）
						case `style`:
							if(typeof cur_dom_attr==`object`){
								allow_insert_attr=false;
							}
						break;
	
						//Html属性转为text。此属性会覆盖dom_html参数，因此不可混用
						case `html`:
							dom_html=cur_dom_attr;
							allow_insert_attr=false;
						break;
						//tbody属性处理
						case `tbody`: case `tr`: case `td`:
							allow_insert_attr=false;
						break;
					}
	
					//cur_dom_attr为undefined、null时，不插入此属性
					if(cur_dom_attr!=undefined && cur_dom_attr!=null && allow_insert_attr){
						dom_attr_string.push(`${key.replace(/([A-Z])/g,"-$1").toLowerCase()}="${cur_dom_attr}"`);
					}
				}
			}
		}
	
		if(dom_tag==`html`){
			return `${dom_html}`;
		}
		
		return `<${dom_tag} ${dom_attr_string.join(` `)}>${dom_html}</${dom_tag}>`;
	}

	jQuery.getDOMObject=function(dom_tag,dom_attr,dom_html, attach_type){
		//dom_tag为对象时，和普通情况一样
		if(typeof dom_tag==`object` && dom_tag.length==undefined){
			let dom_attr_fix_blacklist=[
				`tag`,`attachType`,
			]
			let dom_attr_fix_replace=new Map([
				[`tagName`,`tag`],[`tag_name`,`tagName`],
				[`attrName`,`attr`],[`attr_name`,`attrName`],
			]);
			let dom_attr_fix={};
			if(dom_tag.attr==undefined){
				for(let key in dom_tag){
					if(!dom_attr_fix_blacklist.includes(key)){
						let key_fix=key;
						if(dom_attr_fix_replace.get(key)){
							key_fix=dom_attr_fix_replace.get(key_fix);
						}
						dom_attr_fix[key_fix]=dom_tag[key];
					}
				}
			}
			dom_attr=dom_tag.attr || dom_attr_fix;
			dom_html=dom_tag.html;
			attach_type=dom_tag.attachType || attach_type;
			dom_tag=dom_tag.tag;
		}

		try{
			let domObject=jQuery(jQuery.getDOMString(dom_tag, dom_attr, dom_html));
			if(typeof dom_attr==`object`){
				//DOM样式
				try{
					/*
					CSS Struct:
					style:{
						width:`255px`,
						height:`255px`,
					}
					*/
					if(typeof dom_attr.style==`object`){
						domObject.css(dom_attr.style);
					}
				}catch(e){
					console.error(e);
				}

				//DOM事件绑定
				try{
					/*
					Bind Struct:
					bind:{
						click:function,
					}
					Another Struct:
					bind:{
						click:{
							data:{},
							function:function,
						}
					}
					*/
					if(typeof dom_attr.bind==`object`){
						for(let key in dom_attr.bind){
							let curBind=dom_attr.bind[key];
							domObject.unbind(key);
							if(typeof curBind==`function`){
								domObject.bind(key, curBind);
							}else if(typeof curBind==`object`){
								curBind={
									...{
										data:{},
										function(){},
									},
									...curBind,
								}
								domObject.bind(key, curBind.data, curBind.function);
							}
						}
					}
				}catch(e){
					console.error(e);
				}

				//DOM子项
				try{
					if(typeof dom_attr.children==`object`){
						let default_children={
							tag:undefined,attr:undefined,html:undefined,attachType:`append`
						};

						if(dom_attr.children.length==undefined){
							/*仅一个子项时，可以直接使用Object
							{
								tag:`html`,attr:{id:`id`},html:`Test`,attachType:`append`
							}
							*/
							let children={
								// ...default_children,
								...JSON.parse(JSON.stringify(default_children)),
								...dom_attr.children,
							}
							// domObject.attachDOM(children.tag,children.attr,children.html,children.attachType);
							domObject.append(jQuery.getDOMObject(children));
						}else{
							/*多个子项时，采用数组形式
							[
								{
									tag:`html`,attr:{id:`id1`},html:`Test1`,attachType:`append`
								},
								{
									tag:`html`,attr:{id:`id2`},html:`Test2`,attachType:`append`
								},
							]
							*/
							for(let i=0; i<dom_attr.children.length; i++){
								let children={
									// ...default_children,
									...JSON.parse(JSON.stringify(default_children)),
									...dom_attr.children[i],
								}
								// domObject.attachDOM(children.tag,children.attr,children.html,children.attachType);
								domObject.append(jQuery.getDOMObject(children));
							}
						}
					}
				}catch(e){
					console.error(e);
				}

				//TBODY表格
				try{
					if(typeof dom_attr.tbody==`object` || typeof dom_attr.tr==`object`){
						let default_tr={
							tag:`tr`,attr:undefined,html:undefined,children:[],attachType:`append`
						};
						let default_td={
							tag:`td`,attr:undefined,html:undefined,children:[],attachType:`append`
						}
						let trDomObject;
						let trList=dom_attr.tbody || dom_attr.tr;
						for(let i=0; i<trList.length; i++){
							let curTr=trList[i];
							let tr={
								...JSON.parse(JSON.stringify(default_tr)),
								...curTr
							}
							// let trDomObject=domObject.attachDOM(tr.tag,tr.attr,tr.html,tr.attachType);
							trDomObject=jQuery.getDOMObject(tr);
							for(let j=0; j<curTr.td.length; j++){
								let curTd=curTr.td[j];
								if(typeof curTd==`string`){
									curTd={html:curTd};
								}
								let td={
									...JSON.parse(JSON.stringify(default_td)),
									...curTd,
								}
								// trDomObject.attachDOM(td.tag,td.attr,td.html,td.attachType);
								trDomObject.append(jQuery.getDOMObject(td));
							}
							domObject.append(trDomObject);
						}
					}
				}catch(e){
					console.error(e);
				}
			}
			return domObject;
		}catch(e){
			//对不规范写法的容错，如：只传dom_tag的情况下，直接返回字符串，而不是JQuery对象。
			return jQuery.getDOMString(dom_tag, dom_attr, dom_html);
		}
	}

	jQuery.fn.attachDOM=function(dom_tag, dom_attr, dom_html, attach_type){
		//dom_tag为数组时，批量为母元素添加元素
		if(typeof dom_tag==`object` && dom_tag.length!=undefined){
			let default_children={
				tag:undefined,attr:undefined,html:undefined,attachType:`append`
			};
			if(attach_type==`append` || attach_type==`after`){
				//往插入时，将数组调转，以确保插入顺序和数组顺序一致
				dom_tag.reverse();
			}
			for(let cur of dom_tag){
				cur={
					...JSON.parse(JSON.stringify(default_children)),
					...cur,
				}
				this.attachDOM(cur,undefined,undefined,attach_type);
			}
			return;
		}

		let domObject=jQuery.getDOMObject(dom_tag, dom_attr, dom_html);

		switch(attach_type){
			case `append`:
				this.append(domObject);
			break;
			case `prepend`:
				this.prepend(domObject);
			break;
			case `after`:
				this.after(domObject);
			break;
			case `before`:
				this.before(domObject);
			break;
			case `html`:
				this.html(domObject);
			break;
		}
		
		return domObject;
	}

	jQuery.fn.appendDOM=function(dom_tag,dom_attr,dom_html){
		return this.attachDOM(dom_tag,dom_attr,dom_html,`append`);
	}
	jQuery.fn.prependDOM=function(dom_tag,dom_attr,dom_html){
		return this.attachDOM(dom_tag,dom_attr,dom_html,`prepend`);
	}
	jQuery.fn.afterDOM=function(dom_tag,dom_attr,dom_html){
		return this.attachDOM(dom_tag,dom_attr,dom_html,`after`);
	}
	jQuery.fn.beforeDOM=function(dom_tag,dom_attr,dom_html){
		return this.attachDOM(dom_tag,dom_attr,dom_html,`before`);
	}
	jQuery.fn.htmlDOM=function(dom_tag,dom_attr,dom_html){
		return this.attachDOM(dom_tag,dom_attr,dom_html,`html`);
	}
	jQuery.fn.getHtml=function(dom_tag,dom_attr,dom_html){
		return this.attachDOM(dom_tag,dom_attr,dom_html,`html`)[0].outerHTML;
	}
	jQuery.getDOMHtml=function(dom_tag,dom_attr,dom_html){
		return jQuery.fn.getHtml(dom_tag,dom_attr,dom_html);
	}
}