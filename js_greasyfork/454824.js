// ==UserScript==
// @name         仰晨-B站改造计划（为了学习版）
// @description  【1】支持 《2.5》《3》《3.5》《4》倍速   【2】《给出每集剩下的时间-----《只有教程集合才有效》 【3】《添加按钮控制《看进度》是否打开【4】《增加显示总时长 【5】【全屏时】视频的标题，改为当前播放集的标题（URL变化后）
// @license      AGPL License
// @namespace    https://mp.weixin.qq.com/s/zsVmSmd63OIxuoDbKGA-xg
// @version      2023.11.1
// @author       仰晨
// @match        *://www.bilibili.com/video/*
// @icon         https://bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454824/%E4%BB%B0%E6%99%A8-B%E7%AB%99%E6%94%B9%E9%80%A0%E8%AE%A1%E5%88%92%EF%BC%88%E4%B8%BA%E4%BA%86%E5%AD%A6%E4%B9%A0%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/454824/%E4%BB%B0%E6%99%A8-B%E7%AB%99%E6%94%B9%E9%80%A0%E8%AE%A1%E5%88%92%EF%BC%88%E4%B8%BA%E4%BA%86%E5%AD%A6%E4%B9%A0%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==





/**
 * 创建一个带属性的 HTML 元素***************************************************************************************************************************2023.7.10_01:18
 * @param {Object} options - 参数对象。
 * @param {string} options.type - HTML 元素的类型。
 * @param {Object} options.attributes - 元素的属性键值对。
 * @param {string} [options.textContent] - 可选的元素文本内容。
 * @return {HTMLElement} 带有指定属性的新 HTML 元素。
 */
function createElement({ type, attributes, textContent }) {
  const element = document.createElement(type);
  // 使用对象解构将属性键值对添加到元素
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  // 如果提供了 textContent 参数，则设置元素的文本内容
  if (textContent)element.innerText = textContent;
  return element;
}




/**
 * 格式化总时长，将秒数转换为小时、分钟和秒的字符串表示形式。*********************************************************************************************2023.7.10_01:18
 *
 * @param {number} totalSeconds - 总时长（单位：秒）。
 * @return {string} 格式化的总时长字符串，包含小时、分钟和秒。
 */
function formatDuration(totalSeconds) {
  const hours = parseInt(totalSeconds / 60 / 60);
  const minutes = parseInt((totalSeconds / 60) % 60);
  const seconds = parseInt(totalSeconds % 60);

  const hoursStr = hours > 0 ? `${hours}小时` : '';
  const minutesStr = minutes > 0 ? `${minutes}分` : '';

  return `${hoursStr}${minutesStr}${seconds}秒"`;
}


/** ************************************************************
* 代理执行方法
* @param elm  该元素存在时执行
* @param func 要执行的方法
*/
function proxyFunc(elm, func){
	const intervalID = setInterval(()=>{
		if(document.querySelector(elm)){
            func();
            clearInterval(intervalID);
        }
	}, 1000)
}


