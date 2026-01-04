// ==UserScript==
// @name         妖火网增强插件
// @namespace    https://yaohuo.me/
// @version      0.22
// @description  妖火网回复增强
// @author       外卖不用券(id:23825)
// @match        https://yaohuo.me/*
// @icon         https://yaohuo.me/css/favicon.ico
// @grant        unsafeWindow
// @license      MIT
// @2022/3/11    增加无跳转回复帖子
// @2022/3/11    去除jQuery，使用原生方式获取元素，支持非油猴手机浏览器
// @2022/3/12    回帖增加图床，自动插入图片UBB
// @2022/3/12    增加论坛表情包展开可视化选择
// @2022/3/12    增加文字颜色UBB快捷选择
// @2022/3/12    网址链接自动替换成UBB格式
// @2022/3/12    修复图片UBB与提取网址UBB冲突
// @2022/3/13    增加无感深入查看下一页回帖
// @2022/3/13    Alook安卓&iOS测试通过
// @2022/3/13    增加无跳转回复任意楼层

// @202003132004在外卖佬0.20基础添加了UBB快捷功能
// @author       北行(id:3321)

// @202003132234在0.21基础添加了将普通文本替换成链接的功能(使用了一个其他作者的脚本)
// @author       北行(id:3321)

// @downloadURL https://update.greasyfork.org/scripts/441454/%E5%A6%96%E7%81%AB%E7%BD%91%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/441454/%E5%A6%96%E7%81%AB%E7%BD%91%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
;
console.log("妖火网分享你我！");
const FORE_COLORS = {
    '会员红': '#ff00c0',
    '妖火蓝': '#3d68a8',
    '论坛绿': '#21b273'
};
const ADD_UBB = {
    '超链接': '[url=]  [/url]',
    '加粗':'[b]  [/b]',
    '斜体':'[i]  [/i]',
    '下划线':'[u]  [/u]',
    '删除线':'[strike]  [/strike]'
};
/* 表单对象序列化 */
function stringify(obj, sep, eq) {
    sep = sep || '&';
    eq = eq || '=';
    let str = "";
    for (var k in obj) {
        str += k + eq + unescape(obj[k]) + sep;
    }
    return str.slice(0, -1);
};

/* POST表单封装 */
async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: stringify(data)
    });
    return response;
}

/* GET简单封装 */
async function getData(url = '') {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    });
    return response.text();
}

/**
 * 内容ubb检测处理
 */
function ubbProcess(content) {
    /* 匹配内容网址，替换为[url=https://xxx][/url]链接UBB */
    const urlReg = new RegExp("((http|ftp|https):\/\/[\\w\-_]+(\.[\\w\-_]+)+([\\w\-\.,@?^=%&:/~\+#]*[\\w\-\\@?^=%&/~\+#])?)");
    /* const urlReg = /((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/; */
    const urlMatchResult = content.match(urlReg);
    if (urlMatchResult != null && content.indexOf('[img]') == -1) {
        /* TODO简单排除图片UBB内链接 */
        const urlString = urlMatchResult[0];
        content = content.replace(urlString, '[url]' + urlString + '[/url]');
    }
    /* 添加[forecolor=#000000][/forecolor]文本颜色UBB */
    let foreColor = document.getElementsByName("forecolor")[0];
    if (foreColor && foreColor.value != '文字颜色') {
        let chooseColor = FORE_COLORS[foreColor.value];
        content = '[forecolor=' + chooseColor + ']' + content + '[/forecolor]';
    }
    return content;
}

/*
 * 无跳转回帖
 */
