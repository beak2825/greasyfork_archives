function GM_fetch(url, opt={}){
	return new Promise((resolve, reject)=>{
		// https://www.tampermonkey.net/documentation.php?ext=dhdg#GM_xmlhttpRequest
		// https://violentmonkey.github.io/api/gm/#gm_xmlhttprequest
		opt.url = url
		opt.data = opt.body
		opt.responseType = "blob"
		opt.onload = resp=>{
			resolve(new Response(resp.response, {status: resp.status,
				// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders#examples
				headers: Object.fromEntries(resp.responseHeaders.trim().split(/[\r\n]+/).map(line=>{parts=line.split(': ');return [parts.shift(), parts.join(': ')]}))
			}))
		}
		opt.ontimeout = ()=>reject("fetch timeout")
		opt.onerror   = error=>reject(error)
		opt.onabort   = ()=>reject("fetch abort")
		GM_xmlhttpRequest(opt)
	})
}