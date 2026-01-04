// ==UserScript==
// @name                   界面优化
// @namespace              http://tampermonkey.net/
// @version                1.0.2.11
// @description            各种奇奇怪怪的界面优化
// @author                 YiJie
// @license                GPL-3.0-only
// @create                 2020-04-05
// @match                  *://www.baidu.com/*
// @match                  *://www.google.com/*
// @match                  *://ss.netnr.com/bed
// @require                https://cdn.jsdelivr.net/npm/notiflix@2.1.2/dist/AIO/notiflix-aio-2.1.2.min.js
// @require                https://greasyfork.org/scripts/399868-jquery-loadednode/code/jQuery-loadedNode.js?version=790609
// @require                https://greasyfork.org/scripts/399879-%E5%BC%B9%E7%AA%97/code/%E5%BC%B9%E7%AA%97.js?version=792823
// @require                http://code.jquery.com/jquery-3.4.1.min.js
// @grant                  GM_info
// @grant                  GM_setValue
// @grant                  GM_getValue
// @grant                  GM_deleteValue
// @grant                  GM_registerMenuCommand
// @grant                  GM_unregisterMenuCommand
// @grant                  unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/399630/%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/399630/%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var scriptInfo = {
        "name":GM_info.script.name,
        "description":GM_info.script.description,
        "author":GM_info.script.author,
        "create":"2020-04-05",
        "version":GM_info.script.version,
        "greasyforkURL":GM_info.script.downloadURL,
	};
	const $341 = $.noConflict();
	if(typeof($)!=="undefined") $ = $341;
	else $ = unsafeWindow.$;

    GM.setValue = GM_setValue;
    GM.getValue = GM_getValue;
    GM.deleteValue = GM_deleteValue;
    GM.registerMenuCommand = GM_registerMenuCommand;
	GM.unregisterMenuCommand = GM_unregisterMenuCommand;

	// 初始化devControler
	(function(){
		const devControler = {};
		devControler.open = function(){
			GM.setValue("isDev",true);
			console.log("%c%s", "padding: 10px; border-radius: 10px; color: #fff; background-color: rgb(50,150,250);", "关闭测试功能输入=>devControler.close()");
		};
		devControler.close = function(){
			GM.setValue("isDev",false);
		};
		devControler.is = function(){
			return !(typeof(GM.getValue("isDev")) === "undefined" || GM.getValue("isDev") === false);
		};
		unsafeWindow.devControler = devControler;
	})();

	const routerControler = {
		"type":"None",
		"routerList":{
			"Baidu":{
				"isDev":false,
				"regex":/^https?:\/\/www\.baidu\.com\/(?!s)\??/,
			},
			"Google":{
				"isDev":true,
				"regex":/^https?:\/\/www\.google\.com\/(?!s)\??/,
			},
			"NetnrImageBed":{
				"isDev":true,
				"regex":/https?:\/\/ss.netnr.com\/bed/,
			},
		},
	};
	let isLoad = false;
	for (let key in routerControler.routerList) {
		let item = routerControler.routerList[key];
		if(item.regex.test(location.href)) {
			Notiflix.Loading.Dots('加载中...');
			isLoad = true;
			routerControler.type = key;
		};
	}

    if(devControler.is()){
		console.log("%c%s", "padding: 10px; border-radius: 10px; color: #fff; background-color: rgb(50,150,250);", "界面优化--"+scriptInfo.version);
		console.log("%c%s", "padding: 10px; border-radius: 10px; color: #fff; background-color: rgb(50,150,250);", "测试功能已开启");
	}else{
		setTimeout(function(){
			console.clear();
			console.log("%c%s", "padding: 10px; border-radius: 10px; color: #fff; background-color: rgb(50,150,250);", "界面优化--"+scriptInfo.version);
			console.log("%c%s", "padding: 10px; border-radius: 10px; color: #fff; background-color: rgb(50,150,250);", "若想开启测试功能请在控制台输入=>devControler.open()");
			console.log("%c%s", "padding: 10px; border-radius: 10px; color: #fff; background-color: rgb(250,50,50);", "测试功能可能有很大的缺陷,可能导致脚本出现数据丢失重装,谨慎开启");
		},1000);
	}

    var imgSrcList = [
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/109102/10/11602/2078533/5e8a9efcE3dbd7188/f4c30be2b0d2fd61.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/102530/22/17587/2796415/5e8a9efcE07c76b38/d2e94e8cd4dba640.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/91101/7/17655/2626528/5e8a9efbE14b37c06/ec878e5182323a50.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/91573/35/17576/2626528/5e8a9ef8E090470a0/9418db7571d6fddc.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/103814/25/17682/1865827/5e8a9ef7E65128b8e/34ac83b5e3772619.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/92305/24/17542/1438179/5e8a9ee5Eca43e7be/0217fbe2fab829a0.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/113577/10/320/713889/5e8a9ee0Ef93dd670/cf6076544d62c0eb.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/107786/37/11536/2796415/5e8a9ed7E497a313e/f3ce2bcbc49151a8.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/86018/6/17661/153897/5e8a9ecbE7f31abaa/f6cbb785b6b306bf.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/117711/29/324/104293/5e8a9ecbEe5c94d72/1960887762a2aa02.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/103095/22/17494/66801/5e8a9ecbE6cf0b002/2b6388e6d2b852f4.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/118269/1/317/63110/5e8a9ecbEbab3dbbf/9b097034074b0060.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/103080/35/17809/99071/5e8a9ecbE95f6c668/a4a062afdb3111bb.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/104403/1/17693/147417/5e8a9eb2E8a061189/47beea29667b5bd2.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/95499/6/17443/34291/5e8a9eb2E79247a4a/0813bd831a7e85df.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/118015/10/300/45845/5e8a9eb2E6bc07770/57e9d05ef376dc53.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/102437/22/17591/15670/5e8a9eb2E9a658687/84be209b78df203a.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/115099/20/325/629657/5e8a9eacEff90dd1f/8f74e726a706ce0a.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/110280/11/11417/702510/5e8a9eacE9a89eb37/9ec88bb10b15dbe5.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/103205/7/17627/812191/5e8a9eaaE0702bc58/4f05e9316945cf9b.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/115295/4/300/147417/5e8a9ea9E90184eb4/c821f2221ce5b497.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/118785/33/334/15670/5e8a9ea9E1d565703/0b0256027bc932a1.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/113674/11/318/281618/5e8a9ea9Ebcdef47e/43f7be9e2c23bffd.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/104223/34/17685/249588/5e8a9ea8Ecde05776/c1121ed237189ad3.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/105674/39/17727/53831/5e8a9ea8E4e60c1de/1b8a6826b0805248.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/91664/25/17755/68840/5e8a9ea7Ef7dae624/0d2fb6ca6c1a4732.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/102693/22/17678/1779953/5e8a9e97E217b9546/16b7cf0ea0c5b5f3.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/108490/35/11410/333281/5e8a9e95Eddd3f5c4/fad2606b9da8178e.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/88457/4/17755/1287282/5e8a9e95Ebc9d0d4c/c74e4df955dc46b8.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/118299/7/326/447471/5e8a9e91E575de5b7/70ee62b95f1afa6e.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/111757/14/341/544550/5e8a9e91E56780dce/c9adc1b70807a6df.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/93430/19/17563/1130907/5e8a9e8dE0b9d134f/72e32660c5935dda.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/89026/15/17758/175077/5e8a9e8cEec0fcda9/0c52ce1c30be678e.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/118880/14/300/568586/5e8a9e80E3dad5259/6b163e35a8d2b303.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/86604/31/17775/297714/5e8a9e81E371684e7/136956f7c934e322.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/102023/3/17594/202898/5e8a9e80Ee91c806b/4be20cef9afbc3d0.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/109704/19/11336/775162/5e8a9e80Ea8f77dbc/ec40433f038c7956.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/110646/32/11370/240222/5e8a9e7fEa9acd589/419fca8df166e8e6.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/107848/5/11437/1544441/5e8a9e76Eeca8572e/a1a37e014f9cdd9d.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/110558/40/11415/1589360/5e8a9e71E86965664/da5ef120a92b77b0.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/115350/5/314/923177/5e8a9e72E9e132027/31b0c5b192344687.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/99655/2/17811/254165/5e8a9e6dE1c878aca/3a41a47f4bef952f.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/111025/31/304/172268/5e8a9e6dE7a71acd9/0b9f54c136f52dc3.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/95933/15/17601/38389/5e8a9e6cEe692a70d/41706e826461a5b5.png",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/114006/23/304/723677/5e8a9e41E09398de3/b22a91f83477496a.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/109114/35/11663/594932/5e8a9e40E462d7898/de65ecc5db87ff70.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/108198/34/11468/495367/5e8a9e40E2227db35/4c0f2aeda4875fef.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/114238/16/286/169306/5e8a9e3fE602e00be/6904942d600283f3.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/94542/36/17592/218647/5e8a9e3fEac9e2a7a/dec9fc15610c8d98.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/99527/18/17731/653576/5e8a9e3dEeab19a42/a8dcb493113649c1.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/115486/14/308/818657/5e8a9e3dEe6034e2f/a339485b0cb3f939.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/113305/2/302/1081556/5e8a9e3bEa3e26431/b1fb97c5a8ba34bf.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/96375/12/17699/1058704/5e8a9e3bE5ad6068d/aa0302ef55b427b4.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/98301/3/17662/815892/5e8a9e3aEe6479dfa/2668d7cd8646be16.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/107596/33/11450/347320/5e8a9e39E06e82889/7885bde76aa2334a.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/96869/6/17684/280168/5e8a9e36Eecff3347/3eb8b01cb1f61d3f.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/84824/12/17662/839301/5e8a9e32E69ed08a8/d905f11856d1941b.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/115730/34/289/1391978/5e8a9e31E3acef28d/f749d388681c4de8.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/106186/29/17674/661489/5e8a9e2fEb9961c83/fb8e14b6c81fe062.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/113194/13/333/517912/5e8a9e2dEc2f38da0/5b60b344976386e2.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/100946/7/17811/386801/5e8a9e2dEf8b89329/beb3a2ce2eacdc26.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/112174/24/319/398750/5e8a9e2cE41fe3020/c060b944deaa652d.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/110644/26/11381/763549/5e8a9e2bEf667531d/715133e6f511b0bd.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/116153/4/311/876780/5e8a9e03E3e855c4d/5805404fc92c06da.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/88909/2/17709/1316174/5e8a9e02Eebb4cb1e/effc944ae31cb874.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/112937/16/303/739530/5e8a9e00E653b6d13/24150a64618c43d4.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/102551/23/17871/419252/5e8a9dffE4555e57d/7bf7689f2bfde226.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/99376/32/17529/179156/5e8a9dffE170fefb8/2e864def2c747252.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/95116/35/17793/1022960/5e8a9dfbEaeca7c38/4908a39856afebc1.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/90503/27/17542/1242939/5e8a9dfaE83b8fdef/467603d2f878be9a.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/116600/7/308/171667/5e8a9df9Ee406ed6a/6bcd7f413cc163eb.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/95731/5/17694/553691/5e8a9df7E4335ea66/ddbf5e05fee7ab73.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/90230/18/17759/144999/5e8a9df7Ea5bdf75a/39b6459218adef7f.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/117320/28/292/162979/5e8a9df6E247cc04b/8afd11737ca4e10d.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/113220/7/312/137925/5e8a9df5E3679d6b2/9795beadc4e8b311.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/115870/16/276/674524/5e8a9deaE8105dd75/539e58808ed03402.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/91741/39/17634/153019/5e8a9deaEdf46abaa/fdbc7bb06003fb71.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/115440/22/318/1146940/5e8a9deaE46fb8bdb/8e9b73ea16b7a8af.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/107829/29/11361/145834/5e8a9de8E01a43804/f29e16f3e075cab5.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/106995/5/17679/144591/5e8a9de8Ed9c45741/4f5a3ba928fbcd16.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/97074/29/17770/148587/5e8a9de8E3fc25809/4746633125dae44a.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/88341/9/17550/146991/5e8a9de8Ec0225b66/1c3fa0cb5f80bd37.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/104749/35/17749/1182198/5e8a9ddaEd1dd7d90/7ab73b72cc1be049.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/86029/16/17861/1076106/5e8a9dd8E9c74b7a2/d323d86be464f851.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/111285/40/308/150995/5e8a9dd8E933d36ad/87eca568b36266bc.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/119009/25/326/228697/5e8a9dd7E918a05a0/2a3bea3086570618.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/97641/31/17547/173117/5e8a9dd7E6be1144c/0afa1a77911de727.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/90494/3/17700/70674/5e8a9dd7E374695ac/60427eb5e2ed0ad6.jpg",
        "http://free-cn-01.cdn.bilnn.com/ddimg/jfs/t1/115002/26/317/46614/5e8a9dd6Eed20bcfd/bbe9da2e9833cba2.jpg",
    ];
	function createEleByStr(htmlStr) {
		let tempNode = document.createElement('div');
		htmlStr = htmlStr.replace(/\t/g, "").replace(/\r/g, "").replace(/\n/g, "");
		tempNode.innerHTML = htmlStr;
		return tempNode.firstChild;
	}
	function css(nodes, propertyName, propertyValue) {
		for (let i = 0; i < nodes.length; i++) {
			let node = nodes[i];
			if (typeof(propertyValue) === "undefined") {
				if(typeof(propertyName) === "String")
					return node.style.getPropertyValue(propertyName);
				else{
					const dictX = propertyName;
					for (let index0 in dictX) {
						node.style.setProperty(index0, dictX[index0]);
					}
				}
			} else {
				node.style.setProperty(propertyName, propertyValue);
			}
		}
	}
    function cssToObj(css) {
        var regex = /([\w-]*)\s*:\s*([^;]*)/g;
        var match, properties={};
        while(match=regex.exec(css)) properties[match[1]] = match[2].trim();
        return properties;
    }
    function shareToQQ() {
        var p = {
            url: scriptInfo.greasyforkURL,
            showcount: '1',
            title: '我在油猴看到了一个超棒的脚本',
            desc: '这个脚本能帮助你美化PC端的百度界面,你也可以来试试 点击下载'+scriptInfo.greasyforkURL,
            style: '202',
            width: 105,
            height: 31
        };
        var s = [];
        for (var i in p) {
            s.push(i + '=' + encodeURIComponent(p[i] || ''));
        }
        $(['<a class="qcShareQQDiv" href="http://connect.qq.com/widget/shareqq/index.html?', s.join('&'), '" target="_blank">分享</a>'].join(''))[0].click();
    }
    function copyText(text) {
        let input = document.createElement('input');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', text);
        document.body.appendChild(input);
        input.setSelectionRange(0, 9999);
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
        }
        document.body.removeChild(input);
        Notiflix.Notify.Success('复制成功');
    }
	function uuid() {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		return uuid;
	}

    Notiflix.Notify.Init({ closeButton:true,position:"left-top", });
    document.head.appendChild(createEleByStr('<link href="//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">'));

    function setBackgroundImg($jqBack,sel) {
		//  点击了随机按钮
		if(sel===-1){
			GM.setValue("starIndex",-1);
		}
		let starIndex = GM.getValue("starIndex");
		function loadImg(src){
			let img=new Image();
			img.src=src;
			img.onload=function(){
				$jqBack.css({
					"background-position": "center",
					"background-color": "black",
					"background-size": "100%",
					"background-repeat": "repeat-y",
					"background-image":"url('"+src+"')",
					"transition":"1s",
				});
				setTimeout(function(){
					$jqBack.css({
						"background-color": "white",
					});
				},1000);
			};
		}
		if(typeof(starIndex)==="undefined"||starIndex===-1){
			if(sel===-1) sel = Math.round(Math.random()*imgSrcList.length);
			loadImg(imgSrcList[sel]);
			GM.setValue("backImgSelect",sel);
		}else{
			const backImgdataList = GM.getValue("backImgdataList");
			if(typeof(backImgdataList)==="undefined"){
				GM.setValue("backImgdataList",[]);
				backImgdataList = [];
			}
			for (let index = 0; index < backImgdataList.length; index++) {
				if(backImgdataList[index].uuid === starIndex){
					loadImg(backImgdataList[index].url);
					break;
				}
			}
		}
    }
	function initFloatWindowView(backImgNode){
		const $ = $341;
		//  初始化悬浮窗
		(function(){
			var floatingWindow = (function(){
				var floatingWindow = $("\
					<div id='floatingWindow' class='floatingWindow'>\
						<i class='fa fa-refresh fa-3x'></i>\
						<div class='selectNode-nav'></div>\
					</div>\
				").css(cssToObj("\
					position: fixed;\
					bottom: 20px;left: -25px;\
					width: 50px;height: 50px;\
					border-radius: 50%;\
					background-image: linear-gradient( 135deg, #3C8CE7 30%, #00EAFF 100%);\
					box-shadow: 0 0 30px white;\
					transition: .5s;\
				")).hover(function(){
					this.isMouseout = false;
					$(this).css(cssToObj("\
						bottom: 20px;left: 20px;\
						transform: rotateZ(180deg);\
					"));
				},function(){
					var content = this;
					content.isMouseout = true;
					setTimeout(function(){
						if(content.isMouseout) $(content).css(cssToObj("\
							bottom: 20px;left: -25px;\
							transform: rotateZ(0deg);\
						"));
					},1000);
				});
				floatingWindow.find('.fa-refresh').css(cssToObj("\
					width: 100%;\
					color: rgb(250,250,250);\
					font-size: 25px;\
					text-align: center;\
					line-height: 50px;\
				")).click(function(){
					setBackgroundImg($('#head'),-1);
				});
				floatingWindow.find('.selectNode-nav').css(cssToObj("\
					position: absolute;\
					padding-left: 6px;\
					padding-right: 6px;\
					padding-top: 6px;\
					top: 70px;left: calc(50% - 18px);\
					width: 24px;\
				")).append($("\
					<i title='有关本插件' class='fa fa-info fa-2x'></i>\
					<i title='插件设置' class='fa fa-cog fa-2x'></i>\
					<i title='添加新背景图' class='fa fa-plus fa-2x'></i>\
					<i title='查看当前背景大图' class='fa fa-image fa-2x'></i>\
					<i title='分享给好友' class='fa fa-share-alt fa-2x'></i>\
				"));
				floatingWindow.find('.selectNode-nav').find('i').css(cssToObj("\
					margin-bottom: 16px;\
					width: 24px;\
					text-align: center;\
					color: gray;\
					transform: rotateZ(180deg);\
					transition: .5s;\
				")).hover(function(){
					$(this).css(cssToObj("\
						color: white;\
					"));
				},function(){
					$(this).css("color","gray");
				});
				document.body.appendChild(floatingWindow[0]);
				return floatingWindow;
			})();
			//  初始化悬浮窗点击事件
			(function(){
				Notiflix.Report.Init({ width:"420px",backgroundColor:"#ffffff",svgSize:"50px",titleFontSize:"20px",buttonFontSize:"16px", info: {svgColor:"#0fa1e5",buttonBackground:"#2aa5e8",}, });
				floatingWindow.find(".fa-info").click(function(){
					Notiflix.Report.Info( '关于本插件', '追求极简的快乐', '确认' );
					setTimeout(function(){
						$('.notiflix-report-message').html('\
							<h3>追求极简的快乐</h3>\
							<h4>插件名:'+scriptInfo.name+'&nbsp;&nbsp;'+scriptInfo.version+'</h4>\
							<h4>作者:'+scriptInfo.author+'</h4>\
							<h4>创建时间:'+scriptInfo.create+'</h4>\
							<h4>greasyfork<a href="'+scriptInfo.greasyforkURL+'">下载地址</a></h4>\
						');
					},100);
				});
				floatingWindow.find(".fa-cog").click(function(){
					Notiflix.Report.Warning( '插件设置-开发ing', '插件设置,努力开发ing', '确认' );
				});
				floatingWindow.find(".fa-plus").click(function(){
					function generateImgShowItem(backImgdata,isStar) {
						const userimgSrc = backImgdata.url;
						const uuid = backImgdata.uuid;
						const imgShowItem =
							$('<div class="imgShowItem">\
								<i class="fa fa-trash" title="删除图片"></i>\
								<i class="fa fa-link" title="复制链接"></i>\
								<i class="fa fa-star'+(() => {
									if(!isStar) return '-o'
									else return ''
								})()+' imgShowItem-set" title="'+(() => {
									if(!isStar) return '设置为背景'
									else return ''
								})()+'"></i>\
							</div>').css(cssToObj("\
								position: relative;float: left;\
								width: 0px;height: 180px;\
								margin: 10px;\
								background-position: center;\
								background-repeat: no-repeat;\
								background-size: 0%;\
								background-color: black;\
								background-image: url('"+userimgSrc+"');\
								box-shadow: 0 0 0px gray;\
								border-radius: 16px;\
								overflow: hidden;\
								transition: .5s;\
							")).hover(function(){
								$(this).css(cssToObj("box-shadow: 0 0 20px gray;"));
							},function(){
								$(this).css(cssToObj("box-shadow: 0 0 0px gray;"));
							})
								.find('.fa-trash')
								.css(cssToObj("\
									position: absolute;\
									bottom: 10px;right: 10px;\
									color: rgb(250,250,250);\
									transition: .5s;\
								"))
								.hover(function(){
									$(this).css("color","rgb(250,100,100)");
								},function(){
									$(this).css("color","rgb(250,250,250)");
								})
								.unbind('click').bind('click',function(){
									const content = this;
									Notiflix.Confirm.Init({ titleColor:"#dc1616",titleFontSize:"20px",rtl:true,borderRadius:"8px", });
									Notiflix.Confirm.Show( '确认', '你确认要删除该壁纸吗?', '确认', '我点错了', function(){
										setTimeout(() => {
											$(content).parent().css("width","0");
											setTimeout(() => {
												$(content).parent().remove();
												for (let index = 0; index < backImgdataList.length; index++) {
													if(backImgdataList[index].uuid === uuid){
														backImgdataList.splice(index, 1);
														break;
													}
												}
												GM.setValue("backImgdataList",backImgdataList);
											}, 800);
										}, 100);
									}, function(){
									} );
								})
							.parent()
								.find('.fa-link')
								.css(cssToObj("\
									position: absolute;\
									bottom: 10px;right: 30px;\
									color: rgb(250,250,250);\
									transition: .5s;\
								"))
								.hover(function(){
									$(this).css("color","rgb(100,100,250)");
								},function(){
									$(this).css("color","rgb(250,250,250)");
								})
								.unbind('click').bind('click',function(){
									copyText(userimgSrc);
								})
							.parent()
								.find('.imgShowItem-set')
								.css(cssToObj("\
									position: absolute;\
									bottom: 10px;right: 50px;\
									color: "+(() => {
										if(!isStar) return 'rgb(250,250,250)'
										else return 'rgb(250,250,100)'
									})()+";\
									transition: .5s;\
								"))
								.hover(function(){
									$(this)
										.removeClass("fa-star-o")
										.addClass("fa-star")
										.css("color","rgb(250,250,100)");
								},function(){
									if(!$(this).parent()[0].isStar) $(this)
										.removeClass("fa-star")
										.addClass("fa-star-o")
										.css("color","rgb(250,250,250)");
									else $(this)
										.removeClass("fa-star-o")
										.addClass("fa-star")
										.css("color","rgb(250,250,100)");
								})
								.unbind('click').bind('click',function(){
									if(this.isStar) return;
									const $parent = $(this).parent();
									const $grandparent = $parent.parent();
									$grandparent[0].setStar.call($grandparent[0],$parent[0]);
									GM.setValue("starIndex",uuid);
									setBackgroundImg($('#head'));
								})
							.parent();
						imgShowItem[0].uuid = uuid;
						imgShowItem[0].isStar = isStar;
						imgShowItem[0].starThis = function (isStar) {
							this.isStar = isStar;
							if(!isStar){
								$(this).find('.imgShowItem-set')
								.removeClass("fa-star")
								.addClass("fa-star-o")
								.css("color","rgb(250,250,250)");
							}
							else{
								$(this).find('.imgShowItem-set')
								.removeClass("fa-star-o")
								.addClass("fa-star")
								.css("color","rgb(250,250,100)");
							}
						};
						setTimeout(() => {
							imgShowItem
							.css("width","280px")
							.css("background-size","100%");
						}, 100);
						return imgShowItem;
					}

					const setBackgroundImghtmlFrame = (function () {
						const htmlFrame = $('\
							<div>\
								<h1 style="font-size: 2em;text-align: center;margin-top: 10px;margin-bottom: 10px;">自定义图片背景</h1>\
								<h3 style="font-size: 1.17em;text-align: center;margin-top: 10px;margin-bottom: 20px;">你可以通过下面的图床工具生成你的图片地址</h3>\
								<h3 style="font-size: 1.17em;text-align: center;margin-top: 0;margin-bottom: 20px;height:50px;line-height:50px;">\
									<a class="imgBedLink" href="http://ss.netnr.com/bed" target="_blank">net达人</a>\
									<a class="imgBedLink" href="https://oss.bilnn.com/" target="_blank">图速云</a>\
								</h3>\
								<div class="imgSrcInputWrapper"><input type="text" name="imgSrc01" placeholder="请输入图片的url地址"><i class="fa fa-check"></i><i class="fa fa-close"></i></div>\
								<div class="imgSrcShow">\
									<div class="imgSrcShow-wrapper">\
									</div>\
								</div>\
							</h1>\
						').css({
							"position":"absolute",
							"width":"100%",
							"height":"100%",
						});
						htmlFrame.find('.imgBedLink').css(cssToObj("\
							padding: 5px;\
							margin-left: 10px;margin-right: 10px;\
							border: 2px solid gray;\
							border-radius: 14px;\
							box-shadow: 0 0 0px gray;\
							background-color: rgb(240,240,240);\
							color: skyblue;\
							text-decoration: none;\
							font-size: 18px;\
							transition: .5s;\
						")).hover(function () {
							$(this).css(cssToObj("box-shadow: 0 0 5px gray;"));
						},function () {
							$(this).css(cssToObj("box-shadow: 0 0 0px gray;"));
						});
						htmlFrame.find('.imgSrcInputWrapper').css(cssToObj("\
							position: relative;float: left;\
							left: 10%;\
							padding-left: 10px;\
							padding-right: 10px;\
							width: calc(80% - 20px);height: 40px;\
							font-size: 20px;line-height: 40px;\
							border-radius: 10px;\
							background-color: white;\
							box-shadow: 0 0 8px gray;\
							overflow: hidden;\
							transition: .5s;\
						")).hover(function(){
							$(this).css(cssToObj("box-shadow: 0 0 18px gray;"));
						},function(){
							$(this).css(cssToObj("box-shadow: 0 0 8px gray;"));
						}).find('i').css(cssToObj("\
							position: relative;float: left;\
							width: 32px;height: 40px;\
							text-align: center;\
							line-height: 40px;\
						")).parent().find('input').css(cssToObj("position: relative;float: left;"));
						htmlFrame.find('.imgSrcInputWrapper .fa-check').css("color","rgb(100,250,100)")
						.unbind('click').click(function(){
							if(htmlFrame.find('input').val()===""){
								Notiflix.Report.Failure( '错误', '链接不能为空', '确认');
								return;
							}
							let data = {
									"uuid":uuid(),
									"url":htmlFrame.find('input').val(),
							};
							htmlFrame.find('.imgSrcShow .imgSrcShow-wrapper')
							.prepend(generateImgShowItem(data,false));
							backImgdataList.unshift(data);
							GM.setValue("backImgdataList",backImgdataList);
							htmlFrame.find('input').val("");
						});
						htmlFrame.find('.imgSrcInputWrapper .fa-close').css("color","rgb(250,100,100)")
						.unbind('click').click(function(){
							htmlFrame.find('input').val("");
						});

						htmlFrame.find('.imgSrcInputWrapper input').css(cssToObj("\
							width: calc(100% - 64px);height: 100%;\
							border: none;\
							outline: none;\
							font-size: 20px;line-height: 40px;\
						"));
						htmlFrame.find('.imgSrcShow').css(cssToObj("\
							position: relative;float: left;\
							width: 100%;height: calc(100% - 230px);\
							overflow-x: hidden;\
						"));
						htmlFrame.find('.imgSrcShow .imgSrcShow-wrapper').css(cssToObj("\
							position: absolute;\
							left: calc(50% - 450px);\
							width: 900px;\
						"));
						return htmlFrame;
					})();
					let backImgdataList = GM.getValue("backImgdataList");
					if(typeof(backImgdataList)==="undefined"){
						GM.setValue("backImgdataList",[]);
						backImgdataList = [];
					}
					let starIndex = GM.getValue("starIndex");
					if(typeof(starIndex)==="undefined"){
						GM.setValue("starIndex",-1);
						starIndex = -1;
					}
					setBackgroundImghtmlFrame.find('.imgSrcShow .imgSrcShow-wrapper')
						[0].setStar = function(item){
							for (let index = 0; index < this.childNodes.length; index++) {
								const ele = this.childNodes[index];
								if(ele === item) ele.starThis(true);
								else ele.starThis(false);
							}
						};

					for (let index = 0; index < backImgdataList.length; index++) {
						setBackgroundImghtmlFrame.find('.imgSrcShow .imgSrcShow-wrapper')
						.prepend(
							generateImgShowItem(backImgdataList[index],backImgdataList[index].uuid === starIndex)
						);
					}
					//  清楚多余的空格
					(function removeWhiteSpace(elem){
						let el = elem || document,
							cur = el.firstChild,
							temp,
							reg = /\S/;
						while(null != cur){
							temp = cur.nextSibling;
							if( 3 === cur.nodeType && !reg.test(cur.nodeValue) ){
								el.removeChild(cur);
							}else if( 1 === cur.nodeType ){
								removeWhiteSpace(cur);
							}
							cur = temp;
						}
					})(setBackgroundImghtmlFrame[0]);

					PopupWindow.Show.HtmlFrame(setBackgroundImghtmlFrame[0],{
						width:1000,
						height:600,
						maskColor:"rgba(0,0,0,.5)",
					},()=>{
						setTimeout(function(){
							window.location = window.location;
						},1000)
					});
				});
				floatingWindow.find(".fa-image").click(function(){
					let regex0 = /(?<=\(\")\S+(?=\"\))/g;
					$('<a href="'+$('#head').css("background-image").match(regex0)+'" download="CurrentBackgroundImg.png"></a>')[0].click();
				});
				floatingWindow.find(".fa-share-alt").click(function(){
					Notiflix.Report.Info( '分享', '追求极简的快乐', '确认' );
					setTimeout(function(){
						$('.notiflix-report-message').html('\
							<div style="">\
								<img src="https://greasyfork.org/assets/blacklogo16-bc64b9f7afdc9be4cbfa58bdd5fc2e5c098ad4bca3ad513a27b15602083fd5bc.png">greasyfork</img><br><br>\
								<div style="height:16px;line-height: 16px;">分享发布地址到 &nbsp;&nbsp;&nbsp;<i title="仅复制链接" class="fa fa-copy fa-1x"></i>&nbsp;<i title="复制并分享到qq" class="fa fa-qq fa-1x"></i></div><hr>\
							</div>\
						');
						$('.notiflix-report-message').find('.fa-copy').css(cssToObj("color: gray;transition: .5s;")).click(function(){
							copyText(scriptInfo.greasyforkURL);
						}).hover(function(){
							$(this).css("color","rgb(128, 213, 63)");
						},function(){
							$(this).css("color","gray");
						});
						$('.notiflix-report-message').find('.fa-qq').css(cssToObj("color: gray;transition: .5s;")).click(function(){
							shareToQQ();
						}).hover(function(){
							$(this).css("color","skyblue");
						},function(){
							$(this).css("color","gray");
						});
					},100);
				});
			})();
		})();

		if(typeof(GM.getValue("isFirst")) === "undefined"){
			var message = $("\
				<div class='message'>\
					<i class='fa fa-remove fa-1x'></i>\
					<div class='message-content'>点击可切换背景图</div>\
				</div>\
			").css(cssToObj("\
				position: fixed;\
				top: 88%;left: 70px;\
				padding: 10px;\
				width: 150px;height: 24px;\
				border-radius: 20px 20px 20px 0px;\
				background-color: white;\
				transition: 1s;\
			"));
			message.find('i').css(cssToObj("\
				position: absolute;\
				top: 0px;right: 0px;\
				width: 24px;height: 24px;\
				color: rgb(250,50,50);\
				font-size: 16px;\
				text-align: center;\
				line-height: 24px;\
			")).click(function(){
				GM.setValue("isFirst",true);
				message.css(cssToObj("opacity: 0;"));
				setTimeout(function(){
					message.remove();
				},1000);
			});
			message.find('.message-content').css(cssToObj("\
				position: absolute;\
				font-size: 16PX;\
			"));
			document.body.appendChild(message[0]);
		}
		if(typeof(GM.getValue("backImgSelect")) === "number"){
			setBackgroundImg(backImgNode,GM.getValue("backImgSelect"));
		}
		else{
			console.log(GM.getValue("backImgSelect"));
			setBackgroundImg(backImgNode,0);
		}
		// 	百度油猴菜单注册
		(function(){
			var showFloatWindow = GM.getValue("showFloatWindow");
			if(typeof(showFloatWindow) == "undefined"){
				GM.setValue("showFloatWindow",true);
			}
			function unregisterMenu(){
				var commandId = GM.getValue("commandId");
				if(commandId == "undefined"){
					alert("出现了未知错误");
					return;
				}
				GM.unregisterMenuCommand(commandId);
			}
			function setCommandEnd(commandName){
				GM.setValue("commandId",GM.registerMenuCommand(commandName,function(){
					unregisterMenu();
					if(commandName==="关闭悬浮窗"){
						setCommandEnd("开启悬浮窗");
						$("#floatingWindow").css("display","none");
					}
					else{
						setCommandEnd("关闭悬浮窗");
						$("#floatingWindow").css("display","block");
					}
				}));
			}
			if(showFloatWindow){
				setCommandEnd("关闭悬浮窗");
			}else{
				setCommandEnd("开启悬浮窗");
			}
		})();
	}
	function initThatWordView(){
		const $ = $341;
		//  初始化右下角一言
		(function(){
			var thatWord = $("\
				<div class='thatWord'>\
				<div class='thatWord-content'></div>\
				<div class='thatWord-author'></div>\
				</div>\
			").css(cssToObj("\
				position: fixed;\
				padding: 10px;\
				width: 300px;\
				bottom: 0;right: 0;\
				color: white;\
				user-select: none;\
				font-size: 18px;\
			"));
			thatWord
				.hover(function(){
				var content = this;
				this.copyX = $("<i title='复制文本内容' class='fa fa-copy fa-1x'></i>")
					.click(function(){
					copyText(thatWord.find('.thatWord-content')[0].innerText);
				});
				thatWord.append(this.copyX);
			},function(){
				if(this.copyX){this.copyX.remove();}
			});
			thatWord.find('.thatWord-content').css(cssToObj("width: 100%;float: left;"))[0].innerText = "极致简约,极致设计";
			thatWord.find('.thatWord-author').css(cssToObj("float: right;")).html("—— 一介");
			thatWord.find('.fa-copy').css(cssToObj("position: absolute;top: 10px;right: 10px;"));
			document.body.appendChild(thatWord[0]);
		})();
	}

	function isopenRoute(){
		if(devControler.is()){
			//  开发者模式
			return true;
		}else{
			// 不是开发者模式
			if(routerControler.routerList[routerControler.type].isDev)
				// 不是开发者模式，路径在开发
				return false;
			else
				// 不是开发者模式，路径开发完毕
				return true;
		}
	}
	if(routerControler.type === "Baidu" && isopenRoute()){
		//  init百度的视图
		(function(){
			//  删除不必要的部分
			(function(){
				$('html').css(cssToObj("overflow:hidden;"));
				$('#result_logo').css(cssToObj("display: none;"));
				$('#su').css(cssToObj("display: none;"));
				$('div#u1').css(cssToObj("display: none;"));
				$('div#bottom_layer.s-bottom-layer').css(cssToObj("display: none;"));
				$('div#qrcodeCon').css(cssToObj("display: none;"));
				$('div#s_top_wrap').css(cssToObj("display: none;"));
				$('div#s_upfunc_menus').css(cssToObj("display: none;"));
				$('div#u_sp').css(cssToObj("display: none;"));
				$('#s_wrap').css(cssToObj("display: none;"));
				$('#s-hotsearch-wrapper').css(cssToObj("display: none;"));
				$('#s-top-left').css(cssToObj("display: none;"));
			})();
			//  设置自定义的logo
			(function(){
				$('#lg').css(cssToObj("display: none;"));
				$('body').append("\
				<div id='logoTitle' class='title'>\
					<span style='color: rgb(50, 100, 200);'>B</span>\
					<span style='color: rgb(70, 120, 220);'>a</span>\
					<span style='color: rgb(90, 140, 240);'>i</span>\
					<span style='color: rgb(50, 100, 200);'>d</span>\
					<span style='color: rgb(90, 140, 240);'>u</span>\
				</div>");
				$('#logoTitle').css(cssToObj("\
					position: fixed;\
					top: calc(50% - 150px);\
					pointer-events:none;\
					width: 100%;height: 100px;\
					color:black;\
					font-size: 80px;\
					font-weight: 600;\
					user-select: none;\
					text-align: center;\
					line-height: 100px;\
				"));
			})();
			//  搜索框样式
			(function(){
				$('#form .s_ipt_wr').css(cssToObj("\
					position: fixed;\
					top: calc(50% - 21px);left: calc(50% - 300px);\
					width: 600px;\
					border: 2px solid white;\
					border-radius: 30px;\
					overflow: hidden;\
					background-color: rgba(255,255,255,0);\
					transition: 1s;\
				")).hover(function(){
					$(this).css(cssToObj("\
						border-radius: 4px;\
						box-shadow: 0 0 20px white;\
					"));
				},function(){
					$(this).css(cssToObj("\
						border-radius: 30px;\
						box-shadow: 0 0 0 white;\
					"));
				});
			})();
			//  调整搜索的点击事件
			(function(){
				setTimeout(function(){
					function clearClick(){
						if($._data($("#kw")[0],'events').click && $._data($("#kw")[0],'events').click.length===3){
							$._data($("#kw")[0],'events').click=[];
						}else{
							setTimeout(clearClick,10);
						}
					}
					function clearInputChange(){
						if($._data($("#kw")[0],'events').inputChange && $._data($("#kw")[0],'events').inputChange.length===2){
							$._data($("#kw")[0],'events').inputChange=[];
						}else{
							setTimeout(clearInputChange,10);
						}
					}
					clearClick();
					clearInputChange();
				},10);
				$('#kw')
					.css(cssToObj("padding-left: 20px;color: white;over: white;border: none;background-color: rgba(0,0,0,0);transition: .5s;border: none;"))
					.on("keypress",function(){
						if (event.keyCode === 13) {
							Notiflix.Loading.Init({ backgroundColor:"#ffffff",svgSize:"100px",svgColor:"#05afef",messageFontSize:"20px", });
							Notiflix.Loading.Pulse('搜索中...');
							$(document.body).on('hashchange',function(){
								Notiflix.Loading.Remove(500);
								window.location=window.location;
							});
						}
					})
					.on('input click',function(){
						// 搜索框下方提示
						$().loadedNode('#form .bdsug', function(){
							$(this).css(cssToObj("position: fixed;left: calc(50% - 280px);top: calc(50% + 17px);width: 560px;border-radius: 0 0 16px 16px;"));
						});
					});
			})();
			//  搜图样式
			(function(){
				$().loadedNode('.soutu-btn', function(){
					$(this).addClass('fa fa-camera fa-1x').css(cssToObj("background: none;font-size:16px;color:white;"));
					$('.fa-camera').click(function(){
						$().loadedNode('.soutu-layer', function(){
							$(this).css(cssToObj("position: fixed;position: fixed;top: calc(50% - 21px);left: calc(50% - 320px);width: 640px;"));
							$(this).find('.soutu-url-btn.soutu-url-btn-new').css(cssToObj("display: none;"));
							$(this).find('#soutu-url-kw').parent().css(cssToObj("\
								width: 100%;\
							"));
							$(this).find('#soutu-url-kw').css(cssToObj("\
								width: calc(100% - 36px);\
								border-radius: 10px;\
								border-right: 2px solid #4e6ef2;\
							"));
						});
					});
				});
			})();

			initFloatWindowView($('#head'));
			initThatWordView();
		})();
	}
	else if(routerControler.type === "Google" && isopenRoute()){
		const $ = $341;
		console.log("%c%s", "padding: 10px; border-radius: 10px; color: #fff; background-color: rgb(250,50,50);", "该界面尚处于开发状态");
		// 初始化视图
		(function () {
			// 初始化导航按钮
			(function(){
				$('#gbwa > div > a')
				.removeClass("gb_D gb_tc")
				.addClass("fa fa-navicon  fa-2x")
				.css("color","white");
			})();
			// 删除不必要部分
			(function(){
				$('#searchform.big .FPdoLc').css("display","none");
				$('#SIvCob').css("display","none");
				$('#footer').css("display","none");
			})();
			// 微调样式
			(function(){
				$('#main').css(cssToObj("\
					position: fixed;\
					top: calc(50% - 300px);\
					width: 100%;\
				"));
				$('#searchform').css(cssToObj("\
					position: fixed ;\
					top: 50% ;\
					width: 100% ;\
				"));
			})();

			initFloatWindowView($('#viewport'));
			initThatWordView();
		})();
	}
	else if(routerControler.type === "NetnrImageBed" && isopenRoute()){
		console.log("%c%s", "padding: 10px; border-radius: 10px; color: #fff; background-color: rgb(250,50,50);", "该界面尚处于开发状态");
		return;
	}
	if(isLoad) Notiflix.Loading.Remove(200);
})();