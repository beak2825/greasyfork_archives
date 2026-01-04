const ajax = (url, data, opts = {}) => new Promise((resolve, reject) => {
		if (!url) throw new Error('xmlHttpRequest url must exists!')
		var GM = typeof GM === 'undefined' ? {} : GM;
		if (typeof GM_xmlhttpRequest === 'undefined' && typeof GM.xmlHttpRequest === 'undefined') {
			throw new Error('GM_xmlhttpRequest or GM.xmlHttpRequest must exists!')
		}
		if (typeof GM_xmlhttpRequest === 'function' && !GM.xmlHttpRequest) {
			GM.xmlHttpRequest = GM_xmlhttpRequest
		}
		var params = {
			url,
			method: opts.method=='POST'||data ? 'POST' : 'GET',
			synchronous: opts.sync || true,
			responseType: opts.dataType || 'text',
			headers: opts.headers||null
		}
		if(params.method=='POST') params['data']=data;
		//console.log(params);
		var gmReq = GM.xmlHttpRequest || GM_xmlhttpRequest;
		gmReq({
			...params,
			onload(res) {
				//console.log(res)
				if (res.status >= 200 && res.status < 300) {
					resolve(res.response);
				} else {
					reject(res);
				}
			},
			onerror(err) {
				reject(err);
			}
		});
	});