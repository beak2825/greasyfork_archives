// ==UserScript==
// @name         evades.io server list fallbacks
// @namespace    https://evades.io/
// @version      1.0.3.1
// @description  allows you to join servers without having to wait for the api to fetch the server list
// @author       sonic.exe
// @include      /http(?:s)?:\/\/(www\.)?(eu\.)?evades\.(io|online)(:\d+)?\//
// @run-at       document-start
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496868/evadesio%20server%20list%20fallbacks.user.js
// @updateURL https://update.greasyfork.org/scripts/496868/evadesio%20server%20list%20fallbacks.meta.js
// ==/UserScript==
(()=>{new MutationObserver(function(mutations){
        var elem = Array.from(document.querySelectorAll('script')).filter(e=>{return e.src.startsWith(location.href)})[1];
		if(elem){
		var src = elem.src;
    elem.remove()
		elem=document.createElement('script');
		elem.innerHTML=`var akek=new XMLHttpRequest();
		akek.open("GET","${src}",false);
		akek.send();
    var tmp = akek.response;
    tmp=tmp.replace('return this.state.showServerList','var s=this.props;this.state.gameServers??={local:new Array(8).fill(1).map(ts=>([{connected:"--",capacity:100}])),remotes:{"https://eu.evades.io":new Array(8).fill(1).map(ts=>([{connected:"--",capacity:100}]))}};this.state.gameServers.remotes["https://eu.evades.io"]??=new Array(8).fill(1).map(ts=>([{connected:"--",capacity:100}]));window.playServer=function(v){s.play(v.slice(0,2)=="NA"?null:"eu.evades.io", parseInt(v.slice(2))-1, 0)};return this.state.showServerList')
	  var t=document.createElement('script');
    t.type="module";
		t.text=tmp;
    document.body.appendChild(t);`;
		document.body.appendChild(elem);
		this.disconnect();
        }
}).observe(document, {childList: true, subtree: true});
})()