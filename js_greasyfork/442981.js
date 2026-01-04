// ==UserScript==
// @name         市场售价查看功能
// @connect      *
// @version      0.1
// @description  在一个平台同时查看多个平台售价
// @author       陈
// @match        https://www.c5game.com/csgo/default/*
// @match        https://www.igxe.cn/csgo/*
// @match        https://buff.163.com/market/csgo*
// @match        https://www.v5fox.com/csgo*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @connect      *
// @license MIT  
   
// @namespace https://greasyfork.org/users/897898
// @downloadURL https://update.greasyfork.org/scripts/442981/%E5%B8%82%E5%9C%BA%E5%94%AE%E4%BB%B7%E6%9F%A5%E7%9C%8B%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/442981/%E5%B8%82%E5%9C%BA%E5%94%AE%E4%BB%B7%E6%9F%A5%E7%9C%8B%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

//引入了jquery库，凡是$()均是jquery选择器
//jquery选择器简单语法
// .xxx 代表 选择类为xxx的元素
// #xxx 代表 选择id为xxx的元素
// div.xxx 代表 选择类为xxx的div标签
// div span 代表 选择div下一级子元素为span的元素
////////////////////////////////////
//【115行为代码开始执行处】
///////////////////////////////////////
//js中用a.b来选择a对象的b属性
//你先过一下，后面涉及到时你回头看就行



//去除名字中的所有空格
function Trim(str) {
    return str.replace(/\s*/g, "");
}

//用来替代GM_addStyle的方法
function addStyle(cssStr) {
	//try catch是捕获异常语句，执行try中的内容，如果发生错误执行catch中的语句，本代码中为空
    try {
        let node = document.createElement('style');//创建style标签
        node.textContent = cssStr;//设置样式内容为传进来的cssStr
        document.querySelector(':root').appendChild(node);//使用css选择器匹配根节点，将node节点，也就是style标签放入
    } catch (e) { }
}