let replyButton = document.getElementsByName("g")[0];
if (replyButton && replyButton.value == "快速回复") {
    replyButton.addEventListener('click',
        function (event) {
            event.preventDefault();
            let content = document.getElementsByName("content")[0].value;
            if (content.length) {
                content = ubbProcess(content);
                /* 获取form表单参数 */
                var face = document.getElementsByName("face")[0].value;
                var sendmsg = document.getElementsByName("sendmsg")[0].value;
                var action = document.getElementsByName("action")[0].value;
                var id = document.getElementsByName("id")[0].value;
                var siteid = document.getElementsByName("siteid")[0].value;
                var lpage = document.getElementsByName("lpage")[0].value;
                var classid = document.getElementsByName("classid")[0].value;
                var sid = document.getElementsByName("sid")[0].value;
                var g = document.getElementsByName("g")[0].value;
                /* 发表回复 */
                postData('/bbs/book_re.aspx', {
                    face: face,
                    sendmsg: sendmsg,
                    content: content,
                    action: action,
                    id: id,
                    siteid: siteid,
                    lpage: lpage,
                    classid: classid,
                    sid: sid,
                    g: g
                }).then(function (data) {
                    /* console.log(data)  回复成功！</b> 获得妖晶:30，获得经验:10<br/> 跳转中... */
                    location.reload();
                    /* 直接刷新页面，没有优化处理 */
                })
            }
        })
}

/*
 * 图床传图
 */
let PIC_UPLOAD_API = "https://kf.dianping.com/api/file/burstUploadFile";
function uploadImage() {
    console.log("上传图片");
    let uploadimg = document.getElementsByName("upload-image")[0];
    /* 构造表单 */
    const formData = new FormData();
    formData.append('files', uploadimg.files[0]);
    formData.append('fileName', uploadimg.files[0].name);
    formData.append('part', '0');
    formData.append('partSize', '1');
    formData.append('fileID', new Date().getTime());
    /* 请求头 */
    let headers = {
        'Host': 'kf.dianping.com',
        'CSC-VisitId': 'access-0ef0c9ff-03d9-42b9-952a-0a221e9c0e3a',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
    };
    postImage(PIC_UPLOAD_API, formData, headers).then(function (data) {
        if (data.code == 200) {
            let uploadPath = data.data.uploadPath;
            /* 粘贴UBB代码到文本框 */
            let content = document.getElementsByName("content")[0];
            content.value += '\r\n[img]' + uploadPath + '[/img]';
        }
    }).
        catch(function (error) {
            console.log(error);
        })
}

/* POST图片封装 */
async function postImage(url = '', data = {},
    headers = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: data
    });
    return response.json();
}

/* 创建上传文件按钮、自动上传 */
let replyForm = document.getElementsByName("f")[0];
if (replyForm) {
    let sendmsg = document.getElementsByName("sendmsg")[0];
    sendmsg.insertAdjacentHTML('afterend', '<input type="file" style="width: 40%" name="upload-image" accept="image/*" value="">');
    let uploadimg = document.getElementsByName("upload-image")[0];
    uploadimg.addEventListener('change',
        function () {
            uploadImage();
        })
}

/*
 * 表情展开
 */
let faceSelect = document.getElementsByName("face")[0];
if (faceSelect) {
    /* 隐藏表情下拉组件 */
    faceSelect.style.cssText = 'display: none;';
    /* 创建新的表情选框 */
    faceSelect.insertAdjacentHTML('afterend', '<input type="button" value="表情" name="new-face" style="padding: 0px 20px;margin-right: 3px;height: 19px;border-radius: 2px;border-color: rgb(133, 133, 133);">');
    let newface = document.getElementsByName("new-face")[0];
    newface.addEventListener('click',
        function () {
            /* console.log('展开新表情'); */
            let newFaceBox = document.getElementsByName('new-face-box')[0];
            if (newFaceBox.style.display == "none") {
                newFaceBox.style.display = "block";
            } else newFaceBox.style.display = "none";
        });
    /* 创建表情图标 */
    createNewFace();
}
function createNewFace() {
    let content = document.getElementsByName("content")[0];
    if (content) {
        let faceHtml = '<div style="display:none" name="new-face-box">';
        const faces = ["踩.gif", "狂踩.gif", "淡定.gif", "囧.gif", "不要.gif", "重拳出击.gif", "砳砳.gif", "滑稽砳砳.gif", "沙发.gif", "汗.gif", "亲亲.gif", "太开心.gif", "酷.gif", "思考.gif", "发呆.gif", "得瑟.gif", "哈哈.gif", "泪流满面.gif", "放电.gif", "困.gif", "超人.gif", "害羞.gif", "呃.gif", "哇哦.gif", "要死了.gif", "谢谢.gif", "抓狂.gif", "无奈.gif", "不好笑.gif", "呦呵.gif", "感动.gif", "喜欢.gif", "疑问.gif", "委屈.gif", "你不行.gif", "流口水.gif", "潜水.gif", "咒骂.gif", "耶耶.gif", "被揍.gif", "抱走.gif",];
        for (const face of faces) {
            faceHtml += '<img name="face-icon" alt="' + face + '" src="/face/' + face + '" style="width: 30px; height: 30px">';
        }
        faceHtml += '</div>';
        content.insertAdjacentHTML('beforebegin', faceHtml);
        /* 注册点击事件 */
        let faceIcons = document.getElementsByName("face-icon");
        let newFaceBox = document.getElementsByName('new-face-box')[0];
        let newface = document.getElementsByName("new-face")[0];
        let face = document.getElementsByName("face")[0];
        for (const faceIcon of faceIcons) {
            faceIcon.addEventListener('click',
                function () {
                    let faceName = faceIcon.alt;
                    if (newFaceBox.style.display == "none") {
                        newFaceBox.style.display = "block";
                    } else newFaceBox.style.display = "none";
                    face.value = newface.value = faceName;
                })
        }
    };
}

