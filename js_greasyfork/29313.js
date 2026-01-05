// ==UserScript==
// @name         dm1080直接跳转
// @namespace    http://tampermonkey.net/
// @version      0.0.0.0.0.0.5
// @description   转换编号为直达链接，并不知道站长知道了这东西会不会做出什么应对措施.
// @homepage		https://greasyfork.org/zh-CN/scripts/29313-dm1080%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC
// @author       You
// @match        https://dm1080p.com/archives/*
// @match        https://52kbd.com/archives/*
//@connect  zzzpan.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/29313/dm1080%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/29313/dm1080%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==


var urlRegex = /[0-9A-Z]{7}(?=-| |$)/g; //正则,不区分大小写,匹配七位大写编码
//获取id名为main下entry-content类中的所有span元素
var sp=document.getElementById('main').getElementsByClassName('entry-content')[0].getElementsByTagName('span')

//递归函数,实现遍历同一个span元素中的多个编码匹配
//span:元素父节点,txt:innerHTML文本
function nam(span,txt) {
	var rex=txt.match(urlRegex)
	if (rex) {//如果正则匹配,不管多少,先处理再说
		var q=txt.indexOf(rex[0]) //最初匹配的位置
		var qtxt=txt.substring(0,q) //赋值匹配位置之前的所有文字
		var htxt=txt.substring(q+7) //赋值匹配位置之后的所有文字
		
		span.appendChild(document.createTextNode(qtxt)) //先在节点中插入最初的文字
		//创建超链接节点
		var elmLink = document.createElement("a");
		elmLink.href='https://zzzpan.com/?/file/view-'+rex[0]+'.html';
        //xh.url=elmLink.href
		elmLink.target="_blank";
		elmLink.innerText=rex[0]

        var cd=document.createElement("code")
        cd. style="font-size:100%; "
        cd.appendChild(elmLink)

        GM_xmlhttpRequest({
            method: 'GET',
            url: elmLink.href,
            headers: {
                'User-agent': navigator.userAgent,
                'Accept': 'text/xml',
                'referer': "https://zzzpan.com/index.php"
            },
            onload: function(responseDetails) {
                var parser = new DOMParser();
                var dom = parser.parseFromString(responseDetails.responseText,"application/xml");
                var d=dom.getElementsByClassName('linkHidden')[0].getElementsByTagName('a')[0]
                d.title='直接下载'
                d.innerText='📥'
                //下载链接的添加与代码所在位置和顺序无关
                s.appendChild(d)
            }
        });
        var s = document.createElement("span")
        s.appendChild(cd)
        //并追加到父结点中
		span.appendChild(s);

		nam(span,htxt)
	} else {
		//如果余下的文本中没有匹配,则直接追加
		span.appendChild(document.createTextNode(txt))
	}


}

for (var i = 0; i <sp.length; i++) {
	//var sp=ss[2].getElementsByTagName('span')
	var iH=sp[i].innerHTML //文本
	if (iH.match(urlRegex)) {
		//如果匹配成功,则先清除innerHTML
		sp[i].innerHTML=''
        //console.log(sp[i])
		nam(sp[i],iH)
	}
}