//生成表单内容的json结构体
//这段你可能看不懂，你只需要知道是发送前进行一些数据格式的处理就行
//对jquery命名空间定义一个serializeObject函数，所有通过jquery选中的对象都可以使用这个方法
$.fn.serializeObject = function () {
	//创建一个对象o
    var o = {};
	//serializeArray()序列化调用此方法的对象，this指代调用此方法的对象，将其变为如下格式
	/*
		[
			{'name':'aa','value':'bb'},
			{'name':'aa','value':'bb'}
		]
	*/
    var a = this.serializeArray();
	//$.each遍历对象
	//第一个参数是要遍历的对象a
	//第二个参数是对每一个元素要执行的方法
    $.each(a,
    function () {
		//this指代a中正在被遍历的这一项
		//如果o对象中已经存在a被遍历的这项的的name
        if (o[this.name] !== undefined) {
			//并且被遍历的这一项的name没有嵌套在数组
            if (!o[this.name].push) {
				//将其初始为嵌套数组，如o={a,[a,b,c]}
                o[this.name] = [o[this.name]];
            }
			//将calue值插入被遍历的这项中
            o[this.name].push(this.value || '');
        } else {
			//第一次在o中插入这项
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//IGXE上的生成下一页链接的函数
function IGXE_gen_url(url, params) {
	//创建新对象
    var new_params = {};
    var new_params_length = 0;
	//遍历对象的标准写法
	//key指代的就是被遍历的对象中的单个元素
    for (var key in params) {
		//如果值不是undefind，就是有值
        if (params[key]) {
			//就把params[key]的值赋予new_params
			//假如key为0，params[key]值为1
			//那么new_params就变为
			/*
				{
					'0':1
				}
			*/
            new_params[key] = params[key];
            new_params_length += 1;
        }
    }
	//代表没链接了，返回链接
    if (new_params_length <= 0) {
        return url;
    }
	//返回url与?与new_params序列化后拼接成的字符串
	//序列化是说
	/*
		假设new_params对象原来是这这样
		{
			'a':'1',
			'b':'2'
		}
		jQuery.param(new_params)序列化后返回a=1&b=2
	*/
    return url + '?' + jQuery.param(new_params);
};


///////////////////////////////////////////////////////////此处为开始执行的位置/////////////////////////////////////////////////////////////////////////////////////////
//$(document)选中整个页面
//$(document).ready()页面加载完成执行ready()里的内容
$(document).ready(function () {
	//定义样式，以下为css样式内容,用于装饰元素，如果只是想知道这个脚本js原理，可不看
	//font-weight 字宽 blod 加粗
	//margin 这个元素与其他元素的距离
	// !important 最优先
	//white-space: nowrap 段落中的文本不进行换行
	//padding 是元素内部主体内容比如text与元素边界的距离
	//font-size：字体大小
    var myScriptStyle = '.myTitle {font-weight: bold;} \
                        .mySum {color: #429605;}\
                        .myPrice{color: #0b84d3;}\
                        .c5li{margin: 0px!important;white-space: nowrap; font-size: 12px;}\
                        .igli{padding:4px; font-size: 12px; white-space: nowrap;}\
                        .buffli{ width:auto!important; height: auto!important; float:none!important; margin: 0px!important; padding:4px!important; font-size: 12px; white-space: nowrap; border: inherit!important; border-radius: 0!important; background: #959595!important; }\
                        .buffli a{background: #959595!important; text-align: left!important;}\
                        .v5li {padding: 4px; font-size: 12px; white-space: nowrap;}';
    //position: absolute;绝对定位
	//box-shadow:边框阴影 参数为 x轴偏移 y轴偏移 模糊范围  阴影大小 颜色 inset是向里扩散
	myScriptStyle = myScriptStyle + '/* 容器 <div> - 需要定位下拉内容 */\
    .dropdown {\
        position: relative;\
        display: inline-block;\
    }\
\
    /* 下拉内容 (默认隐藏) */\
    .igxe-dropdown-content {\
        display: none;\
        position: absolute;\
        background-color: #1c2734!important;\
        min-width: 160px;\
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);\
        z-index: 9999;\
    }\
\
    /* 下拉菜单的链接 */\
    .igxe-dropdown-content a {\
        color: white;\
        padding: 12px 16px;\
        text-decoration: none;\
        display: block;\
    }\
    \
    /* 鼠标移上去后修改下拉菜单链接颜色 */\
    .igxe-dropdown-content a:hover {background-color: #313d4d!important;}\
    \
    /* 下拉内容 (默认隐藏) */\
    .buff-dropdown-content {\
        display: none;\
        position: absolute;\
        background-color: #1c2734!important;\
        min-width: 160px;\
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);\
        z-index: 9999;\
    }\
\
    /* 下拉菜单的链接 */\
    .buff-dropdown-content a {\
        color: white;\
        padding: 12px 16px;\
        text-decoration: none;\
        display: block;\
    }\
    \
    /* 鼠标移上去后修改下拉菜单链接颜色 */\
    .buff-dropdown-content a:hover {background-color: #f2efef!important;}\
    \
    /* 下拉内容 (默认隐藏) */\
    .v5-dropdown-content {\
        display: none;\
        position: absolute;\
        background-color: #1c2734!important;\
        min-width: 160px;\
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);\
        z-index: 9999;\
    }\
\
    /* 下拉菜单的链接 */\
    .v5-dropdown-content a {\
        color: white;\
        padding: 12px 16px;\
        text-decoration: none;\
        display: block;\
    }\
    \
    /* 鼠标移上去后修改下拉菜单链接颜色 */\
    .v5-dropdown-content a:hover {background-color: #313d4d!important;}';
	//以上均为css样式，修饰元素
	//调用函数addStyle，传入css内容
    addStyle(myScriptStyle);
	//location.href获取当前网址
	//str.indexOf('xxx')判断str中是否含有'xxx'，不包含则返回 -1
	//用在这里是判断当前网址是哪个CSGO饰品交易平台，然后执行对应的函数
	//转到c5()【393行】看，其他三个与c5()函数结构一样，跟流程走一遍剩下的三个你就能看懂了
    if (location.href.indexOf('c5game.com') > 0) {
        c5();
    }
    else if (location.href.indexOf('igxe.cn') > 0) {
        igxe();
    }
    else if (location.href.indexOf('buff.163.com') > 0) {
        buff();
    }
    else if (location.href.indexOf('v5fox.com') > 0) {
        v5fox();
    }
});

function addC5(c5URL, li, itemName) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: c5URL,
		//你的cookie填在这里
		cookie:"",
        onload: function (response) {
            var doc = (new DOMParser).parseFromString(response.responseText, 'text/html');
            var body = doc.querySelector('body');
            var items = $(body).find('.tab-content').find('li.selling');
            var hasNextPage = $(body).find('.pagination').find('.next').length == 0 ? false : true;
            for (var i = 0; i < items.length; i++) {
                var name = $(items[i]).find('.name').find('a').find('span').text();
                if (Trim(name) == Trim(itemName)) {
                    var url = 'https://www.c5game.com' + $(items[i]).find('a').attr('href');
                    var sum = $(items[i]).find('.info').find('.num').text().trim();
                    var price = $(items[i]).find('.info').find('.pull-left').find('.price').text();
                    $(li).html('<a href="' + url + '" style="padding: 0px"><span class="myTitle">C5：</span>' + '在售数量：<span class="mySum">' + sum + '</span>售价：<span class="myPrice">' + price + '</span></a>');
                    return;
                }
            }
            if (!hasNextPage) $(li).html('<a href="javascript:return false;" style="padding: 0px"><span class="myTitle">C5：</span><span style="color: #FF0000">查找不到数据！</span></a>');  //若没有下一页则可以判断没有该物品的数据
            else {
                var cur_page = $(body).find('.pagination').find('.active').find('a').text();
                var next_page = cur_page + 1;
                var url = 'https://www.c5game.com/csgo/default/result.html?k=' + itemName + '&page=' + next_page;
                addC5(url, li, itemName);
            }
        }
    })
}

function addIGXE(igxeURL, li, itemName) {
	//发起请求，请求方式为get
	//请求的url为传进来的url
    GM_xmlhttpRequest({
        method: 'GET',
        url: igxeURL,
		//对响应值的操作
        onload: function (response) {
			//第一页
			//(new DOMParser).parseFromString()将响应值解析为html格式，以便可以使用选择器对其选择以及操作
            var doc = (new DOMParser).parseFromString(response.responseText, 'text/html');
			//选择body
            var body = doc.querySelector('body');
			//选择body中的类为dataList的子元素
			//再选择类为dataList的子元素中类名为single的子元素
			//赋值给items变量
            var items = $(body).find(".list").find('.item');
			//a = b ? c : d 是js中的三元运算符
			//代表的意思是：b为true则a赋值为为c，否则a赋值为d
			//这里是找body中id为page-content的元素的下一级子元素中类名为next的元素，返回一个对象，没找到，那么对象的长度自然是0,条件成立，否则条件不成立
			//条件成立的话，根据前面说的a = b ? c : d，就让a的值为c，这里就是hasNextPage的值为false
            var hasNextPage = $(body).find('#page-content .next').length == 0 ? false : true;   //判断是否有下一页
			//循环遍历items，对每一个元素执行下面代码
            for (var i = 0; i < items.length; i++) {
				//$(items[i]).find('div.name').text()是找items中第i个元素的子元素中类名为name的div元素，获取其text，也就是内容
				//str.trim()是去除首尾两边的空格
                var name = $(items[i]).find('div.name').text().trim();
				//将name和itemName传入Trim()【就是代码中开头第一个函数】
				//如果返回值相等，代表找到了物品
                if (Trim(name) == Trim(itemName)) {
					//$(items[i]).attr('href') 获取item中第i个元素的href属性
					//与'https://www.igxe.cn'拼接起来赋值给url
                    var url = 'https://www.igxe.cn' + $(items[i]).attr('href');
					//找items中第i个元素的子元素中类名为clearfix的div元素，再找其子元素中类名为sum的div元素，获取其text，也就是内容，赋值给sum
                    var sum = $(items[i]).find('div.clearfix').find('div.sum').text().trim();
					//同上，找items中第i个元素的子元素中类名为clearfix的div元素，再找其子元素中类名为price的div元素，再找其子元素中的span元素，获取其text，也就是内容，
					//后面也是找元素，将前面与后面拼接赋值给price
                    var price = $(items[i]).find('div.clearfix').find('div.price').find('span').text().trim() + $(items[i]).find('div.clearfix').find('div.price').find('sub').text().trim();
                    //li是传进来的参数，设置其内容为括号里的内容
					$(li).html('<a href="' + url + '" style="padding: 0px"><span class="myTitle">IGXE：</span>' + '在售数量：<span class="mySum">' + sum + '</span>售价：<span class="myPrice">' + price + '</span></a>');
                    //找到了物品，返回，不执行后面的代码（【264-287】行的代码）
					return;
                }
				
            }
			//第一页没找到
			//如果！hasnextpage的值真，也就是hasNextPage值为假，【见233行】代表没有下一页，设置li的内容为括号里的内容
            if (!hasNextPage) $(li).html('<a href="javascript:return false;" style="padding: 0px"><span class="myTitle">IGXE：</span><span style="color: #FF0000">查找不到数据！</span></a>');  //若没有下一页则可以判断没有该物品的数据
           //hasNextPage值为真，代表还有下一页
			else {  //走igxe网站的流程到下一页查询
				//如果你按照流程看到这里，应该知道下面这句话什么意思了
				//获取$(body).find('#page-content .next')选择的元素的page_no属性值
                var page_no = $(body).find('#page-content .next').attr("page_no");  //获取下一页的页号
				//对选中的对象执行serializeObject()函数【见40行】
                var url_param = $(body).find('#params_form').serializeObject(); //params_form是网站上的一个隐藏元素，存放各种表单信息
                
				//将url_param中键为'page_no'的值赋值为变量page_no
				/*
					{
						'a':'b'
					}
					a称为键
					b称为值
				*/
				url_param['page_no'] = page_no; //把里面的page_no项换成下一页
				//同上
				//new Date()是js中获取时间的对象
                url_param['_t'] = new Date().getTime(); //得到当前时间戳
                var url = "/csgo/730";
				//拼接'https://www.igxe.cn'与调用IGXE_gen_url后的返回值赋值给url
				//////*看到这里你应该了解了流程，返回的响应数据为第一页的数据，然后代码找物品，没找到的话，获取下一页的链接，然后调用自己再找，如此重复*/////
				url = 'https://www.igxe.cn' + IGXE_gen_url(url, url_param);
				//自己调用自己叫做递归
                addIGXE(url, li, itemName); //递归调用该函数直到找到该物品
            }
        }
    });
}

function addBUFF(buffURL, li, itemName) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: buffURL,
        onload: function(response) {
            var data = $.parseJSON(response.responseText);
            data = data.data;
            for (var i = 0; data.items != 'undefined' && i < data.items.length; i++) {
                var name = data.items[i].name;
                if (Trim(name) == Trim(itemName)) {
                    var url = 'https://buff.163.com/market/goods?goods_id=' + data.items[i].id + '&from=market#tab=selling';
                    var sum = data.items[i].sell_num;
                    var price = '￥' + data.items[i].sell_min_price;
                    $(li).html('<a href="' + url + '" style="padding: 0px"><span class="myTitle">BUFF：</span>' + '在售数量：<span class="mySum">' + sum + '</span>售价：<span class="myPrice">' + price + '</span></a>');
                    return;
                }
            }
            var total_pages = data.total_page;
            var cur_page = data.page_num;
            if (cur_page >= total_pages) $(li).html('<a href="javascript:return false;" style="padding: 0px"><span class="myTitle">BUFF：</span><span style="color: #FF0000">查找不到数据！</span></a>');
            else {
                var next_page = cur_page + 1;
                var url = 'https://buff.163.com/api/market/goods?game=csgo&page_num=' + next_page + '&search=' + itemName.trim() + '&_=' + (new Date()).valueOf().toString();
                addBUFF(url, li, itemName);
            }
        }
    });
}

