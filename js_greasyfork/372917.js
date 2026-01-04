;((global, fn) => {
	global.gmfetch = fn(typeof GM === 'undefined' ? {} : GM)
})(this, GM => {
	if (typeof GM_xmlhttpRequest === 'undefined' && typeof GM.xmlHttpRequest === 'undefined') {
		throw new Error('Either GM_xmlhttpRequest or GM.xmlHttpRequest must exists!')
	}
	if (typeof GM_xmlhttpRequest === 'function' && !GM.xmlHttpRequest) {
		GM.xmlHttpRequest = GM_xmlhttpRequest
	}
	const fromEntries = e => e.reduce((acc, [k, v]) => ((acc[k] = v), acc), {})
	const parseHeader = h =>
		fromEntries(
			h
				.split('\n')
				.filter(Boolean)
				.map(l => l.split(':').map(tok => tok.trim()))
		)
	const fetch = (input, init = {}) => {
		if (input instanceof Request) {
			return fetch(input.url, Object.assign({}, input, init))
		}
		return new Promise(res => {
			if (init.headers instanceof Headers) {
				init.headers = fromEntries(Array.from(init.headers.entries()))
			}
			init.data = init.body
			init = Object.assign(
				{
					method: 'GET',
					headers: {}
				},
				init,
				{
					url: input,
					responseType: 'blob'
				}
			)
			GM.xmlHttpRequest(
				Object.assign({}, init, {
					onload: xhr => {
						xhr.headers = parseHeader(xhr.responseHeaders)
						res(new Response(xhr.response, Object.assign({}, init, xhr)))
					},
					onerror: xhr => {
						console.log('err', xhr)
						res(new Response(xhr.response, Object.assign({}, init, xhr)))
					}
				})
			)
		})
	}

	return fetch
})