/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
插入倍速    2023.10.30更新
*/
proxyFunc('li[class="bpx-player-ctrl-playbackrate-menu-item "]', ()=>{
     (function 插入倍速(速度){
        //创建一个li元素
        const para = createElement({type: 'li',
                                    attributes: {class: 'bpx-player-ctrl-playbackrate-menu-item','data-value': 速度},
                                    textContent: 速度+"x"});
         //获取父标签
        let div=document.getElementsByClassName("bpx-player-ctrl-playbackrate-menu")[0];
         // 在父标签的第一个子元素，前插入div标签
        div.insertBefore(para,div.firstChild);
        return 插入倍速;
    })(2.5)(3)(3.5)(4);
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<



/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
更改搜索框推荐词    2023.10.30更新
*/
proxyFunc('.nav-search-input',()=>{
    //删除搜索框推荐的诱惑2023.2.25----27删除变修改（有时删除不掉）
    let search =document.getElementsByClassName("nav-search-input")[0];
    setTimeout(()=>{
        search.setAttribute("placeholder","好好学习");
        search.setAttribute("title","天天向上");},1000)
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<



/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
加载按钮及显示视频进度等    2023.10.31更新
*/
proxyFunc('.reply-warp',()=>{
     setTimeout(show,1000)
})
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<



/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
* 让视频在滚到顶部栏下方2023.8.21
*/
window.scrollBy(0/*左右*/, 100/*上下*/);
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<



/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
* 监控URL的变化 2023.11.1
* history.replaceState和pushState不会触发popstate事件，可以通过在方法里面主动的去触发popstate事件。
*/
(function MyPopstate(){
    // 改造
    const _historyWrap = function(type) {
        const orig = history[type];
        const e = new Event(type);
        return function() {
            const rv = orig.apply(this, arguments);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };
    //history.pushState = _historyWrap('pushState');
    history.replaceState = _historyWrap('replaceState');
    //监听
    //window.addEventListener('pushState', function(e) {console.log('change pushState')});
    window.addEventListener('replaceState', e=>rename());
})();


/**
* 把【全屏时】视频的标题，改为当前播放集的标题 2023.11.1
*/
function rename(){
    try{
        const query = attribute => document.querySelector(attribute);
        query('.bpx-player-top-left-title').innerText = query('li.on a div div .part').innerText
    }catch(e){
        console.log('换名失败')
    }
}
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<



//看进度方法---看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看


//------------给出每集剩下的时间-----《只有教程集合才有效》 鬼畜集合的标签是不同的所以无效的-------------------------=======================================================
function lookJinDu(){
    const element = document.getElementById("multi_page").getElementsByClassName("duration");	//每一集是时间标签

    const allElement = document.getElementsByClassName("list-box")[0].children;		//视频集合下的全部标签

    console.log("视频列表共有"+element.length);
    if(element.length===allElement.length){				//如果还没有进度就加进度
        //定义一个数组放每个视频的秒数
        let arr = [];
        let s_all = 0;
        //收集总时长-----//单纯是秒更好处理---------------------------------
        for(let i=0;i<element.length;i++){
            let timeStr = element[i].innerHTML;
            let s =0;//记录本次秒
            //console.log(timeStr);
            let times=timeStr.split(":");
            //console.log(times);
            if(times.length===2){
                s=parseInt(times[0])*60 + parseInt(times[1]);
            }else if(times.length===3){
                s = parseInt(times[0]) * 60 * 60 + parseInt(times[1]) * 60 + parseInt(times[2]);
            }else{
                s=parseInt(times[0]);
            }
            s_all+=s;
            arr.push(s);//将一个或多个元素添加到数组的末尾，并返回数组的新长度。
        }
        console.log("全部变成秒为"+s_all);


        //显示总时长在最前面2023.1.20  02:04 begin
        {//放在循环里面防止变量冲突
            let para = createElement({type: 'div',
                                      attributes: {class: 'jindu',
                                                   style:"position: absolute;top: -1px;left: 22%;color: #f2bfbf;"},
                                      textContent:`总时长:${formatDuration(s_all)}  加油ヾ(◍°∇°◍)ﾉﾞ"`});
            

            let list=document.getElementsByClassName("list-box")[0];//获取父标签---列表
            let listIndex=list.getElementsByTagName("li")[0];// 获取父标签的第1个子元素
            list.insertBefore(para,listIndex); // 在父标签的第一个子元素，前插入div标签
        }


        let s_front = 0;		//遍历到的时间总和
        //对每个 进行处理------------------------------------------------------------------------------------
        for(let i=0;i<arr.length;i++){
            s_front+=arr[i];
            //console.log("进度："+(s_front/s_all*100).toFixed(2)+"%")

            //转换为时分秒---------输出才用  内部用秒就好
            let H=0;
            let m=0;
            let s=0;

            //剩下时间
            s=s_all-s_front;

            m=parseInt(s/60);
            s=s%60;

            H=parseInt(m/60);
            m=m%60;
            //console.log("剩下时间:"+H+"小时"+m+"分"+s+"秒")

            //展示阶段-------------------------------------------------------------------
            //创建一个div标签
            let para = createElement({type: 'div',
                                      attributes: {class: 'jindu'},
                                      textContent: `看完${i + 1}集后  剩下时间:${H}小时${m}分${s}秒  进度：${(s_front / s_all * 100).toFixed(2)}%`});
            document.getElementsByClassName("clickitem")[i].appendChild(para);//2023.4.20放在列表下 再考虑用css解决  2023.5.4router-link-active有时候会不存在换他子类
        }
        document.getElementById("setText").innerText="已打开看进度";
    }else{//删除存在的进度标签
        let jindu = document.getElementsByClassName("jindu");
        for (let i = jindu.length-1; i>=0;i--)jindu[i].remove();
        
        document.getElementById("setText").innerText="已关闭看进度";
    }
}//看进度方法结束-----------------看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看看

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`   `4!!!!!!!!!!~4!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   <~:   ~!!!~   ..  4!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  ~~~~~~~  '  ud$$$$$  !!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  ~~~~~~~~~: ?$$$$$$$$$  !!!!!!!!!!!!!!
// !!!!!!!!!!!`     ``~!!!!!!!!!!!!!!  ~~~~~          "*$$$$$k `!!!!!!!!!!!!!
// !!!!!!!!!!  $$$$$bu.  '~!~`     .  '~~~~      :~~~~          `4!!!!!!!!!!!
// !!!!!!!!!  $$$$$$$$$$$c  .zW$$$$$E ~~~~      ~~~~~~~~  ~~~~~:  '!!!!!!!!!!
// !!!!!!!!! d$$$$$$$$$$$$$$$$$$$$$$E ~~~~~    '~~~~~~~~    ~~~~~  !!!!!!!!!!
// !!!!!!!!> 9$$$$$$$$$$$$$$$$$$$$$$$ '~~~~~~~ '~~~~~~~~     ~~~~  !!!!!!!!!!
// !!!!!!!!> $$$$$$$$$$$$$$$$$$$$$$$$b   ~~~    '~~~~~~~     '~~~ '!!!!!!!!!!
// !!!!!!!!> $$$$$$$$$$$$$$$$$$$$$$$$$$$cuuue$$N.   ~        ~~~  !!!!!!!!!!!
// !!!!!!!!! **$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$Ne  ~~~~~~~~  `!!!!!!!!!!!
// !!!!!!!!!  J$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$N  ~~~~~  zL '!!!!!!!!!!
// !!!!!!!!  d$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$c     z$$$c `!!!!!!!!!
// !!!!!!!> <$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$> 4!!!!!!!!
// !!!!!!!  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  !!!!!!!!
// !!!!!!! <$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*"   ....:!!
// !!!!!!~ 9$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$e@$N '!!!!!!!
// !!!!!!  9$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$  !!!!!!!
// !!!!!!  $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$""$$$$$$$$$$$~ ~~4!!!!
// !!!!!!  9$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$Lue  :::!!!!
// !!!!!!> 9$$$$$$$$$$$$" '$$$$$$$$$$$$$$$$$$$$$$$$$$$    $$$$$$$$$$  !!!!!!!
// !!!!!!! '$$*$$$$$$$$E   '$$$$$$$$$$$$$$$$$$$$$$$$$$$u.@$$$$$$$$$E '!!!!!!!
// !!!!~`   .eeW$$$$$$$$   :$$$$$$$$$$$$$***$$$$$$$$$$$$$$$$$$$$u.    `~!!!!!
// !!> .:!h '$$$$$$$$$$$$ed$$$$$$$$$$$$Fz$$b $$$$$$$$$$$$$$$$$$$$$F '!h.  !!!
// !!!!!!!!L '$**$$$$$$$$$$$$$$$$$$$$$$ *$$$ $$$$$$$$$$$$$$$$$$$$F  !!!!!!!!!
// !!!!!!!!!   d$$$$$$$$$$$$$$$$$$$$$$$$buud$$$$$$$$$$$$$$$$$$$$"  !!!!!!!!!!
// !!!!!!! .<!  #$$*"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*  :!!!!!!!!!!!
// !!!!!!!!!!!!:   d$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$#  :!!!!!!!!!!!!!
// !!!!!!!!!!!~  :  '#$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$*"    !!!!!!!!!!!!!!!
// !!!!!!!!!!  !!!!!:   ^"**$$$$$$$$$$$$$$$$$$$$**#"     .:<!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!:...                      .::!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//页面添加元素方法+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++2023.1.30抽取出来+++++++
function show (){
    if (document.querySelector(".head-left h3") != null) {//视频选集存在
        //看进度按钮
        let bt = createElement({type: 'div',
                                attributes: {id: 'setText'}, //设置id 方便改内容
                                textContent: `已打开看进度`});
        document.getElementById("app").appendChild(bt) //插入父标签下
        bt.onclick = () => lookJinDu() //开关按钮
        lookJinDu() //默认打开

        
        //滚—集合中《当前在看的》 滚到屏幕可见位置
        let see = createElement({type: 'div',
                                 attributes: {id: 'see',
                                              title:"如果正在播放的在屏幕可见处。\n是不会有效果的"},
                                 textContent: `当前播放集`});
        document.getElementsByClassName("head-con")[0].appendChild(see); //插入父标签下
        see.onclick = function () {
            //有时class会变...
            let on = document.getElementsByClassName("on");
            if (on < 2) {
                document.getElementsByClassName("watched")[0].scrollIntoView({block: "nearest",behavior: "smooth"});
            } else {
                on[on.length - 1].scrollIntoView({block: "nearest", behavior: "smooth"});
            }//平滑滚到到屏幕可见---滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚滚/滚/滚/滚/滚/
        }
    } else {//视频选集不存在？？？？？？？？？？？？？？？？？？？？？？2023.1.30
        //创建一个提醒按钮
        let tis = createElement({type: 'div',
                                 attributes: {id: 'setText'},
                                 textContent: `记得好好学习`});


        //插入父标签下
        document.getElementById("app").appendChild(tis);
        //————————————————————————————————————————————————————————————
        //设置标签内容
        let box_text= ` <img decoding="async" src="https://mp.weixin.qq.com/mp/qrcode?scene=10000004&amp;size=102&amp;__biz=MzU4OTc1NTI5Mw==&amp;mid=2247487235&amp;idx=1&amp;sn=afedbf6e40f5929e03c5c26fa3529639&amp;send_time=" width="82" height="82" alt="公众号：仰晨">
                            <div style="width:114px">    本脚本的作用在于学习的集合是初衷，边写边学是兴趣。</div>
                            <p>鄙人公众号:仰晨</p>`;//临时变量

        //创建一个默认隐藏的东东
        let move = createElement({type: 'div',
                                  attributes: {id: 'canSet'}}); //为了输出时标签不带双引号--直接写会带双引号会很神奇
        move.innerHTML = box_text;

        //插入父标签下
        document.getElementById("app").appendChild(move);

    }
}//页面添加元素方法结束+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//                              _   _
//    _______________          |*\_/*|________
//   |  ___________  |        ||_/-\_|______  |
//   | |           | |        | |           | |
//   | |   0   0   | |        | |   0   0   | |
//   | |     -     | |        | |     -     | |
//   | |   \___/   | |        | |   \___/   | |
//   | |___     ___| |        | |___________| |
//   |_____|\_/|_____|        |_______________|
//     _|__|/ \|_|_.............._|________|_
//    / ********** \            / ********** \
//  /  ************  \        /  ************  \
// --------------------      --------------------



//——————————————添加样式（分离操作）——————————————————————————————2023.1.25 begin
{
    let style=`
    #setText{
        position: fixed;
        right: 0px;
        bottom: 20px;
        width: 40px;
        z-index: 9999;
    }
    #see{
        position: absolute;
        top: 200px;
        left: 100%;
        width: 20px;

    }

    #see,
    #setText{
        border: 2px #fdbaba solid;
        background-color: #ffffff00;
        color: #FF6699;
        text-align: center;
        cursor: pointer;
        font-weight: 555;
        border-radius: 5px;
        transition: all .3s;
        opacity: 50%;
    }

    #setText:hover,
    #see:hover{
        background-color: #FFECF1;
        opacity: 100%;
    }


    #canSet{
         display: flex;
		 flex-wrap: wrap;
         position: fixed;
         right: -250px;
         transition: right .5s;
         bottom: 50px;
         width: 200px;
		 color: #9f8686;
         background-color: #e9b8fa59;
		 border-radius: 6px;
		 box-shadow: 3px 6px 10px 0px #8f9ca1;
		 border: 2px #fff solid;

    }

	#setText:hover+#canSet{
        right: 10px;
	}
    #canSet:hover{
		right: 15px;
	}

    /*----------2023.4.20---------------*/
    	/*进度样式*/
	[class="jindu"]{
        color: #d3d3d373;
		position: absolute;
		top: 16px;
		left: 1px;
		height: 20px;
		width: 400px;
	}
	.jindu::before {
  		content: " ";
	}

	/*为进度标签修改列表的样式*/
	.multi-page-v1.small-mode .cur-list .list-box li{
		overflow: visible;
		position: relative;
	}

	/*浮动在列表 进度的样式*/
	.multi-page-v1.small-mode .cur-list .list-box li :hover .jindu {
		/*color: #d3d3d3;2023.5.4换个颜色看看*/
        color: #f2bfbf;
	}

		/*浮动在列表 进度后追加的样式*/
	.multi-page-v1.small-mode .cur-list .list-box li :hover .jindu::before {
  		background-color: #fff;
		width: 400px;
		display: inline-block;
		position: absolute;
		z-index: -1;
	}

    /*给当前播放列添加一点样式2023.4.21*/
	[class="list-box"] [class="on"]::before,
	[class="list-box"] [class="watched on"]::before{
		background-color: #fff;
		width: 400px;
		left: 1px;
		top: 15px;
		position: absolute;
		content: " ";
		z-index: -1
	}
    `;

    //cursor:pointer;变小手   :hover碰到触发    transition: all .5s;过渡动画0.5秒   display: flex;弹性盒子


    let ele=document.createElement("style");
    ele.innerHTML=style;
    document.getElementsByTagName('head')[0].appendChild(ele);
}
//——————————————————————————————————————————————————————————