function addV5(v5URL, li, itemName) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: v5URL,
        onload: function (response) {
            var doc = (new DOMParser).parseFromString(response.responseText, 'text/html');
            var body = doc.querySelector('body');
            var items = $(body).find(".list-box").find('a');
            var hasNextPage = $(body).find('.laypage_next').length == 0 ? false : true;   //判断是否有下一页
            for (var i = 0; i < items.length; i++) {
                var name = $(items[i]).find('div.list-item-top').find('div.list-text-box').find('h5').text().trim();
                if (Trim(name) == Trim(itemName)) {
                    var url = 'https://www.v5fox.com' + $(items[i]).attr('href');
                    var sum = $(items[i]).find('div.list-item-bot').find('div.r').text().trim();
                    var price = $(items[i]).find('div.list-item-top').find('div.list-text-box').find('p').find('span').text().trim();
                    $(li).html('<a href="' + url + '" style="padding: 0px"><span class="myTitle">V5FOX：</span>' + '在售数量：<span class="mySum">' + sum + '</span>售价：<span class="myPrice">' + price + '</span></a>');
                    return;
                }
            }
            if (!hasNextPage) $(li).html('<a href="javascript:return false;" style="padding: 0px"><span class="myTitle">V5FOX：</span><span style="color: #FF0000">查找不到数据！</span></a>');
            else {
                var cur_page = $('.laypage_curr').text();
                var next_page = cur_page + 1;
                var url = 'https://www.v5fox.com/csgo/0-0?keyword=' + itemName + '&pageNum=' + next_page;
                addV5(url, li, itemName);
            }
        }
    });
}

