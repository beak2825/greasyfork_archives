// ==UserScript==
// @name         Kquery
// @version      2025.02.06
// @description  Add_iframe WaitingElement and more
// @author       You
// @grant        none
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_download
// @require https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// ==/UserScript==

/**
 * 添加一个iframe的类
 * @class
 * @example
	const mi = new My_iframe();
	mi.Add_iframe(url)
		.then(iframe=>{
			const id = mi.GetDocument();
			const img = $(id).find("img")
		});
*/
function My_iframe(){
	let iframe = null;
	this.Add_iframe = async(url)=>{
		return new Promise((resolve,reject)=>{
			// 创建一个iframe元素
			iframe = document.createElement('iframe');
		
			// 设置iframe的宽度和高度
			iframe.width = '1px';
			iframe.height = '1px';
		
			// 设置iframe的src属性，指向你想要打开的URL
			iframe.src = url;  // 请替换为你想要加载的URL
		
			// 将iframe添加到页面的body中
			document.body.appendChild(iframe);
		
			// 等待iframe加载完成后再操作它
			iframe.onload = function() {
				resolve(iframe);
			};
			iframe.onerror = function(){
				$(iframe).remove();
				reject(url);
			}
		})
	}
	this.GetDocument = ()=>{
		if(!iframe){return false;}
		return iframe.contentWindow.document;
	}
}
	
/**
 * 等待一个元素加载完毕的方法
 * @param {function():JQuery} GetEle -获取元素的方法
 * @example
	const GetEle = ()=>$("img");
	WaitingElement(GetEle)
		.then(tag=>{
			
		})
*/
async function WaitingElement(GetEle){
	return new Promise(resolve=>{
		let ele = GetEle();
		if(ele.length>0){resolve(ele);}else{
			let check = setInterval(()=>{
				let ele = GetEle();
				if(ele.length>0){
					resolve(ele);
					clearInterval(check);
				}
			},100)
		}
	})
}

/**
 * 在网页底部出现调试的方法
 * @param {string} mess -要显示的信息
 * @param {JQuery} item -要显示在什么元素上（可选）
 * @example
	ConsoleWrite("error");
*/
function ConsoleWrite(mess,item){
	if(item.length>0){item.text(mess);return item;}
	let div = $(".console");
	if(div.length==0){
		div = `
			<div class="console"></div>
			<style>
				.console{
					position:fixed;
					width:100%;
					background:black;
					color:white;
					bottom:0;
				}
			</style>
		`
		$('body').append(div);
		div = $(".console");
		div.on('touchstart',function(){$(this).hide()});
	}
	div.text(mess);
	return div;
}

/**
 * 添加按键控制网页
 * @example
	const kc = new KeyControler();
	kc.AddEvent({
		upItem:$("up");
		downItem:$("down");
		leftItem:$("left");
		rightItem:$("right");
		closew:$("close");
	})
	kc.RemoveEvent();
*/
function KeyControler() {
    let Events = [];
    this.downItem = $('<a></a>').click(function () {
        var currentScroll = document.documentElement.scrollTop;
        var scrollDistance = $(window).height() / 2;
        console.log(currentScroll);
        window.scrollTo(0, currentScroll + scrollDistance);
    });
    this.upItem = $('<a></a>').click(function () {
        var currentScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        var scrollDistance = window.innerHeight / 2;
        window.scrollTo(0, currentScroll - scrollDistance);
    });

    this.Event = (args, event) => {
        if (!args.upItem) { args.upItem = this.upItem; }
        if (!args.downItem) { args.downItem = this.downItem; }

        switch (event.key) {
            case 'ArrowLeft':
                if (args.leftItem && args.leftItem.length > 0) {
                    args.leftItem[0].click();
                    console.log('Left arrow key pressed');
                }
                break;
            case 'ArrowRight':
                if (args.rightItem && args.rightItem.length > 0) {
                    args.rightItem[0].click();
                    console.log('Right arrow key pressed');
                }
                break;
            case 'ArrowUp':
                if (args.upItem && args.upItem.length > 0) {
                    args.upItem[0].click();
                    console.log('Up arrow key pressed');
                }
                break;
            case 'ArrowDown':
                if (args.downItem && args.downItem.length > 0) {
                    args.downItem[0].click();
                    console.log('Down arrow key pressed');
                }
                break;
            case '0':
                if (typeof closew !== 'undefined' && args.closew) {
                    window.close();
                    console.log('Window closed');
                }
                break;
            default:
                break;
        }
    };

    this.AddEvent = (args) => {
        const eventHandler = (event) => {
            this.Event(args, event);
        };
        document.addEventListener('keydown', eventHandler);
        Events.push(eventHandler);
    };

    this.RemoveEvent = () => {
        Events.forEach(handler => {
            document.removeEventListener("keydown", handler);
        });
        Events = [];
    };
}