/**
 * 字体颜色
 */
replyButton = document.getElementsByName("g")[0];
if (replyButton) {
    replyButton.insertAdjacentHTML('afterend', '<input type="button" value="文字颜色" name="forecolor">');
    let foreColor = document.getElementsByName("forecolor")[0];
    foreColor.addEventListener('click',
        function () {
            let forecolorBox = document.getElementsByName('forecolor-box')[0];
            if (forecolorBox.style.display == "none") {
                forecolorBox.style.display = "inline-block";
            } else forecolorBox.style.display = "none";
        });
    createForeColorBox();
}
function createForeColorBox() {
    let forecolor = document.getElementsByName("forecolor")[0];
    if (forecolor) {
        let forecolorBoxHtml = '<span style="display:none" name="forecolor-box">';
        const colors = FORE_COLORS;
        for (const color in colors) {
            forecolorBoxHtml += '&nbsp;<span name="forecolor-span" style="color:' + colors[color] + '">' + color + '</span>';
        }
        forecolorBoxHtml += '</span>';
        forecolor.insertAdjacentHTML('afterend', forecolorBoxHtml);
        /* 注册颜色选择事件 */
        let forecolorSpans = document.getElementsByName("forecolor-span");
        let forecolorBox = document.getElementsByName('forecolor-box')[0];
        for (const forecolorSpan of forecolorSpans) {
            forecolorSpan.addEventListener('click',
                function () {
                    let chooseColor = colors[forecolorSpan.innerHTML];
                    if (forecolorBox.style.display == "inline-block") {
                        forecolorBox.style.display = "none";
                    } else forecolorBox.style.display = "inline-block";
                    forecolor.style.color = chooseColor;
                    forecolor.value = forecolorSpan.innerHTML;
                })
        }
    }
}

/**
 * 加载下一页
 */
let moreBtn = document.getElementsByClassName('more')[0];
if (moreBtn) {
    moreBtn.addEventListener('click', asyncPage);
    function asyncPage(e) {
        e.preventDefault();
        const moreLink = moreBtn.firstChild.href;
        console.log(moreLink);
        getData(moreLink).then(function (html) {
            /* 提取楼层回复 */
            const replyReg = new RegExp('<div class="line.">(.*?)<\/div>', "g");
            let nextReply = html.match(replyReg);
            for (const reply of nextReply) {
                moreBtn.insertAdjacentHTML('beforebegin', reply);
            }
            /* 提取下一页页码 */
            const linkReg = new RegExp('bt2"><a.href="(.*)">下一页', "g");
            let nextLink = html.match(linkReg)[1].replaceAll('\&amp;', '&');
            console.log(nextLink);
            /* 为新的下一页注册事件 */
            const moreNextBtn = document.getElementsByClassName('more')[0];
            moreNextBtn.firstChild.href = nextLink;
            moreNextBtn.addEventListener('click', asyncPage);
        })
    };
}

/**
 * 无跳转回复楼层
 */