function c5() {
	//$('.tab-content')选择类名为tab-content的元素
	//$().on('mouseenter', 'li.selling', function () {})函数的功能是绑定事件到元素，第一个参数是要绑定到元素的事件，这里是鼠标移上去
	//第二个参数是选择之前选中的元素的子元素中的内容，这里是类名为selling的li标签，事件绑定到选中的元素身上
	//第三个参数是当触发事件时要执行的方法
	//这里就是说当鼠标滑到类名为selling的li标签上时，执行function
    $('.tab-content').on('mouseenter', 'li.selling', function () {
		//$(this)指代的是选中的元素
		//$().find('ul')是找选中的元素的子元素中所有的ul标签，返回对象，没找到则对象长度为0
        if ($(this).find('ul').length > 0) {
			//找选中的元素的子元素中所有的ul标签，给其添加css样式
            $(this).find('ul').css('max-height', 'none');
            $(this).find('ul').css('overflow', 'visible');
            return;
        }
		//$(this).attr(a),只有一个参数，代表获取选中元素的属性值，
		//$(this).attr(a,b)两个参数代表给选中的元素设置a属性值为b
		//给选中的元素设置属性：让《鼠标放在它上面》这个属性为true，用于后面选择这些元素【336行】，对其操作
        $(this).attr('mouseover', 'true');   //当前鼠标在该物品上
        
		//新创建一个列表来存放各个饰品网站的相同物品数据
		//定义list为ul标签
		//网页中ul li 往往一起出现，代表列表 li为列表中的项
		//示例
		/*
		<ul>
			<li>1</li>
			<li>2</li>
			<li>3</li>
		</ul>
		*/
        var list = $('<ul class="rm-menu rm-css-animate rm-menu-expanded" aria-hidden="false" style="max-height: 0px; display: block; overflow: hidden; padding: 0px; position: absolute; z-index: 9999; left:-0.125em"></ul>');
		//找选中的元素的 子元素中 所有的 类名 为 text-unique 的span标签，获取其内容
        var itemName = $(this).find('span.text-unique').text(); //获取该物品的名字
		
		//将其名字 拼接 到igxe网的查询接口，仅仅是拼接，还未执行查询操作
        var igxeURL = 'https://www.igxe.cn/csgo/730?keyword=' + itemName;
		//创建标签li，子标签为span
        var igxeLi = $('<li class="rm-menu-item c5li"><span class="myTitle">IGXE：</span><span>载入中...</li>');
        //list中添加igxeLi
		//前面说到过list是ul标签列表
		//而igxeli为li标签，代表列表中的项
		//所以这里就是给list中添加一项
		$(list).append(igxeLi);
		//执行函数addIGXE，传入参数igxeURL, igxeLi, itemName
        addIGXE(igxeURL, igxeLi, itemName);  //获取igxe上的数据
		
		
		//下面这两个是查询剩余两个网站内容，结构与igxe的一模一样，你对照着看一下//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var buffURL = 'https://buff.163.com/api/market/goods?game=csgo&page_num=1&search=' + itemName.trim() + '&_=' + (new Date()).valueOf().toString();
        var buffLi = $('<li class="rm-menu-item c5li"><span class="myTitle">BUFF：</span><span>载入中...</li>');
        $(list).append(buffLi);
		//调用addBuff函数传入buffURL, buffLi, itemName参数
        addBUFF(buffURL, buffLi, itemName);  //获取BUFF上的数据
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var v5URL = 'https://www.v5fox.com/csgo/0-0?keyword=' + itemName;
        var v5Li = $('<li class="rm-menu-item c5li"><span class="myTitle">BUFF：</span><span>载入中...</li>');
        $(list).append(v5Li);
		//调用addV5函数，传入v5URL, v5Li, itemName参数
        addV5(v5URL, v5Li, itemName);  //获取V5FOX上的数据
		//$(this).attr('mouseover') 获取选中的元素的mouseover属性值
		//鼠标移开则 mouseover 属性会自动变为false
        if ($(this).attr('mouseover') == 'true') {   //若鼠标还在该物品上就不隐藏刚创建的列表
            $(list).css('max-height', 'none');
            $(list).css('overflow', 'visible');
        }
		//list添加到选中的元素下，成为子元素
        $(this).append(list);
    });

	
	
	//前面说到过，这是选中选择类名为tab-content的元素，为其子元素中的li标签都绑定mouseleave事件
	//当鼠标从li标签离开时执行函数
    $('.tab-content').on('mouseleave', 'li', function () {
		//$(this)的子元素找ul，返回对象，如果找到了（对象里有内容了，对象.length>0）就执行代码
        if ($(this).find('ul').length > 0) {
            $(this).find('ul').css('max-height', '0px');
            $(this).find('ul').css('overflow', 'hidden');
        }
		//设置《鼠标离开》这一属性为false
        $(this).attr('mouseover', 'false');
    });
}

function igxe() {
    $('.dataList').on('mouseenter', 'a.single', function () {
        if ($(this).find('div.igxe-dropdown-content').length > 0) {
            $(this).find('div.igxe-dropdown-content').css('display', 'block');
            return;
        }

        $(this).css({
            display: 'inline - block'
        });
        $(this).attr('mouseover', 'true');   //当前鼠标在该物品上

        var list = $('<div class="igxe-dropdown-content"></div>');
        var itemName = $(this).find('div.name').attr('title');

        var c5URL = 'https://www.c5game.com/csgo/default/result.html?k=' + itemName + '&page=1';
        var c5Li = $('<li class="igli"><span class="myTitle">C5：</span><span>载入中...</li>');
        $(list).append(c5Li);
        addC5(c5URL, c5Li, itemName);  //获取C5上的数据

        var buffURL = 'https://buff.163.com/api/market/goods?game=csgo&page_num=1&search=' + itemName.trim() + '&_=' + (new Date()).valueOf().toString();
        var buffLi = $('<li class="igli"><span class="myTitle">BUFF：</span><span>载入中...</li>');
        $(list).append(buffLi);
        addBUFF(buffURL, buffLi, itemName);  //获取BUFF上的数据

        var v5URL = 'https://www.v5fox.com/csgo/0-0?keyword=' + itemName;
        var v5Li = $('<li class="igli"><span class="myTitle">V5FOX：</span><span>载入中...</li>');
        $(list).append(v5Li);
        addV5(v5URL, v5Li, itemName);  //获取V5FOX上的数据

        if ($(this).attr('mouseover') == 'true') {   //若鼠标还在该物品上就不隐藏刚创建的列表
            $(list).css('display', 'block');
        }
        $(this).append(list);
    });

    $('.dataList').on('mouseleave', 'a.single', function () {
        if ($(this).find('div.igxe-dropdown-content').length > 0) {
            $(this).find('div.igxe-dropdown-content').css('display', 'none');
            return;
        }
        $(this).attr('mouseover', 'false');
    });
}