let replyLines = document.getElementsByClassName("reline");
if (replyLines.length) {
    for (const replyLine of replyLines) {
        const replyLink = replyLine.children[0];
        replyLink.addEventListener('click', function (e) {
            /* 阻止默认跳转页面 */
            e.preventDefault();
            const replyNth = replyLink.href.match(new RegExp("reply=(\\d+)&"), "g")[1];
            /* 添加：回复N楼，通知对方 */
            let form = document.getElementsByName('f')[0];
            if (form.firstChild.tagName == 'B') {
                form.removeChild(form.firstChild);
                form.removeChild(form.firstChild);
                form.removeChild(form.firstChild);
            }
            form.insertAdjacentHTML('afterbegin', '<b name="reply-to" value="' + replyLink + '">回复' + replyNth + '楼 </b><select name="sendmsg2"><option value="1">通知对方</option><option value="0">不予通知</option></select><br>');
            /* 获取输入框焦点 */
            document.getElementsByName('content')[0].focus();
            /* 修改提交按钮文字 */
            let replyButton = document.getElementsByName("g")[0];
            replyButton.value = '发表回复';
            /* 监听点击事件 */
            replyButton.addEventListener('click',
                function (event) {
                    event.preventDefault();
                    let content = document.getElementsByName("content")[0].value;
                    if (content.length) {
                        content = ubbProcess(content);
                        /* 获取form表单参数 */
                        var sendmsg2 = document.getElementsByName("sendmsg2")[0].value;
                        let replyLink = document.getElementsByName('reply-to')[0].getAttributeNode('value').value;
                        var id = replyLink.match(new RegExp("&id=(\\d+)&"), "g")[1];
                        var siteid = replyLink.match(new RegExp("siteid=(\\d+)&"), "g")[1];
                        var lpage = replyLink.match(new RegExp("lpage=(\\d+)&"), "g")[1];
                        var classid = replyLink.match(new RegExp("classid=(\\d+)&"), "g")[1];
                        var reply = replyLink.match(new RegExp("reply=(\\d+)&"), "g")[1];
                        var touserid = replyLink.match(new RegExp("touserid=(\\d+)$"), "g")[1];;
                        var face = document.getElementsByName("face")[0].value;
                        var sendmsg = document.getElementsByName("sendmsg")[0].value;
                        var action = document.getElementsByName("action")[0].value;
                        var sid = document.getElementsByName("sid")[0].value;
                        var g = '发表回复';
                        console.log(touserid);
                        /* 发表回复 */
                        postData('/bbs/book_re.aspx', {
                            sendmsg2: sendmsg2,
                            face: face,
                            sendmsg: sendmsg,
                            content: content,
                            action: action,
                            id: id,
                            siteid: siteid,
                            lpage: lpage,
                            classid: classid,
                            reply: reply,
                            touserid: touserid,
                            sid: sid,
                            g: g
                        }).then(function (data) {
                            /* console.log(data)  回复成功！</b> 获得妖晶:30，获得经验:10<br/> 跳转中... */
                            location.reload();
                            /* 直接刷新页面，没有优化处理 */
                        })
                    }
                })
        })
    }
}

//添加UBB
replyButton = document.getElementsByName("g")[0];
if (replyButton) {
    replyButton.insertAdjacentHTML('afterend', '<input type="button" value="添加UBB" name="addUbb">');
    let addUbb = document.getElementsByName("addUbb")[0];
    addUbb.addEventListener('click', function () {
        //alert("hello");
        let addUbbBox = document.getElementsByName('addUbb-box')[0];
        if (addUbbBox.style.display == "none") {
            addUbbBox.style.display = "inline-block";
        } else addUbbBox.style.display = "none";
    });
    createUbbBox();
}

function createUbbBox(){
    let addUbb = document.getElementsByName("addUbb")[0];
    if (addUbb) {
        let addUbbBoxHtml = '<span style="display:none" name="addUbb-box">';
        const ubbs = ADD_UBB;
        for (const ubb in ubbs) {
            addUbbBoxHtml += '&nbsp;<span name="addUbb-span">' + ubb + '</span>';
           // alert(ubb);
        }
        addUbbBoxHtml += '</span>';
        addUbb.insertAdjacentHTML('afterend', addUbbBoxHtml);
        //添加Ubb到文本框
        let addUbbSpans = document.getElementsByName("addUbb-span");
        let addUbbBox = document.getElementsByName('addUbb-box')[0];
        for (const addUbbSpan of addUbbSpans) {
            addUbbSpan.addEventListener('click', function () {
                let chooseUbb = ubbs[addUbbSpan.innerHTML];
                if (addUbbBox.style.display == "inline-block") {
                    addUbbBox.style.display = "none";
                } else addUbbBox.style.display = "inline-block";
                //forecolor.style.color = chooseColor;
                //forecolor.value = forecolorSpan.innerHTML;
                let content = document.getElementsByName("content")[0];
                content.value +=chooseUbb;
            })
        }
    }
}