function buff() {
    $('#j_market_card').on('mouseenter', '#j_list_card li:not([class])', function () {
        if ($(this).find('div.buff-dropdown-content').length > 0) {
            $(this).find('div.buff-dropdown-content').css('display', 'block');
            return;
        }

        $(this).css({
            display: 'inline - block'
        });
        $(this).attr('mouseover', 'true');   //当前鼠标在该物品上

        var list = $('<div class="buff-dropdown-content"></div>');
        var itemName = $(this).find('a:first').attr('title');

        var c5URL = 'https://www.c5game.com/csgo/default/result.html?k=' + itemName + '&page=1';
        var c5Li = $('<li class="buffli"><span class="myTitle">C5：</span><span>载入中...</li>');
        $(list).append(c5Li);
        addC5(c5URL, c5Li, itemName);  //获取C5上的数据

        var igxeURL = 'https://www.igxe.cn/market/csgo?sort=3&keyword=' + itemName;
        var igxeLi = $('<li class="buffli"><span class="myTitle">IGXE：</span><span>载入中...</li>');
        $(list).append(igxeLi);
        addIGXE(igxeURL, igxeLi, itemName);  //获取igxe上的数据

        var v5URL = 'https://www.v5fox.com/csgo/0-0?keyword=' + itemName;
        var v5Li = $('<li class="buffli"><span class="myTitle">V5FOX：</span><span>载入中...</li>');
        $(list).append(v5Li);
        addV5(v5URL, v5Li, itemName);  //获取V5FOX上的数据

        if ($(this).attr('mouseover') == 'true') {   //若鼠标还在该物品上就不隐藏刚创建的列表
            $(list).css('display', 'block');
        }
        $(this).append(list);
    });

    $('#j_market_card').on('mouseleave', '#j_list_card li:not([class])', function () {
        if ($(this).find('div.buff-dropdown-content').length > 0) {
            $(this).find('div.buff-dropdown-content').css('display', 'none');
            return;
        }
        $(this).attr('mouseover', 'false');
    });
}

function v5fox() {
    $('.list-box').on('mouseenter', 'a.list-item', function () {
        if ($(this).find('div.v5-dropdown-content').length > 0) {
            $(this).find('div.v5-dropdown-content').css('display', 'block');
            return;
        }

        $(this).css({
            display: 'inline - block'
        });
        $(this).attr('mouseover', 'true');   //当前鼠标在该物品上

        var list = $('<div class="v5-dropdown-content"></div>');
        var itemName = $(this).attr('title');

        var c5URL = 'https://www.c5game.com/csgo/default/result.html?k=' + itemName + '&page=1';
        var c5Li = $('<li class="v5li"><a href="javascript:return false;" style="padding: 0px"><span class="myTitle">C5：</span><span>载入中...</a></li>');
        $(list).append(c5Li);
        addC5(c5URL, c5Li, itemName);  //获取C5上的数据

        var buffURL = 'https://buff.163.com/api/market/goods?game=csgo&page_num=1&search=' + itemName.trim() + '&_=' + (new Date()).valueOf().toString();
        var buffLi = $('<li class="v5li"><a href="javascript:return false;" style="padding: 0px"><span class="myTitle">BUFF：</span><span>载入中...</a></li>');
        $(list).append(buffLi);
        addBUFF(buffURL, buffLi, itemName);  //获取BUFF上的数据

        var igxeURL = 'https://www.igxe.cn/csgo/730?keyword=' + itemName;
        var igxeLi = $('<li class="v5li"><a href="javascript:return false;" style="padding: 0px"><span class="myTitle">IGXE：</span><span>载入中...</a></li>');
        $(list).append(igxeLi);
        addIGXE(igxeURL, igxeLi, itemName);  //获取igxe上的数据

        if ($(this).attr('mouseover') == 'true') {   //若鼠标还在该物品上就不隐藏刚创建的列表
            $(list).css('display', 'block');
        }
        $(this).append(list);
    });

    $('.list-box').on('mouseleave', 'a.list-item', function () {
        if ($(this).find('div.v5-dropdown-content').length > 0) {
            $(this).find('div.v5-dropdown-content').css('display', 'none');
            return;
        }
        $(this).attr('mouseover', 'false');
    });
}