//替换链接
/*TEXT link to Clickable Hyperlink*/
let clearLink, excludedTags, filter, linkMixInit, linkPack, linkify, observePage, observer, setLink, url_regexp, xpath;
url_regexp = /((https?:\/\/|www\.)[\x21-\x7e]+[\w\/]|(\w[\w._-]+\.(com|cn|org|net|info|tv|cc))(\/[\x21-\x7e]*[\w\/])?|ed2k:\/\/[\x21-\x7e]+\|\/|thunder:\/\/[\x21-\x7e]+=)/gi;
clearLink = function(a) {
	let b;
	a = null != (b = a.originalTarget) ? b : a.target;
	if (null != a && "a" === a.localName && -1 !== a.className.indexOf("texttolink") && (b = a.getAttribute("href"), 0 !== b.indexOf("http") && 0 !== b.indexOf("ed2k://") && 0 !== b.indexOf("thunder://"))) return a.setAttribute("href", "http://" + b)
};
document.addEventListener("mouseover", clearLink);
setLink = function(a) {
	if (null != a && -1 === a.parentNode.className.indexOf("texttolink") && "#cdata-section" !== a.nodeName) {
		let b = a.textContent.replace(url_regexp, '<a href="$1" target="_blank" class="texttolink">$1</a>');
		if (a.textContent.length !== b.length) {
			let c = document.createElement("span");
			c.innerHTML = b;
			return a.parentNode.replaceChild(c, a)
		}
	}
};
excludedTags = "a svg canvas applet input button area pre embed frame frameset head iframe img option map meta noscript object script style textarea code".split(" ");
xpath = "//text()[not(ancestor::" + excludedTags.join(") and not(ancestor::") + ")]";
filter = new RegExp("^(" + excludedTags.join("|") + ")$", "i");
linkPack = function(a, b) {
	let c, d, e;
	if (b + 1E4 < a.snapshotLength) {
		e= c = b;
		for (d = b + 1E4; b <= d ? c <= d : c >= d; e = b <= d ? ++c : --c) setLink(a.snapshotItem(e));
		setTimeout(function() {
			return linkPack(a, b + 1E4)
		}, 15)
	} else{
        for (e = c = b, d = a.snapshotLength; b <= d ? c <= d : c >= d; e = b <= d ? ++c : --c) setLink(a.snapshotItem(e));
    }
};
linkify = function(a) {
	a = document.evaluate(xpath, a, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	return linkPack(a, 0)
};
observePage = function(a) {
	for (a = document.createTreeWalker(a, NodeFilter.SHOW_TEXT, {
		acceptNode: function(a) {
			if (!filter.test(a.parentNode.localName)) return NodeFilter.FILTER_ACCEPT
		}
	}, !1); a.nextNode();) setLink(a.currentNode)
};
observer = new window.MutationObserver(function(a) {
	let b, c;
	let d = 0;
	for (b = a.length; d < b; d++) {
		let e = a[d];
		if ("childList" === e.type) {
			let g = e.addedNodes;
			let f = 0;
			for (c = g.length; f < c; f++) e = g[f], observePage(e)
		}
	}
});
linkMixInit = function() {
	if (window === window.top && "" !== window.document.title) return linkify(document.body), observer.observe(document.body, {
		childList: !0,
		subtree: !0
	})
};
let clearlinkF = function(a) {
		let url = a.getAttribute("href");
		if (0 !== url.indexOf("http") && 0 !== url.indexOf("ed2k://") && 0 !== url.indexOf("thunder://")) return a.setAttribute("href", "http://" + url)
	},
	clearlinkE = function() {
		for (let a = document.getElementsByClassName("texttolink"), b = 0; b < a.length; b++) clearlinkF(a[b])
	};
setTimeout(clearlinkE, 1500);
setTimeout(linkMixInit, 100);